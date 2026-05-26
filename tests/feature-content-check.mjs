import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { siteContent } from '../src/data/siteContent.js'

const appSource = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
const adminSource = await readFile(new URL('../src/AdminPage.jsx', import.meta.url), 'utf8')

const actionKeys = ['appointment', 'deposit', 'valuation', 'finance']

assert.ok(siteContent.actionWindows, 'siteContent.actionWindows should define the homepage action windows')
for (const key of actionKeys) {
  assert.ok(siteContent.actionWindows[key], `actionWindows.${key} should exist`)
  assert.ok(siteContent.actionWindows[key].title, `actionWindows.${key}.title should exist`)
  assert.ok(siteContent.actionWindows[key].text, `actionWindows.${key}.text should exist`)
  assert.ok(siteContent.actionWindows[key].cta, `actionWindows.${key}.cta should exist`)
  assert.ok(siteContent.actionWindows[key].path, `actionWindows.${key}.path should exist`)
}

assert.equal(siteContent.actionWindows.appointment.path, '/book-viewing')
assert.equal(siteContent.actionWindows.deposit.path, '/reserve')
assert.equal(siteContent.actionWindows.valuation.path, '/sell-your-bike')
assert.equal(siteContent.actionWindows.finance.path, '/finance')

assert.ok(siteContent.deposit, 'siteContent.deposit should define the deposit/reservation page')
assert.match(siteContent.deposit.disclaimer, /not.*payment|no.*payment|enquiry/i, 'deposit disclaimer should make clear this is not a live payment collection')
assert.ok(siteContent.appointment, 'siteContent.appointment should define the appointment viewing page')
assert.ok(siteContent.leadForms.deposit, 'leadForms.deposit subject should exist')
assert.ok(siteContent.leadForms.appointment, 'leadForms.appointment subject should exist')

assert.match(appSource, /path="\/book-viewing"/, 'App should expose /book-viewing route')
assert.match(appSource, /path="\/reserve"/, 'App should expose /reserve route')
assert.match(appSource, /function ActionWindowsSection/, 'App should render a reusable action windows section')
assert.match(appSource, /function DepositPage/, 'App should include a deposit/reservation page')
assert.match(appSource, /function AppointmentPage/, 'App should include an appointment viewing page')
assert.match(adminSource, /Action windows JSON/, 'Admin should expose action windows editing')
assert.match(adminSource, /Deposit page JSON/, 'Admin should expose deposit page editing')
assert.match(appSource, /function mergeNavItems/, 'App should backfill new nav items when old CMS JSON is loaded')
assert.match(appSource, /function mergeServiceCards/, 'App should backfill new service cards when old CMS JSON is loaded')
assert.match(adminSource, /function mergeDraftContent/, 'Admin should deep-merge old local drafts with the current content shape')
assert.match(appSource, />Knight Motorcycles Leeds</, 'Header logo title should be one-line Knight Motorcycles Leeds')
assert.doesNotMatch(appSource, /Used Motorcycles Leeds/, 'Header logo title should not include Used Motorcycles Leeds')

console.log('feature-content-check passed')
