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
import { useTouchDevice } from '../../hooks/useTouchDevice';
import { ScrollReveal } from '../UI/ScrollReveal';
import { observeElement } from '../../utils/observer';
import { getTechStackSVG } from '../UI/TechIcons';
import { triggerHaptic, HAPTIC_PATTERNS } from '../../utils/haptics';

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
    githubUrl: 'https://github.com/sachit1751-art/MoneyPal',
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
    githubUrl: 'https://github.com/sachit1751-art/Audify',
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
  totalProjects: number;
  isExpanded: boolean;
  onToggleExpand: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void;
  onCardNavigate: (currentIndex: number, e: React.KeyboardEvent<HTMLElement>) => void;
}

const ProjectCard = memo<ProjectCardProps>(({ 
  project, 
  idx, 
  totalProjects,
  isExpanded, 
  onToggleExpand,
  onCardNavigate
}) => {
  const expandedContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const isTouchDevice = useTouchDevice();
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touch = e.changedTouches[0];
    if (touch) {
      const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
      // Guard against scrolling or swiping (only trigger if touch movement < 10px)
      if (deltaX < 10 && deltaY < 10) {
        const target = e.target as HTMLElement;
        // Don't override direct clicks on buttons or anchor tags
        if (!target.closest('a') && !target.closest('button')) {
          triggerHaptic(HAPTIC_PATTERNS.click);
          onToggleExpand(project.id);
        }
      }
    }
    touchStartPos.current = null;
  };

  // Focus trap and auto-focus when modal expands
  useEffect(() => {
    if (isExpanded) {
      lastActiveElementRef.current = document.activeElement as HTMLElement;
      if (expandedContainerRef.current) {
        const focusableElements = expandedContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    } else if (lastActiveElementRef.current && document.contains(lastActiveElementRef.current)) {
      // Gracefully restore focus to the toggle or card trigger upon collapse
      lastActiveElementRef.current.focus();
    }
  }, [isExpanded]);

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (!isExpanded || !expandedContainerRef.current) return;
    if (e.key === 'Tab') {
      const focusableElements = Array.from(
        expandedContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement || !expandedContainerRef.current.contains(document.activeElement)) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement || !expandedContainerRef.current.contains(document.activeElement)) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onToggleExpand(project.id);
      const cardEl = document.getElementById(`project-card-${project.id}`);
      cardEl?.focus();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[340px] md:min-h-[360px] flex flex-col">
      <div
        id={`project-card-${project.id}`}
        data-project-card="true"
        data-project-index={idx}
        data-touch-revealed={isTouchDevice && isExpanded ? 'true' : 'false'}
        tabIndex={0}
        role="article"
        aria-setsize={totalProjects}
        aria-posinset={idx + 1}
        aria-label={`${project.title} (${project.category}, ${project.year}). Press Enter or Space to toggle details. Use arrow keys to navigate projects.`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onToggleExpand(project.id);
          } else {
            onCardNavigate(idx, e);
          }
        }}
        className="gsap-project-card group relative flex flex-col justify-between w-full h-full rounded-[var(--radius-lg)] focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] outline-none transition-all duration-300"
        style={{
          backgroundColor: 'var(--c-card)',
          border: isExpanded ? '1px solid var(--c-border-focus, var(--c-heading))' : '1px solid var(--c-border)',
          padding: 'clamp(1rem, 2vw + 0.5rem, 1.5rem)',
          zIndex: isExpanded ? 10 : 1,
          transform: isTouchDevice && isExpanded ? 'translateY(-4px)' : undefined,
          boxShadow: isTouchDevice && isExpanded ? '0 12px 28px rgba(0,0,0,0.12)' : undefined,
        }}
      >
        <div>
          {/* Header Meta: Category + Index + Touch Affordance Pill */}
          <div className="flex items-center justify-between text-xs font-handwriting mb-3 gap-2" style={{ color: 'var(--c-subtle)' }}>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)]"
                style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
              >
                {project.category}
              </span>
              {isTouchDevice && (
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full transition-all duration-200 animate-pulse"
                  style={{
                    backgroundColor: isExpanded ? 'var(--c-heading)' : 'var(--c-input-bg)',
                    color: isExpanded ? 'var(--c-btn-text)' : 'var(--c-muted)',
                    border: '1px solid var(--c-border)',
                  }}
                >
                  {isExpanded ? 'Tap to close' : 'Tap to reveal'}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-faint)' }}>
              {String(idx + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Project Title & Short Description */}
          <div
            role="button"
            tabIndex={0}
            data-project-title-btn="true"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerHaptic(HAPTIC_PATTERNS.click);
              onToggleExpand(project.id, e);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggleExpand(project.id);
              } else {
                onCardNavigate(idx, e);
              }
            }}
            className="cursor-pointer outline-none group/title focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded-md py-1 select-none"
            aria-label={`Toggle quick details for ${project.title}`}
          >
            <h3 className="font-sans text-xl sm:text-2xl font-bold transition-colors mb-2 flex items-center justify-between tracking-tight" style={{ color: 'var(--c-heading)' }}>
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
            className={`project-details-wrapper transition-all duration-300 ease-in-out print:hidden overflow-hidden ${
              isExpanded ? 'max-h-[600px] opacity-100 my-3' : 'max-h-0 opacity-0 my-0'
            }`}
          >
            <div
              ref={expandedContainerRef}
              onKeyDown={handleModalKeyDown}
              tabIndex={-1}
              role="region"
              aria-label={`${project.title} extended specifications`}
              className="p-4 rounded-[var(--radius-md)] text-xs font-body leading-relaxed space-y-3 outline-none"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                border: '1px solid var(--c-border)',
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
                      rel="noopener noreferrer"
                      data-action="github"
                      className="project-btn-github font-mono text-[11px] font-bold inline-flex items-center gap-1 hover:underline cursor-pointer pointer-events-auto"
                      style={{ color: 'var(--c-heading)' }}
                      onClick={(e) => {
                        console.log(`[ProjectCard] Dropdown 'Source Code' link clicked for project id: ${project.id}, url: ${project.githubUrl}`);
                        e.stopPropagation();
                      }}
                    >
                      <GitHubIcon className="w-3 h-3" />
                      <span>Source Code</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-action="live-demo"
                      className="project-btn-live-demo font-mono text-[11px] font-bold inline-flex items-center gap-1 hover:underline text-emerald-600 dark:text-emerald-400 cursor-pointer pointer-events-auto"
                      onClick={(e) => {
                        console.log(`[ProjectCard] Dropdown 'Live Demo' link clicked for project id: ${project.id}, url: ${project.demoUrl}`);
                        e.stopPropagation();
                      }}
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
        <div className="space-y-3 pt-3 mt-auto relative z-10" style={{ borderTop: '1px solid var(--c-border)' }}>
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
              data-action="quick-details"
              onClick={(e) => {
                console.log(`[ProjectCard] 'Quick Details' clicked for project id: ${project.id} (currently isExpanded: ${isExpanded})`);
                e.preventDefault();
                e.stopPropagation();
                triggerHaptic(HAPTIC_PATTERNS.click);
                onToggleExpand(project.id, e);
              }}
              className="project-btn-quick-details flex-1 min-h-[38px] px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 hover:border-[var(--c-border-focus)] select-none pointer-events-auto relative z-20"
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
                rel="noopener noreferrer"
                data-action="github"
                className={`project-btn-github min-h-[38px] px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 pointer-events-auto relative z-20 ${
                  !project.demoUrl 
                    ? 'hover:brightness-105' 
                    : 'hover:border-[var(--c-border-focus)]'
                }`}
                style={{
                  border: !project.demoUrl ? 'none' : '1px solid var(--c-border)',
                  backgroundColor: !project.demoUrl ? 'var(--c-btn-bg)' : 'var(--c-input-bg)',
                  color: !project.demoUrl ? 'var(--c-btn-text)' : 'var(--c-heading)',
                }}
                onClick={(e) => {
                  console.log(`[ProjectCard] 'GitHub Code' link clicked for project id: ${project.id}, url: ${project.githubUrl}`);
                  e.stopPropagation();
                }}
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
                rel="noopener noreferrer"
                data-action="live-demo"
                className="project-btn-live-demo min-h-[38px] px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:brightness-105 active:scale-95 pointer-events-auto relative z-20"
                style={{
                  backgroundColor: 'var(--c-btn-bg)',
                  color: 'var(--c-btn-text)',
                }}
                onClick={(e) => {
                  console.log(`[ProjectCard] 'Live Demo' link clicked for project id: ${project.id}, url: ${project.demoUrl}`);
                  e.stopPropagation();
                }}
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

