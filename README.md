# BBB Student Center — bbbsc.com

Sitio web, catálogo de ofertas e intranet de BBB Student Center. La experiencia pública presenta programas culturales y académicos, universidades, BBB News y oportunidades laborales; la intranet administra contenido, usuarios, roles, medios, comentarios, formularios, analítica y ofertas.

## Stack

- React 19, TypeScript, Vite 8 y Tailwind CSS 4.
- React Router para rutas públicas y privadas.
- Node.js 22 + Express para autenticación, contenido dinámico, Clientify, ofertas y administración.
- Base local persistente en `server/data/` y archivos en `server/uploads/`; ambos están ignorados por Git.

## Desarrollo local

Requiere Node.js 22.

```bash
npm ci
npm run dev
```

En otra terminal:

```bash
cd server
npm ci
copy .env.example .env
npm run dev
```

El frontend se abre en `http://localhost:5173` y redirige `/api/*` al servidor local. Completa las variables del servidor antes de probar autenticación, Clientify o los formularios protegidos.

## Variables importantes

- Frontend: `VITE_RECAPTCHA_SITE_KEY`.
- Servidor: `SESSION_SECRET`, conexión con la API central de BBBSC, Clientify y `RECAPTCHA_SECRET_KEY`.
- `RECAPTCHA_MIN_SCORE` permite ajustar el umbral de reCAPTCHA; el valor recomendado inicial es `0.5`.

No subas archivos `.env`, bases de datos, copias de seguridad ni archivos cargados por usuarios. Usa los ejemplos incluidos como guía.

## Verificación

```bash
npm run lint
npm run build
cd server
npm audit --omit=dev
```

La automatización de GitHub repite estas comprobaciones en cada cambio propuesto y antes de un despliegue.

## SEO y seguridad

- Metadatos, canonical, Open Graph, Twitter Cards y JSON-LD por página.
- Sitemap dinámico en `/sitemap.xml` mediante `/api/sitemap.xml`.
- `robots.txt` excluye la intranet y la API.
- Comentarios, formularios de interés e inscripción pública usan reCAPTCHA y límites por IP.
- La intranet requiere sesión, permisos por rol y no se indexa.

## Despliegue

Consulta [`deploy/DEPLOY.md`](./deploy/DEPLOY.md). La migración está diseñada para probarse primero en un subdominio, conservar la web actual y desplegar versiones reversibles en el VPS. No elimines la instalación existente de aaPanel antes de validar la nueva versión.
