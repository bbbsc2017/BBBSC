import { spawn } from 'node:child_process'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function configuredRecipients() {
  return (process.env.OFFER_APPLICATION_NOTIFICATION_TO || 'danielgonzalez@bbbsc.com,accounts@bbbsc.com')
    .split(',').map((address) => address.trim().toLowerCase()).filter((address) => EMAIL_REGEX.test(address))
}

function notificationConfig() {
  const from = String(process.env.OFFER_APPLICATION_NOTIFICATION_FROM || 'accounts@bbbsc.com').trim().toLowerCase()
  return { enabled: process.env.OFFER_APPLICATION_NOTIFICATION_ENABLED === 'true', from: EMAIL_REGEX.test(from) ? from : '', recipients: configuredRecipients() }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function cleanHeader(value) { return String(value ?? '').replace(/[\r\n]+/g, ' ').trim() }
function participantName(record) { return cleanHeader(`${record.participant_first_name || ''} ${record.participant_last_name || ''}`) || cleanHeader(record.participant_email) }

function formatAppliedAt(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return cleanHeader(value)
  return new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' }).format(date)
}

function detailRow(label, value) {
  return `<tr><td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600">${escapeHtml(label)}</td><td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;color:#111827">${escapeHtml(value)}</td></tr>`
}

export function buildOfferApplicationEmail(record, config = notificationConfig()) {
  const name = participantName(record)
  const subject = `Nueva postulación: ${name}`
  const text = [
    'Se registró una nueva postulación a una oferta.', '', `Participante: ${name}`, `Correo: ${cleanHeader(record.participant_email)}`,
    `Oferta: ${cleanHeader(record.title)}`, `Empleador: ${cleanHeader(record.employer)}`, `Sponsor: ${cleanHeader(record.sponsor)}`,
    `Fecha y hora de postulación (Colombia): ${formatAppliedAt(record.applied_at)}`,
    record.travel_start_date ? `Inicio previsto del viaje: ${cleanHeader(record.travel_start_date)}` : '',
    record.travel_end_date ? `Regreso previsto: ${cleanHeader(record.travel_end_date)}` : '',
  ].filter(Boolean).join('\n')
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827"><main style="max-width:640px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden"><header style="padding:24px;background:#17333a;color:#ffffff"><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f3c64e">BBB Student Center</p><h1 style="margin:0;font-size:22px">Nueva postulación a oferta</h1></header><section style="padding:24px"><p style="margin-top:0">${escapeHtml(name)} acaba de postularse a una oferta desde el portal BBBSC.</p><table style="width:100%;border-collapse:collapse;background:#fafafa;border:1px solid #e5e7eb;border-radius:8px">${detailRow('Participante', name)}${detailRow('Correo', record.participant_email)}${detailRow('Oferta', record.title)}${detailRow('Empleador', record.employer)}${detailRow('Sponsor', record.sponsor)}${detailRow('Fecha y hora (Colombia)', formatAppliedAt(record.applied_at))}${record.travel_start_date ? detailRow('Inicio previsto del viaje', record.travel_start_date) : ''}${record.travel_end_date ? detailRow('Regreso previsto', record.travel_end_date) : ''}</table></section></main></body></html>`
  const boundary = `bbbsc-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const messageId = `<bbbsc-application-${cleanHeader(record.id)}-${Date.now()}@${config.from.split('@')[1] || 'bbbsc.com'}>`
  const headers = [`From: BBB Student Center <${config.from}>`, `To: ${config.recipients.join(', ')}`, `Subject: ${subject}`, `Date: ${new Date().toUTCString()}`, `Message-ID: ${messageId}`, 'MIME-Version: 1.0', `Content-Type: multipart/alternative; boundary="${boundary}"`]
  const raw = `${headers.join('\r\n')}\r\n\r\n--${boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${text}\r\n--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${html}\r\n--${boundary}--\r\n`
  return { subject, raw }
}

function deliverWithSendmail(raw, config) {
  const sendmailPath = process.env.SENDMAIL_PATH || '/usr/sbin/sendmail'
  return new Promise((resolve, reject) => {
    const process = spawn(sendmailPath, ['-i', '-f', config.from, ...config.recipients], { stdio: ['pipe', 'ignore', 'pipe'] })
    let stderr = ''
    process.stderr.on('data', (chunk) => { stderr += chunk })
    process.once('error', reject)
    process.once('close', (code) => code === 0 ? resolve() : reject(new Error(`sendmail_exit_${code}${stderr ? `: ${stderr.trim()}` : ''}`)))
    process.stdin.end(raw)
  })
}

// La aplicación queda guardada primero en la API central. Un fallo del aviso
// nunca invalida la postulación que ya confirmó el participante.
export async function sendOfferApplicationNotification(record) {
  const config = notificationConfig()
  if (!config.enabled) return { status: 'disabled' }
  if (!config.from || config.recipients.length === 0) throw new Error('notification_mail_configuration_invalid')
  const message = buildOfferApplicationEmail(record, config)
  await deliverWithSendmail(message.raw, config)
  return { status: 'sent' }
}
