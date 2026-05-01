import { HashRouter, NavLink, Route, Routes, Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Bike,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Gauge,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Wallet,
  Wrench,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  Heart,
  Zap,
  Award,
  Users,
  Package,
} from 'lucide-react'
import { useState } from 'react'

const company = {
  name: 'Knights Motorcycles',
  phone: '07766 599955',
  phoneHref: 'tel:07766599955',
  address: 'Unit A4, Sunshine Mills, Wortley Road, Armley, Leeds, LS12 3HT, United Kingdom',
  subtitle: 'Quality Used Motorcycles in Leeds',
  strapline: 'HPI checked. Warranty included. Nationwide delivery. Part exchange welcome.',
  slogan: 'Ride with Confidence',
  philosophy: 'Every motorcycle tells a story. We make sure yours starts right.',
  hours: 'Viewing by appointment · Mon–Sat, 9:00 AM – 5:00 PM',
  inquiry: '24/7 enquiry support by phone or text',
  stats: {
    bikesSold: '1000+',
    satisfaction: '98%',
    warranty: '30 Days',
    experience: '10+ Years',
  },
}

const bikes = [
  {
    slug: '2022-ktm-duke-125-7k',
    title: '2022 KTM Duke 125',
    make: 'KTM',
    model: 'Duke 125',
    year: 2022,
    mileage: 7000,
    engine: '125cc',
    style: 'Sport',
    price: 2950,
    image: '/images/bike-2.webp',
    badge: 'Finance',
    status: 'Available',
    description: 'Clean, learner-friendly KTM with sharp styling and light handling.',
  },
  {
    slug: '2017-honda-cbr650f-low-mileage',
    title: '2017 Honda CBR650F',
    make: 'Honda',
    model: 'CBR650F',
    year: 2017,
    mileage: 15100,
    engine: '650cc',
    style: 'Sport',
    price: 3600,
    image: '/images/bike-3.webp',
    badge: 'New',
    status: 'Available',
    description: 'Strong-value middleweight sport bike with everyday usability.',
  },
  {
    slug: '2017-yamaha-mt125-low-mileage',
    title: '2017 Yamaha MT125',
    make: 'Yamaha',
    model: 'MT125',
    year: 2017,
    mileage: 8883,
    engine: '125cc',
    style: 'Naked',
    price: 2900,
    image: '/images/bike-4.webp',
    badge: 'Popular',
    status: 'Available',
    description: 'Best entry-level naked bike, ideal for urban commuting.',
  },
  {
    slug: '2017-yamaha-yzf-r125-abs',
    title: '2017 Yamaha YZF R125 ABS',
    make: 'Yamaha',
    model: 'YZF R125 ABS',
    year: 2017,
    mileage: 14000,
    engine: '125cc',
    style: 'Sport',
    price: 2900,
    image: '/images/bike-5.webp',
    badge: 'ABS',
    status: 'Available',
    description: 'Sharp-looking 125cc sports bike with strong learner appeal.',
  },
  {
    slug: '2018-ktm-duke-125-low-mileage',
    title: '2018 KTM Duke 125',
    make: 'KTM',
    model: 'Duke 125',
    year: 2018,
    mileage: 2447,
    engine: '125cc',
    style: 'Naked',
    price: 2800,
    image: '/images/bike-6.webp',
    badge: 'Low Miles',
    status: 'Available',
    description: 'Very low-mileage example with excellent first-bike appeal.',
  },
  {
    slug: '2022-yamaha-xsr-125-abs-6k',
    title: '2022 Yamaha XSR 125 ABS',
    make: 'Yamaha',
    model: 'XSR 125 ABS',
    year: 2022,
    mileage: 6781,
    engine: '125cc',
    style: 'Retro',
    price: 3500,
    image: 'https://i.ebayimg.com/images/g/npsAAeSwPHBoeDGQ/s-l1600.webp',
    badge: 'Retro',
    status: 'Available',
    description: 'Stylish retro-inspired 125 with modern engineering and ABS.',
  },
]

