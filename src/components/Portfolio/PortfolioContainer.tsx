import React, { memo, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { PaperTheme, PaperState } from '../../types';
import { Hero } from './Hero';
import { ScrollTextPath } from '../UI/ScrollTextPath';
import { About } from './About';
import { Philosophy } from './Philosophy';
import { ScrollReveal } from '../UI/ScrollReveal';
import { attachPointerEventInspector } from '../../utils/pointerEventHandler';

// Dynamic dynamic imports for below-the-fold content blocks to defer heavy JS execution
const Projects = lazy(() => import('./Projects').then(m => ({ default: m.Projects })));
const Skills = lazy(() => import('./Skills').then(m => ({ default: m.Skills })));
const CurrentlyBuilding = lazy(() => import('./CurrentlyBuilding').then(m => ({ default: m.CurrentlyBuilding })));
const GitHubSection = lazy(() => import('./GitHub').then(m => ({ default: m.GitHubSection })));
const Experience = lazy(() => import('./Experience').then(m => ({ default: m.Experience })));
const Education = lazy(() => import('./Education').then(m => ({ default: m.Education })));
const Strengths = lazy(() => import('./Strengths').then(m => ({ default: m.Strengths })));
const BuildingInPublic = lazy(() => import('./BuildingInPublic').then(m => ({ default: m.BuildingInPublic })));
const ChatAboutMe = lazy(() => import('./ChatAboutMe').then(m => ({ default: m.ChatAboutMe })));
const Contact = lazy(() => import('./Contact').then(m => ({ default: m.Contact })));

function SectionPlaceholder() {
  return <div className="h-48 animate-pulse bg-transparent rounded-lg border border-transparent" />;
}

interface PortfolioContainerProps {
  theme: PaperTheme;
  paperState?: PaperState;
  onViewResume?: () => void;
}

// ﻿sachit-2026-original﻿
export const PortfolioContainer = memo<PortfolioContainerProps>(({
  theme,
  paperState = 'opened',
  onViewResume,
}) => {
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const mainRef = useRef<HTMLElement>(null);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Unified PointerEventHandler Inspector for tracking and diagnosing button pointer events
  useEffect(() => {
    if (!mainRef.current) return;
    const cleanup = attachPointerEventInspector(mainRef.current, 'PortfolioContainer');
    return cleanup;
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    const targetEl = e.target as HTMLElement | null;
    if (targetEl && targetEl.closest('input, textarea, select, form, .overflow-x-auto, [data-prevent-swipe]')) {
      touchStartXRef.current = 0;
      return;
    }
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    if (!touchStartXRef.current) return;
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

      if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        const sections = [
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
        
        let currentIndex = 0;
        let minDistance = Infinity;
        sections.forEach((id, idx) => {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const dist = Math.abs(rect.top);
            if (dist < minDistance) {
              minDistance = dist;
              currentIndex = idx;
            }
          }
        });

        if (deltaX < 0) {
          const nextIndex = Math.min(sections.length - 1, currentIndex + 1);
          scrollToSection(sections[nextIndex]);
        } else {
          const prevIndex = Math.max(0, currentIndex - 1);
          scrollToSection(sections[prevIndex]);
        }
      }
    }
  };

  const handleExploreProjects = useCallback(() => scrollToSection('projects'), [scrollToSection]);
  const handleContactClick = useCallback(() => scrollToSection('contact'), [scrollToSection]);

  return (
    <main
      ref={mainRef}
      data-theme={theme}
      className="relative w-full min-h-screen transition-colors duration-500"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        id="physical-paper-sheet"
        className="relative w-full max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto overflow-x-hidden pt-20 pb-10 sm:pt-24 sm:pb-14 md:pt-28 md:pb-20 px-4 sm:px-10 md:px-14 pointer-events-auto"
      >
        <div className="relative z-10 pointer-events-auto">
          <Hero
            onExploreProjects={handleExploreProjects}
            onContactClick={handleContactClick}
            onViewResume={onViewResume}
          />

          <ScrollTextPath text="Coding • Building • Creating • Designing" className="my-10 md:-my-8" />

          <ScrollReveal>
            <About />
          </ScrollReveal>
          <ScrollReveal>
            <Philosophy />
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <Projects />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <Skills />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <CurrentlyBuilding />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <GitHubSection theme={theme} />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <Experience />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <Education />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <Strengths />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <BuildingInPublic />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <ChatAboutMe theme={theme} paperState={paperState} />
            </Suspense>
          </ScrollReveal>
          <ScrollReveal>
            <Suspense fallback={<SectionPlaceholder />}>
              <Contact />
            </Suspense>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
});

PortfolioContainer.displayName = 'PortfolioContainer';

