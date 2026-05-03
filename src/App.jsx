import { HashRouter, Link, NavLink, Route, Routes, useParams } from 'react-router-dom'
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
import { useMemo, useState } from 'react'
import { bikes, company, serviceCopy } from './data/siteContent'

const navItems = [
  ['Stock', '/bikes'],
  ['Sell Your Bike', '/sell-your-bike'],
  ['Finance', '/finance'],
  ['About', '/about'],
  ['Contact', '/contact'],
]

const trustBadges = [
  ['HPI Checked', 'History reviewed before sale', ShieldCheck],
  ['30-Day Warranty', 'Standard cover included', BadgeCheck],
  ['PDI Prepared', 'Workshop inspection completed', Wrench],
  ['UK Delivery', 'Nationwide delivery available', Truck],
  ['Part Exchange', 'Fair valuations considered', Users],
  ['Appointment Viewing', 'Focused time with each bike', CalendarDays],
]

const preparationChecklist = [
  'Brake pads, discs, levels and operation checked',
  'Chain and sprocket tension, wear and lubrication reviewed',
  'Tyre tread depth, pressure and condition inspected',
  'Lights, indicators, horn and dashboard functions tested',
  'Steering head bearings, forks and suspension assessed',
  'Oil change completed where required before handover',
  'Brake fluid and coolant checked or topped up as needed',
  'Throttle operation, idle and basic running condition verified',
]

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

function availableBikes() {
  return bikes.filter((bike) => bike.status !== 'SOLD')
}

function soldBikes() {
  return bikes.filter((bike) => bike.status === 'SOLD')
}

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-stone-950 text-stone-50 selection:bg-amber-400 selection:text-stone-950">
        <SiteChrome />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/bikes" element={<InventoryPage />} />
          <Route path="/bikes/:slug" element={<BikeDetailPage />} />
          <Route path="/sell-your-bike" element={<SellPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/legal/:type" element={<LegalPage />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  )
}

function SiteChrome() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-300 to-stone-900 text-sm font-black text-stone-950 shadow-lg shadow-amber-500/10">
            KM
          </div>
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

