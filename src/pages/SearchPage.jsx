import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal.jsx'
import PharmacyCard from '../components/PharmacyCard.jsx'
import CountSelect from '../components/CountSelect.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { ACCENTS } from '../components/accents.js'

const EMPTY_RESULTS = { oneMg: [], apollo: [], pharmEasy: [], truemed: [], netmed: [] }

/* Per-pharmacy config: how to read each API's fields + which accent to use */
const PHARMACY_CONFIGS = [
    {
        id: '1mg',
        key: 'oneMg',
        name: 'Tata 1mg',
        logoSrc: 'https://marketing-compaigns.s3.ap-south-1.amazonaws.com/emailer/Landing-Pages-2021/Tata-1mg-Announcement/TATA%201mg%20logo.svg',
        logoPad: 'p-1',
        accent: 'emerald',
        size: (p) => p.packSize || p.unitSize,
        price: (p) => p.specialPrice || p.price,
        mrp: (p) => p.mrp,
        discount: (p) => (p.discount || p.discountPercentage ? `${p.discount || p.discountPercentage}% OFF` : null),
        perUnit: (p) => calculatePricePerUnit(p.packSize || p.unitSize, p.price),
    },
    {
        id: 'apollo',
        key: 'apollo',
        name: 'Apollo Pharmacy',
        logoSrc: 'https://images.apollo247.in/images/ic_logo.png',
        logoPad: 'p-1.5',
        accent: 'teal',
        size: (p) => p.unitSize,
        price: (p) => p.specialPrice || p.price,
        mrp: (p) => (p.specialPrice && p.specialPrice !== p.price ? p.price : p.mrp || null),
        discount: (p) => (p.discountPercentage ? `${p.discountPercentage}% OFF` : null),
        perUnit: (p) => p.pricePerUnit || null,
    },
    {
        id: 'pharmeasy',
        key: 'pharmEasy',
        name: 'PharmEasy',
        logoSrc: '/pharmeasy.svg',
        logoPad: 'p-1.5',
        accent: 'amber',
        size: (p) => p.measurement,
        price: (p) => p.price,
        mrp: (p) => p.mrp,
        discount: (p) => p.discount || null,
        perUnit: (p) => calculatePricePerUnit(p.measurement, p.price),
    },
    {
        id: 'truemed',
        key: 'truemed',
        name: 'TrueMeds',
        logoSrc: '/truemed.svg',
        logoPad: 'p-1.5',
        accent: 'purple',
        size: (p) => p.measurement,
        price: (p) => p.price,
        mrp: (p) => p.mrp,
        discount: (p) => (p.discount ? `${p.discount} OFF` : null),
        perUnit: (p) => calculatePricePerUnit(p.measurement, p.price),
    },
    {
        id: 'netmed',
        key: 'netmed',
        name: 'NetMeds',
        logoSrc: '/netmeds.svg',
        logoPad: 'p-1',
        accent: 'cyan',
        size: (p) => p.package,
        price: (p) => p.price,
        mrp: (p) => p.mrp,
        discount: (p) => (p.discount ? `${p.discount}% OFF` : null),
        perUnit: (p) => calculatePricePerUnit(p.package, p.price),
    },
]

const PHARMACY_MAP = Object.fromEntries(PHARMACY_CONFIGS.map((c) => [c.id, c]))

const SORT_OPTIONS = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'discount', label: 'Discount' },
    { id: 'price', label: 'Price' },
    { id: 'perUnit', label: 'Per unit' },
]

const POPULAR_SEARCHES = ['Paracetamol', 'Dolo 650', 'Azithromycin', 'Pantoprazole', 'Cetirizine']

function calculatePricePerUnit(packSize, price) {
    if (!packSize || !price) return null

    const unitCount = parseInt(packSize.match(/\d+/)?.[0])
    if (!unitCount || unitCount === 0) return null

    return (price / unitCount).toFixed(2)
}

