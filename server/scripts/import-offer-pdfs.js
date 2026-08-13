import fs from 'node:fs'
import path from 'node:path'
import { getDb, nowIso } from '../db.js'
import { downloadPdf, extractPdfText, inferOfferFields } from '../lib/offerPdfs.js'

const limitArgument = process.argv.find((argument) => argument.startsWith('--limit='))
const limit = limitArgument ? Math.max(1, Number(limitArgument.split('=')[1])) : Number.POSITIVE_INFINITY
const urlPattern = /https?:\/\/[^\s<>"']+\.pdf(?:\?[^\s<>"']*)?/i
const db = getDb()
const databasePath = path.join(import.meta.dirname, '..', 'data', 'bbbsc.sqlite3')
const backupDir = path.join(import.meta.dirname, '..', 'data', 'backups')
fs.mkdirSync(backupDir, { recursive: true })

const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const backupPath = path.join(backupDir, `bbbsc-before-pdf-import-${stamp}.sqlite3`)
fs.copyFileSync(databasePath, backupPath, fs.constants.COPYFILE_EXCL)

const rows = db.prepare('SELECT id, slug, title, description, pdf_file_name FROM job_offers ORDER BY id').all()
const groups = new Map()
for (const row of rows) {
  const url = String(row.description || '').match(urlPattern)?.[0]
  if (!url || row.pdf_file_name) continue
  if (!groups.has(url)) groups.set(url, [])
  groups.get(url).push(row)
}

const entries = [...groups.entries()].slice(0, limit)
const update = db.prepare('UPDATE job_offers SET pdf_source_url = ?, pdf_file_name = ?, pdf_text = ?, pdf_extracted_data = ?, description = ?, updated_at = ? WHERE id = ?')
let cursor = 0
let downloaded = 0
let updatedOffers = 0
const failures = []

async function worker() {
  while (cursor < entries.length) {
    const index = cursor++
    const [url, offers] = entries[index]
    try {
      const pdf = await downloadPdf(url)
      const text = await extractPdfText(pdf.buffer)
      const analysis = text ? inferOfferFields(text) : { fields: {}, detected: [], confidence: 0, warnings: ['El documento no contiene texto extraíble.'] }
      const extracted = JSON.stringify({ fields: analysis.fields, detected: analysis.detected, confidence: analysis.confidence, warnings: analysis.warnings })
      const timestamp = nowIso()
      db.exec('BEGIN IMMEDIATE')
      try {
        for (const offer of offers) {
          const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const description = String(offer.description || '').replace(new RegExp(`(?:\\r?\\n){0,2}Documento original:\\s*${escapedUrl}\\s*`, 'i'), '').trim()
          update.run(url, pdf.fileName, text, extracted, description, timestamp, offer.id)
          updatedOffers += 1
        }
        db.exec('COMMIT')
      } catch (error) {
        db.exec('ROLLBACK')
        throw error
      }
      downloaded += 1
      console.log(`[${index + 1}/${entries.length}] OK ${offers.length} oferta(s): ${url}`)
    } catch (error) {
      failures.push({ url, offers: offers.map(({ id, slug, title }) => ({ id, slug, title })), error: error instanceof Error ? error.message : String(error) })
      console.error(`[${index + 1}/${entries.length}] ERROR ${url}: ${failures.at(-1).error}`)
    }
  }
}

await Promise.all(Array.from({ length: Math.min(3, entries.length) }, () => worker()))

console.log(JSON.stringify({ backupPath, uniqueQueued: entries.length, uniqueDownloaded: downloaded, updatedOffers, failures: failures.length, failureDetails: failures }, null, 2))
if (failures.length) process.exitCode = 2
