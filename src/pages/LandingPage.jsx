import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle.jsx'
import Reveal from '../components/Reveal.jsx'

const WORDS = ['instantly', 'effortlessly', 'securely', 'accurately']

const PHARMACIES = [
    {
        name: 'Tata 1mg',
        src: 'https://marketing-compaigns.s3.ap-south-1.amazonaws.com/emailer/Landing-Pages-2021/Tata-1mg-Announcement/TATA%201mg%20logo.svg',
        position: 'top-8 md:top-14 lg:top-20 left-2 md:left-4 lg:left-6 xl:left-8',
        size: 'h-10 md:h-12 lg:h-16 w-auto max-w-[140px] md:max-w-[180px] lg:max-w-[220px]',
        mobileSize: 'h-7 sm:h-8',
        darkClass: 'dark:brightness-0 dark:invert dark:opacity-90',
        animation: 'animate-float-1',
    },
    {
        name: 'Apollo 24|7',
        src: 'https://images.apollo247.in/images/ic_logo.png',
        position: 'top-[46%] -translate-y-1/2 left-6 md:left-14 lg:left-24 xl:left-32',
        size: 'h-12 md:h-16 lg:h-20 w-auto',
        mobileSize: 'h-8 sm:h-9',
        darkClass: 'dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]',
        animation: 'animate-float-2',
    },
    {
        name: 'PharmEasy',
        src: '/pharmeasy.svg',
        position: 'bottom-8 md:bottom-14 lg:bottom-20 left-3 md:left-8 lg:left-14 xl:left-18',
        size: 'h-10 md:h-12 lg:h-15 w-auto max-w-[140px] md:max-w-[180px] lg:max-w-[220px]',
        mobileSize: 'h-7 sm:h-8',
        darkClass: 'dark:brightness-125 dark:drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        animation: 'animate-float-3',
    },
    {
        name: 'TrueMeds',
        src: '/truemed.svg',
        position: 'top-10 md:top-16 lg:top-22 right-6 md:right-14 lg:right-20 xl:right-26',
        size: 'h-10 md:h-12 lg:h-15 w-auto max-w-[140px] md:max-w-[180px] lg:max-w-[210px]',
        mobileSize: 'h-7 sm:h-8',
        darkClass: 'dark:brightness-125 dark:drop-shadow-[0_0_12px_rgba(26,115,232,0.25)]',
        animation: 'animate-float-4',
    },
    {
        name: 'NetMeds',
        src: '/netmeds.svg',
        position: 'bottom-10 md:bottom-16 lg:bottom-22 right-2 md:right-4 lg:right-6 xl:right-8',
        size: 'h-10 md:h-12 lg:h-15 w-auto max-w-[140px] md:max-w-[180px] lg:max-w-[210px]',
        mobileSize: 'h-7 sm:h-8',
        darkClass: 'dark:brightness-125 dark:drop-shadow-[0_0_12px_rgba(50,174,177,0.3)]',
        animation: 'animate-float-5',
    },
]

const STEPS = [
    {
        num: '01',
        title: 'Search once',
        body: 'Type a medicine name or upload a prescription photo. One query fans out to five pharmacies in parallel.',
    },
    {
        num: '02',
        title: 'Compare honestly',
        body: 'Live prices, discounts and per-unit costs side by side — sorted by whatever matters to you.',
    },
    {
        num: '03',
        title: 'Buy where it’s cheapest',
        body: 'Jump straight to the winning pharmacy’s listing and keep the difference in your pocket.',
    },
]

