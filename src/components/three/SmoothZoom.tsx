import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

interface SmoothZoomProps {
  controlsRef: React.RefObject<any>
  targetZoom: React.MutableRefObject<number>
  currentZoom: React.MutableRefObject<number>
  cameraPositionRef: React.MutableRefObject<{ x: number; y: number; z: number }>
  lerpFactor?: number
}

export function SmoothZoom({
  controlsRef,
  targetZoom,
  currentZoom,
  cameraPositionRef,
  lerpFactor = 0.05
}: SmoothZoomProps) {
  const prevPosition = useRef({ x: 1, y: 20, z: 50 })

  useFrame(() => {
    if (!controlsRef.current) return

    // Smooth zoom interpolation
    currentZoom.current += (targetZoom.current - currentZoom.current) * lerpFactor

    // Update camera zoom
    if (controlsRef.current.object) {
      controlsRef.current.object.zoom = currentZoom.current

      // Only update position if it changed (GSAP animation active)
      if (
        prevPosition.current.x !== cameraPositionRef.current.x ||
        prevPosition.current.y !== cameraPositionRef.current.y ||
        prevPosition.current.z !== cameraPositionRef.current.z
      ) {
        controlsRef.current.object.position.set(
          cameraPositionRef.current.x,
          cameraPositionRef.current.y,
          cameraPositionRef.current.z
        )
        prevPosition.current = { ...cameraPositionRef.current }
      }

      controlsRef.current.object.updateProjectionMatrix()
      controlsRef.current.update()
    }
  })

  return null
}
