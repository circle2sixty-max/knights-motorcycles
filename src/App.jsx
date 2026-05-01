import { HashRouter, NavLink, Route, Routes, Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Gauge,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Wallet,
  Wrench,
  Menu,
  X,
  CheckCircle2,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

// RACING HELMET LOGO COMPONENT
function HelmetLogo({ className = "h-10 w-10" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Helmet Base */}
      <path 
        d="M50 10C30 10 15 25 15 50C15 70 30 85 50 90C70 85 85 70 85 50C85 25 70 10 50 10Z" 
        fill="url(#helmetGradient)"
        stroke="#00D4FF"
        strokeWidth="2"
      />
      {/* Visor */}
      <path 
        d="M20 45C20 35 35 30 50 30C65 30 80 35 80 45C80 55 65 60 50 60C35 60 20 55 20 45Z" 
        fill="#0a0d12"
        stroke="#FF2D92"
        strokeWidth="1.5"
      />
      {/* Visor Reflection */}
      <path 
        d="M25 42C30 38 45 36 50 36C55 36 70 38 75 42" 
        stroke="#00D4FF"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Side Vents */}
      <rect x="12" y="40" width="8" height="4" fill="#00D4FF" rx="1" />
      <rect x="12" y="48" width="6" height="3" fill="#FF2D92" rx="1" />
      {/* Chin Guard */}
      <path 
        d="M35 65L40 80H60L65 65" 
        stroke="#00D4FF"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Racing Stripes */}
      <path 
        d="M35 20L45 50L35 80M65 20L55 50L65 80" 
        stroke="#FF2D92"
        strokeWidth="1"
        opacity="0.4"
      />
      <defs>
        <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f2e" />
          <stop offset="50%" stopColor="#0f1419" />
          <stop offset="100%" stopColor="#1a1f2e" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const company = {
  name: 'KNIGHTS MOTORCYCLES',
  shortName: 'KNIGHTS',
  phone: '07766 599955',
  phoneHref: 'tel:07766599955',
  address: 'Unit A4, Sunshine Mills, Wortley Road, Armley, Leeds, LS12 3HT, United Kingdom',
  subtitle: 'PREMIUM USED MOTORCYCLES',
  strapline: 'HPI CHECKED · WARRANTY INCLUDED · UK DELIVERY · PART EXCHANGE',
  slogan: 'RIDE WITHOUT COMPROMISE',
  philosophy: 'Precision engineering meets uncompromising standards. Every machine certified, every ride guaranteed.',
  hours: 'VIEWING BY APPOINTMENT · MON-SAT 09:00-17:00',
  inquiry: '24/7 ENQUIRY LINE',
  stats: {
    bikesSold: '1000+',
    satisfaction: '98%',
    warranty: '30 DAY',
    experience: '10+ YEAR',
  },
}

const bikes = [
  {
    slug: '2022-ktm-duke-125-7k',
    title: '2022 KTM DUKE 125',
    make: 'KTM',
    model: 'Duke 125',
    year: 2022,
    mileage: 7000,
    engine: '125cc',
    style: 'SPORT',
    price: 2950,
    image: '/images/bike-2.webp',
    badge: 'FINANCE',
    status: 'AVAILABLE',
    description: 'Clean, learner-friendly KTM with sharp styling and light handling.',
  },
  {
    slug: '2017-honda-cbr650f-low-mileage',
    title: '2017 HONDA CBR650F',
    make: 'Honda',
    model: 'CBR650F',
    year: 2017,
    mileage: 15100,
    engine: '650cc',
    style: 'SPORT',
    price: 3600,
    image: '/images/bike-3.webp',
    badge: 'NEW',
    status: 'AVAILABLE',
    description: 'Strong-value middleweight sport bike with everyday usability.',
  },
  {
    slug: '2017-yamaha-mt125-low-mileage',
    title: '2017 YAMAHA MT125',
    make: 'Yamaha',
    model: 'MT125',
    year: 2017,
    mileage: 8883,
    engine: '125cc',
    style: 'NAKED',
    price: 2900,
    image: '/images/bike-4.webp',
    badge: 'POPULAR',
    status: 'AVAILABLE',
    description: 'Best entry-level naked bike, ideal for urban commuting.',
  },
  {
    slug: '2017-yamaha-yzf-r125-abs',
    title: '2017 YAMAHA YZF R125 ABS',
    make: 'Yamaha',
    model: 'YZF R125 ABS',
    year: 2017,
    mileage: 14000,
    engine: '125cc',
    style: 'SPORT',
    price: 2900,
    image: '/images/bike-5.webp',
    badge: 'ABS',
    status: 'AVAILABLE',
    description: 'Sharp-looking 125cc sports bike with strong learner appeal.',
  },
  {
    slug: '2018-ktm-duke-125-low-mileage',
    title: '2018 KTM DUKE 125',
    make: 'KTM',
    model: 'Duke 125',
    year: 2018,
    mileage: 2447,
    engine: '125cc',
    style: 'NAKED',
    price: 2800,
    image: '/images/bike-6.webp',
    badge: 'LOW MILES',
    status: 'AVAILABLE',
    description: 'Very low-mileage example with excellent first-bike appeal.',
  },
  {
    slug: '2022-yamaha-xsr-125-abs-6k',
    title: '2022 YAMAHA XSR 125 ABS',
    make: 'Yamaha',
    model: 'XSR 125 ABS',
    year: 2022,
    mileage: 6781,
    engine: '125cc',
    style: 'RETRO',
    price: 3500,
    image: 'https://i.ebayimg.com/images/g/npsAAeSwPHBoeDGQ/s-l1600.webp',
    badge: 'RETRO',
    status: 'AVAILABLE',
    description: 'Stylish retro-inspired 125 with modern engineering and ABS.',
  },
]

