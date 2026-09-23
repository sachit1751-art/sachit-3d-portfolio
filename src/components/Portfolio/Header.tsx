import { useState, useEffect, useCallback, useRef, memo } from 'react';
// ​provenance:sachit-2026-original​
import { PaperTheme } from '../../types';
import { RotateCcw, ArrowUpRight, Sparkles, Compass, Search, FolderClosed } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onRecrumple: () => void;
  onViewResume?: () => void;
  isViewingResume?: boolean;
  onNavigateSection?: (id: string) => void;
  onOpenSiteMap?: () => void;
}

const THEMES: { id: PaperTheme; label: string; color: string }[] = [
  { id: 'cotton', label: 'Cotton White', color: '#fbf9f4' },
  { id: 'kraft', label: 'Kraft Paper', color: '#d6bfa2' },
  { id: 'blueprint', label: 'Studio Blueprint', color: '#1a334d' },
  { id: 'slate', label: 'Obsidian Slate', color: '#232428' },
];

const NAV_ITEMS = [
  { id: 'about', label: 'About', subtitle: 'Background & Principles' },
  { id: 'projects', label: 'Projects', subtitle: 'Engineering Works & Systems' },
  { id: 'skills', label: 'Skills', subtitle: 'Core Stack & Architecture' },
  { id: 'building-in-public', label: 'Journal', subtitle: 'Engineering Logs & Updates' },
  { id: 'contact', label: 'Contact', subtitle: 'Direct Transmission & Inquiry' },
  { id: 'resume', label: 'Resume', subtitle: 'Curriculum Vitae & Experience', isResume: true },
];

// All section IDs in DOM order — used for scroll-based active detection
const ALL_SECTIONS = [
  'hero',
  'about',
  'philosophy',
  'projects',
  'skills',
  'currently-building',
  'github',
  'experience',
  'education',
  'strengths',
  'building-in-public',
  'contact',
];

