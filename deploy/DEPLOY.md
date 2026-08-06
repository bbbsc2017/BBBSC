# Despliegue en VPS

## 1. Build de producción

```bash
npm ci
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos optimizados (HTML, CSS, JS con hash, `robots.txt`, `sitemap.xml`, `favicon.svg`).

## 2. Copiar al VPS

```bash
rsync -avz --delete dist/ usuario@servidor:/var/www/bbbsc.com/dist
```

## 3. Nginx

Usar [`nginx.conf.example`](./nginx.conf.example) como base: incluye redirección a HTTPS, fallback de rutas para el SPA (`try_files ... /index.html`, necesario porque react-router-dom maneja el ruteo en el cliente), cache larga para `/assets/` (los archivos llevan hash en el nombre) y compresión gzip.

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/bbbsc.com
sudo ln -s /etc/nginx/sites-available/bbbsc.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4. Certificado SSL

```bash
sudo certbot --nginx -d bbbsc.com -d www.bbbsc.com
```

## 5. Actualizaciones futuras

Repetir los pasos 1 y 2 (build + rsync) en cada despliegue. No se requiere reiniciar Nginx salvo que cambie `nginx.conf.example`.
