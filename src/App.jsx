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
} from 'lucide-react'

const company = {
  name: 'Knights Motorcycles',
  phone: '07766 599955',
  phoneHref: 'tel:07766599955',
  address: 'Unit A4, Sunshine Mills, Wortley Road, Armley, Leeds, LS12 3HT, United Kingdom',
  subtitle: 'Quality Used Motorcycles in Leeds',
  strapline:
    'HPI checked. Warranty included. Nationwide delivery. Part exchange welcome.',
  hours: 'Viewing by appointment · Mon–Sat, 9:00 AM – 5:00 PM',
  inquiry: '24/7 enquiry support by phone or text',
}

const bikes = [
  {
    slug: '2022-ktm-duke-125-7k',
    title: '2022 KTM Duke 125 7k',
    make: 'KTM',
    model: 'Duke 125',
    year: 2022,
    mileage: 7000,
    engine: '125cc',
    style: 'Sport',
    price: 2950,
    image: '/images/bike-2.webp',
    badge: 'Finance Available',
    status: 'Available',
    description:
      'A clean, learner-friendly KTM with sharp styling, light handling, and the right balance of confidence and fun for city riding or first-bike ownership.',
  },
  {
    slug: '2017-honda-cbr650f-low-mileage',
    title: '2017 Honda CBR650F Low Mileage',
    make: 'Honda',
    model: 'CBR650F',
    year: 2017,
    mileage: 15100,
    engine: '650cc',
    style: 'Sport',
    price: 3600,
    image: '/images/bike-3.webp',
    badge: 'New Arrival',
    status: 'Available',
    description:
      'A strong-value middleweight sport bike with everyday usability, refined Honda manners, and enough performance for step-up riders.',
  },
  {
    slug: '2017-yamaha-mt125-low-mileage',
    title: '2017 Yamaha MT125 Low Mileage',
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
    description:
      'One of the best entry-level naked bikes in the UK market, ideal for urban commuting with premium styling and proven Yamaha reliability.',
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
    description:
      'A sharp-looking, high-demand 125cc sports bike with strong learner appeal and the visual presence of a larger displacement machine.',
  },
  {
    slug: '2018-ktm-duke-125-low-mileage',
    title: '2018 KTM Duke 125 Low Mileage',
    make: 'KTM',
    model: 'Duke 125',
    year: 2018,
    mileage: 2447,
    engine: '125cc',
    style: 'Naked',
    price: 2800,
    image: '/images/bike-6.webp',
    badge: 'Low Mileage',
    status: 'Available',
    description:
      'A very low-mileage example with excellent first-bike appeal, sporty styling, and a great balance of affordability and brand desirability.',
  },
  {
    slug: '2022-yamaha-xsr-125-abs-6k',
    title: '2022 Yamaha XSR 125 ABS 6k',
    make: 'Yamaha',
    model: 'XSR 125 ABS',
    year: 2022,
    mileage: 6781,
    engine: '125cc',
    style: 'Retro',
    price: 3500,
    image: 'https://i.ebayimg.com/images/g/npsAAeSwPHBoeDGQ/s-l1600.webp',
    badge: 'Retro Style',
    status: 'Available',
    description:
      'A stylish retro-inspired 125 with modern Yamaha engineering, ABS braking, and strong appeal for urban and lifestyle riders.',
  },
  {
    slug: '2021-yamaha-mt125-low-mileage',
    title: '2021 Yamaha MT125 Low Mileage',
    make: 'Yamaha',
    model: 'MT125',
    year: 2021,
    mileage: 6800,
    engine: '125cc',
    style: 'Naked',
    price: 3500,
    image: 'https://i.ebayimg.com/images/g/BlQAAOSwtVBoQBS6/s-l1600.webp',
    badge: 'Learner Favourite',
    status: 'Available',
    description:
      'A later-generation MT125 with sharp design, strong commuter practicality, and excellent demand in the UK learner market.',
  },
  {
    slug: '2021-yamaha-yzf-r125-low-mileage',
    title: '2021 Yamaha YZF R125 Low Mileage',
    make: 'Yamaha',
    model: 'YZF R125',
    year: 2021,
    mileage: 6800,
    engine: '125cc',
    style: 'Sport',
    price: 3500,
    image: 'https://i.ebayimg.com/images/g/UbwAAeSwSIRpINC4/s-l1600.webp',
    badge: 'Low Mileage',
    status: 'Available',
    description:
      'A high-demand sport 125 that combines premium looks, everyday usability, and strong resale appeal.',
  },
  {
    slug: '2019-yamaha-mt125-abs',
    title: '2019 Yamaha MT125 ABS',
    make: 'Yamaha',
    model: 'MT125 ABS',
    year: 2019,
    mileage: 11200,
    engine: '125cc',
    style: 'Naked',
    price: 2800,
    image: 'https://i.ebayimg.com/images/g/ytQAAeSwEP1o-AO8/s-l1600.webp',
    badge: 'Sold',
    status: 'Sold',
    description:
      'A good example of the kind of fast-moving, value-led 125cc stock that performs well in the current market.',
  },
  {
    slug: '2020-yamaha-r3-abs-low-mileage',
    title: '2020 Yamaha R3 ABS Low Mileage',
    make: 'Yamaha',
    model: 'R3 ABS',
    year: 2020,
    mileage: 2450,
    engine: '321cc',
    style: 'Sport',
    price: 3600,
    image: 'https://i.ebayimg.com/images/g/lmIAAeSwPHZpfpBp/s-l1600.webp',
    badge: 'Sold',
    status: 'Sold',
    description:
      'A strong step-up sports bike for riders moving beyond 125cc, with low mileage and broad market appeal.',
  },
  {
    slug: '2010-honda-xl700-transalp',
    title: '2010 Honda XL700 Transalp',
    make: 'Honda',
    model: 'XL700 Transalp',
    year: 2010,
    mileage: 14000,
    engine: '700cc',
    style: 'Adventure',
    price: 3600,
    image: '/images/bike-1.webp',
    badge: 'Adventure',
    status: 'Available',
    description:
      'A practical, proven adventure machine with broad all-round capability and strong touring credentials.',
  },
]

