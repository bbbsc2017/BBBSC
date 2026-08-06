# BBB Student Center — bbbsc.com

Sitio web de BBB Student Center: agencia de intercambios especializada en programas Work & Travel, prácticas profesionales, intercambio docente y programas académicos en Estados Unidos, España, Asia, Canadá, Polonia y Australia.

Construido con React 19 + TypeScript + Vite + Tailwind CSS v4 + react-router-dom. SPA completamente responsive, optimizada para SEO/SEM (meta tags dinámicos por página, Open Graph, JSON-LD, sitemap.xml, robots.txt).

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build   # tsc -b && vite build -> genera dist/
npm run preview # sirve dist/ localmente para verificar el build
```

## Estructura

- `src/data/` — contenido de programas culturales, académicos, universidades y FAQ.
- `src/components/` — layout (navbar, footer), componentes de UI reutilizables y secciones de la home.
- `src/pages/` — páginas por ruta (home, índices y detalle de programas/universidades, contacto, legales).
- `src/components/Seo.tsx` — meta tags, Open Graph y JSON-LD por página.
- `public/robots.txt`, `public/sitemap.xml` — SEO técnico.

## Despliegue

Ver [`deploy/DEPLOY.md`](./deploy/DEPLOY.md) para el proceso de build + subida a un VPS con Nginx.
