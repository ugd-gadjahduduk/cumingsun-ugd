export interface MaterialConfig {
  backside: boolean
  backsideThickness: number
  samples: number
  resolution: number
  transmission: number
  clearcoat: number
  clearcoatRoughness: number
  thickness: number
  chromaticAberration: number
  anisotropy: number
  roughness: number
  distortion: number
  distortionScale: number
  temporalDistortion: number
  ior: number
  color: string
}

export interface DeviceState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export interface CameraControls {
  targetZoom: number
  currentZoom: number
  autoRotate: boolean
}

export interface LocationData {
  city?: string
  country_name?: string
  error?: string
}
