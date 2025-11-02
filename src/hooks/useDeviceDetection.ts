import { useState, useEffect } from 'react'
import type { DeviceState } from '@/types'

interface UseDeviceDetectionReturn {
  deviceState: DeviceState
  gyroSupported: boolean
  gyroEnabled: boolean
}

export function useDeviceDetection(): UseDeviceDetectionReturn {
  const [deviceState, setDeviceState] = useState<DeviceState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })
  const [gyroSupported, setGyroSupported] = useState(false)
  const [gyroEnabled, setGyroEnabled] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isMobile = width <= 768
      const isTablet = width > 768 && width <= 1024
      const isDesktop = width > 1024

      setDeviceState({ isMobile, isTablet, isDesktop })

      // Check if gyroscope is supported
      const supportsGyro = 'DeviceOrientationEvent' in window
      setGyroSupported(supportsGyro)

      // Enable gyroscope only on mobile/tablet with support
      if ((isMobile || isTablet) && supportsGyro) {
        setGyroEnabled(true)
      } else {
        setGyroEnabled(false)
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { deviceState, gyroSupported, gyroEnabled }
}
