import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
// ​‌‍sachit-portfolio-2026-original-author‍‌​
import { PaperState, PaperTheme } from './types';
import { Header } from './components/Portfolio/Header';
import { NotFound } from './components/Portfolio/NotFound';
import { HoneycombLoader } from './components/UI/HoneycombLoader';
import { SEOHead } from './components/SEO/SEOHead';
import { SEOMetadata } from './components/SEO/SEOMetadata';
import { ShortcutHUD } from './components/UI/ShortcutHUD';
import { ToastNotification } from './components/UI/Toast';
import { useDoomSequence } from './hooks/useDoomSequence';
import { usePerformance } from './hooks/usePerformance';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';
import { useScrollContainerArrowNav } from './hooks/useScrollContainerArrowNav';
import { initSecurity } from './utils/security';
import { initFontLoader } from './utils/fontLoader';
import { resetSharedObservers } from './utils/observer';
import { initAuthorshipVerification } from './utils/watermark';

import { PortfolioContainer } from './components/Portfolio/PortfolioContainer';

const SESSION_CACHE_KEY = 'portfolio_intro_unfolded_cache';

// Helper for dynamic imports with automatic retry/reload resilience
function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<any>,
  exportName?: string
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    const pageHasRefreshed = JSON.parse(
      window.sessionStorage.getItem('retry-lazy-refreshed') || 'false'
    );
    try {
      const module = await componentImport();
      window.sessionStorage.setItem('retry-lazy-refreshed', 'false');
      const component = exportName && module[exportName] ? module[exportName] : (module.default || Object.values(module)[0]);
      return { default: component };
    } catch (error) {
      if (!pageHasRefreshed) {
        window.sessionStorage.setItem('retry-lazy-refreshed', 'true');
        window.location.reload();
      }
      throw error;
    }
  }) as React.LazyExoticComponent<T>;
}

// Lazy-load heavy components with retry resiliency
const LazyPaperIntro = lazyWithRetry<typeof import('./components/PaperIntro/PaperIntro').PaperIntro>(() => import('./components/PaperIntro/PaperIntro'), 'PaperIntro');
const LazyStructureRoom = lazyWithRetry<typeof import('./structure-room/StructureRoom').StructureRoom>(() => import('./structure-room/StructureRoom'), 'StructureRoom');
const LazyDoomTransition = lazyWithRetry<typeof import('./structure-room/DoomTransition').DoomTransition>(() => import('./structure-room/DoomTransition'), 'DoomTransition');
const LazyMoodTransition = lazyWithRetry<typeof import('./components/MoodGame/MoodTransition').MoodTransition>(() => import('./components/MoodGame/MoodTransition'), 'MoodTransition');
const LazyResumeViewer = lazyWithRetry<typeof import('./components/Portfolio/ResumeViewer').ResumeViewer>(() => import('./components/Portfolio/ResumeViewer'), 'ResumeViewer');
const LazyPrivacyPolicy = lazyWithRetry<typeof import('./components/Portfolio/PrivacyPolicy').PrivacyPolicy>(() => import('./components/Portfolio/PrivacyPolicy'), 'PrivacyPolicy');
const LazyTermsOfService = lazyWithRetry<typeof import('./components/Portfolio/TermsOfService').TermsOfService>(() => import('./components/Portfolio/TermsOfService'), 'TermsOfService');
const LazySiteMapModal = lazyWithRetry<typeof import('./components/Portfolio/SiteMapModal').SiteMapModal>(() => import('./components/Portfolio/SiteMapModal'), 'SiteMapModal');

function HeavyFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'var(--c-modal-backdrop, rgba(0,0,0,0.85))' }}>
      <HoneycombLoader size="lg" label="LOADING ENGINE..." color="var(--c-heading)" />
    </div>
  );
}

