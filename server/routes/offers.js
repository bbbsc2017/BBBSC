import { Router } from 'express'
import multer from 'multer'
import { getDb, nowIso } from '../db.js'
import { requireAuth, requirePermission } from '../auth.js'
import { PERMISSIONS } from '../lib/permissions.js'
import { slugify, uniqueSlug } from '../lib/slugify.js'
import { getUsers } from '../lib/bbbscApi.js'
import { analyzeStoredPdf, downloadPdf, extractPdfText, inferOfferFields, MAX_PDF_BYTES, safeStoredPdfPath } from '../lib/offerPdfs.js'
import { getCachedClientifyProducts, syncClientifyProducts, syncOfferApplicationToClientify } from '../lib/clientifyOffers.js'
import {
  listOffers as listCentralOffers,
  getOfferBySlug as getCentralOfferBySlug,
  getMyCurrentOffer,
  applyToOffer,
  OffersApiError,
} from '../lib/offersApi.js'

export const publicOffersRouter = Router()
export const adminOffersRouter = Router()
const CENTRAL_API_URL = (process.env.BBBSC_API_URL || 'https://api.bbbsc.com').replace(/\/$/, '')

const PROGRAMS = ['work-travel-usa', 'work-travel-asia', 'trainee-internship', 'teacher-assistant', 'teacher-exchange']
const STATUSES = ['draft', 'active', 'closed']
const PERIODS = ['hour', 'week', 'month', 'year', 'program']
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')),
})

function availableExpression(alias = 'o') {
  return `MAX(0, ${alias}.vacancies_total - ${alias}.vacancies_lost - (SELECT COUNT(*) FROM job_applications a WHERE a.offer_id = ${alias}.id AND a.status = 'active'))`
}

function toOffer(row, { privateFields = false } = {}) {
  const vacanciesAvailable = Number(row.vacancies_available ?? 0)
  const status = row.status === 'active' && (new Date(row.available_until) < new Date() || vacanciesAvailable < 1) ? 'closed' : row.status
  return {
    id: row.id, slug: row.slug, title: row.title, program: row.program, sponsor: row.sponsor, employer: row.employer,
    compensationType: row.compensation_type, compensationMin: row.compensation_min, compensationMax: row.compensation_max,
    compensationCurrency: row.compensation_currency, compensationPeriod: row.compensation_period, hasTips: row.has_tips === 1,
    englishLevel: row.english_level, city: row.city, state: row.state, offerType: row.offer_type,
    airportPickup: row.airport_pickup === 1, overtime: row.overtime === 1, bonuses: row.bonuses,
    vacanciesTotal: row.vacancies_total, vacanciesLost: row.vacancies_lost, vacanciesAvailable,
    availableUntil: row.available_until, imageSrc: row.image_src, description: row.description, status,
    hasPdf: Boolean(row.pdf_file_name), pdfViewUrl: row.pdf_file_name ? `/api/offers/${encodeURIComponent(row.slug)}/pdf` : null,
    clientifyProductLinked: Boolean(row.clientify_product_id),
    ...(privateFields ? {
      storedStatus: row.status, pdfSourceUrl: row.pdf_source_url, pdfFileName: row.pdf_file_name, pdfText: row.pdf_text,
      clientifyProductId: row.clientify_product_id, clientifyProductName: row.clientify_product_name,
      clientifyProductSku: row.clientify_product_sku, clientifySyncedAt: row.clientify_synced_at,
    } : {}),
    createdAt: row.created_at, updatedAt: row.updated_at,
  }
}

function selectOffers(where = '', params = [], order = 'o.updated_at DESC') {
  return getDb().prepare(`SELECT o.*, ${availableExpression('o')} AS vacancies_available FROM job_offers o ${where} ORDER BY ${order}`).all(...params)
}

