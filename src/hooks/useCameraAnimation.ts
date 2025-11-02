import { useEffect, useRef } from 'react'

interface UseCameraAnimationProps {
  isLoaderVisible: boolean
  controlsRef: React.RefObject<any>
  cameraPositionRef: React.MutableRefObject<{ x: number; y: number; z: number }>
}

export function useCameraAnimation({ 
  isLoaderVisible, 
  controlsRef, 
  cameraPositionRef 
}: UseCameraAnimationProps) {
  useEffect(() => {
    if (!isLoaderVisible && controlsRef.current) {
      // Import gsap dynamically
      import('gsap').then(gsap => {
        gsap.default.to(cameraPositionRef.current, {
          x: 10,
          y: 20,
          z: 20,
          duration: 1.5,
          delay: 0.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            // Force OrbitControls to update target
            if (controlsRef.current) {
              controlsRef.current.target.set(0, 0, 0)
              controlsRef.current.update()
            }
          },
        })
      })
    }
  }, [isLoaderVisible, controlsRef, cameraPositionRef])
}