function getGridColumnCount(container: HTMLElement | null): number {
  if (!container) return 1;
  const cards = container.querySelectorAll<HTMLElement>('[data-project-card="true"]');
  if (cards.length < 2) return 1;
  const firstTop = cards[0].offsetTop;
  let count = 0;
  for (let i = 0; i < cards.length; i++) {
    if (Math.abs(cards[i].offsetTop - firstTop) < 6) {
      count++;
    } else {
      break;
    }
  }
  return count || 1;
}

// author:sachit-2026-original
export const Projects = memo(() => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();

  const toggleExpandCard = useCallback((id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
    }
    console.log(`[Projects] toggleExpandCard invoked for id: '${id}'. Toggling card expansion state.`);
    setExpandedCardId((prev) => {
      const next = prev === id ? null : id;
      console.log(`[Projects] Card expansion updated: previous='${prev}' -> next='${next}'`);
      return next;
    });
  }, []);

  const handleCardNavigate = useCallback((currentIndex: number, e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const isCardContainer = target.getAttribute('data-project-card') === 'true';
    const isCardTitle = target.getAttribute('data-project-title-btn') === 'true';

    // Allow arrow navigation when focused on the card outline or title
    if (!isCardContainer && !isCardTitle) return;

    const total = projects.length;
    let targetIndex: number | null = null;
    const cols = getGridColumnCount(cardsGridRef.current);

    switch (e.key) {
      case 'ArrowRight':
        targetIndex = (currentIndex + 1) % total;
        break;
      case 'ArrowLeft':
        targetIndex = (currentIndex - 1 + total) % total;
        break;
      case 'ArrowDown':
        if (currentIndex + cols < total) {
          targetIndex = currentIndex + cols;
        } else {
          targetIndex = (currentIndex + cols) % total;
        }
        break;
      case 'ArrowUp':
        if (currentIndex - cols >= 0) {
          targetIndex = currentIndex - cols;
        } else {
          targetIndex = (currentIndex - cols + total) % total;
        }
        break;
      case 'Home':
        targetIndex = 0;
        break;
      case 'End':
        targetIndex = total - 1;
        break;
      default:
        return;
    }

    if (targetIndex !== null && targetIndex >= 0 && targetIndex < total) {
      e.preventDefault();
      const targetCard = cardsGridRef.current?.querySelector<HTMLElement>(`[data-project-index="${targetIndex}"]`);
      if (targetCard) {
        targetCard.focus();
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        triggerHaptic(HAPTIC_PATTERNS.dragTick);
      }
    }
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
    <section id="projects" className="relative mb-16 sm:mb-20 pt-8 sm:pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-center mb-2.5">
          <Code2 className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--c-dot)' }} />
        </div>
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-1.5" style={{ color: 'var(--c-muted)' }}>
          [ 03 / PROJECTS ]
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
          <WordReveal text="Featured Projects" baseDelay={0.1} />
        </h2>
      </div>

      {/* Screen reader keyboard instructions */}
      <div className="sr-only" aria-live="polite">
        Use Arrow keys (Up, Down, Left, Right) to navigate between project cards in the grid. Press Enter or Space to open project details, and Escape to close.
      </div>

      <div 
        ref={cardsGridRef} 
        role="region"
        aria-label="Project cards navigation grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start" 
        style={{ gap: 'clamp(1rem, 2.5vw + 0.25rem, 1.5rem)' }}
      >
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            idx={idx}
            totalProjects={projects.length}
            isExpanded={expandedCardId === project.id}
            onToggleExpand={toggleExpandCard}
            onCardNavigate={handleCardNavigate}
          />
        ))}
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';
