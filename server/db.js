import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { ROLE_SEEDS } from './lib/permissions.js'

const DB_DIR = path.join(import.meta.dirname, process.env.DB_DIR || 'data')
const DB_PATH = path.join(DB_DIR, 'bbbsc.sqlite3')

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  bbbsc_user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL,
  access_token TEXT NOT NULL,
  central_refresh_token TEXT,
  last_synced_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_bbbsc_user_id ON sessions(bbbsc_user_id);

CREATE TABLE IF NOT EXISTS intranet_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT 'gray',
  is_system INTEGER NOT NULL DEFAULT 0 CHECK (is_system IN (0, 1)),
  permissions TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS intranet_user_access (
  bbbsc_user_id TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  updated_by TEXT,
  updated_at TEXT NOT NULL,
  role_id INTEGER REFERENCES intranet_roles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Embajada','Programas','Consejos')),
  content_html TEXT NOT NULL,
  image_src TEXT NOT NULL,
  image_alt TEXT NOT NULL DEFAULT '',
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_posts_status_published_at ON posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT,
  post_title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);

CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  referrer TEXT,
  session_id TEXT NOT NULL,
  ip_hash TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_visits_path ON visits(path);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clientify_form_mappings (
  form_key TEXT PRIMARY KEY,
  mappings TEXT NOT NULL DEFAULT '{}',
  updated_by TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clientify_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  raw_json TEXT NOT NULL DEFAULT '{}',
  synced_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_clientify_products_name ON clientify_products(name);

CREATE TABLE IF NOT EXISTS job_offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  program TEXT NOT NULL CHECK (program IN ('work-travel-usa','work-travel-asia','trainee-internship','teacher-assistant','teacher-exchange')),
  sponsor TEXT NOT NULL,
  employer TEXT NOT NULL,
  compensation_type TEXT NOT NULL CHECK (compensation_type IN ('salary','stipend')),
  compensation_min REAL NOT NULL,
  compensation_max REAL,
  compensation_currency TEXT NOT NULL DEFAULT 'USD',
  compensation_period TEXT NOT NULL DEFAULT 'hour',
  has_tips INTEGER NOT NULL DEFAULT 0 CHECK (has_tips IN (0,1)),
  english_level TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  offer_type TEXT NOT NULL,
  airport_pickup INTEGER NOT NULL DEFAULT 0 CHECK (airport_pickup IN (0,1)),
  overtime INTEGER NOT NULL DEFAULT 0 CHECK (overtime IN (0,1)),
  bonuses TEXT NOT NULL DEFAULT '',
  vacancies_total INTEGER NOT NULL CHECK (vacancies_total >= 0),
  vacancies_lost INTEGER NOT NULL DEFAULT 0 CHECK (vacancies_lost >= 0),
  available_until TEXT NOT NULL,
  image_src TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  pdf_source_url TEXT NOT NULL DEFAULT '',
  pdf_file_name TEXT NOT NULL DEFAULT '',
  pdf_text TEXT NOT NULL DEFAULT '',
  pdf_extracted_data TEXT NOT NULL DEFAULT '{}',
  clientify_product_id TEXT,
  clientify_product_name TEXT NOT NULL DEFAULT '',
  clientify_product_sku TEXT NOT NULL DEFAULT '',
  clientify_synced_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','closed')),
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_job_offers_program_status ON job_offers(program, status);
CREATE INDEX IF NOT EXISTS idx_job_offers_location ON job_offers(city, state);

CREATE TABLE IF NOT EXISTS job_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT NOT NULL,
  offer_id INTEGER NOT NULL REFERENCES job_offers(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','removed')),
  source TEXT NOT NULL CHECK (source IN ('participant','admin')),
  assigned_by TEXT,
  vacancy_returned INTEGER CHECK (vacancy_returned IN (0,1)),
  removal_reason TEXT,
  travel_start_date TEXT,
  travel_end_date TEXT,
  participant_email TEXT,
  participant_first_name TEXT,
  participant_last_name TEXT,
  selected_product_id TEXT,
  selected_product_name TEXT,
  selected_product_sku TEXT,
  selected_product_price REAL,
  selected_product_currency TEXT,
  clientify_contact_id TEXT,
  clientify_deal_id TEXT,
  clientify_sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (clientify_sync_status IN ('pending','syncing','synced','failed')),
  clientify_sync_attempts INTEGER NOT NULL DEFAULT 0,
  clientify_sync_error TEXT,
  clientify_next_attempt_at TEXT,
  clientify_synced_at TEXT,
  applied_at TEXT NOT NULL,
  removed_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_job_applications_one_active ON job_applications(participant_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_job_applications_offer ON job_applications(offer_id, status);

CREATE TABLE IF NOT EXISTS job_application_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT NOT NULL,
  offer_id INTEGER REFERENCES job_offers(id) ON DELETE SET NULL,
  application_id INTEGER REFERENCES job_applications(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('applied','assigned','removed_returned','removed_lost')),
  actor_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_job_history_participant ON job_application_history(participant_id, created_at DESC);
`

let db

export function getDb() {
  if (db) return db

  fs.mkdirSync(DB_DIR, { recursive: true })
  db = new DatabaseSync(DB_PATH)
  db.exec('PRAGMA foreign_keys = ON')
  db.exec(SCHEMA_SQL)
  const sessionColumns = db.prepare('PRAGMA table_info(sessions)').all()
  if (!sessionColumns.some((column) => column.name === 'central_refresh_token')) {
    db.exec('ALTER TABLE sessions ADD COLUMN central_refresh_token TEXT')
  }
  const postColumns = db.prepare('PRAGMA table_info(posts)').all()
  if (!postColumns.some((column) => column.name === 'withdrawn_at')) {
    db.exec('ALTER TABLE posts ADD COLUMN withdrawn_at TEXT')
  }
  const accessColumns = db.prepare('PRAGMA table_info(intranet_user_access)').all()
  if (!accessColumns.some((column) => column.name === 'role_id')) {
    db.exec('ALTER TABLE intranet_user_access ADD COLUMN role_id INTEGER REFERENCES intranet_roles(id) ON DELETE SET NULL')
  }
  const offerColumns = db.prepare('PRAGMA table_info(job_offers)').all()
  const offerMigrations = [
    ['pdf_source_url', "TEXT NOT NULL DEFAULT ''"],
    ['pdf_file_name', "TEXT NOT NULL DEFAULT ''"],
    ['pdf_text', "TEXT NOT NULL DEFAULT ''"],
    ['pdf_extracted_data', "TEXT NOT NULL DEFAULT '{}'"],
    ['clientify_product_id', 'TEXT'],
    ['clientify_product_name', "TEXT NOT NULL DEFAULT ''"],
    ['clientify_product_sku', "TEXT NOT NULL DEFAULT ''"],
    ['clientify_synced_at', 'TEXT'],
  ]
  for (const [name, definition] of offerMigrations) {
    if (!offerColumns.some((column) => column.name === name)) db.exec(`ALTER TABLE job_offers ADD COLUMN ${name} ${definition}`)
  }
  const applicationColumns = db.prepare('PRAGMA table_info(job_applications)').all()
  const applicationMigrations = [
    ['travel_start_date', 'TEXT'],
    ['travel_end_date', 'TEXT'],
    ['participant_email', 'TEXT'],
    ['participant_first_name', 'TEXT'],
    ['participant_last_name', 'TEXT'],
    ['selected_product_id', 'TEXT'],
    ['selected_product_name', 'TEXT'],
    ['selected_product_sku', 'TEXT'],
    ['selected_product_price', 'REAL'],
    ['selected_product_currency', 'TEXT'],
    ['clientify_contact_id', 'TEXT'],
    ['clientify_deal_id', 'TEXT'],
    ['clientify_sync_status', "TEXT NOT NULL DEFAULT 'pending'"],
    ['clientify_sync_attempts', 'INTEGER NOT NULL DEFAULT 0'],
    ['clientify_sync_error', 'TEXT'],
    ['clientify_next_attempt_at', 'TEXT'],
    ['clientify_synced_at', 'TEXT'],
  ]
  for (const [name, definition] of applicationMigrations) {
    if (!applicationColumns.some((column) => column.name === name)) db.exec(`ALTER TABLE job_applications ADD COLUMN ${name} ${definition}`)
  }
  const timestamp = nowIso()
  const seedRole = db.prepare(
    `INSERT INTO intranet_roles (name, label, description, color, is_system, permissions, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(name) DO NOTHING`,
  )
  for (const role of ROLE_SEEDS) {
    seedRole.run(role.name, role.label, role.description, role.color, role.isSystem, JSON.stringify(role.permissions), timestamp, timestamp)
    const existing = db.prepare('SELECT id, permissions FROM intranet_roles WHERE name = ?').get(role.name)
    let existingPermissions = {}
    try { existingPermissions = JSON.parse(existing.permissions || '{}') } catch { existingPermissions = {} }
    const missingPermissions = Object.fromEntries(Object.entries(role.permissions).filter(([permission]) => !(permission in existingPermissions)))
    if (Object.keys(missingPermissions).length > 0) {
      db.prepare('UPDATE intranet_roles SET permissions = ?, updated_at = ? WHERE id = ?').run(JSON.stringify({ ...existingPermissions, ...missingPermissions }), timestamp, existing.id)
    }
  }
  return db
}

export function nowIso() {
  return new Date().toISOString()
}
