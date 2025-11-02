import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GyroscopeControlsProps {
  enabled: boolean
  controlsRef: React.RefObject<any>
}

export function GyroscopeControls({ enabled, controlsRef }: GyroscopeControlsProps) {
  const { camera } = useThree()
  const alphaRef = useRef(0)
  const betaRef = useRef(0)
  const gammaRef = useRef(0)
  const initialAlpha = useRef<number | null>(null)
  const initialBeta = useRef<number | null>(null)
  const initialGamma = useRef<number | null>(null)
  
  // Store initial camera position (same as desktop)
  const basePosition = useRef(new THREE.Vector3(10, 20, 20))
  const baseRotation = useRef({ azimuth: 0, polar: 0 })

  useEffect(() => {
    if (!enabled) return

    // Calculate initial spherical coords from desktop camera position
    const radius = basePosition.current.length()
    const initialPolar = Math.acos(basePosition.current.y / radius)
    const initialAzimuth = Math.atan2(basePosition.current.x, basePosition.current.z)
    
    baseRotation.current = {
      azimuth: initialAzimuth,
      polar: initialPolar
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        // Set initial orientation on first reading
        if (initialAlpha.current === null) {
          initialAlpha.current = event.alpha
          initialBeta.current = event.beta
          initialGamma.current = event.gamma
        }

        alphaRef.current = event.alpha
        betaRef.current = event.beta
        gammaRef.current = event.gamma
      }
    }

    // Start listening to device orientation
    // Permission should already be granted via the button
    window.addEventListener('deviceorientation', handleOrientation, true)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [enabled])

  useFrame(() => {
    if (!enabled || !controlsRef.current || initialGamma.current === null) return

    // Calculate delta from initial device orientation
    const deltaGamma = (gammaRef.current - initialGamma.current!) * (Math.PI / 180)

    // Get current camera position from OrbitControls
    const currentRadius = camera.position.length()
    const currentPolar = Math.acos(camera.position.y / currentRadius)
    const currentAzimuth = Math.atan2(camera.position.x, camera.position.z)

    // Apply gyroscope delta to current position (additive, not replacement)
    // This allows manual drag (OrbitControls) and gyroscope to work together
    const azimuth = currentAzimuth - deltaGamma * 0.02 // Lower sensitivity for smoother blend
    const polar = currentPolar // Keep current vertical angle from OrbitControls

    const target = new THREE.Vector3(0, 0, 0)

    // Convert spherical to cartesian coordinates
    const x = currentRadius * Math.sin(polar) * Math.sin(azimuth)
    const y = currentRadius * Math.cos(polar)
    const z = currentRadius * Math.sin(polar) * Math.cos(azimuth)

    // Gentle lerp to avoid fighting with OrbitControls
    const lerpFactor = 0.05
    camera.position.x += (x - camera.position.x) * lerpFactor
    camera.position.y += (y - camera.position.y) * lerpFactor
    camera.position.z += (z - camera.position.z) * lerpFactor

    // Always look at the target (center)
    camera.lookAt(target)

    // Update controls target
    if (controlsRef.current.target) {
      controlsRef.current.target.copy(target)
      controlsRef.current.update()
    }
  })

  return null
}
