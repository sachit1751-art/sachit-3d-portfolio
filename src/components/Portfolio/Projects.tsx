import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
// ​provenance:sachit-2026-original​
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '../../types';
import { ExternalLink, Code2 } from 'lucide-react';
import { GitHubIcon } from '../UI/Icons';
import { AnimatedMenuIcon } from '../UI/AnimatedMenuIcon';
import { WordReveal } from '../UI/TextReveal';
import { usePerformance } from '../../hooks/usePerformance';
import { ScrollReveal } from '../UI/ScrollReveal';
import { observeElement } from '../../utils/observer';
import { getTechStackSVG } from '../UI/TechIcons';

gsap.registerPlugin(ScrollTrigger);

const projects: Project[] = [
  {
    id: 'sky-roms',
    title: 'SKY ROMs',
    category: 'Android & Web',
    filterCategories: ['ANDROID', 'WEB'],
    year: '2025',
    description:
      'Android Custom ROM Discovery & Management Platform for discovering, downloading, comparing, and managing custom ROMs with Supabase backend and Capacitor mobile deployment.',
    longDescription:
      'Built and deployed a full-stack React and TypeScript platform for discovering and managing Android custom ROM information, hosted on Vercel with automated routing, SEO sitemaps, and Google Search Console verification.\n\nDeveloped a secure Supabase and PostgreSQL backend featuring user authentication, role-based authorization, CRUD operations, and persistent cloud storage, ensuring administrative controls and role assignments are enforced strictly server-side.\n\nSynchronized the production web application into a native mobile experience using Capacitor and Android Studio, maintaining version control through Git branching workflows.',
    tags: ['React', 'TypeScript', 'Vite', 'Supabase', 'PostgreSQL', 'Capacitor', 'Android Studio'],
    demoUrl: 'https://sky-roms.vercel.app',
    featured: true,
    stats: { stars: 124, forks: 42, score: 88 }
  },
  {
    id: 'moneypal',
    title: 'MoneyPal',
    category: 'Android & Wear OS',
    filterCategories: ['ANDROID', 'MOBILE'],
    year: '2025',
    description:
      'Engineered MoneyPal as a native Android budget tracker application featuring calculator-style expense entry, flexible budget periods, Wear OS companion app, and interactive widgets.',
    longDescription:
      'Engineered MoneyPal as a native Android budget tracker application featuring calculator-style expense entry, flexible budget periods, and automated recurring expense tracking.\n\nIntegrated interactive home screen widgets and a Wear OS companion app for rapid, wrist-based expense logging and real-time budget monitoring.\n\nUtilized modern Android architecture components including Jetpack Compose for fluid UI design and local Room database persistence for offline-first financial data management.',
    tags: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Room Database', 'Wear OS', 'Git'],
    featured: true,
    stats: { stars: 85, forks: 18, score: 72 }
  },
  {
    id: 'audify',
    title: 'Audify',
    category: 'Web Audio',
    filterCategories: ['WEB'],
    year: '2025',
    description:
      'Developed Audify as a feature-rich, responsive web audio streaming and music player application with fluid playlist controls, Web Audio API hooks, and local caching.',
    longDescription:
      'Developed Audify as a feature-rich, responsive web audio streaming and music player application with fluid playlist controls and real-time track searching.\n\nImplemented custom audio playback hooks utilizing the Web Audio API for smooth track handling, volume management, and dynamic progress bar scrubbing.\n\nConfigured local storage caching and responsive UI styling to maintain user listening preferences and seamless layout adaptation across desktop and mobile devices.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Web Audio API', 'Vite', 'Git'],
    featured: true,
    stats: { stars: 96, forks: 24, score: 79 }
  },
  {
    id: 'mcp-tool',
    title: 'AI-Powered Model Context Protocol (MCP) Tool',
    category: 'AI Tool',
    filterCategories: ['AI', 'AUTOMATION'],
    year: '2025',
    description:
      'MCP server endpoints and JSON-RPC messaging handlers enabling LLMs to securely query local resources.',
    longDescription:
      'Configured Model Context Protocol (MCP) server endpoints to allow large language models to securely query local resources and system datasets.\n\nImplemented clean JSON-RPC messaging handlers to streamline communication between client interfaces and modular backend tools.\n\nDeveloped structured context-injection pipelines that give AI assistants direct, real-time access to file systems and development workspaces.',
    tags: ['Python', 'Claude API', 'MCP Servers', 'JSON-RPC', 'Context Injection'],
    featured: true,
    stats: { stars: 154, forks: 36, score: 92 }
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe Mini Game',
    category: 'Game Dev',
    filterCategories: ['WEB'],
    year: '2025',
    description:
      'Built a standalone browser game with a polished launcher, responsive board, restart controls, difficulty selector, result messages, and clean modern UI.',
    longDescription:
      'Built a standalone browser game with a polished launcher, responsive board, restart controls, difficulty selector, result messages, and clean modern UI.\n\nImplemented Easy and Hard AI modes; Hard mode evaluates open moves with minimax recursion to choose stronger opponent moves. Managed board state, turn locking, delayed AI responses, win/draw detection, reset behavior, and UI feedback so players cannot interrupt the opponent turn.\n\nTech: HTML, CSS, JavaScript, Minimax Algorithm, Browser Game Logic',
    tags: ['HTML', 'CSS', 'JavaScript', 'Minimax', 'Game Logic'],
    featured: false,
    stats: { stars: 32, forks: 7, score: 45 }
  },
];


