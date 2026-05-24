import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bike,
  CheckCircle2,
  Database,
  FileJson,
  Film,
  Image as ImageIcon,
  ImagePlus,
  Lock,
  LogOut,
  Plus,
  Save,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react'
import {
  clearLocalDraft,
  loadLocalDraft,
  loginToCms,
  logoutFromCms,
  saveCmsContent,
  saveLocalDraft,
  uploadCmsMedia,
} from './cmsApi'

const tabs = [
  ['overview', 'Overview', Database],
  ['stock', 'Stock', Bike],
  ['company', 'Company', Settings],
  ['pages', 'Page copy', FileJson],
  ['advanced', 'Advanced JSON', FileJson],
]

const DEMO_ADMIN_PASSWORD = 'KnightsDemo2026!'
const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v']

function mediaTypeFromUrl(url = '', explicitType = '') {
  if (explicitType === 'video' || explicitType === 'image') return explicitType
  const lower = url.toLowerCase().split('?')[0]
  if (url.startsWith('data:video/') || videoExtensions.some((ext) => lower.endsWith(ext))) return 'video'
  return 'image'
}

function normalizeMediaItem(item, index = 0) {
  if (typeof item === 'string') {
    return {
      type: mediaTypeFromUrl(item),
      url: item,
      label: '',
      order: index,
    }
  }
  return {
    type: mediaTypeFromUrl(item?.url, item?.type),
    url: item?.url || '',
    label: item?.label || '',
    order: Number.isFinite(item?.order) ? item.order : index,
  }
}

function sortMedia(items) {
  return items
    .map((item, index) => ({ ...normalizeMediaItem(item, index), originalIndex: index }))
    .filter((item) => item.url)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'video' ? -1 : 1
      return (a.order ?? a.originalIndex) - (b.order ?? b.originalIndex)
    })
    .map((item, index) => {
      const mediaItem = { ...item }
      delete mediaItem.originalIndex
      return { ...mediaItem, order: index }
    })
}