function sortProducts(products, criteria, order = 'asc') {
    if (!products || products.length === 0) return []
    let sorted = [...products]

    switch (criteria) {
        case 'price':
            sorted.sort((a, b) => {
                const priceA = parseFloat(a.specialPrice || a.price) || 0
                const priceB = parseFloat(b.specialPrice || b.price) || 0
                return priceA - priceB
            })
            break
        case 'discount':
            sorted.sort((a, b) => {
                const discountA = parseFloat(a.discount || a.discountPercentage) || 0
                const discountB = parseFloat(b.discount || b.discountPercentage) || 0
                return discountA - discountB
            })
            break
        case 'perUnit':
            sorted.sort((a, b) => {
                const getPrice = (p) => {
                    const val = p.pricePerUnit || calculatePricePerUnit(p.packSize || p.unitSize || p.measurement || p.package, p.price)
                    if (!val) return Infinity
                    const cleanVal = String(val).replace(/[^\d.]/g, '')
                    return parseFloat(cleanVal) || Infinity
                }
                return getPrice(a) - getPrice(b)
            })
            break
        default:
            break
    }

    if (order === 'desc') {
        sorted.reverse()
    }

    return sorted
}

/* Card used inside the Compare & Saved modals */
function DetailCard({ product, source, onBuy, onRemove }) {
    const config = PHARMACY_MAP[source]
    const accent = ACCENTS[config?.accent || 'slate']
    const price = config ? config.price(product) : product.specialPrice || product.price
    const mrp = config ? config.mrp(product) : product.mrp
    const discount = config ? config.discount(product) : null
    const size = config ? config.size(product) : null
    const perUnit = config ? config.perUnit(product) : null

    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 p-5 transition-shadow duration-200 ease-out hover:shadow-lg hover:shadow-stone-200/60 dark:border-stone-800 dark:hover:shadow-black/30">
            <div className={`absolute right-0 top-0 rounded-bl-xl px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${accent.badge}`}>
                {config?.name || source}
            </div>
            <div className="mb-5 flex h-36 items-center justify-center rounded-xl bg-stone-50 p-4 dark:bg-stone-100">
                {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full object-contain mix-blend-multiply" loading="lazy" />
                ) : (
                    <div className="text-sm text-stone-300 dark:text-stone-500">No image</div>
                )}
            </div>
            <h3 className="min-h-12 break-words text-[15px] font-semibold leading-snug text-stone-900 dark:text-stone-50">{product.name}</h3>
            <dl className="mt-4 flex-1 space-y-2.5 text-sm">
                <div className="flex items-start justify-between gap-3 border-b border-stone-50 pb-2.5 dark:border-stone-800">
                    <dt className="text-stone-500 dark:text-stone-400">Price</dt>
                    <dd className="text-right">
                        <span className="font-mono text-lg font-semibold tabular-nums text-stone-900 dark:text-stone-50">₹{price}</span>
                        {mrp && <span className="ml-2 font-mono text-xs text-stone-400 line-through dark:text-stone-500">₹{mrp}</span>}
                        {discount && (
                            <span className="ml-2 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">{discount}</span>
                        )}
                    </dd>
                </div>
                <div className="flex items-center justify-between border-b border-stone-50 pb-2.5 dark:border-stone-800">
                    <dt className="text-stone-500 dark:text-stone-400">Pack size</dt>
                    <dd className="font-medium text-stone-700 dark:text-stone-300">{size || '—'}</dd>
                </div>
                {perUnit && (
                    <div className="flex items-center justify-between">
                        <dt className="text-stone-500 dark:text-stone-400">Per unit</dt>
                        <dd className="font-mono text-[13px] tabular-nums text-stone-700 dark:text-stone-300">₹{perUnit}/unit</dd>
                    </div>
                )}
            </dl>
            {onRemove ? (
                <div className="mt-5 flex gap-2">
                    <button
                        onClick={onBuy}
                        className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-emerald-700 active:scale-[0.97] dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:hover:text-stone-950"
                    >
                        Buy now
                    </button>
                    <button
                        onClick={onRemove}
                        title="Remove"
                        aria-label={`Remove ${product.name}`}
                        className="rounded-xl bg-red-50 px-3.5 text-red-600 transition-colors duration-150 ease-out hover:bg-red-100 active:scale-95 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                        <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ) : (
                <button
                    onClick={onBuy}
                    className="mt-5 w-full rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-stone-700 active:scale-[0.97] dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-300"
                >
                    Buy now
                </button>
            )}
        </div>
    )
}