function HomePage() {
  const featured = availableBikes().slice(0, 6)

  return (
    <main>
      <section className="relative overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 bg-stone-950">
          <video
            className="h-full w-full object-cover opacity-45"
            autoPlay
            muted
            loop
            playsInline
            poster={bikes[0].images[0]}
            aria-hidden="true"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/88 to-stone-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(245,158,11,0.28),transparent_34%),radial-gradient(circle_at_78%_12%,rgba(255,255,255,0.10),transparent_28%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-amber-200">
              Nationwide delivery available · Appointment viewing
            </p>
            <h1 className="mt-7 max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl">
              Quality used motorcycles in Leeds, prepared like they matter.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              Knights Motorcycles helps riders choose with confidence: HPI checked stock, 30-day warranty support, careful PDI preparation, part exchange and UK delivery.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/bikes" className="inline-flex items-center justify-center gap-3 rounded-full bg-amber-300 px-7 py-4 text-sm font-black uppercase tracking-wider text-stone-950 transition hover:bg-amber-200">
                View current stock <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/sell-your-bike" className="inline-flex items-center justify-center gap-3 rounded-full border border-stone-600 bg-stone-950/60 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:border-amber-300">
                Sell or part exchange
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat value="16" label="Original stock migrated" />
              <Stat value="142" label="Original bike photos archived" />
              <Stat value="30+" label="Typical stock scale" />
              <Stat value="24/7" label="Customer enquiries" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-700 bg-stone-950/80 p-4 shadow-2xl shadow-black/40">
            <div className="overflow-hidden rounded-[1.5rem] bg-stone-900">
              <img src={featured[0].images[0]} alt={featured[0].title} className="h-80 w-full object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">Featured arrival</p>
              <h2 className="mt-2 text-2xl font-black text-white">{featured[0].title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">{featured[0].story}</p>
              <div className="mt-5 flex items-center justify-between border-t border-stone-800 pt-5">
                <span className="text-2xl font-black text-amber-200">{formatPrice(featured[0].price)}</span>
                <Link to={`/bikes/${featured[0].slug}`} className="text-xs font-black uppercase tracking-wider text-white hover:text-amber-200">View bike</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
      <FeaturedStock bikes={featured} />
      <BrandStory />
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
  return (
    <section className="border-b border-stone-800 bg-stone-900/70 px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {trustBadges.map(([label, desc, Icon]) => (
          <div key={label} className="rounded-2xl border border-stone-700 bg-stone-950/50 p-4">
            <Icon className="h-5 w-5 text-amber-300" />
            <h3 className="mt-3 text-sm font-black uppercase tracking-wider text-white">{label}</h3>
            <p className="mt-1 text-xs leading-5 text-stone-400">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FeaturedStock({ bikes: featured }) {
  return (
    <section className="px-4 py-20">
      <SectionHeading eyebrow="Current stock" title="Original inventory, rebuilt for confident browsing" text="Every motorcycle found on the original Knights site has been migrated into the upgraded version, including sold examples for credibility and stock history." />
      <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((bike) => <BikeCard key={bike.slug} bike={bike} />)}
      </div>
      <div className="mt-10 text-center">
        <Link to="/bikes" className="inline-flex items-center gap-3 rounded-full border border-amber-300/40 px-7 py-4 text-sm font-black uppercase tracking-wider text-amber-200 transition hover:bg-amber-300 hover:text-stone-950">
          Browse all 16 bikes <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

function BrandStory() {
  return (
    <section className="border-y border-stone-800 bg-stone-900/40 px-4 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">The Knights story</p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">A used bike should come with a human story, not just a price tag.</h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-stone-300">
          {serviceCopy.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {['First-bike confidence', 'Step-up performance', 'Straightforward selling'].map((item) => (
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

function ServicesSection() {
  const cards = [
    ['Buy', 'Browse HPI checked used motorcycles prepared for viewing, delivery and confident handover.', '/bikes', ShieldCheck],
    ['Sell', 'Request a fair valuation for cash purchase or part exchange without listing the bike yourself.', '/sell-your-bike', Wallet],
    ['Finance', 'Explore representative monthly payments and enquire about finance options before visiting.', '/finance', CreditCard],
    ['Visit', 'Book an appointment in Leeds so the team can give you proper time with the motorcycle.', '/contact', MapPin],
  ]

  return (
    <section className="px-4 py-20">
      <SectionHeading eyebrow="Services" title="Everything the original site promised, made easier to act on" text="The upgraded structure turns long service paragraphs into clear buyer actions while preserving the original HPI, PDI, warranty, delivery and part-exchange promises." />
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([title, text, link, Icon]) => (
          <Link key={title} to={link} className="group rounded-[1.75rem] border border-stone-700 bg-stone-900/60 p-6 transition hover:-translate-y-1 hover:border-amber-300/60">
            <Icon className="h-8 w-8 text-amber-300" />
            <h3 className="mt-6 text-2xl font-black uppercase text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-400">{text}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-200">
              Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function InventoryPage() {
  const [status, setStatus] = useState('ALL')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    return bikes.filter((bike) => {
      const statusMatch = status === 'ALL' || bike.status === status
      const q = query.trim().toLowerCase()
      const queryMatch = !q || [bike.title, bike.make, bike.model, bike.engine, bike.style, bike.colour].join(' ').toLowerCase().includes(q)
      return statusMatch && queryMatch
    })
  }, [query, status])

  return (
    <main className="px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="For sale" title="All used bikes" text={`${availableBikes().length} available bikes and ${soldBikes().length} sold examples migrated from the original website.`} align="left" />
        <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-stone-700 bg-stone-900/50 p-4 md:grid-cols-[1fr_auto]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Yamaha, Honda, 125cc, ABS..." className="rounded-full border border-stone-700 bg-stone-950 px-5 py-3 text-sm text-white outline-none focus:border-amber-300" />
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
  return (
    <Link to={`/bikes/${bike.slug}`} className="group overflow-hidden rounded-[1.6rem] border border-stone-700 bg-stone-900/60 transition hover:-translate-y-1 hover:border-amber-300/50 hover:shadow-2xl hover:shadow-black/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
        <img src={bike.images[0]} alt={bike.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${sold ? 'bg-stone-100 text-stone-950' : 'bg-emerald-400 text-stone-950'}`}>{bike.status}</span>
          <span className="rounded-full bg-stone-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-200">{bike.engine}</span>
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
  const { slug } = useParams()
  const bike = bikes.find((item) => item.slug === slug)
  const [active, setActive] = useState(0)

  if (!bike) {
    return <NotFound />
  }

  const finance = monthlyFrom(bike.price)

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <Link to="/bikes" className="inline-flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-amber-200">
          ← Back to all stock
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-[2rem] border border-stone-700 bg-stone-900">
              <img src={bike.images[active] || bike.images[0]} alt={bike.title} className="max-h-[680px] w-full object-contain" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-6">
              {bike.images.map((image, index) => (
                <button key={image} onClick={() => setActive(index)} className={`overflow-hidden rounded-xl border ${active === index ? 'border-amber-300' : 'border-stone-700'}`}>
                  <img src={image} alt={`${bike.title} ${index + 1}`} className="aspect-square w-full object-cover" loading="lazy" />
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
            <h2 className="text-2xl font-black uppercase text-white">Original dealer notes, upgraded into a clearer story</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-300">{bike.originalNotes}</p>
            <a href={bike.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-amber-200">
              View original listing source <ArrowRight className="h-4 w-4" />
            </a>
          </section>
        </div>
      </div>
    </main>
  )
}

function SellPage() {
  return (
    <main className="px-4 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading align="left" eyebrow="We buy motorcycles" title="Sell, part exchange, or get a fair market conversation started" text="The original site promised instant cash purchase. This upgraded version turns that promise into a clear valuation journey for motorcycles and part exchange buyers." />
          <div className="mt-8 space-y-4">
            {['Enter registration and mileage', 'Tell us the condition and service history', 'Receive a fair valuation conversation', 'Arrange viewing, collection or part exchange'].map((step, index) => (
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
  return (
    <main className="px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Finance" title="Make the next bike feel possible before the viewing" text="Finance is presented as an enquiry route first, keeping the site credible while avoiding premature FCA/payment complexity until the client confirms their finance partner." />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-stone-700 bg-stone-900/60 p-7">
            <h2 className="text-2xl font-black uppercase text-white">Representative example</h2>
            <div className="mt-6 grid gap-3">
              {[
                ['Cash price', '£3,000'],
                ['Customer deposit', '£300'],
                ['Amount of credit', '£2,700'],
                ['Term', '48 months'],
                ['Representative APR', '16.9%'],
                ['Monthly payment', 'From approx. £79'],
              ].map(([label, value]) => <DetailRow key={label} label={label} value={value} />)}
            </div>
            <p className="mt-5 text-xs leading-6 text-stone-400">Illustration only. Finance is subject to status, affordability and partner approval. Formal FCA wording must be confirmed before live finance applications are enabled.</p>
          </div>
          <LeadForm type="finance" title="Finance enquiry" />
        </div>
      </div>
    </main>
  )
}

function ContactPage() {
  return (
    <main className="px-4 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading align="left" eyebrow="Contact" title="Book time with the bike, not just a slot in a diary" text="Knights works by appointment so every buyer gets proper time for a walk-around, questions, paperwork and a calm viewing experience." />
          <div className="mt-8 grid gap-4">
            <ContactCard icon={Phone} label="Call or text" value={company.phone} href={company.phoneHref} />
            <ContactCard icon={Mail} label="Email" value={company.email} href={company.emailHref} />
            <ContactCard icon={MapPin} label="Address" value={company.address} href={company.mapsUrl} />
            <ContactCard icon={Clock} label="Hours" value={`${company.supportHours}. ${company.viewingHours}.`} />
          </div>
        </div>
        <LeadForm type="viewing" title="Book a viewing" />
      </div>
    </main>
  )
}

function AboutPage() {
  return (
    <main className="px-4 py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="About Knights" title="A dealership story built around preparation, trust and the rider’s next chapter" text="The original website’s service promises are preserved here, then rewritten into a warmer brand story that gives both the seller and buyer a clearer identity." />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <StoryPanel title="Who Knights is" paragraphs={serviceCopy.about} />
          <StoryPanel title="Why riders remember the buying experience" paragraphs={serviceCopy.story} />
          <StoryPanel title="Service standards" paragraphs={serviceCopy.standards} />
          <StoryPanel title="Customer services" paragraphs={serviceCopy.customerServices.concat(serviceCopy.commitment)} />
        </div>
      </div>
    </main>
  )
}

function LegalPage() {
  const { type } = useParams()
  const pages = {
    privacy: ['Privacy Policy', 'Knights Motorcycles collects contact details, vehicle enquiry information and valuation details only for responding to customer requests, arranging appointments and supporting transactions. Customers can request access, correction or deletion of their personal data.'],
    cookies: ['Cookie Policy', 'The upgraded site should use essential cookies for functionality and optional analytics cookies only after consent. A cookie banner should be added before formal launch.'],
    terms: ['Terms & Conditions', 'Vehicle information is provided in good faith and should be confirmed during appointment viewing. Warranty, reserve, finance and delivery terms must be confirmed in writing before transaction completion.'],
  }
  const [title, text] = pages[type] || pages.privacy
  return (
    <main className="px-4 py-14">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-stone-700 bg-stone-900/60 p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Legal</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">{title}</h1>
        <p className="mt-6 text-base leading-8 text-stone-300">{text}</p>
        <p className="mt-6 text-sm leading-7 text-stone-400">This page has been upgraded from placeholder copy, but final legal wording should be reviewed before production launch.</p>
      </div>
    </main>
  )
}

function LeadForm({ title, type }) {
  const [sent, setSent] = useState(false)
  const subjectMap = {
    valuation: 'Bike valuation request',
    finance: 'Finance enquiry',
    viewing: 'Viewing appointment request',
  }

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const lines = Array.from(form.entries()).map(([key, value]) => `${key}: ${value}`)
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subjectMap[type] || title)}&body=${encodeURIComponent(lines.join('\n'))}`
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-stone-700 bg-stone-900/70 p-7">
      <h2 className="text-2xl font-black uppercase text-white">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormInput name="Name" label="Your name" required />
        <FormInput name="Phone" label="Phone" required />
        <FormInput name="Email" label="Email" type="email" />
        <FormInput name="Preferred contact" label="Preferred contact" placeholder="Call / text / email" />
        <FormInput name="Bike or registration" label="Bike / registration" placeholder="YZF-R125 or YX21 ABC" />
        <FormInput name="Mileage" label="Mileage" placeholder="12,500" />
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-black uppercase tracking-wider text-stone-300">Message</label>
          <textarea name="Message" rows="5" className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" placeholder="Tell us what you need." />
        </div>
      </div>
      <label className="mt-5 flex gap-3 text-xs leading-5 text-stone-400">
        <input required type="checkbox" className="mt-1" />
        I agree to be contacted about this enquiry. Final GDPR wording should be reviewed before production launch.
      </label>
      <button className="mt-6 inline-flex items-center gap-3 rounded-full bg-amber-300 px-7 py-4 text-sm font-black uppercase tracking-wider text-stone-950" type="submit">
        Prepare email enquiry <ArrowRight className="h-4 w-4" />
      </button>
      {sent && <p className="mt-4 text-sm text-emerald-300">Your email client should now open with the enquiry details prepared.</p>}
    </form>
  )
}

function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-xl font-black uppercase tracking-[0.22em] text-white">Knights Motorcycles</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400">Premium used motorcycles in Leeds. HPI checked, PDI prepared, warranty supported and available by appointment.</p>
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
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-300/15 to-stone-900 p-8 text-center sm:p-12">
        <Star className="mx-auto h-8 w-8 text-amber-300" />
        <h2 className="mt-5 text-4xl font-black uppercase tracking-tight text-white">Ready to choose your next ride?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-stone-300">Call, text, book a viewing or send an enquiry. Knights works by appointment so your bike gets proper attention before you buy.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={company.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-4 text-sm font-black uppercase tracking-wider text-stone-950"><Phone className="h-4 w-4" /> Call {company.phone}</a>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-600 px-7 py-4 text-sm font-black uppercase tracking-wider text-white">Book viewing</Link>
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
