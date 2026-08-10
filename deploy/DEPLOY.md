# Despliegue en VPS (OpenLiteSpeed)

El sitio tiene dos partes que se despliegan por separado:

- **Frontend** (`dist/`): archivos estáticos generados por Vite. Los sirve OpenLiteSpeed directamente.
- **Backend** (`server/`): proceso Node persistente que recibe los comentarios del blog y llama a Clientify con la API key (nunca expuesta al navegador). OpenLiteSpeed lo expone por detrás en `/api/`.

## 1. Build del frontend

```bash
npm ci
npm run build
```

Genera `dist/` con HTML, CSS, JS con hash, `robots.txt`, `sitemap.xml` y `favicon.svg`.

## 2. Copiar al VPS

```bash
rsync -avz --delete dist/ usuario@servidor:/var/www/bbbsc.com/dist
rsync -avz --exclude node_modules --exclude .env server/ usuario@servidor:/var/www/bbbsc.com/server
```

En el servidor, dentro de `server/`:

```bash
npm ci --omit=dev
cp .env.example .env    # y completa CLIENTIFY_API_KEY + ALLOWED_ORIGINS=https://bbbsc.com
```

## 3. Backend Node como proceso persistente (pm2)

```bash
npm install -g pm2
cd /var/www/bbbsc.com/server
pm2 start index.js --name bbbsc-server
pm2 save
pm2 startup   # sigue las instrucciones que imprime para que arranque solo al reiniciar el VPS
```

El backend queda escuchando en `http://127.0.0.1:4000` (puerto definido en `.env`).

## 4. OpenLiteSpeed: Virtual Host

En el panel de administración de OpenLiteSpeed (`https://tu-ip:7080`):

1. **Virtual Host → tu sitio → General**: `Document Root` apuntando a `/var/www/bbbsc.com/dist`.
2. **Virtual Host → Rewrite**: activa `Enable Rewrite` y agrega esta regla para que las rutas de React Router (`/blog`, `/programas-culturales/...`, etc.) carguen `index.html` en vez de dar 404 — **excluyendo `/api/`**, que debe ir al backend:

   ```
   RewriteCond %{REQUEST_URI} !^/api/
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ /index.html [L]
   ```

3. **Virtual Host → External App**: crea una External App tipo `Web Server` (proxy) apuntando a `http://127.0.0.1:4000`.
4. **Virtual Host → Context**: agrega un Context tipo `Proxy` con:
   - URI: `/api/`
   - Address: la External App creada en el paso anterior (`http://127.0.0.1:4000`)

   Esto hace que cualquier request a `https://bbbsc.com/api/...` se reenvíe al proceso Node, sin exponer el puerto 4000 al exterior.
5. Guarda y aplica los cambios (`Graceful Restart` en el panel).

## 5. Certificado SSL

Desde el mismo panel: **SSL → Virtual Host SSL**, o usa `certbot` con el plugin de OpenLiteSpeed:

```bash
sudo certbot --webroot -w /var/www/bbbsc.com/dist -d bbbsc.com -d www.bbbsc.com
```

## 6. Actualizaciones futuras

- Frontend: repetir pasos 1 y 2 (build + rsync a `dist/`). No requiere reiniciar nada.
- Backend: si cambia `server/index.js`, hacer rsync de `server/` y correr `pm2 restart bbbsc-server`.

## Alternativa: Nginx

Si en algún momento cambias de OpenLiteSpeed a Nginx, hay un ejemplo de configuración equivalente (frontend estático + proxy de `/api/` al backend Node) en [`nginx.conf.example`](./nginx.conf.example).
