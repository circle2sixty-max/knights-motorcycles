import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const isProduction = process.env.NODE_ENV === 'production'
const configuredAdminPassword = (process.env.CMS_ADMIN_PASSWORD || '').trim()
const hasConfiguredDataDir = Boolean((process.env.CMS_DATA_DIR || '').trim())
if (isProduction && !configuredAdminPassword) {
  console.error('CMS_ADMIN_PASSWORD is required in production. Set a strong admin password before starting the CMS server.')
  process.exit(1)
}
if (isProduction && !hasConfiguredDataDir) {
  console.error('CMS_DATA_DIR is required in production so customer enquiries are stored on a persistent disk or database-backed volume.')
  process.exit(1)
}

const dataDir = process.env.CMS_DATA_DIR || path.join(rootDir, '.render-data')
const contentPath = path.join(dataDir, 'cms-data', 'content.json')
const leadsPath = path.join(dataDir, 'cms-data', 'leads.json')
const uploadDir = path.join(dataDir, 'uploads')
const port = Number(process.env.PORT || 4174)
const adminPassword = configuredAdminPassword
const sessions = new Map()
const sessionTtlMs = Number(process.env.CMS_SESSION_TTL_MS || 12 * 60 * 60 * 1000)
const publicLeadRateLimit = Number(process.env.PUBLIC_LEAD_RATE_LIMIT || 20)
const publicLeadRateWindowMs = Number(process.env.PUBLIC_LEAD_RATE_WINDOW_MS || 15 * 60 * 1000)
const publicLeadRateBuckets = new Map()
const writeQueues = new Map()
let leadStoreQueue = Promise.resolve()

const allowedLeadTypes = new Set(['appointment', 'viewing', 'deposit', 'valuation', 'finance'])
const allowedLeadStatuses = new Set(['new', 'contacted', 'booked', 'reserved', 'valuation-sent', 'finance-follow-up', 'closed', 'archived'])

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
  const maxAge = Math.max(1, Math.floor(sessionTtlMs / 1000))
  response.setHeader('Set-Cookie', `knights_session=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`)
}

function clearSessionCookie(response) {
  response.setHeader('Set-Cookie', 'knights_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0')
}

function isAdmin(request) {
  const sessionId = parseCookies(request).knights_session
  const session = sessionId ? sessions.get(sessionId) : null
  if (!session) return false
  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId)
    return false
  }
  return true
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

