import { HashRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
  Wallet,
  Wrench,
  X,
} from 'lucide-react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AdminPage from './AdminPage'
import { fetchCmsContent, loadLocalDraft, submitLead } from './cmsApi'
import { siteContent as defaultSiteContent } from './data/siteContent'

const iconMap = {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Wallet,
  Wrench,
}

const leadFormConfigs = {
  appointment: [
    { name: 'Bike of interest', label: 'Bike of interest', placeholder: 'Yamaha R125 / any 125cc bike' },
    { name: 'Preferred date', label: 'Preferred date', type: 'date' },
    { name: 'Preferred time window', label: 'Preferred time', placeholder: 'Morning / afternoon / after 5pm' },
    { name: 'Viewing purpose', label: 'Viewing purpose', placeholder: 'Buying / test ride discussion / paperwork check' },
  ],
  viewing: [
    { name: 'Bike of interest', label: 'Bike of interest', placeholder: 'Yamaha R125 / any 125cc bike' },
    { name: 'Preferred date', label: 'Preferred date', type: 'date' },
    { name: 'Preferred time window', label: 'Preferred time', placeholder: 'Morning / afternoon / after 5pm' },
  ],
  deposit: [
    { name: 'Bike to reserve', label: 'Bike to reserve', placeholder: 'Bike title or stock link' },
    { name: 'Proposed deposit', label: 'Proposed deposit', placeholder: 'e.g. £100 / £200 / discuss' },
    { name: 'When can you view or collect', label: 'Viewing / collection timing', placeholder: 'Today / this weekend / next week' },
    { name: 'Finance or cash buyer', label: 'Payment route', placeholder: 'Cash / finance / waiting for lender' },
  ],
  valuation: [
    { name: 'Registration', label: 'Registration', placeholder: 'AB12 CDE' },
    { name: 'Make and model', label: 'Make and model', placeholder: 'Yamaha MT-125' },
    { name: 'Mileage', label: 'Mileage', placeholder: '12,500' },
    { name: 'Service history', label: 'Service history', placeholder: 'Full / part / none / unknown' },
    { name: 'Outstanding finance', label: 'Outstanding finance', placeholder: 'No / yes / unsure' },
    { name: 'Preferred outcome', label: 'Preferred outcome', placeholder: 'Cash sale / part exchange / collection' },
  ],
  finance: [
    { name: 'Bike of interest', label: 'Bike of interest', placeholder: 'Bike title or budget range' },
    { name: 'Deposit available', label: 'Deposit available', placeholder: 'e.g. £300' },
    { name: 'Monthly budget', label: 'Monthly budget', placeholder: 'e.g. £80/month' },
    { name: 'Preferred term', label: 'Preferred term', placeholder: '24 / 36 / 48 months / unsure' },
  ],
}

const mergeObjectKeys = [
  'assets',
  'company',
  'splash',
  'home',
  'featuredStock',
  'brandStory',
  'originalImageStory',
  'services',
  'inventory',
  'actionWindows',
  'appointment',
  'deposit',
  'sell',
  'finance',
  'contact',
  'aboutPage',
  'legal',
  'leadForms',
  'cta',
  'footer',
]

function mergeNavItems(defaultItems = [], cmsItems = []) {
  const items = Array.isArray(cmsItems) && cmsItems.length ? [...cmsItems] : []
  const seen = new Set(items.map((item) => item?.[1]).filter(Boolean))
  defaultItems.forEach((item) => {
    if (!seen.has(item[1])) items.push(item)
  })
  return items.length ? items : defaultItems
}

function mergeServiceCards(defaultCards = [], cmsCards = []) {
  const cards = Array.isArray(cmsCards) && cmsCards.length ? [...cmsCards] : []
  const seen = new Set(cards.map((card) => card?.link).filter(Boolean))
  defaultCards.forEach((card) => {
    if (!seen.has(card.link)) cards.push(card)
  })
  return cards.length ? cards : defaultCards
}

function mergeSiteContent(defaultContent, cmsContent = {}) {
  const merged = { ...defaultContent, ...(cmsContent || {}) }
  mergeObjectKeys.forEach((key) => {
    const defaultValue = defaultContent[key]
    const cmsValue = cmsContent?.[key]
    if (defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
      merged[key] = { ...defaultValue, ...(cmsValue && typeof cmsValue === 'object' && !Array.isArray(cmsValue) ? cmsValue : {}) }
    }
  })
  merged.navItems = mergeNavItems(defaultContent.navItems, cmsContent?.navItems)
  merged.services.cards = mergeServiceCards(defaultContent.services?.cards, cmsContent?.services?.cards)
  return merged
}

