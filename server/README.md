# bbbsc-server

Backend mínimo (Express) con un solo propósito: recibir los comentarios del blog y crear el contacto correspondiente en Clientify, sin exponer la API key en el navegador.

## Por qué existe

El sitio (`../src`) es una SPA estática. La API key de Clientify **no puede** vivir en ese código porque cualquier visitante podría verla en las herramientas de desarrollador y usarla para leer o escribir en todo el CRM. Este servicio hace esa llamada del lado del servidor, usando la key solo desde una variable de entorno.

## Desarrollo local

```bash
cd server
npm install
cp .env.example .env   # completa CLIENTIFY_API_KEY si el .env no existe ya
npm run dev             # http://localhost:4000
```

El frontend (`npm run dev` en la raíz del proyecto) ya está configurado para redirigir `/api/*` a `http://localhost:4000` durante desarrollo (ver `vite.config.ts`).

## Endpoint

`POST /api/comments`

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phone": "3001234567",
  "comment": "¡Excelente artículo!",
  "postSlug": "como-diligenciar-el-ds-160",
  "postTitle": "Cómo diligenciar correctamente el formulario DS-160"
}
```

Crea un contacto en Clientify (tag `comentario-blog` + `blog-<slug>`, con el comentario guardado en el campo `message`) y responde `{ "ok": true }`. Incluye un límite simple de 5 solicitudes cada 10 minutos por IP para mitigar spam.

## Despliegue en el VPS (OpenLiteSpeed)

Ver [`../deploy/DEPLOY.md`](../deploy/DEPLOY.md) — se ejecuta como proceso Node persistente (con `pm2` o `systemd`) y OpenLiteSpeed lo expone por detrás en `/api/`.
