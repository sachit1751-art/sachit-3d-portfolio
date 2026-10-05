import { useState, useEffect, useCallback, useRef, memo } from 'react';
// ​provenance:sachit-2026-original​
import { PaperTheme } from '../../types';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwipeToDismiss } from '../../hooks/useSwipeToDismiss';
import { useScrollSpy, getHeaderNavTabId } from '../../hooks/useScrollSpy';
import { useActiveSection } from '../../hooks/useActiveSection';
import { WATERMARKED_NAME } from '../../utils/watermark';

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
  { id: 'kraft', label: 'Kraft Paper', color: '#d6bfa2' },
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
  'chat-about-me',
  'contact',
];

const NavTabButton = memo<{
  id: string;
  label: string;
  isActive: boolean;
  isResume?: boolean;
  onNavClick: (id: string, isResume?: boolean) => void;
}>(({ id, label, isActive, isResume, onNavClick }) => {
  return (
    <button
      data-nav-id={id}
      onClick={() => onNavClick(id, isResume)}
      onMouseEnter={isResume ? () => { import('./ResumeViewer'); } : undefined}
      className="relative px-3.5 py-1.5 text-sm font-body transition-colors cursor-pointer rounded-md touch-hitbox-expansion"
      style={{
        color: isActive ? 'var(--c-heading)' : 'var(--c-subtle)',
        fontWeight: isActive ? 600 : 400,
      }}
      aria-current={isActive ? 'location' : undefined}
    >
      <span className="relative z-10">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeHeaderNavUnderline"
          className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
          style={{
            backgroundColor: 'var(--c-dot)',
            boxShadow: '0 1px 4px var(--c-dot-glow, rgba(0,0,0,0.15))',
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30,
            mass: 0.8,
          }}
        />
      )}
    </button>
  );
});

NavTabButton.displayName = 'NavTabButton';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrollingRef = useRef(false);

  // Active section tracking hook
  const activeSectionId = useActiveSection();

  // Unified scroll-spy hook calculating section positions and active header tab
  const {
    activeSection,
    setActiveSection,
    activeTab: scrollSpyTab,
    scrolled,
    lastActiveSectionRef,
  } = useScrollSpy({
    sectionIds: ALL_SECTIONS,
    isViewingResume,
    isScrollingRef,
  });

  const currentActive = isViewingResume
    ? 'resume'
    : (getHeaderNavTabId(activeSectionId) || scrollSpyTab);

  // Swipe-to-dismiss gesture on touch-enabled mobile devices for navigation drawer
  const {
    bind: swipeDrawerBind,
    style: swipeDrawerStyle,
    isTouchDevice: isTouchNav,
  } = useSwipeToDismiss({
    onDismiss: () => setMobileMenuOpen(false),
    direction: 'up',
    threshold: 45,
    velocityThreshold: 0.35,
    enabled: mobileMenuOpen,
    onlyTouch: true,
  });

  // ── Scroll to section & update URL hash ────────────────────────────
  const handleNavClick = useCallback((id: string, isResume?: boolean) => {
    setMobileMenuOpen(false);
    if (isResume) {
      if (onViewResume) onViewResume();
      return;
    }

    // Set active immediately so the underline moves on click if changed
    if (lastActiveSectionRef.current !== id) {
      lastActiveSectionRef.current = id;
      setActiveSection(id);
    }

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
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 26,
          mass: 0.8,
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: (scrolled || mobileMenuOpen) ? 'var(--c-header-bg)' : 'transparent',
          backdropFilter: (scrolled || mobileMenuOpen) ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: (scrolled || mobileMenuOpen) ? 'blur(12px)' : 'none',
          borderBottom: 'none',
          boxShadow: (scrolled || mobileMenuOpen) ? '0 2px 10px rgba(0,0,0,0.04)' : 'none',
          willChange: 'transform, opacity',
        }}
      >
        <div className="max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto px-4 sm:px-10 md:px-14 flex items-center justify-between h-[60px] sm:h-[68px]">
          {/* Logo + Section Indicator */}
          <div className="flex items-center gap-3 sm:gap-6 md:flex-1 justify-start min-w-0">
            <button
              onClick={() => handleNavClick('hero')}
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded py-1"
              aria-label="Go to top"
            >
              <span
                className="text-2xl sm:text-3xl font-handwriting font-bold leading-tight"
                style={{ color: 'var(--c-name)' }}
                aria-label="Sachit"
                data-provenance="sachit-2026-original-creator"
              >
                {WATERMARKED_NAME}
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
                  className="sm:hidden flex items-center gap-2 min-w-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-dot)] flex-shrink-0 shadow-[0_0_6px_var(--c-dot)]" />
                  <span 
                    className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-[var(--radius-sm)] truncate max-w-[130px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    style={{ 
                      color: 'var(--c-heading)', 
                      backgroundColor: 'var(--c-input-bg)',
                      border: '1px solid var(--c-border)'
                    }}
                  >
                    {activeSection.replace('-', ' ')}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Nav (Centered) */}
          <nav
            className="hidden md:flex items-center gap-1 relative justify-center"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ id, label, isResume }) => (
              <NavTabButton
                key={id}
                id={id}
                label={label}
                isResume={isResume}
                isActive={currentActive === id}
                onNavClick={handleNavClick}
              />
            ))}
          </nav>

          {/* Right Area: Mobile Menu Toggle */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-lg border border-[var(--c-border)] hover:border-[var(--c-border-hover)] active:scale-95 transition-all cursor-pointer flex items-center justify-center touch-manipulation"
              style={{ color: 'var(--c-heading)', backgroundColor: 'var(--c-card)' }}
              aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-0 top-[60px] sm:top-[68px] z-40 md:hidden border-b shadow-2xl p-4 sm:p-6 max-h-[calc(100vh-68px)] overflow-y-auto overscroll-contain"
            style={{
              backgroundColor: 'var(--c-header-bg)',
              borderColor: 'var(--c-border)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              ...swipeDrawerStyle,
            }}
          >
            <div className="flex flex-col space-y-2">
              {NAV_ITEMS.map(({ id, label, subtitle, isResume }) => {
                const isActive = currentActive === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id, isResume)}
                    className="w-full flex items-center justify-between px-4 py-3 min-h-[48px] rounded-xl transition-all text-left cursor-pointer active:scale-[0.99] touch-manipulation"
                    style={{
                      backgroundColor: isActive ? 'var(--c-input-bg)' : 'transparent',
                      border: isActive ? '1px solid var(--c-border-hover)' : '1px solid transparent',
                    }}
                  >
                    <div className="flex flex-col">
                      <span 
                        className="text-base sm:text-lg font-handwriting font-bold tracking-wide"
                        style={{ color: isActive ? 'var(--c-heading)' : 'var(--c-body)' }}
                      >
                        {label}
                      </span>
                      {subtitle && (
                        <span className="text-[11px] font-mono opacity-60 tracking-wider">
                          {subtitle}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[var(--c-dot)] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Touch Swipe-Up-To-Dismiss Handle */}
            {isTouchNav && (
              <div
                {...swipeDrawerBind()}
                className="mt-4 pt-3 border-t flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none touch-none"
                style={{ borderColor: 'var(--c-border)' }}
                aria-label="Swipe up to dismiss menu"
              >
                <div className="w-10 h-1 rounded-full bg-[var(--c-border-hover)] opacity-70 transition-transform active:scale-95" />
                <span className="text-[9px] font-mono tracking-widest uppercase opacity-40 mt-0.5">
                  swipe up to close
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Header.displayName = 'Header';