interface OverlaySwipeContainerProps {
  id: string;
  dataTheme?: PaperTheme;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Mobile-native swipe-down-to-close gesture container for overlay sheets (Resume, Privacy, Terms).
 * Tracks touch gestures when scrolled to top, providing rubber-band drag physics, opacity fade,
 * and fluid velocity-based dismissal on mobile touch devices.
 */
function OverlaySwipeContainer({
  id,
  dataTheme,
  onClose,
  children,
}: OverlaySwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const startYRef = useRef(0);
  const startXRef = useRef(0);
  const startTimeRef = useRef(0);
  const isEligibleRef = useRef(false);
  const isDraggingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startYRef.current = touch.clientY;
      startXRef.current = touch.clientX;
      startTimeRef.current = performance.now();
      // Only eligible to swipe down if scrolled at the very top (tolerance: 4px)
      isEligibleRef.current = el.scrollTop <= 4;
      isDraggingRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isEligibleRef.current || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const deltaY = touch.clientY - startYRef.current;
      const deltaX = touch.clientX - startXRef.current;

      // Downward pull dominates horizontal swipe
      if (deltaY > 6 && Math.abs(deltaY) > Math.abs(deltaX) * 1.1) {
        if (el.scrollTop > 4) {
          isEligibleRef.current = false;
          if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
            setOffsetY(0);
          }
          return;
        }

        // Prevent browser viewport pull-to-refresh
        if (e.cancelable) {
          e.preventDefault();
        }

        isDraggingRef.current = true;
        // Dampened resistance curve
        const dampenedY = Math.min(deltaY * 0.72, 340);
        setOffsetY(dampenedY);
        setIsDragging(true);
      } else if (deltaY < 0 && isDraggingRef.current) {
        isDraggingRef.current = false;
        setOffsetY(0);
        setIsDragging(false);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current) {
        isEligibleRef.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      const deltaY = touch.clientY - startYRef.current;
      const duration = Math.max(1, performance.now() - startTimeRef.current);
      const velocity = deltaY / duration; // px per ms

      isDraggingRef.current = false;
      isEligibleRef.current = false;
      setIsDragging(false);

      // Dismiss if dragged down past threshold (70px) or flicked with sufficient velocity
      if (deltaY > 70 || (velocity > 0.4 && deltaY > 25)) {
        setIsExiting(true);
        setOffsetY(window.innerHeight);
        setTimeout(() => {
          onCloseRef.current();
        }, 220);
      } else {
        // Snap back to top position
        setOffsetY(0);
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const opacity = isExiting
    ? 0
    : isDragging
    ? Math.max(0.35, 1 - offsetY / 360)
    : 1;

  return (
    <div
      ref={containerRef}
      id={id}
      data-theme={dataTheme}
      className="fixed inset-0 top-0 pt-20 sm:pt-24 z-20 w-full h-full overflow-y-auto overflow-x-hidden bg-transparent"
      style={{
        transform: offsetY > 0 ? `translate3d(0, ${offsetY}px, 0)` : 'translate3d(0, 0, 0)',
        opacity,
        transition: isDragging
          ? 'none'
          : isExiting
          ? 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease-out'
          : 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.28s ease-out',
        willChange: isDragging || isExiting ? 'transform, opacity' : undefined,
      }}
    >
      {/* Mobile-Native Swipe-Down Handle */}
      <div 
        className="sm:hidden flex flex-col items-center justify-center pt-1 pb-3 cursor-grab active:cursor-grabbing select-none"
        aria-label="Swipe down to close"
        onClick={onClose}
      >
        <div 
          className="w-12 h-1.5 rounded-full transition-transform active:scale-95"
          style={{ backgroundColor: 'var(--c-border-hover)' }}
        />
        <span 
          className="text-[9px] font-mono tracking-widest uppercase opacity-60 mt-1.5"
          style={{ color: 'var(--c-muted)' }}
        >
          {isDragging ? 'Release to close' : 'Swipe down to close'}
        </span>
      </div>

      {children}
    </div>
  );
}

// ﻿provenance:sachit-2026-original﻿
export default function App() {
  const [is404, setIs404] = useState(false);
  const [isViewingResume, setIsViewingResume] = useState(false);
  const [isViewingPrivacy, setIsViewingPrivacy] = useState(false);
  const [isViewingTerms, setIsViewingTerms] = useState(false);

  useEffect(() => {
    initFontLoader();
    // Route handling for SPA
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (hash.startsWith('#structure') || hash.startsWith('#/structure') || path.startsWith('/structure')) {
        setShowStructureRoom(true);
        setIsViewingResume(false);
        setIsViewingPrivacy(false);
        setIsViewingTerms(false);
        setShowContent(true);
        setIntroCompleted(true);
        setPaperState('opened');
        setIs404(false);
      } else if (path === '/resume' || path === '/resume/' || path === '/resume.html') {
        setIsViewingResume(true);
        setIsViewingPrivacy(false);
        setIsViewingTerms(false);
        setShowContent(true);
        setIntroCompleted(true);
        setPaperState('opened');
        setIs404(false);
      } else if (path === '/privacy' || path === '/privacy/') {
        setIsViewingPrivacy(true);
        setIsViewingResume(false);
        setIsViewingTerms(false);
        setShowContent(true);
        setIntroCompleted(true);
        setPaperState('opened');
        setIs404(false);
      } else if (path === '/terms' || path === '/terms/') {
        setIsViewingTerms(true);
        setIsViewingResume(false);
        setIsViewingPrivacy(false);
        setShowContent(true);
        setIntroCompleted(true);
        setPaperState('opened');
        setIs404(false);
      } else if (path !== '/' && path !== '/index.html' && !path.startsWith('/api/')) {
        setIs404(true);
      } else {
        setIsViewingResume(false);
        setIsViewingPrivacy(false);
        setIsViewingTerms(false);
        setIs404(false);
        // Root path always presents the intro animation on fresh load/reload
      }
    };

    checkRoute();

    const handlePopState = () => {
      checkRoute();
    };

    const handleOpenPrivacy = () => {
      setIsViewingPrivacy(true);
      setIsViewingResume(false);
      setIsViewingTerms(false);
      setShowContent(true);
      setIntroCompleted(true);
      setPaperState('opened');
      try {
        if (window.location.pathname !== '/privacy') {
          window.history.pushState({}, '', '/privacy');
        }
      } catch {}
    };

    const handleOpenTerms = () => {
      setIsViewingTerms(true);
      setIsViewingResume(false);
      setIsViewingPrivacy(false);
      setShowContent(true);
      setIntroCompleted(true);
      setPaperState('opened');
      try {
        if (window.location.pathname !== '/terms') {
          window.history.pushState({}, '', '/terms');
        }
      } catch {}
    };

    const handleOpen404 = () => {
      setIs404(true);
      setIsViewingResume(false);
      setIsViewingPrivacy(false);
      setIsViewingTerms(false);
      try {
        if (window.location.pathname !== '/404') {
          window.history.pushState({}, '', '/404');
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('open-privacy', handleOpenPrivacy);
    window.addEventListener('open-terms', handleOpenTerms);
    window.addEventListener('open-404', handleOpen404);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('open-privacy', handleOpenPrivacy);
      window.removeEventListener('open-terms', handleOpenTerms);
      window.removeEventListener('open-404', handleOpen404);
    };
  }, []);

  useEffect(() => {
    initAuthorshipVerification();
    if (import.meta.env.PROD) {
      initSecurity();
    }
  }, []);
  const [paperState, setPaperState] = useState<PaperState>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return 'opened';
      }
    }
    return 'crumpled';
  });

  const [theme, setTheme] = useState<PaperTheme>('kraft');
  const [isSiteMapOpen, setIsSiteMapOpen] = useState(false);
  const [siteMapInitialTab, setSiteMapInitialTab] = useState<'all' | 'sections' | 'projects' | 'actions' | 'shortcuts'>('all');

  const [introCompleted, setIntroCompleted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
    }
    return false;
  });

  const [showContent, setShowContent] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
    }
    return false;
  });

  const [headerReady, setHeaderReady] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
    }
    return false;
  });

  const [showTransition, setShowTransition] = useState(false);
  const [showStructureRoom, setShowStructureRoom] = useState(false);
  const [showMoodTransition, setShowMoodTransition] = useState(false);
  const [showMoodGame, setShowMoodGame] = useState(false);

  const { isUnlocked: doomUnlocked, exitStructureRoom } = useDoomSequence(paperState);
  const { simplify } = usePerformance();
  const moodTransitionFiredRef = useRef(false);

  const handleOpenResume = useCallback(() => {
    setIsViewingResume(true);
    setShowContent(true);
    setIntroCompleted(true);
    setPaperState('opened');
    try {
      if (window.location.pathname !== '/resume') {
        window.history.pushState({}, '', '/resume');
      }
    } catch {}
  }, []);

  const handleCloseResume = useCallback(() => {
    setIsViewingResume(false);
    try {
      if (window.location.pathname === '/resume') {
        window.history.pushState({}, '', '/');
      }
    } catch {}
  }, []);

  const handleOpenPrivacy = useCallback(() => {
    setIsViewingPrivacy(true);
    setIsViewingResume(false);
    setIsViewingTerms(false);
    setShowContent(true);
    setIntroCompleted(true);
    setPaperState('opened');
    try {
      if (window.location.pathname !== '/privacy') {
        window.history.pushState({}, '', '/privacy');
      }
    } catch {}
  }, []);

  const handleOpenTerms = useCallback(() => {
    setIsViewingTerms(true);
    setIsViewingResume(false);
    setIsViewingPrivacy(false);
    setShowContent(true);
    setIntroCompleted(true);
    setPaperState('opened');
    try {
      if (window.location.pathname !== '/terms') {
        window.history.pushState({}, '', '/terms');
      }
    } catch {}
  }, []);

  const handleNavigateSection = useCallback((id: string) => {
    // Prevent navigation if intro isn't finished and we're not explicitly bypassing it
    if (!introCompleted && paperState !== 'opened') {
      console.warn('[App] handleNavigateSection: Navigation suppressed (intro active)');
      return;
    }

    setIsViewingResume(false);
    setIsViewingPrivacy(false);
    setIsViewingTerms(false);
    try {
      if (window.location.pathname === '/resume' || window.location.pathname === '/privacy' || window.location.pathname === '/terms') {
        window.history.pushState({}, '', '/');
      }
    } catch {}

    // Immediate zero-delay scroll without waiting for artificial timeouts
    requestAnimationFrame(() => {
      const container = document.getElementById('content-scroll-container');
      if (!container) return;

      if (id === 'hero' || id === 'top') {
        container.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(id);
      if (target) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = targetRect.top - containerRect.top + container.scrollTop - 72;
        container.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  }, [introCompleted, paperState]);

  const handleClosePrivacy = useCallback(() => {
    setIsViewingPrivacy(false);
    try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
  }, []);

  const handleCloseTerms = useCallback(() => {
    setIsViewingTerms(false);
    try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
  }, []);

  const handleOpenSiteMap = useCallback(() => {
    setSiteMapInitialTab('all');
    setIsSiteMapOpen(true);
  }, []);

  const handleCloseSiteMap = useCallback(() => {
    setIsSiteMapOpen(false);
  }, []);

  const handleDoomTransitionComplete = useCallback(() => {
    setShowTransition(false);
    setShowStructureRoom(true);
  }, []);

  const handleExitStructureRoom = useCallback(() => {
    exitStructureRoom();
    setShowStructureRoom(false);
  }, [exitStructureRoom]);

  const handleMoodTransitionComplete = useCallback(() => {
    setShowMoodTransition(false);
    moodTransitionFiredRef.current = false;
    setShowMoodGame(true);
  }, []);

  const handlePaperOpenComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_CACHE_KEY, 'true');
    } catch {}
    setIntroCompleted(true);
    setShowContent(true);
    setHeaderReady(true);

    // Explicitly blur any active element to prevent mobile keyboards from opening after the intro animation ends
    try {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } catch {}

    requestAnimationFrame(() => {
      const container = document.getElementById('content-scroll-container');
      if (container) container.scrollTop = 0;
    });
  }, []);

  // Preload ResumeViewer module once portfolio is revealed to ensure instantaneous transitions
  useEffect(() => {
    if (showContent && introCompleted) {
      const timer = window.setTimeout(() => {
        import('./components/Portfolio/ResumeViewer');
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [showContent, introCompleted]);

  // Apply performance class to body for CSS optimizations
  useEffect(() => {
    if (simplify) {
      document.body.classList.add('perf-simplify');
    } else {
      document.body.classList.remove('perf-simplify');
    }
  }, [simplify]);

  // Clear stale MOOD session on fresh load so game doesn't auto-start
  useEffect(() => {
    try {
      sessionStorage.removeItem('mood_unlocked');
    } catch {}
  }, []);

  // Sync content visibility with intro state
  useEffect(() => {
    if (paperState === 'opened' && introCompleted) {
      setShowContent(true);
    } else if (paperState === 'crumpled' && !showMoodGame) {
      setShowContent(false);
    }
  }, [paperState, showMoodGame, introCompleted]);

  // Header synchronization - ready when intro confirms opened
  useEffect(() => {
    if (paperState === 'opened' && introCompleted) {
      setHeaderReady(true);
    } else {
      setHeaderReady(false);
    }
  }, [paperState, introCompleted]);

  const handleRecrumple = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
    } catch {}
    resetSharedObservers();
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setShowContent(false);
    setIntroCompleted(false);
    setHeaderReady(false);
    setPaperState('crumpled');
    setShowStructureRoom(false);
    setShowTransition(false);
    setShowMoodTransition(false);
    setShowMoodGame(false);
    moodTransitionFiredRef.current = false;
  }, []);

  const handleThemeChange = useCallback((newTheme: PaperTheme, event?: React.MouseEvent | MouseEvent) => {
    // If browser doesn't support View Transitions or it's a reduced motion user, just switch
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(newTheme);
      return;
    }

    // Get click coordinates
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;

    // Set CSS variables for the animation
    document.documentElement.style.setProperty('--transition-x', `${x}px`);
    document.documentElement.style.setProperty('--transition-y', `${y}px`);
    document.documentElement.setAttribute('data-theme-transition', 'circular');

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.finished.finally(() => {
      document.documentElement.removeAttribute('data-theme-transition');
    });
  }, []);

  // Global keyboard shortcuts manager
  useGlobalShortcuts({
    isSiteMapOpen,
    onOpenSiteMap: (tab) => {
      if (tab) setSiteMapInitialTab(tab);
      setIsSiteMapOpen(true);
    },
    onCloseSiteMap: () => setIsSiteMapOpen(false),
    onToggleSiteMap: () => setIsSiteMapOpen((prev) => !prev),
    isViewingResume,
    onOpenResume: handleOpenResume,
    onCloseResume: handleCloseResume,
    isViewingPrivacy,
    onClosePrivacy: () => {
      setIsViewingPrivacy(false);
      try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
    },
    isViewingTerms,
    onCloseTerms: () => {
      setIsViewingTerms(false);
      try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
    },
    is404,
    onClose404: () => {
      setIs404(false);
      try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
      setShowContent(true);
      setIntroCompleted(true);
      setPaperState('opened');
    },
    showStructureRoom,
    onExitStructureRoom: () => {
      exitStructureRoom();
      setShowStructureRoom(false);
    },
    theme,
    setTheme: handleThemeChange,
    onNavigateSection: handleNavigateSection,
    introCompleted,
  });

  // Arrow key navigation between sections and project cards
  useScrollContainerArrowNav({
    enabled: showContent && introCompleted && !isViewingResume && !isViewingPrivacy && !isViewingTerms && !is404 && !isSiteMapOpen,
    onNavigateSection: handleNavigateSection,
  });

  useEffect(() => {
    if (doomUnlocked && paperState === 'crumpled') {
      setShowTransition(true);
    }
  }, [doomUnlocked, paperState]);

  const handleMoodUnlocked = useCallback(() => {
    if (moodTransitionFiredRef.current) return;
    moodTransitionFiredRef.current = true;
    setShowMoodTransition(true);
  }, []);

  const handleSetPaperState = useCallback((state: PaperState) => {
    setPaperState(state);
  }, []);

  const handleSetShowMoodGame = useCallback((v: boolean) => {
    setShowMoodGame(v);
  }, []);

  return (
    <div data-theme={theme} className="relative min-h-screen bg-[var(--c-bg)] font-sans antialiased overflow-x-hidden transition-colors duration-500">
      {/* Route-Aware & Crawler-Optimized SEO Metadata */}
      <SEOMetadata
        pageType={
          is404
            ? '404'
            : isViewingPrivacy
            ? 'privacy'
            : isViewingTerms
            ? 'terms'
            : isViewingResume
            ? 'resume'
            : 'home'
        }
        canonicalPath={
          is404
            ? '/404'
            : isViewingPrivacy
            ? '/privacy'
            : isViewingTerms
            ? '/terms'
            : isViewingResume
            ? '/resume'
            : '/'
        }
      />

      {is404 && (
        <NotFound
          theme={theme}
          setTheme={handleThemeChange}
          onNavigateHome={() => {
            setIs404(false);
            try {
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
              }
            } catch {}
            setShowContent(true);
            setIntroCompleted(true);
            setPaperState('opened');
          }}
          onNavigateSection={(sectionId) => {
            setIs404(false);
            try {
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
              }
            } catch {}
            setShowContent(true);
            setIntroCompleted(true);
            setPaperState('opened');
            handleNavigateSection(sectionId);
          }}
          onRecrumple={handleRecrumple}
          onViewResume={handleOpenResume}
        />
      )}
      {showContent && (
        <a
          href="#content-scroll-container"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-body focus:shadow-lg"
          style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
        >
          Skip to content
        </a>
      )}

      {/* 3D Paper Scene */}
      <div className="fixed inset-0 z-10">
        <Suspense fallback={null}>
          <LazyPaperIntro
            paperState={paperState}
            setPaperState={handleSetPaperState}
            theme={theme}
            setTheme={handleThemeChange}
            onOpenComplete={handlePaperOpenComplete}
            showMoodGame={showMoodGame}
            setShowMoodGame={handleSetShowMoodGame}
            onMoodUnlocked={handleMoodUnlocked}
          />
        </Suspense>
      </div>

      {/* Portfolio Content */}
      {showContent && introCompleted && !showStructureRoom && !showMoodGame && (
        <div
          className="fixed inset-0 z-20 animate-portfolio-enter flex flex-col"
          data-theme={theme}
        >
          {headerReady && (
            <Header
              theme={theme}
              setTheme={handleThemeChange}
              onRecrumple={handleRecrumple}
              onViewResume={handleOpenResume}
              isViewingResume={isViewingResume}
              onNavigateSection={handleNavigateSection}
              onOpenSiteMap={handleOpenSiteMap}
            />
          )}
          {/* Main Portfolio Scroll Container - kept mounted to preserve scroll position and eliminate remount lag */}
          <div
            id="content-scroll-container"
            className={`flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden ${
              isViewingResume || isViewingPrivacy || isViewingTerms
                ? 'invisible pointer-events-none'
                : 'visible pointer-events-auto'
            }`}
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorY: 'contain',
            }}
            aria-hidden={isViewingResume || isViewingPrivacy || isViewingTerms}
            tabIndex={isViewingResume || isViewingPrivacy || isViewingTerms ? -1 : undefined}
          >
            <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="UNFOLDING PORTFOLIO..." color="var(--c-heading)" /></div>}>
              <PortfolioContainer
                theme={theme}
                paperState={paperState}
                onViewResume={handleOpenResume}
              />
            </Suspense>
          </div>

          {/* Dedicated Resume Overlay Container */}
          {isViewingResume && (
            <OverlaySwipeContainer
              id="resume-scroll-container"
              onClose={handleCloseResume}
            >
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="PREPARING CV CANVAS..." color="var(--c-heading)" /></div>}>
                <LazyResumeViewer
                  theme={theme}
                  onBack={handleCloseResume}
                />
              </Suspense>
            </OverlaySwipeContainer>
          )}

          {/* Dedicated Privacy Policy Overlay */}
          {isViewingPrivacy && (
            <OverlaySwipeContainer
              id="privacy-scroll-container"
              dataTheme={theme}
              onClose={handleClosePrivacy}
            >
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="LOADING PRIVACY POLICY..." color="var(--c-heading)" /></div>}>
                <LazyPrivacyPolicy
                  theme={theme}
                  onBack={handleClosePrivacy}
                />
              </Suspense>
            </OverlaySwipeContainer>
          )}

          {/* Dedicated Terms of Service Overlay */}
          {isViewingTerms && (
            <OverlaySwipeContainer
              id="terms-scroll-container"
              dataTheme={theme}
              onClose={handleCloseTerms}
            >
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="LOADING TERMS..." color="var(--c-heading)" /></div>}>
                <LazyTermsOfService
                  theme={theme}
                  onBack={handleCloseTerms}
                />
              </Suspense>
            </OverlaySwipeContainer>
          )}


        </div>
      )}

      {/* Doom Transition */}
      {showTransition && (
        <Suspense fallback={<HeavyFallback />}>
          <LazyDoomTransition
            onComplete={handleDoomTransitionComplete}
          />
        </Suspense>
      )}

      {/* Structure Room */}
      {showStructureRoom && (
        <div
          className="fixed inset-0 z-20"
          data-theme={theme}
        >
          <Suspense fallback={<HeavyFallback />}>
            <LazyStructureRoom
              theme={theme}
              setTheme={handleThemeChange}
              onExit={handleExitStructureRoom}
            />
          </Suspense>
        </div>
      )}

      {/* Mood Transition — Mission Briefing Terminal */}
      {showMoodTransition && (
        <Suspense fallback={<HeavyFallback />}>
          <LazyMoodTransition
            onComplete={handleMoodTransitionComplete}
          />
        </Suspense>
      )}

      {/* Global Shortcut HUD Toast Feedback */}
      <ShortcutHUD />

      {/* Global Success & Status Toast Notifications */}
      <ToastNotification />

      {/* Global Site Map & Command Palette Modal (Cmd+K) */}
      {isSiteMapOpen && (
        <Suspense fallback={null}>
          <LazySiteMapModal
            isOpen={isSiteMapOpen}
            onClose={handleCloseSiteMap}
            onNavigateSection={handleNavigateSection}
            onOpenResume={handleOpenResume}
            onOpenPrivacy={handleOpenPrivacy}
            onOpenTerms={handleOpenTerms}
            onRecrumple={handleRecrumple}
            theme={theme}
            setTheme={handleThemeChange}
            initialCategory={siteMapInitialTab}
          />
        </Suspense>
      )}
    </div>
  );
}