function validateOffer(body) {
  const required = ['title', 'program', 'sponsor', 'employer', 'compensationType', 'compensationMin', 'compensationCurrency', 'compensationPeriod', 'englishLevel', 'city', 'state', 'offerType', 'vacanciesTotal', 'availableUntil']
  const missing = required.filter((key) => body?.[key] === undefined || body?.[key] === null || String(body[key]).trim() === '')
  if (missing.length) return 'Completa todos los campos obligatorios.'
  if (!PROGRAMS.includes(body.program)) return 'El programa no es válido.'
  if (!['salary', 'stipend'].includes(body.compensationType)) return 'El tipo de compensación no es válido.'
  if (!PERIODS.includes(body.compensationPeriod)) return 'El periodo de compensación no es válido.'
  if (!STATUSES.includes(body.status || 'draft')) return 'El estado no es válido.'
  const minimum = Number(body.compensationMin)
  const maximum = body.compensationMax === '' || body.compensationMax == null ? null : Number(body.compensationMax)
  if (!Number.isFinite(minimum) || minimum < 0 || (maximum !== null && (!Number.isFinite(maximum) || maximum < minimum))) return 'El rango de salario no es válido.'
  const vacancies = Number(body.vacanciesTotal)
  if (!Number.isInteger(vacancies) || vacancies < 0) return 'La cantidad de vacantes no es válida.'
  if (Number.isNaN(new Date(body.availableUntil).getTime())) return 'La fecha de disponibilidad no es válida.'
  return null
}

function offerValues(body, existing = {}) {
  const requestedProductId = Object.hasOwn(body, 'clientifyProductId') ? body.clientifyProductId : existing.clientify_product_id
  const productId = String(requestedProductId ?? '').trim()
  const product = productId ? getDb().prepare('SELECT id,name,sku FROM clientify_products WHERE id=? AND active=1').get(productId) : null
  return {
    title: String(body.title).trim(), program: body.program, sponsor: String(body.sponsor).trim(), employer: String(body.employer).trim(),
    compensationType: body.compensationType, compensationMin: Number(body.compensationMin),
    compensationMax: body.compensationMax === '' || body.compensationMax == null ? null : Number(body.compensationMax),
    compensationCurrency: String(body.compensationCurrency).trim().toUpperCase().slice(0, 3), compensationPeriod: body.compensationPeriod,
    hasTips: body.hasTips ? 1 : 0, englishLevel: String(body.englishLevel).trim(), city: String(body.city).trim(), state: String(body.state).trim(),
    offerType: String(body.offerType).trim(), airportPickup: body.airportPickup ? 1 : 0, overtime: body.overtime ? 1 : 0,
    bonuses: String(body.bonuses || '').trim(), vacanciesTotal: Number(body.vacanciesTotal), availableUntil: new Date(body.availableUntil).toISOString(),
    imageSrc: String(body.imageSrc || '').trim(), description: String(body.description || '').trim(), status: body.status || existing.status || 'draft',
    pdfSourceUrl: String(body.pdfSourceUrl ?? existing.pdf_source_url ?? '').trim(),
    pdfFileName: String(body.pdfFileName ?? existing.pdf_file_name ?? '').trim(),
    pdfText: String(body.pdfText ?? existing.pdf_text ?? ''),
    pdfExtractedData: JSON.stringify(body.pdfExtractedData || (() => { try { return JSON.parse(existing.pdf_extracted_data || '{}') } catch { return {} } })()),
    clientifyProductId: product?.id || null,
    clientifyProductName: product?.name || '',
    clientifyProductSku: product?.sku || '',
  }
}

