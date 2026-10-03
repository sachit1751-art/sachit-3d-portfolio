import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
// sachit-portfolio-2026-original-author
import { PaperState, PaperTheme } from './types';
import { Header } from './components/Portfolio/Header';
import { PortfolioContainer } from './components/Portfolio/PortfolioContainer';
import { NotFound } from './components/Portfolio/NotFound';
import { HoneycombLoader } from './components/UI/HoneycombLoader';
import { SEOMetadata } from './components/SEO/SEOMetadata';
import { ShortcutHUD } from './components/UI/ShortcutHUD';
import { ToastNotification } from './components/UI/Toast';
import { useDoomSequence } from './hooks/useDoomSequence';
import { usePerformance } from './hooks/usePerformance';
import { initSecurity } from './utils/security';
import { initFontLoader } from './utils/fontLoader';
import { initAuthorshipVerification } from './utils/watermark';

// Easing helper for smooth scroll interpolation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function calculateSectionOffset(container: HTMLElement, target: HTMLElement, headerOffset = 72): number {
  let offset = 0;
  let curr: HTMLElement | null = target;
  while (curr && curr !== container && curr !== document.body) {
    offset += curr.offsetTop;
    curr = curr.offsetParent as HTMLElement | null;
  }
  if (offset <= 0 && target !== container) {
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    offset = tRect.top - cRect.top + container.scrollTop;
  }
  return Math.max(0, Math.round(offset - headerOffset));
}

let activeScrollRaf: number | null = null;
let activeScrollCleanup: (() => void) | null = null;

function interpolateScrollTo(
  container: HTMLElement,
  targetTop: number,
  duration = 450
) {
  if (activeScrollRaf !== null) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = null;
  }
  if (activeScrollCleanup) {
    activeScrollCleanup();
    activeScrollCleanup = null;
  }
  const startTop = container.scrollTop;
  const distance = targetTop - startTop;

  if (Math.abs(distance) < 2) {
    container.scrollTop = targetTop;
    return;
  }

  const startTime = performance.now();
  const handleUserInterrupt = () => {
    if (activeScrollRaf !== null) {
      cancelAnimationFrame(activeScrollRaf);
      activeScrollRaf = null;
    }
    if (activeScrollCleanup) {
      activeScrollCleanup();
      activeScrollCleanup = null;
    }
  };

  const removeListeners = () => {
    container.removeEventListener('wheel', handleUserInterrupt);
    container.removeEventListener('touchstart', handleUserInterrupt);
  };

  container.addEventListener('wheel', handleUserInterrupt, { passive: true });
  container.addEventListener('touchstart', handleUserInterrupt, { passive: true });
  activeScrollCleanup = removeListeners;

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    container.scrollTop = startTop + distance * easeProgress;

    if (progress < 1) {
      activeScrollRaf = requestAnimationFrame(step);
    } else {
      activeScrollRaf = null;
      removeListeners();
      activeScrollCleanup = null;
    }
  };

  activeScrollRaf = requestAnimationFrame(step);
}

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

