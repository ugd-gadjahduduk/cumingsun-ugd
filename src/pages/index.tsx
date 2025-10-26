'use client'

import { Suspense, useEffect, useState } from 'react'
import Head from 'next/head'
import { Scene } from '@/components/Scene'
import { Overlay } from '@/components/Overlay'
import { Loader } from '@/components/Loader'

export default function Home() {
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const MIN_DISPLAY_MS = 1600 
    const t = setTimeout(() => setVisible(false), MIN_DISPLAY_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Head>
        <title>UGD - Coming Soon✨</title>
      </Head>
      
      <div className="relative w-full h-full">
        {mounted && (
          <Loader
            heading="UGD"
            visible={visible}
            onFinished={() => setMounted(false)}
          />
        )}

        <Suspense fallback={null}>
          <Scene isLoaderVisible={visible} />
          <Overlay />
        </Suspense>
      </div>
    </>
  )
}
