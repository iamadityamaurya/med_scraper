import { useEffect, useRef, useState } from 'react'

const OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

const label = (n) => `${n} ${n === 1 ? 'result' : 'results'}`

/**
 * Custom dropdown for "results per pharmacy" — replaces the native <select>
 * so the open menu matches the design system instead of the OS default.
 * Keyboard: Enter/Space/Arrow opens, ArrowUp/Down highlights, Enter picks, Esc closes.
 */
export default function CountSelect({ value, onChange, className = '' }) {
    const [open, setOpen] = useState(false)
    const [highlighted, setHighlighted] = useState(value - 1)
    const rootRef = useRef(null)
    const buttonRef = useRef(null)

    // Close when clicking anywhere outside
    useEffect(() => {
        if (!open) return undefined
        const onPointerDown = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [open])

    const pick = (n) => {
        onChange(n)
        setOpen(false)
        buttonRef.current?.focus()
    }

    const onKeyDown = (e) => {
        if (!open) {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
                e.preventDefault()
                setHighlighted(value - 1)
                setOpen(true)
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setHighlighted((h) => Math.min(h + 1, OPTIONS.length - 1))
                break
            case 'ArrowUp':
                e.preventDefault()
                setHighlighted((h) => Math.max(h - 1, 0))
                break
            case 'Enter':
                e.preventDefault()
                pick(OPTIONS[highlighted])
                break
            case 'Escape':
                e.preventDefault()
                setOpen(false)
                buttonRef.current?.focus()
                break
            case 'Tab':
                setOpen(false)
                break
            default:
                break
        }
    }

    return (
        <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => {
                    setHighlighted(value - 1)
                    setOpen((o) => !o)
                }}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Results per pharmacy"
                className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl bg-stone-50 pl-4 pr-3 text-sm font-medium text-stone-700 outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-emerald-500/25 aria-expanded:bg-white aria-expanded:ring-2 aria-expanded:ring-emerald-500/25 dark:bg-stone-800/60 dark:text-stone-200 dark:hover:bg-stone-800 dark:aria-expanded:bg-stone-900"
            >
                {label(value)}
                <svg
                    className={`h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-label="Results per pharmacy"
                    className="absolute left-0 top-full z-20 mt-2 w-max min-w-full origin-top animate-pop-in list-none rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-xl shadow-stone-900/10 dark:border-stone-700/80 dark:bg-stone-900 dark:shadow-black/40"
                >
                    {OPTIONS.map((n, idx) => {
                        const selected = n === value
                        const active = idx === highlighted
                        return (
                            <li key={n}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    onMouseEnter={() => setHighlighted(idx)}
                                    onClick={() => pick(n)}
                                    className={`flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-3 py-1.5 text-left text-sm transition-colors duration-100 ${
                                        active ? 'bg-stone-100 dark:bg-stone-800' : ''
                                    } ${selected ? 'font-semibold text-emerald-700 dark:text-emerald-400' : active ? 'text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}
                                >
                                    <span className="w-5 text-right font-mono tabular-nums">{n}</span>
                                    <span>{n === 1 ? 'result' : 'results'}</span>
                                    {selected && (
                                        <svg className="ml-auto h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
