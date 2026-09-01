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

// Misma plantilla visual del correo de bienvenida/invitación que reciben
// los participantes (apps/api/src/mail/templates/welcome-participant.ts en
// el repo bbbsc: tarjeta oscura #1c1c1c con borde dorado, logo BBB, badge
// "eyebrow", título grande y bloque de datos con filas Label/Valor). Ese
// archivo es TypeScript del repo central y este servidor es un proyecto
// Node aparte sin acceso a él, así que se replica el HTML en lugar de
// importarlo, para que el aviso interno se vea igual a esa plantilla.
function dataRow(label, value, isLast) {
  return `<tr><td style="padding:17px 20px;${isLast ? '' : 'border-bottom:1px solid #323232;'}"><div style="margin-bottom:5px;color:#818181;font-size:9px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;">${escapeHtml(label)}</div><div style="color:#fff;font-size:15px;font-weight:700;word-break:break-word;">${escapeHtml(value)}</div></td></tr>`
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
  const dataItems = [
    ['Participante', name],
    ['Correo', record.participant_email],
    ['Oferta', record.title],
    ['Empleador', record.employer],
    ['Sponsor', record.sponsor],
    ['Fecha y hora (Colombia)', appliedAt],
    ...(record.travel_start_date ? [['Inicio previsto del viaje', record.travel_start_date]] : []),
    ...(record.travel_end_date ? [['Regreso previsto', record.travel_end_date]] : []),
  ]
  const rows = dataItems.map(([label, value], index) => dataRow(label, value, index === dataItems.length - 1)).join('')
  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nueva postulación — BBB Student Center</title>
<style>
  @media only screen and (max-width:600px){
    .bbb-outer{padding:20px 0!important}
    .bbb-card{border-radius:16px!important}
    .bbb-header{padding:18px 20px!important}
    .bbb-header-logo{width:84px!important}
    .bbb-panel-wrap{padding:14px 14px 8px!important}
    .bbb-panel{padding:30px 22px!important}
    .bbb-title{font-size:26px!important;line-height:1.22!important}
    .bbb-intro{font-size:13px!important}
    .bbb-body{padding:20px 22px 32px!important}
    .bbb-data-cell{padding:14px 16px!important}
    .bbb-cta{display:block!important;text-align:center!important}
    .bbb-footer{padding:22px 20px!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eeeeee;padding:40px 15px;" class="bbb-outer"><tr><td align="center">
    <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;background:#1c1c1c;border:1px solid #4b3b13;border-radius:26px;overflow:hidden;box-shadow:0 24px 65px rgba(0,0,0,.20);" class="bbb-card">
      <tr><td style="padding:23px 34px;background:#171717;border-bottom:1px solid #332d20;" class="bbb-header"><table role="presentation" width="100%"><tr>
        <td><img src="https://bbbsc.com/assets/bbb-mark-white-BpLAJUN7.svg" width="105" alt="BBB Student Center" style="display:block;border:0;max-width:105px;height:auto;" class="bbb-header-logo"></td>
        <td align="right" style="color:#f9b000;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Aviso interno</td>
      </tr></table></td></tr>
      <tr><td style="padding:22px 22px 10px;" class="bbb-panel-wrap"><table role="presentation" width="100%" style="border:1px solid #50401a;border-radius:20px;background:#222222;"><tr><td style="padding:44px 38px;" class="bbb-panel">
        <span style="display:inline-block;padding:7px 12px;border:1px solid #68551c;border-radius:50px;background:#302a1b;color:#f9b000;font-size:9px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;">&#9679;&nbsp; Nueva postulación</span>
        <h1 style="margin:19px 0 15px;color:#fff;font-size:36px;line-height:1.14;letter-spacing:-1px;" class="bbb-title">${escapeHtml(name)}<br>se acaba de postular.</h1>
        <p style="max-width:520px;margin:0;color:#bdbdbd;font-size:14px;line-height:1.8;" class="bbb-intro">Se registró una nueva postulación desde el portal BBBSC. A continuación encontrarás los datos del participante y de la oferta.</p>
        <div style="width:50px;height:3px;margin-top:24px;border-radius:50px;background:#f9b000;">&nbsp;</div>
      </td></tr></table></td></tr>
      <tr><td style="padding:22px 40px 42px;" class="bbb-body">
        <h2 style="margin:0 0 15px;color:#fff;font-size:20px;line-height:27px;">Detalles de la postulación</h2>
        <table role="presentation" width="100%" style="background:#202020;border:1px solid #54431b;border-radius:16px;">${rows}</table>
        <div style="padding:24px 0 4px;text-align:center;"><a href="https://admin.bbbsc.com/contenido/ofertas" target="_blank" style="display:inline-block;padding:15px 27px;border-radius:10px;background:#f9b000;color:#161616;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:.4px;" class="bbb-cta">VER EN ADMIN &nbsp; &#8594;</a></div>
        <div style="padding:16px 10px 4px;text-align:center;"><p style="margin:0;color:#888;font-size:11px;line-height:1.7;">Este es un aviso automático. La postulación ya quedó guardada en el sistema.</p></div>
      </td></tr>
      <tr><td align="center" style="padding:25px 30px;background:#111;border-top:1px solid #332d20;" class="bbb-footer"><img src="https://bbbsc.com/assets/bbb-mark-white-BpLAJUN7.svg" width="82" alt="BBB Student Center" style="display:block;border:0;margin:0 auto;"><p style="margin:12px 0 0;color:#686868;font-size:9px;line-height:1.8;">Expertos en Work &amp; Travel y experiencias internacionales.<br><a href="https://bbbsc.com" style="color:#f9b000;text-decoration:none;">www.bbbsc.com</a>&nbsp; &middot; &nbsp;<a href="mailto:info@bbbsc.com" style="color:#f9b000;text-decoration:none;">info@bbbsc.com</a></p></td></tr>
    </table>
  </td></tr></table>
</body></html>`
  const boundary = `bbbsc-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const messageId = `<bbbsc-application-${cleanHeader(record.id)}-${Date.now()}@${config.from.split('@')[1] || 'bbbsc.com'}>`
  // El Subject lleva tildes (p.ej. "postulación"), y un header con bytes UTF-8
  // crudos exige la extensión SMTPUTF8 en el envío SMTP. El LMTP local de
  // Dovecot no la ofrece, así que Postfix rebotaba el correo de inmediato
  // (dsn=5.6.7 "SMTPUTF8 is required"). Se codifica como encoded-word RFC 2047
  // (7-bit ASCII) para que la entrega local funcione sin depender de SMTPUTF8.
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`
  const headers = [`From: BBB Student Center <${config.from}>`, `To: ${config.recipients.join(', ')}`, `Subject: ${encodedSubject}`, `Date: ${new Date().toUTCString()}`, `Message-ID: ${messageId}`, 'MIME-Version: 1.0', `Content-Type: multipart/alternative; boundary="${boundary}"`]
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
