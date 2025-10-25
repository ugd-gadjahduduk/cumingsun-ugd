# UGD Coming Soon – Next.js

A glassy 3D “coming soon” microsite for [UGD](https://github.com/gadjahduduk) powered by Next.js, React Three Fiber, and Tailwind CSS. It pairs a GSAP-driven loader with an orthographic 3D scene rendered on the client and a lightweight overlay that surfaces live visit context.

## ✨ Features
- Canvas scene renders refractive “Coming Soon” typography using `MeshTransmissionMaterial` and HDR environment lighting.
- GSAP loader gates the experience, animates in/out, and locks body scroll until the scene is ready.
- Responsive device heuristics adjust orthographic zoom, cursor behaviour, and wheel interactions per breakpoint.
- Overlay shows live 24-hour time, persists the visitor’s last known city/country in `localStorage`, and surfaces the UGD mark.
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
- `src/components/Scene.tsx` builds the orthographic canvas, orchestrates smooth zoom via refs, handles wheel input, and triggers a GSAP camera move after the loader resolves.
- `src/components/Overlay.tsx` renders the fixed UI, maintains a ticking clock, and hits `https://ipapi.co/json/` before caching the last visit metadata in `localStorage`.
- `src/pages/_document.tsx` sets up head metadata, preloads fonts/assets, and injects the Umami script; `_app.tsx` applies global CSS and default SEO tags.
- `src/styles/globals.css` locks the viewport, defines cursor utilities, and adds touch/scroll safeguards for mobile.

## 📁 Project Layout
```
src/
├── components/
│   ├── Loader.tsx    # GSAP-powered loader and SVG mask animation
│   ├── Overlay.tsx   # Clock, logo, “last visit” geolocation overlay
│   └── Scene.tsx     # React Three Fiber scene, camera, lighting, controls
├── pages/
│   ├── _app.tsx      # Global styles + base meta tags
│   ├── _document.tsx # HTML scaffold, preload hints, Umami analytics
│   └── index.tsx     # Home page composing Loader, Scene, Overlay
├── styles/
│   └── globals.css   # Tailwind layer customisations and cursor rules
└── types/
    └── index.ts      # Shared TypeScript interfaces
public/
├── GadjahDuduk.svg
├── Manrope_Regular.json
└── favicon.svg
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
- **Glass look**: Tweak `materialConfig` in `Scene.tsx` (thickness, distortion, aberration).
- **Lighting**: Edit the `<directionalLight />`, `<ambientLight />`, or `<Lightformer />` setup in `Scene.tsx`.
- **Camera feel**: Adjust zoom bounds, interpolation speed, and GSAP target positions in `Scene.tsx`.
- **Overlay copy**: Modify strings or remove the `fetch` call in `Overlay.tsx` if location data is unnecessary.
- **Analytics**: Swap the `data-website-id` or remove the Umami script in `_document.tsx`.
- **Styling**: Tailwind tokens live in `tailwind.config.js`; base styles are in `src/styles/globals.css`.

## 🌐 External Integrations
- HDR environment map loaded from `https://dl.polyhaven.org`.
- Visitor location retrieved from `https://ipapi.co/json/`.
- Analytics script served from `https://cloud.umami.is`.
Allow these hosts through CSP/network policies before deploying.

## 🚢 Deployment Notes
- Vercel will run `pnpm install` and `pnpm build`; run `pnpm build` locally first so you catch issues early.
- Ensure environment variables (if any) are mirrored in the Vercel dashboard; this project currently ships without required env vars.
- Static assets (`public/`) are bundled automatically—confirm the Manrope JSON font is accessible if you use a custom CDN policy.