const trustBadges = [
  'HPI Checked',
  '30-Day Warranty',
  'Minimum 6 Months MOT',
  'Nationwide Delivery',
  'No Hidden Fees',
]

const prepItems = [
  'Oil change completed before delivery',
  'Brake fluid checked and topped up where required',
  'Coolant level checked and corrected as needed',
  'Tyres inspected for tread, pressure, and overall condition',
  'Chain and sprockets checked for wear and tension',
  'Lights, indicators, horn, and dash functions tested',
]

const financeHighlights = [
  {
    title: 'Clear monthly affordability',
    copy: 'We present realistic monthly examples to help buyers judge affordability before making an enquiry.',
    icon: Wallet,
  },
  {
    title: 'Flexible finance routes',
    copy: 'The site is designed to support HP-first finance and can later be expanded to PCP if the business chooses.',
    icon: CreditCard,
  },
  {
    title: 'Conversion-focused placement',
    copy: 'Finance appears on the homepage, inventory cards, and each bike detail page instead of being buried.',
    icon: CircleDollarSign,
  },
]

const reviews = [
  {
    name: 'Leeds commuter buyer',
    quote:
      'Professional, straightforward, and no pressure. The bike was exactly as described and ready to ride.',
  },
  {
    name: 'First-bike customer',
    quote:
      'Clear communication, helpful appointment process, and a much more reassuring buying experience than dealing privately.',
  },
  {
    name: 'Part-exchange customer',
    quote:
      'A fair offer and an easy process. The new site structure makes the service feel much more premium and trustworthy.',
  },
]