// ﻿author:sachit-2026-original﻿
export const Header = memo<HeaderProps>(({
  theme,
  setTheme,
  onRecrumple,
  onViewResume,
  isViewingResume = false,
  onNavigateSection,
  onOpenSiteMap,
}) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const isScrollingRef = useRef(false);
  const navBtns = useRef<Record<string, HTMLButtonElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const currentActive = isViewingResume ? 'resume' : activeSection;

  // ── Measure active indicator position ────────────────────────────────
  useEffect(() => {
    const btn = navBtns.current[currentActive];
    const nav = navContainerRef.current;
    if (!btn || !nav) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicatorStyle({
      left: btnRect.left - navRect.left,
      width: btnRect.width,
    });
  }, [currentActive]);

  // ── Scroll to section & update URL hash ────────────────────────────
  const handleNavClick = useCallback((id: string, isResume?: boolean) => {
    if (isResume) {
      if (onViewResume) onViewResume();
      return;
    }

    // Set active immediately so the underline moves on click
    setActiveSection(id);

    // Update URL hash smoothly for standard SPA routing
    try {
      const targetUrl = id === 'hero'
        ? window.location.pathname + window.location.search
        : `${window.location.pathname}${window.location.search}#${id}`;
      window.history.pushState(null, '', targetUrl);
    } catch {
      // Fallback if pushState fails
    }

    // Mark as programmatic scroll — suppress observer updates during smooth animation
    isScrollingRef.current = true;

    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const container = document.getElementById('content-scroll-container');
      const target = document.getElementById(id);
      if (container && target) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = targetRect.top - containerRect.top + container.scrollTop - 72; // 72px header height
        container.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }

    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, [onViewResume, onNavigateSection]);

  // ── Intersection Observer — detect active section & update URL hash ───
  useEffect(() => {
    const container = document.getElementById('content-scroll-container');
    if (!container) return;

    // Track visibility ratio of each section
    const visibleSections = new Map<string, number>();

    const observerOptions: IntersectionObserverInit = {
      root: container,
      rootMargin: '-70px 0px -40% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    };

    const updateHashAndSection = (sectionId: string) => {
      setActiveSection(sectionId);
      if (!isScrollingRef.current && !isViewingResume) {
        const targetHash = sectionId === 'hero' ? '' : `#${sectionId}`;
        const currentHash = window.location.hash;
        if (currentHash !== targetHash && !(sectionId === 'hero' && !currentHash)) {
          const newUrl = sectionId === 'hero'
            ? window.location.pathname + window.location.search
            : `${window.location.pathname}${window.location.search}#${sectionId}`;
          window.history.replaceState(null, '', newUrl);
        }
      }
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.target.id) {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        }
      });

      if (isScrollingRef.current) return;

      if (visibleSections.size > 0) {
        let maxRatio = -1;
        let bestSection = 'hero';

        // Check sections in DOM order to prefer earlier sections if tied
        for (const sectionId of ALL_SECTIONS) {
          const ratio = visibleSections.get(sectionId) || 0;
          if (ratio > maxRatio && ratio > 0.05) {
            maxRatio = ratio;
            bestSection = sectionId;
          }
        }

        updateHashAndSection(bestSection);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    ALL_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Handle background blur on scroll > 20px
    const handleScroll = () => {
      const isScrolled = container.scrollTop > 20;
      setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isViewingResume]);

  // ── Initial hash navigation & hashchange listener ────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ALL_SECTIONS.includes(hash)) {
        if (onNavigateSection) {
          onNavigateSection(hash);
        } else {
          const container = document.getElementById('content-scroll-container');
          const target = document.getElementById(hash);
          if (container && target) {
            const containerRect = container.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const offset = targetRect.top - containerRect.top + container.scrollTop - 72;
            container.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }
      }
    };

    if (window.location.hash) {
      const timer = setTimeout(handleHashChange, 350);
      return () => clearTimeout(timer);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onNavigateSection]);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          y: { type: 'spring', damping: 22, stiffness: 180, mass: 0.8 },
          opacity: { duration: 0.5, ease: 'easeOut' },
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'var(--c-header-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--c-header-border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div className="max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto px-4 sm:px-10 md:px-14 flex items-center justify-between h-[60px] sm:h-[68px]">
          {/* Logo + Section Indicator */}
          <div className="flex items-center gap-3 sm:gap-6 md:flex-1 justify-start">
            <button
              onClick={() => handleNavClick('hero')}
              className="flex items-center gap-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded py-1"
              aria-label="Go to top"
            >
              <span className="text-2xl sm:text-3xl font-handwriting font-bold leading-tight" style={{ color: 'var(--c-name)' }}>
                Sachit
              </span>
            </button>

            {/* Mobile Section Label */}
            <AnimatePresence mode="wait">
              {scrolled && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="sm:hidden flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--c-dot)]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">
                    {activeSection.replace('-', ' ')}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Nav (Centered) */}
          <nav
            ref={navContainerRef}
            className="hidden md:flex items-center gap-1 relative justify-center"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ id, label, isResume }) => {
              const isActive = currentActive === id;
              return (
                <button
                  key={id}
                  ref={(el) => { navBtns.current[id] = el; }}
                  onClick={() => handleNavClick(id, isResume)}
                  onMouseEnter={isResume ? () => { import('./ResumeViewer'); } : undefined}
                  className="relative px-3.5 py-1.5 text-sm font-body transition-colors cursor-pointer rounded-md"
                  style={{
                    color: isActive ? 'var(--c-heading)' : 'var(--c-subtle)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {label}
                </button>
              );
            })}
            {/* Sliding underline indicator */}
            <span
              className="absolute bottom-0 h-[2px] rounded-full transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: 'var(--c-dot)',
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />
          </nav>

          {/* Right Area: Fold Paper button (Crumple back) */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={onRecrumple}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border border-[var(--c-border)] hover:border-[var(--c-border-hover)] hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-all cursor-pointer shadow-xs select-none"
              style={{
                color: 'var(--c-subtle)',
              }}
              title="Fold paper back into 3D crumpled ball"
              aria-label="Fold paper back into 3D crumpled ball"
            >
              <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-45" style={{ color: 'var(--c-dot)' }} />
            </button>
          </div>
        </div>
      </motion.header>
    </>
  );
});

Header.displayName = 'Header';
