import { useEffect } from 'react'

/**
 * Shared modal shell: backdrop blur, centered card, Esc + backdrop close.
 * Modals keep a center transform-origin — they are viewport-anchored.
 */
export default function Modal({ open, onClose, title, maxWidth = 'max-w-2xl', children }) {
    useEffect(() => {
        if (!open) return undefined
        const onKey = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className="absolute inset-0 animate-fade-in bg-stone-950/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`relative flex max-h-[88vh] w-full ${maxWidth} animate-scale-in flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900`}
            >
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5 dark:border-stone-800">
                    <h2 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-50">{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full p-2 text-stone-400 transition-colors duration-150 ease-out hover:bg-stone-100 hover:text-stone-700 active:scale-95 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    )
}
