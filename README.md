# 📜 Sachit — Tactile Paper Developer Portfolio

> An editorial, immersive **3D tactile paper-themed developer portfolio** blending physical craftsmanship with high-performance modern web engineering.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Design Philosophy & Tactile Metaphor](#-design-philosophy--tactile-metaphor)
- [Key Features](#-key-features)
  - [3D WebGL Paper Deformation](#1-3d-webgl-paper-crumple--unfold-simulation)
  - [Interactive Cap Mascot](#2-interactive-directional-mascot)
  - [Mobile-Native Swipe-to-Close Overlays](#3-mobile-native-swipe-down-to-close-sheets)
  - [Four Tactile Editorial Themes](#4-four-tactile-editorial-themes)
  - [Interactive Easter Eggs & Structure Room](#5-interactive-easter-eggs--structure-room)
  - [Shortcut HUD & Command Palette](#6-shortcut-hud--keyboard-navigation)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Performance Engineering](#-performance-engineering)
- [SEO & LLM Search Indexing](#-seo--llm-search-indexing)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Run](#installation--local-run)
  - [Production Build](#production-build)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Author & Contact](#-author--contact)
- [License](#-license)

---

## 🌟 Overview

This portfolio is an artisanal digital canvas created for **Sachit**, a Software Developer and Prompt Engineer specializing in full-stack web applications, AI systems, custom Android platforms, and workflow automation.

Rather than relying on generic modern templates with neon gradients, the interface models the visceral, tangible qualities of physical paper: coarse fibers, organic creases, folded blueprints, stamped ink, and tactile soundscapes.

---

## 🎨 Design Philosophy & Tactile Metaphor

1. **The Crumpled Paper Seed**: The initial viewport presents a floating, crumpled 3D paper ball on a studio workbench. Clicking, pressing Space, or performing a two-finger pinch unrolls the paper through a continuous physics simulation into a pristine, readable broadsheet.
2. **Editorial Typography**: Pairing hand-drawn script accents (`Kalam`), typewriter monospace (`Courier Prime`), and humanist sans-serif for rigorous typographic hierarchy and readable scannability.
3. **Zero-Pill Discipline & Anti-Slop**: Strict avoidance of saturated SaaS blue/purple gradient pills and generic floating cards. All cards feature crisp hairline borders, stamped monospaced serials (`[ 01 / BACKGROUND ]`), and paper grain textures.
4. **Binaural & Spatial Acoustics**: High-fidelity paper audio cues accompany crumple, unfold, theme switches, and drawer gestures, equipped with global mute memory.

---

## 🚀 Key Features

### 1. 3D WebGL Paper Crumple & Unfold Simulation
- **Procedural Displacement**: Built on Three.js and custom GLSL vertex shaders to simulate authentic paper fiber creasing, surface roughness, and ambient occlusion.
- **GSAP Physics & Morphing**: Seamless deformation from a crumpled ball to a flat, readable sheet with momentum-based easing curves.
- **Accessibility & Motion Fallback**: Automatically respects `prefers-reduced-motion` by skipping heavy vertex displacement and transitioning directly into the readable canvas.

### 2. Interactive Directional Mascot
- **Spatial Eye & Head Tracking**: A custom page mascot that tracks mouse coordinates on desktop and touch focus on mobile using discrete sprite matrices (`cap-directions.webp`).
- **Breathing & Weightless Float Loops**: Subtle GSAP idle floats and rhythmic micro-scaling.
- **Touch & Click Reactions**: Tapping the mascot triggers playful interactive expression changes (`cap-reactions.webp`) with haptic visual feedback.

### 3. Mobile-Native Swipe-Down-to-Close Sheets
- **Touch-Event Physics Engine**: The **Resume Viewer**, **Privacy Policy**, and **Terms of Service** modals feature a native gesture controller in `src/App.tsx`.
- **Scroll-Boundary Awareness**: Dismissal gestures only activate when scrolled to the very top (`scrollTop <= 4px`), allowing free vertical scrolling through long documents without premature dismissal.
- **Rubber-Band Resistance & Velocity Flicks**: Smooth displacement curve (`Math.min(deltaY * 0.72, 340)`) with opacity decay, supporting quick flick-to-dismiss (> 0.4 px/ms) or threshold release (> 70px).
- **Grab Handle Indicator**: Sleek pull bar on mobile with live state cues (`"Swipe down to close"` / `"Release to close"`).

### 4. Four Tactile Editorial Themes
Visitors can toggle between four authentic material palettes in real time:

| Theme | Material Metaphor | Background | Border & Ink | Accent |
| :--- | :--- | :--- | :--- | :--- |
| **Cotton** *(Default)* | Heavyweight archival rag paper | Warm Off-White (`#fbfbfa`) | Soft Graphite & Card Edge | Charcoal Black |
| **Kraft** | Recycled brown fibrous packaging | Warm Cardstock (`#dfd7c5`) | Earth Brown | Sienna Stamped Ink |
| **Blueprint** | Technical drafting cyanotype sheet | Deep Prussian Cyan (`#0d2238`)| Cyan Metric Grids | Technical White |
| **Newspaper** | High-contrast vintage morning print | Newsprint Ivory (`#f2ede4`) | Dark Iron Inking | Editorial Red |

### 5. Interactive Easter Eggs & Structure Room
- **Retro Doom Sequence**: A custom sequence trigger that transitions the canvas into a retro-styled retro simulation room.
- **3D Structure Room**: An interactive 3D spatial room allowing free navigation through the architectural layers of the portfolio.
- **Mood Transition Engine**: Interactive canvas mood states with color transitions and dynamic sound feedback.

### 6. Shortcut HUD & Command Palette
- Pressing `?` or `/` summons a floating **Shortcut HUD** outlining all global hotkeys.
- Quick keys for theme cycling (`T`), sound toggling (`M`), opening resume (`R`), recrumpling paper (`Space`/`Enter`), and opening the full sitemap (`S`).

---

## 🛠️ Architecture & Tech Stack

```
                              ┌────────────────────────────────────────┐
                              │               User Viewport            │
                              └────────────────────┬───────────────────┘
                                                   │
                          ┌────────────────────────┴────────────────────────┐
                          ▼                                                 ▼
             ┌─────────────────────────┐                       ┌─────────────────────────┐
             │    PaperIntro (3D)      │                       │   Portfolio Viewport    │
             │   Three.js + GLSL       │   Unfold Gesture      │  Header & Navigation    │
             │   Crumple Sound FX      ├──────────────────────►│  Hero, About, Mascot    │
             │   Pinch / Click Trigger │                       │  Projects & Experience  │
             └─────────────────────────┘                       └────────────┬────────────┘
                                                                            │
                                     ┌──────────────────────────────────────┼──────────────────────────────────────┐
                                     ▼                                      ▼                                      ▼
                        ┌─────────────────────────┐            ┌─────────────────────────┐            ┌─────────────────────────┐
                        │   Resume Sheet Modal    │            │   Privacy Policy Modal  │            │  Terms of Service Modal │
                        │  JSON-Driven Experience │            │  Transparent Statement  │            │  Usage Guidelines       │
                        │  Printable & Exportable │            │  Zero Trackers          │            │  Open-Source Conditions │
                        │  Mobile Swipe-To-Close  │            │  Mobile Swipe-To-Close  │            │  Mobile Swipe-To-Close  │
                        └─────────────────────────┘            └─────────────────────────┘            └─────────────────────────┘
```

| Layer | Tools & Libraries | Role in Application |
| :--- | :--- | :--- |
| **UI Framework** | React 19, TypeScript 5.8 | Concurrent rendering, typed state management, hooks architecture |
| **Build & Dev Tool** | Vite 6, TSX, ESBuild | Ultra-fast HMR, bundled CJS server output for production |
| **Styling & Design** | Tailwind CSS v4, CSS Variables | Tokenized theming, zero runtime CSS-in-JS, pure design tokens |
| **3D Rendering** | Three.js, Custom Shaders (GLSL) | 3D paper mesh, directional lighting, procedural displacement |
| **Animation Engines** | GSAP 3, Motion (`motion/react`), Anime.js | Fluid timeline orchestration, layout transitions, spring physics |
| **Layout & Text Math** | `@chenglou/pretext` | Zero-layout-thrashing canvas-based pretext calculations |
| **Sound System** | HTML5 Web Audio API, SoundManager | Non-intrusive spatial audio cues, audio cache, volume toggles |
| **Backend / Proxy** | Express 5, Node.js | Unified SSR asset delivery, client routing, server proxy |

---

## ⚡ Performance Engineering

- **Pretext Pre-computations**: Computes accurate multiline text wrapping and bounding heights off-DOM using `@chenglou/pretext`, eliminating browser reflows and layout thrashing.
- **Shared Intersection Observers**: Uses a consolidated observer singleton (`src/utils/observer.ts`) to manage viewport triggers across cards and sections with zero redundant scroll listeners.
- **CSS Containment**: Grid cards enforce `contain: content` and `items-start` alignment, preventing micro-interactions in one card from invalidating neighbor row geometries.
- **Resilient Lazy Loading**: Heavy components (`PaperIntro`, `StructureRoom`, `ResumeViewer`) load on demand using `lazyWithRetry` with automatic chunk reload recovery.
- **Sub-Second Initial Paint**: Self-hosted WOFF2 fonts with `font-display: swap`, optimized WebP mascot sheets, and deferred non-critical assets.

---

## 🔍 SEO & LLM Search Indexing

- **Schema.org Structured Data**: Complete JSON-LD models for `Person`, `WebSite`, and `ProfilePage`.
- **Semantic Tagging**: Valid OpenGraph social share cards, Twitter metadata, and canonical tag synchronizations.
- **AI Agent Discoverability**:
  - `public/llms.txt`: Provides a structured, clean Markdown representation of the portfolio, skills, projects, and contact info tailored for LLM crawlers.
  - `public/sitemap.xml`: XML sitemap with freshness markers for search engine indexers.
  - `public/robots.txt`: Optimized crawler allowances.

---

## 📁 Project Structure

```
├── public/
│   ├── mascots/               # Directional & emotional mascot sprite sheets
│   ├── fonts/                 # Self-hosted Courier Prime & Kalam web fonts
│   ├── paper-crumple.mp3      # High-fidelity tactile paper audio
│   ├── Sachit_Resume.pdf      # Offline downloadable curriculum vitae
│   ├── llms.txt               # LLM-readable profile & project summary
│   ├── robots.txt             # Search crawler directives
│   └── sitemap.xml            # Search indexing manifest
├── src/
│   ├── components/
│   │   ├── PaperIntro/        # 3D WebGL paper crumple & unroll canvas
│   │   ├── Portfolio/         # Core sections (Hero, About, Projects, Experience, Resume)
│   │   ├── UI/                # Reusable UI (LocalMascot, HoneycombLoader, ShortcutHUD)
│   │   ├── SEO/               # SEOHead & JSON-LD metadata components
│   │   └── MoodGame/          # Interactive mood game easter egg
│   ├── structure-room/        # 3D Structure Room easter egg
│   ├── data/                  # Strongly-typed resume, project, and sitemap data
│   ├── hooks/                 # Custom React hooks (swipe, doom, performance, navigation)
│   ├── utils/                 # Sound manager, font loader, observers, watermarks
│   ├── types.ts               # Core TypeScript interface definitions
│   ├── App.tsx                # Application root with mobile overlay swipe gestures
│   ├── main.tsx               # Client mounting entry point
│   └── index.css              # Global styles, Tailwind v4 imports, theme CSS vars
├── server.ts                  # Production Express server
├── package.json               # Dependency definitions & npm scripts
├── tsconfig.json              # TypeScript compilation configuration
└── vite.config.ts             # Vite build & plugin settings
```

---

## 💻 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sachit1751-art/portfo-final-sachit.git
   cd portfo-final-sachit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Verify TypeScript & Linting:**
   ```bash
   npm run lint
   ```

### Production Build

```bash
# Build production client bundle and server runner
npm run build

# Start the production server
npm run start
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` / `Enter` | Unfold crumpled paper / Recrumple back into paper ball |
| `T` | Cycle through tactile themes (*Cotton → Kraft → Blueprint → Newspaper*) |
| `M` | Toggle spatial paper soundscapes (*Mute / Unmute*) |
| `R` | Open interactive Resume / CV viewer |
| `S` | Open complete site map index modal |
| `?` or `/` | Toggle the Shortcut HUD overlay |
| `Escape` | Close any active modal overlay (Resume, Privacy, Terms, SiteMap) |

---

## 📬 Author & Contact

**Sachit**  
Software Developer & Prompt Engineer  

- **Email**: [sachit1771@gmail.com](mailto:sachit1771@gmail.com) / [sachit1751@gmail.com](mailto:sachit1751@gmail.com)
- **GitHub**: [@sachit1751-art](https://github.com/sachit1751-art)
- **Portfolio**: [sachin-portfoli.vercel.app](https://sachin-portfoli.vercel.app)

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).  
© 2026 Sachit. All rights reserved.