const FEATURES = [
    {
        title: 'Price per unit',
        body: 'Strips-pack marketing can’t fool you. We normalise every deal down to cost per tablet.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 7h6m-6 4h6m-6 4h3m-7 6h10a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        title: 'Prescription OCR',
        body: 'Snap a photo of your prescription and we lift the medicine names out of it for you.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        title: 'Delivery check',
        body: 'Set your pincode — or share live location — and only see pharmacies that actually deliver to you.',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
]

const SOURCING = [
    {
        name: 'Apollo 24|7',
        method: 'Private JSON API',
        detail: 'Reverse-engineered the search endpoint the Apollo site itself calls, replayed server-to-server with its auth headers.',
    },
    {
        name: 'TrueMeds',
        method: 'Internal search API',
        detail: 'Queries the warehouse search service behind the website directly and maps its fields to ours.',
    },
    {
        name: 'Tata 1mg',
        method: 'HTML + embedded state',
        detail: 'Parses the rendered product grid, then mines the page’s PRELOADED_STATE JSON for images, maker and salt info.',
    },
    {
        name: 'NetMeds',
        method: 'Embedded state JSON',
        detail: 'Lifts the __INITIAL_STATE__ blob out of the page and reads products straight from it.',
    },
    {
        name: 'PharmEasy',
        method: 'Raw HTML parsing',
        detail: 'No structured data offered at all — product cards are pattern-matched out of the markup itself.',
    },
]

const PIPELINE = ['Your query', '5 parallel relays', 'Parse HTML / JSON', 'One clean schema', 'Ranked results']

function Wordmark() {
    return (
        <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="MedScrapper Logo" className="h-9 w-9 object-contain" />
            <span className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-50">MedScrapper</span>
        </Link>
    )
}

function LandingPage() {
    const [wordIndex, setWordIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % WORDS.length)
        }, 2400)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden bg-stone-50 font-sans text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 dark:bg-stone-950 dark:text-stone-50 dark:selection:bg-emerald-500/20 dark:selection:text-emerald-100">
            {/* Calm background: soft gradient wash + faint dot grid */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[520px] w-[860px] max-w-[120vw] -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-100/80 via-teal-50/60 to-transparent blur-3xl dark:from-emerald-500/10 dark:via-teal-500/5" />
                <div className="absolute right-[-15%] top-[30%] h-[380px] w-[380px] rounded-full bg-cyan-100/40 blur-3xl dark:bg-cyan-500/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,#134e4a10_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(circle,#ffffff08_1px,transparent_1px)]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                <Wordmark />
                <div className="hidden items-center gap-8 md:flex">
                    <a href="#how-it-works" className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
                        How it works
                    </a>
                    <a href="#under-the-hood" className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
                        Under the hood
                    </a>
                    <a href="#features" className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
                        Features
                    </a>
                </div>
                <div className="flex items-center gap-2.5">
                    <ThemeToggle />
                    <Link
                        to="/search"
                        className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-[transform,background-color] duration-150 ease-out hover:bg-stone-700 active:scale-[0.97] dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-300"
                    >
                        Launch app
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="relative z-10 px-6">
                <section className="relative mx-auto flex w-full max-w-7xl min-h-[calc(100vh-5.5rem)] min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center py-12 text-center md:py-16">
                    {/* Floating Pharmacy Logos — Unboxed and enlarged */}
                    {PHARMACIES.map((pharmacy) => (
                        <div
                            key={pharmacy.name}
                            className={`group absolute z-20 hidden md:flex items-center justify-center ${pharmacy.position} ${pharmacy.animation}`}
                        >
                            <Link
                                to="/search"
                                aria-label={`Compare prices on ${pharmacy.name}`}
                                className="relative flex items-center justify-center transition-all duration-300 ease-out hover:scale-115 hover:-translate-y-1 cursor-pointer"
                            >
                                <img
                                    src={pharmacy.src}
                                    alt={pharmacy.name}
                                    className={`${pharmacy.size} object-contain drop-shadow-sm transition-all duration-300 group-hover:drop-shadow-lg ${pharmacy.darkClass}`}
                                    loading="eager"
                                />
                            </Link>
                        </div>
                    ))}

                    {/* Central Hero Content */}
                    <div className="mx-auto flex max-w-4xl flex-col items-center">
                        <div className="inline-flex animate-rise items-center gap-2 rounded-full border border-emerald-200/70 bg-white/70 px-4 py-1.5 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur dark:border-emerald-500/20 dark:bg-stone-900/70 dark:text-emerald-300">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            Live prices from 5 pharmacies
                        </div>

                        <h1 className="mt-7 animate-rise font-serif text-[clamp(2.9rem,8vw,5.25rem)] leading-[1.02] tracking-[-0.01em] text-stone-900 [animation-delay:80ms] dark:text-stone-50">
                            Compare medicine prices,
                            <span className="mt-1 block overflow-hidden pb-1">
                                <span
                                    key={wordIndex}
                                    className="animate-word-in bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 bg-clip-text font-serif italic text-transparent dark:from-emerald-400 dark:via-emerald-400 dark:to-teal-300"
                                >
                                    {WORDS[wordIndex]}.
                                </span>
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-stone-600 [animation-delay:160ms] dark:text-stone-400">
                            MedScrapper searches 1mg, Apollo, PharmEasy, TrueMeds and NetMeds at once —
                            so you never overpay for a prescription again.
                        </p>

                        <div className="mt-9 flex animate-rise flex-col items-center gap-3 sm:flex-row [animation-delay:240ms]">
                            <Link
                                to="/search"
                                className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-[transform,background-color,box-shadow] duration-150 ease-out hover:bg-emerald-700 hover:shadow-emerald-700/30 active:scale-[0.97] dark:bg-emerald-500 dark:shadow-emerald-500/20 dark:hover:bg-emerald-400 dark:hover:text-stone-950"
                            >
                                Start searching
                                <svg className="h-4.5 w-4.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center rounded-full border border-stone-200 bg-white/70 px-6 py-3.5 text-base font-medium text-stone-700 backdrop-blur transition-[background-color,border-color] duration-150 ease-out hover:border-stone-300 hover:bg-white active:scale-[0.97] dark:border-stone-700 dark:bg-stone-900/70 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:bg-stone-900"
                            >
                                How it works
                            </a>
                        </div>

                        <p className="mt-7 animate-rise font-mono text-[13px] tracking-tight text-stone-500 [animation-delay:320ms] dark:text-stone-400">
                            5 pharmacies · up to 40% off · free to use
                        </p>

                        {/* Mobile pharmacy strip (unboxed logos) */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:hidden">
                            {PHARMACIES.map((pharmacy) => (
                                <Link
                                    key={pharmacy.name}
                                    to="/search"
                                    className="transition-transform active:scale-95"
                                    title={pharmacy.name}
                                >
                                    <img
                                        src={pharmacy.src}
                                        alt={pharmacy.name}
                                        className={`${pharmacy.mobileSize} w-auto object-contain ${pharmacy.darkClass}`}
                                        loading="lazy"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works — Visual Bento Grid */}
                <section id="how-it-works" className="mx-auto w-full max-w-6xl py-24 scroll-mt-12 md:py-32">
                    <Reveal className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                            How it works
                        </div>
                        <h2 className="mt-4 font-serif text-4xl tracking-tight text-stone-900 md:text-5xl dark:text-stone-50">
                            Three steps to the fair price.
                        </h2>
                        <p className="mt-3 text-base text-stone-600 dark:text-stone-400">
                            No marketing gimmicks. We query 5 pharmacies in parallel and expose real unit prices.
                        </p>
                    </Reveal>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {/* Step 1 Bento Card */}
                        <Reveal delay={0}>
                            <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/80 bg-white/80 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:border-emerald-200 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900/60 dark:hover:border-stone-700">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 font-mono text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                            01
                                        </span>
                                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-[11px] text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                                            Parallel relay
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        Search once, query 5
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                        Type a medicine or upload a prescription. One search fans out to all 5 pharmacies concurrently.
                                    </p>
                                </div>

                                {/* Mock UI Graphic 1 */}
                                <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50/80 p-4 dark:border-stone-800/80 dark:bg-stone-950/60">
                                    <div className="flex items-center gap-2.5 rounded-xl border border-stone-200/70 bg-white px-3 py-2 text-xs shadow-inner dark:border-stone-800 dark:bg-stone-900">
                                        <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span className="font-medium text-stone-900 dark:text-stone-100">Paracetamol 650mg</span>
                                        <span className="ml-auto animate-pulse text-[10px] font-medium text-emerald-600 dark:text-emerald-400">● live</span>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
                                        {['Tata 1mg', 'Apollo 24|7', 'PharmEasy', 'TrueMeds'].map((name) => (
                                            <div key={name} className="flex items-center gap-1.5 rounded-lg bg-white/70 px-2 py-1 font-mono text-[10px] text-stone-600 dark:bg-stone-900/50 dark:text-stone-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                <span className="truncate">{name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Step 2 Bento Card */}
                        <Reveal delay={100}>
                            <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/80 bg-white/80 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:border-emerald-200 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900/60 dark:hover:border-stone-700">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 font-mono text-sm font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                                            02
                                        </span>
                                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-[11px] text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                                            Normalized cost
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        Compare unit economics
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                        Pack sizes vary from 10 to 15 pills. We normalise every single listing down to price-per-tablet.
                                    </p>
                                </div>

                                {/* Mock UI Graphic 2 */}
                                <div className="mt-6 space-y-2 rounded-2xl border border-stone-100 bg-stone-50/80 p-3.5 dark:border-stone-800/80 dark:bg-stone-950/60">
                                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-2.5 dark:bg-emerald-500/10">
                                        <div>
                                            <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">Winner: Tata 1mg</p>
                                            <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">₹1.32 per tablet</p>
                                        </div>
                                        <span className="rounded-lg bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                            42% OFF
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-white/70 p-2 text-xs text-stone-500 dark:bg-stone-900/50 dark:text-stone-400">
                                        <span>Pharmacy B</span>
                                        <span className="font-mono">₹2.10 / tab</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Step 3 Bento Card */}
                        <Reveal delay={200}>
                            <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/80 bg-white/80 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:border-emerald-200 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900/60 dark:hover:border-stone-700">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 font-mono text-sm font-bold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                                            03
                                        </span>
                                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-[11px] text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                                            Direct jump
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        Buy & keep the savings
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                        Click straight to the pharmacy’s verified product page and check out directly. Zero middleman fees.
                                    </p>
                                </div>

                                {/* Mock UI Graphic 3 */}
                                <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50/80 p-4 dark:border-stone-800/80 dark:bg-stone-950/60">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-stone-500 dark:text-stone-400">Estimated order savings</span>
                                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹148.50</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 py-2.5 text-xs font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] dark:bg-stone-100 dark:text-stone-900">
                                        <span>Open pharmacy listing</span>
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Under the hood — Unified Engineering Showcase */}
                <section id="under-the-hood" className="mx-auto w-full max-w-6xl py-24 scroll-mt-12 md:py-32">
                    <Reveal className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Architecture
                        </div>
                        <h2 className="mt-4 font-serif text-4xl tracking-tight text-stone-900 md:text-5xl dark:text-stone-50">
                            There is no public API. So we built the plumbing.
                        </h2>
                        <p className="mt-3 text-base text-stone-600 dark:text-stone-400">
                            Browser CORS restrictions block direct calls. Our backend executes 5 authentic server relays simultaneously.
                        </p>
                    </Reveal>

                    <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-start">
                        {/* Left column: 3 Strategy Cards */}
                        <div className="space-y-4 lg:col-span-5">
                            {[
                                {
                                    num: '01',
                                    title: 'Sidestep the browser',
                                    body: 'CORS is a browser constraint. Requests leave from our backend with authentic headers, so each pharmacy treats it as an internal request.',
                                },
                                {
                                    num: '02',
                                    title: 'Three extraction engines',
                                    body: 'Reverse-engineered private JSON endpoints, page state hydration (__INITIAL_STATE__), and resilient HTML pattern matching.',
                                },
                                {
                                    num: '03',
                                    title: 'Normalized Schema',
                                    body: 'Raw inputs are unified into identical fields (price, MRP, pack size, per-tablet unit cost, URL) with zero untangling needed.',
                                },
                            ].map((point, idx) => (
                                <Reveal key={point.num} delay={idx * 80}>
                                    <div className="rounded-2xl border border-stone-200/70 bg-white/70 p-5 backdrop-blur transition-colors hover:border-emerald-200 dark:border-stone-800 dark:bg-stone-900/50">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">{point.num}</span>
                                            <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">{point.title}</h3>
                                        </div>
                                        <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400">{point.body}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                        {/* Right column: Live Pharmacy Relay Matrix */}
                        <div className="lg:col-span-7">
                            <Reveal delay={120}>
                                <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-stone-800 dark:bg-stone-900/70">
                                    <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/70 px-6 py-4 dark:border-stone-800 dark:bg-stone-800/40">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">Live Scraper Matrix</h3>
                                        </div>
                                        <span className="font-mono text-[11px] text-stone-400 dark:text-stone-500">5 active relays</span>
                                    </div>
                                    <ul className="divide-y divide-stone-100 dark:divide-stone-800/60">
                                        {SOURCING.map((item) => (
                                            <li key={item.name} className="flex flex-col gap-1.5 p-5 transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-800/20 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">{item.name}</span>
                                                    <p className="text-xs text-stone-500 dark:text-stone-400">{item.detail}</p>
                                                </div>
                                                <span className="self-start whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[10px] font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300 sm:self-center">
                                                    {item.method}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        </div>
                    </div>

                    {/* Pipeline Rail */}
                    <Reveal delay={160} className="mt-8">
                        <div className="rounded-3xl border border-stone-200/80 bg-white/80 p-6 backdrop-blur dark:border-stone-800 dark:bg-stone-900/60">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                {PIPELINE.map((step, idx) => (
                                    <div key={step} className="flex items-center gap-3">
                                        <span className={`font-mono text-xs font-semibold ${idx === PIPELINE.length - 1 ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'}`}>
                                            {step}
                                        </span>
                                        {idx < PIPELINE.length - 1 && (
                                            <svg className="h-4 w-4 text-stone-300 dark:text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* Features — Visual Capability Grid */}
                <section id="features" className="mx-auto w-full max-w-6xl py-24 scroll-mt-12 md:py-32">
                    <Reveal className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                            Capabilities
                        </div>
                        <h2 className="mt-4 font-serif text-4xl tracking-tight text-stone-900 md:text-5xl dark:text-stone-50">
                            Engineered for transparent buying.
                        </h2>
                        <p className="mt-3 text-base text-stone-600 dark:text-stone-400">
                            Tools built specifically to defeat deceptive packaging and misleading shipping terms.
                        </p>
                    </Reveal>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {/* Feature 1 */}
                        <Reveal delay={0}>
                            <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/80 bg-white/80 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:border-emerald-200 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900/60">
                                <div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 7h6m-6 4h6m-6 4h3m-7 6h10a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        Price per unit normalizer
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                        Strip packaging tricks can’t mislead you. Every deal is converted down to cost per tablet or milliliter.
                                    </p>
                                </div>
                                <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50/80 p-3.5 font-mono text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-300">
                                    <div className="flex justify-between"><span>15 tabs @ ₹45:</span><span className="font-bold text-emerald-600">₹3.00 / tab</span></div>
                                    <div className="mt-1 flex justify-between text-stone-400"><span>10 tabs @ ₹35:</span><span>₹3.50 / tab</span></div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Feature 2 */}
                        <Reveal delay={100}>
                            <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/80 bg-white/80 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:border-emerald-200 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900/60">
                                <div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        Prescription OCR
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                        Snap a photo of your doctor’s prescription and our OCR lifts medicine names automatically.
                                    </p>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-1.5 rounded-2xl border border-stone-100 bg-stone-50/80 p-3.5 dark:border-stone-800 dark:bg-stone-950/60">
                                    {['✓ Dolo 650mg', '✓ Azithromycin', '✓ Pantocid 40'].map((tag) => (
                                        <span key={tag} className="rounded-lg bg-emerald-50 px-2 py-1 font-mono text-[10px] font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>

                        {/* Feature 3 */}
                        <Reveal delay={200}>
                            <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/80 bg-white/80 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:border-emerald-200 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900/60">
                                <div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                        Pincode delivery check
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                        Enter your postal code or share live GPS to instantly filter pharmacies that actually ship to you.
                                    </p>
                                </div>
                                <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50/80 p-3.5 text-xs dark:border-stone-800 dark:bg-stone-950/60">
                                    <span className="font-mono text-stone-500 dark:text-stone-400">📍 Pincode: 560001</span>
                                    <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">5 of 5 pharmacies deliver here</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Final Call To Action */}
                <section className="mx-auto w-full max-w-6xl py-24 md:py-32">
                    <Reveal>
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 px-8 py-20 text-center shadow-2xl shadow-emerald-900/30 md:py-24">
                            <div
                                aria-hidden
                                className="absolute inset-0 bg-[radial-gradient(circle,#ffffff18_1px,transparent_1px)] [background-size:24px_24px]"
                            />
                            <h2 className="relative font-serif text-4xl tracking-tight text-white md:text-6xl">
                                Stop overpaying for your medicines.
                            </h2>
                            <p className="relative mx-auto mt-5 max-w-lg text-lg text-emerald-50/90">
                                One query, five pharmacies, lowest price verified in seconds. Free to use forever.
                            </p>
                            <Link
                                to="/search"
                                className="relative mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-emerald-900 shadow-xl transition-all duration-150 hover:bg-emerald-50 hover:scale-105 active:scale-[0.98]"
                            >
                                Compare prices now
                                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </Reveal>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 mt-24 border-t border-stone-200/70 px-6 py-10 dark:border-stone-800">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
                    <Wordmark />
                    <p className="text-center text-sm text-stone-400 dark:text-stone-500">
                        Compares public listings only — not affiliated with the pharmacies shown.
                    </p>
                    <p className="text-sm text-stone-400 dark:text-stone-500">© {new Date().getFullYear()} MedScrapper</p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
