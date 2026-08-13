import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import dns from 'node:dns/promises'
import net from 'node:net'
import { PDFParse } from 'pdf-parse'

export const OFFER_PDFS_DIR = path.join(import.meta.dirname, '..', process.env.OFFER_PDFS_DIR || 'data/offer-pdfs')
export const MAX_PDF_BYTES = 25 * 1024 * 1024

fs.mkdirSync(OFFER_PDFS_DIR, { recursive: true })

function isPrivateIp(address) {
  if (net.isIPv4(address)) {
    const [a, b] = address.split('.').map(Number)
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
  }
  const value = address.toLowerCase()
  return value === '::1' || value === '::' || value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe80:') || value.startsWith('::ffff:127.') || value.startsWith('::ffff:10.') || value.startsWith('::ffff:192.168.')
}

async function validateRemoteUrl(url) {
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('La URL debe comenzar por http:// o https://.')
  if (url.username || url.password) throw new Error('La URL no puede contener credenciales.')
  const host = url.hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.local')) throw new Error('La dirección indicada no está permitida.')
  const addresses = await dns.lookup(host, { all: true })
  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) throw new Error('La dirección indicada no está permitida.')
}

function pdfName(buffer) {
  return `${crypto.createHash('sha256').update(buffer).digest('hex')}.pdf`
}

function assertPdf(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 5 || buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error('El archivo recibido no es un PDF válido.')
  }
  if (buffer.length > MAX_PDF_BYTES) throw new Error('El PDF supera el tamaño máximo permitido (25 MB).')
}

export async function storePdfBuffer(buffer) {
  assertPdf(buffer)
  const fileName = pdfName(buffer)
  const filePath = path.join(OFFER_PDFS_DIR, fileName)
  if (!fs.existsSync(filePath)) {
    try { fs.writeFileSync(filePath, buffer, { flag: 'wx' }) } catch (error) { if (error?.code !== 'EEXIST') throw error }
  }
  return { fileName, filePath }
}

export async function downloadPdf(sourceUrl) {
  let url
  try { url = new URL(sourceUrl) } catch { throw new Error('La URL del PDF no es válida.') }
  let response
  for (let redirects = 0; redirects <= 5; redirects += 1) {
    await validateRemoteUrl(url)
    response = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': 'BBBSC-Offer-Importer/1.0' },
      signal: AbortSignal.timeout(30_000),
    })
    if (![301, 302, 303, 307, 308].includes(response.status)) break
    const location = response.headers.get('location')
    if (!location || redirects === 5) throw new Error('El PDF redirige demasiadas veces.')
    url = new URL(location, url)
  }
  if (!response.ok) throw new Error(`No pudimos descargar el PDF (respuesta ${response.status}).`)
  const contentLength = Number(response.headers.get('content-length') || 0)
  if (contentLength > MAX_PDF_BYTES) throw new Error('El PDF supera el tamaño máximo permitido (25 MB).')
  const buffer = Buffer.from(await response.arrayBuffer())
  return { ...(await storePdfBuffer(buffer)), buffer, sourceUrl: url.toString() }
}

export async function extractPdfText(buffer) {
  assertPdf(buffer)
  const parser = new PDFParse({ data: buffer })
  try {
    const result = await parser.getText()
    return String(result.text || '').split('\u0000').join('').replace(/[ \t]+\n/g, '\n').trim()
  } finally {
    await parser.destroy()
  }
}

function match(text, patterns) {
  for (const pattern of patterns) {
    const result = text.match(pattern)
    if (result?.[1]) return result[1].replace(/[\uE000-\uF8FF]/g, '').replace(/\s+/g, ' ').trim().replace(/[|•]+$/, '').trim()
  }
  return ''
}

