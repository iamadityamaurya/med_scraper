import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-reveal wrapper: fades + rises content the first time it enters the viewport.
 * - Fires once per element (IntersectionObserver, disconnected after reveal)
 * - Triggers when the element is ~12% above the bottom edge of the viewport
 * - Stagger siblings with `delay` (ms); keep steps short (60-100ms)
 * - Respects prefers-reduced-motion (shows instantly, no movement)
 */
export default function Reveal({ children, delay = 0, className = '', as = 'div' }) {
    const Tag = as
    const ref = useRef(null)
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return undefined

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setShown(true)
            return undefined
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '0px 0px -12% 0px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <Tag
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`${className} transition-[opacity,transform] duration-700 ease-out-expo ${
                shown ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
        >
            {children}
        </Tag>
    )
}
