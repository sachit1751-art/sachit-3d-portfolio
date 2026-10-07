import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, User, Bot, Loader2, MessageSquare, Trash2, RotateCcw, FileText, ExternalLink, Minus, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollReveal } from '../UI/ScrollReveal';
import { WordReveal } from '../UI/TextReveal';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useConversationContext } from '../../hooks/useConversationContext';
import { PaperTheme, PaperState } from '../../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatAboutMeProps {
  theme?: PaperTheme;
  paperState?: PaperState;
  mode?: 'full' | 'compact-floating';
  activeTab?: string;
}

const INITIAL_MESSAGE: Message = { 
  role: 'model', 
  content: "Hi! I'm Sachit's AI portfolio assistant. Ask me anything about his full-stack projects, AI tooling, web and mobile development, or software engineering philosophy!" 
};

const PREMADE_RESPONSES: Record<string, string> = {
  "tell me about sachit": `### About Sachit
Sachit is a **Full-Stack Web Developer**, **AI & Automation Builder**, and high school student (Class 12 PCMB) based in India.

- **Philosophy:** *"Build what you want to understand"* — he learns directly by designing and deploying real software from the ground up.
- **Specializations:** React/TypeScript full-stack applications, LLM agent integration & tooling, Android ROM/Kernel development, and automated workflows.
- **Projects:** Creator of popular open-source projects including **SKY ROMs** (50,000+ downloads), **MoneyPal**, **Audify**, and custom **MCP tools**.`,

  "what is his core philosophy?": `### Core Engineering Philosophy
Sachit approaches software with five foundational principles:

1. **Build What You Want to Understand:** True learning comes from building real applications, facing production constraints, and debugging edge cases rather than only reading documentation.
2. **Keep It Simple:** Software shouldn't carry unnecessary bloat. Interfaces and architectures should be clean, understandable, and maintainable.
3. **Experiment & Break Things:** Rapid prototyping and testing ideas quickly is the best way to uncover novel solutions.
4. **Design & Tactility Matter:** Engineering and aesthetic experience are deeply connected.
5. **Continuous Learning:** Constantly adapting to modern toolchains, LLMs, and ecosystem advancements.`,

  "what is class 12 pcmb?": `### Class 12 — PCMB
**PCMB** stands for **Physics, Chemistry, Mathematics, and Biology** — one of the most rigorous and comprehensive high school STEM curricula in India.

Sachit balances this demanding academic foundation with daily hands-on software development, applying deep analytical thinking and mathematical rigor to algorithmic challenges, 3D WebGL computation, and AI system design.`,

  "where is he based?": `### Location & Availability
- **Location:** India (Remote)
- **Work Mode:** Open to **remote full-stack engineering roles**, **AI integration contracts**, and collaborative open-source ventures.
- **Timezones:** Experienced with asynchronous collaboration across international timezones.`,

  "explain 'learn by building'": `### 'Learn by Building'
Rather than consuming endless tutorials in isolation, Sachit starts with a clear problem or creative vision:
1. **Idea:** Identify an unsolved friction point or novel concept.
2. **Architecture:** Research and assemble the appropriate stack from first principles.
3. **Iteration:** Code the system, encounter real-world edge cases, and refine the architecture until it is rock-solid.`,

  "how does he view ai?": `### Perspective on AI
Sachit views modern AI (LLMs, Model Context Protocol, and agentic workflows) as an **active multiplier** for software engineering:
- **Pragmatic Tooling:** Using AI to automate repetitive workflows, enhance user interfaces, and build context-aware systems.
- **Not Just Wrappers:** Focusing on deep system architecture, streaming resilience, grounding, and domain-specific MCP agents rather than superficial chatbots.`,

  "how was this portfolio built?": `### Portfolio Architecture & Tech Stack
This interactive paper portfolio was engineered from scratch with a custom technical stack:

- **Frontend Core:** React 18, TypeScript, Vite, Tailwind CSS
- **3D & Graphics Engine:** Three.js custom vertex shaders for procedural paper deformation, folds, and crumple physics
- **Animation Pipeline:** GSAP timelines & Framer Motion / Motion for tactile spring physics
- **Audio Engine:** Web Audio API synthesizer for procedural real-time paper rustling & slide acoustics
- **Backend & AI:** Express Node.js server with Google Gemini 3.8 Flash streaming via Server-Sent Events (SSE)`,

  "what is the tactile paper theme?": `### Tactile Skeuomorphic Paper Theme
The design is built around real-world physical stationery concepts:

- **Materials:** Kraft paper, Blueprint grid, Graph paper, and Midnight dark parchment
- **Physics:** Procedural crumple meshes, shadows, corner curl animations, and notebook margins
- **Sound:** Dynamic acoustic feedback on clicks, unfolds, and switches using synthesized white noise and resonance filters`,

  "tell me about sky roms": `### SKY ROMs
**SKY ROMs** is a flagship Android customization project created and maintained by Sachit.

- **Scale:** **50,000+ total downloads** worldwide across custom ROM and recovery releases.
- **Technical Scope:** Device trees, custom kernel optimizations, CPU governor tuning, battery life balancing, and low-level Android OS compiling.
- **Community:** Active support across developer forums and Telegram channels with extensive device compatibility.`,

  "what is moneypal?": `### MoneyPal
**MoneyPal** is a lightweight, privacy-conscious personal finance tracker designed for speed and clarity.

- **Features:** Expense categorization, cash-flow visualization, recurring subscription tracking, and instant transaction logging.
- **Stack:** Modern React, TypeScript, Tailwind CSS, and local-first persistent storage.`,

  "tell me about audify": `### Audify
**Audify** is a sleek, distraction-free audio player and waveform manager.

- **Key Highlights:** Real-time Web Audio API waveform visualization, metadata/ID3 tag parsing, zero latency local playback, and playlist curation.`,

  "what is the mcp tool project?": `### MCP Tool Suite
A high-performance **Model Context Protocol (MCP)** implementation designed to bridge LLMs with real-world developer tools and environments.

- **Capabilities:** Exposes file system operations, API proxies, Git repository inspection, and automated shell command runners securely to agentic AI models.`,

  "what programming languages does he know?": `### Programming Languages
- **TypeScript & JavaScript:** Advanced (Full-stack React, Node.js, Next.js, Express, Three.js)
- **Python:** Advanced (AI tooling, scripting, backend APIs, automation)
- **Kotlin / Java:** Intermediate-Advanced (Android application development & system ROMs)
- **C / C++:** Foundations (Kernel optimizations & low-level performance)
- **SQL & Shell Scripting:** PostgreSQL, SQLite, Bash/Zsh automation`,

  "what frontend frameworks does he use?": `### Frontend Stack
- **Frameworks:** React 18, Next.js, Vite
- **Styling:** Tailwind CSS, PostCSS, CSS Modules
- **Animation & Graphics:** Three.js, GSAP, Motion (Framer Motion), Canvas 2D
- **State & Routing:** React Hooks, Context API, lightweight reactive stores`,

  "what backend technologies does he know?": `### Backend & Systems
- **Runtimes:** Node.js, Express, Python (FastAPI / Flask)
- **Databases:** PostgreSQL, SQLite, Redis, Firebase Firestore
- **Protocols:** REST, SSE (Server-Sent Events), WebSockets, JSON-RPC (MCP)
- **DevOps:** Docker, Linux / Unix scripting, Git, CI/CD Actions`,

  "what ai tools does he use?": `### AI Stack & Tooling
- **SDKs & APIs:** Google GenAI SDK (\`@google/genai\`), Gemini 3.8 / 3.1 Flash, OpenAI API, Anthropic Claude API
- **Protocols & Frameworks:** Model Context Protocol (MCP), LangChain, LlamaIndex, Ollama (Local LLMs)
- **Developer Ergonomics:** Cursor IDE, GitHub Copilot, Gemini Code Assist, Hugging Face Transformers`,

  "tell me about his automation workflows": `### Automation & Tooling
Sachit designs automation scripts and agentic tools to eliminate repetitive manual friction:
- **CLI Utilities:** Custom Node.js & Python terminal tools for project scaffolding and file transformations
- **Data Scraping & Extraction:** High-throughput async scrapers with structured JSON output
- **Build & CI Pipelines:** Automated deployment pipelines and asset bundling workflows`,

  "what are his greatest developer strengths?": `### Key Developer Strengths
1. **Full-Stack Breadth:** Able to jump from low-level Android kernel tweaks and WebGL shaders to modern React UI and Node backend APIs.
2. **Speed of Execution:** Translating concepts into functional working code with clean architectures in record time.
3. **Autonomous Problem Solving:** Figuring out unfamiliar technologies from documentation and source code without hand-holding.
4. **Design Discipline:** Strong eye for typography, micro-interactions, responsive ergonomics, and polish.`,

  "what projects has he built?": `### Selected Projects
1. **SKY ROMs:** Android custom OS & recovery ecosystem with 50,000+ users.
2. **MoneyPal:** Minimalist, fast personal financial analytics dashboard.
3. **Audify:** Web Audio waveform visualizer & offline sound workstation.
4. **MCP Tool Suite:** Model Context Protocol agents & tools for AI workflows.
5. **Tactile Paper Portfolio:** Interactive 3D paper simulation with custom physics, theme synthesizer, and embedded AI assistant.`,

  "what are his core focus areas?": `### Core Focus Areas
- **Full-Stack Web Engineering:** Clean, production-grade applications using React, TypeScript, and modern backend runtimes.
- **AI & Agentic Systems:** Context injection, streaming protocols, and MCP server integrations.
- **Mobile & Android Development:** Native Android tooling, custom ROM development, and cross-platform UI.
- **Developer Automation:** Workflow scripts, CI/CD pipelines, and local developer productivity tools.`,

  "what is he currently studying?": `### Current Studies
Sachit is currently in **Class 12** pursuing **PCMB** (Physics, Chemistry, Mathematics, Biology), combining rigorous academic STEM studies with practical software engineering.`,

  "what subjects are in pcmb?": `### PCMB Subjects
- **Physics:** Mechanics, Electromagnetism, Optics, Modern Physics
- **Chemistry:** Organic, Inorganic, Physical Chemistry
- **Mathematics:** Calculus, Vectors, 3D Geometry, Linear Algebra, Probability
- **Biology:** Genetics, Molecular Biology, Physiology, Biotechnology`,

  "how does he balance studies and coding?": `### Balancing Academics & Development
Sachit practices focused time management:
- Allocating dedicated blocks for rigorous STEM coursework (Physics, Chemistry, Math, Biology).
- Channeling practical programming sessions as creative engineering outlets, applying mathematical principles (matrices, vectors, trigonometry) directly into WebGL and game simulation algorithms.`,

  "how can i contact sachit?": `### Contact Channels
- **Email:** [sachit1771@gmail.com](mailto:sachit1771@gmail.com)
- **GitHub:** [github.com/Sachit-1771](https://github.com/Sachit-1771)
- **LinkedIn:** [linkedin.com/in/sachit-undefined-975503440](https://www.linkedin.com/in/sachit-undefined-975503440)
- **Instagram:** [@sachit2097](https://www.instagram.com/sachit2097)

He typically responds to emails and messages within 24 hours.`,

  "is he open to remote work?": `### Remote Work & Opportunities
**Yes!** Sachit is actively open to:
- Remote full-stack software development roles & internships
- AI & LLM tooling integrations
- Freelance product development & MVP building
- Open-source collaborations

Reach out directly at **sachit1771@gmail.com** to connect!`,

  "explain the 3-layer architecture": `### 3-Layer Architecture
The portfolio uses a clean decoupled 3-tier structure:
1. **Presentation Layer:** React 18 component tree with Tailwind CSS styling and responsive layout.
2. **Tactile Simulation Layer:** Three.js WebGL canvas + Web Audio API synthesizer for paper deformation and tactile acoustic feedback.
3. **Intelligence Layer:** Server-Sent Events (SSE) AI streaming pipeline with local pre-computed caches and Gemini 3.8 fallback.`,

  "why vite & react 18?": `### Why Vite & React 18?
- **Vite:** Sub-millisecond HMR, lightning-fast ES module builds, and minimal configuration overhead.
- **React 18:** Concurrent rendering, transition updates, automatic batching, and lightweight memory footprint essential for smooth 60fps WebGL coordination.`,

  "how does sound synthesis work?": `### Web Audio Synthesizer
Rather than loading static MP3 files, the audio engine synthesizes sounds procedurally:
- **White Noise Buffers:** Filtered through bandpass curves to create realistic paper friction and sliding textures.
- **Oscillator Envelopes:** Exponential decay envelopes for crisp mechanical clicks and switches with zero bandwidth overhead.`
};

