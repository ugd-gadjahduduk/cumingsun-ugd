'use client'

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer } from '@react-three/drei'
import type { MaterialConfig } from '@/types'
import { GyroscopeControls } from './three/GyroscopeControls'
import { SmoothZoom } from './three/SmoothZoom'
import { Text3DGlass } from './three/Text3DGlass'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { useZoomControl } from '@/hooks/useZoomControl'
import { useCursorInteraction } from '@/hooks/useCursorInteraction'
import { useCameraAnimation } from '@/hooks/useCameraAnimation'

// Material configuration
const materialConfig: MaterialConfig = {
  backside: true,
  backsideThickness: 0.15,
  samples: 8,
  resolution: 512,
  transmission: 1,
  clearcoat: 1,
  clearcoatRoughness: 0.0,
  thickness: 0.3,
  chromaticAberration: 0.15,
  anisotropy: 0.25,
  roughness: 0,
  distortion: 0.5,
  distortionScale: 0.1,
  temporalDistortion: 0,
  ior: 1.25,
  color: 'white',
}

export function Scene({ isLoaderVisible = true }: { isLoaderVisible?: boolean }) {
  // Hooks
  const { deviceState, gyroEnabled } = useDeviceDetection()
  const { targetZoom, currentZoom, initialZoom } = useZoomControl(deviceState)
  
  // Refs
  const controlsRef = useRef<any>()
  const cameraPositionRef = useRef({ x: 1, y: 20, z: 50 })

  // Custom hooks for interactions
  useCameraAnimation({ isLoaderVisible, controlsRef, cameraPositionRef })
  // Cursor interaction for all devices (desktop gets grab cursor, mobile/tablet still interactive)
  useCursorInteraction(deviceState.isDesktop)

  // Constants
  const text = 'Coming Soon'
  const contactShadowColor = '#0d0d10'
  const autoRotate = false

  // OrbitControls always enabled for manual drag
  // Works alongside gyroscope on mobile/tablet
  const orbitControlsEnabled = true

  return (
    <Canvas
      shadows
      orthographic
      camera={{ position: [1, 20, 50], zoom: initialZoom }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      {/* Smooth Zoom Controller */}
      <SmoothZoom
        controlsRef={controlsRef}
        targetZoom={targetZoom}
        currentZoom={currentZoom}
        cameraPositionRef={cameraPositionRef}
      />

      {/* Gyroscope controls for mobile/tablet */}
      {gyroEnabled && (
        <GyroscopeControls 
          enabled={gyroEnabled} 
          controlsRef={controlsRef}
        />
      )}

      {/* Background */}
      <color attach="background" args={['#f2f2f5']} />

      {/* 3D Glass Text */}
      <Text3DGlass 
        config={materialConfig} 
        deviceState={deviceState} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 2.25]}
      >
        {text}
      </Text3DGlass>

      <directionalLight
        castShadow
        position={[12, 18, 12]}
        intensity={1.25}
        shadow-mapSize-width={deviceState.isMobile ? 512 : 1024}
        shadow-mapSize-height={deviceState.isMobile ? 512 : 1024}
        shadow-camera-near={5}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={18}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      <ambientLight intensity={0.3} />

      {/* Orbit Controls - only enabled on desktop */}
      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={-0.1}
        enableZoom={false}
        enableDamping={true}
        dampingFactor={0.02}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
        screenSpacePanning={false}
        enabled={orbitControlsEnabled}
      />

      <Environment resolution={ deviceState.isMobile ? 64 : deviceState.isTablet ? 128 : 256 }>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer
            intensity={20}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={[20, 2, 1]}
          />
          <Lightformer
            type="ring"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-0.1, -1, -5]}
            scale={10}
          />
        </group>
      </Environment>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.35} color={contactShadowColor} />
      </mesh>
    </Canvas>
  )
}
