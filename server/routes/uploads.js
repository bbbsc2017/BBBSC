import { Router } from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import { requirePermission } from '../auth.js'
import { PERMISSIONS } from '../lib/permissions.js'

export const UPLOADS_DIR = path.join(import.meta.dirname, '..', process.env.UPLOADS_DIR || 'uploads')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const MIME_EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = MIME_EXTENSIONS[file.mimetype] || ''
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!MIME_EXTENSIONS[file.mimetype]) {
      return cb(new Error('invalid_type'))
    }
    cb(null, true)
  },
})

function hasValidImageSignature(filePath, mimetype) {
  const buffer = Buffer.alloc(12)
  const descriptor = fs.openSync(filePath, 'r')
  try {
    fs.readSync(descriptor, buffer, 0, buffer.length, 0)
  } finally {
    fs.closeSync(descriptor)
  }

  if (mimetype === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  if (mimetype === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (mimetype === 'image/gif') {
    const signature = buffer.subarray(0, 6).toString('ascii')
    return signature === 'GIF87a' || signature === 'GIF89a'
  }
  if (mimetype === 'image/webp') {
    return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  }
  return false
}

export const adminUploadsRouter = Router()

adminUploadsRouter.use(requirePermission(PERMISSIONS.MEDIA_VIEW))

const SAFE_MEDIA_FILENAME = /^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/i

adminUploadsRouter.get('/uploads', (_req, res) => {
  const files = fs
    .readdirSync(UPLOADS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && SAFE_MEDIA_FILENAME.test(entry.name))
    .map((entry) => {
      const stats = fs.statSync(path.join(UPLOADS_DIR, entry.name))
      return {
        name: entry.name,
        url: `/api/uploads/${entry.name}`,
        size: stats.size,
        updatedAt: stats.mtime.toISOString(),
      }
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  res.json({ ok: true, files })
})

adminUploadsRouter.post('/uploads', requirePermission(PERMISSIONS.MEDIA_MANAGE), (req, res) => {
  upload.single('file')(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ ok: false, error: 'El archivo supera el tamaño máximo permitido (5MB).' })
    }
    if (error) {
      return res.status(400).json({ ok: false, error: 'Formato de imagen no permitido. Usa JPG, PNG, WEBP o GIF.' })
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No se recibió ningún archivo.' })
    }
    if (!hasValidImageSignature(req.file.path, req.file.mimetype)) {
      fs.rmSync(req.file.path, { force: true })
      return res.status(400).json({ ok: false, error: 'El contenido del archivo no corresponde a una imagen válida.' })
    }
    res.status(201).json({ ok: true, url: `/api/uploads/${req.file.filename}` })
  })
})


adminUploadsRouter.delete('/uploads/:filename', requirePermission(PERMISSIONS.MEDIA_MANAGE), (req, res) => {
  const { filename } = req.params
  if (!SAFE_MEDIA_FILENAME.test(filename)) {
    return res.status(400).json({ ok: false, error: 'Nombre de archivo invalido.' })
  }

  const filePath = path.join(UPLOADS_DIR, filename)
  if (!fs.existsSync(filePath)) return res.status(404).json({ ok: false, error: 'Archivo no encontrado.' })

  fs.rmSync(filePath)
  return res.json({ ok: true })
})