const legalPageCopy = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['Who we are', `${company.name} collects enquiry, appointment, valuation, and finance lead information through this website.`],
      ['What we collect', 'We may collect your name, phone number, email, registration number, mileage, bike condition details, and any message you send us.'],
      ['Why we collect it', 'We use this information to respond to enquiries, prepare valuations, arrange appointments, discuss finance options, and support legitimate sales activity.'],
      ['Data retention', 'Lead information should only be retained for as long as necessary for customer service, sales follow-up, legal compliance, and record keeping.'],
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    sections: [
      ['Essential cookies', 'These support core website functions such as navigation, session continuity, and performance.'],
      ['Analytics cookies', 'Analytics may be used to understand how visitors interact with the site and to improve page performance and conversion flow.'],
      ['Marketing cookies', 'If used in future, marketing cookies should only be enabled with appropriate consent.'],
      ['Cookie control', 'Visitors should be able to manage or withdraw consent through the cookie banner or browser settings.'],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    sections: [
      ['Website information', 'Stock, prices, and finance examples are displayed in good faith but remain subject to availability, verification, and change.'],
      ['Reservations', 'Reservation deposits, if enabled, secure a bike for a defined period and remain subject to the specific reservation terms shown during checkout.'],
      ['Descriptions', 'Vehicle descriptions and imagery are intended as guides and should be confirmed during viewing, inspection, or direct contact.'],
      ['Appointments', 'Viewings are appointment-based to ensure the best customer experience and vehicle availability.'],
    ],
  },
}

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
            <Route path="/" element={<HomePage />} />
            <Route path="/bikes" element={<InventoryPage />} />
            <Route path="/bikes/:slug" element={<BikeDetailPage />} />
            <Route path="/sell-your-bike" element={<SellPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal/:type" element={<LegalPage />} />
          </Routes>
        </SiteShell>
      </div>
    </HashRouter>
  )
}

function SiteShell({ children }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0d12]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link to="/" className="text-lg font-semibold tracking-[0.2em] text-white uppercase">
              Knights Motorcycles
            </Link>
            <p className="mt-1 text-xs text-white/55">Leeds · Used bikes · Appointment only</p>
          </div>

          <nav className="hidden items-center gap-5 text-sm text-white/75 md:flex">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/bikes">Used Bikes</NavItem>
            <NavItem to="/sell-your-bike">Sell Your Bike</NavItem>
            <NavItem to="/finance">Finance</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </nav>

          <a
            href={company.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400 hover:text-black"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </div>
      </header>

      {children}

      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
              A reimagined dealership website concept built from the original public site content,
              upgraded around clearer trust, stronger conversion paths, and a more premium buying
              journey.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Quick links</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <Link to="/bikes" className="hover:text-white">Used Bikes</Link>
              <Link to="/sell-your-bike" className="hover:text-white">Sell Your Bike</Link>
              <Link to="/finance" className="hover:text-white">Finance</Link>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Legal</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <Link to="/legal/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/legal/cookies" className="hover:text-white">Cookie Policy</Link>
              <Link to="/legal/terms" className="hover:text-white">Terms & Conditions</Link>
            </div>
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
        isActive ? 'text-white' : 'text-white/75 transition hover:text-white'
      }
    >
      {children}
    </NavLink>
  )
}

