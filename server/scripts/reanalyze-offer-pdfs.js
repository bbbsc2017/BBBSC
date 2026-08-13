import { getDb, nowIso } from '../db.js'
import { inferOfferFields } from '../lib/offerPdfs.js'

const db = getDb()
const rows = db.prepare("SELECT id, pdf_text FROM job_offers WHERE pdf_file_name <> '' AND pdf_text <> ''").all()
const update = db.prepare('UPDATE job_offers SET pdf_extracted_data = ?, updated_at = ? WHERE id = ?')
const timestamp = nowIso()

db.exec('BEGIN IMMEDIATE')
try {
  for (const row of rows) {
    const analysis = inferOfferFields(row.pdf_text)
    update.run(JSON.stringify({ fields: analysis.fields, detected: analysis.detected, confidence: analysis.confidence, warnings: analysis.warnings }), timestamp, row.id)
  }
  db.exec('COMMIT')
} catch (error) {
  db.exec('ROLLBACK')
  throw error
}

console.log(JSON.stringify({ analyzed: rows.length }, null, 2))
