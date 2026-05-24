import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const dataDir = process.env.CMS_DATA_DIR || path.join(rootDir, '.render-data')
const contentPath = path.join(dataDir, 'cms-data', 'content.json')
const uploadDir = path.join(dataDir, 'uploads')
const port = Number(process.env.PORT || 4174)
const adminPassword = process.env.CMS_ADMIN_PASSWORD || 'KnightsDemo2026!'
const sessions = new Map()

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end(JSON.stringify(payload))
}

function parseCookies(request) {
  return Object.fromEntries(
    (request.headers.cookie || '')
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=')
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
      }),
  )
}

function isHttps(request) {
  return request.headers['x-forwarded-proto'] === 'https'
}

function setSessionCookie(response, sessionId) {
  const secure = isHttps(response.req) ? '; Secure' : ''
  response.setHeader('Set-Cookie', `knights_session=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax${secure}`)
}

function clearSessionCookie(response) {
  response.setHeader('Set-Cookie', 'knights_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0')
}

function isAdmin(request) {
  const sessionId = parseCookies(request).knights_session
  return Boolean(sessionId && sessions.get(sessionId))
}

async function readBody(request, maxBytes = 12 * 1024 * 1024) {
  const chunks = []
  let total = 0
  for await (const chunk of request) {
    total += chunk.length
    if (total > maxBytes) {
      throw new Error('Request body too large')
    }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

async function readJsonBody(request) {
  const body = await readBody(request, 3 * 1024 * 1024)
  return JSON.parse(body.toString('utf8') || '{}')
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function writeJsonFile(filePath, payload) {
  await ensureDir(path.dirname(filePath))
  const tmpPath = `${filePath}.tmp`
  await fs.writeFile(tmpPath, `${JSON.stringify(payload, null, 2)}\n`)
  await fs.rename(tmpPath, filePath)
}

function safeJoin(base, target) {
  const resolved = path.resolve(base, target.replace(/^\/+/, ''))
  if (!resolved.startsWith(path.resolve(base))) return null
  return resolved
}

async function serveFile(response, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const contentType = mimeTypes[ext] || 'application/octet-stream'
  const stat = await fs.stat(filePath)
  response.writeHead(200, {
    'Content-Length': stat.size,
    'Content-Type': contentType,
  })
  createReadStream(filePath).pipe(response)
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=([^;]+)/)
  if (!boundaryMatch) return null
  const boundary = Buffer.from(`--${boundaryMatch[1]}`)
  const start = buffer.indexOf(boundary)
  if (start === -1) return null
  let offset = start + boundary.length + 2
  const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), offset)
  if (headerEnd === -1) return null

  const headers = buffer.slice(offset, headerEnd).toString('utf8')
  const filenameMatch = headers.match(/filename="([^"]+)"/)
  const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i)
  const dataStart = headerEnd + 4
  const nextBoundary = buffer.indexOf(Buffer.from('\r\n--' + boundaryMatch[1]), dataStart)
  if (nextBoundary === -1) return null

  return {
    filename: filenameMatch?.[1] || 'upload',
    mimeType: contentTypeMatch?.[1] || 'application/octet-stream',
    data: buffer.slice(dataStart, nextBoundary),
  }
}