const trustBadges = [
  { icon: ShieldCheck, label: 'HPI CHECKED', desc: 'Full history verified' },
  { icon: CheckCircle2, label: '30 DAY WARRANTY', desc: 'Comprehensive cover' },
  { icon: Zap, label: 'MOT READY', desc: 'Minimum 6 months' },
  { icon: Truck, label: 'UK DELIVERY', desc: 'Nationwide shipping' },
  { icon: Users, label: 'PART EXCHANGE', desc: 'Fair valuations' },
  { icon: Wrench, label: 'PDI INCLUDED', desc: 'Pre-delivery inspection' },
]

const services = [
  {
    icon: 'BUY',
    title: 'BUY',
    desc: 'Browse certified used motorcycles.',
    link: '/bikes',
    accent: '#00D4FF',
  },
  {
    icon: 'SELL',
    title: 'SELL',
    desc: 'Instant valuation & cash purchase.',
    link: '/sell-your-bike',
    accent: '#FF2D92',
  },
  {
    icon: 'FINANCE',
    title: 'FINANCE',
    desc: 'Flexible payment options.',
    link: '/finance',
    accent: '#00FF88',
  },
  {
    icon: 'ABOUT',
    title: 'ABOUT',
    desc: 'Our preparation standards.',
    link: '/about',
    accent: '#FFB800',
  },
]

const prepItems = [
  'Complete oil change with appropriate grade',
  'Brake fluid check and top-up (DOT4)',
  'Coolant system inspection and top-up',
  'Tyre tread, pressure, and condition check',
  'Chain and sprocket assessment',
  'All electrical systems tested',
  'Throttle and idle verification',
  'Safety inspection of all components',
]

function formatPrice(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

function monthlyFrom(price) {
  return Math.round(price / 36 + price * 0.015)
}

function mileageText(value) {
  return `${new Intl.NumberFormat('en-GB').format(value)} MI`
}

function getBike(slug) {
  return bikes.find((bike) => bike.slug === slug)
}

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#050508] text-white selection:bg-cyan-500/30">
        <SiteShell>
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/bikes" element={<InventoryPage />} />
            <Route path="/bikes/:slug" element={<BikeDetailPage />} />
            <Route path="/sell-your-bike" element={<SellPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/legal/:type" element={<LegalPage />} />
          </Routes>
        </SiteShell>
      </div>
    </HashRouter>
  )
}