function todayInBogota() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function validateTravelDates(startDate, endDate, today = todayInBogota()) {
  const isoDate = /^\d{4}-\d{2}-\d{2}$/
  if (!isoDate.test(String(startDate || '')) || !isoDate.test(String(endDate || ''))) return 'Selecciona las dos fechas de viaje.'
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate}T00:00:00Z`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start.toISOString().slice(0, 10) !== startDate || end.toISOString().slice(0, 10) !== endDate) return 'Las fechas de viaje no son válidas.'
  if (startDate < today) return 'La fecha de inicio del viaje no puede estar en el pasado.'
  if (endDate <= startDate) return 'La fecha de regreso debe ser posterior a la fecha de inicio.'
  const maxEnd = new Date(start); maxEnd.setUTCFullYear(maxEnd.getUTCFullYear() + 3)
  if (end > maxEnd) return 'El rango del viaje no puede superar tres años.'
  return null
}

// ─────────────────────────────────────────────────────────────────────────
// Adaptador API central → shape legacy (público)
//
// bbbsc.com (este backend) ya no es la fuente de verdad para ofertas: eso
// vive en la API central (api.bbbsc.com / Postgres). Las rutas PÚBLICAS de
// abajo llaman a la API central y traducen su respuesta al mismo shape que
// ya devolvía toOffer() con SQLite, para que el frontend compilado (del que
// no tenemos el código fuente) siga funcionando sin cambios.
//
// Las rutas ADMIN de este archivo (CRUD, Clientify products, asignación
// manual) NO se tocan — siguen usando SQLite local, confirmado que ya no se
// usan pero se dejan intactas por ahora.
// ─────────────────────────────────────────────────────────────────────────

function adaptCentralOffer(o) {
  if (!o) return null
  const pdfViewUrl = o.pdfViewUrl
    ? new URL(o.pdfViewUrl, `${CENTRAL_API_URL}/`).toString()
    : null
  return {
    id: o.id,
    slug: o.slug,
    title: o.title,
    program: o.programSlug ?? o.program ?? null,
    sponsor: o.sponsor,
    employer: o.employer ?? o.empleador,
    compensationType: o.compensationType,
    compensationMin: o.compensationMin,
    compensationMax: o.compensationMax,
    compensationCurrency: o.compensationCurrency,
    compensationPeriod: o.compensationPeriod,
    hasTips: Boolean(o.hasTips),
    englishLevel: o.englishLevel ?? o.nivelIngles,
    city: o.city ?? o.ciudad,
    state: o.state ?? o.estado,
    offerType: o.offerType ?? o.tipoOferta,
    airportPickup: Boolean(o.airportPickup),
    overtime: Boolean(o.overtime ?? o.extraHours),
    bonuses: o.bonuses ?? '',
    vacanciesTotal: o.vacanciesTotal,
    vacanciesLost: o.vacanciesLost,
    vacanciesAvailable: o.vacanciesAvailable,
    availableUntil: o.availableUntil,
    imageSrc: o.imageSrc ?? o.imageMain,
    description: o.description,
    status: o.status,
    hasPdf: Boolean(pdfViewUrl),
    pdfViewUrl,
    // La API central ya no tiene el concepto de "producto" de Clientify por
    // oferta (esa dependencia se quitó a propósito) — se deja fijo en true
    // porque el frontend compilado de bbbsc.com todavía revisa este campo
    // antes de dejar postularse, y no tenemos su código fuente para quitar
    // esa validación del lado del cliente.
    clientifyProductLinked: true,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }
}

// Cache corta en memoria: el listado público se pide seguido (cada carga de
// /ofertas) y no necesita estar al segundo — evita pegarle a la API central
// por las 163+ ofertas en cada request. El detalle por slug se deja sin
// cache (una sola oferta, se pide poco comparado con el listado completo).
let offersCache = { data: null, expiresAt: 0 }
const OFFERS_CACHE_TTL_MS = 30_000

async function fetchPublicCentralOffers() {
  if (offersCache.data && offersCache.expiresAt > Date.now()) return offersCache.data
  const central = await listCentralOffers()
  const offers = Array.isArray(central?.offers) ? central.offers : []
  const adapted = offers.filter((o) => o.status === 'active' || o.status === 'closed').map(adaptCentralOffer)
  offersCache = { data: adapted, expiresAt: Date.now() + OFFERS_CACHE_TTL_MS }
  return adapted
}

function centralErrorResponse(res, error, fallbackMessage) {
  const status = error instanceof OffersApiError && error.status >= 400 && error.status < 600 ? error.status : 502
  const message = error instanceof OffersApiError && error.message ? error.message : fallbackMessage
  return res.status(status).json({ ok: false, error: message })
}

publicOffersRouter.get('/offers', async (req, res) => {
  try {
    const allOffers = await fetchPublicCentralOffers()
    const facets = Array.from(
      new Map(allOffers.map((o) => [`${o.program}|${o.city}|${o.sponsor}`, { program: o.program, city: o.city, sponsor: o.sponsor }])).values(),
    )

    let offers = allOffers
    if (PROGRAMS.includes(req.query.program)) offers = offers.filter((o) => o.program === req.query.program)
    if (req.query.search?.trim()) {
      const term = req.query.search.trim().toLowerCase()
      offers = offers.filter((o) => o.title?.toLowerCase().includes(term) || o.employer?.toLowerCase().includes(term))
    }
    if (req.query.city?.trim()) {
      const term = req.query.city.trim().toLowerCase()
      offers = offers.filter((o) => o.city?.toLowerCase().includes(term))
    }
    if (req.query.sponsor?.trim()) {
      const term = req.query.sponsor.trim().toLowerCase()
      offers = offers.filter((o) => o.sponsor?.toLowerCase().includes(term))
    }
    const minSalary = Number(req.query.minSalary)
    if (Number.isFinite(minSalary) && req.query.minSalary !== '') {
      offers = offers.filter((o) => Number(o.compensationMax ?? o.compensationMin ?? 0) >= minSalary)
    }
    const maxSalary = Number(req.query.maxSalary)
    if (Number.isFinite(maxSalary) && req.query.maxSalary !== '') {
      offers = offers.filter((o) => Number(o.compensationMin ?? 0) <= maxSalary)
    }

    offers = [...offers].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1
      return new Date(b.availableUntil).getTime() - new Date(a.availableUntil).getTime()
    })

    return res.json({ ok: true, offers, facets })
  } catch (error) {
    console.error('[bbbsc-server] Error consultando ofertas en la API central:', error)
    return centralErrorResponse(res, error, 'No pudimos cargar las ofertas en este momento.')
  }
})

publicOffersRouter.get('/offers/:slug', async (req, res, next) => {
  if (req.params.slug === 'me') return next()
  try {
    const central = await getCentralOfferBySlug(req.params.slug)
    if (!central || !['active', 'closed'].includes(central.status)) {
      return res.status(404).json({ ok: false, error: 'Oferta no encontrada.' })
    }
    return res.json({ ok: true, offer: adaptCentralOffer(central) })
  } catch (error) {
    if (error instanceof OffersApiError && error.status === 404) {
      return res.status(404).json({ ok: false, error: 'Oferta no encontrada.' })
    }
    console.error('[bbbsc-server] Error consultando oferta en la API central:', error)
    return centralErrorResponse(res, error, 'No pudimos cargar la oferta en este momento.')
  }
})

publicOffersRouter.get('/offers/:slug/pdf', (req, res) => {
  const row = getDb().prepare("SELECT slug, title, pdf_file_name FROM job_offers WHERE slug = ? AND status IN ('active', 'closed')").get(req.params.slug)
  if (!row) return res.status(404).json({ ok: false, error: 'Documento no encontrado.' })
  const filePath = safeStoredPdfPath(row.pdf_file_name)
  if (!filePath) return res.status(404).json({ ok: false, error: 'El PDF todavía no está disponible.' })
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="documento-oferta-bbbsc.pdf"',
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'self'",
  })
  return res.sendFile(filePath)
})

publicOffersRouter.get('/offers/me', requireAuth, async (req, res) => {
  try {
    const central = await getMyCurrentOffer(req.bbbscAccessToken)
    const application = central?.application
      ? { ...central.application, offer: adaptCentralOffer(central.application.offer) }
      : null
    return res.json({ ok: true, application })
  } catch (error) {
    console.error('[bbbsc-server] Error consultando mi postulación en la API central:', error)
    return centralErrorResponse(res, error, 'No pudimos consultar tu postulación en este momento.')
  }
})

publicOffersRouter.post('/offers/:id/apply', requireAuth, async (req, res) => {
  if (req.user.role !== 'STUDENT') return res.status(403).json({ ok: false, error: 'Solo los participantes activos pueden aplicar a una oferta.' })
  const dateError = validateTravelDates(req.body?.travelStartDate, req.body?.travelEndDate)
  if (dateError) return res.status(400).json({ ok: false, error: dateError })
  try {
    const central = await applyToOffer(req.bbbscAccessToken, req.params.id, {
      travelStartDate: req.body.travelStartDate,
      travelEndDate: req.body.travelEndDate,
    })
    const application = central?.application
      ? { ...central.application, offer: adaptCentralOffer(central.application.offer) }
      : null
    return res.status(201).json({ ok: true, application })
  } catch (error) {
    console.error('[bbbsc-server] Error aplicando a oferta vía API central:', error)
    return centralErrorResponse(res, error, 'No pudimos registrar la aplicación.')
  }
})

adminOffersRouter.get('/clientify/products', requirePermission(PERMISSIONS.OFFERS_VIEW), (_req, res) => {
  const products = getCachedClientifyProducts()
  return res.json({ ok: true, products, syncedAt: products[0]?.syncedAt || null })
})

adminOffersRouter.post('/clientify/products/sync', requirePermission(PERMISSIONS.OFFERS_MANAGE), async (_req, res) => {
  try { return res.json({ ok: true, ...(await syncClientifyProducts()), productsList: getCachedClientifyProducts() }) }
  catch (error) {
    console.error('[bbbsc-server] Error sincronizando productos:', error)
    if (error?.status === 403) return res.status(403).json({ ok: false, error: 'La clave de Clientify puede gestionar contactos, pero no tiene acceso a Productos y Oportunidades. Genera la clave desde un usuario habilitado como usuario de Ventas en la cuenta de BBBSC.' })
    return res.status(error?.status === 401 ? 401 : 502).json({ ok: false, error: 'No pudimos sincronizar los productos de Clientify. Revisa la conexión e intenta nuevamente.' })
  }
})

adminOffersRouter.post('/applications/:id/clientify/retry', requirePermission(PERMISSIONS.OFFERS_MANAGE), async (req, res) => {
  const application = getDb().prepare('SELECT id FROM job_applications WHERE id=?').get(Number(req.params.id))
  if (!application) return res.status(404).json({ ok: false, error: 'Aplicación no encontrada.' })
  try { return res.json({ ok: true, sync: await syncOfferApplicationToClientify(application.id) }) }
  catch { return res.status(502).json({ ok: false, error: 'La aplicación sigue pendiente de sincronización con Clientify.' }) }
})

adminOffersRouter.get('/offers', requirePermission(PERMISSIONS.OFFERS_VIEW), (_req, res) => res.json({ ok: true, offers: selectOffers().map((row) => toOffer(row, { privateFields: true })) }))

adminOffersRouter.get('/offers/:id', requirePermission(PERMISSIONS.OFFERS_VIEW), (req, res) => {
  const row = selectOffers('WHERE o.id = ?', [Number(req.params.id)])[0]
  if (!row) return res.status(404).json({ ok: false, error: 'Oferta no encontrada.' })
  return res.json({ ok: true, offer: toOffer(row, { privateFields: true }) })
})

adminOffersRouter.post('/offers/extract-pdf-url', requirePermission(PERMISSIONS.OFFERS_MANAGE), async (req, res) => {
  try {
    const sourceUrl = String(req.body?.url || '').trim()
    if (!sourceUrl) return res.status(400).json({ ok: false, error: 'Ingresa la URL del PDF.' })
    const downloaded = await downloadPdf(sourceUrl)
    const text = await extractPdfText(downloaded.buffer)
    if (!text) return res.status(422).json({ ok: false, error: 'El PDF no contiene texto legible. Puede ser un documento escaneado.' })
    const analysis = inferOfferFields(text)
    return res.json({ ok: true, analysis: { ...analysis, pdfSourceUrl: downloaded.sourceUrl, pdfFileName: downloaded.fileName, pdfText: text } })
  } catch (error) {
    console.error('[bbbsc-server] Error importando PDF por URL:', error)
    return res.status(400).json({ ok: false, error: error instanceof Error ? error.message : 'No pudimos procesar el PDF.' })
  }
})

adminOffersRouter.post('/offers/extract-pdf', requirePermission(PERMISSIONS.OFFERS_MANAGE), (req, res) => {
  pdfUpload.single('file')(req, res, async (uploadError) => {
    if (uploadError instanceof multer.MulterError && uploadError.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ ok: false, error: 'El PDF supera el tamaño máximo permitido (25 MB).' })
    if (uploadError || !req.file) return res.status(400).json({ ok: false, error: 'Selecciona un archivo PDF válido.' })
    try {
      const analysis = await analyzeStoredPdf(req.file.buffer)
      return res.json({ ok: true, analysis: { fields: analysis.fields, detected: analysis.detected, confidence: analysis.confidence, warnings: analysis.warnings, pdfSourceUrl: '', pdfFileName: analysis.fileName, pdfText: analysis.text } })
    } catch (error) {
      return res.status(400).json({ ok: false, error: error instanceof Error ? error.message : 'No pudimos procesar el PDF.' })
    }
  })
})

adminOffersRouter.post('/offers', requirePermission(PERMISSIONS.OFFERS_MANAGE), (req, res) => {
  const error = validateOffer(req.body)
  if (error) return res.status(400).json({ ok: false, error })
  const db = getDb(); const values = offerValues(req.body); const timestamp = nowIso()
  const slug = uniqueSlug(slugify(req.body.slug || values.title), (candidate) => !!db.prepare('SELECT id FROM job_offers WHERE slug = ?').get(candidate))
  const result = db.prepare(
    `INSERT INTO job_offers (slug,title,program,sponsor,employer,compensation_type,compensation_min,compensation_max,compensation_currency,compensation_period,has_tips,english_level,city,state,offer_type,airport_pickup,overtime,bonuses,vacancies_total,available_until,image_src,description,pdf_source_url,pdf_file_name,pdf_text,pdf_extracted_data,clientify_product_id,clientify_product_name,clientify_product_sku,clientify_synced_at,status,created_by,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(slug, values.title, values.program, values.sponsor, values.employer, values.compensationType, values.compensationMin, values.compensationMax, values.compensationCurrency, values.compensationPeriod, values.hasTips, values.englishLevel, values.city, values.state, values.offerType, values.airportPickup, values.overtime, values.bonuses, values.vacanciesTotal, values.availableUntil, values.imageSrc, values.description, values.pdfSourceUrl, values.pdfFileName, values.pdfText, values.pdfExtractedData, values.clientifyProductId, values.clientifyProductName, values.clientifyProductSku, values.clientifyProductId ? timestamp : null, values.status, req.user.id, timestamp, timestamp)
  return res.status(201).json({ ok: true, offer: toOffer(selectOffers('WHERE o.id = ?', [result.lastInsertRowid])[0]) })
})

