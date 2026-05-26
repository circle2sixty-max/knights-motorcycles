import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const adminPassword = 'BusinessLeadsApiTest-NotARealSecret'

function freePort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function startServer(extraEnv = {}) {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'knights-business-leads-api-'))
  const port = await freePort()
  const child = spawn(process.execPath, ['server/render-server.mjs'], {
    cwd: root,
    env: {
      ...process.env,
      PORT: String(port),
      CMS_DATA_DIR: path.join(tmp, 'data'),
      CMS_ADMIN_PASSWORD: adminPassword,
      PUBLIC_LEAD_RATE_LIMIT: '100',
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk.toString() })
  child.stderr.on('data', (chunk) => { output += chunk.toString() })

  const baseUrl = `http://127.0.0.1:${port}`
  for (let i = 0; i < 60; i += 1) {
    if (child.exitCode !== null) throw new Error(`Server exited early: ${output}`)
    try {
      const response = await fetch(`${baseUrl}/api/leads.php`)
      if (response.status === 401) return { baseUrl, child, output: () => output, tmp }
    } catch {
      // keep polling until the listener is ready
    }
    await wait(100)
  }
  child.kill('SIGTERM')
  throw new Error(`Server did not start: ${output}`)
}

async function stopServer(child) {
  if (child.exitCode !== null) return
  child.kill('SIGTERM')
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    wait(2000).then(() => child.kill('SIGKILL')),
  ])
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null
  return { response, body, text }
}

function leadPayload(index = 1, overrides = {}) {
  return {
    type: 'appointment',
    subject: 'Book a viewing',
    customer: {
      name: `API Test Customer ${index}`,
      phone: `07123000${String(index).padStart(3, '0')}`,
      email: `api-test-${index}@example.com`,
      preferredContact: 'Phone',
    },
    fields: {
      'Bike of interest': 'Yamaha R125',
      'Preferred date': '2026-06-01',
      'Preferred time window': 'Afternoon',
    },
    message: 'Automated API test only.',
    consent: true,
    sourcePath: '/book-viewing',
    website: '',
    ...overrides,
  }
}

async function assertProductionRequiresConfiguredAdminPassword() {
  const port = await freePort()
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'knights-business-leads-prod-'))
  const child = spawn(process.execPath, ['server/render-server.mjs'], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(port),
      CMS_DATA_DIR: path.join(tmp, 'data'),
      CMS_ADMIN_PASSWORD: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk.toString() })
  child.stderr.on('data', (chunk) => { output += chunk.toString() })

  await wait(700)
  assert.notEqual(child.exitCode, null, `Production server must fail fast when CMS_ADMIN_PASSWORD is missing. Output: ${output}`)
  assert.match(output, /CMS_ADMIN_PASSWORD/i, 'Startup error should name the missing env var')
}

await assertProductionRequiresConfiguredAdminPassword()

const { baseUrl, child } = await startServer()
try {
  const created = await requestJson(`${baseUrl}/api/leads.php`, {
    method: 'POST',
    body: JSON.stringify(leadPayload(1)),
  })
  assert.equal(created.response.status, 201, created.text)
  assert.ok(created.body.reference, 'Public POST returns a lead reference')
  const publicResponseText = JSON.stringify(created.body)
  assert.ok(!publicResponseText.includes('api-test-1@example.com'), 'Public POST response must not echo email PII')
  assert.ok(!publicResponseText.includes('07123000001'), 'Public POST response must not echo phone PII')
  assert.ok(!publicResponseText.includes('API Test Customer 1'), 'Public POST response must not echo name PII')

  const noConsent = await requestJson(`${baseUrl}/api/leads.php`, {
    method: 'POST',
    body: JSON.stringify(leadPayload(2, { consent: false })),
  })
  assert.equal(noConsent.response.status, 400, 'Missing consent is rejected')

  const noPhone = await requestJson(`${baseUrl}/api/leads.php`, {
    method: 'POST',
    body: JSON.stringify(leadPayload(3, { customer: { name: 'No Phone Customer' } })),
  })
  assert.equal(noPhone.response.status, 400, 'Missing phone is rejected')

  const spam = await requestJson(`${baseUrl}/api/leads.php`, {
    method: 'POST',
    body: JSON.stringify(leadPayload(4, { website: 'https://spam.example' })),
  })
  assert.equal(spam.response.status, 400, 'Honeypot submissions are rejected')

  const malformed = await requestJson(`${baseUrl}/api/leads.php`, {
    method: 'POST',
    body: '{',
  })
  assert.equal(malformed.response.status, 400, 'Malformed JSON is rejected')
  assert.equal(malformed.body.error, 'Invalid enquiry request', 'Public JSON parse errors are generic')

  const unauthList = await requestJson(`${baseUrl}/api/leads.php`)
  assert.equal(unauthList.response.status, 401, 'Unauthenticated lead list is blocked')

  const unauthPatch = await requestJson(`${baseUrl}/api/leads.php?id=${encodeURIComponent(created.body.reference)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'booked', adminNotes: 'Should not save' }),
  })
  assert.equal(unauthPatch.response.status, 401, 'Unauthenticated lead update is blocked')

  const badLogin = await requestJson(`${baseUrl}/api/login.php`, {
    method: 'POST',
    body: JSON.stringify({ password: 'wrong-password' }),
  })
  assert.equal(badLogin.response.status, 401, 'Wrong admin password is rejected')

  const login = await requestJson(`${baseUrl}/api/login.php`, {
    method: 'POST',
    body: JSON.stringify({ password: adminPassword }),
  })
  assert.equal(login.response.status, 200, login.text)
  const cookie = login.response.headers.get('set-cookie')?.split(';')[0]
  assert.ok(cookie, 'Admin login sets a session cookie')

  const concurrent = await Promise.all(
    Array.from({ length: 12 }, (_, index) => requestJson(`${baseUrl}/api/leads.php`, {
      method: 'POST',
      body: JSON.stringify(leadPayload(index + 10)),
    })),
  )
  assert.equal(concurrent.filter((item) => item.response.status === 201).length, 12, 'Concurrent public submissions all succeed')

  const list = await requestJson(`${baseUrl}/api/leads.php`, {
    headers: { Cookie: cookie },
  })
  assert.equal(list.response.status, 200, list.text)
  assert.equal(list.body.leads.length, 13, 'Serialized writes preserve every concurrent lead')
  assert.equal(new Set(list.body.leads.map((lead) => lead.id)).size, 13, 'Lead references remain unique')

  const patch = await requestJson(`${baseUrl}/api/leads.php?id=${encodeURIComponent(created.body.reference)}`, {
    method: 'PATCH',
    headers: { Cookie: cookie },
    body: JSON.stringify({ status: 'booked', adminNotes: 'API test appointment booked.' }),
  })
  assert.equal(patch.response.status, 200, patch.text)
  assert.equal(patch.body.lead.status, 'booked')
  assert.equal(patch.body.lead.adminNotes, 'API test appointment booked.')
  assert.ok(patch.body.lead.history.length >= 2, 'Admin updates append handling history')
} finally {
  await stopServer(child)
}

console.log('business-leads-api-check passed')