function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.9fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/65">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              HPI checked · warranty included · appointment based
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              {company.subtitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{company.strapline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryLink to="/bikes">View Used Bikes</PrimaryLink>
              <SecondaryLink to="/sell-your-bike">Value My Bike</SecondaryLink>
              <SecondaryLink to="/contact">Book an Appointment</SecondaryLink>
            </div>
            <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
              {trustBadges.map((badge) => (
                <div key={badge} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75">
                  {badge}
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <img src="/images/hero-track.jpeg" alt="Racing motorcycle" className="hero-image h-64 rounded-3xl object-cover sm:h-72 lg:col-span-2 lg:h-80" />
            <img src="/images/showroom.jpg" alt="Showroom" className="hero-image h-44 rounded-3xl object-cover sm:h-56" />
            <img src="/images/workshop.webp" alt="Workshop" className="hero-image h-44 rounded-3xl object-cover sm:h-56" />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-5 lg:px-8">
          {[
            { icon: ShieldCheck, label: 'HPI Checked', copy: 'History checked before sale' },
            { icon: Wrench, label: 'Prepared in-house', copy: 'Oil, fluids, tyres, electricals' },
            { icon: Clock3, label: 'By appointment', copy: 'Dedicated viewing experience' },
            { icon: Truck, label: 'Nationwide delivery', copy: 'UK delivery available' },
            { icon: Wallet, label: 'Part exchange welcome', copy: 'Fair valuation process' },
          ].map(({ icon: Icon, label, copy }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Icon className="h-5 w-5 text-amber-300" />
              <p className="mt-3 text-sm font-medium text-white">{label}</p>
              <p className="mt-1 text-sm text-white/55">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Featured stock</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Ready-to-ride used motorcycles</h2>
          </div>
          <Link to="/bikes" className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
            Browse all bikes <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bikes.slice(0, 6).map((bike) => (
            <BikeCard key={bike.slug} bike={bike} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-18 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Sell your bike</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">A faster, cleaner valuation journey</h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              The original site already mentions part exchange and instant cash purchase. This new
              version upgrades that into a real customer flow: registration, mileage, condition,
              valuation request, and follow-up.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InputBox label="Registration" placeholder="e.g. YX21 ABC" />
              <InputBox label="Mileage" placeholder="e.g. 12850" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <PrimaryLink to="/sell-your-bike">Get an Instant Valuation</PrimaryLink>
              <SecondaryLink to="/contact">Request a Call Back</SecondaryLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Step 1', 'Enter your bike details'],
              ['Step 2', 'Receive a valuation or call-back'],
              ['Step 3', 'Arrange inspection, collection, and secure payment'],
            ].map(([step, copy]) => (
              <div key={step} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-amber-300/80">{step}</p>
                <p className="mt-5 text-lg font-medium leading-8 text-white">{copy}</p>
              </div>
            ))}
            <img src="/images/delivery.jpg" alt="Delivery" className="hero-image h-60 rounded-[2rem] object-cover md:col-span-3" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Finance</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Finance belongs in the buying journey, not hidden in the footer</h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              This concept places finance in the core flow: homepage, stock cards, and bike detail pages.
              Buyers in this price range often respond better to monthly affordability than total price alone.
            </p>
            <div className="mt-6 flex gap-3">
              <PrimaryLink to="/finance">Explore Finance</PrimaryLink>
              <SecondaryLink to="/bikes">See bikes with finance examples</SecondaryLink>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {financeHighlights.map(({ title, copy, icon: Icon }) => (
              <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <Icon className="h-6 w-6 text-amber-300" />
                <h3 className="mt-5 text-lg font-medium text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/35">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-18 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Why buy from Knights</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Built from the original public promises, rebuilt into a clearer trust system</h2>
            <div className="mt-6 space-y-4 text-white/68">
              <p>
                The old site already communicated the right foundations: HPI checks, a 30-day warranty,
                pre-delivery inspection, and nationwide delivery.
              </p>
              <p>
                The redesign keeps those strengths but turns them into visible trust modules so buyers can scan,
                compare, and act faster.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {prepItems.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <img src="/images/finance.jpg" alt="Finance conversation" className="hero-image h-72 rounded-[2rem] object-cover" />
            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.name} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                  <Star className="h-5 w-5 text-amber-300" />
                  <p className="mt-4 text-sm leading-7 text-white/70">“{review.quote}”</p>
                  <p className="mt-4 text-sm font-medium text-white">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 lg:grid-cols-[1fr_0.95fr] lg:p-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Visit & contact</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Appointment-based, premium, and low-pressure</h2>
            <div className="mt-6 space-y-4 text-white/68">
              <p>{company.address}</p>
              <p>{company.hours}</p>
              <p>{company.inquiry}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={company.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-300">
                <Phone className="h-4 w-4" />
                {company.phone}
              </a>
              <SecondaryLink to="/contact">Book an Appointment</SecondaryLink>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6">
            <div className="space-y-4 text-sm text-white/65">
              <InfoRow icon={MapPin} label="Location" value="Leeds, West Yorkshire" />
              <InfoRow icon={Clock3} label="Viewing" value="Appointment only" />
              <InfoRow icon={Truck} label="Delivery" value="Available across the UK" />
              <InfoRow icon={Wallet} label="Selling" value="Part exchange and cash purchase" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function InventoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Used Bikes</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Used motorcycles for sale</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/68">
            A cleaner, more conversion-focused stock listing page built from the current public inventory.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
          {bikes.length} bikes shown in this preview build
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1fr_220px_220px_220px_auto] lg:p-6">
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/60">Search by make or model</div>
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/60">Price range</div>
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/60">Engine size</div>
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/60">Bike type</div>
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-300">
          <Search className="h-4 w-4" />
          Search Bikes
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {bikes.map((bike) => (
          <BikeCard key={bike.slug} bike={bike} />
        ))}
      </div>
    </main>
  )
}

function BikeDetailPage() {
  const { slug } = useParams()
  const bike = getBike(slug)

  if (!bike) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-white">Bike not found</h1>
        <p className="mt-4 text-white/65">This preview route does not exist yet.</p>
        <div className="mt-8">
          <PrimaryLink to="/bikes">Back to stock</PrimaryLink>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 text-sm text-white/45">
        <Link to="/bikes" className="transition hover:text-white">Used Bikes</Link>
        <span className="mx-2">/</span>
        <span>{bike.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
          <img src={bike.image} alt={bike.title} className="h-full min-h-[420px] w-full object-cover" />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-200">
              {bike.badge}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
              {bike.status}
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold text-white">{bike.title}</h1>
          <div className="mt-6 flex items-end gap-4">
            <p className="text-4xl font-semibold text-white">{formatPrice(bike.price)}</p>
            <p className="text-sm text-white/55">From {formatPrice(monthlyFrom(bike.price))}/month</p>
          </div>
          <p className="mt-6 text-base leading-8 text-white/68">{bike.description}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Spec label="Year" value={String(bike.year)} icon={CalendarDays} />
            <Spec label="Mileage" value={mileageText(bike.mileage)} icon={Gauge} />
            <Spec label="Engine" value={bike.engine} icon={Bike} />
            <Spec label="Style" value={bike.style} icon={Wrench} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#reserve" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-300">
              Reserve This Bike
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/finance" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/85 transition hover:border-white/35 hover:bg-white/[0.08]">
              Apply for Finance
            </Link>
            <Link to="/sell-your-bike" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/85 transition hover:border-white/35 hover:bg-white/[0.08]">
              Part Exchange Your Bike
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {trustBadges.map((badge) => (
              <div key={badge} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/68">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">Preparation & inspection</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {prepItems.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-white/68">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div id="reserve" className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-semibold text-white">Reserve this bike</h2>
            <p className="mt-4 text-sm leading-7 text-white/65">
              The upgraded flow is designed around a low-friction reservation option — ideal for buyers who want to secure stock before viewing.
            </p>
            <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
              Suggested structure: Reserve online for <strong>£199</strong> and hold the bike for <strong>48 hours</strong>.
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-semibold text-white">Delivery & contact</h2>
            <div className="mt-4 space-y-3 text-sm text-white/65">
              <p>Nationwide delivery can be offered across the UK.</p>
              <p>Viewings are handled by appointment to provide a focused, low-pressure experience.</p>
              <a href={company.phoneHref} className="inline-flex items-center gap-2 text-amber-200 hover:text-amber-100">
                <Phone className="h-4 w-4" />
                {company.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function SellPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Sell Your Bike</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Fast valuation, cleaner lead capture, and a stronger trade-in journey</h1>
          <p className="mt-5 text-base leading-8 text-white/68">
            This page upgrades the original public promise of part exchange and instant cash purchase into a proper dealership product flow.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              'Enter registration and mileage',
              'Receive valuation or callback',
              'Arrange inspection, collection, and payment',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/68">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Registration Number" placeholder="YX21 ABC" />
            <FormInput label="Mileage" placeholder="12850" />
            <FormInput label="Bike Condition" placeholder="Excellent / Good / Fair" />
            <FormInput label="Service History" placeholder="Full / Partial / None" />
            <FormInput label="Outstanding Finance" placeholder="Yes / No" />
            <FormInput label="Postcode" placeholder="LS12 3HT" />
            <FormInput label="Full Name" placeholder="Your name" />
            <FormInput label="Phone Number" placeholder="07..." />
            <div className="sm:col-span-2">
              <FormInput label="Email Address" placeholder="you@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-white/75">Notes</label>
              <textarea className="h-32 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-white/30" placeholder="Tell us about condition, modifications, keys, or preferred collection timing" />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-300">
              Get an Instant Valuation
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/85 transition hover:border-white/35 hover:bg-white/[0.08]">
              Request a Call Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function FinancePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Finance</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Motorcycle finance made clearer and easier to act on</h1>
        <p className="mt-5 text-base leading-8 text-white/68">
          The purpose of this page is not just to mention finance availability. It is designed to educate, reassure, and convert — especially for buyers who shop by monthly affordability.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {financeHighlights.map(({ title, copy, icon: Icon }) => (
          <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <Icon className="h-6 w-6 text-amber-300" />
            <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">{copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">Representative example</h2>
          <div className="mt-6 space-y-3 text-sm text-white/68">
            <InfoRow label="Cash Price" value="£3,000" />
            <InfoRow label="Deposit" value="£300" />
            <InfoRow label="Amount of Credit" value="£2,700" />
            <InfoRow label="APR" value="16.9% representative" />
            <InfoRow label="Term" value="48 months" />
            <InfoRow label="Monthly Payment" value="from £79–£95" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white">Suggested application journey</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/68">
            <p>1. Choose a bike from stock.</p>
            <p>2. Review the monthly example on the bike detail page.</p>
            <p>3. Submit a finance enquiry or application.</p>
            <p>4. Confirm affordability and next steps with the dealership team.</p>
            <p>5. Proceed to reservation, appointment, or delivery scheduling.</p>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/60">
            Future compliance layer: credit-broker wording, lender disclosures, and finance declaration.
          </div>
        </div>
      </div>
    </main>
  )
}

function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Book a viewing, ask about delivery, or discuss a bike directly</h1>
          <div className="mt-6 space-y-4 text-base leading-8 text-white/68">
            <p>{company.address}</p>
            <p>{company.hours}</p>
            <p>{company.inquiry}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={company.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-300">
              <Phone className="h-4 w-4" />
              {company.phone}
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Full Name" placeholder="Your name" />
            <FormInput label="Phone Number" placeholder="07..." />
            <div className="sm:col-span-2">
              <FormInput label="Email Address" placeholder="you@example.com" />
            </div>
            <FormInput label="Interested Bike" placeholder="Bike model or stock reference" />
            <FormInput label="Preferred Date" placeholder="Preferred viewing date" />
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-white/75">Message</label>
              <textarea className="h-32 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" placeholder="Tell us what you want to know, what bike you are interested in, or whether you need delivery / finance / part exchange support" />
            </div>
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-300">
            Book an Appointment
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  )
}

function LegalPage() {
  const { type = 'privacy' } = useParams()
  const page = legalPageCopy[type] || legalPageCopy.privacy

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-300/80">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">{page.title}</h1>
      <div className="mt-8 space-y-6">
        {page.sections.map(([title, body]) => (
          <section key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-4 text-base leading-8 text-white/68">{body}</p>
          </section>
        ))}
      </div>
    </main>
  )
}

function BikeCard({ bike }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">
      <img src={bike.image} alt={bike.title} className="h-64 w-full object-cover" />
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/65">
            {bike.badge}
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-white/40">{bike.status}</span>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">{bike.title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/60">{bike.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/65">
          <CardMini label="Year" value={String(bike.year)} />
          <CardMini label="Mileage" value={mileageText(bike.mileage)} />
          <CardMini label="Engine" value={bike.engine} />
          <CardMini label="Style" value={bike.style} />
        </div>
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-white">{formatPrice(bike.price)}</p>
            <p className="text-sm text-white/50">From {formatPrice(monthlyFrom(bike.price))}/month</p>
          </div>
          <Link
            to={`/bikes/${bike.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/35 hover:bg-white/[0.08]"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function Spec({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <Icon className="h-4 w-4 text-amber-300" />
      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? <Icon className="mt-0.5 h-4 w-4 text-amber-300" /> : <div className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300" />}
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
        <p className="mt-1 text-sm text-white/70">{value}</p>
      </div>
    </div>
  )
}

function CardMini({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1 text-sm text-white/72">{value}</p>
    </div>
  )
}

function InputBox({ label, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/75">{label}</label>
      <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/35">{placeholder}</div>
    </div>
  )
}

function FormInput({ label, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/75">{label}</label>
      <input className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" placeholder={placeholder} />
    </div>
  )
}

function PrimaryLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-amber-300">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

function SecondaryLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/85 transition hover:border-white/35 hover:bg-white/[0.08]">
      {children}
    </Link>
  )
}

export default App