export default function App() {
  const [is404, setIs404] = useState(false);
  const [isViewingResume, setIsViewingResume] = useState(false);
  const [isViewingPrivacy, setIsViewingPrivacy] = useState(false);
  const [isViewingTerms, setIsViewingTerms] = useState(false);

  useEffect(() => {
    initFontLoader();
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (hash.startsWith('#structure') || hash.startsWith('#/structure') || path.startsWith('/structure')) {
        setShowStructureRoom(true);
        setIs404(false);
      } else if (path === '/resume' || path === '/resume/' || path === '/resume.html') {
        setIsViewingResume(true);
        setIs404(false);
      } else if (path === '/privacy' || path === '/privacy/') {
        setIsViewingPrivacy(true);
        setIs404(false);
      } else if (path === '/terms' || path === '/terms/') {
        setIsViewingTerms(true);
        setIs404(false);
      } else if (path !== '/' && path !== '/index.html' && !path.startsWith('/api/')) {
        setIs404(true);
      } else {
        setIs404(false);
      }
    };
    checkRoute();
    const handlePopState = () => checkRoute();

    const handleOpenPrivacy = () => {
      setIsViewingPrivacy(true);
      setIsViewingResume(false);
      setIsViewingTerms(false);
      setIs404(false);
      try { if (window.location.pathname !== '/privacy') window.history.pushState({}, '', '/privacy'); } catch {}
    };

    const handleOpenTerms = () => {
      setIsViewingTerms(true);
      setIsViewingResume(false);
      setIsViewingPrivacy(false);
      setIs404(false);
      try { if (window.location.pathname !== '/terms') window.history.pushState({}, '', '/terms'); } catch {}
    };

    const handleOpen404 = () => setIs404(true);

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

  const [paperState] = useState<PaperState>('opened');
  const [theme, setTheme] = useState<PaperTheme>('kraft');
  const [isSiteMapOpen, setIsSiteMapOpen] = useState(false);
  const [siteMapInitialTab, setSiteMapInitialTab] = useState<'all' | 'sections' | 'projects' | 'actions' | 'shortcuts'>('all');
  const [showTransition, setShowTransition] = useState(false);
  const [showStructureRoom, setShowStructureRoom] = useState(false);
  const [showMoodTransition, setShowMoodTransition] = useState(false);
  const [showMoodGame, setShowMoodGame] = useState(false);

  const { isUnlocked: doomUnlocked, exitStructureRoom } = useDoomSequence(paperState);
  const { simplify } = usePerformance();

  const handleOpenResume = useCallback(() => {
    setIsViewingResume(true);
    try { if (window.location.pathname !== '/resume') window.history.pushState({}, '', '/resume'); } catch {}
  }, []);

  const handleCloseResume = useCallback(() => {
    setIsViewingResume(false);
    try { if (window.location.pathname === '/resume') window.history.pushState({}, '', '/'); } catch {}
  }, []);

  const handleOpenPrivacy = useCallback(() => {
    setIsViewingPrivacy(true);
    setIsViewingResume(false);
    setIsViewingTerms(false);
    setIs404(false);
    try { if (window.location.pathname !== '/privacy') window.history.pushState({}, '', '/privacy'); } catch {}
  }, []);

  const handleOpenTerms = useCallback(() => {
    setIsViewingTerms(true);
    setIsViewingResume(false);
    setIsViewingPrivacy(false);
    setIs404(false);
    try { if (window.location.pathname !== '/terms') window.history.pushState({}, '', '/terms'); } catch {}
  }, []);

  const handleRecrumple = useCallback(() => {
    // No-op
  }, []);

  const handleNavigateSection = useCallback((id: string) => {
    setIsViewingResume(false);
    setIsViewingPrivacy(false);
    setIsViewingTerms(false);
    try {
      if (window.location.pathname === '/resume' || window.location.pathname === '/privacy' || window.location.pathname === '/terms') {
        window.history.pushState({}, '', '/');
      }
    } catch {}
    const container = document.getElementById('content-scroll-container');
    if (!container) return;
    if (id === 'hero' || id === 'top') {
      interpolateScrollTo(container, 0, 400);
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      const targetOffset = calculateSectionOffset(container, target, 72);
      interpolateScrollTo(container, targetOffset, 480);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (activeScrollRaf !== null) {
        cancelAnimationFrame(activeScrollRaf);
        activeScrollRaf = null;
      }
      if (activeScrollCleanup) {
        activeScrollCleanup();
        activeScrollCleanup = null;
      }
    };
  }, []);

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
    setShowMoodGame(true);
  }, []);

  useEffect(() => {
    if (simplify) {
      document.body.classList.add('perf-simplify');
    } else {
      document.body.classList.remove('perf-simplify');
    }
  }, [simplify]);

  return (
    <div data-theme={theme} className="relative min-h-screen bg-[var(--c-bg)] font-sans antialiased overflow-x-hidden transition-colors duration-500">
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
          setTheme={setTheme}
          onNavigateHome={() => {
            setIs404(false);
            try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
          }}
          onNavigateSection={(sectionId) => {
            setIs404(false);
            try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
            handleNavigateSection(sectionId);
          }}
          onViewResume={handleOpenResume}
        />
      )}

      {!is404 && !showStructureRoom && !showMoodGame && (
        <div className="relative min-h-screen flex flex-col" data-theme={theme}>
          <Header
            theme={theme}
            setTheme={setTheme}
            onViewResume={handleOpenResume}
            isViewingResume={isViewingResume}
            onNavigateSection={handleNavigateSection}
            onOpenSiteMap={handleOpenSiteMap}
          />
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
          >
            <PortfolioContainer
              theme={theme}
              paperState={paperState}
              onViewResume={handleOpenResume}
            />
          </div>

          {isViewingResume && (
            <div id="resume-scroll-container" className="fixed inset-0 top-0 pt-20 sm:pt-24 z-20 w-full h-full overflow-y-auto overflow-x-hidden bg-[var(--c-bg)]">
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="PREPARING CV CANVAS..." color="var(--c-heading)" /></div>}>
                <LazyResumeViewer theme={theme} onBack={handleCloseResume} />
              </Suspense>
            </div>
          )}

          {isViewingPrivacy && (
            <div id="privacy-scroll-container" data-theme={theme} className="fixed inset-0 top-0 pt-20 sm:pt-24 z-20 w-full h-full overflow-y-auto overflow-x-hidden bg-[var(--c-bg)]">
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="LOADING PRIVACY POLICY..." color="var(--c-heading)" /></div>}>
                <LazyPrivacyPolicy theme={theme} onBack={handleClosePrivacy} />
              </Suspense>
            </div>
          )}

          {isViewingTerms && (
            <div id="terms-scroll-container" data-theme={theme} className="fixed inset-0 top-0 pt-20 sm:pt-24 z-20 w-full h-full overflow-y-auto overflow-x-hidden bg-[var(--c-bg)]">
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="LOADING TERMS..." color="var(--c-heading)" /></div>}>
                <LazyTermsOfService theme={theme} onBack={handleCloseTerms} />
              </Suspense>
            </div>
          )}
        </div>
      )}

      {showTransition && (
        <Suspense fallback={<HeavyFallback />}>
          <LazyDoomTransition onComplete={handleDoomTransitionComplete} />
        </Suspense>
      )}

      {showStructureRoom && (
        <div className="fixed inset-0 z-20" data-theme={theme}>
          <Suspense fallback={<HeavyFallback />}>
            <LazyStructureRoom theme={theme} setTheme={setTheme} onExit={handleExitStructureRoom} />
          </Suspense>
        </div>
      )}

      {showMoodTransition && (
        <Suspense fallback={<HeavyFallback />}>
          <LazyMoodTransition onComplete={handleMoodTransitionComplete} />
        </Suspense>
      )}

      <ShortcutHUD />
      <ToastNotification />

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
            setTheme={setTheme}
            initialCategory={siteMapInitialTab}
          />
        </Suspense>
      )}
    </div>
  );
}
