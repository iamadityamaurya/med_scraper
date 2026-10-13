import { useEffect, useState } from 'react'

/**
 * Light/dark toggle. The initial class on <html> is set by an inline script
 * in index.html (before first paint), so this component just keeps it in sync
 * and persists the choice to localStorage.
 */
export default function ThemeToggle({ className = '' }) {
    const [theme, setTheme] = useState(() =>
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    )

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        try {
            localStorage.setItem('theme', theme)
        } catch {
            /* ignore private-mode failures */
        }
    }, [theme])

    return (
        <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-[color,border-color,background-color] duration-150 ease-out hover:border-stone-300 hover:text-stone-800 active:scale-95 dark:border-stone-700/80 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:text-stone-200 ${className}`}
        >
            <span className="relative block h-[18px] w-[18px]">
                {/* Moon (visible in light mode — click goes dark) */}
                <svg
                    className={`absolute inset-0 h-full w-full transition-transform duration-200 ease-out ${theme === 'dark' ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                {/* Sun (visible in dark mode — click goes light) */}
                <svg
                    className={`absolute inset-0 h-full w-full transition-transform duration-200 ease-out ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
                    <path strokeLinecap="round" strokeWidth="1.8" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
            </span>
        </button>
    )
}
