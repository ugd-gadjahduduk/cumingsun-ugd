'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'

interface LoaderProps {
  contentRef?: RefObject<HTMLElement>
  heading?: string
  /** kontrol tampil/tidaknya loader dari parent */
  visible: boolean
  /** dipanggil setelah animasi keluar selesai, aman untuk unmount */
  onFinished?: () => void
}

export function Loader({ contentRef, heading = 'UGD', visible, onFinished }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const svgPathRef = useRef<SVGPathElement>(null)

  // keep references to intro/outro timelines
  const introTl = useRef<gsap.core.Timeline | null>(null)
  const outroTl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!loaderRef.current || !headingRef.current || !svgPathRef.current) return

    const curvePath = 'M0 502S175 272 500 272s500 230 500 230V0H0Z'
    const flatPath = 'M0 2S175 1 500 1s500 1 500 1V0H0Z'

    // INIT state (tanpa langsung animasi keluar)
    document.body.style.overflow = 'hidden'
    gsap.set(loaderRef.current, { yPercent: 0, clearProps: 'display' })
    gsap.set(headingRef.current, { y: 200, skewY: 20 })
    gsap.set(svgPathRef.current, { attr: { d: 'M0,1005S175,995,500,995s500,5,500,5V0H0Z' } })

    // INTRO timeline (masuk)
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } }).to(headingRef.current, {
      delay: 0.2,
      y: 0,
      skewY: 0,
      duration: 0.8,
      ease: 'power3.out',
    })

    // optionally reveal main content a bit later (tanpa unmount loader)
    if (contentRef?.current) {
      tl.from(contentRef.current, { y: 80, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
    }

    introTl.current = tl

    return () => {
      tl.kill()
      outroTl.current?.kill()
      document.body.style.overflow = 'visible'
    }
  }, [contentRef])

  // OUTRO saat visible berubah jadi false
  useEffect(() => {
    if (!loaderRef.current || !headingRef.current || !svgPathRef.current) return
    if (visible) return // tunggu sampai visible=false

    // cegah double-play
    if (outroTl.current) return

    const curvePath = 'M0 502S175 272 500 272s500 230 500 230V0H0Z'
    const flatPath = 'M0 2S175 1 500 1s500 1 500 1V0H0Z'

    const out = gsap
      .timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          document.body.style.overflow = 'visible'
          onFinished?.()
        },
      })
      .to(headingRef.current, {
        delay: 0.2,
        y: -200,
        skewY: 20,
        duration: 0.6,
        ease: 'power3.in',
      })
      .to(svgPathRef.current, {
        duration: 0.6,
        attr: { d: curvePath },
        ease: 'power2.in',
      })
      .to(svgPathRef.current, {
        duration: 0.6,
        attr: { d: flatPath },
        ease: 'power2.out',
      })
      .to(loaderRef.current, {
        y: -1500,
        duration: 0.9,
        ease: 'power4.in',
      })
      .set(loaderRef.current, { display: 'none', zIndex: -1 })

    outroTl.current = out
  }, [visible, onFinished])

  return (
    <div
      ref={loaderRef}
      className="loader-wrap fixed inset-0 z-[60] pointer-events-none"
    >
      <svg
        className="loader-svg absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path ref={svgPathRef} d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"></path>
      </svg>

      <div className="loader-heading absolute inset-0 flex items-center justify-center">
        <span className="loader-heading-inner inline-block overflow-hidden">
          <h1 ref={headingRef} className="text-6xl font-extrabold tracking-tight font-manrope">
            {heading}
          </h1>
        </span>
      </div>
    </div>
  )
}
