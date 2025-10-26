'use client'

import React, { useRef, useEffect, ReactNode, HTMLAttributes } from 'react'
import gsap from 'gsap'

type MagneticElementProps = {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
  duration?: number
  ease?: string
  resetEase?: string
  resetDuration?: number
  hoverScale?: number
} & HTMLAttributes<HTMLDivElement>

export function MagneticElement({
  children,
  className = '',
  strength = 0.35,
  radius = 120,
  duration = 0.8,
  ease = 'elastic.out(1, 0.3)',
  resetEase = 'elastic.out(1, 0.3)',
  resetDuration = 0.8,
  hoverScale = 1.02,
  ...rest
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // GPU-accelerated transform
    el.style.willChange = 'transform'

    const xTo = gsap.quickTo(el, 'x', { duration, ease, overwrite: 'auto' })
    const yTo = gsap.quickTo(el, 'y', { duration, ease, overwrite: 'auto' })
    const scaleTo = gsap.quickTo(el, 'scale', {
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    const falloff = (d: number, r: number) => {
      if (d >= r) return 0
      const t = 1 - d / r 
      return t * t 
    }

    const onMove = (e: PointerEvent | MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const d = Math.hypot(dx, dy)

      const k = falloff(d, radius)
      const tx = dx * strength * k
      const ty = dy * strength * k

      xTo(tx)
      yTo(ty)

      scaleTo(k > 0 ? hoverScale : 1)
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: resetDuration, ease: resetEase, overwrite: 'auto' })
      scaleTo(1)
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove as any)
      gsap.set(el, { x: 0, y: 0, scale: 1 })
    }
  }, [strength, radius, duration, ease, resetEase, resetDuration, hoverScale])

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  )
}