const trustBadges = [
  { icon: ShieldCheck, label: 'HPI Checked', desc: 'Full history verified' },
  { icon: Award, label: '30-Day Warranty', desc: 'Peace of mind included' },
  { icon: CheckCircle2, label: 'MOT Ready', desc: 'Minimum 6 months MOT' },
  { icon: Truck, label: 'UK Delivery', desc: 'Nationwide shipping' },
  { icon: Users, label: 'Part Exchange', desc: 'Fair valuations' },
  { icon: Heart, label: 'No Hidden Fees', desc: 'Transparent pricing' },
]

const services = [
  {
    icon: Bike,
    title: 'Buy a Bike',
    desc: 'Browse our curated selection of quality used motorcycles.',
    link: '/bikes',
    color: 'from-amber-500/20 to-orange-600/20',
  },
  {
    icon: Wallet,
    title: 'Sell Your Bike',
    desc: 'Get an instant valuation or part exchange offer.',
    link: '/sell-your-bike',
    color: 'from-emerald-500/20 to-teal-600/20',
  },
  {
    icon: CreditCard,
    title: 'Finance',
    desc: 'Flexible payment options from £79/month.',
    link: '/finance',
    color: 'from-blue-500/20 to-indigo-600/20',
  },
  {
    icon: Wrench,
    title: 'Our Promise',
    desc: 'Pre-delivery inspection & preparation standards.',
    link: '/about',
    color: 'from-purple-500/20 to-pink-600/20',
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
  return `${new Intl.NumberFormat('en-GB').format(value)} miles`
}

function getBike(slug) {
  return bikes.find((bike) => bike.slug === slug)
}

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0a0d12] text-white">
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

function SiteShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0d12]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
              <Bike className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold tracking-wide text-white">{company.name}</div>
              <div className="text-xs text-white/50">Leeds · Used Motorcycles</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 text-sm text-white/75 md:flex">
            <NavItem to="/home">Home</NavItem>
            <NavItem to="/bikes">Bikes</NavItem>
            <NavItem to="/sell-your-bike">Sell</NavItem>
            <NavItem to="/finance">Finance</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={company.phoneHref}
              className="hidden items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">{company.phone}</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#0a0d12]/95 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <MobileNavItem to="/home" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavItem>
              <MobileNavItem to="/bikes" onClick={() => setMobileMenuOpen(false)}>Used Bikes</MobileNavItem>
              <MobileNavItem to="/sell-your-bike" onClick={() => setMobileMenuOpen(false)}>Sell Your Bike</MobileNavItem>
              <MobileNavItem to="/finance" onClick={() => setMobileMenuOpen(false)}>Finance</MobileNavItem>
              <MobileNavItem to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</MobileNavItem>
              <MobileNavItem to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavItem>
            </nav>
            <a
              href={company.phoneHref}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3 text-sm font-semibold text-black"
            >
              <Phone className="h-4 w-4" />
              {company.phone}
            </a>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t border-white/10 bg-black/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Bike className="h-6 w-6 text-amber-500" />
                <span className="font-bold">{company.name}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {company.philosophy}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white/90">Quick Links</h4>
              <div className="mt-4 flex flex-col gap-2 text-sm text-white/60">
                <Link to="/bikes" className="hover:text-amber-400">Browse Bikes</Link>
                <Link to="/sell-your-bike" className="hover:text-amber-400">Sell Your Bike</Link>
                <Link to="/finance" className="hover:text-amber-400">Finance Options</Link>
                <Link to="/about" className="hover:text-amber-400">Why Choose Us</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white/90">Contact</h4>
              <div className="mt-4 space-y-2 text-sm text-white/60">
                <p>{company.phone}</p>
                <p className="text-xs leading-relaxed">{company.address}</p>
                <p className="text-xs">{company.hours}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white/90">Legal</h4>
              <div className="mt-4 flex flex-col gap-2 text-sm text-white/60">
                <Link to="/legal/privacy" className="hover:text-amber-400">Privacy Policy</Link>
                <Link to="/legal/cookies" className="hover:text-amber-400">Cookie Policy</Link>
                <Link to="/legal/terms" className="hover:text-amber-400">Terms & Conditions</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-white/40">
            © 2024 {company.name}. All rights reserved.
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
        `rounded-lg px-3 py-2 transition ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
      }
    >
      {children}
    </NavLink>
  )
}

function MobileNavItem({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-lg px-4 py-3 text-white/80 transition hover:bg-white/5 hover:text-white"
    >
      {children}
    </Link>
  )
}

// SPLASH / ENTRY PAGE
function SplashPage() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero-track.jpeg" 
          alt="Motorcycle" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d12]/70 via-[#0a0d12]/50 to-[#0a0d12]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top Stats */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-3 text-center sm:gap-8 sm:px-6 lg:gap-12">
            {[
              { value: company.stats.bikesSold, label: 'Bikes Sold' },
              { value: company.stats.satisfaction, label: 'Satisfaction' },
              { value: company.stats.warranty, label: 'Warranty' },
              { value: company.stats.experience, label: 'Experience' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg font-bold text-amber-400 sm:text-xl">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
              <ShieldCheck className="h-4 w-4" />
              HPI Checked · 30-Day Warranty · UK Delivery
            </div>
            
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              {company.slogan}
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              {company.philosophy}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/home"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-base font-semibold text-black transition hover:bg-amber-400 sm:w-auto"
              >
                Explore Our Bikes
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <a
                href={company.phoneHref}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                Call {company.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="border-t border-white/10 bg-gradient-to-t from-[#0a0d12] to-transparent px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition group-hover:opacity-100`} />
                <div className="relative">
                  <service.icon className="h-8 w-8 text-amber-400" />
                  <h3 className="mt-4 text-lg font-semibold text-white">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{service.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-amber-400">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center py-4">
          <Link to="/home" className="flex flex-col items-center gap-2 text-white/40 transition hover:text-white">
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </Link>
        </div>
      </div>
    </main>
  )
}