adminOffersRouter.put('/offers/:id', requirePermission(PERMISSIONS.OFFERS_MANAGE), (req, res) => {
  const error = validateOffer(req.body)
  if (error) return res.status(400).json({ ok: false, error })
  const db = getDb(); const existing = db.prepare('SELECT * FROM job_offers WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ ok: false, error: 'Oferta no encontrada.' })
  const activeCount = db.prepare("SELECT COUNT(*) AS total FROM job_applications WHERE offer_id = ? AND status = 'active'").get(existing.id).total
  const values = offerValues(req.body, existing)
  if (values.vacanciesTotal < activeCount + existing.vacancies_lost) return res.status(400).json({ ok: false, error: `No puedes reducir las vacantes por debajo de ${activeCount + existing.vacancies_lost}; ya están ocupadas o perdidas.` })
  db.prepare(
    `UPDATE job_offers SET title=?,program=?,sponsor=?,employer=?,compensation_type=?,compensation_min=?,compensation_max=?,compensation_currency=?,compensation_period=?,has_tips=?,english_level=?,city=?,state=?,offer_type=?,airport_pickup=?,overtime=?,bonuses=?,vacancies_total=?,available_until=?,image_src=?,description=?,pdf_source_url=?,pdf_file_name=?,pdf_text=?,pdf_extracted_data=?,clientify_product_id=?,clientify_product_name=?,clientify_product_sku=?,clientify_synced_at=?,status=?,updated_at=? WHERE id=?`,
  ).run(values.title, values.program, values.sponsor, values.employer, values.compensationType, values.compensationMin, values.compensationMax, values.compensationCurrency, values.compensationPeriod, values.hasTips, values.englishLevel, values.city, values.state, values.offerType, values.airportPickup, values.overtime, values.bonuses, values.vacanciesTotal, values.availableUntil, values.imageSrc, values.description, values.pdfSourceUrl, values.pdfFileName, values.pdfText, values.pdfExtractedData, values.clientifyProductId, values.clientifyProductName, values.clientifyProductSku, values.clientifyProductId ? nowIso() : null, values.status, nowIso(), existing.id)
  return res.json({ ok: true, offer: toOffer(selectOffers('WHERE o.id = ?', [existing.id])[0]) })
})

adminOffersRouter.post('/offers/:id/duplicate', requirePermission(PERMISSIONS.OFFERS_MANAGE), (req, res) => {
  const db = getDb(); const existing = db.prepare('SELECT * FROM job_offers WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ ok: false, error: 'Oferta no encontrada.' })
  const timestamp = nowIso(); const slug = uniqueSlug(slugify(`${existing.slug}-copia`), (candidate) => !!db.prepare('SELECT id FROM job_offers WHERE slug = ?').get(candidate))
  const result = db.prepare(
    `INSERT INTO job_offers (slug,title,program,sponsor,employer,compensation_type,compensation_min,compensation_max,compensation_currency,compensation_period,has_tips,english_level,city,state,offer_type,airport_pickup,overtime,bonuses,vacancies_total,available_until,image_src,description,pdf_source_url,pdf_file_name,pdf_text,pdf_extracted_data,clientify_product_id,clientify_product_name,clientify_product_sku,clientify_synced_at,status,created_by,created_at,updated_at)
     SELECT ?, title || ' (copia)',program,sponsor,employer,compensation_type,compensation_min,compensation_max,compensation_currency,compensation_period,has_tips,english_level,city,state,offer_type,airport_pickup,overtime,bonuses,vacancies_total,available_until,image_src,description,pdf_source_url,pdf_file_name,pdf_text,pdf_extracted_data,clientify_product_id,clientify_product_name,clientify_product_sku,clientify_synced_at,'draft',?,?,? FROM job_offers WHERE id=?`,
  ).run(slug, req.user.id, timestamp, timestamp, existing.id)
  return res.status(201).json({ ok: true, offer: toOffer(selectOffers('WHERE o.id = ?', [result.lastInsertRowid])[0]) })
})

adminOffersRouter.delete('/offers/:id', requirePermission(PERMISSIONS.OFFERS_MANAGE), (req, res) => {
  const db = getDb(); const applications = db.prepare('SELECT COUNT(*) AS total FROM job_applications WHERE offer_id = ?').get(req.params.id).total
  if (applications > 0) return res.status(409).json({ ok: false, error: 'Esta oferta tiene historial de aplicaciones y no puede eliminarse. Puedes cerrarla.' })
  const result = db.prepare('DELETE FROM job_offers WHERE id = ?').run(req.params.id)
  if (!result.changes) return res.status(404).json({ ok: false, error: 'Oferta no encontrada.' })
  return res.json({ ok: true })
})

adminOffersRouter.post('/participants/:participantId/offer', requirePermission(PERMISSIONS.OFFERS_ASSIGN), (req, res) => {
  const db = getDb(); db.exec('BEGIN IMMEDIATE')
  try {
    if (db.prepare("SELECT id FROM job_applications WHERE participant_id = ? AND status = 'active'").get(req.params.participantId)) { db.exec('ROLLBACK'); return res.status(409).json({ ok: false, error: 'El participante ya tiene una oferta asignada.' }) }
    const row = selectOffers("WHERE o.id = ? AND o.status = 'active'", [Number(req.body?.offerId)])[0]
    if (!row || Number(row.vacancies_available) < 1) { db.exec('ROLLBACK'); return res.status(409).json({ ok: false, error: 'La oferta no está activa o no tiene vacantes.' }) }
    const timestamp = nowIso(); const result = db.prepare("INSERT INTO job_applications (participant_id,offer_id,status,source,assigned_by,applied_at) VALUES (?,?,'active','admin',?,?)").run(req.params.participantId, row.id, req.user.id, timestamp)
    db.prepare("INSERT INTO job_application_history (participant_id,offer_id,application_id,event_type,actor_id,created_at) VALUES (?,?,?,'assigned',?,?)").run(req.params.participantId, row.id, result.lastInsertRowid, req.user.id, timestamp)
    db.exec('COMMIT'); return res.status(201).json({ ok: true })
  } catch (error) { db.exec('ROLLBACK'); console.error(error); return res.status(500).json({ ok: false, error: 'No pudimos asignar la oferta.' }) }
})

adminOffersRouter.delete('/participants/:participantId/offer', requirePermission(PERMISSIONS.OFFERS_ASSIGN), (req, res) => {
  const { returnVacancy, reason } = req.body || {}
  if (typeof returnVacancy !== 'boolean') return res.status(400).json({ ok: false, error: 'Indica qué debe pasar con la vacante.' })
  const db = getDb(); db.exec('BEGIN IMMEDIATE')
  try {
    const application = db.prepare("SELECT * FROM job_applications WHERE participant_id = ? AND status = 'active'").get(req.params.participantId)
    if (!application) { db.exec('ROLLBACK'); return res.status(404).json({ ok: false, error: 'El participante no tiene una oferta activa.' }) }
    const timestamp = nowIso()
    db.prepare("UPDATE job_applications SET status='removed',vacancy_returned=?,removal_reason=?,removed_at=? WHERE id=?").run(returnVacancy ? 1 : 0, String(reason || '').trim(), timestamp, application.id)
    if (!returnVacancy) db.prepare('UPDATE job_offers SET vacancies_lost = vacancies_lost + 1, updated_at = ? WHERE id = ?').run(timestamp, application.offer_id)
    db.prepare('INSERT INTO job_application_history (participant_id,offer_id,application_id,event_type,actor_id,note,created_at) VALUES (?,?,?,?,?,?,?)').run(req.params.participantId, application.offer_id, application.id, returnVacancy ? 'removed_returned' : 'removed_lost', req.user.id, String(reason || '').trim(), timestamp)
    db.exec('COMMIT'); return res.json({ ok: true })
  } catch (error) { db.exec('ROLLBACK'); console.error(error); return res.status(500).json({ ok: false, error: 'No pudimos retirar la oferta.' }) }
})

adminOffersRouter.get('/participants/:participantId/offer-history', requirePermission(PERMISSIONS.USERS_VIEW), (req, res) => {
  const rows = getDb().prepare(
    `SELECT h.*, o.title, o.employer, o.program FROM job_application_history h
     LEFT JOIN job_offers o ON o.id = h.offer_id WHERE h.participant_id = ? ORDER BY h.created_at DESC`,
  ).all(req.params.participantId)
  return res.json({ ok: true, history: rows.map((row) => ({ id: row.id, eventType: row.event_type, note: row.note, createdAt: row.created_at, offer: row.offer_id ? { id: row.offer_id, title: row.title, employer: row.employer, program: row.program } : null })) })
})

function escapeXml(value) { return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;') }
export function buildParticipantsExcel(users, filter) {
  const rows = users.filter((user) => filter === 'with' ? user.currentOffer : filter === 'without' ? !user.currentOffer : true)
  const headers = ['Nombre', 'Apellido', 'Correo', 'Código', 'Estado intranet', 'Tiene oferta', 'Cargo', 'Empleador', 'Programa', 'Sponsor', 'Ciudad', 'Estado', 'Salario/Estipendio', 'Fecha de asignación']
  const data = rows.map((user) => [user.firstName, user.lastName, user.email, user.studentCode || '', user.panelActive ? 'Activo' : 'Inactivo', user.currentOffer ? 'Sí' : 'No', user.currentOffer?.title || '', user.currentOffer?.employer || '', user.currentOffer?.program || '', user.currentOffer?.sponsor || '', user.currentOffer?.city || '', user.currentOffer?.state || '', user.currentOffer?.compensationLabel || '', user.currentOffer?.appliedAt || ''])
  const tableRows = [headers, ...data].map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join('')}</Row>`).join('')
  return `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Participantes"><Table>${tableRows}</Table></Worksheet></Workbook>`
}

adminOffersRouter.get('/offer-participants/export', requirePermission(PERMISSIONS.OFFERS_EXPORT), async (req, res) => {
  try {
    const central = await getUsers(req.bbbscAccessToken)
    const centralUsers = (Array.isArray(central) ? central : central?.users || []).filter((user) => (user.roles || [user.role]).includes('STUDENT'))
    const db = getDb()
    const applications = db.prepare(
      `SELECT a.participant_id,a.applied_at,o.title,o.employer,o.program,o.sponsor,o.city,o.state,o.compensation_type,o.compensation_min,o.compensation_max,o.compensation_currency,o.compensation_period
       FROM job_applications a JOIN job_offers o ON o.id=a.offer_id WHERE a.status='active'`,
    ).all()
    const byUser = new Map(applications.map((row) => [row.participant_id, row]))
    const access = new Map(db.prepare('SELECT bbbsc_user_id,enabled FROM intranet_user_access').all().map((row) => [row.bbbsc_user_id, row.enabled === 1]))
    const users = centralUsers.map((user) => {
      const offer = byUser.get(user.id)
      const compensationLabel = offer ? `${offer.compensation_type === 'stipend' ? 'Estipendio' : 'Salario'} ${offer.compensation_currency} ${offer.compensation_min}${offer.compensation_max ? ` - ${offer.compensation_max}` : ''} / ${offer.compensation_period}` : ''
      return { ...user, panelActive: user.isActive !== false && access.get(user.id) === true, currentOffer: offer ? { ...offer, compensationLabel } : null }
    })
    const file = buildParticipantsExcel(users, ['with', 'without'].includes(req.query.filter) ? req.query.filter : 'all')
    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="participantes-ofertas-${new Date().toISOString().slice(0, 10)}.xls"`)
    return res.send(file)
  } catch (error) {
    console.error('[bbbsc-server] Error exportando participantes:', error)
    return res.status(502).json({ ok: false, error: 'No pudimos generar el archivo de Excel.' })
  }
})
