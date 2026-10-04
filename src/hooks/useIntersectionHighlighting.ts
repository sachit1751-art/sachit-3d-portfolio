import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseIntersectionHighlightingOptions {
  sectionIds: string[];
  isViewingResume?: boolean;
  isScrollingRef?: React.MutableRefObject<boolean>;
  containerId?: string;
  headerHeight?: number;
}

export interface UseIntersectionHighlightingReturn {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  scrolled: boolean;
  lastActiveSectionRef: React.MutableRefObject<string>;
  calculateActiveSection: (container: HTMLElement) => string;
}

export function useIntersectionHighlighting({
  sectionIds,
  isViewingResume = false,
  isScrollingRef,
  containerId = 'content-scroll-container',
  headerHeight = 72,
}: UseIntersectionHighlightingOptions): UseIntersectionHighlightingReturn {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const lastActiveSectionRef = useRef('hero');
  const sectionIdsRef = useRef(sectionIds);
  sectionIdsRef.current = sectionIds;

  // Memoized section boundary & visibility calculation function optimized for rapid scroll events
  const calculateActiveSection = useCallback(
    (container: HTMLElement): string => {
      if (container.scrollTop < 80) {
        return 'hero';
      }

      const containerRect = container.getBoundingClientRect();
      const isNearBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 60;

      // When scrolled to the very bottom, always prioritize contact
      if (isNearBottom) {
        return 'contact';
      }

      const viewTop = containerRect.top + headerHeight;
      const viewBottom = containerRect.bottom;
      const viewHeight = Math.max(1, viewBottom - viewTop);
      // Focal probe line where the user is actively reading content (upper 32% of viewport below header)
      const probeY = viewTop + Math.min(220, Math.max(90, viewHeight * 0.32));

      let probeSection = '';
      let dominantSection = '';
      let maxDominanceScore = -1;

      for (const sectionId of sectionIdsRef.current) {
        if (sectionId === 'hero') continue;
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();

          // 1. Direct focal line intersection
          if (rect.top <= probeY && rect.bottom > probeY) {
            probeSection = sectionId;
          }

          // 2. Visibility and coverage scoring
          const visibleTop = Math.max(rect.top, viewTop);
          const visibleBottom = Math.min(rect.bottom, viewBottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const sectionHeight = Math.max(1, rect.height);
          const sectionRatio = visibleHeight / sectionHeight;
          const viewportRatio = visibleHeight / viewHeight;

          // Composite dominance score: balances section ratio and viewport coverage
          const dominanceScore = sectionRatio * 0.6 + viewportRatio * 0.4;

          if (sectionId === 'contact') {
            if (sectionRatio >= 0.5 && dominanceScore > maxDominanceScore) {
              maxDominanceScore = dominanceScore;
              dominantSection = sectionId;
            }
          } else if (visibleHeight > 0 && dominanceScore > maxDominanceScore) {
            maxDominanceScore = dominanceScore;
            dominantSection = sectionId;
          }
        }
      }

      // Direct probe section is preferred during rapid scroll if it exists and has visible presence
      return (
        probeSection ||
        dominantSection ||
        (container.scrollTop < 80 ? 'hero' : lastActiveSectionRef.current)
      );
    },
    [headerHeight]
  );

  // ── Setup IntersectionObserver & Scroll Listener ─────────────────────────
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Track visibility ratio of each section
    const visibleSections = new Map<string, number>();

    const containerHeight = container.clientHeight || window.innerHeight;
    let totalHeight = 0;
    let count = 0;

    sectionIdsRef.current.forEach((id) => {
      if (id === 'hero') return;
      const el = document.getElementById(id);
      if (el) {
        totalHeight += el.offsetHeight;
        count++;
      }
    });

    const avgSectionHeight = count > 0 ? totalHeight / count : containerHeight * 0.5;
    const heightRatio = avgSectionHeight / containerHeight;
    const bottomMarginPct = Math.min(40, Math.max(15, Math.round(heightRatio * 25)));
    const dynamicRootMargin = `-${headerHeight}px 0px -${bottomMarginPct}% 0px`;

    const observerOptions: IntersectionObserverInit = {
      root: container,
      rootMargin: dynamicRootMargin,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    };

    const updateHashAndSection = (sectionId: string) => {
      if (lastActiveSectionRef.current !== sectionId) {
        lastActiveSectionRef.current = sectionId;
        setActiveSection(sectionId);
      }
      if ((!isScrollingRef || !isScrollingRef.current) && !isViewingResume) {
        const targetHash = sectionId === 'hero' ? '' : `#${sectionId}`;
        const currentHash = window.location.hash;
        if (currentHash !== targetHash && !(sectionId === 'hero' && !currentHash)) {
          const newUrl =
            sectionId === 'hero'
              ? window.location.pathname + window.location.search
              : `${window.location.pathname}${window.location.search}#${sectionId}`;
          window.history.replaceState(null, '', newUrl);
        }
      }
    };

    let rafId: number | null = null;
    let isTicking = false;
    let scrollDebounceTimer: NodeJS.Timeout | null = null;

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

      if (isScrollingRef && isScrollingRef.current) return;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // No menu highlight at the top of the page (scrollTop < 80)
        if (container.scrollTop < 80) {
          updateHashAndSection('hero');
          return;
        }

        const isNearBottom =
          container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
        let maxRatio = -1;
        let dominantSection = '';

        // Prioritize the dominant section with greatest intersection ratio
        for (const sectionId of sectionIdsRef.current) {
          if (sectionId === 'hero') continue;
          const ratio = visibleSections.get(sectionId) || 0;

          if (sectionId === 'contact') {
            if ((ratio >= 0.5 || isNearBottom) && ratio > maxRatio) {
              maxRatio = ratio;
              dominantSection = sectionId;
            }
          } else {
            if (ratio > maxRatio && ratio >= 0.15) {
              maxRatio = ratio;
              dominantSection = sectionId;
            }
          }
        }

        if (dominantSection) {
          updateHashAndSection(dominantSection);
        } else if (container.scrollTop < 80) {
          updateHashAndSection('hero');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIdsRef.current.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Handle background blur on scroll > 20px with RAF throttle & rapid-scroll settling
    const handleScroll = () => {
      const isScrolled = container.scrollTop > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

      if (container.scrollTop < 80) {
        if (lastActiveSectionRef.current !== 'hero') {
          lastActiveSectionRef.current = 'hero';
          setActiveSection('hero');
        }
        return;
      }

      if (isScrollingRef && isScrollingRef.current) return;

      // Real-time RAF-throttled active section detection during rapid scrolling
      if (!isTicking) {
        isTicking = true;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const activeId = calculateActiveSection(container);
          if (activeId && lastActiveSectionRef.current !== activeId) {
            updateHashAndSection(activeId);
          }
          isTicking = false;
        });
      }

      // Settling debounce: ensures when rapid/inertial scrolling halts, the exact section is locked in
      if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
      scrollDebounceTimer = setTimeout(() => {
        if (container.scrollTop < 80) {
          updateHashAndSection('hero');
          return;
        }
        const settledActiveId = calculateActiveSection(container);
        if (settledActiveId && lastActiveSectionRef.current !== settledActiveId) {
          updateHashAndSection(settledActiveId);
        }
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerId, headerHeight, isViewingResume, isScrollingRef, calculateActiveSection]);

  return {
    activeSection,
    setActiveSection,
    scrolled,
    lastActiveSectionRef,
    calculateActiveSection,
  };
}