const SiteContentContext = createContext(defaultSiteContent)
const CMS_SYNC_INTERVAL_MS = 30000

function useSiteContent() {
  return useContext(SiteContentContext)
}

function formatPrice(value) {
  if (!value) return 'POA'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatMileage(value) {
  if (!value) return 'Ask for mileage'
  return `${new Intl.NumberFormat('en-GB').format(value)} miles`
}

function monthlyFrom(price) {
  if (!price) return null
  return Math.max(49, Math.round(price / 48 + price * 0.011))
}

const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v']

function mediaTypeFromUrl(url = '', explicitType = '') {
  if (explicitType === 'video' || explicitType === 'image') return explicitType
  const lower = url.toLowerCase().split('?')[0]
  if (url.startsWith('data:video/') || videoExtensions.some((ext) => lower.endsWith(ext))) return 'video'
  return 'image'
}

function getBikeMedia(bike) {
  const explicit = Array.isArray(bike?.media) ? bike.media : []
  const fallback = Array.isArray(bike?.images) ? bike.images : []
  return (explicit.length ? explicit : fallback)
    .map((item, index) => {
      const media = typeof item === 'string' ? { url: item } : item
      return {
        type: mediaTypeFromUrl(media?.url, media?.type),
        url: media?.url || '',
        label: media?.label || '',
        order: Number.isFinite(media?.order) ? media.order : index,
      }
    })
    .filter((item) => item.url)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'video' ? -1 : 1
      return a.order - b.order
    })
}

function getBikePoster(bike) {
  const media = getBikeMedia(bike)
  return media.find((item) => item.type === 'image')?.url || media[0]?.url || ''
}

function availableBikes(bikeList) {
  return bikeList.filter((bike) => bike.status !== 'SOLD')
}

function soldBikes(bikeList) {
  return bikeList.filter((bike) => bike.status === 'SOLD')
}

