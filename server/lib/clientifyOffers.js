import { getDb, nowIso } from '../db.js'
import { buildClientifyPayload } from './clientifyPayload.js'
import { getFormDefinition } from './formDefinitions.js'
import { createClientifyDeal, findClientifyDealByApplication, getAllClientifyProducts, upsertClientifyContact } from './clientify.js'

const APPLICATION_FORM = getFormDefinition('offer_application')
const RETRY_BASE_MS = 5 * 60 * 1000
const MAX_RETRY_MS = 24 * 60 * 60 * 1000

export function normalizeProductMatch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function uniqueProductMatch(offer, products) {
  const slug = normalizeProductMatch(offer.slug)
  const names = new Set([
    normalizeProductMatch(offer.title),
    normalizeProductMatch(`${offer.title} ${offer.employer}`),
    normalizeProductMatch(`${offer.employer} ${offer.title}`),
  ])
  const matches = products.filter((product) => {
    if (!product.active) return false
    const sku = normalizeProductMatch(product.sku)
    return (sku && (sku === slug || sku === `bbbsc ${offer.id}` || sku === String(offer.id))) || names.has(normalizeProductMatch(product.name))
  })
  return matches.length === 1 ? matches[0] : null
}

export async function syncClientifyProducts() {
  const products = await getAllClientifyProducts()
  const db = getDb()
  const timestamp = nowIso()
  db.exec('BEGIN IMMEDIATE')
  try {
    db.prepare('DELETE FROM clientify_products').run()
    const insert = db.prepare(
      `INSERT INTO clientify_products (id,name,sku,price,currency,description,active,raw_json,synced_at)
       VALUES (?,?,?,?,?,?,?,?,?)`,
    )
    for (const product of products) {
      insert.run(product.id, product.name, product.sku, product.price, product.currency, product.description, product.active ? 1 : 0, JSON.stringify(product.raw), timestamp)
    }

    const productById = new Map(products.filter((product) => product.active).map((product) => [product.id, product]))
    const offers = db.prepare('SELECT id,slug,title,employer,clientify_product_id FROM job_offers').all()
    let linked = 0
    let autoLinked = 0
    for (const offer of offers) {
      let product = offer.clientify_product_id ? productById.get(String(offer.clientify_product_id)) : null
      if (!product) product = uniqueProductMatch(offer, products)
      if (product) {
        linked += 1
        if (!offer.clientify_product_id) autoLinked += 1
        db.prepare(
          'UPDATE job_offers SET clientify_product_id=?,clientify_product_name=?,clientify_product_sku=?,clientify_synced_at=? WHERE id=?',
        ).run(product.id, product.name, product.sku, timestamp, offer.id)
      } else if (offer.clientify_product_id) {
        db.prepare("UPDATE job_offers SET clientify_product_id=NULL,clientify_product_name='',clientify_product_sku='',clientify_synced_at=? WHERE id=?").run(timestamp, offer.id)
      }
    }
    db.exec('COMMIT')
    return { products: products.length, linked, autoLinked, unlinked: Math.max(0, offers.length - linked), syncedAt: timestamp }
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export function getCachedClientifyProducts() {
  return getDb().prepare('SELECT id,name,sku,price,currency,description,active,synced_at FROM clientify_products ORDER BY active DESC,name COLLATE NOCASE').all()
    .map((row) => ({ id: row.id, name: row.name, sku: row.sku, price: row.price, currency: row.currency, description: row.description, active: row.active === 1, syncedAt: row.synced_at }))
}

function applicationRecord(applicationId) {
  return getDb().prepare(
    `SELECT a.*,o.title,o.slug,o.program,o.sponsor,o.employer,o.city,o.state,o.compensation_min,o.compensation_currency,
            COALESCE(a.selected_product_id,o.clientify_product_id) AS sync_product_id,
            COALESCE(a.selected_product_name,o.clientify_product_name) AS sync_product_name,
            COALESCE(a.selected_product_sku,o.clientify_product_sku) AS sync_product_sku,
            COALESCE(a.selected_product_price,p.price,0) AS sync_product_price,
            COALESCE(a.selected_product_currency,p.currency,o.compensation_currency,'USD') AS sync_product_currency
       FROM job_applications a
       JOIN job_offers o ON o.id=a.offer_id
       LEFT JOIN clientify_products p ON p.id=o.clientify_product_id
      WHERE a.id=?`,
  ).get(applicationId)
}

function retryDate(attempts) {
  const delay = Math.min(MAX_RETRY_MS, RETRY_BASE_MS * (2 ** Math.max(0, attempts - 1)))
  return new Date(Date.now() + delay).toISOString()
}

function clientifyId(value) {
  if (value?.id !== undefined && value?.id !== null) return String(value.id)
  const match = String(value?.url || '').match(/\/(\d+)\/?$/)
  return match?.[1] || ''
}

export async function syncOfferApplicationToClientify(applicationId) {
  const db = getDb()
  let record = applicationRecord(applicationId)
  if (!record || record.status !== 'active') return { status: 'skipped' }
  if (record.clientify_sync_status === 'synced' && record.clientify_deal_id) return { status: 'synced', dealId: record.clientify_deal_id }
  if (record.clientify_sync_status === 'syncing' && record.clientify_next_attempt_at && record.clientify_next_attempt_at > nowIso()) return { status: 'syncing' }
  if (!record.sync_product_id) throw new Error('offer_without_clientify_product')
  if (!record.participant_email) throw new Error('application_without_participant_email')

  const claimed = db.prepare(
    `UPDATE job_applications
        SET clientify_sync_status='syncing',clientify_sync_attempts=clientify_sync_attempts+1,clientify_sync_error=NULL,clientify_next_attempt_at=?
      WHERE id=? AND (
        clientify_sync_status IN ('pending','failed')
        OR (clientify_sync_status='syncing' AND (clientify_next_attempt_at IS NULL OR clientify_next_attempt_at<=?))
      )`,
  ).run(new Date(Date.now() + 10 * 60 * 1000).toISOString(), applicationId, nowIso())
  if (!claimed.changes) return { status: record.clientify_sync_status }

  try {
    record = applicationRecord(applicationId)
    const participantName = `${record.participant_first_name || ''} ${record.participant_last_name || ''}`.trim() || record.participant_email
    const applicationKey = `[BBBSC-APP-${record.id}]`
    const message = `${participantName} acaba de aplicar a la oferta ${record.title} de ${record.employer}. Fecha prevista de inicio del viaje: ${record.travel_start_date}. Fecha prevista de regreso: ${record.travel_end_date}. ${applicationKey}`

    let contactId = record.clientify_contact_id
    if (!contactId) {
      const contactPayload = buildClientifyPayload(APPLICATION_FORM, {
        firstName: record.participant_first_name,
        lastName: record.participant_last_name,
        email: record.participant_email,
        travelStartDate: record.travel_start_date,
        travelEndDate: record.travel_end_date,
        offerName: `${record.title} · ${record.employer}`,
        clientifyProductName: record.sync_product_name,
        interestTag: 'oferta_elegida',
        message,
        contactSource: 'Portal de ofertas BBBSC',
      })
      contactPayload.tags = [...new Set([...(contactPayload.tags || []), 'oferta_elegida'])]
      contactPayload.message = message
      const contact = await upsertClientifyContact(contactPayload)
      contactId = clientifyId(contact)
      if (!contactId) throw new Error('clientify_contact_without_id')
      db.prepare('UPDATE job_applications SET clientify_contact_id=? WHERE id=?').run(contactId, applicationId)
    }

    let dealId = record.clientify_deal_id
    if (!dealId) {
      const existing = await findClientifyDealByApplication(applicationId)
      dealId = clientifyId(existing)
      if (!dealId) {
        const productPrice = Number(record.sync_product_price || 0)
        const productCurrency = String(record.sync_product_currency || record.compensation_currency || 'USD').toUpperCase().slice(0, 3)
        const dealPayload = {
          name: `${applicationKey} ${record.title} · ${participantName}`,
          amount: productPrice,
          currency: productCurrency,
          expected_closed_date: record.travel_start_date,
          contact_id: Number.isNaN(Number(contactId)) ? contactId : Number(contactId),
          products: [{ product_id: Number.isNaN(Number(record.sync_product_id)) ? record.sync_product_id : Number(record.sync_product_id), price: productPrice, quantity: 1 }],
        }
        const pipelineId = Number(process.env.CLIENTIFY_OFFERS_PIPELINE_ID)
        const pipelineStageId = Number(process.env.CLIENTIFY_OFFERS_PIPELINE_STAGE_ID)
        if (Number.isInteger(pipelineId) && pipelineId > 0) dealPayload.pipeline_id = pipelineId
        if (Number.isInteger(pipelineStageId) && pipelineStageId > 0) dealPayload.pipeline_stage_id = pipelineStageId
        const deal = await createClientifyDeal(dealPayload)
        dealId = clientifyId(deal)
      }
      if (!dealId) throw new Error('clientify_deal_without_id')
      db.prepare('UPDATE job_applications SET clientify_deal_id=? WHERE id=?').run(dealId, applicationId)
    }

    const syncedAt = nowIso()
    db.prepare(
      `UPDATE job_applications
          SET clientify_sync_status='synced',clientify_sync_error=NULL,clientify_next_attempt_at=NULL,clientify_synced_at=?
        WHERE id=?`,
    ).run(syncedAt, applicationId)
    return { status: 'synced', contactId, dealId, syncedAt }
  } catch (error) {
    const current = applicationRecord(applicationId)
    const attempts = Number(current?.clientify_sync_attempts || 1)
    const reason = String(error instanceof Error ? error.message : error).slice(0, 500)
    db.prepare(
      `UPDATE job_applications
          SET clientify_sync_status='failed',clientify_sync_error=?,clientify_next_attempt_at=?
        WHERE id=?`,
    ).run(reason, retryDate(attempts), applicationId)
    throw error
  }
}

export async function processPendingClientifyOfferSyncs(limit = 10) {
  const due = getDb().prepare(
    `SELECT id FROM job_applications
      WHERE status='active'
        AND participant_email IS NOT NULL
        AND clientify_sync_status IN ('pending','failed','syncing')
        AND (clientify_next_attempt_at IS NULL OR clientify_next_attempt_at<=?)
      ORDER BY applied_at ASC LIMIT ?`,
  ).all(nowIso(), limit)
  for (const { id } of due) {
    try { await syncOfferApplicationToClientify(id) }
    catch (error) { console.error(`[bbbsc-server] Clientify pendiente para aplicación ${id}:`, error instanceof Error ? error.message : error) }
  }
  return due.length
}

export function startClientifyOfferSyncWorker() {
  const runQueue = () => processPendingClientifyOfferSyncs().catch((error) => console.error('[bbbsc-server] Error procesando cola de Clientify:', error))
  const refreshProducts = () => syncClientifyProducts().catch((error) => console.error('[bbbsc-server] Error sincronizando productos de Clientify:', error))
  const firstQueue = setTimeout(runQueue, 15_000)
  const firstProducts = setTimeout(refreshProducts, 30_000)
  const queueInterval = setInterval(runQueue, 5 * 60 * 1000)
  const productsInterval = setInterval(refreshProducts, 6 * 60 * 60 * 1000)
  firstQueue.unref?.(); firstProducts.unref?.(); queueInterval.unref?.(); productsInterval.unref?.()
}
