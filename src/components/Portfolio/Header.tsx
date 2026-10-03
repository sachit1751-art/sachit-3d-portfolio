import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
// author:sachit-2026-original
import { PaperTheme } from '../../types';
import { Volume2, VolumeX, Sparkles, Search, Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwipeToDismiss } from '../../hooks/useSwipeToDismiss';
import { useIntersectionHighlighting } from '../../hooks/useIntersectionHighlighting';
import { useSound } from '../../utils/soundManager';
import { WATERMARKED_NAME } from '../../utils/watermark';

interface HeaderProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme) => void;
  onViewResume?: () => void;
  isViewingResume?: boolean;
  onNavigateSection?: (id: string) => void;
  onOpenSiteMap?: () => void;
}

const NAV_ITEMS = [
  { id: 'about', label: 'About', subtitle: 'Background & Principles' },
  { id: 'projects', label: 'Projects', subtitle: 'Engineering Works & Systems' },
  { id: 'skills', label: 'Skills', subtitle: 'Core Stack & Architecture' },
  { id: 'building-in-public', label: 'Journal', subtitle: 'Engineering Logs & Updates' },
  { id: 'contact', label: 'Contact', subtitle: 'Direct Transmission & Inquiry' },
  { id: 'resume', label: 'Resume', subtitle: 'Curriculum Vitae & Experience', isResume: true },
];

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

export const Header = memo<HeaderProps>(({
  theme,
  setTheme,
  onViewResume,
  isViewingResume = false,
  onNavigateSection,
  onOpenSiteMap,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrollingRef = useRef(false);
  const { isMuted, toggleMute } = useSound();

  const {
    activeSection,
    scrolled,
  } = useIntersectionHighlighting({
    sectionIds: ALL_SECTIONS,
    isViewingResume,
    isScrollingRef,
  });

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

  const getNavParentId = (secId: string): string => {
    if (!secId || secId === 'hero' || secId === 'top') return '';
    if (secId === 'about' || secId === 'philosophy') return 'about';
    if (secId === 'projects') return 'projects';
    if (secId === 'skills' || secId === 'currently-building' || secId === 'github' || secId === 'experience' || secId === 'education' || secId === 'strengths') return 'skills';
    if (secId === 'building-in-public' || secId === 'chat-about-me') return 'building-in-public';
    if (secId === 'contact') return 'contact';
    return '';
  };

  const currentActive = isViewingResume ? 'resume' : getNavParentId(activeSection);

  const handleNavClick = useCallback((id: string, isResume?: boolean) => {
    setMobileMenuOpen(false);
    if (isResume) {
      if (onViewResume) onViewResume();
      return;
    }
    if (onNavigateSection) {
      onNavigateSection(id);
    }
  }, [onViewResume, onNavigateSection]);

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
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b"
        style={{
          backgroundColor: 'var(--c-header-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: 'var(--c-border)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <div className="max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto px-4 sm:px-10 md:px-14 flex items-center justify-between h-[60px] sm:h-[68px]">
          {/* Logo */}
          <div className="flex items-center gap-3 sm:gap-6 md:flex-1 justify-start min-w-0">
            <button
              onClick={() => handleNavClick('hero')}
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded py-1"
              aria-label="Go to top"
            >
              <span
                className="text-xl sm:text-2xl font-bold tracking-tight"
                style={{ color: 'var(--c-heading)' }}
              >
                {WATERMARKED_NAME}
              </span>
            </button>
          </div>

          {/* Desktop Nav (Centered) */}
          <nav
            className="hidden md:flex items-center gap-1 relative justify-center"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ id, label, isResume }) => {
              const isActive = currentActive === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id, isResume)}
                  className="relative px-3.5 py-1.5 text-sm font-body transition-colors cursor-pointer rounded-md hover:bg-[var(--c-input-bg)]"
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
          </nav>

          {/* Right Area: Theme Switcher, Sound Toggle, Quick Actions */}
          <div className="flex flex-1 items-center justify-end gap-2.5">
            {/* Sound Toggle Button */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-all cursor-pointer flex items-center justify-center"
              style={{ color: 'var(--c-heading)', backgroundColor: 'var(--c-card)' }}
              aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
              title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 opacity-70" /> : <Volume2 className="w-4 h-4 text-[var(--c-dot)]" />}
            </button>

            {/* Site Map / Search Quick Action */}
            {onOpenSiteMap && (
              <button
                onClick={onOpenSiteMap}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-[var(--c-border)] hover:border-[var(--c-border-hover)] transition-all cursor-pointer"
                style={{ color: 'var(--c-heading)', backgroundColor: 'var(--c-card)' }}
                aria-label="Open command palette"
                title="Search / Command Palette (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 opacity-70" />
                <span>Menu</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden min-w-[40px] min-h-[40px] p-2 rounded-lg border border-[var(--c-border)] hover:border-[var(--c-border-hover)] active:scale-95 transition-all cursor-pointer flex items-center justify-center touch-manipulation"
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
                        className="text-base font-semibold tracking-wide"
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

            {onOpenSiteMap && (
              <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--c-border)' }}>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenSiteMap(); }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-mono flex items-center justify-center gap-2 border border-[var(--c-border)]"
                  style={{ backgroundColor: 'var(--c-input-bg)', color: 'var(--c-heading)' }}
                >
                  <Search className="w-4 h-4 opacity-70" />
                  <span>Open Quick Command Palette</span>
                </button>
              </div>
            )}

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
