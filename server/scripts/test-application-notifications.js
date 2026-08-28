import assert from 'node:assert/strict'
import { buildOfferApplicationEmail } from '../lib/applicationNotifications.js'

const { subject, raw } = buildOfferApplicationEmail({
  id: 42,
  participant_first_name: 'Ana <Prueba>',
  participant_last_name: 'González',
  participant_email: 'ana@example.com',
  title: 'Lifeguard',
  employer: 'Blue Water Resort',
  sponsor: 'InterExchange',
  travel_start_date: '2027-05-20',
  travel_end_date: '2027-08-20',
  applied_at: '2026-08-28T15:30:00.000Z',
}, { from: 'accounts@bbbsc.com', recipients: ['danielgonzalez@bbbsc.com', 'accounts@bbbsc.com'] })

assert.equal(subject, 'Nueva postulación: Ana <Prueba> González')
assert.match(raw, /From: BBB Student Center <accounts@bbbsc\.com>/)
assert.match(raw, /To: danielgonzalez@bbbsc\.com, accounts@bbbsc\.com/)
assert.match(raw, /Oferta: Lifeguard/)
assert.match(raw, /Empleador: Blue Water Resort/)
assert.match(raw, /Sponsor: InterExchange/)
assert.match(raw, /Ana &lt;Prueba&gt; González/)

console.log('OK: plantilla de notificación de aplicación validada')
