import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';
import { PaperTheme } from '../../types';
import { usePaperSound } from '../../hooks/usePaperSound';

export interface NotFoundProps {
  theme?: PaperTheme;
  setTheme?: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onNavigateHome?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onRecrumple?: () => void;
  onViewResume?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({
  theme: propTheme,
  onNavigateHome,
  onNavigateSection,
  onViewResume,
}) => {
  // Local fallback theme state if not provided via props
  const [internalTheme] = useState<PaperTheme>('kraft');

  const activeTheme = propTheme || internalTheme;
  const { playUnfold } = usePaperSound();

  // Play subtle paper sound on mount
  useEffect(() => {
    try {
      playUnfold();
    } catch {}
  }, [playUnfold]);

  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      try {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch {
        window.location.href = '/';
      }
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      try {
        window.history.pushState({}, '', `/#${sectionId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch {
        window.location.href = `/#${sectionId}`;
      }
    }
  };

  return (
    <div
      data-theme={activeTheme}
      className="fixed inset-0 z-[100] h-screen w-full flex flex-col justify-between overflow-hidden select-none transition-colors duration-500 font-sans"
      style={{
        backgroundColor: 'var(--c-bg, #efe6d5)',
        color: 'var(--c-heading, #241f1a)',
      }}
    >
      {/* Hand-Drawn Kraft Paper 404 Illustration Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/src/assets/images/kraft_paper_404_illustration_1790872312462.jpg"
          alt="Hand-drawn kraft paper 404 illustration"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply dark:mix-blend-luminosity dark:opacity-20 transition-opacity duration-700 scale-105"
        />
        {/* Soft Vignette and Parchment Ambient Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(239, 230, 213, 0.4) 0%, rgba(239, 230, 213, 0.85) 75%, rgba(214, 191, 162, 0.95) 100%)',
            mixBlendMode: 'normal',
          }}
        />
        {/* Architectural Blueprint Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern-404" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-404)" />
          </svg>
        </div>
      </div>

      {/* Perimeter Folio Register Marks (Architectural Print Aesthetic) */}
      <div
        className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase opacity-40 pointer-events-none"
        style={{ color: 'var(--c-muted, #9a9284)' }}
      >
        <span>SYS.FOLIO // 404-ERR</span>
      </div>
      <div
        className="absolute top-4 right-4 hidden md:block font-mono text-[10px] tracking-widest uppercase opacity-40 pointer-events-none"
        style={{ color: 'var(--c-muted, #9a9284)' }}
      >
        <span>ARCHIVE REF: DOMINO-404</span>
      </div>
      <div
        className="absolute bottom-4 left-4 hidden md:block font-mono text-[10px] tracking-widest uppercase opacity-40 pointer-events-none"
        style={{ color: 'var(--c-muted, #9a9284)' }}
      >
        <span>STATUS: UNRESOLVED ROUTE</span>
      </div>

      {/* ── TOP NAVIGATION BAR ── */}
      <header
        className="relative z-10 w-full px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 flex items-center justify-between"
      >
        {/* Left: Branding Wordmark */}
        <button
          onClick={handleGoHome}
          className="group flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          title="Back to Portfolio Home"
        >
          <div className="flex flex-col">
            <span
              className="text-lg sm:text-xl font-extrabold tracking-tight group-hover:opacity-80 transition-opacity"
              style={{ color: 'var(--c-heading)' }}
            >
              SACHIT
            </span>
            <span
              className="font-mono text-[10px] uppercase tracking-widest -mt-0.5"
              style={{ color: 'var(--c-muted)' }}
            >
              STUDIO & ARCHITECTURE
            </span>
          </div>
          <span
            className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border"
            style={{
              borderColor: 'var(--c-border)',
              backgroundColor: 'var(--c-input-bg, rgba(0,0,0,0.03))',
              color: 'var(--c-body)',
            }}
          >
            404
          </span>
        </button>

        {/* Right: Clean Home Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            style={{
              borderColor: 'var(--c-border)',
              backgroundColor: 'var(--c-btn-bg, #241f1a)',
              color: 'var(--c-btn-text, #efe6d5)',
            }}
            title="Return to Portfolio Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>
      </header>

      {/* ── CENTER STAGE: STATIC 4 0 4 ── */}
      <main
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 select-none"
      >
        <div className="w-full flex items-center justify-center">
          <div 
            className="flex items-center justify-center tracking-[-0.05em] leading-[0.72] font-black"
            style={{
              fontSize: 'clamp(8.5rem, 28vw, 32rem)',
              color: 'var(--c-heading, #241f1a)',
              textShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
            }}
          >
            <span className="font-serif font-black tracking-tighter drop-shadow-sm select-none">
              404
            </span>
          </div>
        </div>
      </main>

      {/* ── BOTTOM FOOTER: DOMINO NEW YORK EDITORIAL MESSAGE & LINKS ── */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full px-6 sm:px-10 md:px-14 pb-8 sm:pb-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left"
      >
        {/* Editorial Heading Matching Domino New York */}
        <div className="flex flex-col space-y-1 max-w-lg">
          <h1
            className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.22em] leading-snug"
            style={{ color: 'var(--c-heading)' }}
          >
            PAGE NOT FOUND
          </h1>
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em]"
            style={{ color: 'var(--c-body)' }}
          >
            LET&apos;S GET YOU BACK TO THE GOOD STUFF
          </p>
        </div>

        {/* Navigation Links with Domino NY's Signature Hover Underline Effect */}
        <nav
          aria-label="404 recovery navigation"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em]"
        >
          {/* WORKS (Selected Projects) */}
          <button
            onClick={() => handleNavigate('projects')}
            className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100"
            style={{ color: 'var(--c-heading)' }}
          >
            <span>WORKS</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ backgroundColor: 'var(--c-heading)' }}
            />
          </button>

          <span className="opacity-30" style={{ color: 'var(--c-muted)' }}>•</span>

          {/* STUDIO / ABOUT */}
          <button
            onClick={() => handleNavigate('about')}
            className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100"
            style={{ color: 'var(--c-heading)' }}
          >
            <span>STUDIO</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ backgroundColor: 'var(--c-heading)' }}
            />
          </button>

          <span className="opacity-30" style={{ color: 'var(--c-muted)' }}>•</span>

          {/* RESUME */}
          {onViewResume ? (
            <button
              onClick={onViewResume}
              className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100"
              style={{ color: 'var(--c-heading)' }}
            >
              <span>RESUME</span>
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: 'var(--c-heading)' }}
              />
            </button>
          ) : (
            <a
              href="/Sachit_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100"
              style={{ color: 'var(--c-heading)' }}
            >
              <span>RESUME</span>
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: 'var(--c-heading)' }}
              />
            </a>
          )}

          <span className="opacity-30" style={{ color: 'var(--c-muted)' }}>•</span>

          {/* HOME */}
          <button
            onClick={handleGoHome}
            className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100 flex items-center gap-1"
            style={{ color: 'var(--c-heading)' }}
          >
            <span>HOME</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ backgroundColor: 'var(--c-heading)' }}
            />
          </button>
        </nav>
      </motion.footer>
    </div>
  );
};
