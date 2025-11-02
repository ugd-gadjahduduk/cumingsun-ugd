# UGD Coming Soon – Next.js

A glassy 3D "coming soon" microsite for [UGD](https://github.com/gadjahduduk) powered by Next.js, React Three Fiber, and Tailwind CSS. It pairs a GSAP-driven loader with an orthographic 3D scene rendered on the client and a lightweight overlay that surfaces live visit context.

## ✨ Features
- Canvas scene renders refractive "Coming Soon" typography using `MeshTransmissionMaterial` and HDR environment lighting.
- GSAP loader gates the experience, animates in/out, and locks body scroll until the scene is ready.
- **Device-specific optimizations**: Automatically adjusts material quality, geometry complexity, shadow resolution, and environment lighting based on device type (mobile/tablet/desktop).
- **Gyroscope controls on mobile/tablet**: Tilt your device to rotate the camera around the scene (horizontal rotation only).
- **Responsive zoom & controls**: Desktop uses OrbitControls with mouse drag and wheel zoom; mobile/tablet uses gyroscope or static view.
- Overlay shows live 24-hour time, persists the visitor's last known city/country in `localStorage`, and surfaces the UGD mark with magnetic hover effects.
- Umami analytics loads globally from the document head so every page view is tracked without extra wiring.

## 🧱 Stack & Tooling
- **Framework**: Next.js 16 (Pages Router) + React 18
- **Language**: TypeScript 5
- **3D**: React Three Fiber, Drei helpers, Three.js, GSAP for camera transitions
- **Styling**: Tailwind CSS 3 with custom globals
- **Analytics**: Umami Cloud (`data-website-id=115e0249-c404-4faa-9121-e780efd7c7ac`)

## 🧭 Architecture Notes
- `src/pages/index.tsx` runs entirely on the client, coordinating the loader, `<Scene />`, and `<Overlay />` inside a suspense boundary.
- `src/components/Loader.tsx` owns intro/outro GSAP timelines, toggles `document.body` overflow, and exposes an `onFinished` callback for safe unmounting.
- `src/components/Scene.tsx` builds the orthographic canvas, orchestrates smooth zoom via refs, handles wheel input, and triggers a GSAP camera move after the loader resolves. Uses custom hooks and modular 3D components.
- `src/components/three/` contains reusable 3D components:
  - `GyroscopeControls.tsx` - Mobile/tablet gyroscope-based camera rotation
  - `SmoothZoom.tsx` - Smooth camera zoom interpolation
  - `Text3DGlass.tsx` - 3D text with device-optimized glass material
  - `Grid.tsx` - Floor grid with instanced rendering
- `src/hooks/` contains custom React hooks:
  - `useDeviceDetection.ts` - Detects device type and gyroscope support
  - `useZoomControl.ts` - Manages device-specific zoom levels
  - `useCursorInteraction.ts` - Handles cursor grab/grabbing states
  - `useCameraAnimation.ts` - GSAP-powered camera animations
- `src/components/Overlay.tsx` renders the fixed UI with responsive sizing, maintains a ticking clock, and hits `https://ipapi.co/json/` before caching the last visit metadata in `localStorage`.
- `src/components/MagneticElement.tsx` provides GSAP-powered magnetic hover effects for interactive elements.
- `src/components/GadjahDudukLogo.tsx` renders the logo as an inline SVG React component.
- `src/pages/_document.tsx` sets up head metadata, preloads fonts/assets, and injects the Umami script; `_app.tsx` applies global CSS and default SEO tags.
- `src/styles/globals.css` locks the viewport, defines cursor utilities, and adds touch/scroll safeguards for mobile.

## 📁 Project Layout
```
src/
├── components/
│   ├── Loader.tsx              # GSAP-powered loader and SVG mask animation
│   ├── Overlay.tsx             # Clock, logo, "last visit" geolocation overlay
│   ├── Scene.tsx               # Main React Three Fiber scene orchestrator
│   ├── MagneticElement.tsx     # GSAP magnetic hover effect wrapper
│   ├── GadjahDudukLogo.tsx     # Logo SVG React component
│   └── three/                  # Reusable 3D components
│       ├── GyroscopeControls.tsx  # Gyroscope-based camera control
│       ├── SmoothZoom.tsx         # Smooth zoom interpolation
│       ├── Text3DGlass.tsx        # 3D glass text with optimizations
│       ├── Grid.tsx               # Floor grid component
│       └── index.ts               # Barrel export
├── hooks/                      # Custom React hooks
│   ├── useDeviceDetection.ts   # Device type & gyroscope detection
│   ├── useZoomControl.ts       # Device-based zoom management
│   ├── useCursorInteraction.ts # Cursor grab/grabbing states
│   ├── useCameraAnimation.ts   # GSAP camera animations
│   └── index.ts                # Barrel export
├── pages/
│   ├── _app.tsx                # Global styles + base meta tags
│   ├── _document.tsx           # HTML scaffold, preload hints, Umami analytics
│   └── index.tsx               # Home page composing Loader, Scene, Overlay
├── styles/
│   └── globals.css             # Tailwind layer customisations and cursor rules
└── types/
    └── index.ts                # Shared TypeScript interfaces (MaterialConfig, DeviceState, etc.)
public/
├── aerodynamics_workshop_1k.hdr  # HDRI environment texture
├── Manrope_Regular.json          # 3D text font
└── favicon.svg                   # Site favicon
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Package manager: `pnpm` (recommended), or `npm` / `yarn`

### Install dependencies
```bash
pnpm install
# or: npm install / yarn install
```

### Run locally
```bash
pnpm dev
```
Then open <http://localhost:3000>.

### Production build & serve
```bash
pnpm build
pnpm start
```

### Quality checks
```bash
pnpm lint
pnpm type-check
```

## 🎚️ Customisation
- **Headline**: Change the `text` constant in `src/components/Scene.tsx`.
- **Glass look**: Tweak `materialConfig` in `Scene.tsx` (thickness, distortion, aberration). Device-specific optimizations are applied automatically in `Text3DGlass.tsx`.
- **Lighting**: Edit the `<directionalLight />`, `<ambientLight />`, or `<Lightformer />` setup in `Scene.tsx`.
- **Camera feel**: Adjust zoom bounds in `useZoomControl.ts`, interpolation speed in `SmoothZoom.tsx`, and GSAP target positions in `useCameraAnimation.ts`.
- **Gyroscope sensitivity**: Modify the azimuth multiplier and lerp factor in `GyroscopeControls.tsx`.
- **Device breakpoints**: Update mobile/tablet thresholds in `useDeviceDetection.ts` (default: mobile ≤768px, tablet ≤1024px).
- **Performance tuning**: Adjust material samples, resolution, curve segments in `Text3DGlass.tsx` based on your target devices.
- **Overlay copy**: Modify strings or remove the `fetch` call in `Overlay.tsx` if location data is unnecessary. Responsive text sizing is handled via Tailwind classes.
- **Magnetic effects**: Tweak strength, radius, and easing in `MagneticElement.tsx` props.
- **Analytics**: Swap the `data-website-id` or remove the Umami script in `_document.tsx`.
- **Styling**: Tailwind tokens live in `tailwind.config.js`; base styles are in `src/styles/globals.css`.

## 🌐 External Integrations
- HDR environment texture served from `/public/aerodynamics_workshop_1k.hdr` (local file).
- Visitor location retrieved from `https://ipapi.co/json/`.
- Analytics script served from `https://cloud.umami.is`.
- GSAP animation library for camera transitions and magnetic effects.
Allow these hosts through CSP/network policies before deploying.

## 📱 Device Support & Optimization

### Desktop (>1024px)
- **Controls**: OrbitControls with mouse drag and wheel zoom
- **Material Quality**: High (samples: 8, resolution: 512px)
- **Text Geometry**: 64 curve segments, 5 bevel segments
- **Shadows**: 1024x1024 shadow maps
- **Environment**: 256px resolution

### Tablet (768-1024px)
- **Controls**: Hybrid - Touch drag (OrbitControls) + Gyroscope (if supported)
- **Material Quality**: Medium (samples: 4, resolution: 256px)
- **Text Geometry**: 48 curve segments, 5 bevel segments
- **Shadows**: 1024x1024 shadow maps
- **Environment**: 128px resolution

### Mobile (≤768px)
- **Controls**: Hybrid - Touch drag (OrbitControls) + Gyroscope (if supported)
- **Material Quality**: Low (samples: 2, resolution: 128px)
- **Text Geometry**: 32 curve segments, 3 bevel segments
- **Shadows**: 512x512 shadow maps
- **Environment**: 64px resolution
- **Effects**: Chromatic aberration and distortion disabled

### Gyroscope Support
- **iOS 13+**: Requires user permission (handled automatically)
- **Android**: Works on devices with gyroscope sensor
- **Behavior**: Tilt device left/right to add subtle rotation to the camera
- **Hybrid Mode**: Works alongside manual touch drag - users can use both simultaneously or separately
- **Sensitivity**: Reduced sensitivity (0.02 multiplier) to blend smoothly with manual controls

## 🚢 Deployment Notes
- Vercel will run `pnpm install` and `pnpm build`; run `pnpm build` locally first so you catch issues early.
- Ensure environment variables (if any) are mirrored in the Vercel dashboard; this project currently ships without required env vars.
- Static assets (`public/`) are bundled automatically—confirm the Manrope JSON font and HDR texture are accessible if you use a custom CDN policy.
- The project is optimized for production with automatic code splitting and lazy loading via React Suspense.
- Test on real mobile devices to verify gyroscope functionality and performance optimizations.

## 📚 Additional Documentation
- See `SCENE_COMPONENTS_README.md` for detailed documentation on 3D components, hooks, and optimization strategies.

## 🤝 Contributing
This is a portfolio/showcase project. Feel free to fork and adapt for your own use cases.

## 📄 License
MIT
