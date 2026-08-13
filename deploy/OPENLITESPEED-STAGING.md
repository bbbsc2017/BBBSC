# OpenLiteSpeed para `new.bbbsc.com`

Esta configuración mantiene la web actual intacta. El frontend de pruebas se sirve desde `current/dist` y únicamente `/api/` se envía al proceso Node de staging en el puerto `4001`.

## 1. Directorios y variables privadas

En la terminal de aaPanel, con un usuario autorizado:

```bash
mkdir -p /www/wwwroot/new.bbbsc.com/shared/server/{data,uploads,backups}
touch /www/wwwroot/new.bbbsc.com/shared/server/.env
chmod 600 /www/wwwroot/new.bbbsc.com/shared/server/.env
```

Completa el `.env` directamente en el VPS. No copies sus valores al chat ni los guardes en Git:

```dotenv
PORT=4001
NODE_ENV=production
ALLOWED_ORIGINS=https://new.bbbsc.com
BBBSC_API_URL=https://api.bbbsc.com
CLIENTIFY_API_KEY=
RECAPTCHA_SECRET_KEY=
RECAPTCHA_MIN_SCORE=0.5
SESSION_SECRET=
VISITS_HASH_SECRET=
DB_DIR=data
UPLOADS_DIR=uploads
OFFER_PDFS_DIR=data/offer-pdfs
```

`SESSION_SECRET` y `VISITS_HASH_SECRET` deben ser valores aleatorios diferentes y largos.

## 2. Aplicación externa para Node

En WebAdmin de OpenLiteSpeed abre el virtual host de `new.bbbsc.com` y entra a **External App → Add**:

- Type: `Web Server`
- Name: `bbbsc-staging-api`
- Address: `127.0.0.1:4001`
- Max Connections: `100`
- Initial Request Timeout: `60`
- Retry Timeout: `0`
- Response Buffering: `No`

Luego crea un contexto en **Context → Add → Proxy**:

- URI: `/api/`
- Web Server: `[VHost Level] bbbsc-staging-api`
- Accessible: `Yes`

## 3. Frontend React y rutas

Configura el Document Root del virtual host como:

```text
/www/wwwroot/new.bbbsc.com/current/dist
```

Activa **Enable Rewrite** y agrega estas reglas después del primer despliegue:

```apache
RewriteEngine On
RewriteRule ^sitemap\.xml$ http://bbbsc-staging-api/api/sitemap.xml [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

La primera regla mantiene el sitemap dinámico. Las demás permiten abrir directamente rutas como `/ofertas/...`, `/blog/...` e `/intranet/login`.

## 4. Evitar indexación del staging

En **Context → Add → Static**:

- URI: `/`
- Location: `$DOC_ROOT/`
- Accessible: `Yes`
- Header Operations:

```text
set X-Robots-Tag noindex, nofollow
set X-Content-Type-Options nosniff
set Referrer-Policy strict-origin-when-cross-origin
set X-Frame-Options SAMEORIGIN
```

Realiza un **Graceful Restart** de OpenLiteSpeed después de guardar.

## 5. GitHub environment `staging`

En el repositorio abre **Settings → Environments** y crea `staging`. Después agrega allí:

Secrets:

- `VPS_HOST=51.79.50.184`
- `VPS_PORT=22` o el puerto SSH real
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_KNOWN_HOSTS`
- `VPS_DEPLOY_PATH=/www/wwwroot/new.bbbsc.com`

Variable:

- `VITE_RECAPTCHA_SITE_KEY` con el identificador público de reCAPTCHA

El workflow exige escribir `STAGING`, despliega solo en `new.bbbsc.com`, usa `bbbsc-server-staging`, valida el puerto `4001` y comprueba que la cabecera `noindex` esté presente.

## 6. Comprobaciones

Después del despliegue revisa:

```bash
pm2 status bbbsc-server-staging
curl -I https://new.bbbsc.com/
curl https://new.bbbsc.com/api/health
```

La primera respuesta debe incluir `X-Robots-Tag: noindex, nofollow`; la API debe responder con `{"ok":true}`.