function mediaFromBike(bike) {
  const explicit = Array.isArray(bike?.media) ? bike.media : []
  const fallback = Array.isArray(bike?.images) ? bike.images : []
  return sortMedia(explicit.length ? explicit : fallback)
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function slugify(value) {
  return String(value || 'new-bike')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function linesToArray(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function arrayToLines(value) {
  return Array.isArray(value) ? value.join('\n') : ''
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function downloadJson(content) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `knights-cms-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function AdminPage({ content, onContentUpdate }) {
  const [draft, setDraft] = useState(() => clone(loadLocalDraft() || content))
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSlug, setSelectedSlug] = useState(draft.bikes?.[0]?.slug || '')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [localMode, setLocalMode] = useState(false)
  const [stockFilter, setStockFilter] = useState('ALL')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedBike = useMemo(() => {
    return draft.bikes?.find((bike) => bike.slug === selectedSlug) || draft.bikes?.[0]
  }, [draft.bikes, selectedSlug])

  const stockCounts = useMemo(() => {
    const bikes = draft.bikes || []
    return {
      total: bikes.length,
      available: bikes.filter((bike) => bike.status !== 'SOLD').length,
      sold: bikes.filter((bike) => bike.status === 'SOLD').length,
    }
  }, [draft.bikes])

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password === DEMO_ADMIN_PASSWORD) {
      setAuthenticated(true)
      setLocalMode(true)
      setMessage('Demo login active. This Render preview saves edits in this browser so the owner can review the admin workflow.')
      return
    }

    try {
      await loginToCms(password)
      setAuthenticated(true)
      setLocalMode(false)
      setMessage('Logged in. Changes can now be published to the live CMS data file.')
    } catch (loginError) {
      setError(loginError.message === 'Invalid password' ? 'Password incorrect.' : 'Password incorrect.')
    }
  }

  async function handleLogout() {
    await logoutFromCms()
    setAuthenticated(false)
    setLocalMode(false)
    setPassword('')
    setMessage('Logged out.')
  }

  async function handleSave() {
    setError('')
    setMessage('')
    const nextContent = normalizeContent(draft)
    nextContent.version = (Number(nextContent.version) || 0) + 1
    nextContent.updatedAt = new Date().toISOString()
    if (localMode) {
      saveLocalDraft(nextContent)
      onContentUpdate(nextContent)
      setMessage('Saved as a local browser draft. Deploy the CMS API to publish changes live.')
      return
    }

    try {
      await saveCmsContent(nextContent)
      clearLocalDraft()
      onContentUpdate(nextContent)
      setDraft(nextContent)
      setMessage('Published to the CMS data file.')
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  function updateDraft(updater) {
    setDraft((current) => {
      const next = clone(current)
      updater(next)
      return next
    })
  }

  function updateCompany(field, value) {
    updateDraft((next) => {
      next.company[field] = value
      if (field === 'email') next.company.emailHref = `mailto:${value}`
      if (field === 'phone') next.company.phoneHref = `tel:${value.replace(/\D/g, '')}`
    })
  }

  function updateBike(field, value) {
    updateDraft((next) => {
      const bike = next.bikes.find((item) => item.slug === selectedBike.slug)
      bike[field] = value
      if (field === 'title' && !bike.slug) bike.slug = slugify(value)
    })
  }

  function updateBikeNumber(field, value) {
    updateBike(field, value === '' ? '' : Number(value))
  }

  function updateBikeMedia(media) {
    const sorted = sortMedia(media)
    updateDraft((next) => {
      const bike = next.bikes.find((item) => item.slug === selectedBike.slug)
      bike.media = sorted
      bike.images = sorted.filter((item) => item.type === 'image').map((item) => item.url)
    })
  }

  function updateBikeSpecs(value) {
    updateBike('specs', parseJson(value, selectedBike.specs || {}))
  }

  async function handleBikeMediaUpload(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    setError('')
    if (localMode) {
      const reads = files.map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve({
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: reader.result,
          label: file.name,
        })
        reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`))
        reader.readAsDataURL(file)
      }))
      try {
        const media = await Promise.all(reads)
        updateBikeMedia([...mediaFromBike(selectedBike), ...media])
        setMessage(`Added ${files.length} media file${files.length === 1 ? '' : 's'} to this local review draft.`)
      } catch (readError) {
        setError(readError.message)
      }
      return
    }
    try {
      const uploaded = []
      for (const file of files) {
        const result = await uploadCmsMedia(file)
        uploaded.push({
          type: result.type || (file.type.startsWith('video/') ? 'video' : 'image'),
          url: result.url,
          label: file.name,
        })
      }
      updateBikeMedia([...mediaFromBike(selectedBike), ...uploaded])
      setMessage(`Uploaded ${files.length} media file${files.length === 1 ? '' : 's'}.`)
    } catch (uploadError) {
      setError(uploadError.message)
    }
  }

  function addBike() {
    const slug = `new-bike-${Date.now()}`
    const bike = {
      slug,
      title: 'New motorcycle listing',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: '',
      engine: '125cc',
      style: '',
      colour: '',
      price: '',
      status: 'AVAILABLE',
      sourceUrl: '',
      summary: '',
      story: '',
      media: [{ type: 'image', url: '/images/original-stock/2009-honda-varadero-125-low-mileage-01.webp', label: 'Default photo', order: 0 }],
      images: ['/images/original-stock/2009-honda-varadero-125-low-mileage-01.webp'],
      specs: {},
      originalNotes: '',
    }
    updateDraft((next) => {
      next.bikes.unshift(bike)
    })
    setSelectedSlug(slug)
  }

  function removeBike() {
    if (!selectedBike) return
    updateDraft((next) => {
      next.bikes = next.bikes.filter((bike) => bike.slug !== selectedBike.slug)
    })
    const fallback = draft.bikes.find((bike) => bike.slug !== selectedBike.slug)
    setSelectedSlug(fallback?.slug || '')
  }

  function updateSection(path, value) {
    updateDraft((next) => {
      let target = next
      path.slice(0, -1).forEach((key) => {
        target = target[key]
      })
      target[path[path.length - 1]] = value
    })
  }

  function importJson(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        setDraft(normalizeContent(parsed))
        setMessage('Imported JSON into the editor. Save to publish it.')
      } catch {
        setError('The selected file is not valid JSON.')
      }
    }
    reader.readAsText(file)
  }

  function openStockFilter(filter) {
    const targetBikes = filter === 'ALL' ? draft.bikes : draft.bikes.filter((bike) => bike.status === filter)
    setStockFilter(filter)
    setSelectedSlug(targetBikes[0]?.slug || draft.bikes?.[0]?.slug || '')
    setActiveTab('stock')
  }

  if (!authenticated && !localMode) {
    return (
      <AdminShell title="Knights CMS" subtitle="Protected editing area for stock, company details and page modules.">
        <form onSubmit={handleLogin} className="mx-auto max-w-md rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-7">
          <Lock className="h-8 w-8 text-amber-300" />
          <h1 className="mt-5 text-3xl font-black uppercase text-white">Admin login</h1>
          <p className="mt-3 text-sm leading-6 text-stone-400">Enter the review password to open the CMS preview.</p>
          <label className="mt-6 block text-xs font-black uppercase tracking-wider text-stone-300">Password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-2 w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300"
            autoComplete="new-password"
            name="knights-cms-review-password"
            required
          />
          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-black uppercase tracking-wider text-stone-950">
            Login <ArrowRight className="h-4 w-4" />
          </button>
          <StatusMessage message={message} error={error} />
        </form>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Knights CMS" subtitle="Edit live stock, business details, page copy and structured modules.">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${
                  activeTab === key ? 'bg-amber-300 text-stone-950' : 'bg-stone-950 text-stone-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2 text-xs font-black uppercase tracking-wider text-stone-950">
              <Save className="h-4 w-4" /> {localMode ? 'Save draft' : 'Publish'}
            </button>
            {!localMode && (
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-stone-700 px-5 py-2 text-xs font-black uppercase tracking-wider text-stone-300">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </div>
        </div>

        <StatusMessage message={message} error={error} localMode={localMode} />

        {activeTab === 'overview' && (
          <OverviewPanel
            draft={draft}
            stockCounts={stockCounts}
            onOpenStock={openStockFilter}
            onExport={() => downloadJson(normalizeContent(draft))}
            onImport={importJson}
            onClearLocal={() => {
              clearLocalDraft()
              setLocalMode(false)
              setMessage('Local draft cleared.')
            }}
          />
        )}
        {activeTab === 'stock' && (
          <StockPanel
            bikes={draft.bikes || []}
            selectedBike={selectedBike}
            selectedSlug={selectedSlug}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            setSelectedSlug={setSelectedSlug}
            updateBike={updateBike}
            updateBikeNumber={updateBikeNumber}
            updateBikeMedia={updateBikeMedia}
            updateBikeSpecs={updateBikeSpecs}
            onUpload={handleBikeMediaUpload}
            addBike={addBike}
            removeBike={removeBike}
          />
        )}
        {activeTab === 'company' && <CompanyPanel company={draft.company} updateCompany={updateCompany} />}
        {activeTab === 'pages' && <PagesPanel draft={draft} updateSection={updateSection} />}
        {activeTab === 'advanced' && <AdvancedPanel draft={draft} setDraft={setDraft} />}
      </div>
    </AdminShell>
  )
}

function AdminShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-stone-950 px-4 py-10 text-stone-50">
      <div className="mx-auto mb-8 max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Admin</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-400">{subtitle}</p>
      </div>
      {children}
    </main>
  )
}

