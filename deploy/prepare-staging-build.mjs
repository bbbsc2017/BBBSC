import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const indexPath = path.join(distDir, 'index.html')
const htaccessPath = path.join(distDir, '.htaccess')
const robotsMeta = '<meta name="robots" content="noindex, nofollow">'

let html = await readFile(indexPath, 'utf8')

if (!html.includes(robotsMeta)) {
  const withRobotsMeta = html.replace(/<head([^>]*)>/i, `$&\n    ${robotsMeta}`)

  if (withRobotsMeta === html) {
    throw new Error('No se encontró la etiqueta <head> en dist/index.html')
  }

  html = withRobotsMeta
  await writeFile(indexPath, html, 'utf8')
}

await writeFile(
  htaccessPath,
  [
    'RewriteEngine On',
    'RewriteCond %{REQUEST_URI} !^/api/',
    'RewriteCond %{REQUEST_FILENAME} !-f',
    'RewriteCond %{REQUEST_FILENAME} !-d',
    'RewriteRule . /index.html [L]',
    '',
  ].join('\n'),
  'utf8',
)

console.log('Compilación de staging preparada con noindex y fallback SPA.')
