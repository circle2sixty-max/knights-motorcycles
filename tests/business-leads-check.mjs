import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

const root = path.resolve(import.meta.dirname, '..')

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function assertContains(text, needle, message) {
  assert.ok(text.includes(needle), `${message}: expected to find ${needle}`)
}

function assertMatches(text, pattern, message) {
  assert.ok(pattern.test(text), `${message}: expected ${pattern}`)
}

const server = read('server/render-server.mjs')
const cmsApi = read('src/cmsApi.js')
const app = read('src/App.jsx')
const admin = read('src/AdminPage.jsx')

assertContains(server, 'leadsPath', 'Render server stores customer enquiries separately from CMS content')
assertContains(server, '/api/leads.php', 'Render server exposes the leads API route')
assertContains(server, 'allowedLeadTypes', 'Render server validates lead module types')
assertContains(server, 'sanitizeLeadPayload', 'Render server sanitizes public lead submissions')
assertContains(server, 'adminNotes', 'Render server stores internal admin notes')
assertContains(server, 'history', 'Render server keeps a processing history')
assertMatches(server, /request\.method === 'POST'[\s\S]{0,1600}createLead/, 'Public POST creates a lead')
assertMatches(server, /request\.method === 'GET'[\s\S]{0,1800}isAdmin\(request\)/, 'GET leads requires an admin session')
assertMatches(server, /request\.method === 'PATCH'[\s\S]{0,1800}isAdmin\(request\)/, 'PATCH lead updates require an admin session')

assertContains(cmsApi, 'LEADS_API', 'Frontend API module defines the leads endpoint')
assertContains(cmsApi, 'submitLead', 'Frontend API module can submit public leads')
assertContains(cmsApi, 'fetchLeads', 'Frontend API module can fetch leads for admin')
assertContains(cmsApi, 'updateLead', 'Frontend API module can update lead status/notes')

assertContains(app, 'submitLead', 'Public LeadForm submits to the server instead of email-only mailto')
assertContains(app, 'await submitLead', 'Public LeadForm waits for persisted lead creation')
assertContains(app, 'sourcePath', 'Public LeadForm records which public page created the lead')
assertContains(app, 'Enquiry received', 'Public LeadForm confirms server-side receipt')
assertContains(app, 'email fallback', 'Public LeadForm keeps an email fallback when API submission fails')
;['appointment', 'deposit', 'valuation', 'finance'].forEach((type) => {
  assertContains(app, type, `Public form supports ${type} lead type`)
})

assertContains(admin, "['business'", 'Admin navigation includes a business/leads tab')
assertContains(admin, 'BusinessPanel', 'Admin renders a business lead management panel')
assertContains(admin, 'fetchLeads', 'Admin loads customer enquiries from the API')
assertContains(admin, 'updateLead', 'Admin updates enquiry handling status and notes')
;[
  'Appointments',
  'Deposits / reservations',
  'Valuations / PX',
  'Finance enquiries',
  'Status',
  'Admin notes',
  'Update',
].forEach((label) => {
  assertContains(admin, label, `Admin business module shows ${label}`)
})

console.log('business-leads-check passed')
