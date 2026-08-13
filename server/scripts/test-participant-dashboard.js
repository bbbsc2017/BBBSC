import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'

const TEST_DIR_NAME = '.tmp-participant-dashboard-test'
process.env.DB_DIR = TEST_DIR_NAME
process.env.SESSION_SECRET = 'participant-dashboard-test-secret-32-bytes'

globalThis.fetch = async (url) => {
  const pathname = new URL(String(url)).pathname
  const responses = {
    '/api/me/dashboard': {
      user: { createdAt: '2026-01-02T00:00:00.000Z' },
      profile: { imageUrl: null },
      clientify: { personalInfo: { email: 'ana@example.com', cedula: '100200300', birthDate: '2001-05-20', city: 'Bogotá', englishLevel: 'B2', university: 'Universidad BBB', academicProgram: 'Administración', photoUrl: null } },
    },
    '/api/profiles/me': { studentCode: 'BBB-001', imageUrl: null },
    '/api/me/profile-label': { perfil: 'Work and Travel USA', photoUrl: 'https://images.example.com/ana.webp' },
    '/api/me/info-summary': { fields: [{ fieldName: 'Guru asignado', label: 'Gurú asignado', value: 'Laura Pérez', group: 'Proceso' }, { fieldName: 'Celular', label: 'Celular', value: '3001234567', group: 'Personal' }] },
  }
  const body = responses[pathname]
  if (!body) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404, headers: { 'content-type': 'application/json' } })
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

const [{ default: express }, { getDb }, auth, { participantRouter }] = await Promise.all([
  import('express'),
  import('../db.js'),
  import('../auth.js'),
  import('../routes/participant.js'),
])

const db = getDb()
const participantId = 'participant-test-id'
db.prepare('INSERT INTO intranet_user_access (bbbsc_user_id, enabled, updated_at) VALUES (?, 1, ?)').run(participantId, new Date().toISOString())
const offer = db.prepare(
  `INSERT INTO job_offers (slug,title,program,sponsor,employer,compensation_type,compensation_min,compensation_currency,compensation_period,english_level,city,state,offer_type,vacancies_total,available_until,status,created_at,updated_at)
   VALUES (?,?,?,?,?,'salary',15,'USD','hour','B2','Orlando','Florida','Hotel',5,?,'active',?,?)`,
).run('front-desk-agent', 'Front Desk Agent', 'work-travel-usa', 'Sponsor USA', 'Hotel BBB', '2027-01-01T00:00:00.000Z', new Date().toISOString(), new Date().toISOString())
const application = db.prepare("INSERT INTO job_applications (participant_id,offer_id,status,source,applied_at) VALUES (?,?,'active','participant',?)").run(participantId, offer.lastInsertRowid, '2026-08-10T00:00:00.000Z')
db.prepare("INSERT INTO job_application_history (participant_id,offer_id,application_id,event_type,actor_id,created_at) VALUES (?,?,?,'applied',?,?)").run(participantId, offer.lastInsertRowid, application.lastInsertRowid, participantId, '2026-08-10T00:00:00.000Z')

const tokenPayload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 900 })).toString('base64url')
const session = auth.createSession({ id: participantId, email: 'ana@example.com', firstName: 'Ana', lastName: 'Torres', role: 'STUDENT' }, `x.${tokenPayload}.x`)
const noOfferParticipantId = 'participant-without-offer'
db.prepare('INSERT INTO intranet_user_access (bbbsc_user_id, enabled, updated_at) VALUES (?, 1, ?)').run(noOfferParticipantId, new Date().toISOString())
const noOfferSession = auth.createSession({ id: noOfferParticipantId, email: 'leo@example.com', firstName: 'Leo', lastName: 'Díaz', role: 'STUDENT' }, `x.${tokenPayload}.x`)
const staffSession = auth.createSession({ id: 'staff-test-id', email: 'staff@example.com', firstName: 'Staff', lastName: 'BBB', role: 'ADMIN' }, `x.${tokenPayload}.x`)

const app = express()
app.use((req, _res, next) => { req.signedCookies = { bbbsc_session: req.headers['x-test-session'] }; next() })
app.use('/api', participantRouter)
const server = app.listen(0)
const testDirectory = path.resolve(import.meta.dirname, '..', TEST_DIR_NAME)
const serverDirectory = path.resolve(import.meta.dirname, '..')
assert.equal(path.dirname(testDirectory), serverDirectory)
assert.equal(path.basename(testDirectory), TEST_DIR_NAME)

function requestDashboard(sessionId) {
  const address = server.address()
  return new Promise((resolve, reject) => {
    const request = http.request({ hostname: '127.0.0.1', port: address.port, path: '/api/participant/dashboard', headers: { 'x-test-session': sessionId } }, (response) => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => resolve({ status: response.statusCode, body: JSON.parse(body) }))
    })
    request.on('error', reject)
    request.end()
  })
}

try {
  const response = await requestDashboard(session.id)
  assert.equal(response.status, 200)
  assert.equal(response.body.participant.studentCode, 'BBB-001')
  assert.equal(response.body.participant.guruName, 'Laura Pérez')
  assert.equal(response.body.participant.photoUrl, 'https://images.example.com/ana.webp')
  assert.equal(response.body.application.offer.title, 'Front Desk Agent')
  assert.equal(response.body.history.length, 1)
  const emptyResponse = await requestDashboard(noOfferSession.id)
  assert.equal(emptyResponse.status, 200)
  assert.equal(emptyResponse.body.application, null)
  assert.equal(emptyResponse.body.history.length, 0)
  const staffResponse = await requestDashboard(staffSession.id)
  assert.equal(staffResponse.status, 403)
  console.log(JSON.stringify({ participantProfile: true, currentOffer: true, noOfferState: true, applicationHistory: true, staffExcluded: true }))
} finally {
  await new Promise((resolve) => server.close(resolve))
  db.close()
  fs.rmSync(testDirectory, { recursive: true, force: true })
}
