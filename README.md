# 📄 Sachit — Full-Stack Developer & Prompt Engineer Portfolio

An engineering-focused, high-performance **tactile 3D paper-themed portfolio and developer workspace** featuring custom WebGL shaders, physics-based motion, spring-animated navigation tabs, zero CLS layouts, and native machine-readable AI agent specifications (`llms-full.txt`).

---

## ⚡ Architectural Highlights

- **Spring-Physics Header Underline**: Active navigation tab indicator powered by `motion/react` spring physics (`stiffness: 420`, `damping: 32`, `mass: 0.8`) with hardware-accelerated CSS transforms (`x`) for weighted, organic movement across tabs during rapid scrolling.
- **Dynamic Scroll-Spy Observer**: Section height-aware `IntersectionObserver` calculate dynamic `rootMargin` (`-${headerHeight}px 0px -${bottomMarginPct}% 0px`), guaranteeing crisp, reliable tab activation regardless of section height variance.
- **3D WebGL & Physics Engine**: Custom procedural GLSL paper grain shaders, realistic crumpling physics, GLSL lighting, and fluid deformation dynamics built on Three.js and GSAP.
- **Zero CLS & Fine-Grained Bundle Chunking**: Explicit sizing skeletons (`SectionSkeleton`) prevent layout shifts. Vite `manualChunks` split vendor modules (`vendor-three`, `vendor-gsap`, `vendor-motion`, `vendor-icons`, `vendor-react`) to keep main entry payloads under 50KB.
- **Machine-Readable AI Agent Integration**: Serves `/llms-full.txt` (adhering to the [llmstxt.org specification](https://llmstxt.org/)) providing AI agents and crawlers with a structured dossier of all site sections, projects, technical skills, and provenance signatures.

---

## 🛠️ Tech Stack & Systems

| Layer | Technology / Specification |
| :--- | :--- |
| **Framework & Language** | React 18, TypeScript (Strict ESM), Vite 6 |
| **Styling & Layout** | Tailwind CSS v4, Fluid CSS Containment, Editorial Typography (`Kalam`, `Courier Prime`) |
| **3D & Canvas** | Three.js, WebGL (Custom GLSL Shaders), HTML5 Canvas API |
| **Animation Physics** | Framer Motion (`motion/react`), GSAP 3, Anime.js |
| **Audio Pipeline** | Web Audio API, Spatial Sound Manager with global muted toggles |
| **AI Documentation** | Machine-readable `/llms-full.txt` Index for LLM Agents |
| **SEO & OpenGraph** | JSON-LD Schema.org Structured Data, Twitter Cards, OpenGraph Cards |

---

## 🚀 Live Projects Featured

1. **SKY ROMs** — Android Custom ROM Discovery & Management Platform (*React, TypeScript, Supabase, PostgreSQL, Capacitor*) | [Live App](https://sky-roms.vercel.app/)
2. **MoneyPal** — Native Expense Tracker & Wear OS Companion (*Kotlin, Jetpack Compose, Room Database, Wear OS*) | [GitHub Repo](https://github.com/sachit1751-art/MoneyPal)
3. **Audify** — Web Audio Streaming Player (*React, TypeScript, Web Audio API, Tailwind CSS*) | [GitHub Repo](https://github.com/sachit1751-art/Audify)
4. **AI-Powered Model Context Protocol (MCP) Tool** — Developer Utility for LLM Tooling (*Python, Anthropic Claude API, MCP Protocol, JSON-RPC*)
5. **Tic-Tac-Toe Mini Game** — Minimax AI Browser Game (*HTML5, CSS3, JavaScript ES6+, Minimax Algorithm*)

---

## 📁 Repository Map

```
├── public/
│   ├── llms-full.txt        # Full machine-readable Markdown dossier for LLMs & AI agents
│   ├── sitemap.xml          # XML sitemap with lastmod, priorities, and routes
│   ├── fonts/               # Preloaded Kalam WOFF2 fonts
│   └── mascots/             # Optimized WebP hero assets
├── src/
│   ├── components/
│   │   ├── PaperIntro/      # 3D WebGL paper crumple & unroll canvas
│   │   ├── Portfolio/       # Main portfolio sections (Hero, About, Projects, Resume, Contact)
│   │   └── UI/              # Springs, skeletons, toast alerts, tech stack icons
│   ├── hooks/               # useScrollSpy, useActiveSection, useSwipeToDismiss, useSound
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

© 2026 **Sachit** (sachit1771@gmail.com / sachit1751@gmail.com). All rights reserved.
Open source code elements licensed under the [MIT License](LICENSE).
