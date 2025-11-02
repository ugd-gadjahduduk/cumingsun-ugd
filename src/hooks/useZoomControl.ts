import { useEffect, useRef } from 'react'
import type { DeviceState } from '@/types'

interface UseZoomControlReturn {
  targetZoom: React.MutableRefObject<number>
  currentZoom: React.MutableRefObject<number>
  initialZoom: number
}

export function useZoomControl(deviceState: DeviceState): UseZoomControlReturn {
  const targetZoom = useRef(40)
  const currentZoom = useRef(40)

  // Set zoom based on device
  useEffect(() => {
    if (deviceState.isMobile) {
      targetZoom.current = 25
      currentZoom.current = 25
    } else if (deviceState.isTablet) {
      targetZoom.current = 35
      currentZoom.current = 35
    } else {
      targetZoom.current = 40
      currentZoom.current = 40
    }
  }, [deviceState.isMobile, deviceState.isTablet])

  // Smooth zoom with mouse wheel (desktop only)
  useEffect(() => {
    if (!deviceState.isDesktop) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      const zoomSpeed = 0.5
      const minZoom = 25
      const maxZoom = 80

      targetZoom.current -= event.deltaY * zoomSpeed * 0.01
      targetZoom.current = Math.max(minZoom, Math.min(maxZoom, targetZoom.current))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [deviceState.isDesktop])

  const initialZoom = deviceState.isMobile ? 25 : deviceState.isTablet ? 35 : 40

  return { targetZoom, currentZoom, initialZoom }
}