function SearchPage() {
    const [message, setMessage] = useState('paracetamol')
    const [pincode, setPincode] = useState('')
    const [results, setResults] = useState(EMPTY_RESULTS)
    const [lastQuery, setLastQuery] = useState('')
    const [maxProduct, setMaxProduct] = useState(5)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    const [sortBy, setSortBy] = useState('relevance')
    const [sortOrder, setSortOrder] = useState('asc')

    const [selectedProducts, setSelectedProducts] = useState([])
    const [savedItems, setSavedItems] = useState([])
    const [showCompareModal, setShowCompareModal] = useState(false)
    const [showSavedModal, setShowSavedModal] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [extractedMedicines, setExtractedMedicines] = useState([])

    const hasResults = Object.values(results).some((arr) => arr.length > 0)
    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)

    const handleSelect = (product, source) => {
        const productWithSource = { ...product, source }
        const isSelected = selectedProducts.some((p) => p.name === product.name && p.source === source)

        if (isSelected) {
            setSelectedProducts(selectedProducts.filter((p) => !(p.name === product.name && p.source === source)))
        } else {
            if (selectedProducts.length >= 3) {
                alert('You can select up to 3 products at a time.')
                return
            }
            setSelectedProducts([...selectedProducts, productWithSource])
        }
    }

    const handleSave = () => {
        if (selectedProducts.length === 0) return

        const newItems = selectedProducts.filter(
            (p) => !savedItems.some((s) => s.name === p.name && s.source === p.source)
        )

        if (newItems.length === 0) {
            alert('Selected items are already in your saved list.')
            return
        }

        setSavedItems([...savedItems, ...newItems])
        setSelectedProducts([])
        alert(`Added ${newItems.length} items to your saved list!`)
    }

    const removeSavedItem = (product) => {
        setSavedItems(savedItems.filter((p) => !(p.name === product.name && p.source === product.source)))
    }

    const runSearch = async (query) => {
        const q = query.trim()
        if (!q) return

        setLoading(true)
        setError('')
        setHasSearched(true)
        setLastQuery(q)
        setResults(EMPTY_RESULTS)
        setSelectedProducts([])

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: q, maxProduct }),
            })

            const data = await res.json()

            if (data.success) {
                setResults({
                    oneMg: data.data.oneMg || [],
                    apollo: data.data.apollo || [],
                    pharmEasy: data.data.pharmEasy || [],
                    truemed: data.data.truemed || [],
                    netmed: data.data.netmed || [],
                })
            } else {
                setError(data.message)
                setResults({
                    oneMg: [],
                    apollo: data.data?.apollo || [],
                    pharmEasy: data.data?.pharmEasy || [],
                    truemed: data.data?.truemed || [],
                    netmed: data.data?.netmed || [],
                })
            }
        } catch (err) {
            console.error('Error:', err)
            setError('Error fetching data')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        runSearch(message)
    }

    const handlePincodeSubmit = async (e) => {
        if (e.key === 'Enter' && pincode.length === 6) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pincode`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pincode }),
                })
                const data = await res.json()
                if (data.success) {
                    alert(`Pincode ${pincode} received!`)
                }
            } catch (err) {
                console.error('Error sending pincode:', err)
            }
        }
    }

    const handleLiveLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords

            try {
                let detectedPincode = ''
                try {
                    const nominatimRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    )
                    const nominatimData = await nominatimRes.json()
                    if (nominatimData.address && nominatimData.address.postcode) {
                        detectedPincode = nominatimData.address.postcode
                        setPincode(detectedPincode)
                    }
                } catch (geoError) {
                    console.error('Error fetching pincode from coordinates:', geoError)
                }

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pincode`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lat: latitude,
                        lon: longitude,
                        pincode: detectedPincode,
                    }),
                })
                const data = await res.json()
                if (data.success) {
                    alert(
                        `Location received! ${detectedPincode ? `Pincode: ${detectedPincode}` : ''} (Lat: ${latitude}, Lon: ${longitude})`
                    )
                }
            } catch (err) {
                console.error('Error sending location:', err)
            }
        }, (geoError) => {
            console.error('Error getting location:', geoError)
            alert('Unable to retrieve your location')
        })
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/extract-medicines`, {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()

            if (data.success && data.data && data.data.length > 0) {
                setExtractedMedicines(data.data)
                setShowUploadModal(false)
            } else {
                alert('Could not extract medicine names from the image.')
            }
        } catch (err) {
            console.error('Upload error:', err)
            alert('Failed to upload image.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 dark:bg-stone-950 dark:text-stone-50 dark:selection:bg-emerald-500/20 dark:selection:text-emerald-100">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/80">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
                    <Link to="/" className="flex shrink-0 items-center gap-2.5">
                        <img src="/logo.svg" alt="MedScrapper Logo" className="h-8 w-8 object-contain" />
                        <span className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-50">MedScrapper</span>
                    </Link>

                    <div className="flex items-center gap-2.5">
                        {/* Pincode */}
                        <div className="group relative hidden sm:block">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-4 w-4 text-stone-400 transition-colors duration-150 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                onKeyDown={handlePincodeSubmit}
                                placeholder="Pincode"
                                aria-label="Pincode"
                                className="w-28 rounded-full border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-stone-700 shadow-sm outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:placeholder:text-stone-500"
                            />
                        </div>
                        <button
                            onClick={handleLiveLocation}
                            title="Use live location"
                            aria-label="Use live location"
                            className="hidden h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-[color,border-color,background-color] duration-150 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95 sm:flex dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                        >
                            <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        <ThemeToggle />

                        {/* Saved */}
                        <button
                            onClick={() => setShowSavedModal(true)}
                            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-2 pl-4 pr-2.5 text-sm font-medium text-stone-700 shadow-sm transition-[background-color,border-color,transform] duration-150 ease-out hover:bg-stone-50 active:scale-[0.97] dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                        >
                            <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Saved
                            {savedItems.length > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 font-mono text-[11px] font-semibold text-white">
                                    {savedItems.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Extracted medicines — desktop sidebar */}
            {extractedMedicines.length > 0 && (
                <aside className="fixed right-8 top-24 z-40 hidden w-80 animate-rise rounded-3xl border border-stone-200/70 bg-white/90 p-5 shadow-xl shadow-stone-200/60 backdrop-blur dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-black/30 xl:block">
                    <div className="mb-3.5 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-50">
                            <svg className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Extracted medicines
                        </h3>
                        <button
                            onClick={() => setExtractedMedicines([])}
                            aria-label="Clear extracted medicines"
                            className="rounded-full p-1.5 text-stone-400 transition-colors duration-150 hover:bg-stone-100 hover:text-red-500 active:scale-95 dark:hover:bg-stone-800"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {extractedMedicines.map((med, idx) => (
                            <button
                                key={idx}
                                onClick={() => setMessage(med)}
                                className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 transition-colors duration-150 ease-out hover:bg-emerald-100 active:scale-[0.97] dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                            >
                                {med}
                            </button>
                        ))}
                    </div>
                    <p className="mt-3.5 text-xs text-stone-400 dark:text-stone-500">Click a medicine to load it into search</p>
                </aside>
            )}

            <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 md:pt-14">
                {/* Hero + search */}
                <section className="mx-auto max-w-3xl text-center">
                    <h1 className="font-serif text-4xl tracking-tight text-stone-900 md:text-[3.4rem] md:leading-[1.1] dark:text-stone-50">
                        Find the <em className="italic text-emerald-700 dark:text-emerald-400">lowest price</em>
                    </h1>
                    <p className="mt-3 text-stone-600 dark:text-stone-400">
                        Live listings from five pharmacies, ranked however you like.
                    </p>

                    <div className="mt-8 rounded-[1.75rem] border border-stone-200/70 bg-white p-2 shadow-xl shadow-stone-200/60 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/20">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row md:items-center">
                            <div className="group relative w-full flex-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <svg className="h-[18px] w-[18px] text-stone-400 transition-colors duration-150 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Search medicines…"
                                    aria-label="Search medicines"
                                    className="h-12 w-full rounded-[1.25rem] bg-stone-50 pl-11 pr-4 text-base text-stone-900 outline-none transition-[background-color,box-shadow] duration-150 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/25 dark:bg-stone-800/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:bg-stone-800"
                                />
                            </div>

                            <div className="hidden w-px self-stretch bg-stone-100 md:mx-1 md:block dark:bg-stone-800" />

                            <div className="flex items-center gap-2">
                                <CountSelect
                                    value={maxProduct}
                                    onChange={setMaxProduct}
                                    className="w-1/2 md:w-auto"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(true)}
                                    title="Upload prescription"
                                    aria-label="Upload prescription"
                                    className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-stone-50 text-stone-600 outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500/25 active:scale-95 dark:bg-stone-800/60 dark:text-stone-300 dark:hover:bg-stone-800"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="h-12 w-1/2 flex-none rounded-2xl bg-emerald-600 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 outline-none transition-[background-color,transform,box-shadow] duration-150 ease-out hover:bg-emerald-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:shadow-emerald-500/20 dark:hover:bg-emerald-400 dark:hover:text-stone-950 md:w-auto md:min-w-[120px]"
                                >
                                    {loading ? (
                                        <svg className="mx-auto h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    ) : (
                                        'Search'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Extracted medicines — inline below search on smaller screens */}
                    {extractedMedicines.length > 0 && (
                        <div className="mt-5 animate-rise rounded-3xl border border-stone-200/70 bg-white p-5 text-left shadow-sm dark:border-stone-800 dark:bg-stone-900 xl:hidden">
                            <div className="mb-3.5 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-50">
                                    <svg className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Extracted medicines
                                </h3>
                                <button
                                    onClick={() => setExtractedMedicines([])}
                                    aria-label="Clear extracted medicines"
                                    className="rounded-full p-1.5 text-stone-400 transition-colors duration-150 hover:bg-stone-100 hover:text-red-500 active:scale-95 dark:hover:bg-stone-800"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {extractedMedicines.map((med, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMessage(med)}
                                        className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 transition-colors duration-150 ease-out hover:bg-emerald-100 active:scale-[0.97] dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                                    >
                                        {med}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-3 text-xs text-stone-400 dark:text-stone-500">Click a medicine to load it into search</p>
                        </div>
                    )}
                </section>

                {/* Error */}
                {error && (
                    <div className="mx-auto mt-8 max-w-3xl animate-rise">
                        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Loading skeletons */}
                {loading && !hasResults && (
                    <div className="mt-12 flex gap-6 overflow-hidden" aria-hidden>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-96 w-[85vw] flex-shrink-0 animate-pulse rounded-3xl border border-stone-200/70 bg-white md:w-[440px] dark:border-stone-800 dark:bg-stone-900"
                                style={{ animationDelay: `${i * 120}ms` }}
                            >
                                <div className="h-16 border-b border-stone-100 bg-stone-50 dark:border-stone-800 dark:bg-stone-800/40" />
                                <div className="space-y-5 p-6">
                                    {[0, 1, 2, 3].map((j) => (
                                        <div key={j} className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-xl bg-stone-100 dark:bg-stone-800" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3.5 w-3/4 rounded-full bg-stone-100 dark:bg-stone-800" />
                                                <div className="h-3 w-1/3 rounded-full bg-stone-100 dark:bg-stone-800" />
                                            </div>
                                            <div className="h-3.5 w-12 rounded-full bg-stone-100 dark:bg-stone-800" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state before first search */}
                {!hasSearched && !loading && (
                    <section className="mx-auto mt-14 max-w-3xl animate-rise">
                        <div className="rounded-3xl border border-dashed border-stone-300/80 bg-white/60 px-6 py-14 text-center dark:border-stone-700 dark:bg-stone-900/40">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="mt-5 text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-50">
                                Search any medicine to see live prices
                            </h2>
                            <p className="mx-auto mt-1.5 max-w-sm text-sm text-stone-500 dark:text-stone-400">
                                Or try one of the common searches below to see how it works.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {POPULAR_SEARCHES.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => {
                                            setMessage(term)
                                            runSearch(term)
                                        }}
                                        className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-[background-color,border-color,transform] duration-150 ease-out hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 active:scale-[0.97] dark:border-stone-700/80 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Results */}
                {hasResults && !loading && (
                    <>
                        {/* Results summary + sort */}
                        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm text-stone-500 dark:text-stone-400">
                                <span className="font-mono font-medium tabular-nums text-stone-900 dark:text-stone-100">{totalResults}</span>{' '}
                                listings for <span className="font-medium text-stone-900 dark:text-stone-100">“{lastQuery}”</span>
                            </p>

                            <div className="flex items-center gap-2">
                                <div className="flex rounded-full bg-stone-100/90 p-1 dark:bg-stone-800/70">
                                    {SORT_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setSortBy(option.id)
                                                if (option.id === 'relevance') setSortOrder('asc')
                                            }}
                                            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] ${
                                                sortBy === option.id
                                                    ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-950 dark:text-stone-100'
                                                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                {sortBy !== 'relevance' && (
                                    <button
                                        onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                                        title={sortOrder === 'asc' ? 'Ascending — click for descending' : 'Descending — click for ascending'}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-[color,transform,background-color] duration-150 ease-out hover:bg-stone-50 hover:text-stone-800 active:scale-95 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                                    >
                                        <svg
                                            className={`h-4 w-4 transition-transform duration-200 ease-out ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Pharmacy rails */}
                        <div className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 scrollbar-hide">
                            {PHARMACY_CONFIGS.map((config) => {
                                const products = results[config.key]
                                if (!products || products.length === 0) return null
                                return (
                                    <div key={config.id} className="animate-rise">
                                        <PharmacyCard
                                            config={config}
                                            products={sortProducts(products, sortBy, sortOrder)}
                                            selectedProducts={selectedProducts}
                                            onSelect={handleSelect}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <p className="mt-1 text-center text-xs text-stone-400 md:hidden dark:text-stone-500">Swipe to see more pharmacies →</p>
                    </>
                )}
            </main>

            {/* Floating selection bar */}
            {selectedProducts.length > 0 && (
                <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-rise">
                    <div className="flex items-center gap-1.5 rounded-full bg-stone-900 py-2 pl-5 pr-2 shadow-2xl shadow-stone-900/30 dark:border dark:border-stone-700 dark:bg-stone-800 dark:shadow-black/50">
                        <span className="whitespace-nowrap text-sm font-medium text-white">
                            <span className="font-mono tabular-nums">{selectedProducts.length}</span> selected
                        </span>
                        <div className="mx-1.5 h-5 w-px bg-white/20" />
                        <button
                            onClick={handleSave}
                            className="rounded-full px-3.5 py-2 text-sm font-medium text-stone-300 transition-colors duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-95 dark:text-stone-300"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setShowCompareModal(true)}
                            disabled={selectedProducts.length < 2}
                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition-[background-color,transform] duration-150 ease-out hover:bg-stone-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Compare
                        </button>
                    </div>
                </div>
            )}

            {/* Compare modal */}
            <Modal open={showCompareModal} onClose={() => setShowCompareModal(false)} title="Compare medicines" maxWidth="max-w-5xl">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {selectedProducts.map((product, idx) => (
                        <DetailCard
                            key={idx}
                            product={product}
                            source={product.source}
                            onBuy={() => window.open(product.url)}
                        />
                    ))}
                </div>
            </Modal>

            {/* Saved modal */}
            <Modal open={showSavedModal} onClose={() => setShowSavedModal(false)} title={`Saved medicines (${savedItems.length})`} maxWidth="max-w-5xl">
                {savedItems.length === 0 ? (
                    <div className="py-12 text-center">
                        <svg className="mx-auto mb-4 h-12 w-12 text-stone-300 dark:text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <p className="font-medium text-stone-600 dark:text-stone-300">No saved items yet</p>
                        <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">Select medicines from results and press Save.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {savedItems.map((product, idx) => (
                            <DetailCard
                                key={idx}
                                product={product}
                                source={product.source}
                                onBuy={() => window.open(product.url)}
                                onRemove={() => removeSavedItem(product)}
                            />
                        ))}
                    </div>
                )}
            </Modal>

            {/* Upload modal */}
            <Modal open={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload prescription" maxWidth="max-w-md">
                {uploading ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                        <svg className="h-9 w-9 animate-spin text-emerald-600 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-sm font-medium text-stone-600 dark:text-stone-300">Extracting medicines…</p>
                    </div>
                ) : (
                    <>
                        <div className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 transition-colors duration-150 ease-out hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-stone-700 dark:bg-stone-800/40 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/5">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                aria-label="Upload prescription image"
                            />
                            <svg className="h-8 w-8 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Click to upload an image</p>
                        </div>
                        <p className="mt-3 text-center text-xs text-stone-400 dark:text-stone-500">Supported formats: JPG, PNG</p>
                    </>
                )}
            </Modal>
        </div>
    )
}

export default SearchPage