// NEON GLOW STYLES
const neonStyles = {
  cyan: {
    border: 'border-cyan-400/50',
    glow: 'shadow-[0_0_20px_rgba(0,212,255,0.3),inset_0_0_20px_rgba(0,212,255,0.1)]',
    text: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  pink: {
    border: 'border-pink-500/50',
    glow: 'shadow-[0_0_20px_rgba(255,45,146,0.3),inset_0_0_20px_rgba(255,45,146,0.1)]',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  amber: {
    border: 'border-amber-400/50',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3),inset_0_0_20px_rgba(251,191,36,0.1)]',
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
}

function SiteShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-cyan-400/30 bg-[#050508]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 blur-lg">
                <HelmetLogo className="h-10 w-10 opacity-50" />
              </div>
              <HelmetLogo className="relative h-10 w-10" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black tracking-[0.2em] text-white">{company.shortName}</div>
              <div className="text-[10px] tracking-[0.3em] text-cyan-400">MOTORCYCLES</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 text-xs font-bold tracking-wider md:flex">
            <NavItem to="/home">HOME</NavItem>
            <NavItem to="/bikes">BIKES</NavItem>
            <NavItem to="/sell-your-bike">SELL</NavItem>
            <NavItem to="/finance">FINANCE</NavItem>
            <NavItem to="/about">ABOUT</NavItem>
            <NavItem to="/contact">CONTACT</NavItem>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={company.phoneHref}
              className="hidden items-center gap-2 border border-pink-500/50 bg-pink-500/10 px-4 py-2 text-xs font-bold tracking-wider text-pink-400 transition hover:bg-pink-500 hover:text-black sm:inline-flex"
              style={{ boxShadow: '0 0 15px rgba(255,45,146,0.3)' }}
            >
              <Phone className="h-3 w-3" />
              CALL
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center border border-cyan-400/30 bg-cyan-400/5 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-cyan-400" /> : <Menu className="h-5 w-5 text-cyan-400" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-cyan-400/30 bg-[#050508]/95 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {['/home', '/bikes', '/sell-your-bike', '/finance', '/about', '/contact'].map((path) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-white/10 px-4 py-3 text-sm font-bold tracking-wider text-white/80 transition hover:border-cyan-400/50 hover:text-cyan-400"
                >
                  {path.replace('/', '').replace(/-/g, ' ').toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t border-cyan-400/20 bg-black/50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <HelmetLogo className="h-8 w-8" />
                <span className="text-sm font-black tracking-wider">{company.shortName}</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/50">
                {company.philosophy}
              </p>
            </div>
            {[
              { title: 'QUICK LINKS', links: [['BIKES', '/bikes'], ['SELL', '/sell-your-bike'], ['FINANCE', '/finance'], ['ABOUT', '/about']] },
              { title: 'CONTACT', links: [['CALL US', company.phoneHref], ['EMAIL', 'mailto:info@knights-mc.co.uk']] },
              { title: 'LEGAL', links: [['PRIVACY', '/legal/privacy'], ['TERMS', '/legal/terms'], ['COOKIES', '/legal/cookies']] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold tracking-[0.2em] text-cyan-400">{col.title}</h4>
                <div className="mt-4 flex flex-col gap-2">
                  {col.links.map(([label, href]) => (
                    href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') ? (
                      <a key={label} href={href} className="text-xs tracking-wider text-white/50 transition hover:text-pink-400">
                        {label}
                      </a>
                    ) : (
                      <Link key={label} to={href} className="text-xs tracking-wider text-white/50 transition hover:text-pink-400">
                        {label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-[10px] tracking-wider text-white/30">
            © 2024 {company.name}. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `border px-3 py-2 text-xs transition ${
          isActive
            ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
            : 'border-transparent text-white/70 hover:border-white/20 hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

// SPLASH PAGE
function SplashPage() {
  return (
    <main className="relative min-h-[calc(100vh-64px)]">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="/images/hero-track.jpeg"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/80 via-[#050508]/40 to-[#050508]" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col">
        {/* Stats Bar */}
        <div className="border-b border-cyan-400/20 bg-black/40 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-3">
            {Object.entries(company.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-black text-cyan-400">{value}</div>
                <div className="text-[10px] tracking-[0.2em] text-white/40">{key.replace(/[A-Z]/g, ' $&').trim().toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <div 
              className="mb-6 inline-flex items-center gap-2 border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-xs tracking-[0.2em] text-cyan-400"
              style={{ boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
            >
              <ShieldCheck className="h-4 w-4" />
              HPI CHECKED · 30 DAY WARRANTY · UK DELIVERY
            </div>
            
            <h1 className="text-5xl font-black leading-none tracking-tighter text-white sm:text-7xl md:text-8xl">
              {company.slogan}
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed tracking-wide text-white/60">
              {company.philosophy}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/home"
                className="group flex w-full items-center justify-center gap-3 border border-cyan-400/50 bg-cyan-400/10 px-8 py-4 text-sm font-black tracking-wider text-cyan-400 transition hover:bg-cyan-400 hover:text-black sm:w-auto"
                style={{ boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
              >
                ENTER SITE
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href={company.phoneHref}
                className="flex w-full items-center justify-center gap-3 border border-pink-500/50 bg-pink-500/10 px-8 py-4 text-sm font-black tracking-wider text-pink-400 transition hover:bg-pink-500 hover:text-black sm:w-auto"
                style={{ boxShadow: '0 0 30px rgba(255,45,146,0.3)' }}
              >
                <Phone className="h-4 w-4" />
                CALL NOW
              </a>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="border-t border-cyan-400/20 bg-gradient-to-t from-[#050508] to-transparent px-4 py-8">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="group relative overflow-hidden border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/50"
                style={{ boxShadow: 'inset 0 0 30px rgba(0,212,255,0.05)' }}
              >
                <div 
                  className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                  style={{ boxShadow: `inset 0 0 40px ${service.accent}20` }}
                />
                <div className="relative">
                  <div 
                    className="mb-4 inline-block text-xs font-black tracking-widest"
                    style={{ color: service.accent }}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-black tracking-wider text-white">{service.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed tracking-wide text-white/50">{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// HOME PAGE
function HomePage() {
  return (
    <main>
      {/* Featured Bikes */}
      <section className="border-b border-cyan-400/20 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-cyan-400">FEATURED STOCK</p>
              <h2 className="mt-2 text-3xl font-black tracking-tighter text-white sm:text-4xl">LATEST ARRIVALS</h2>
            </div>
            <Link
              to="/bikes"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-bold tracking-wider text-white transition hover:border-cyan-400/50 hover:text-cyan-400"
            >
              VIEW ALL <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bikes.slice(0, 3).map((bike) => (
              <BikeCard key={bike.slug} bike={bike} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-cyan-400/20 bg-white/[0.02] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400">OUR PROMISE</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-white">WHY CHOOSE KNIGHTS</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-start gap-4 border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-cyan-400/30 bg-cyan-400/10">
                  <badge.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wider text-white">{badge.label}</h3>
                  <p className="mt-1 text-xs tracking-wide text-white/50">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="border-b border-cyan-400/20 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400">OUR SERVICES</p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-white">EVERYTHING YOU NEED</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { title: 'BUY A MOTORCYCLE', img: '/images/showroom.jpg', link: '/bikes', accent: '#00D4FF' },
              { title: 'SELL YOUR BIKE', img: '/images/workshop.webp', link: '/sell-your-bike', accent: '#FF2D92' },
              { title: 'MOTORCYCLE FINANCE', img: '/images/finance.jpg', link: '/finance', accent: '#00FF88' },
              { title: 'UK DELIVERY', img: '/images/delivery.jpg', link: '/contact', accent: '#FFB800' },
            ].map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="group relative overflow-hidden border border-white/10 bg-white/5"
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-20 transition group-hover:scale-105 group-hover:opacity-30"
                />
                <div 
                  className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                  style={{ boxShadow: `inset 0 0 60px ${service.accent}30` }}
                />
                <div className="relative p-8">
                  <h3 className="text-2xl font-black tracking-tighter text-white">{service.title}</h3>
                  <div 
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-wider"
                    style={{ color: service.accent }}
                  >
                    EXPLORE <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div 
          className="mx-auto max-w-4xl border border-cyan-400/30 bg-cyan-400/5 p-8 text-center sm:p-12"
          style={{ boxShadow: '0 0 40px rgba(0,212,255,0.1), inset 0 0 40px rgba(0,212,255,0.05)' }}
        >
          <h2 className="text-3xl font-black tracking-tighter text-white">FIND YOUR PERFECT RIDE</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm tracking-wide text-white/60">
            Browse our current stock, get a valuation, or arrange a viewing.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/bikes"
              className="inline-flex w-full items-center justify-center gap-3 border border-cyan-400/50 bg-cyan-400/10 px-8 py-4 text-sm font-black tracking-wider text-cyan-400 transition hover:bg-cyan-400 hover:text-black sm:w-auto"
              style={{ boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
            >
              VIEW BIKES <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex w-full items-center justify-center gap-3 border border-pink-500/50 bg-pink-500/10 px-8 py-4 text-sm font-black tracking-wider text-pink-400 transition hover:bg-pink-500 hover:text-black sm:w-auto"
              style={{ boxShadow: '0 0 30px rgba(255,45,146,0.3)' }}
            >
              <Phone className="h-4 w-4" /> CALL NOW
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

// INVENTORY PAGE
function InventoryPage() {
  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400">FOR SALE</p>
            <h1 className="mt-2 text-4xl font-black tracking-tighter text-white">USED MOTORCYCLES</h1>
            <p className="mt-3 text-sm tracking-wide text-white/50">{bikes.length} BIKES AVAILABLE</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike) => (
            <BikeCard key={bike.slug} bike={bike} />
          ))}
        </div>
      </div>
    </main>
  )
}

// BIKE DETAIL PAGE
function BikeDetailPage() {
  const { slug } = useParams()
  const bike = getBike(slug)

  if (!bike) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-white">BIKE NOT FOUND</h1>
          <Link to="/bikes" className="mt-4 inline-flex items-center gap-2 text-cyan-400 hover:underline">
            <ArrowRight className="h-4 w-4 rotate-180" /> BACK TO STOCK
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <Link to="/bikes" className="inline-flex items-center gap-2 text-xs tracking-wider text-white/50 hover:text-cyan-400">
          <ArrowRight className="h-3 w-3 rotate-180" /> BACK TO ALL BIKES
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden border border-cyan-400/30 bg-white/5">
            <img src={bike.image} alt={bike.title} className="aspect-[4/3] w-full object-cover" />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-cyan-400/50 bg-cyan-400/10 px-3 py-1 text-[10px] font-black tracking-wider text-cyan-400">
                {bike.badge}
              </span>
              <span className="border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-black tracking-wider text-white/50">
                {bike.status}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tighter text-white sm:text-4xl">{bike.title}</h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-black text-cyan-400">{formatPrice(bike.price)}</span>
              <span className="text-sm tracking-wider text-white/50">FROM {formatPrice(monthlyFrom(bike.price))}/MO</span>
            </div>

            <p className="mt-6 text-sm tracking-wide text-white/60">{bike.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <DetailBox label="YEAR" value={String(bike.year)} />
              <DetailBox label="MILEAGE" value={mileageText(bike.mileage)} />
              <DetailBox label="ENGINE" value={bike.engine} />
              <DetailBox label="STYLE" value={bike.style} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-2 border border-cyan-400/50 bg-cyan-400/10 px-6 py-3 text-xs font-black tracking-wider text-cyan-400 transition hover:bg-cyan-400 hover:text-black"
                style={{ boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}
              >
                <Phone className="h-4 w-4" /> ENQUIRE NOW
              </a>
              <Link
                to="/finance"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold tracking-wider text-white transition hover:border-pink-500/50 hover:text-pink-400"
              >
                <CreditCard className="h-4 w-4" /> FINANCE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// SELL PAGE
function SellPage() {
  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-pink-400">SELL YOUR BIKE</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter text-white">INSTANT VALUATION</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-white/50">
            Part exchange or instant cash purchase. Fair market valuations.
          </p>
        </div>

        <div className="mt-10 border border-pink-500/30 bg-pink-500/5 p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="REGISTRATION" placeholder="YX21 ABC" />
            <FormInput label="MILEAGE" placeholder="12500" />
            <FormInput label="MAKE & MODEL" placeholder="Yamaha MT-07" />
            <FormInput label="YEAR" placeholder="2021" />
            <div className="sm:col-span-2">
              <FormInput label="YOUR NAME" placeholder="Full name" />
            </div>
            <FormInput label="PHONE" placeholder="07..." />
            <FormInput label="EMAIL" placeholder="you@example.com" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              className="inline-flex items-center gap-2 border border-pink-500/50 bg-pink-500/10 px-6 py-3 text-xs font-black tracking-wider text-pink-400 transition hover:bg-pink-500 hover:text-black"
              style={{ boxShadow: '0 0 20px rgba(255,45,146,0.3)' }}
            >
              GET VALUATION <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

// FINANCE PAGE
function FinancePage() {
  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-green-400">FINANCE</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter text-white">FLEXIBLE PAYMENT</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-white/50">
            Spread the cost with our finance partners.
          </p>
        </div>

        <div className="mt-10 border border-green-500/30 bg-green-500/5 p-8">
          <h2 className="text-xl font-black tracking-tighter text-white">REPRESENTATIVE EXAMPLE</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ['CASH PRICE', '£3,000'],
              ['DEPOSIT', '£300'],
              ['CREDIT', '£2,700'],
              ['APR', '16.9%'],
              ['TERM', '48 MONTHS'],
              ['MONTHLY', 'FROM £79'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-white/10 py-2">
                <span className="text-xs tracking-wider text-white/50">{label}</span>
                <span className="text-sm font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// CONTACT PAGE
function ContactPage() {
  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400">CONTACT</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter text-white">GET IN TOUCH</h1>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {[
              { icon: Phone, label: 'PHONE', value: company.phone, href: company.phoneHref, accent: '#FF2D92' },
              { icon: MapPin, label: 'ADDRESS', value: company.address, accent: '#00D4FF' },
              { icon: ChevronRight, label: 'HOURS', value: company.hours, accent: '#FFB800' },
            ].map((item) => (
              <div 
                key={item.label} 
                className="border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" style={{ color: item.accent }} />
                  <span className="text-xs font-bold tracking-wider text-white/50">{item.label}</span>
                </div>
                {item.href ? (
                  <a href={item.href} className="mt-2 block text-lg font-bold tracking-wider" style={{ color: item.accent }}>
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="border border-cyan-400/30 bg-cyan-400/5 p-8">
            <h2 className="text-lg font-black tracking-wider text-white">SEND MESSAGE</h2>
            <div className="mt-6 space-y-4">
              <FormInput label="NAME" placeholder="Full name" />
              <FormInput label="PHONE" placeholder="07..." />
              <FormInput label="EMAIL" placeholder="you@example.com" />
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-white/70">MESSAGE</label>
                <textarea
                  className="w-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
                  rows={4}
                  placeholder="How can we help?"
                />
              </div>
              <button 
                className="w-full border border-cyan-400/50 bg-cyan-400/10 py-3 text-xs font-black tracking-wider text-cyan-400 transition hover:bg-cyan-400 hover:text-black"
                style={{ boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
              >
                SEND MESSAGE
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// ABOUT PAGE
function AboutPage() {
  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400">ABOUT US</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter text-white">WHY KNIGHTS</h1>
        </div>

        <div className="mt-10 space-y-6">
          <section className="border border-cyan-400/30 bg-cyan-400/5 p-8">
            <h2 className="text-xl font-black tracking-tighter text-white">PREPARATION PROCESS</h2>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {prepItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}

// LEGAL PAGE
function LegalPage() {
  const { type } = useParams()
  
  const content = {
    privacy: {
      title: 'PRIVACY POLICY',
      text: 'We collect your name, contact details, and bike information when you enquire or request a valuation. Your data is stored securely and never shared with third parties without consent.',
    },
    cookies: {
      title: 'COOKIE POLICY',
      text: 'We use essential cookies for website functionality and analytics cookies to understand visitor behavior. Marketing cookies are only used with your consent.',
    },
    terms: {
      title: 'TERMS & CONDITIONS',
      text: 'All vehicle descriptions are accurate to the best of our knowledge but should be verified in person. All viewings are by appointment only. 30-day warranty covers major mechanical faults.',
    },
  }

  const page = content[type] || content.privacy

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black tracking-tighter text-white">{page.title}</h1>
        <div className="mt-8 border border-white/10 bg-white/5 p-8">
          <p className="text-sm leading-relaxed tracking-wide text-white/60">{page.text}</p>
        </div>
      </div>
    </main>
  )
}

// COMPONENTS
function BikeCard({ bike }) {
  return (
    <Link to={`/bikes/${bike.slug}`} className="group block overflow-hidden border border-white/10 bg-white/5 transition hover:border-cyan-400/50">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={bike.image} alt={bike.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="border border-cyan-400/50 bg-cyan-400/10 px-2 py-1 text-[10px] font-black tracking-wider text-cyan-400">
            {bike.badge}
          </span>
          <span className="text-[10px] tracking-wider text-white/40">{bike.status}</span>
        </div>
        <h3 className="mt-3 text-lg font-black tracking-wider text-white group-hover:text-cyan-400">{bike.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs tracking-wide text-white/50">{bike.description}</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-black text-cyan-400">{formatPrice(bike.price)}</span>
          <span className="text-xs tracking-wider text-white/40">{bike.year} · {bike.mileage.toLocaleString()} MI</span>
        </div>
      </div>
    </Link>
  )
}

function DetailBox({ label, value }) {
  return (
    <div className="border border-white/10 bg-white/5 p-4">
      <p className="text-[10px] tracking-wider text-white/40">{label}</p>
      <p className="mt-1 text-sm font-bold tracking-wider text-white">{value}</p>
    </div>
  )
}

function FormInput({ label, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold tracking-wider text-white/70">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
      />
    </div>
  )
}

export default App
