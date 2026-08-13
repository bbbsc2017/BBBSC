# API e intranet de BBBSC

Servidor Express de bbbsc.com. Mantiene las credenciales privadas fuera del navegador y concentra autenticación, usuarios, roles, entradas, comentarios, medios, ofertas, formularios, Clientify, analítica y sitemap.

## Desarrollo

```bash
npm ci
copy .env.example .env
npm run dev
```

El servidor escucha en `http://localhost:4000` por defecto. Revisa `server/.env.example` y completa al menos los secretos de sesión, la conexión con la API central y las credenciales de las integraciones que vayas a probar.

## Protección de formularios públicos

Estos envíos requieren un token reCAPTCHA nuevo y conservan límites de solicitudes por IP:

- `POST /api/comments`
- `POST /api/interest-forms`
- `POST /api/registrations`

Configura `RECAPTCHA_SECRET_KEY`. Si falta, los formularios se bloquean de forma segura con un error de configuración; no se permite enviar datos sin validación.

## Datos persistentes

- Base y estado de la intranet: `server/data/`.
- Medios y documentos: `server/uploads/`.
- Copias de seguridad: `server/backups/`.

Estas rutas no se incluyen en Git. En producción deben vivir en directorios compartidos entre versiones y tener copias de seguridad periódicas.

## Producción

El proceso se ejecuta con PM2 y Nginx/aaPanel publica la SPA, redirige `/api/` al servidor y sirve el sitemap dinámico. Consulta [`../deploy/DEPLOY.md`](../deploy/DEPLOY.md) para la instalación, los secretos de GitHub, la reversión automática y la migración segura.