function findPremadeAnswer(query: string): string | null {
  const normalized = query.trim().toLowerCase().replace(/['"?!.]/g, '');
  for (const [key, answer] of Object.entries(PREMADE_RESPONSES)) {
    const normKey = key.toLowerCase().replace(/['"?!.]/g, '');
    if (normalized === normKey || normalized.includes(normKey) || normKey.includes(normalized)) {
      return answer;
    }
  }
  return null;
}

const SUGGESTIONS: Record<string, string[]> = {
  hero: ["Tell me about Sachit", "What is his core philosophy?", "How was this portfolio built?", "What are his greatest developer strengths?"],
  about: ["What is Class 12 PCMB?", "Where is he based?", "How does he balance studies and coding?", "What are his core focus areas?"],
  philosophy: ["Explain 'Learn by Building'", "How does he view AI?", "What is the tactile paper theme?", "What is his core philosophy?"],
  projects: ["Tell me about SKY ROMs", "What is MoneyPal?", "Tell me about Audify", "What is the MCP Tool project?", "What projects has he built?"],
  skills: ["What programming languages does he know?", "What frontend frameworks does he use?", "What backend technologies does he know?", "What AI tools does he use?", "Tell me about his automation workflows"],
  experience: ["What projects has he built?", "What are his core focus areas?", "Tell me about SKY ROMs", "Is he open to remote work?"],
  education: ["What is he currently studying?", "What subjects are in PCMB?", "What is Class 12 PCMB?", "How does he balance studies and coding?"],
  contact: ["How can I contact Sachit?", "Is he open to remote work?", "Where is he based?"],
};

const STRUCTURE_SUGGESTIONS: Record<string, string[]> = {
  architecture: ["Explain the 3-layer architecture", "How does paper unfold work?", "Explain the event pipelines"],
  'file-structure': ["Explain the component directory", "Where is WebGL initialized?", "How are sound hooks organized?"],
  'tech-stack': ["Why Vite & React 18?", "What is used for 3D graphics?", "Tell me about Tailwind setup"],
  animation: ["Explain the GSAP & Three.js loop", "How is 60fps locked?", "Explain SVG path compositor"],
  performance: ["How is WebGL GPU throttled?", "Explain CSS contain: content", "What is pixel ratio capping?"],
  decisions: ["Why the tactile paper theme?", "Explain Typography choices", "Why no generic UI clichés?"],
  'mood-game': ["What is the MOOD game easter egg?", "How is it triggered?", "Explain the game loop"],
  procedural: ["How does paper crumple generation work?", "Explain vertex noise", "How are normals computed?"],
  settings: ["How does sound synthesis work?", "What themes are supported?", "How are preferences stored?"],
};

export const ChatAboutMe = memo<ChatAboutMeProps>(({ 
  theme = 'kraft', 
  paperState = 'opened',
  mode = 'full',
  activeTab = 'architecture'
}) => {
  const activeSection = useActiveSection();
  const effectiveRoute = mode === 'compact-floating' ? `structure-room:${activeTab}` : undefined;
  const { contextPayload } = useConversationContext({ 
    theme, 
    paperState,
    activeRoute: effectiveRoute
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('portfolio-chat-history');
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  const userScrolledAwayRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const compactScrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Intent-based Scroll Observer (Rule 1 & 2: Move only when asked, follow only while following)
  const handleScrollContainer = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isAtBottom = distanceFromBottom <= 45;

    if (!isAtBottom) {
      userScrolledAwayRef.current = true;
      setIsUserScrolledUp(true);
    } else {
      userScrolledAwayRef.current = false;
      setIsUserScrolledUp(false);
    }
  };

  // Text selection detector (Rule 3: Selecting text or interacting stops auto-scroll)
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const activeContainer = scrollRef.current || compactScrollRef.current;
        if (activeContainer && activeContainer.contains(selection.anchorNode)) {
          userScrolledAwayRef.current = true;
          setIsUserScrolledUp(true);
        }
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const scrollToBottom = (instant = false) => {
    const activeContainer = mode === 'compact-floating' ? compactScrollRef.current : scrollRef.current;
    if (activeContainer) {
      activeContainer.scrollTo({
        top: activeContainer.scrollHeight,
        behavior: instant ? 'auto' : 'smooth'
      });
      userScrolledAwayRef.current = false;
      setIsUserScrolledUp(false);
    }
  };

  const jumpToLiveStream = () => {
    userScrolledAwayRef.current = false;
    setIsUserScrolledUp(false);
    scrollToBottom(false);
  };

  const isInitialMount = useRef(true);

  useEffect(() => {
    localStorage.setItem('portfolio-chat-history', JSON.stringify(messages));
    userScrolledAwayRef.current = false;
    setIsUserScrolledUp(false);
    if (isInitialMount.current) {
      isInitialMount.current = false;
      scrollToBottom(true);
    } else {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (isLoading || isStreaming) {
      userScrolledAwayRef.current = false;
      setIsUserScrolledUp(false);
      scrollToBottom();
    }
  }, [isLoading, isStreaming]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || isStreaming) return;

    const userMessage = content.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    // Rule 1 & 4: User explicitly initiated a new turn - reset scroll lock to follow
    userScrolledAwayRef.current = false;
    setIsUserScrolledUp(false);

    // Check if we have a premade high-quality answer to save tokens
    const premade = findPremadeAnswer(userMessage);
    if (premade) {
      setMessages([...newMessages, { role: 'model', content: '' }]);
      setIsLoading(false);
      setIsStreaming(true);

      const words = premade.split(' ');
      let cur = 0;
      let streamed = '';

      const timer = setInterval(() => {
        if (cur < words.length) {
          streamed += (cur === 0 ? '' : ' ') + words[cur];
          cur++;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'model', content: streamed };
            return updated;
          });
          if (!userScrolledAwayRef.current) {
            scrollToBottom();
          }
        } else {
          clearInterval(timer);
          setIsStreaming(false);
        }
      }, 20);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          activeSection: activeSection,
          conversationContext: contextPayload,
          stream: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || 'Failed to fetch response';
        throw new Error(errorMessage);
      }

      if (response.headers.get('Content-Type')?.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let buffer = '';

        // Add model placeholder message to stream into
        setMessages([...newMessages, { role: 'model', content: '' }]);
        setIsLoading(false);
        setIsStreaming(true);

        let streamFinished = false;

        while (!streamFinished) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              streamFinished = true;
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                accumulatedText = parsed.error;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'model', content: accumulatedText };
                  return updated;
                });
              } else if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'model', content: accumulatedText };
                  return updated;
                });
                if (!userScrolledAwayRef.current) {
                  scrollToBottom();
                }
              }
            } catch {
              // Ignore single token parsing errors
            }
          }
        }

        // If no text was accumulated, provide a helpful default
        if (!accumulatedText.trim()) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { 
              role: 'model', 
              content: "I'm ready to answer any questions about Sachit's projects (like SKY ROMs, MoneyPal, Audify, and the MCP Tool), technical skills, or background. What would you like to know?" 
            };
            return updated;
          });
        }
      } else {
        const data = await response.json();
        setMessages([...newMessages, { role: 'model', content: data.text || "Hello! How can I assist you?" }]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { 
        role: 'model', 
        content: `**Notice:** ${error.message || "I'm having trouble connecting right now."}\n\nFeel free to explore Sachit's projects above or ask about his tech stack!` 
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;
    const content = input;
    setInput('');
    await sendMessage(content);
  };

  const handleClearChat = () => {
    if (confirmClear) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('portfolio-chat-history');
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  // Compact Floating Mode for Structure Room to avoid blocking architecture flow charts
  if (mode === 'compact-floating') {
    if (isMinimized) {
      return (
        <div className="fixed bottom-5 right-5 z-50 pointer-events-auto">
          <motion.button
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl border font-mono text-xs uppercase tracking-wider cursor-pointer"
            style={{
              backgroundColor: 'var(--c-surface)',
              borderColor: 'var(--c-border)',
              color: 'var(--c-heading)',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(12px)'
            }}
            title="Open Architecture Assistant"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <Bot size={15} className="text-amber-500" />
            <span className="font-bold">Architecture AI</span>
            <MessageSquare size={12} className="opacity-50 ml-1" />
          </motion.button>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] max-h-[75vh] rounded-2xl overflow-hidden flex flex-col pointer-events-auto shadow-2xl border"
        style={{
          backgroundColor: 'var(--c-card)',
          borderColor: 'var(--c-border)',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(16px)'
        }}
      >
        {/* Floating Header Bar */}
        <div 
          className="px-3.5 py-2.5 border-b flex items-center justify-between gap-2 flex-shrink-0"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80" style={{ color: 'var(--c-heading)' }}>
              Architecture AI
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleClearChat}
              className={`p-1 rounded text-[10px] font-mono transition-colors ${
                confirmClear 
                  ? 'bg-red-500/20 text-red-500 font-bold border border-red-500/40' 
                  : 'opacity-50 hover:opacity-100 hover:text-red-500 cursor-pointer'
              }`}
              title={confirmClear ? "Click again to confirm reset" : "Clear conversation"}
            >
              {confirmClear ? "Reset?" : <RotateCcw size={13} />}
            </button>
            <button 
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded transition-colors opacity-60 hover:opacity-100 cursor-pointer"
              style={{ color: 'var(--c-heading)' }}
              title="Minimize to avoid blocking architecture flow charts"
            >
              <Minus size={15} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={compactScrollRef}
          onScroll={handleScrollContainer}
          className="flex-1 overflow-y-auto p-3 space-y-3.5 custom-scrollbar relative"
          style={{ 
            backgroundImage: 'radial-gradient(var(--c-dot) 0.5px, transparent 0.5px)', 
            backgroundSize: '24px 24px',
            scrollBehavior: userScrolledAwayRef.current ? 'auto' : 'smooth',
            overflowAnchor: 'auto'
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[92%] gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
                    style={{ 
                      backgroundColor: m.role === 'user' ? 'var(--c-btn-bg)' : 'var(--c-input-bg)',
                      border: '1px solid var(--c-border)',
                      color: m.role === 'user' ? 'var(--c-btn-text)' : 'var(--c-heading)'
                    }}
                  >
                    {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div 
                    className={`p-2.5 sm:p-3 rounded-xl shadow-sm text-xs sm:text-[13px] ${
                      m.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
                    style={{ 
                      backgroundColor: m.role === 'user' ? 'var(--c-btn-bg)' : 'var(--c-bg)',
                      color: m.role === 'user' ? 'var(--c-btn-text)' : 'var(--c-body)',
                      border: '1px solid var(--c-border)',
                      lineHeight: '1.6'
                    }}
                  >
                    {m.role === 'user' ? (
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    ) : (
                      <div className="markdown-body prose prose-xs max-w-none prose-neutral dark:prose-invert text-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start pb-2">
              <div className="flex gap-2 items-center text-xs opacity-60 font-mono">
                <Bot size={14} className="animate-spin text-amber-500" />
                <span>Analyzing blueprint...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-px" />

          {/* Jump to Live Stream Pill (Screenshot Principle 1 & 2: Follow only while following) */}
          <AnimatePresence>
            {isUserScrolledUp && (
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                onClick={jumpToLiveStream}
                className="sticky bottom-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-xl border cursor-pointer hover:scale-105 transition-all"
                style={{
                  backgroundColor: 'var(--c-card)',
                  borderColor: 'var(--c-border-hover)',
                  color: 'var(--c-heading)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>Live stream active · Jump to bottom ↓</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Suggested Questions */}
        <div className="px-2.5 py-1.5 bg-[var(--c-bg)] border-t border-b overflow-x-auto custom-scrollbar-hide flex-shrink-0" style={{ borderColor: 'var(--c-border)' }}>
          <div className="flex gap-1.5 min-w-max">
            {(STRUCTURE_SUGGESTIONS[activeTab || 'architecture'] || STRUCTURE_SUGGESTIONS.architecture).map((suggestion, idx) => (
              <button
                key={`sr-${activeTab}-${idx}`}
                onClick={() => sendMessage(suggestion)}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--c-input-bg)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-muted)'
                }}
                disabled={isLoading || isStreaming}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <form 
          onSubmit={handleSubmit}
          className="p-2.5 border-t relative z-10 flex-shrink-0"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this diagram..."
              className="w-full py-2 px-3 pr-10 rounded-lg border outline-none text-xs"
              style={{ 
                backgroundColor: 'var(--c-bg)',
                borderColor: 'var(--c-border)',
                color: 'var(--c-body)'
              }}
              disabled={isLoading || isStreaming}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isStreaming}
              className="absolute right-1.5 p-1.5 rounded-md transition-all active:scale-95 disabled:opacity-30 cursor-pointer"
              style={{ 
                backgroundColor: 'var(--c-btn-bg)',
                color: 'var(--c-btn-text)'
              }}
            >
              {isLoading || isStreaming ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <ScrollReveal>
      <section id="chat-about-me" className="relative mb-16 sm:mb-20 pt-8 sm:pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-8 text-center">
          <span className="font-mono text-xs font-semibold tracking-widest uppercase block mb-2" style={{ color: 'var(--c-muted)' }}>
            11. Interactive Assistant
          </span>
          <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Chat About Me" baseDelay={0.1} />
          </h2>
        </div>

        <div 
          className="mx-auto max-w-3xl rounded-[var(--radius-xl)] overflow-hidden flex flex-col h-[520px] sm:h-[580px] relative shadow-lg"
          style={{ 
            backgroundColor: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header Bar */}
          <div 
            className="px-4 py-3 border-b flex items-center justify-between gap-3 flex-shrink-0"
            style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-mono font-bold uppercase tracking-wider truncate" style={{ color: 'var(--c-heading)' }}>
                  Sachit AI Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                type="button"
                onClick={handleClearChat}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  confirmClear 
                    ? 'bg-red-500/20 text-red-500 font-bold border border-red-500/40' 
                    : 'hover:border-[var(--c-border-focus)]'
                }`}
                style={{
                  backgroundColor: confirmClear ? undefined : 'var(--c-card)',
                  border: confirmClear ? undefined : '1px solid var(--c-border)',
                  color: confirmClear ? undefined : 'var(--c-subtle)'
                }}
                title={confirmClear ? "Click again to confirm reset" : "Clear chat history"}
              >
                <RotateCcw size={11} />
                <span>{confirmClear ? "Confirm?" : "Clear"}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            onScroll={handleScrollContainer}
            className="sr-editorial-content flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar relative"
            style={{ 
              backgroundImage: 'radial-gradient(var(--c-dot) 0.5px, transparent 0.5px)', 
              backgroundSize: '28px 28px',
              scrollBehavior: userScrolledAwayRef.current ? 'auto' : 'smooth',
              overflowAnchor: 'auto'
            }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.22,
                    ease: "easeOut"
                  }}
                  className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex w-full sm:max-w-[85%] gap-2.5 sm:gap-3.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs"
                      style={{ 
                        backgroundColor: m.role === 'user' ? 'var(--c-btn-bg)' : 'var(--c-input-bg)',
                        border: '1px solid var(--c-border)',
                        color: m.role === 'user' ? 'var(--c-btn-text)' : 'var(--c-heading)'
                      }}
                    >
                      {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div 
                      className={`p-3.5 sm:p-4 rounded-2xl w-full text-xs sm:text-sm ${
                        m.role === 'user' 
                          ? 'rounded-tr-none font-body shadow-xs' 
                          : 'rounded-tl-none font-body shadow-xs'
                      }`}
                      style={{ 
                        backgroundColor: m.role === 'user' ? 'var(--c-btn-bg)' : 'var(--c-bg)',
                        color: m.role === 'user' ? 'var(--c-btn-text)' : 'var(--c-body)',
                        border: '1px solid var(--c-border)',
                        lineHeight: '1.65'
                      }}
                    >
                      {m.role === 'user' ? (
                        <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      ) : (
                        <div className="relative group">
                          <div className="markdown-body prose prose-sm max-w-none prose-neutral dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.content}
                            </ReactMarkdown>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(m.content, i)}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md shadow-xs text-xs font-mono flex items-center gap-1 cursor-pointer"
                            style={{
                              backgroundColor: 'var(--c-card)',
                              border: '1px solid var(--c-border)',
                              color: 'var(--c-heading)'
                            }}
                            title="Copy response to clipboard"
                          >
                            {copiedIndex === i ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex justify-start pb-2 w-full"
              >
                <div className="flex gap-2.5 sm:gap-3.5 w-full sm:max-w-[85%]">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
                  >
                    <Bot size={14} className="animate-spin text-amber-500" />
                  </div>
                  <div 
                    className="p-3 sm:p-3.5 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-xs"
                    style={{ backgroundColor: 'var(--c-bg)', border: '1px solid var(--c-border)' }}
                  >
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-75" />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-150" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider opacity-60 font-medium" style={{ color: 'var(--c-heading)' }}>
                      Assistant is typing...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-px" />

            {/* Jump to Live Stream Pill */}
            <AnimatePresence>
              {isUserScrolledUp && (
                <motion.button
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  onClick={jumpToLiveStream}
                  className="sticky bottom-2 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 shadow-xl border cursor-pointer hover:scale-105 transition-all"
                  style={{
                    backgroundColor: 'var(--c-card)',
                    borderColor: 'var(--c-border-focus)',
                    color: 'var(--c-heading)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Jump to latest message ↓</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Prompt Suggestions */}
          <div 
            className="px-3 py-2 border-t overflow-x-auto custom-scrollbar-hide flex-shrink-0" 
            style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-card)' }}
          >
            <div className="flex items-center gap-1.5 min-w-max">
              <span className="text-[10px] font-mono uppercase tracking-wider opacity-60 mr-1 flex items-center gap-1" style={{ color: 'var(--c-muted)' }}>
                <span>💡 Suggestions:</span>
              </span>
              {(SUGGESTIONS[activeSection] || SUGGESTIONS.projects || []).map((suggestion, idx) => (
                <button
                  key={`full-${activeSection}-${idx}`}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all hover:border-[var(--c-border-focus)] active:scale-95 disabled:opacity-50 cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--c-input-bg)',
                    border: '1px solid var(--c-border)',
                    color: 'var(--c-heading)'
                  }}
                  disabled={isLoading || isStreaming}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 border-t relative z-10 flex-shrink-0"
            style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
          >
            <div className="relative flex items-center max-w-3xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Sachit's projects, tech stack, or philosophy..."
                className="w-full py-3 sm:py-3.5 pl-4 sm:pl-5 pr-12 rounded-full border outline-none transition-all font-body text-base sm:text-sm focus:border-[var(--c-border-focus)]"
                style={{ 
                  backgroundColor: 'var(--c-bg)',
                  borderColor: 'var(--c-border)',
                  color: 'var(--c-body)'
                }}
                disabled={isLoading || isStreaming}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || isStreaming}
                className="absolute right-1.5 p-2 sm:p-2.5 rounded-full transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--c-btn-bg)',
                  color: 'var(--c-btn-text)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                aria-label="Send message"
              >
                {isLoading || isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      </section>
    </ScrollReveal>
  );
});

ChatAboutMe.displayName = 'ChatAboutMe';

