import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ThemeToggle from '../components/ThemeToggle.jsx'

const WORDS = ['instantly', 'effortlessly', 'securely', 'accurately']

const PHARMACIES = [
    {
        name: 'Tata 1mg',
        src: 'https://marketing-compaigns.s3.ap-south-1.amazonaws.com/emailer/Landing-Pages-2021/Tata-1mg-Announcement/TATA%201mg%20logo.svg',
        position: 'top-8 md:top-14 lg:top-20 left-2 md:left-4 lg:left-8 xl:left-12',
        size: 'h-10 md:h-12 lg:h-16 w-auto max-w-[140px] md:max-w-[180px] lg:max-w-[220px]',
        mobileSize: 'h-7 sm:h-8',
        darkClass: 'dark:brightness-0 dark:invert dark:opacity-90',
        animation: 'animate-float-1',
    },
    {
        name: 'Apollo 24|7',
        src: 'https://images.apollo247.in/images/ic_logo.png',
        position: 'top-1/2 -translate-y-1/2 left-2 md:left-6 lg:left-12 xl:left-16',
        size: 'h-12 md:h-16 lg:h-20 w-auto',
        mobileSize: 'h-8 sm:h-9',
        darkClass: 'dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]',
        animation: 'animate-float-2',
    },
    {
        name: 'PharmEasy',
        src: '/pharmeasy.svg',
        position: 'bottom-8 md:bottom-14 lg:bottom-20 left-3 md:left-6 lg:left-10 xl:left-14',
        size: 'h-10 md:h-12 lg:h-15 w-auto max-w-[140px] md:max-w-[180px] lg:max-w-[220px]',
        mobileSize: 'h-7 sm:h-8',
        darkClass: 'dark:brightness-125 dark:drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        animation: 'animate-float-3',
    },
    {
        name: 'TrueMeds',
        src: '/truemed.svg',
        position: 'top-10 md:top-16 lg:top-22 right-2 md:right-4 lg:right-8 xl:right-12',
        size: 'h-10 md:h-12 lg:h-15 w-auto max-w-[140px] md:max-w-[180px] lg:max-w-[210px]',
        mobileSize: 'h-7 sm:h-8',
        darkClass: 'dark:brightness-125 dark:drop-shadow-[0_0_12px_rgba(26,115,232,0.25)]',
        animation: 'animate-float-4',
    },
    {
        name: 'NetMeds',
        src: '/netmeds.svg',
        position: 'bottom-10 md:bottom-16 lg:bottom-22 right-2 md:right-4 lg:right-8 xl:right-12',
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

                                {/* Floating Tooltip */}
                                <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 hidden scale-95 items-center gap-1.5 whitespace-nowrap rounded-full border border-stone-200/80 bg-stone-900/90 px-2.5 py-0.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:flex group-hover:scale-100 group-hover:opacity-100 dark:border-stone-700 dark:bg-stone-800">
                                    <span>{pharmacy.name}</span>
                                    <span className="text-[9px] text-emerald-400">● live</span>
                                </div>
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

                {/* How it works */}
                <section id="how-it-works" className="mx-auto mt-28 max-w-6xl scroll-mt-16 md:mt-36">
                    <div className="max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">How it works</p>
                        <h2 className="mt-3 font-serif text-4xl tracking-tight text-stone-900 md:text-5xl dark:text-stone-50">
                            Three steps to the fair price.
                        </h2>
                    </div>
                    <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
                        {STEPS.map((step) => (
                            <div key={step.num} className="border-t border-stone-200 pt-6 dark:border-stone-800">
                                <span className="font-serif text-5xl italic text-stone-300 dark:text-stone-700">{step.num}</span>
                                <h3 className="mt-4 text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">{step.title}</h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">{step.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Under the hood */}
                <section id="under-the-hood" className="mx-auto mt-28 max-w-6xl scroll-mt-16 md:mt-36">
                    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                        <div className="self-start lg:sticky lg:top-24">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Under the hood</p>
                            <h2 className="mt-3 font-serif text-4xl tracking-tight text-stone-900 md:text-5xl dark:text-stone-50">
                                There is no API. So we built the plumbing.
                            </h2>
                            <p className="mt-6 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
                                None of the five pharmacies publish a public price API — and even if they did, your
                                browser couldn’t call it directly, because CORS blocks cross-site requests from web pages.
                            </p>
                            <p className="mt-4 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
                                So MedScrapper asks from its own server instead. One search fires five parallel
                                server-side requests, each carrying the same headers the pharmacy’s own website would
                                send — then whatever comes back is filtered into clean, comparable data.
                            </p>
                        </div>

                        <div>
                            <ol className="space-y-8">
                                {[
                                    {
                                        num: '01',
                                        title: 'Sidestep the browser',
                                        body: 'CORS is a browser rule, not an internet rule. Requests leave from our backend, so each pharmacy sees an ordinary server-to-server call — exactly how their own site talks to its own API.',
                                    },
                                    {
                                        num: '02',
                                        title: 'Three extraction strategies',
                                        body: 'Hidden JSON APIs where they exist, embedded state blobs where the data hides in the page, and plain markup parsing where nothing structured is offered at all.',
                                    },
                                    {
                                        num: '03',
                                        title: 'One schema out',
                                        body: 'Whatever the raw source looks like, every product is filtered down to the same shape — name, price, MRP, discount, pack size, image, link — so the frontend has nothing to untangle.',
                                    },
                                ].map((point) => (
                                    <li key={point.num} className="flex gap-5">
                                        <span className="mt-1 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">{point.num}</span>
                                        <div>
                                            <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">{point.title}</h3>
                                            <p className="mt-1.5 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">{point.body}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Method ledger */}
                    <div className="mt-16 overflow-hidden rounded-3xl border border-stone-200/70 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-900/80">
                        <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/60 px-6 py-4 dark:border-stone-800 dark:bg-stone-800/40">
                            <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">Five pharmacies, five different locks</h3>
                            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-stone-400 sm:block dark:text-stone-500">method</span>
                        </div>
                        <ul>
                            {SOURCING.map((item) => (
                                <li
                                    key={item.name}
                                    className="grid gap-2 border-b border-stone-50 px-6 py-4 last:border-b-0 sm:grid-cols-[150px_170px_1fr] sm:items-baseline sm:gap-6 dark:border-stone-800/60"
                                >
                                    <span className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">{item.name}</span>
                                    <span className="justify-self-start rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                                        {item.method}
                                    </span>
                                    <span className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{item.detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pipeline strip */}
                    <div className="mt-6 rounded-3xl border border-stone-200/70 bg-white/80 px-6 py-5 backdrop-blur dark:border-stone-800 dark:bg-stone-900/80">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
                            {PIPELINE.map((step, idx) => (
                                <div key={step} className="flex items-center gap-3">
                                    <span className={`font-mono text-[13px] tracking-tight ${idx === PIPELINE.length - 1 ? 'font-medium text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}>
                                        {step}
                                    </span>
                                    {idx < PIPELINE.length - 1 && (
                                        <svg className="h-3.5 w-3.5 shrink-0 text-stone-300 dark:text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto mt-24 max-w-6xl md:mt-32">
                    <div className="grid gap-4 md:grid-cols-3">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-3xl border border-stone-200/70 bg-white/80 p-7 backdrop-blur transition-[border-color,box-shadow] duration-200 ease-out hover:border-emerald-200 hover:shadow-lg hover:shadow-stone-200/60 dark:border-stone-800 dark:bg-stone-900/80 dark:hover:border-emerald-500/30 dark:hover:shadow-black/30"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    {feature.icon}
                                </div>
                                <h3 className="mt-5 text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">{feature.title}</h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">{feature.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA band */}
                <section className="mx-auto mt-24 max-w-6xl md:mt-32">
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-8 py-16 text-center shadow-2xl shadow-emerald-700/20 md:py-20 dark:shadow-black/40">
                        <div
                            aria-hidden
                            className="absolute inset-0 bg-[radial-gradient(circle,#ffffff14_1px,transparent_1px)] [background-size:22px_22px]"
                        />
                        <h2 className="relative font-serif text-4xl tracking-tight text-white md:text-5xl">
                            Stop overpaying for your medicines.
                        </h2>
                        <p className="relative mx-auto mt-4 max-w-md text-emerald-50/90">
                            One search, five pharmacies, the lowest price. It takes about ten seconds.
                        </p>
                        <Link
                            to="/search"
                            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-emerald-800 shadow-lg transition-[transform,background-color] duration-150 ease-out hover:bg-emerald-50 active:scale-[0.97]"
                        >
                            Compare prices now
                            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
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
