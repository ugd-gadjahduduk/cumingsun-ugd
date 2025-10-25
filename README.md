# UGD Coming Soon – Next.js

A high-gloss 3D "Coming Soon" landing page for [UGD](https://github.com/gadjahduduk) built with Next.js, TypeScript, Tailwind CSS, and React Three Fiber. The scene renders refractive glass typography lit by HDR environment lighting, complemented by a minimal overlay with live metadata and analytics.

## ✨ Highlights
- Real-time 3D text rendered with `MeshTransmissionMaterial` for a glass/epoxy look.
- Orthographic camera with smooth wheel-controlled zoom that adapts to desktop, tablet, and mobile widths.
- HDR environment lighting plus a shadow-catching plane lit by custom directional and ambient lights.
- Overlay UI showing live clock, visitor location via `ipapi.co`, and brand assets.
- Tailwind-based styling, custom cursor states, and full-viewport layout.
- Umami analytics injected globally to track traffic.
- Built on the Next.js Pages Router with TypeScript-first tooling and ESLint/Prettier support.

## 🧱 Tech Stack
- **Framework**: Next.js 16 (Pages Router) + React 18
- **Language**: TypeScript 5
- **3D**: React Three Fiber, Drei utilities, Three.js, MeshTransmissionMaterial
- **Styling**: Tailwind CSS 3
- **Analytics**: Umami Cloud (`data-website-id=115e0249-c404-4faa-9121-e780efd7c7ac`)

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or newer
- Package manager: `pnpm` (recommended), `npm`, or `yarn`

### Installation
```bash
pnpm install
# or
npm install
# or
yarn install
```

### Development
```bash
pnpm dev
```
Open <http://localhost:3000>.

### Production Build
```bash
pnpm build
pnpm start
```

### Linting & Types
```bash
pnpm lint
pnpm type-check
```

## 📁 Project Layout
```
src/
├── components/
│   ├── Scene.tsx          # Three.js scene, camera logic, shadows, lights
│   ├── Overlay.tsx        # Clock, logo, geolocation overlay
│   └── LoadingSpinner.tsx # Suspense fallback
├── pages/
│   ├── _app.tsx           # Global styles, SEO tags
│   ├── _document.tsx      # HTML scaffold + Umami analytics
│   └── index.tsx          # Entry point rendering Scene + Overlay
├── styles/
│   └── globals.css        # Tailwind base + cursor overrides
└── types/
    └── index.ts           # Shared TypeScript interfaces
public/
├── GadjahDuduk.svg
├── Manrope_Regular.json
└── favicon.ico
```

## 🎚️ Customization Guide
- **Text Content**: Update the `text` constant in `src/components/Scene.tsx`.
- **Glass Material**: Tweak `materialConfig` in `Scene.tsx` for transmission, thickness, distortion, etc.
- **Lighting & Shadows**: Adjust the `directionalLight`, `ambientLight`, or the `shadowMaterial` plane in `Scene.tsx`.
- **Camera Behaviour**: Modify zoom thresholds in the wheel handler or the initial zoom logic for different breakpoints.
- **Overlay Text**: Edit copy in `src/components/Overlay.tsx`; remove or replace the `fetch` to `ipapi.co` if geolocation is not desired.
- **Analytics**: Swap the Umami `data-website-id` or remove the `<script>` tag in `src/pages/_document.tsx`.
- **Styling**: Tailwind tokens live in `tailwind.config.js`; global background/cursor rules are in `src/styles/globals.css`.

## 🌐 External Services
- **HDR Environment Map**: Loaded from `dl.polyhaven.org` via `RGBELoader`.
- **Visitor Location**: Fetched client-side from `https://ipapi.co/json/`.
- **Analytics**: Umami script served from `https://cloud.umami.is`.
Ensure these hosts are allowed in CSP/network environments when deploying.

## 🧪 Tips & Troubleshooting
- **Performance**: Reduce `Canvas` shadow resolution, `mesh` scale, or material sample counts for low-end devices.
- **Shadows**: If artifacts appear, adjust `shadow-bias` on the `directionalLight` or tweak the `shadowMaterial` opacity.
- **Wheel Zoom**: Scroll direction is configurable by changing the sign applied to `event.deltaY` in the wheel handler.
- **Fonts**: Replace `public/Manrope_Regular.json` with another Three.js-compatible font file for custom typography.

## 📄 License

MIT License – see the accompanying `LICENSE` file for details.