async function readJsonBody(request, maxBytes = 3 * 1024 * 1024) {
  const body = await readBody(request, maxBytes)
  return JSON.parse(body.toString('utf8') || '{}')
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function writeJsonFile(filePath, payload) {
  const previous = writeQueues.get(filePath) || Promise.resolve()
  const next = previous.catch(() => {}).then(async () => {
    await ensureDir(path.dirname(filePath))
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`
    await fs.writeFile(tmpPath, `${JSON.stringify(payload, null, 2)}\n`)
    await fs.rename(tmpPath, filePath)
  })
  writeQueues.set(filePath, next)
  try {
    await next
  } finally {
    if (writeQueues.get(filePath) === next) writeQueues.delete(filePath)
  }
}


function clipString(value, maxLength = 500) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
}

function publicValidationError(message) {
  const error = new Error(message)
  error.publicMessage = message
  return error
}

function safePublicLeadError(error) {
  if (error?.publicMessage) return error.publicMessage
  return 'Invalid enquiry request'
}

function getClientAddress(request) {
  const forwardedFor = request.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) return forwardedFor.split(',')[0].trim()
  return request.socket?.remoteAddress || 'unknown'
}

function checkPublicLeadRateLimit(request) {
  if (!Number.isFinite(publicLeadRateLimit) || publicLeadRateLimit <= 0) return true
  const now = Date.now()
  const address = getClientAddress(request)
  const bucket = (publicLeadRateBuckets.get(address) || []).filter((timestamp) => now - timestamp < publicLeadRateWindowMs)
  if (bucket.length >= publicLeadRateLimit) {
    publicLeadRateBuckets.set(address, bucket)
    return false
  }
  bucket.push(now)
  publicLeadRateBuckets.set(address, bucket)
  return true
}

function withLeadStore(operation) {
  const next = leadStoreQueue.catch(() => {}).then(operation)
  leadStoreQueue = next.catch(() => {})
  return next
}

function sanitizeObject(value, maxKeys = 24, maxLength = 700) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .slice(0, maxKeys)
      .map(([key, item]) => [clipString(key, 80), clipString(item, maxLength)])
      .filter(([key, item]) => key && item),
  )
}

async function readLeads() {
  try {
    const raw = await fs.readFile(leadsPath, 'utf8')
    const payload = JSON.parse(raw)
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload.leads)) return payload.leads
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  return []
}

async function writeLeads(leads) {
  await writeJsonFile(leadsPath, { version: 1, updatedAt: new Date().toISOString(), leads })
}

function sanitizeLeadPayload(payload = {}) {
  if (clipString(payload.website, 250)) {
    throw publicValidationError('Invalid enquiry request')
  }
  const type = clipString(payload.type, 40) || 'appointment'
  if (!allowedLeadTypes.has(type)) {
    throw publicValidationError('Lead type is not supported')
  }
  if (payload.consent !== true) {
    throw publicValidationError('Consent is required before an enquiry can be saved')
  }
  const customer = sanitizeObject(payload.customer, 8, 180)
  if (!customer.name || !customer.phone) {
    throw publicValidationError('Name and phone are required')
  }
  return {
    type,
    customer,
    fields: sanitizeObject(payload.fields, 30, 500),
    message: clipString(payload.message, 2000),
    consent: true,
    sourcePath: clipString(payload.sourcePath, 250),
    subject: clipString(payload.subject, 180),
  }
}

async function createLead(payload) {
  return withLeadStore(async () => {
    const now = new Date().toISOString()
    const lead = {
      id: `KMC-${now.slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      ...sanitizeLeadPayload(payload),
      status: 'new',
      adminNotes: '',
      history: [{ at: now, action: 'created', status: 'new', note: 'Public enquiry received' }],
      createdAt: now,
      updatedAt: now,
    }
    const leads = await readLeads()
    leads.unshift(lead)
    await writeLeads(leads)
    return lead
  })
}

async function updateLeadRecord(id, patch = {}) {
  return withLeadStore(async () => {
    const leadId = clipString(id, 80)
    const leads = await readLeads()
    const index = leads.findIndex((lead) => lead.id === leadId)
    if (index === -1) throw new Error('Lead not found')
    const current = leads[index]
    const nextStatus = clipString(patch.status, 40) || current.status || 'new'
    if (!allowedLeadStatuses.has(nextStatus)) throw new Error('Lead status is not supported')
    const nextNotes = typeof patch.adminNotes === 'undefined' ? current.adminNotes || '' : clipString(patch.adminNotes, 3000)
    const now = new Date().toISOString()
    const history = Array.isArray(current.history) ? current.history : []
    const changed = nextStatus !== current.status || nextNotes !== (current.adminNotes || '')
    const nextLead = {
      ...current,
      status: nextStatus,
      adminNotes: nextNotes,
      updatedAt: now,
      history: changed
        ? [...history, { at: now, action: 'updated', status: nextStatus, note: clipString(patch.historyNote || 'Admin updated enquiry handling', 500) }]
        : history,
    }
    leads[index] = nextLead
    await writeLeads(leads)
    return nextLead
  })
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


  if (pathname === '/api/leads.php' || pathname === '/api/leads') {
    if (request.method === 'POST') {
      if (!checkPublicLeadRateLimit(request)) {
        sendJson(response, 429, { error: 'Too many enquiry attempts. Please try again later.' })
        return
      }
      try {
        const lead = await createLead(await readJsonBody(request, 128 * 1024))
        sendJson(response, 201, { ok: true, reference: lead.id, lead: { id: lead.id, type: lead.type, status: lead.status, createdAt: lead.createdAt } })
      } catch (error) {
        sendJson(response, 400, { error: safePublicLeadError(error) })
      }
      return
    }

    if (request.method === 'GET') {
      if (!isAdmin(request)) {
        sendJson(response, 401, { error: 'Not authenticated' })
        return
      }
      const leads = await readLeads()
      sendJson(response, 200, { ok: true, leads })
      return
    }

    if (request.method === 'PATCH') {
      if (!isAdmin(request)) {
        sendJson(response, 401, { error: 'Not authenticated' })
        return
      }
      try {
        const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
        const body = await readJsonBody(request, 128 * 1024)
        const lead = await updateLeadRecord(body.id || url.searchParams.get('id'), body)
        sendJson(response, 200, { ok: true, lead })
      } catch (error) {
        sendJson(response, error.message === 'Lead not found' ? 404 : 400, { error: error.message || 'Unable to update enquiry' })
      }
      return
    }

    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  if (pathname === '/api/login.php' || pathname === '/api/login') {
    if (request.method !== 'POST') {
      sendJson(response, 405, { error: 'Method not allowed' })
      return
    }
    try {
      const payload = await readJsonBody(request)
      if (!adminPassword) {
        sendJson(response, 503, { error: 'Admin password is not configured' })
        return
      }
      if (payload.password !== adminPassword) {
        sendJson(response, 401, { error: 'Invalid password' })
        return
      }
      const sessionId = crypto.randomBytes(24).toString('hex')
      sessions.set(sessionId, { createdAt: Date.now(), expiresAt: Date.now() + sessionTtlMs })
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
