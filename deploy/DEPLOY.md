# Despliegue seguro de BBBSC en aaPanel

La aplicación tiene dos partes: el frontend compilado en `dist/` y la API Node de `server/`. El workflow conserva versiones anteriores y mantiene separados el archivo `.env`, la base SQLite y los archivos subidos.

## No elimines todavía la web actual

No borres el sitio de aaPanel ni la instalación de WordPress antes del cambio. La migración recomendada es:

1. Crear un respaldo completo desde aaPanel: archivos, base de datos y configuración del sitio.
2. Probar esta aplicación en `new.bbbsc.com` siguiendo [`OPENLITESPEED-STAGING.md`](./OPENLITESPEED-STAGING.md).
3. Configurar la API, Clientify, reCAPTCHA, acceso a la intranet y certificados.
4. Verificar rutas antiguas y códigos QR.
5. Cambiar únicamente el `Document Root` y las reglas proxy del sitio existente.
6. Conservar el respaldo de WordPress al menos 30 días.

Eliminar el sitio en aaPanel también puede eliminar configuración SSL, logs, reglas y archivos. No es necesario para sustituir el contenido.

## 1. Preparar el VPS una sola vez

Ejemplo usando `/www/wwwroot/bbbsc.com`:

```bash
sudo mkdir -p /www/wwwroot/bbbsc.com/{releases,shared/server/data,shared/server/uploads}
sudo chown -R DEPLOY_USER:DEPLOY_USER /www/wwwroot/bbbsc.com
cd /www/wwwroot/bbbsc.com/shared/server
touch .env
chmod 600 .env
```

Instala Node.js 22, npm, rsync y PM2 en el VPS. Completa `shared/server/.env` tomando como base `server/.env.example`:

- `CLIENTIFY_API_KEY`
- `RECAPTCHA_SECRET_KEY`
- `RECAPTCHA_MIN_SCORE=0.5`
- `SESSION_SECRET`
- `VISITS_HASH_SECRET`
- `BBBSC_API_URL=https://api.bbbsc.com`
- `ALLOWED_ORIGINS=https://bbbsc.com,https://www.bbbsc.com`
- `NODE_ENV=production`

La clave secreta de reCAPTCHA nunca debe guardarse en GitHub ni en variables `VITE_*`.

## 2. Configurar GitHub

En `Settings → Secrets and variables → Actions` crea:

Secrets:

- `VPS_HOST`: IP o host del VPS.
- `VPS_PORT`: normalmente `22`.
- `VPS_USER`: usuario SSH limitado al directorio del sitio.
- `VPS_SSH_KEY`: clave privada SSH exclusiva para despliegue.
- `VPS_KNOWN_HOSTS`: línea `known_hosts` verificada del VPS; evita aceptar silenciosamente un servidor impostor.
- `VPS_DEPLOY_PATH`: `/www/wwwroot/bbbsc.com` o `/var/www/bbbsc.com`.

Variable pública:

- `VITE_RECAPTCHA_SITE_KEY`: identificador público de la clave de reCAPTCHA.

Crea el environment `production` y, de ser posible, exige aprobación manual. El despliegue también solicita escribir `DESPLEGAR` y nunca se ejecuta automáticamente con un push.

## 3. Configurar aaPanel

Si el sitio usa Nginx, adapta [`aapanel-nginx.conf.example`](./aapanel-nginx.conf.example). El punto importante es:

```nginx
root /www/wwwroot/bbbsc.com/current/dist;
```

`/api/` debe enviarse a `http://127.0.0.1:4000`, y las demás rutas deben usar `index.html` como fallback. Conserva las líneas SSL creadas por aaPanel.

Este VPS usa OpenLiteSpeed. Para el subdominio de pruebas utiliza la guía específica [`OPENLITESPEED-STAGING.md`](./OPENLITESPEED-STAGING.md): puerto `4001`, proceso `bbbsc-server-staging`, cabecera `noindex` y datos independientes. La producción conservará el puerto `4000`.

Los ejemplos Nginx se conservan solo como referencia para una posible migración futura; no deben aplicarse en el servidor actual.

## 4. Primer despliegue

1. Ejecuta primero la acción `Verificar BBBSC`.
2. Abre `Desplegar BBBSC al VPS` en GitHub Actions.
3. Usa `Run workflow`, escribe `DESPLEGAR` y aprueba el environment.
4. La acción crea `releases/<commit>`, instala dependencias del servidor, cambia el enlace `current`, reinicia PM2 y comprueba la web y `/api/health`.

## 5. Reversión

El workflow conserva las cinco versiones más recientes. Para volver a una versión anterior:

```bash
cd /www/wwwroot/bbbsc.com
ln -sfn /www/wwwroot/bbbsc.com/releases/COMMIT_ANTERIOR current.next
mv -Tf current.next current
cd current/server
pm2 restart bbbsc-server --update-env
```

La base, los medios y `.env` no cambian durante una reversión porque viven en `shared/server/`.

## 6. Lista de comprobación antes de cambiar producción

- Inicio, programas, universidades, blog y ofertas cargan por HTTPS.
- Los QR y rutas antiguas redirigen correctamente.
- Inicio de sesión, 2FA y roles funcionan.
- Formularios breves, inscripción y comentarios superan reCAPTCHA y llegan a Clientify.
- Las aplicaciones a ofertas funcionan para un participante activo.
- `robots.txt` y `sitemap.xml` responden con código 200.
- `api.bbbsc.com` está accesible desde el VPS.
- Existe respaldo probado de WordPress y de su base de datos.
