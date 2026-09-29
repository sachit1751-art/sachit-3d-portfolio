# 📄 Sachit's Portfolio

A bespoke, immersive, and highly interactive **3D tactile paper-themed portfolio website** that merges physical metaphors with cutting-edge full-stack engineering, performance optimizations, and creative interfaces. 

---

## 🎨 Design Philosophy & Metaphor

This portfolio is built on a tactile, visceral metaphor of **physical paper & interactive craftsmanship**. The landing begins with a realistic, crumpled 3D paper ball floating on a modern workbench.
- **Unfolding the Canvas**: Clicking or pinching the paper triggers a high-fidelity WebGL and GSAP simulation that unrolls the paper sheet, transitioning smoothly into a clean, minimalist, high-contrast digital resume and portfolio.
- **Tactile Soundscapes**: Features high-fidelity paper crumpling and unfolding audio cues, powered by a non-intrusive sound manager and dual-synchronized volume toggles.
- **Anti-Slop Aesthetics**: Standardized on high-contrast editorial typography (using Kalam & monospace primes), generous negative space, sophisticated neutral tones, and absolutely zero saturated SaaS blue-to-purple gradients.

---

## 🚀 Key Features

*   **Interactive 3D WebGL Paper Engine**: Features procedural paper grain shaders, realistic crumple physics, custom GLSL lighting, and fluid deformation dynamics powered by Three.js and GSAP.
*   **Unified CV & Resume Viewer**: An elegant, fully integrated, printable single-page curriculum vitae featuring decoupled JSON-driven experience records.
*   **Tactile Mascot Character**: A dynamic, interactive handwritten avatar with beautiful floating, breathing, and responsive hovering animations, including a helpful handwritten instruction prompt.
*   **Dynamic Projects Architecture**: A responsive grid utilizing independent height metrics (`items-start`) and complete CSS containment (`contain: content`) to eliminate layout thrashing or parent row stretching during micro-interactions.
*   **Dual Audio Toggles**: Features intuitive global audio switches in both the introductory crumple scene and the portfolio header to give visitors complete control over the spatial sound effects.
*   **Performance & SEO Optimized**: Achieves a smooth 60 FPS continuous animation pipeline through optimized event loop bindings. Pre-packaged with complete JSON-LD schema integrations, OpenGraph share-cards, and semantic metadata.
*   **Interactive Easter Eggs**: Features deep interactive sequences and transition engines, including a retro *Doom* sequence and a customizable mood game.

---

## 🛠️ Engineering Tech Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Framework & Language** | React 19, TypeScript, Vite |
| **Styling & Layout** | Tailwind CSS, Fluid Grid systems |
| **3D & Math Pipeline** | Three.js, Custom WebGL (GLSL Shaders), `paperMath` |
| **Motion & Physics** | GSAP (GreenSock), Anime.js, Framer Motion (`motion/react`) |
| **Audio Pipeline** | HTML5 Web Audio API, `soundManager` wrapper |
| **Data Engine** | JSON-driven modular state schemas |

---

## 📁 Repository Structure

```bash
├── src/
│   ├── components/
│   │   ├── PaperIntro/         # 3D WebGL crumple scene & physics animation
│   │   ├── Portfolio/          # Portfolio views (Hero, About, Projects, Resume, Contact)
│   │   ├── UI/                 # Motion components (Typewriter, ScrollReveal, TextReveal)
│   │   ├── MoodGame/           # Interactive mood sequences & dynamic HUD
│   │   └── DoomEasterEgg/      # Retro transition animations
│   ├── hooks/                  # Custom react hooks (active section, sound controller, shortcuts)
│   ├── utils/                  # Paper textures, sound manager, physics helpers, watermark
│   ├── data/                   # Modular JSON resume & project states
│   ├── main.tsx                # Client entry point
│   └── index.css               # Global tailwind base layer & performance styles
├── public/                     # Audio assets, fonts, textures, and static media
├── package.json                # Project dependencies & startup scripts
└── README.md                   # Project documentation
```

---

## 💻 Local Development

Follow these steps to run the portfolio locally on your machine:

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
   The local environment will boot at `http://localhost:3000`.

4. **Compile and build for production:**
   ```bash
   npm run build
   ```
   This generates a highly optimized static bundle inside the `dist/` directory.

---

## 📄 Licensing

This project is open-source and licensed under the [MIT License](LICENSE).