function StatusMessage({ message, error, localMode }) {
  if (!message && !error && !localMode) return null
  return (
    <div className="mb-6 grid gap-2">
      {localMode && <p className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">Local draft mode: changes stay in this browser until the CMS API is enabled and you publish them.</p>}
      {message && <p className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
      {error && <p className="rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
    </div>
  )
}

function OverviewPanel({ draft, stockCounts, onOpenStock, onExport, onImport, onClearLocal }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
        <h2 className="text-2xl font-black uppercase text-white">Publishing status</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <AdminStat value={stockCounts.total} label="Total bikes" onClick={() => onOpenStock('ALL')} />
          <AdminStat value={stockCounts.available} label="Available" onClick={() => onOpenStock('AVAILABLE')} />
          <AdminStat value={stockCounts.sold} label="Sold" onClick={() => onOpenStock('SOLD')} />
        </div>
        <div className="mt-6 grid gap-3">
          {[
            'Stock listings can be added, edited, sold or removed.',
            'Business contact details drive the phone, email and map links.',
            'Page copy, service cards, legal copy and story modules are editable.',
            'Images can be uploaded once the CMS API is live.',
          ].map((item) => (
            <p key={item} className="flex gap-3 text-sm leading-6 text-stone-300">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber-300" /> {item}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
        <h2 className="text-2xl font-black uppercase text-white">Backup and import</h2>
        <p className="mt-3 text-sm leading-7 text-stone-400">Export the whole CMS data file before major changes. Import lets you restore or move edited content between staging and live.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onExport} className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-wider text-stone-950">
            <Upload className="h-4 w-4" /> Export JSON
          </button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-stone-300 hover:border-amber-300">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={(event) => onImport(event.target.files?.[0])} />
          </label>
          <button onClick={onClearLocal} className="inline-flex items-center gap-2 rounded-full border border-stone-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-stone-300 hover:border-red-300">
            Clear local draft
          </button>
        </div>
        <div className="mt-6 rounded-2xl border border-stone-700 bg-stone-950 p-4 text-xs leading-6 text-stone-400">
          Current content version: {draft.version || 1}. Keep a downloaded backup before publishing customer-facing changes.
        </div>
      </section>
    </div>
  )
}

function AdminStat({ value, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl border border-stone-700 bg-stone-950 p-4 text-left transition hover:-translate-y-0.5 hover:border-amber-300 focus:border-amber-300 focus:outline-none">
      <p className="text-3xl font-black text-amber-200">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-stone-400">Edit matching stock</p>
    </button>
  )
}

function StockPanel({ bikes, selectedBike, selectedSlug, stockFilter, setStockFilter, setSelectedSlug, updateBike, updateBikeNumber, updateBikeMedia, updateBikeSpecs, onUpload, addBike, removeBike }) {
  const filteredBikes = stockFilter === 'ALL' ? bikes : bikes.filter((bike) => bike.status === stockFilter)

  function handleFilterChange(filter) {
    const targetBikes = filter === 'ALL' ? bikes : bikes.filter((bike) => bike.status === filter)
    setStockFilter(filter)
    setSelectedSlug(targetBikes[0]?.slug || bikes[0]?.slug || '')
  }

  if (!selectedBike) {
    return (
      <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
        <button onClick={addBike} className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-wider text-stone-950">
          <Plus className="h-4 w-4" /> Add first bike
        </button>
      </section>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-4">
        <button onClick={addBike} className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-wider text-stone-950">
          <Plus className="h-4 w-4" /> Add bike
        </button>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {['ALL', 'AVAILABLE', 'SOLD'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilterChange(filter)}
              className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-wider ${stockFilter === filter ? 'bg-amber-300 text-stone-950' : 'bg-stone-950 text-stone-400'}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="grid max-h-[760px] gap-2 overflow-auto pr-1">
          {filteredBikes.map((bike) => (
            <button
              key={bike.slug}
              onClick={() => setSelectedSlug(bike.slug)}
              className={`rounded-2xl border p-3 text-left transition ${
                selectedSlug === bike.slug ? 'border-amber-300 bg-amber-300/10' : 'border-stone-700 bg-stone-950 hover:border-stone-500'
              }`}
            >
              <p className="text-xs font-black uppercase leading-5 text-white">{bike.title}</p>
              <p className="mt-1 text-xs text-stone-500">{bike.status} · {bike.price ? `£${bike.price}` : 'POA'}</p>
            </button>
          ))}
          {!filteredBikes.length && (
            <p className="rounded-2xl border border-stone-700 bg-stone-950 p-4 text-xs leading-5 text-stone-400">No bikes match this status.</p>
          )}
        </div>
      </aside>

      <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-300">Editing stock</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">{selectedBike.title}</h2>
          </div>
          <button onClick={removeBike} className="inline-flex items-center gap-2 rounded-full border border-red-300/30 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-200">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Product title" value={selectedBike.title} onChange={(value) => updateBike('title', value)} />
          <Field label="Slug" value={selectedBike.slug} onChange={(value) => updateBike('slug', slugify(value))} />
          <Field label="Make" value={selectedBike.make} onChange={(value) => updateBike('make', value)} />
          <Field label="Model" value={selectedBike.model} onChange={(value) => updateBike('model', value)} />
          <Field label="Year" type="number" value={selectedBike.year} onChange={(value) => updateBikeNumber('year', value)} />
          <Field label="Mileage" type="number" value={selectedBike.mileage} onChange={(value) => updateBikeNumber('mileage', value)} />
          <Field label="Engine" value={selectedBike.engine} onChange={(value) => updateBike('engine', value)} />
          <Field label="Style" value={selectedBike.style} onChange={(value) => updateBike('style', value)} />
          <Field label="Colour" value={selectedBike.colour} onChange={(value) => updateBike('colour', value)} />
          <Field label="Price" type="number" value={selectedBike.price} onChange={(value) => updateBikeNumber('price', value)} />
          <SelectField label="Status" value={selectedBike.status} onChange={(value) => updateBike('status', value)} options={['AVAILABLE', 'SOLD', 'RESERVED']} />
          <Field label="Source URL" value={selectedBike.sourceUrl} onChange={(value) => updateBike('sourceUrl', value)} />
          <TextArea label="Listing headline / rider story" value={selectedBike.story} onChange={(value) => updateBike('story', value)} className="md:col-span-2" />
          <TextArea label="Product description" value={selectedBike.summary} onChange={(value) => updateBike('summary', value)} className="md:col-span-2" rows={5} />
          <TextArea label="Detailed dealer notes" value={selectedBike.originalNotes} onChange={(value) => updateBike('originalNotes', value)} className="md:col-span-2" rows={8} />
          <MediaManager bike={selectedBike} updateBikeMedia={updateBikeMedia} onUpload={onUpload} />
          <TextArea label="Specs JSON" value={JSON.stringify(selectedBike.specs || {}, null, 2)} onChange={updateBikeSpecs} className="md:col-span-2" rows={8} />
        </div>
      </section>
    </div>
  )
}

function MediaManager({ bike, updateBikeMedia, onUpload }) {
  const media = mediaFromBike(bike)
  const [urlValue, setUrlValue] = useState('')

  function addUrl() {
    const url = urlValue.trim()
    if (!url) return
    updateBikeMedia([...media, { type: mediaTypeFromUrl(url), url, label: '', order: media.length }])
    setUrlValue('')
  }

  function removeMedia(index) {
    updateBikeMedia(media.filter((_, itemIndex) => itemIndex !== index))
  }

  function moveMedia(index, direction) {
    const next = [...media]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= next.length) return
    const [item] = next.splice(index, 1)
    next.splice(targetIndex, 0, item)
    updateBikeMedia(next)
  }

  function updateMediaLabel(index, label) {
    updateBikeMedia(media.map((item, itemIndex) => (
      itemIndex === index ? { ...item, label } : item
    )))
  }

  return (
    <section className="md:col-span-2 rounded-[1.5rem] border border-stone-700 bg-stone-950/55 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-amber-300">Product media</p>
          <h3 className="mt-1 text-xl font-black uppercase text-white">Photos and videos</h3>
          <p className="mt-2 text-xs leading-5 text-stone-400">Videos are automatically shown first. Upload from desktop or choose photos/videos from a phone gallery.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-wider text-stone-950">
          <ImagePlus className="h-4 w-4" /> Upload media
          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={onUpload} />
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={urlValue}
          onChange={(event) => setUrlValue(event.target.value)}
          placeholder="Paste image or video URL, e.g. /uploads/bike.mp4"
          className="rounded-full border border-stone-700 bg-stone-950 px-5 py-3 text-sm text-white outline-none focus:border-amber-300"
        />
        <button type="button" onClick={addUrl} className="rounded-full border border-stone-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-stone-300 hover:border-amber-300">
          Add URL
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {media.map((item, index) => (
          <article key={`${item.url}-${index}`} className="overflow-hidden rounded-2xl border border-stone-700 bg-stone-900">
            <div className="relative aspect-[4/3] bg-stone-950">
              {item.type === 'video' ? (
                <video src={item.url} className="h-full w-full object-contain" controls playsInline preload="metadata" />
              ) : (
                <img src={item.url} alt={item.label || `${bike.title} media ${index + 1}`} className="h-full w-full object-contain p-2" loading="lazy" />
              )}
              <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${item.type === 'video' ? 'bg-sky-300 text-stone-950' : 'bg-amber-300 text-stone-950'}`}>
                {item.type === 'video' ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                {item.type}
              </span>
              {index === 0 && <span className="absolute right-3 top-3 rounded-full bg-emerald-300 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-stone-950">First</span>}
            </div>
            <div className="p-3">
              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-stone-400">Media title / caption</span>
                <input
                  value={item.label || ''}
                  onChange={(event) => updateMediaLabel(index, event.target.value)}
                  placeholder={item.type === 'video' ? 'Product walkaround video' : 'Front angle photo'}
                  className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-white outline-none focus:border-amber-300"
                />
              </label>
              <p className="mt-2 truncate text-[10px] text-stone-500" title={item.url}>{item.url}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => moveMedia(index, -1)} disabled={index === 0} className="inline-flex items-center justify-center rounded-full border border-stone-700 px-3 py-2 text-xs text-stone-300 disabled:opacity-30">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => moveMedia(index, 1)} disabled={index === media.length - 1} className="inline-flex items-center justify-center rounded-full border border-stone-700 px-3 py-2 text-xs text-stone-300 disabled:opacity-30">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => removeMedia(index)} className="inline-flex items-center justify-center rounded-full border border-red-300/30 px-3 py-2 text-xs text-red-200">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!media.length && (
        <div className="mt-5 rounded-2xl border border-dashed border-stone-700 p-8 text-center text-sm text-stone-400">
          No media yet. Upload photos or a product video to start the listing gallery.
        </div>
      )}
    </section>
  )
}

function CompanyPanel({ company, updateCompany }) {
  return (
    <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
      <h2 className="text-2xl font-black uppercase text-white">Company details</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Object.entries(company || {}).map(([key, value]) => (
          <Field key={key} label={key} value={value} onChange={(nextValue) => updateCompany(key, nextValue)} />
        ))}
      </div>
    </section>
  )
}

function PagesPanel({ draft, updateSection }) {
  return (
    <div className="grid gap-6">
      <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
        <h2 className="text-2xl font-black uppercase text-white">Hero and homepage</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Splash title" value={draft.splash.title} onChange={(value) => updateSection(['splash', 'title'], value)} />
          <Field label="Splash subtitle" value={draft.splash.subtitle} onChange={(value) => updateSection(['splash', 'subtitle'], value)} />
          <TextArea label="Splash text" value={draft.splash.text} onChange={(value) => updateSection(['splash', 'text'], value)} className="md:col-span-2" />
          <Field label="Home hero title" value={draft.home.heroTitle} onChange={(value) => updateSection(['home', 'heroTitle'], value)} className="md:col-span-2" />
          <TextArea label="Home hero text" value={draft.home.heroText} onChange={(value) => updateSection(['home', 'heroText'], value)} className="md:col-span-2" />
          <Field label="CTA title" value={draft.cta.title} onChange={(value) => updateSection(['cta', 'title'], value)} />
          <Field label="CTA secondary button" value={draft.cta.secondary} onChange={(value) => updateSection(['cta', 'secondary'], value)} />
          <TextArea label="CTA text" value={draft.cta.text} onChange={(value) => updateSection(['cta', 'text'], value)} className="md:col-span-2" />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
        <h2 className="text-2xl font-black uppercase text-white">Service and story modules</h2>
        <div className="mt-6 grid gap-4">
          <TextArea label="About paragraphs, one per line" value={arrayToLines(draft.serviceCopy.about)} onChange={(value) => updateSection(['serviceCopy', 'about'], linesToArray(value))} rows={8} />
          <TextArea label="Story paragraphs, one per line" value={arrayToLines(draft.serviceCopy.story)} onChange={(value) => updateSection(['serviceCopy', 'story'], linesToArray(value))} rows={6} />
          <TextArea label="Service standards, one per line" value={arrayToLines(draft.serviceCopy.standards)} onChange={(value) => updateSection(['serviceCopy', 'standards'], linesToArray(value))} rows={7} />
          <TextArea label="Customer services, one per line" value={arrayToLines(draft.serviceCopy.customerServices)} onChange={(value) => updateSection(['serviceCopy', 'customerServices'], linesToArray(value))} rows={5} />
          <TextArea label="Commitment, one per line" value={arrayToLines(draft.serviceCopy.commitment)} onChange={(value) => updateSection(['serviceCopy', 'commitment'], linesToArray(value))} rows={5} />
          <TextArea label="Preparation checklist, one per line" value={arrayToLines(draft.preparationChecklist)} onChange={(value) => updateSection(['preparationChecklist'], linesToArray(value))} rows={8} />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
        <h2 className="text-2xl font-black uppercase text-white">Structured modules</h2>
        <div className="mt-6 grid gap-4">
          <JsonArea label="Trust badges JSON" value={draft.trustBadges} onChange={(value) => updateSection(['trustBadges'], value)} />
          <JsonArea label="Service cards JSON" value={draft.services.cards} onChange={(value) => updateSection(['services', 'cards'], value)} />
          <JsonArea label="Original story images JSON" value={draft.originalStoryImages} onChange={(value) => updateSection(['originalStoryImages'], value)} />
          <JsonArea label="Finance rows JSON" value={draft.finance.exampleRows} onChange={(value) => updateSection(['finance', 'exampleRows'], value)} />
          <JsonArea label="Legal pages JSON" value={draft.legal} onChange={(value) => updateSection(['legal'], value)} rows={12} />
        </div>
      </section>
    </div>
  )
}

function AdvancedPanel({ draft, setDraft }) {
  const [json, setJson] = useState(() => JSON.stringify(draft, null, 2))
  const [error, setError] = useState('')

  function applyJson() {
    try {
      setDraft(normalizeContent(JSON.parse(json)))
      setError('')
    } catch {
      setError('JSON is invalid. Fix the syntax before applying it.')
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
      <h2 className="text-2xl font-black uppercase text-white">Full content JSON</h2>
      <p className="mt-3 text-sm leading-7 text-stone-400">Use this for full-site module edits, bulk stock updates or restoring a known-good backup.</p>
      <textarea value={json} onChange={(event) => setJson(event.target.value)} rows="28" className="mt-6 w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 font-mono text-xs text-white outline-none focus:border-amber-300" />
      <button onClick={applyJson} className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-wider text-stone-950">
        Apply JSON <ArrowRight className="h-4 w-4" />
      </button>
      {error && <p className="mt-4 rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
    </section>
  )
}

function Field({ label, value, onChange, type = 'text', className = '' }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-300">{label}</span>
      <input value={value ?? ''} onChange={(event) => onChange(event.target.value)} type={type} className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-300">{label}</span>
      <select value={value || options[0]} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function TextArea({ label, value, onChange, rows = 4, className = '' }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-300">{label}</span>
      <textarea value={value ?? ''} onChange={(event) => onChange(event.target.value)} rows={rows} className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" />
    </label>
  )
}

function JsonArea({ label, value, onChange, rows = 8 }) {
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2))
  const [error, setError] = useState('')

  function handleBlur() {
    try {
      onChange(JSON.parse(raw))
      setError('')
    } catch {
      setError('Invalid JSON')
    }
  }

  return (
    <label>
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-300">{label}</span>
      <textarea value={raw} onChange={(event) => setRaw(event.target.value)} onBlur={handleBlur} rows={rows} className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 font-mono text-xs text-white outline-none focus:border-amber-300" />
      {error && <span className="mt-2 block text-xs text-red-200">{error}</span>}
    </label>
  )
}

function normalizeContent(content) {
  const next = clone(content)
  next.version = next.version || 1
  next.bikes = Array.isArray(next.bikes) ? next.bikes : []
  next.company = next.company || {}
  next.serviceCopy = next.serviceCopy || {}
  next.bikes = next.bikes.map((bike) => ({
    ...bike,
    slug: bike.slug || slugify(bike.title),
    status: bike.status || 'AVAILABLE',
    media: mediaFromBike(bike),
    images: mediaFromBike(bike).filter((item) => item.type === 'image').map((item) => item.url),
    specs: bike.specs && typeof bike.specs === 'object' ? bike.specs : {},
  }))
  return next
}
