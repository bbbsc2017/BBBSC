import { getDb } from '../db.js'
import { defaultMappings } from './formDefinitions.js'

const STANDARD_TARGETS = new Set(['first_name', 'last_name', 'email', 'phone', 'birthday', 'company', 'contact_source', 'tags', 'message'])

export function readSavedMappings(db, form) {
  const row = db.prepare('SELECT mappings FROM clientify_form_mappings WHERE form_key = ?').get(form.key)
  let saved = {}
  try { saved = JSON.parse(row?.mappings || '{}') } catch { saved = {} }
  return { ...defaultMappings(form), ...saved }
}

function normalizeValue(value) {
  if (value === undefined || value === null || value === false) return ''
  return String(value).trim()
}

export function buildClientifyPayload(form, values, db = getDb()) {
  const mappings = readSavedMappings(db, form)
  const payload = {}
  const customFields = []

  for (const field of form.fields) {
    const value = normalizeValue(values[field.key])
    const target = mappings[field.key]
    if (!value || !target || target === 'ignore') continue
    if (target.startsWith('standard:')) {
      const name = target.slice('standard:'.length)
      if (!STANDARD_TARGETS.has(name)) continue
      payload[name] = name === 'tags' ? [...new Set([...(payload.tags || []), value])] : value
    } else if (target.startsWith('custom:')) {
      const name = target.slice('custom:'.length).trim()
      if (name) customFields.push({ field: name, value })
    }
  }

  if (customFields.length) payload.custom_fields = customFields
  return payload
}