function cleanDealerNotes(notes) {
  return notes
    .split('\nGallery')[0]
    .split('\nConnected Pages')[0]
    .replace(/\n'\s*$/g, '')
    .trim()
}

function App() {
  const [content, setContent] = useState(() => mergeSiteContent(defaultSiteContent, loadLocalDraft() || {}))

  useEffect(() => {
    let active = true
    const loadCmsContent = () => fetchCmsContent()
      .then((cmsContent) => {
        if (active && cmsContent?.bikes?.length) {
          setContent(mergeSiteContent(defaultSiteContent, cmsContent))
        }
      })
      .catch(() => {
        // The static default content keeps the site usable before the PHP CMS API is deployed.
      })
    const syncVisibleContent = () => {
      if (document.visibilityState !== 'hidden') loadCmsContent()
    }

    loadCmsContent()
    const syncTimer = window.setInterval(syncVisibleContent, CMS_SYNC_INTERVAL_MS)
    window.addEventListener('focus', syncVisibleContent)
    document.addEventListener('visibilitychange', syncVisibleContent)

    return () => {
      active = false
      window.clearInterval(syncTimer)
      window.removeEventListener('focus', syncVisibleContent)
      document.removeEventListener('visibilitychange', syncVisibleContent)
    }
  }, [])

  return (
    <SiteContentContext.Provider value={content}>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-stone-950 text-stone-50 selection:bg-amber-400 selection:text-stone-950">
          <SiteChrome />
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/bikes" element={<InventoryPage />} />
            <Route path="/bikes/:slug" element={<BikeDetailPage />} />
            <Route path="/book-viewing" element={<AppointmentPage />} />
            <Route path="/reserve" element={<DepositPage />} />
            <Route path="/sell-your-bike" element={<SellPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/legal/:type" element={<LegalPage />} />
            <Route path="/admin" element={<AdminPage content={content} onContentUpdate={setContent} />} />
          </Routes>
          <Footer />
        </div>
      </HashRouter>
    </SiteContentContext.Provider>
  )
}


function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function SiteChrome() {
  const [open, setOpen] = useState(false)
  const { assets, company, navItems } = useSiteContent()
  const brandLogo = assets.brandLogo

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <img src={brandLogo} alt="Knights Motorcycles gold knight logo" className="h-12 w-12 rounded-full border border-amber-300/30 object-cover shadow-lg shadow-amber-500/10" />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white">Knights</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-amber-300">Used Motorcycles Leeds</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition ${
                  isActive ? 'bg-amber-300 text-stone-950' : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={company.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 px-4 py-2 text-xs font-black tracking-wider text-amber-200 transition hover:bg-amber-300 hover:text-stone-950">
            <Phone className="h-3.5 w-3.5" /> {company.phone}
          </a>
        </div>

        <button className="rounded-full border border-stone-700 p-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-800 bg-stone-950 px-4 pb-4 md:hidden">
          <nav className="grid gap-2">
            {navItems.map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => setOpen(false)} className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold uppercase tracking-wider text-stone-100">
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

function SplashPage() {
  const { assets, bikes, splash } = useSiteContent()
  const brandLogo = assets.brandLogo
  const heroVideo = assets.heroVideo
  const poster = getBikePoster(bikes[0])

  return (
    <main className="relative min-h-[calc(100vh-76px)] overflow-hidden">
      <div className="absolute inset-0 bg-stone-950">
        <video
          className="h-full w-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/72 via-stone-950/22 to-stone-950/86" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(245,158,11,0.20),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.10),transparent_26%)]" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-76px)] flex-col">
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-5xl text-center">
            <img src={brandLogo} alt="Knights Motorcycles gold logo" className="mx-auto mb-8 h-28 w-28 rounded-full border border-amber-300/40 object-cover shadow-2xl shadow-amber-900/40" />
            <p className="text-xs font-black uppercase tracking-[0.34em] text-amber-200">{splash.eyebrow}</p>
            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] text-white drop-shadow-2xl sm:text-7xl md:text-8xl">
              {splash.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold uppercase tracking-[0.24em] text-stone-200">
              {splash.subtitle}
            </p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-300">
              {splash.text}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/home" className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-amber-300 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-stone-950 shadow-2xl shadow-amber-900/30 transition hover:bg-amber-200 sm:w-auto">
                {splash.primaryCta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/bikes" className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-stone-950/35 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:border-amber-300 sm:w-auto">
                {splash.secondaryCta}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-stone-950/35 px-4 py-5 backdrop-blur-md">
          <div className="mx-auto grid max-w-5xl gap-3 text-center sm:grid-cols-4">
            {splash.metrics.map(([value, label]) => <SplashMetric key={label} value={value} label={label} />)}
          </div>
        </div>
      </div>
    </main>
  )
}

function SplashMetric({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-stone-950/35 px-4 py-3">
      <p className="text-lg font-black uppercase text-amber-200">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-300">{label}</p>
    </div>
  )
}

function HomePage() {
  const { bikes, home } = useSiteContent()
  const featured = availableBikes(bikes).slice(0, 6)
  const heroBike = featured[0] || bikes[0]
  const heroPoster = getBikePoster(heroBike)

  return (
    <main>
      <section className="relative overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0">
          <img src={heroPoster} alt="Knights Motorcycles showroom bike" className="h-full w-full object-cover opacity-28" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.22),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_26%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-amber-200">
              {home.heroEyebrow}
            </p>
            <h1 className="mt-7 max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl">
              {home.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              {home.heroText}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/bikes" className="inline-flex items-center justify-center gap-3 rounded-full bg-amber-300 px-7 py-4 text-sm font-black uppercase tracking-wider text-stone-950 transition hover:bg-amber-200">
                {home.primaryCta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/sell-your-bike" className="inline-flex items-center justify-center gap-3 rounded-full border border-stone-600 bg-stone-950/60 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:border-amber-300">
                {home.secondaryCta}
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {home.stats.map(([value, label]) => <Stat key={label} value={value} label={label} />)}
            </div>
          </div>

          {heroBike && <div className="rounded-[2rem] border border-stone-700 bg-stone-950/80 p-4 shadow-2xl shadow-black/40">
            <div className="overflow-hidden rounded-[1.5rem] bg-stone-900">
              <MediaDisplay media={getBikeMedia(heroBike)[0]} title={heroBike.title} className="h-80 w-full object-contain p-3" />
            </div>
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">{home.featuredLabel}</p>
              <h2 className="mt-2 text-2xl font-black text-white">{heroBike.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">{heroBike.story}</p>
              <div className="mt-5 flex items-center justify-between border-t border-stone-800 pt-5">
                <span className="text-2xl font-black text-amber-200">{formatPrice(heroBike.price)}</span>
                <Link to={`/bikes/${heroBike.slug}`} className="text-xs font-black uppercase tracking-wider text-white hover:text-amber-200">View bike</Link>
              </div>
            </div>
          </div>}
        </div>
      </section>

      <TrustStrip />
      <FeaturedStock bikes={featured} />
      <BrandStory />
      <OriginalImageStory />
      <ActionWindowsSection />
      <ServicesSection />
      <CallToAction />
    </main>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-stone-700 bg-stone-950/70 p-4">
      <p className="text-2xl font-black text-amber-200">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
    </div>
  )
}

function TrustStrip() {
  const { trustBadges } = useSiteContent()

  return (
    <section className="border-b border-stone-800 bg-stone-900/70 px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {trustBadges.map(({ label, desc, icon }) => {
          const Icon = iconMap[icon] || ShieldCheck
          return (
          <div key={label} className="rounded-2xl border border-stone-700 bg-stone-950/50 p-4">
            <Icon className="h-5 w-5 text-amber-300" />
            <h3 className="mt-3 text-sm font-black uppercase tracking-wider text-white">{label}</h3>
            <p className="mt-1 text-xs leading-5 text-stone-400">{desc}</p>
          </div>
          )
        })}
      </div>
    </section>
  )
}

function FeaturedStock({ bikes: featured }) {
  const { featuredStock, bikes } = useSiteContent()

  return (
    <section className="px-4 py-20">
      <SectionHeading eyebrow={featuredStock.eyebrow} title={featuredStock.title} text={featuredStock.text} />
      <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((bike) => <BikeCard key={bike.slug} bike={bike} />)}
      </div>
      <div className="mt-10 text-center">
        <Link to="/bikes" className="inline-flex items-center gap-3 rounded-full border border-amber-300/40 px-7 py-4 text-sm font-black uppercase tracking-wider text-amber-200 transition hover:bg-amber-300 hover:text-stone-950">
          {featuredStock.cta || `Browse all ${bikes.length} bikes`} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

function BrandStory() {
  const { brandStory, serviceCopy } = useSiteContent()

  return (
    <section className="border-y border-stone-800 bg-stone-900/40 px-4 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">{brandStory.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">{brandStory.title}</h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-stone-300">
          {serviceCopy.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {brandStory.highlights.map((item) => (
              <div key={item} className="rounded-2xl border border-stone-700 bg-stone-950/70 p-5">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <p className="mt-3 text-sm font-black uppercase tracking-wider text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function OriginalImageStory() {
  const { originalImageStory, originalStoryImages } = useSiteContent()

  return (
    <section className="overflow-hidden border-y border-stone-800 bg-stone-950 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <SectionHeading align="left" eyebrow={originalImageStory.eyebrow} title={originalImageStory.title} text={originalImageStory.text} />
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 text-sm leading-7 text-amber-50">
            <p className="font-bold text-amber-100">{originalImageStory.noteTitle}</p>
            <p className="mt-2 text-stone-200">{originalImageStory.noteText}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {originalStoryImages.map((image) => (
            <article key={image.src} className="group overflow-hidden rounded-[1.75rem] border border-stone-700 bg-stone-900/60">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                <img src={image.src} alt={image.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-stone-950/75 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200 ring-1 ring-amber-300/25">{image.label}</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{image.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-400">{image.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


function ActionWindowsSection({ compact = false }) {
  const { actionWindows } = useSiteContent()
  const windows = actionWindows ? Object.entries(actionWindows) : []
  if (!windows.length) return null

  return (
    <section className={`${compact ? 'py-10' : 'border-y border-stone-800 bg-stone-900/30 px-4 py-20'}`}>
      <div className="mx-auto max-w-7xl">
        {!compact && <SectionHeading eyebrow="Customer action windows" title="Four clear ways to move forward" text="Book a viewing, reserve a bike, request a sell/PX valuation or start a finance enquiry from one simple section." />}
        <div className={`${compact ? 'grid gap-4 md:grid-cols-2' : 'mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4'}`}>
          {windows.map(([key, item]) => {
            const Icon = iconMap[item.icon] || CalendarDays
            return (
              <Link key={key} to={item.path} className="group rounded-[1.75rem] border border-stone-700 bg-stone-950/75 p-6 transition hover:-translate-y-1 hover:border-amber-300/60 hover:shadow-2xl hover:shadow-black/30">
                <div className="flex items-center justify-between gap-4">
                  <Icon className="h-8 w-8 text-amber-300" />
                  <span className="rounded-full border border-amber-300/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">{item.cta}</span>
                </div>
                <h3 className="mt-6 text-2xl font-black uppercase leading-tight text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-400">{item.text}</p>
                {Array.isArray(item.bullets) && (
                  <div className="mt-5 grid gap-2">
                    {item.bullets.map((bullet) => (
                      <p key={bullet} className="flex gap-2 text-xs leading-5 text-stone-300">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" /> {bullet}
                      </p>
                    ))}
                  </div>
                )}
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-200">
                  Open window <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const { services } = useSiteContent()

  return (
    <section className="px-4 py-20">
      <SectionHeading eyebrow={services.eyebrow} title={services.title} text={services.text} />
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {services.cards.map(({ title, text, link, icon }) => {
          const Icon = iconMap[icon] || ShieldCheck
          return (
          <Link key={title} to={link} className="group rounded-[1.75rem] border border-stone-700 bg-stone-900/60 p-6 transition hover:-translate-y-1 hover:border-amber-300/60">
            <Icon className="h-8 w-8 text-amber-300" />
            <h3 className="mt-6 text-2xl font-black uppercase text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-400">{text}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-200">
              Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </span>
          </Link>
          )
        })}
      </div>
    </section>
  )
}

function InventoryPage() {
  const { bikes, inventory } = useSiteContent()
  const [status, setStatus] = useState('ALL')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    return bikes.filter((bike) => {
      const statusMatch = status === 'ALL' || bike.status === status
      const q = query.trim().toLowerCase()
      const queryMatch = !q || [bike.title, bike.make, bike.model, bike.engine, bike.style, bike.colour].join(' ').toLowerCase().includes(q)
      return statusMatch && queryMatch
    })
  }, [bikes, query, status])

  return (
    <main className="px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={inventory.eyebrow} title={inventory.title} text={`${availableBikes(bikes).length} motorcycles currently available and ${soldBikes(bikes).length} recently sold examples.`} align="left" />
        <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-stone-700 bg-stone-900/50 p-4 md:grid-cols-[1fr_auto]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={inventory.searchPlaceholder} className="rounded-full border border-stone-700 bg-stone-950 px-5 py-3 text-sm text-white outline-none focus:border-amber-300" />
          <div className="flex gap-2">
            {['ALL', 'AVAILABLE', 'SOLD'].map((item) => (
              <button key={item} onClick={() => setStatus(item)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${status === item ? 'bg-amber-300 text-stone-950' : 'bg-stone-800 text-stone-300'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((bike) => <BikeCard key={bike.slug} bike={bike} />)}
        </div>
      </div>
    </main>
  )
}

function BikeCard({ bike }) {
  const sold = bike.status === 'SOLD'
  const primaryMedia = getBikeMedia(bike)[0]
  return (
    <Link to={`/bikes/${bike.slug}`} className="group overflow-hidden rounded-[1.6rem] border border-stone-700 bg-stone-900/60 transition hover:-translate-y-1 hover:border-amber-300/50 hover:shadow-2xl hover:shadow-black/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
        <MediaDisplay media={primaryMedia} title={bike.title} className="h-full w-full object-contain p-3 transition duration-700 group-hover:scale-[1.02]" compact />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${sold ? 'bg-stone-100 text-stone-950' : 'bg-emerald-400 text-stone-950'}`}>{bike.status}</span>
          <span className="rounded-full bg-stone-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-200">{bike.engine}</span>
          {primaryMedia?.type === 'video' && <span className="rounded-full bg-sky-300 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-stone-950">Video</span>}
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-stone-950/85 px-4 py-2 text-lg font-black text-amber-200">{formatPrice(bike.price)}</div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-black uppercase leading-tight text-white">{bike.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-400">{bike.story}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <MiniSpec label="Year" value={bike.year || '—'} />
          <MiniSpec label="Mileage" value={bike.mileage ? `${Math.round(bike.mileage / 100) / 10}k` : 'Ask'} />
          <MiniSpec label="Colour" value={bike.colour || 'Ask'} />
        </div>
      </div>
    </Link>
  )
}

function BikeDetailPage() {
  const { bikes, company, preparationChecklist } = useSiteContent()
  const { slug } = useParams()
  const bike = bikes.find((item) => item.slug === slug)
  const [active, setActive] = useState(0)

  if (!bike) {
    return <NotFound />
  }

  const finance = monthlyFrom(bike.price)
  const media = getBikeMedia(bike)
  const activeMedia = media[active] || media[0]

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <Link to="/bikes" className="inline-flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-amber-200">
          ← Back to all stock
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-[2rem] border border-stone-700 bg-stone-900">
              <MediaDisplay media={activeMedia} title={bike.title} className="max-h-[680px] w-full object-contain" controls />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-6">
              {media.map((item, index) => (
                <button key={`${item.url}-${index}`} onClick={() => setActive(index)} className={`relative overflow-hidden rounded-xl border ${active === index ? 'border-amber-300' : 'border-stone-700'}`}>
                  <MediaDisplay media={item} title={`${bike.title} ${index + 1}`} className="aspect-square w-full object-contain bg-stone-950 p-1" compact />
                  {item.type === 'video' && <span className="absolute bottom-1 left-1 rounded-full bg-sky-300 px-2 py-0.5 text-[9px] font-black uppercase text-stone-950">Video</span>}
                </button>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] border border-stone-700 bg-stone-900/70 p-6">
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${bike.status === 'SOLD' ? 'bg-stone-100 text-stone-950' : 'bg-emerald-400 text-stone-950'}`}>{bike.status}</span>
                <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-200">HPI Checked</span>
              </div>
              <h1 className="mt-5 text-4xl font-black uppercase leading-tight text-white">{bike.title}</h1>
              <p className="mt-5 text-5xl font-black text-amber-200">{formatPrice(bike.price)}</p>
              {finance && <p className="mt-2 text-sm text-stone-400">Representative finance from approx. {formatPrice(finance)}/month, subject to status.</p>}
              <p className="mt-6 text-base leading-8 text-stone-300">{bike.story}</p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <Detail label="Year" value={bike.year || 'Ask'} />
                <Detail label="Mileage" value={formatMileage(bike.mileage)} />
                <Detail label="Engine" value={bike.engine} />
                <Detail label="Colour" value={bike.colour || 'Ask'} />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a href={company.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-black uppercase tracking-wider text-stone-950">
                  <Phone className="h-4 w-4" /> Call now
                </a>
                <a href={`mailto:${company.email}?subject=Enquiry about ${encodeURIComponent(bike.title)}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:border-amber-300">
                  <Mail className="h-4 w-4" /> Enquire
                </a>
                <Link to="/book-viewing" className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/50 px-5 py-3 text-sm font-black uppercase tracking-wider text-amber-100 hover:bg-amber-300 hover:text-stone-950">
                  <CalendarDays className="h-4 w-4" /> Book viewing
                </Link>
                <Link to="/reserve" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:border-amber-300">
                  <Wallet className="h-4 w-4" /> Reserve
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-stone-700 bg-stone-900/60 p-7">
            <h2 className="text-2xl font-black uppercase text-white">Prepared for handover</h2>
            <div className="mt-6 grid gap-3">
              {preparationChecklist.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-stone-300">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber-300" /> {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-700 bg-stone-900/60 p-7">
            <h2 className="text-2xl font-black uppercase text-white">Dealer notes and rider story</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-300">{cleanDealerNotes(bike.originalNotes)}</p>
            <a href={bike.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-amber-200">
              View detailed listing notes <ArrowRight className="h-4 w-4" />
            </a>
          </section>
        </div>
      </div>
    </main>
  )
}

function MediaDisplay({ media, title, className, controls = false, compact = false }) {
  if (!media?.url) {
    return <div className={`flex items-center justify-center bg-stone-950 text-xs uppercase tracking-wider text-stone-500 ${className}`}>No media</div>
  }

  if (media.type === 'video') {
    return (
      <video
        src={media.url}
        className={className}
        controls={controls}
        muted={!controls}
        loop={compact}
        playsInline
        preload="metadata"
      />
    )
  }

  return <img src={media.url} alt={media.label || title} className={className} loading="lazy" />
}


function AppointmentPage() {
  const { appointment } = useSiteContent()
  return (
    <main className="px-4 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading align="left" eyebrow={appointment.eyebrow} title={appointment.title} text={appointment.text} />
          <InfoChecklist title={appointment.checklistTitle} items={appointment.checklist} />
          <ActionWindowsSection compact />
        </div>
        <LeadForm type="appointment" title={appointment.formTitle || 'Appointment request'} />
      </div>
    </main>
  )
}

function DepositPage() {
  const { deposit } = useSiteContent()
  return (
    <main className="px-4 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading align="left" eyebrow={deposit.eyebrow} title={deposit.title} text={deposit.text} />
          <InfoChecklist title={deposit.checklistTitle} items={deposit.checklist} />
          <div className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5 text-sm leading-7 text-amber-50">
            <strong className="text-amber-200">Important:</strong> {deposit.disclaimer}
          </div>
        </div>
        <LeadForm type="deposit" title={deposit.formTitle || 'Deposit / reservation enquiry'} />
      </div>
    </main>
  )
}

function InfoChecklist({ title, items = [] }) {
  return (
    <section className="mt-8 rounded-[1.75rem] border border-stone-700 bg-stone-900/60 p-6">
      <h2 className="text-2xl font-black uppercase text-white">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <p key={item} className="flex gap-3 text-sm leading-6 text-stone-300">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber-300" /> {item}
          </p>
        ))}
      </div>
    </section>
  )
}

function SellPage() {
  const { sell } = useSiteContent()

  return (
    <main className="px-4 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading align="left" eyebrow={sell.eyebrow} title={sell.title} text={sell.text} />
          <div className="mt-8 space-y-4">
            {sell.steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-stone-700 bg-stone-900/60 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-300 text-sm font-black text-stone-950">{index + 1}</span>
                <p className="text-sm font-bold text-stone-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <LeadForm type="valuation" title="Request a valuation" />
      </div>
    </main>
  )
}

function FinancePage() {
  const { finance } = useSiteContent()

  return (
    <main className="px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={finance.eyebrow} title={finance.title} text={finance.text} />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-6">
            <section className="rounded-[2rem] border border-stone-700 bg-stone-900/60 p-7">
              <h2 className="text-2xl font-black uppercase text-white">{finance.exampleTitle}</h2>
              <div className="mt-6 grid gap-3">
                {finance.exampleRows.map(([label, value]) => <DetailRow key={label} label={label} value={value} />)}
              </div>
              <p className="mt-5 text-xs leading-6 text-stone-400">{finance.disclaimer}</p>
            </section>
            <InfoChecklist title="Finance enquiry flow" items={finance.steps} />
          </div>
          <LeadForm type="finance" title="Finance enquiry" />
        </div>
      </div>
    </main>
  )
}

function ContactPage() {
  const { company, contact } = useSiteContent()

  return (
    <main className="px-4 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading align="left" eyebrow={contact.eyebrow} title={contact.title} text={contact.text} />
          <div className="mt-8 grid gap-4">
            <ContactCard icon={Phone} label="Call or text" value={company.phone} href={company.phoneHref} />
            <ContactCard icon={Mail} label="Email" value={company.email} href={company.emailHref} />
            <ContactCard icon={MapPin} label="Address" value={company.address} href={company.mapsUrl} />
            <ContactCard icon={Clock} label="Hours" value={`${company.supportHours}. ${company.viewingHours}.`} />
          </div>
          <div className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5 text-sm leading-7 text-amber-50">
            <strong className="text-amber-200">Viewing tip:</strong> {contact.tip}
          </div>
        </div>
        <LeadForm type="appointment" title="Book a viewing" />
      </div>
    </main>
  )
}

function AboutPage() {
  const { aboutPage, serviceCopy } = useSiteContent()
  const panelSources = {
    about: serviceCopy.about,
    story: serviceCopy.story,
    standards: serviceCopy.standards,
    'customerServices+commitment': serviceCopy.customerServices.concat(serviceCopy.commitment),
  }

  return (
    <main className="px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={aboutPage.eyebrow} title={aboutPage.title} text={aboutPage.text} />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {aboutPage.panels.map((panel) => <StoryPanel key={panel.title} title={panel.title} paragraphs={panelSources[panel.source] || []} />)}
        </div>
      </div>
    </main>
  )
}

function LegalPage() {
  const { legal } = useSiteContent()
  const { type } = useParams()
  const page = legal[type] || legal.privacy
  return (
    <main className="px-4 py-14">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-stone-700 bg-stone-900/60 p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Legal</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">{page.title}</h1>
        <p className="mt-6 text-base leading-8 text-stone-300">{page.text}</p>
        <p className="mt-6 text-sm leading-7 text-stone-400">{legal.footerText}</p>
      </div>
    </main>
  )
}

function LeadForm({ title, type }) {
  const { company, leadForms } = useSiteContent()
  const [submission, setSubmission] = useState({ status: 'idle', reference: '', error: '', fallbackHref: '' })
  const fields = leadFormConfigs[type] || leadFormConfigs.appointment
  const subject = leadForms[type] || title

  function buildEmailFallback(form) {
    const lines = Array.from(form.entries())
      .filter(([key, value]) => key !== 'Consent' && key !== 'website' && String(value || '').trim())
      .map(([key, value]) => `${key}: ${value}`)
    return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const payload = {
      type,
      subject,
      customer: {
        name: form.get('Name'),
        phone: form.get('Phone'),
        email: form.get('Email'),
        preferredContact: form.get('Preferred contact'),
      },
      fields: Object.fromEntries(fields.map((field) => [field.name, form.get(field.name)])),
      message: form.get('Message'),
      consent: Boolean(form.get('Consent')),
      sourcePath: window.location.hash.replace('#', '') || window.location.pathname,
    }
    const fallbackHref = buildEmailFallback(form)
    setSubmission({ status: 'sending', reference: '', error: '', fallbackHref })
    try {
      const result = await submitLead(payload)
      setSubmission({ status: 'sent', reference: result.reference || result.lead?.id || '', error: '', fallbackHref })
      formElement.reset()
    } catch (error) {
      setSubmission({ status: 'error', reference: '', error: error.message || 'Unable to submit enquiry.', fallbackHref })
    }
  }

  const isSending = submission.status === 'sending'

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-stone-700 bg-stone-900/70 p-7">
      <h2 className="text-2xl font-black uppercase text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-400">This window saves the enquiry into the dealer admin system. Email and phone contact remain available as a fallback.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormInput name="Name" label="Your name" required />
        <FormInput name="Phone" label="Phone" required />
        <FormInput name="Email" label="Email" type="email" />
        <FormInput name="Preferred contact" label="Preferred contact" placeholder="Call / text / email" />
        {fields.map((field) => (
          <FormInput key={field.name} {...field} />
        ))}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-300">Message</label>
          <textarea name="Message" rows="5" className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" placeholder="Tell us anything else the dealer should know." />
        </div>
      </div>
      <label className="mt-5 flex gap-3 text-xs leading-5 text-stone-400">
        <input required type="checkbox" name="Consent" className="mt-1" />
        I agree to be contacted by Knights Motorcycles about this enquiry.
      </label>
      <button disabled={isSending} className="mt-6 inline-flex items-center gap-3 rounded-full bg-amber-300 px-7 py-4 text-sm font-black uppercase tracking-wider text-stone-950 disabled:cursor-not-allowed disabled:opacity-60" type="submit">
        {isSending ? 'Sending enquiry...' : 'Send enquiry'} <ArrowRight className="h-4 w-4" />
      </button>
      {submission.status === 'sent' && (
        <p className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
          Enquiry received. Thank you, Knights will contact you shortly.{submission.reference ? ` Reference: ${submission.reference}.` : ''}
        </p>
      )}
      {submission.status === 'error' && (
        <p className="mt-4 rounded-2xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          We could not save the enquiry: {submission.error}. Use the email fallback below or call the dealership.{' '}
          <a className="font-bold underline" href={submission.fallbackHref}>Open email fallback</a>
        </p>
      )}
    </form>
  )
}

function Footer() {
  const { company, footer } = useSiteContent()

  return (
    <footer className="border-t border-stone-800 bg-stone-950 px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-xl font-black uppercase tracking-[0.22em] text-white">Knights Motorcycles</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400">{footer.text}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-amber-300">Contact</p>
          <div className="mt-4 space-y-2 text-sm text-stone-400">
            <p>{company.phone}</p>
            <p>{company.email}</p>
            <p>{company.address}</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-amber-300">Legal</p>
          <div className="mt-4 grid gap-2 text-sm text-stone-400">
            <Link to="/legal/privacy">Privacy Policy</Link>
            <Link to="/legal/cookies">Cookie Policy</Link>
            <Link to="/legal/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SectionHeading({ eyebrow, title, text, align = 'center' }) {
  return (
    <div className={`mx-auto max-w-4xl ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-stone-300">{text}</p>}
    </div>
  )
}

function MiniSpec({ label, value }) {
  return (
    <div className="rounded-xl bg-stone-950/70 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-1 truncate text-xs font-black text-stone-100">{value}</p>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="rounded-2xl border border-stone-700 bg-stone-950/70 p-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-800 py-3">
      <span className="text-sm text-stone-400">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  )
}

function FormInput({ label, name, type = 'text', placeholder = '', required = false }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-300">{label}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" />
    </div>
  )
}

function ContactCard({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex gap-4 rounded-2xl border border-stone-700 bg-stone-900/60 p-5 transition hover:border-amber-300/50">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-stone-500">{label}</p>
        <p className="mt-1 text-sm leading-6 text-stone-200">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{content}</a> : content
}

function StoryPanel({ title, paragraphs }) {
  return (
    <section className="rounded-[2rem] border border-stone-700 bg-stone-900/60 p-7">
      <h2 className="text-2xl font-black uppercase text-white">{title}</h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-stone-300">
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>
  )
}

function CallToAction() {
  const { company, cta } = useSiteContent()

  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-300/15 to-stone-900 p-8 text-center sm:p-12">
        <Star className="mx-auto h-8 w-8 text-amber-300" />
        <h2 className="mt-5 text-4xl font-black uppercase tracking-tight text-white">{cta.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-stone-300">{cta.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={company.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 text-sm font-black uppercase tracking-wider text-stone-950"><Phone className="h-4 w-4" /> Call {company.phone}</a>
          <Link to={cta.secondaryPath || '/book-viewing'} className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-600 px-7 py-4 text-sm font-black uppercase tracking-wider text-white">{cta.secondary}</Link>
        </div>
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase text-white">Bike not found</h1>
        <Link to="/bikes" className="mt-5 inline-flex items-center gap-2 text-amber-200">Back to stock <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </main>
  )
}

export default App
