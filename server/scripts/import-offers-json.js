import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const OFFER_COLUMNS = [
  'slug',
  'title',
  'program',
  'sponsor',
  'employer',
  'compensation_type',
  'compensation_min',
  'compensation_max',
  'compensation_currency',
  'compensation_period',
  'has_tips',
  'english_level',
  'city',
  'state',
  'offer_type',
  'airport_pickup',
  'overtime',
  'bonuses',
  'vacancies_total',
  'vacancies_lost',
  'available_until',
  'image_src',
  'description',
  'pdf_source_url',
  'pdf_file_name',
  'pdf_text',
  'pdf_extracted_data',
  'status',
  'created_by',
  'created_at',
  'updated_at',
]

function argument(name) {
  return process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3)
}

const sourceArgument = argument('source')
const databaseArgument = argument('database')

if (!sourceArgument) {
  throw new Error('Uso: node scripts/import-offers-json.js --source=/ruta/ofertas.json [--database=/ruta/bbbsc.sqlite3]')
}

const sourcePath = path.resolve(sourceArgument)
const databasePath = path.resolve(databaseArgument || path.join(import.meta.dirname, '..', 'data', 'bbbsc.sqlite3'))
const payload = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
const offers = Array.isArray(payload) ? payload : payload.offers

if (!Array.isArray(offers) || offers.length === 0) {
  throw new Error('El archivo no contiene ofertas para importar.')
}

const slugs = new Set()
for (const offer of offers) {
  if (!offer || typeof offer !== 'object' || !String(offer.slug || '').trim()) {
    throw new Error('Todas las ofertas deben tener un slug válido.')
  }
  if (slugs.has(offer.slug)) throw new Error(`Slug duplicado en el archivo: ${offer.slug}`)
  slugs.add(offer.slug)
}

const db = new DatabaseSync(databasePath)
db.exec('PRAGMA foreign_keys = ON')

const availableColumns = new Set(db.prepare("SELECT name FROM pragma_table_info('job_offers')").all().map(({ name }) => name))
const missingColumns = OFFER_COLUMNS.filter((column) => !availableColumns.has(column))
if (missingColumns.length) {
  db.close()
  throw new Error(`La base de destino no contiene estas columnas: ${missingColumns.join(', ')}`)
}

const placeholders = OFFER_COLUMNS.map(() => '?').join(', ')
const updates = OFFER_COLUMNS.filter((column) => column !== 'slug')
  .map((column) => `${column} = excluded.${column}`)
  .join(', ')
const upsert = db.prepare(
  `INSERT INTO job_offers (${OFFER_COLUMNS.join(', ')}) VALUES (${placeholders})
   ON CONFLICT(slug) DO UPDATE SET ${updates}`,
)

const before = db.prepare('SELECT COUNT(*) AS count FROM job_offers').get().count
db.exec('BEGIN IMMEDIATE')
try {
  for (const offer of offers) upsert.run(...OFFER_COLUMNS.map((column) => offer[column] ?? null))
  db.exec('COMMIT')
} catch (error) {
  db.exec('ROLLBACK')
  db.close()
  throw error
}

const after = db.prepare('SELECT COUNT(*) AS count FROM job_offers').get().count
const publicCount = db.prepare("SELECT COUNT(*) AS count FROM job_offers WHERE status IN ('active', 'closed')").get().count
db.close()

console.log(JSON.stringify({ imported: offers.length, before, after, public: publicCount }, null, 2))