function numberFrom(value) {
  if (!value) return null
  const parsed = Number(value.replace(/,/g, '').match(/\d+(?:\.\d+)?/)?.[0])
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeDate(value) {
  if (!value) return ''
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? '' : new Date(timestamp).toISOString().slice(0, 16)
}

export function inferOfferFields(text) {
  const compact = text.replace(/\r/g, '')
  const labeled = (labels, allowBare = false) => new RegExp(`(?:${labels})[ \\t]*(?:(?::|-|\\t)[ \\t]*${allowBare ? '|[ \\t]+' : ''})([^\\n]+)`, 'i')
  const spiritHeading = compact.match(/^#\.\s*(.+?)\s+at\s+([^,\n]+),\s*([A-Z]{2})\s*$/im)
  const sponsor = /alliance abroad/i.test(compact) ? 'Alliance' : /geovisions/i.test(compact) ? 'Geovisions' : /spirit (?:applicant|cultural)/i.test(compact) ? 'Spirit' : match(compact, [labeled('visa sponsor|sponsor')])
  const employer = spiritHeading?.[1]?.trim() || match(compact, [labeled('host entity name|entity name|employer|host company|host organization|host')]) || ''
  const title = match(compact, [labeled('job title', true), labeled('type of position|job position|position|cargo|department'), /^Job:\s*([^\n]+)/im, /^((?:Intern|Management Training|Contractual Position)\s+in\s+[^\n]+)/im])
    || (spiritHeading ? match(compact, [labeled('type of position')]) : '')
  const address = match(compact, [labeled('site of activity address|site of activity|worksite address|address')])
  const addressLocation = address.match(/,\s*([^,]+),\s*([A-Z]{2})(?:,|\s+\d{5})/i)
  const city = match(compact, [labeled('city|ciudad')])?.split(',')[0]?.trim() || addressLocation?.[1]?.trim() || spiritHeading?.[2]?.trim() || ''
  const state = match(compact, [labeled('state|estado|region')]) || addressLocation?.[2]?.trim() || spiritHeading?.[3]?.trim() || ''
  const wage = match(compact, [labeled('guaranteed salary/wage per hour before deductions', true), labeled('pay rate|salary|wage|stipend|compensation|monthly allowance')])
  const minimum = numberFrom(wage)
  const values = wage.match(/\d+(?:[,.]\d+)?/g)?.map(numberFrom).filter((value) => value !== null) || []
  const currency = /\b(?:USD|US\$|\$)\b/i.test(wage) ? 'USD' : match(wage, [/\b([A-Z]{3})\b/]) || 'USD'
  const period = /(?:per|\/|por)\s*(?:hour|hora|hr)\b/i.test(wage) ? 'hour'
    : /(?:per|\/|por)\s*(?:week|semana|wk)\b/i.test(wage) ? 'week'
      : /(?:per|\/|por)\s*(?:month|mes)\b/i.test(wage) ? 'month'
        : /(?:per|\/|por)\s*(?:year|año)\b/i.test(wage) ? 'year' : 'hour'
  const deadline = match(compact, [labeled('application deadline|apply by|available until|fecha l[ií]mite|disponible hasta')])
  const vacancies = numberFrom(match(compact, [labeled('openings|positions available|vacancies|vacantes')]))
  const englishText = match(compact, [labeled('english level|required english|nivel de ingl[eé]s|required qualifications|special requirements')])
  const english = /excellent|fluent|advanced/i.test(englishText) ? 'Avanzado' : /very good|upper.?intermediate/i.test(englishText) ? 'Intermedio alto' : /intermediate|good level/i.test(englishText) ? 'Intermedio' : /basic/i.test(englishText) ? 'Básico' : ''
  const explicitType = match(compact, [labeled('business type|industry|property type|tipo de oferta|establishment')])
  const context = `${title} ${employer}`
  const offerType = explicitType || (/water.?park|lifeguard|pool/i.test(context) ? 'Parque acuático / piscina' : /restaurant|food|beverage|server|cook|dishwasher|busser|host\b|barista/i.test(context) ? 'Restaurante' : /hotel|resort|housekeep|room attendant|front office/i.test(context) ? 'Hotel / resort' : /teacher|school|education/i.test(context) ? 'Educación' : /retail|store|cashier|grocery/i.test(context) ? 'Tienda / retail' : '')
  const bonuses = match(compact, [labeled('bonus info|bonus(?:es)?|incentives?|bonos|incentivos')])
  const tipsText = match(compact, [labeled('estimated tips', true), labeled('tips|propinas')]) || (/\+\s*tips|per hour\s*\+\s*tips/i.test(wage) ? wage : '')
  const overtimeText = match(compact, [labeled('overtime terms|overtime|horas extra')])
  const pickupText = match(compact, [/(?:airport[^\n]{0,100}|pick\s*up[^\n]{0,100})(?:willing to pick up\?|airport pick\s*up|airport pickup)\s*[-:]?\s*([^\n]+)/i, /Is Host Employer Willing to pick up\?\s*-\s*([^\n]+)/i])
  const fields = {
    title, sponsor, employer, city, state, offerType,
    compensationType: /stipend/i.test(wage) ? 'stipend' : 'salary',
    compensationMin: minimum ?? 0,
    compensationMax: values.length > 1 ? values[1] : null,
    compensationCurrency: currency,
    compensationPeriod: period,
    hasTips: Boolean(tipsText) && !/\b(?:no tips|without tips)\b/i.test(tipsText),
    englishLevel: english,
    airportPickup: /\byes\b|included|provided/i.test(pickupText) && !/\bno\b/i.test(pickupText),
    overtime: Boolean(overtimeText) && !/not available|no overtime/i.test(overtimeText),
    bonuses,
    vacanciesTotal: vacancies ?? 1,
    availableUntil: normalizeDate(deadline),
  }
  const detected = [
    title && 'title', sponsor && 'sponsor', employer && 'employer', city && 'city', state && 'state', offerType && 'offerType',
    wage && 'compensationType', minimum !== null && 'compensationMin', values.length > 1 && 'compensationMax', wage && 'compensationCurrency', wage && 'compensationPeriod',
    tipsText && 'hasTips', english && 'englishLevel', pickupText && 'airportPickup', overtimeText && 'overtime', bonuses && 'bonuses', vacancies !== null && 'vacanciesTotal', deadline && 'availableUntil',
  ].filter(Boolean)
  return {
    fields,
    detected,
    confidence: Math.round((detected.length / Object.keys(fields).length) * 100),
    warnings: [
      !title && 'No se identificó claramente el cargo.',
      !employer && 'No se identificó claramente el empleador.',
      !deadline && 'No se encontró una fecha límite; debes agregarla antes de guardar.',
      'Revisa todos los campos detectados antes de publicar la oferta.',
    ].filter(Boolean),
  }
}

export async function analyzeStoredPdf(buffer) {
  const stored = await storePdfBuffer(buffer)
  const text = await extractPdfText(buffer)
  if (!text) throw new Error('El PDF no contiene texto legible. Puede ser un documento escaneado.')
  return { ...stored, text, ...inferOfferFields(text) }
}

export function safeStoredPdfPath(fileName) {
  if (!/^[a-f0-9]{64}\.pdf$/.test(String(fileName || ''))) return null
  const filePath = path.join(OFFER_PDFS_DIR, fileName)
  return fs.existsSync(filePath) ? filePath : null
}
