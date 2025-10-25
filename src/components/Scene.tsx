'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Lightformer,
  Center,
  Text3D,
  Instances,
  Instance
} from '@react-three/drei'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { RGBELoader } from 'three-stdlib'
import type { MaterialConfig, DeviceState } from '@/types'

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
  color: 'white'
}

// Smooth zoom component
function SmoothZoom({
  controlsRef,
  targetZoom,
  currentZoom
}: {
  controlsRef: React.RefObject<any>
  targetZoom: React.MutableRefObject<number>
  currentZoom: React.MutableRefObject<number>
}) {
  useFrame(() => {
    if (!controlsRef.current) return

    // Smooth zoom interpolation
    const lerpFactor = 0.05
    currentZoom.current += (targetZoom.current - currentZoom.current) * lerpFactor

    // Update camera zoom
    if (controlsRef.current.object) {
      controlsRef.current.object.zoom = currentZoom.current
      controlsRef.current.object.updateProjectionMatrix()
    }
  })

  return null
}

// Grid component
const Grid = ({
  number = 15,
  lineWidth = 0.026,
  height = 0.5
}: {
  number?: number
  lineWidth?: number
  height?: number
}) => (
  <Instances position={[0, -1.02, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#999" />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group
          key={`${x}:${y}`}
          position={[
            x * 2 - Math.floor(number / 2) * 2,
            -0.01,
            y * 2 - Math.floor(number / 2) * 2
          ]}
        >
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      ))
    )}
    <gridHelper args={[100, 50, '#bbb', '#bbb']} position={[0, -0.01, 0]} />
  </Instances>
)

// Text component
function Text({
  children,
  config,
  font = '/Manrope_Regular.json',
  ...props
}: {
  children: React.ReactNode
  config: MaterialConfig
  font?: string
  [key: string]: any
}) {
  const texture = useLoader(
    RGBELoader,
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr'
  )

  return (
    <group>
      <Center scale={[0.8, 1, 1]} front top {...props}>
        <Text3D
          castShadow
          bevelEnabled
          font={font}
          scale={5}
          letterSpacing={-0.03}
          height={0.25}
          bevelSize={0.01}
          bevelSegments={5}
          curveSegments={64}
          bevelThickness={0.01}
        >
          {children}
          <MeshTransmissionMaterial {...config} background={texture} />
        </Text3D>
      </Center>
      <Grid />
    </group>
  )
}

export function Scene() {
  const [deviceState, setDeviceState] = useState<DeviceState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  })

  const controlsRef = useRef<any>()
  const targetZoom = useRef(40)
  const currentZoom = useRef(40)

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isMobile = width <= 768
      const isTablet = width > 768 && width <= 1024
      const isDesktop = width > 1024

      setDeviceState({ isMobile, isTablet, isDesktop })

      // Adjust zoom based on device
      if (isMobile) {
        targetZoom.current = 25
      } else if (isTablet) {
        targetZoom.current = 35
      } else {
        targetZoom.current = 40
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Smooth zoom implementation
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (deviceState.isMobile) return // Disable zoom on mobile

      event.preventDefault()

      const zoomSpeed = 0.5
      const minZoom = 25
      const maxZoom = 80

      targetZoom.current -= event.deltaY * zoomSpeed * 0.01
      targetZoom.current = Math.max(minZoom, Math.min(maxZoom, targetZoom.current))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [deviceState.isMobile])

  // Cursor interaction logic
  useEffect(() => {
    const handleMouseDown = () => {
      document.body.classList.remove('cursor-grab')
      document.body.classList.add('cursor-grabbing')
    }

    const handleMouseUp = () => {
      document.body.classList.remove('cursor-grabbing')
      document.body.classList.add('cursor-grab')
    }

    const handleMouseMove = () => {
      if (!deviceState.isMobile) {
        document.body.classList.add('cursor-grab')
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [deviceState.isMobile])

  const text = 'Coming Soon'
  const contactShadowColor = '#0d0d10'
  const autoRotate = false

  // Set initial zoom based on device
  const initialZoom = deviceState.isMobile ? 25 : 40
  if (targetZoom.current === 40 && deviceState.isMobile) {
    targetZoom.current = 25
    currentZoom.current = 25
  }

  return (
    <Canvas
      shadows
      orthographic
      camera={{ position: [10, 20, 20], zoom: initialZoom }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      <SmoothZoom
        controlsRef={controlsRef}
        targetZoom={targetZoom}
        currentZoom={currentZoom}
      />

      <color attach="background" args={['#f2f2f5']} />

      <Text
        config={materialConfig}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 2.25]}
      >
        {text}
      </Text>

      <directionalLight
        castShadow
        position={[12, 18, 12]}
        intensity={1.25}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={5}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={18}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      <ambientLight intensity={0.3} />

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
      />

      <Environment resolution={16}>
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

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.35} color={contactShadowColor} />
      </mesh>
    </Canvas>
  )
}