// HOME PAGE - Module Based Layout
function HomePage() {
  return (
    <main>
      {/* Featured Bikes Module */}
      <section className="border-b border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-amber-400">Featured Stock</p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Latest Arrivals</h2>
              <p className="mt-3 max-w-xl text-white/60">Hand-picked motorcycles ready for the road.</p>
            </div>
            <Link
              to="/bikes"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              View All Bikes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bikes.slice(0, 3).map((bike) => (
              <BikeCard key={bike.slug} bike={bike} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Module */}
      <section className="border-b border-white/10 bg-white/[0.02] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-amber-400">Our Promise</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Why Buy From Knights</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <badge.icon className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{badge.label}</h3>
                  <p className="mt-1 text-sm text-white/60">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid Module */}
      <section className="border-b border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-amber-400">Our Services</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Everything You Need</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Buy Module */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
              <img
                src="/images/showroom.jpg"
                alt="Showroom"
                className="absolute inset-0 h-full w-full object-cover opacity-20"
              />
              <div className="relative">
                <Bike className="h-10 w-10 text-amber-400" />
                <h3 className="mt-4 text-2xl font-bold text-white">Buy a Motorcycle</h3>
                <p className="mt-2 text-white/60">Quality used bikes from 125cc to 1000cc. Every bike HPI checked and fully prepared.</p>
                <Link to="/bikes" className="mt-6 inline-flex items-center gap-2 text-amber-400 hover:underline">
                  Browse Stock <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Sell Module */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
              <img
                src="/images/workshop.webp"
                alt="Workshop"
                className="absolute inset-0 h-full w-full object-cover opacity-20"
              />
              <div className="relative">
                <Wallet className="h-10 w-10 text-emerald-400" />
                <h3 className="mt-4 text-2xl font-bold text-white">Sell Your Bike</h3>
                <p className="mt-2 text-white/60">Instant cash purchase or part exchange. Fair valuations based on market conditions.</p>
                <Link to="/sell-your-bike" className="mt-6 inline-flex items-center gap-2 text-emerald-400 hover:underline">
                  Get Valuation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Finance Module */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
              <img
                src="/images/finance.jpg"
                alt="Finance"
                className="absolute inset-0 h-full w-full object-cover opacity-20"
              />
              <div className="relative">
                <CreditCard className="h-10 w-10 text-blue-400" />
                <h3 className="mt-4 text-2xl font-bold text-white">Motorcycle Finance</h3>
                <p className="mt-2 text-white/60">Flexible payment options from £79/month. Apply online and get a decision quickly.</p>
                <Link to="/finance" className="mt-6 inline-flex items-center gap-2 text-blue-400 hover:underline">
                  Explore Finance <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Delivery Module */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
              <img
                src="/images/delivery.jpg"
                alt="Delivery"
                className="absolute inset-0 h-full w-full object-cover opacity-20"
              />
              <div className="relative">
                <Truck className="h-10 w-10 text-purple-400" />
                <h3 className="mt-4 text-2xl font-bold text-white">UK Delivery</h3>
                <p className="mt-2 text-white/60">Can't collect in person? We deliver nationwide. Your bike arrives safely at your door.</p>
                <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-purple-400 hover:underline">
                  Arrange Delivery <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Module */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-600/10 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">Ready to Find Your Perfect Ride?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Browse our current stock, get a valuation for your bike, or contact us to arrange a viewing.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/bikes"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-4 font-semibold text-black transition hover:bg-amber-400 sm:w-auto"
            >
              View Bikes <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-medium text-white transition hover:bg-white/10 sm:w-auto"
            >
              <Phone className="h-5 w-5" />
              Call Now
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
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-amber-400">For Sale</p>
            <h1 className="mt-2 text-4xl font-bold text-white">Used Motorcycles</h1>
            <p className="mt-3 text-white/60">{bikes.length} bikes available</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <h1 className="text-4xl font-bold text-white">Bike Not Found</h1>
          <Link to="/bikes" className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:underline">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to Stock
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/bikes" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to all bikes
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <img
              src={bike.image}
              alt={bike.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                {bike.badge}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                {bike.status}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{bike.title}</h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-amber-400">{formatPrice(bike.price)}</span>
              <span className="text-white/60">or from {formatPrice(monthlyFrom(bike.price))}/mo</span>
            </div>

            <p className="mt-6 text-white/70">{bike.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <DetailBox label="Year" value={String(bike.year)} />
              <DetailBox label="Mileage" value={mileageText(bike.mileage)} />
              <DetailBox label="Engine" value={bike.engine} />
              <DetailBox label="Style" value={bike.style} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
              >
                <Phone className="h-5 w-5" />
                Enquire Now
              </a>
              <Link
                to="/finance"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                <CreditCard className="h-5 w-5" />
                Finance Options
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
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">Sell Your Bike</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Get an Instant Valuation</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Part exchange or instant cash purchase. Fair valuations based on current market conditions.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormInput label="Registration Number" placeholder="e.g. YX21 ABC" />
            <FormInput label="Current Mileage" placeholder="e.g. 12500" />
            <FormInput label="Make & Model" placeholder="e.g. Yamaha MT-07" />
            <FormInput label="Year" placeholder="e.g. 2021" />
            <div className="sm:col-span-2">
              <FormInput label="Your Name" placeholder="Full name" />
            </div>
            <FormInput label="Phone Number" placeholder="07..." />
            <FormInput label="Email Address" placeholder="you@example.com" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400">
              Get Valuation <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
              Call {company.phone}
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { title: 'Step 1', desc: 'Enter your bike details above' },
            { title: 'Step 2', desc: 'Receive a valuation within hours' },
            { title: 'Step 3', desc: 'Arrange inspection & get paid' },
          ].map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

// FINANCE PAGE
function FinancePage() {
  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-400">Finance</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Flexible Payment Options</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Spread the cost of your new motorcycle with our finance partners.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold text-white">Representative Example</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Cash Price" value="£3,000" />
            <InfoRow label="Deposit" value="£300" />
            <InfoRow label="Credit Amount" value="£2,700" />
            <InfoRow label="APR" value="16.9% Representative" />
            <InfoRow label="Term" value="48 months" />
            <InfoRow label="Monthly Payment" value="From £79" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href={company.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-8 py-4 font-semibold text-white transition hover:bg-blue-400"
          >
            <Phone className="h-5 w-5" />
            Discuss Finance Options
          </a>
        </div>
      </div>
    </main>
  )
}

// CONTACT PAGE
function ContactPage() {
  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-amber-400">Contact Us</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Get In Touch</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Book a viewing, ask about delivery, or discuss a bike directly with our team.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Phone className="h-6 w-6 text-amber-400" />
              <h3 className="mt-4 font-semibold text-white">Phone</h3>
              <a href={company.phoneHref} className="mt-2 text-2xl font-bold text-amber-400 hover:underline">
                {company.phone}
              </a>
              <p className="mt-2 text-sm text-white/60">Available 24/7 for enquiries</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <MapPin className="h-6 w-6 text-amber-400" />
              <h3 className="mt-4 font-semibold text-white">Address</h3>
              <p className="mt-2 text-white/60">{company.address}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Clock3 className="h-6 w-6 text-amber-400" />
              <h3 className="mt-4 font-semibold text-white">Viewing Hours</h3>
              <p className="mt-2 text-white/60">{company.hours}</p>
              <p className="mt-2 text-sm text-white/40">By appointment only</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-bold text-white">Send a Message</h2>
            <div className="mt-6 space-y-4">
              <FormInput label="Your Name" placeholder="Full name" />
              <FormInput label="Phone Number" placeholder="07..." />
              <FormInput label="Email Address" placeholder="you@example.com" />
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Message</label>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:outline-none"
                  rows={4}
                  placeholder="How can we help you?"
                />
              </div>
              <button className="w-full rounded-full bg-amber-500 py-3 font-semibold text-black transition hover:bg-amber-400">
                Send Message
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
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-amber-400">About Us</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Why Knights Motorcycles</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            {company.philosophy}
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-bold text-white">Our Preparation Process</h2>
            <p className="mt-4 text-white/70">
              Every motorcycle undergoes a comprehensive pre-delivery inspection before it leaves our workshop.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {prepItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/70">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-bold text-white">Documentation & Support</h2>
            <div className="mt-4 space-y-4 text-white/70">
              <p>• Valid V5C registration document (logbook)</p>
              <p>• Available service history (varies by bike)</p>
              <p>• MOT history verification</p>
              <p>• Written receipt of purchase</p>
              <p>• 30-day warranty included</p>
            </div>
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
      title: 'Privacy Policy',
      sections: [
        { heading: 'Information We Collect', text: 'We collect your name, contact details, and bike information when you enquire or request a valuation.' },
        { heading: 'How We Use It', text: 'We use this information to respond to enquiries, arrange viewings, and process sales.' },
        { heading: 'Data Protection', text: 'Your data is stored securely and never shared with third parties without consent.' },
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      sections: [
        { heading: 'Essential Cookies', text: 'Required for the website to function properly.' },
        { heading: 'Analytics Cookies', text: 'Help us understand how visitors use our site.' },
        { heading: 'Marketing Cookies', text: 'Used to deliver relevant advertisements (if enabled).' },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      sections: [
        { heading: 'Vehicle Information', text: 'All descriptions and images are accurate to the best of our knowledge but should be verified in person.' },
        { heading: 'Viewings', text: 'All viewings are by appointment only.' },
        { heading: 'Warranty', text: '30-day warranty covers major mechanical faults. Full terms available on request.' },
      ],
    },
  }

  const page = content[type] || content.privacy

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white">{page.title}</h1>
        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
              <p className="mt-3 text-white/70">{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

// COMPONENTS

function BikeCard({ bike }) {
  return (
    <Link to={`/bikes/${bike.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/[0.07]">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={bike.image}
          alt={bike.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
            {bike.badge}
          </span>
          <span className="text-xs text-white/40">{bike.status}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-amber-400 transition">{bike.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/60">{bike.description}</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">{formatPrice(bike.price)}</span>
          <span className="text-sm text-white/40">{bike.year} · {bike.mileage.toLocaleString()} mi</span>
        </div>
      </div>
    </Link>
  )
}

function DetailBox({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-3">
      <span className="text-white/60">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  )
}

function FormInput({ label, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/80">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:outline-none"
      />
    </div>
  )
}

export default App