async function handleApi(request, response, pathname) {
  if (pathname === '/api/content.php' || pathname === '/api/content') {
    if (request.method === 'GET') {
      try {
        const raw = await fs.readFile(contentPath, 'utf8')
        response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' })
        response.end(raw)
      } catch {
        sendJson(response, 200, { configured: false, message: 'No CMS content has been published yet.' })
      }
      return
    }

    if (request.method === 'POST') {
      if (!isAdmin(request)) {
        sendJson(response, 401, { error: 'Not authenticated' })
        return
      }
      try {
        const payload = await readJsonBody(request)
        if (!Array.isArray(payload.bikes)) {
          sendJson(response, 400, { error: 'Content must include a bikes array' })
          return
        }
        const nextPayload = { ...payload, version: payload.version || 1, updatedAt: new Date().toISOString() }
        await writeJsonFile(contentPath, nextPayload)
        sendJson(response, 200, { ok: true, updatedAt: nextPayload.updatedAt })
      } catch (error) {
        sendJson(response, 400, { error: error.message || 'Unable to save CMS content' })
      }
      return
    }
  }

  if (pathname === '/api/login.php' || pathname === '/api/login') {
    if (request.method !== 'POST') {
      sendJson(response, 405, { error: 'Method not allowed' })
      return
    }
    try {
      const payload = await readJsonBody(request)
      if (payload.password !== adminPassword) {
        sendJson(response, 401, { error: 'Invalid password' })
        return
      }
      const sessionId = crypto.randomBytes(24).toString('hex')
      sessions.set(sessionId, true)
      setSessionCookie(response, sessionId)
      sendJson(response, 200, { ok: true })
    } catch {
      sendJson(response, 400, { error: 'Invalid login request' })
    }
    return
  }

  if (pathname === '/api/logout.php' || pathname === '/api/logout') {
    const sessionId = parseCookies(request).knights_session
    if (sessionId) sessions.delete(sessionId)
    clearSessionCookie(response)
    sendJson(response, 200, { ok: true })
    return
  }

  if (pathname === '/api/upload.php' || pathname === '/api/upload') {
    if (!isAdmin(request)) {
      sendJson(response, 401, { error: 'Not authenticated' })
      return
    }
    if (request.method !== 'POST') {
      sendJson(response, 405, { error: 'Method not allowed' })
      return
    }
    try {
      const buffer = await readBody(request, 100 * 1024 * 1024)
      const file = parseMultipart(buffer, request.headers['content-type'] || '')
      if (!file) {
        sendJson(response, 400, { error: 'No file uploaded' })
        return
      }
      const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']
      if (!supportedTypes.includes(file.mimeType)) {
        sendJson(response, 400, { error: 'Only JPG, PNG, WebP, GIF, MP4, WebM, MOV and M4V files are supported' })
        return
      }
      const ext = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'video/quicktime': '.mov',
        'video/x-m4v': '.m4v',
      }[file.mimeType]
      const baseName = path.basename(file.filename, path.extname(file.filename)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'image'
      const month = new Date().toISOString().slice(0, 7).replace('-', '/')
      const filename = `${month}/${baseName}-${crypto.randomBytes(4).toString('hex')}${ext}`
      const target = path.join(uploadDir, filename)
      await ensureDir(path.dirname(target))
      await fs.writeFile(target, file.data)
      sendJson(response, 200, { ok: true, type: file.mimeType.startsWith('video/') ? 'video' : 'image', url: `/uploads/${filename}` })
    } catch (error) {
      sendJson(response, 400, { error: error.message || 'Upload failed' })
    }
    return
  }

  sendJson(response, 404, { error: 'API endpoint not found' })
}

async function handleRequest(request, response) {
  response.req = request
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  const pathname = decodeURIComponent(url.pathname)

  try {
    if (pathname.startsWith('/api/')) {
      await handleApi(request, response, pathname)
      return
    }

    if (pathname.startsWith('/uploads/')) {
      const target = safeJoin(uploadDir, pathname.replace('/uploads/', ''))
      if (target) {
        await serveFile(response, target)
        return
      }
    }

    const staticPath = pathname === '/' ? '/index.html' : pathname
    const target = safeJoin(distDir, staticPath)
    if (target) {
      try {
        await serveFile(response, target)
        return
      } catch {
        await serveFile(response, path.join(distDir, 'index.html'))
        return
      }
    }

    await serveFile(response, path.join(distDir, 'index.html'))
  } catch (error) {
    if (!response.headersSent) {
      sendJson(response, 500, { error: error.message || 'Server error' })
    } else {
      response.destroy(error)
    }
  }
}

createServer(handleRequest).listen(port, () => {
  console.log(`Knights Motorcycles server listening on ${port}`)
})
