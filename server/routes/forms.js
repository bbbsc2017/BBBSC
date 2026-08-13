import { Router } from 'express'
import { getDb, nowIso } from '../db.js'
import { requirePermission } from '../auth.js'
import { PERMISSIONS } from '../lib/permissions.js'
import { createClientifyContact, getClientifyCustomFields } from '../lib/clientify.js'
import { defaultMappings, FORM_DEFINITIONS, getFormDefinition } from '../lib/formDefinitions.js'
import { buildClientifyPayload, readSavedMappings } from '../lib/clientifyPayload.js'
import { getClientIp, isRateLimited } from '../lib/rateLimit.js'
import { requireRecaptcha } from '../lib/recaptcha.js'

export const publicFormsRouter = Router()
export const adminFormsRouter = Router()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export { buildClientifyPayload }

publicFormsRouter.post('/interest-forms', requireRecaptcha('interest_form'), async (req, res) => {
  const ip = getClientIp(req)
  if (isRateLimited(`interest-forms:${ip}`, 5)) {
    return res.status(429).json({ ok: false, error: 'Demasiadas solicitudes en poco tiempo. Intenta nuevamente más tarde.' })
  }

  const { formKey, firstName, lastName, email, phone } = req.body || {}
  const form = getFormDefinition(String(formKey || ''))
  if (!form || form.key.startsWith('registration_')) return res.status(400).json({ ok: false, error: 'El formulario no es válido.' })
  if (![firstName, lastName, email, phone].every((value) => typeof value === 'string' && value.trim() && value.length <= 160)) {
    return res.status(400).json({ ok: false, error: 'Completa todos los campos del formulario.' })
  }
  if (!EMAIL_REGEX.test(email.trim())) return res.status(400).json({ ok: false, error: 'El correo no es válido.' })

  const fullName = `${firstName.trim()} ${lastName.trim()}`
  const values = {
    firstName, lastName, email, phone,
    interestTag: form.interestTag,
    message: `${fullName} se inscribió en el formulario de la página web de ${form.title}.`,
    contactSource: form.source,
  }

  try {
    await createClientifyContact(buildClientifyPayload(form, values))
    return res.status(201).json({ ok: true })
  } catch {
    return res.status(502).json({ ok: false, error: 'No pudimos enviar tus datos en este momento. Intenta nuevamente o escríbenos por WhatsApp.' })
  }
})

adminFormsRouter.use(requirePermission(PERMISSIONS.TRACKING_MANAGE))

adminFormsRouter.get('/clientify/forms', (_req, res) => {
  const db = getDb()
  res.json({
    ok: true,
    forms: FORM_DEFINITIONS.map((form) => ({
      key: form.key,
      label: form.label,
      fields: form.fields.map(({ key, label }) => ({ key, label })),
      mappings: readSavedMappings(db, form),
    })),
  })
})

adminFormsRouter.put('/clientify/forms/:formKey', (req, res) => {
  const form = getFormDefinition(req.params.formKey)
  if (!form) return res.status(404).json({ ok: false, error: 'Formulario no encontrado.' })
  const incoming = req.body?.mappings
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return res.status(400).json({ ok: false, error: 'El emparejamiento no es válido.' })
  }

  const allowedKeys = new Set(form.fields.map((field) => field.key))
  const mappings = {}
  for (const [key, targetValue] of Object.entries(incoming)) {
    const target = String(targetValue || '').trim()
    if (!allowedKeys.has(key) || target.length > 220 || (target !== 'ignore' && !target.startsWith('standard:') && !target.startsWith('custom:'))) {
      return res.status(400).json({ ok: false, error: `El emparejamiento de ${key} no es válido.` })
    }
    mappings[key] = target
  }

  const timestamp = nowIso()
  getDb().prepare(
    `INSERT INTO clientify_form_mappings (form_key, mappings, updated_by, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(form_key) DO UPDATE SET mappings = excluded.mappings, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
  ).run(form.key, JSON.stringify(mappings), req.user.id, timestamp)
  res.json({ ok: true, mappings: { ...defaultMappings(form), ...mappings }, updatedAt: timestamp })
})

adminFormsRouter.get('/clientify/fields', async (_req, res) => {
  try {
    const customFields = await getClientifyCustomFields()
    res.json({ ok: true, connected: true, checkedAt: nowIso(), customFields })
  } catch (error) {
    res.status(error?.status === 401 ? 401 : 502).json({ ok: false, connected: false, error: 'No fue posible conectar con Clientify. Revisa la API key y vuelve a intentar.' })
  }
})

adminFormsRouter.post('/clientify/test', async (_req, res) => {
  try {
    const customFields = await getClientifyCustomFields()
    res.json({ ok: true, connected: true, checkedAt: nowIso(), customFieldCount: customFields.length })
  } catch (error) {
    res.status(error?.status === 401 ? 401 : 502).json({ ok: false, connected: false, error: 'No fue posible conectar con Clientify. Revisa la API key configurada en el servidor.' })
  }
})
