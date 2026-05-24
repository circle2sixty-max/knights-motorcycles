import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  Database,
  FileJson,
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
  uploadCmsImage,
} from './cmsApi'

const tabs = [
  ['overview', 'Overview', Database],
  ['stock', 'Stock', Bike],
  ['company', 'Company', Settings],
  ['pages', 'Page copy', FileJson],
  ['advanced', 'Advanced JSON', FileJson],
]

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
  const [localMode, setLocalMode] = useState(Boolean(loadLocalDraft()))
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
    try {
      await loginToCms(password)
      setAuthenticated(true)
      setLocalMode(false)
      setMessage('Logged in. Changes can now be published to the live CMS data file.')
    } catch (loginError) {
      setError(loginError.message)
    }
  }

  async function handleLogout() {
    await logoutFromCms()
    setAuthenticated(false)
    setPassword('')
    setMessage('Logged out.')
  }

  async function handleSave() {
    setError('')
    setMessage('')
    const nextContent = normalizeContent(draft)
    if (localMode) {
      saveLocalDraft(nextContent)
      onContentUpdate(nextContent)
      setMessage('Saved as a local browser draft. Deploy the PHP API to publish changes live.')
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

  function updateBikeImages(value) {
    updateBike('images', linesToArray(value))
  }

  function updateBikeSpecs(value) {
    updateBike('specs', parseJson(value, selectedBike.specs || {}))
  }

  async function handleBikeImageUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    try {
      const result = await uploadCmsImage(file)
      updateBike('images', [...(selectedBike.images || []), result.url])
      setMessage(`Uploaded ${file.name}`)
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

  if (!authenticated && !localMode) {
    return (
      <AdminShell title="Knights CMS" subtitle="Protected editing area for stock, company details and page modules.">
        <form onSubmit={handleLogin} className="mx-auto max-w-md rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-7">
          <Lock className="h-8 w-8 text-amber-300" />
          <h1 className="mt-5 text-3xl font-black uppercase text-white">Admin login</h1>
          <p className="mt-3 text-sm leading-6 text-stone-400">Use the CMS password configured on the Fasthosts PHP API.</p>
          <label className="mt-6 block text-xs font-black uppercase tracking-wider text-stone-300">Password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-2 w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300"
            autoComplete="current-password"
            required
          />
          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-black uppercase tracking-wider text-stone-950">
            Login <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setLocalMode(true)} className="mt-3 w-full rounded-full border border-stone-700 px-6 py-3 text-xs font-black uppercase tracking-wider text-stone-300 hover:border-amber-300">
            Continue in local draft mode
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
            setSelectedSlug={setSelectedSlug}
            updateBike={updateBike}
            updateBikeNumber={updateBikeNumber}
            updateBikeImages={updateBikeImages}
            updateBikeSpecs={updateBikeSpecs}
            onUpload={handleBikeImageUpload}
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
      {localMode && <p className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">Local draft mode: changes stay in this browser until the PHP API is deployed and you publish them.</p>}
      {message && <p className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
      {error && <p className="rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
    </div>
  )
}

function OverviewPanel({ draft, stockCounts, onExport, onImport, onClearLocal }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-[1.5rem] border border-stone-700 bg-stone-900/70 p-6">
        <h2 className="text-2xl font-black uppercase text-white">Publishing status</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <AdminStat value={stockCounts.total} label="Total bikes" />
          <AdminStat value={stockCounts.available} label="Available" />
          <AdminStat value={stockCounts.sold} label="Sold" />
        </div>
        <div className="mt-6 grid gap-3">
          {[
            'Stock listings can be added, edited, sold or removed.',
            'Business contact details drive the phone, email and map links.',
            'Page copy, service cards, legal copy and story modules are editable.',
            'Images can be uploaded once the PHP API is live on Fasthosts.',
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

function AdminStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-stone-700 bg-stone-950 p-4">
      <p className="text-3xl font-black text-amber-200">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-stone-500">{label}</p>
    </div>
  )
}

function StockPanel({ bikes, selectedBike, selectedSlug, setSelectedSlug, updateBike, updateBikeNumber, updateBikeImages, updateBikeSpecs, onUpload, addBike, removeBike }) {
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
        <div className="grid max-h-[760px] gap-2 overflow-auto pr-1">
          {bikes.map((bike) => (
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
          <Field label="Title" value={selectedBike.title} onChange={(value) => updateBike('title', value)} />
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
          <TextArea label="Short story" value={selectedBike.story} onChange={(value) => updateBike('story', value)} className="md:col-span-2" />
          <TextArea label="Summary" value={selectedBike.summary} onChange={(value) => updateBike('summary', value)} className="md:col-span-2" rows={5} />
          <TextArea label="Dealer notes" value={selectedBike.originalNotes} onChange={(value) => updateBike('originalNotes', value)} className="md:col-span-2" rows={8} />
          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-xs font-black uppercase tracking-wider text-stone-300">Image URLs, one per line</label>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-700 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-stone-300 hover:border-amber-300">
                <ImagePlus className="h-3.5 w-3.5" /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </label>
            </div>
            <textarea value={arrayToLines(selectedBike.images)} onChange={(event) => updateBikeImages(event.target.value)} rows="8" className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" />
          </div>
          <TextArea label="Specs JSON" value={JSON.stringify(selectedBike.specs || {}, null, 2)} onChange={updateBikeSpecs} className="md:col-span-2" rows={8} />
        </div>
      </section>
    </div>
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
    images: Array.isArray(bike.images) ? bike.images.filter(Boolean) : [],
    specs: bike.specs && typeof bike.specs === 'object' ? bike.specs : {},
  }))
  return next
}
