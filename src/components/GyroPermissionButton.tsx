import { useState } from 'react'

interface GyroPermissionButtonProps {
  onPermissionGranted: () => void
  isMobile: boolean
}

export function GyroPermissionButton({ onPermissionGranted, isMobile }: GyroPermissionButtonProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isMobile || isDismissed) {
    return null
  }

  const requestPermission = async () => {
    setIsRequesting(true)
    
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          onPermissionGranted()
          setIsDismissed(true)
        } else {
          console.warn('Gyroscope permission denied')
          setIsDismissed(true)
        }
      } else {
        // Non-iOS devices don't need permission
        onPermissionGranted()
        setIsDismissed(true)
      }
    } catch (error) {
      console.error('Error requesting gyroscope permission:', error)
      setIsDismissed(true)
    } finally {
      setIsRequesting(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <svg 
              className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Enable Gyroscope?
              </h3>
              <p className="text-sm text-gray-600">
                Tilt your device to explore the scene in 3D
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isRequesting}
            >
              Skip
            </button>
            <button
              onClick={requestPermission}
              disabled={isRequesting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              {isRequesting ? 'Requesting...' : 'Enable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
