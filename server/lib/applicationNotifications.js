import { spawn } from 'node:child_process'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function configuredRecipients() {
  return (process.env.OFFER_APPLICATION_NOTIFICATION_TO || 'danielgonzalez@bbbsc.com,accounts@bbbsc.com')
    .split(',').map((address) => address.trim().toLowerCase()).filter((address) => EMAIL_REGEX.test(address))
}

function notificationConfig() {
  const from = String(process.env.OFFER_APPLICATION_NOTIFICATION_FROM || 'info@bbbsc.com').trim().toLowerCase()
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

const SANS = "'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

// Misma "tarjeta" de marca que usan los correos reales a participantes
// (apps/api/src/mail/templates/_base.ts en el repo bbbsc: header negro,
// barra dorada, tarjeta blanca con eyebrow flanqueado, footer con
// bbbsc.com/info@bbbsc.com). Este servidor es un proyecto Node aparte sin
// acceso a esos templates TS, así que se replica el HTML en lugar de
// importarlo, para que el aviso interno se vea igual que el resto de la marca.
function infoRow(label, value) {
  return `<tr><td style="padding:12px 0;border-bottom:1px solid #EFEFF1;"><span style="display:block;font-size:10.5px;font-weight:700;color:#A0A0A6;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:4px;font-family:${SANS};">${escapeHtml(label)}</span><span style="display:block;font-size:15px;font-weight:500;color:#18181B;font-family:${SANS};">${escapeHtml(value)}</span></td></tr>`
}

export function buildOfferApplicationEmail(record, config = notificationConfig()) {
  const name = participantName(record)
  const subject = `Nueva postulación: ${name}`
  const appliedAt = formatAppliedAt(record.applied_at)
  const text = [
    'Se registró una nueva postulación a una oferta.', '', `Participante: ${name}`, `Correo: ${cleanHeader(record.participant_email)}`,
    `Oferta: ${cleanHeader(record.title)}`, `Empleador: ${cleanHeader(record.employer)}`, `Sponsor: ${cleanHeader(record.sponsor)}`,
    `Fecha y hora de postulación (Colombia): ${appliedAt}`,
    record.travel_start_date ? `Inicio previsto del viaje: ${cleanHeader(record.travel_start_date)}` : '',
    record.travel_end_date ? `Regreso previsto: ${cleanHeader(record.travel_end_date)}` : '',
    '', 'Ver en Admin: https://admin.bbbsc.com/contenido/ofertas',
  ].filter(Boolean).join('\n')
  const rows = [
    infoRow('Participante', name),
    infoRow('Correo', record.participant_email),
    infoRow('Oferta', record.title),
    infoRow('Empleador', record.employer),
    infoRow('Sponsor', record.sponsor),
    infoRow('Fecha y hora (Colombia)', appliedAt),
    record.travel_start_date ? infoRow('Inicio previsto del viaje', record.travel_start_date) : '',
    record.travel_end_date ? infoRow('Regreso previsto', record.travel_end_date) : '',
  ].filter(Boolean).join('')
  const html = `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nueva postulación a oferta</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#EDEDEF;">
<span style="display:none;max-height:0;max-width:0;opacity:0;overflow:hidden;font-size:1px;">${escapeHtml(name)} se postuló a "${escapeHtml(record.title)}" el ${appliedAt}.</span>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#EDEDEF;border-collapse:collapse;">
<tbody><tr><td align="center" style="padding:48px 16px 56px;">
<table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-collapse:collapse;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
<tbody>
<tr><td style="background-color:#18181B;border-radius:10px 10px 0 0;padding:28px 40px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tbody><tr>
<td style="width:34px;height:34px;background-color:#FFFFFF;border-radius:8px;text-align:center;vertical-align:middle;">
<img src="https://admin.bbbsc.com/icons/icon-192.png" width="34" height="34" alt="BBBSC" style="display:block;width:34px;height:34px;border-radius:8px;">
</td>
<td style="padding-left:11px;vertical-align:middle;"><span style="display:block;font-size:14px;font-weight:700;color:#FFFFFF;letter-spacing:1.5px;line-height:1;font-family:${SANS};">BBBSC</span></td>
</tr></tbody></table>
</td></tr>
<tr><td style="background-color:#F9B000;height:3px;line-height:3px;font-size:0;">&nbsp;</td></tr>
<tr><td style="background-color:#FFFFFF;padding:52px 48px 44px;border-collapse:collapse;">
<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 18px;border-collapse:collapse;"><tbody><tr>
<td style="width:28px;padding-right:12px;"><div style="height:1px;background-color:#E9C158;font-size:0;line-height:0;">&nbsp;</div></td>
<td style="white-space:nowrap;"><span style="font-size:11px;font-weight:700;color:#B8860B;text-transform:uppercase;letter-spacing:2.4px;font-family:${SANS};">NUEVA POSTULACIÓN</span></td>
<td style="width:28px;padding-left:12px;"><div style="height:1px;background-color:#E9C158;font-size:0;line-height:0;">&nbsp;</div></td>
</tr></tbody></table>
<h1 style="margin:0;font-size:26px;font-weight:600;color:#18181B;text-align:center;line-height:1.35;letter-spacing:-0.3px;font-family:${SANS};">Nueva postulación a oferta</h1>
<p style="margin:6px 0 30px;font-size:15px;color:#64748B;text-align:center;font-family:${SANS};">${escapeHtml(name)} acaba de postularse desde el portal BBBSC</p>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-bottom:30px;"><tbody><tr><td style="height:1px;background-color:#EAEAEC;font-size:0;line-height:0;">&nbsp;</td></tr></tbody></table>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #EFEFF1;margin:4px 0 8px;border-collapse:collapse;"><tbody>${rows}</tbody></table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:36px auto 0;"><tbody><tr>
<td align="center" style="border-radius:4px;background-color:#18181B;">
<a href="https://admin.bbbsc.com/contenido/ofertas" style="display:inline-block;padding:16px 42px;font-size:13px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:4px;font-family:${SANS};letter-spacing:1.2px;text-transform:uppercase;">Ver en Admin</a>
</td></tr></tbody></table>
</td></tr>
<tr><td style="background-color:#FAFAFA;border-radius:0 0 10px 10px;padding:22px 40px;border-top:1px solid #EAEAEC;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;"><tbody><tr><td align="center">
<p style="margin:0 0 6px;font-size:12px;color:#A0A0A6;font-family:${SANS};">
<a href="https://bbbsc.com" style="color:#A0A0A6;text-decoration:none;">bbbsc.com</a>
&nbsp;&middot;&nbsp;
<a href="mailto:info@bbbsc.com" style="color:#A0A0A6;text-decoration:none;">info@bbbsc.com</a>
</p>
<p style="margin:0;font-size:11px;color:#C4C4C9;font-family:${SANS};">&copy; ${new Date().getFullYear()} BBBSC &mdash; Todos los derechos reservados.</p>
</td></tr></tbody></table>
</td></tr>
</tbody>
</table>
</td></tr></tbody>
</table>
</body>
</html>`
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
