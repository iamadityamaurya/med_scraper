import { ACCENTS } from './accents.js'

/**
 * One pharmacy's results as a card with a data table.
 * `config` carries the per-source field accessors and accent.
 */
export default function PharmacyCard({ config, products, selectedProducts, onSelect }) {
    const accent = ACCENTS[config.accent]

    return (
        <article className="flex h-full min-w-[85vw] flex-shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-xl shadow-stone-200/50 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/20 md:min-w-[440px] lg:min-w-[500px]">
            {/* Card header */}
            <header className="flex items-center justify-between border-b border-stone-100 bg-stone-50/60 px-5 py-4 dark:border-stone-800 dark:bg-stone-800/40">
                <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-14 items-center justify-center rounded-lg bg-white p-1 dark:bg-stone-100 ${config.logoPad || 'p-2'}`}>
                        <img src={config.logoSrc} alt={config.name} className="h-full w-full object-contain" loading="lazy" />
                    </div>
                    <h2 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">{config.name}</h2>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 font-mono text-[11px] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                    {products.length} results
                </span>
            </header>

            {/* Results table */}
            <div className="flex-1">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-stone-100 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400 dark:border-stone-800 dark:text-stone-500">
                            <th className="w-12 py-3 pl-5 sm:pl-6">
                                <span className="sr-only">Select</span>
                            </th>
                            <th className="py-3 pr-4">Medicine</th>
                            <th className="py-3 pr-4 text-right">Price</th>
                            <th className="w-14 py-3 pr-4 text-right">
                                <span className="sr-only">Open</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, idx) => {
                            const price = config.price(product)
                            const mrp = config.mrp(product)
                            const discount = config.discount(product)
                            const perUnit = config.perUnit(product)
                            const size = config.size(product)
                            const isSelected = selectedProducts.some(
                                (p) => p.name === product.name && p.source === config.id
                            )

                            return (
                                <tr
                                    key={idx}
                                    className="group border-t border-stone-50 transition-colors duration-150 first:border-t-0 hover:bg-stone-50/80 dark:border-stone-800/60 dark:hover:bg-stone-800/40"
                                >
                                    <td className="py-4 pl-5 align-top sm:pl-6">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onSelect(product, config.id)}
                                            aria-label={`Select ${product.name}`}
                                            className={`h-[18px] w-[18px] cursor-pointer rounded border-stone-300 ${accent.checkbox}`}
                                        />
                                    </td>
                                    <td className="py-4 pr-4">
                                        <div className="flex items-start gap-3.5">
                                            {product.image ? (
                                                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-white p-1 dark:border-stone-700/60 dark:bg-stone-100">
                                                    <img src={product.image} alt="" className="h-full w-full object-contain" loading="lazy" />
                                                </div>
                                            ) : (
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className={`break-words text-sm font-medium leading-snug text-stone-900 transition-colors duration-150 dark:text-stone-100 ${accent.nameHover}`}>
                                                    {product.name}
                                                </div>
                                                <div className="mt-0.5 text-[13px] text-stone-500 dark:text-stone-400">{size || '—'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-right align-top">
                                        <div className="flex flex-col items-end">
                                            <span className="font-mono text-[15px] font-semibold tabular-nums tracking-tight text-stone-900 dark:text-stone-50">
                                                ₹{price}
                                            </span>
                                            {mrp && (
                                                <span className="mt-0.5 font-mono text-xs tabular-nums text-stone-400 line-through dark:text-stone-500">
                                                    ₹{mrp}
                                                </span>
                                            )}
                                            {discount && (
                                                <span className="mt-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    {discount}
                                                </span>
                                            )}
                                            {perUnit && (
                                                <span className="mt-1 font-mono text-[11px] tabular-nums text-stone-400 dark:text-stone-500">
                                                    ₹{perUnit}/unit
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-right align-top">
                                        <button
                                            onClick={() => product.url && window.open(product.url)}
                                            disabled={!product.url}
                                            title={`View on ${config.name}`}
                                            className={`rounded-lg p-2 transition-colors duration-150 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${accent.link}`}
                                        >
                                            <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </article>
    )
}