interface ProjectCardProps {
  project: Project;
  idx: number;
  isExpanded: boolean;
  onToggleExpand: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void;
}

const ProjectCard = memo<ProjectCardProps>(({ project, idx, isExpanded, onToggleExpand }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const expandedContainerRef = useRef<HTMLDivElement>(null);
  const [dynMaxHeight, setDynMaxHeight] = useState('0px');

  // Focus trap and auto-focus when modal expands
  useEffect(() => {
    if (isExpanded && expandedContainerRef.current) {
      const focusableElements = expandedContainerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isExpanded]);

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (!isExpanded || !expandedContainerRef.current) return;
    if (e.key === 'Tab') {
      const focusableElements = expandedContainerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    } else if (e.key === 'Escape') {
      onToggleExpand(project.id);
    }
  };

  useEffect(() => {
    let frameId: number;
    if (isExpanded) {
      const animateOpen = () => {
        if (detailsRef.current) {
          const scrollHeight = detailsRef.current.scrollHeight;
          // Dynamically compute exact scrollHeight with a responsive, scrollable fallback maximum of 350px
          const targetHeight = Math.min(scrollHeight, 350);
          setDynMaxHeight(`${targetHeight}px`);
        }
      };
      frameId = requestAnimationFrame(animateOpen);
    } else {
      const animateClose = () => {
        setDynMaxHeight('0px');
      };
      frameId = requestAnimationFrame(animateClose);
    }
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isExpanded]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = document.getElementById('content-scroll-container');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        root: scroller || null,
        rootMargin: '150px',
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="project-card-aspect-container relative w-full h-full min-h-[320px] sm:min-h-[340px] md:min-h-[360px] aspect-auto flex flex-col"
      style={{
        containIntrinsicSize: '350px 360px',
        contentVisibility: 'auto',
      }}
    >
      {isIntersecting ? (
        <div
          id={`project-card-${project.id}`}
          data-project-card="true"
          data-project-index={idx}
          tabIndex={0}
          role="article"
          aria-label={`${project.title} (${project.category}, ${project.year})`}
          onKeyDown={(e) => {
            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onToggleExpand(project.id);
            }
          }}
          className="gsap-project-card group relative p-5 sm:p-6 flex flex-col justify-between overflow-hidden w-full h-full rounded-[var(--radius-lg)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] outline-none touch-manipulation cursor-pointer"
          style={{
            backgroundColor: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            zIndex: isExpanded ? 10 : 1,
            contain: typeof window !== 'undefined' && window.innerWidth < 768 ? 'layout paint' : 'none',
          }}
        >
          <div>
            {/* Header Meta: Category + Index */}
            <div className="flex items-center justify-between text-xs font-handwriting mb-3" style={{ color: 'var(--c-subtle)' }}>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)]"
                  style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
                >
                  {project.category}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-faint)' }}>
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Project Title & Short Description */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(project.id, e);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleExpand(project.id);
                }
              }}
              className="cursor-pointer outline-none group/title focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded-md py-1 select-none"
              aria-label={`Toggle quick details for ${project.title}`}
            >
              <h3 className="font-sans text-xl sm:text-2xl font-bold transition-colors mb-2 flex items-center justify-between tracking-tight" style={{ color: 'var(--c-heading)', overflow: 'visible' }}>
                <span className="line-clamp-1 pr-1.5" style={{ paddingRight: '0.15em' }}>{project.title}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider opacity-60 ml-2 shrink-0" style={{ color: 'var(--c-muted)' }}>
                  {project.year}
                </span>
              </h3>

              <p
                className="text-sm sm:text-base leading-relaxed mb-4 font-body opacity-85"
                style={{
                  color: 'var(--c-body)',
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  textWrap: 'pretty',
                }}
              >
                {project.description}
              </p>
            </div>

            {/* Print-only Full Details (Always visible on paper) */}
            <div className="hidden print:block mt-4 text-xs leading-relaxed space-y-2 border-t border-gray-100 pt-3">
              <p className="whitespace-pre-line font-body text-gray-700">
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Inline Quick Details Dropdown (UI Only) */}
            <div
              ref={detailsRef}
              className="project-details-wrapper overflow-hidden transition-all duration-300 ease-in-out print:hidden"
              style={{
                height: isExpanded ? 'auto' : '0px',
                maxHeight: dynMaxHeight,
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? '12px' : '0px',
                marginBottom: isExpanded ? '12px' : '0px',
                contain: 'content',
                overflowY: isExpanded ? 'auto' : 'hidden',
              }}
            >
              <div
                ref={expandedContainerRef}
                onKeyDown={handleModalKeyDown}
                tabIndex={-1}
                className="p-4 rounded-[var(--radius-md)] text-xs font-body leading-relaxed space-y-3 outline-none"
                style={{
                  backgroundColor: 'var(--c-input-bg)',
                  border: '1px solid var(--c-border)',
                  contain: 'content',
                }}
              >
                <div>
                  <p className="whitespace-pre-line leading-relaxed" style={{ color: 'var(--c-body)' }}>
                    {project.longDescription || project.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5" style={{ borderTop: '1px solid var(--c-border)' }}>
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-70" style={{ color: 'var(--c-muted)' }}>
                    YEAR: {project.year}
                  </span>
                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] font-bold inline-flex items-center gap-1 hover:underline"
                        style={{ color: 'var(--c-heading)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GitHubIcon className="w-3 h-3" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] font-bold inline-flex items-center gap-1 hover:underline text-emerald-600 dark:text-emerald-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Open Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tech Tags & Quick Action Strip */}
          <div className="space-y-3 pt-3 mt-auto" style={{ borderTop: '1px solid var(--c-border)' }}>
            {/* Tech Badges with Authentic SVG Icons */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => {
                const TechIcon = getTechStackSVG(tag);
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono tracking-wider rounded-[var(--radius-sm)] transition-colors hover:border-[var(--c-border-hover)] select-none"
                    style={{
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-body)',
                      backgroundColor: 'var(--c-input-bg)',
                    }}
                  >
                    <TechIcon className="w-3 h-3 opacity-80 flex-shrink-0" style={{ color: 'var(--c-heading)' }} />
                    <span>{tag}</span>
                  </span>
                );
              })}
            </div>

            {/* Quick Details Action Strip */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(project.id, e);
                }}
                className="flex-1 min-h-[38px] px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 hover:border-[var(--c-border-focus)]"
                style={{
                  border: '1px solid var(--c-border)',
                  backgroundColor: 'var(--c-input-bg)',
                  color: 'var(--c-heading)',
                }}
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? 'Hide Details' : 'Quick Details'}</span>
                <AnimatedMenuIcon isOpen={isExpanded} variant="chevron" size={14} />
              </button>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[38px] px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-[var(--c-border-focus)] active:scale-95"
                  style={{
                    border: '1px solid var(--c-border)',
                    backgroundColor: 'var(--c-input-bg)',
                    color: 'var(--c-heading)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  title="View GitHub Repository"
                  aria-label="View GitHub Repository"
                >
                  <GitHubIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Code</span>
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[38px] px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:brightness-105 active:scale-95"
                  style={{
                    backgroundColor: 'var(--c-btn-bg)',
                    color: 'var(--c-btn-text)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-full rounded-[var(--radius-lg)] animate-pulse"
          style={{
            backgroundColor: 'var(--c-card)',
            border: '1px solid var(--c-border)',
          }}
        />
      )}
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

// author:sachit-2026-original
export const Projects = memo(() => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();

  const toggleExpandCard = useCallback((id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    setExpandedCardId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    if (!cardsGridRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.gsap-project-card');
    if (!cards.length) return;

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (simplify || prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1, clearProps: 'all' });
      return;
    }

    let hasAnimated = false;

    const animateIn = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(cards, { clearProps: 'transform' });
          },
        }
      );
    };

    const scroller = document.getElementById('content-scroll-container');
    const unobserve = observeElement(
      cardsGridRef.current,
      (isIntersecting) => {
        if (isIntersecting) {
          animateIn();
        }
      },
      { root: scroller, threshold: 0.02, rootMargin: '50px' }
    );

    // Fallback: Ensure cards are visible after 250ms
    const fallbackTimer = setTimeout(() => {
      animateIn();
    }, 250);

    return () => {
      if (unobserve) unobserve();
      clearTimeout(fallbackTimer);
    };
  }, [simplify]);

  return (
    <ScrollReveal>
      <section id="projects" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-8">
          <div className="flex justify-center mb-3">
            <Code2 className="w-6 h-6" style={{ color: 'var(--c-dot)' }} />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
            [ 03 / PROJECTS ]
          </span>
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Featured Projects" baseDelay={0.1} />
          </h2>
        </div>

        <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              idx={idx}
              isExpanded={expandedCardId === project.id}
              onToggleExpand={toggleExpandCard}
            />
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
});

Projects.displayName = 'Projects';
