# BBB Student Center — bbbsc.com

Sitio web de BBB Student Center: agencia de intercambios especializada en programas Work & Travel, prácticas profesionales, intercambio docente y programas académicos en Estados Unidos, España, Asia, Canadá, Polonia y Australia.

Construido con React 19 + TypeScript + Vite + Tailwind CSS v4 + react-router-dom. SPA completamente responsive, optimizada para SEO/SEM (meta tags dinámicos por página, Open Graph, JSON-LD, sitemap.xml, robots.txt).

## Desarrollo

```bash
npm install
npm run dev
```

El blog tiene un formulario de comentarios que llama a un backend propio (`server/`) para crear el contacto en Clientify sin exponer la API key en el navegador. Para probarlo en local, en otra terminal:

```bash
cd server
npm install
cp .env.example .env   # completa CLIENTIFY_API_KEY
npm run dev             # http://localhost:4000
```

Vite ya redirige `/api/*` a ese servicio en desarrollo (ver `vite.config.ts`). Sin el backend corriendo, el resto del sitio funciona igual; solo falla el envío de comentarios.

## Build de producción

```bash
npm run build   # tsc -b && vite build -> genera dist/
npm run preview # sirve dist/ localmente para verificar el build
```

## Estructura

- `src/data/` — contenido de programas culturales, académicos, universidades, FAQ y posts del blog.
- `src/components/` — layout (navbar, footer), componentes de UI reutilizables y secciones de la home.
- `src/pages/` — páginas por ruta (home, índices y detalle de programas/universidades, blog, contacto, legales).
- `src/components/Seo.tsx` — meta tags, Open Graph y JSON-LD por página.
- `public/robots.txt`, `public/sitemap.xml` — SEO técnico.
- `server/` — backend Node/Express para el formulario de comentarios del blog (integración con Clientify).

## Despliegue

Ver [`deploy/DEPLOY.md`](./deploy/DEPLOY.md) para el proceso de build + subida a un VPS con OpenLiteSpeed (frontend estático + backend Node).
