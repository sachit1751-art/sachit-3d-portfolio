<div align="center">

# 📄 Sachit — Full-Stack Developer & Prompt Engineer Portfolio

[![Portfolio Status](https://img.shields.io/badge/status-active-success.svg)]()
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-purple.svg)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An engineering-focused, high-performance **tactile 3D paper-themed portfolio and developer workspace** featuring custom WebGL shaders, physics-based motion, spring-animated navigation tabs, zero CLS layouts, and native machine-readable AI agent specifications (`llms.txt`).

[Explore Live Portfolio](https://sachin-portfoli.vercel.app/) • [GitHub Profile](https://github.com/sachit1751-art)

</div>

---

## ✨ Key Features & Interactive Highlights

- **3D WebGL Paper Deformation Engine**: Built with Three.js and GSAP, allowing visitors to interactively crumple, unroll, drag, and rotate physical origami-style paper sheets with dynamic crease highlights and sound effects.
- **Spring-Physics Navigation**: Active navigation tab indicators powered by spring physics with hardware-accelerated transforms for organic movement across viewports.
- **Structure Room & Architecture Explorer**: A dedicated 3D interactive room inspecting code architecture, procedural graphics engines, design decisions, and performance telemetry.
- **AI Chat Assistant (Gemini-Powered)**: Real-time multi-model AI assistant grounded strictly in Sachit's portfolio data and machine-readable `llms.txt` dossier.
- **Interactive Easter Eggs & Mini-Games**: Hidden DOOM terminal sequence and Mood interactive mini-game triggered via tactile paper interactions.
- **Machine-Readable AI Agent Integration**: Serves `/llms.txt` and `/llms-full.txt` (adhering to the [llmstxt.org specification](https://llmstxt.org/)) providing AI agents and crawlers with a structured dossier of all site projects and skills.
- **Printable Clean Resume Mode**: Dedicated printable layout component (`PrintableResume.tsx`) formatting the curriculum vitae into a clean, black-and-white professional document when triggered from browser print dialogs (`window.print()`).

---

## 🛠️ Tech Stack & Systems

| Layer | Technology / Specification |
| :--- | :--- |
| **Framework & Language** | React 19, TypeScript (Strict ESM), Vite 6 |
| **Styling & Layout** | Tailwind CSS v4, Fluid CSS Containment, Editorial Typography (`Kalam`, `Courier Prime`) |
| **3D & Canvas** | Three.js, WebGL (Custom GLSL Shaders), HTML5 Canvas API |
| **Animation Physics** | Framer Motion (`motion/react`), GSAP 3, Anime.js |
| **Backend & API** | Node.js, Express 5, Google GenAI SDK (`@google/genai`) |
| **Audio Pipeline** | Web Audio API, Spatial Sound Manager with global muted toggles |
| **AI Documentation** | Machine-readable `/llms.txt` & `/llms-full.txt` Index for LLM Agents |
| **SEO & OpenGraph** | JSON-LD Schema.org Structured Data, Twitter Cards, OpenGraph Preview Cards |

---

## 🚀 Featured Projects

1. **SKY ROMs** — Android Custom ROM Discovery & Management Platform (*React, TypeScript, Supabase, PostgreSQL, Capacitor*) | [Live App](https://sky-roms.vercel.app/)
2. **MoneyPal** — Native Expense Tracker & Wear OS Companion (*Kotlin, Jetpack Compose, Room Database, Wear OS*) | [GitHub Repo](https://github.com/sachit1751-art/MoneyPal)
3. **Audify** — Web Audio Streaming Player (*React, TypeScript, Web Audio API, Tailwind CSS*) | [GitHub Repo](https://github.com/sachit1751-art/Audify)
4. **AI-Powered Model Context Protocol (MCP) Tool** — Developer Utility for LLM Tooling (*Python, Anthropic Claude API, MCP Protocol, JSON-RPC*)
5. **Tic-Tac-Toe Mini Game** — Minimax AI Browser Game (*HTML5, CSS3, JavaScript ES6+, Minimax Algorithm*)

---

## 📁 Repository Structure

```
├── api/                     # Serverless / API endpoints
├── public/
│   ├── llms.txt             # Machine-readable AI agent dossier
│   ├── llms-full.txt        # Full machine-readable Markdown dossier for LLMs
│   ├── sitemap.xml          # XML sitemap with priorities and routes
│   ├── fonts/               # Preloaded Kalam WOFF2 fonts
│   └── mascots/             # Optimized WebP hero assets
├── scripts/                 # Build & sitemap generation scripts
├── server.ts                # Express backend server with Vite middleware & Gemini proxy
├── src/
│   ├── components/
│   │   ├── DoomEasterEgg/   # Hidden DOOM Easter Egg sequence
│   │   ├── MoodGame/        # Interactive Mood game & HUD
│   │   ├── PaperIntro/      # 3D WebGL paper crumple & unroll canvas
│   │   ├── Portfolio/       # Main portfolio sections (Hero, About, Projects, Resume, Contact)
│   │   ├── SEO/             # SEO metadata & structured data components
│   │   └── UI/              # Springs, skeletons, toast alerts, tech stack icons
│   ├── data/                # Resume data, quotes, and project definitions
│   ├── hooks/               # useScrollSpy, usePerformance, useSwipeToDismiss, useSound
│   ├── structure-room/      # 3D Architecture & Structure Room engine
│   ├── utils/               # Sound manager, font loader, provenance watermark
│   ├── main.tsx             # Entry point
│   └── index.css            # Global CSS, font-display swap, theme variables
├── vite.config.ts           # Fine-grained manualChunks bundle splitting
├── package.json             # Build scripts & dependencies
└── README.md                # Technical documentation
```

---

## 💻 Local Development & Build Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run local dev server (port 3000):**
   ```bash
   npm run dev
   ```

3. **Validate TypeScript & Linting:**
   ```bash
   npm run lint
   ```

4. **Compile production build:**
   ```bash
   npm run build
   ```

---

## 🔒 Provenance & License

© 2026 **Sachit** (`sachit1771@gmail.com` / `sachit1751@gmail.com`). All rights reserved.  
Open source code elements licensed under the [MIT License](LICENSE).
