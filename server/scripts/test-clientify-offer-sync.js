import assert from 'node:assert/strict'

process.env.CLIENTIFY_API_KEY = 'test-key'
process.env.DB_DIR ||= `data/test-clientify-offer-sync-${process.pid}`

let contactPayload
let dealPayload
globalThis.fetch = async (url, options = {}) => {
  const parsed = new URL(url)
  if (parsed.pathname === '/v2/products/' && (!options.method || options.method === 'GET')) {
    return new Response(JSON.stringify({ results: [{ id: 77, name: 'Lifeguard', sku: 'WT-77', price: 1250, currency: 'USD', active: true }], next: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  if (parsed.pathname === '/v2/contacts/' && options.method === 'POST') {
    contactPayload = JSON.parse(options.body)
    return new Response(JSON.stringify({ id: 501 }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  }
  if (parsed.pathname === '/v2/deals/' && (!options.method || options.method === 'GET')) {
    return new Response(JSON.stringify({ results: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  if (parsed.pathname === '/v2/deals/' && options.method === 'POST') {
    dealPayload = JSON.parse(options.body)
    return new Response(JSON.stringify({ id: 601 }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  }
  throw new Error(`Solicitud inesperada: ${options.method || 'GET'} ${url}`)
}

const { getDb, nowIso } = await import('../db.js')
const { syncClientifyProducts, syncOfferApplicationToClientify } = await import('../lib/clientifyOffers.js')
const db = getDb()
const now = nowIso()

const offer = db.prepare(
  `INSERT INTO job_offers
    (slug,title,program,sponsor,employer,compensation_type,compensation_min,compensation_currency,compensation_period,english_level,city,state,offer_type,vacancies_total,available_until,clientify_product_id,clientify_product_name,clientify_product_sku,status,created_at,updated_at)
   VALUES ('lifeguard-demo','Lifeguard','work-travel-usa','Sponsor Demo','Hotel Demo','salary',15,'USD','hour','Intermedio','Orlando','Florida','Hotel',3,'2027-12-31T23:59:59.000Z',NULL,'','','active',?,?)`,
).run(now, now)
const productSync = await syncClientifyProducts()
const linkedOffer = db.prepare('SELECT clientify_product_id,clientify_product_name FROM job_offers WHERE id=?').get(offer.lastInsertRowid)
assert.equal(productSync.products, 1)
assert.equal(productSync.linked, 1)
assert.equal(linkedOffer.clientify_product_id, '77')
const application = db.prepare(
  `INSERT INTO job_applications
    (participant_id,offer_id,status,source,travel_start_date,travel_end_date,participant_email,participant_first_name,participant_last_name,selected_product_id,selected_product_name,selected_product_sku,selected_product_price,selected_product_currency,clientify_sync_status,clientify_next_attempt_at,applied_at)
   VALUES ('student-1',?,'active','participant','2027-05-20','2027-09-10','ana@example.com','Ana','Prueba','77','Lifeguard','WT-77',1250,'USD','pending',?,?)`,
).run(offer.lastInsertRowid, now, now)

const result = await syncOfferApplicationToClientify(application.lastInsertRowid)
const saved = db.prepare('SELECT * FROM job_applications WHERE id=?').get(application.lastInsertRowid)

assert.equal(result.status, 'synced')
assert.equal(saved.clientify_contact_id, '501')
assert.equal(saved.clientify_deal_id, '601')
assert.equal(saved.clientify_sync_status, 'synced')
assert.equal(contactPayload.email, 'ana@example.com')
assert.ok(contactPayload.tags.includes('oferta_elegida'))
assert.match(contactPayload.message, /2027-05-20/)
assert.match(contactPayload.message, /2027-09-10/)
assert.equal(dealPayload.contact_id, 501)
assert.equal(dealPayload.products[0].product_id, 77)
assert.equal(dealPayload.products[0].price, 1250)
assert.match(dealPayload.name, new RegExp(`\\[BBBSC-APP-${application.lastInsertRowid}\\]`))

console.log(JSON.stringify({ productsSynchronized: true, offerAutoLinked: true, contactUpdated: true, datesSent: true, tagAdded: true, dealCreated: true, productAttached: true, durableStatus: true }))
