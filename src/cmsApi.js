const CONTENT_API = '/api/content.php'
const LOGIN_API = '/api/login.php'
const LOGOUT_API = '/api/logout.php'
const UPLOAD_API = '/api/upload.php'
const LEADS_API = '/api/leads.php'
const LOCAL_DRAFT_KEY = 'knights-cms-local-draft'

async function parseJsonResponse(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Server did not return JSON. Check that the CMS API is deployed.')
  }
}

export function loadLocalDraft() {
  try {
    const raw = window.localStorage.getItem(LOCAL_DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveLocalDraft(content) {
  window.localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(content))
}

export function clearLocalDraft() {
  window.localStorage.removeItem(LOCAL_DRAFT_KEY)
}

export async function fetchCmsContent() {
  const response = await fetch(CONTENT_API, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error(`CMS content request failed with ${response.status}`)
  }
  return parseJsonResponse(response)
}

export async function loginToCms(password) {
  const response = await fetch(LOGIN_API, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ password }),
  })
  const body = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(body?.error || 'Login failed')
  }
  return body
}

export async function logoutFromCms() {
  await fetch(LOGOUT_API, {
    method: 'POST',
    credentials: 'include',
  })
}

export async function saveCmsContent(content) {
  const response = await fetch(CONTENT_API, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(content),
  })
  const body = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(body?.error || `CMS save failed with ${response.status}`)
  }
  return body
}


export async function submitLead(payload) {
  const response = await fetch(LEADS_API, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  const body = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(body?.error || `Lead submission failed with ${response.status}`)
  }
  return body
}

export async function fetchLeads() {
  const response = await fetch(LEADS_API, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  })
  const body = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(body?.error || `Lead list failed with ${response.status}`)
  }
  return body
}

export async function updateLead(id, patch) {
  const response = await fetch(`${LEADS_API}?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ id, ...patch }),
  })
  const body = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(body?.error || `Lead update failed with ${response.status}`)
  }
  return body
}

export async function uploadCmsMedia(file) {
  const form = new FormData()
  form.append('file', file)
  const response = await fetch(UPLOAD_API, {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  const body = await parseJsonResponse(response)
  if (!response.ok) {
    throw new Error(body?.error || `Upload failed with ${response.status}`)
  }
  return body
}

export const uploadCmsImage = uploadCmsMedia
