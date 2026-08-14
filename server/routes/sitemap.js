import { Router } from 'express'
import { getDb } from '../db.js'

export const sitemapRouter = Router()

const SITE_URL = 'https://bbbsc.com'
const staticPaths = [
  '/', '/work-and-travel-usa', '/trainee-and-internship', '/espana-ti', '/asia', '/teacher-exchange', '/teacher-assistant', '/aupair',
  '/work-and-travel-usa/inscripcion', '/asia/inscripcion', '/canada', '/polonia', '/australia', '/portugal', '/universidades', '/troy-university',
  '/gisma-university', '/woosong-university', '/vistula', '/cape-breton', '/contacto', '/trabaja-con-nosotros', '/blog', '/ofertas',
  '/ofertas/work-travel-usa', '/ofertas/work-travel-asia', '/ofertas/trainee-internship', '/ofertas/teacher-assistant', '/ofertas/teacher-exchange',
]

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character])
}

function slugify(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function urlEntry(path, lastModified, changeFrequency = 'monthly', priority = '0.7') {
  return `<url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc>${lastModified ? `<lastmod>${escapeXml(new Date(lastModified).toISOString())}</lastmod>` : ''}<changefreq>${changeFrequency}</changefreq><priority>${priority}</priority></url>`
}

sitemapRouter.get('/sitemap.xml', (_req, res) => {
  const db = getDb()
  const posts = db.prepare("SELECT slug, updated_at FROM posts WHERE status = 'published' ORDER BY published_at DESC").all()
  const offers = db.prepare("SELECT slug, program, sponsor, updated_at FROM job_offers WHERE status != 'draft' ORDER BY updated_at DESC").all()

  const entries = [
    ...staticPaths.map((path) => urlEntry(path, null, path === '/ofertas' || path === '/blog' ? 'daily' : 'monthly', path === '/' ? '1.0' : '0.8')),
    ...posts.map((post) => urlEntry(`/blog/${post.slug}`, post.updated_at, 'weekly', '0.7')),
    ...offers.map((offer) => urlEntry(`/ofertas/${offer.program}/${slugify(offer.sponsor)}/${offer.slug}`, offer.updated_at, 'daily', '0.8')),
  ]

  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`)
})
