import { Center, Text3D } from '@react-three/drei'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { RGBELoader } from 'three-stdlib'
import type { MaterialConfig, DeviceState } from '@/types'
import { Grid } from './Grid'

interface Text3DGlassProps {
  children: React.ReactNode
  config: MaterialConfig
  deviceState: DeviceState
  font?: string
  [key: string]: any
}

export function Text3DGlass({
  children,
  config,
  deviceState,
  font = '/Manrope_Regular.json',
  ...props
}: Text3DGlassProps) {
  const texture = useLoader(RGBELoader, '/aerodynamics_workshop_1k.hdr')

  // Optimize material config based on device
  const optimizedConfig = {
    ...config,
    samples: deviceState.isMobile ? 2 : deviceState.isTablet ? 4 : 8,
    resolution: deviceState.isMobile ? 128 : deviceState.isTablet ? 256 : 512,
    chromaticAberration: deviceState.isMobile ? 0 : deviceState.isTablet ? 0.1 : 0.15,
    distortion: deviceState.isMobile ? 0 : deviceState.isTablet ? 0.3 : 0.5,
  }

  // Optimize text geometry based on device
  const curveSegments = deviceState.isMobile ? 32 : deviceState.isTablet ? 48 : 64
  const bevelSegments = deviceState.isMobile ? 3 : 5

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
          bevelSegments={bevelSegments}
          curveSegments={curveSegments}
          bevelThickness={0.01}
        >
          {children}
          <MeshTransmissionMaterial {...optimizedConfig} background={texture} />
        </Text3D>
      </Center>
      <Grid />
    </group>
  )
}
