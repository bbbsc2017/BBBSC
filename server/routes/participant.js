import { Router } from 'express'
import { requireAuth } from '../auth.js'
import { getDb } from '../db.js'
import { getProfile, getStudentDashboard, getStudentInfoSummary, getStudentProfileLabel } from '../lib/bbbscApi.js'

export const participantRouter = Router()

function fulfilled(result, fallback = null) {
  return result.status === 'fulfilled' ? result.value : fallback
}

function clean(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function findField(fields, patterns) {
  return fields.find((field) => patterns.some((pattern) => pattern.test(`${field.fieldName || ''} ${field.label || ''}`)))?.value || null
}

function compensationLabel(row) {
  if (!row) return null
  const range = row.compensation_max && row.compensation_max !== row.compensation_min
    ? `${row.compensation_min} - ${row.compensation_max}`
    : `${row.compensation_min}`
  return `${row.compensation_type === 'stipend' ? 'Estipendio' : 'Salario'} ${row.compensation_currency} ${range} / ${row.compensation_period}`
}

participantRouter.get('/participant/dashboard', requireAuth, async (req, res) => {
  if (req.user.role !== 'STUDENT') {
    return res.status(403).json({ ok: false, error: 'Este perfil está disponible únicamente para participantes.' })
  }

  const db = getDb()
  const current = db.prepare(
    `SELECT a.id AS application_id, a.applied_at, a.source,
            o.id AS offer_id, o.slug, o.title, o.program, o.sponsor, o.employer, o.city, o.state,
            o.compensation_type, o.compensation_min, o.compensation_max, o.compensation_currency, o.compensation_period
       FROM job_applications a
       JOIN job_offers o ON o.id = a.offer_id
      WHERE a.participant_id = ? AND a.status = 'active'`,
  ).get(req.user.id)
  const historyRows = db.prepare(
    `SELECT h.id, h.event_type, h.note, h.created_at,
            o.id AS offer_id, o.slug, o.title, o.employer, o.program, o.sponsor, o.city, o.state
       FROM job_application_history h
       LEFT JOIN job_offers o ON o.id = h.offer_id
      WHERE h.participant_id = ?
      ORDER BY h.created_at DESC`,
  ).all(req.user.id)

  const centralResults = await Promise.allSettled([
    getStudentDashboard(req.bbbscAccessToken),
    getProfile(req.bbbscAccessToken),
    getStudentProfileLabel(req.bbbscAccessToken),
    getStudentInfoSummary(req.bbbscAccessToken),
  ])
  const centralDashboard = fulfilled(centralResults[0], {})
  const centralProfile = fulfilled(centralResults[1], {})
  const profileLabel = fulfilled(centralResults[2], {})
  const infoSummary = fulfilled(centralResults[3], { fields: [] })
  const fields = Array.isArray(infoSummary?.fields) ? infoSummary.fields : []
  const personalInfo = centralDashboard?.clientify?.personalInfo || {}
  const guruName = clean(findField(fields, [/(?:^|\s)gur[uú](?:\s|$)/i, /asesor(?:a)?\s+asignad/i, /advisor/i]))
  const phone = clean(findField(fields, [/tel[eé]fono/i, /celular/i, /whats?app/i, /phone/i]))
  const photoUrl = clean(
    profileLabel?.photoUrl || personalInfo.photoUrl || centralProfile?.imageUrl || centralDashboard?.profile?.imageUrl,
  )

  return res.json({
    ok: true,
    participant: {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: clean(personalInfo.email) || req.user.email,
      studentCode: clean(centralProfile?.studentCode),
      photoUrl,
      profileLabel: clean(profileLabel?.perfil),
      createdAt: centralDashboard?.user?.createdAt || null,
      guruName,
      personalInfo: {
        phone,
        documentNumber: clean(personalInfo.cedula),
        birthDate: clean(personalInfo.birthDate),
        city: clean(personalInfo.city),
        englishLevel: clean(personalInfo.englishLevel),
        university: clean(personalInfo.university),
        academicProgram: clean(personalInfo.academicProgram),
      },
    },
    application: current ? {
      id: current.application_id,
      appliedAt: current.applied_at,
      source: current.source,
      offer: {
        id: current.offer_id,
        slug: current.slug,
        title: current.title,
        program: current.program,
        sponsor: current.sponsor,
        employer: current.employer,
        city: current.city,
        state: current.state,
        compensationLabel: compensationLabel(current),
      },
    } : null,
    history: historyRows.map((row) => ({
      id: row.id,
      eventType: row.event_type,
      note: row.note,
      createdAt: row.created_at,
      offer: row.offer_id ? {
        id: row.offer_id,
        slug: row.slug,
        title: row.title,
        employer: row.employer,
        program: row.program,
        sponsor: row.sponsor,
        city: row.city,
        state: row.state,
      } : null,
    })),
    centralAvailable: centralResults.some((result) => result.status === 'fulfilled'),
  })
})
