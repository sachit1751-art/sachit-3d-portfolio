import React, { memo, useCallback, useRef } from 'react';
import { PaperTheme, PaperState } from '../../types';
import { Hero } from './Hero';
import { ScrollTextPath } from '../UI/ScrollTextPath';
import { About } from './About';
import { Philosophy } from './Philosophy';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { GitHubSection } from './GitHub';
import { Experience } from './Experience';
import { Education } from './Education';
import { Strengths } from './Strengths';
import { BuildingInPublic } from './BuildingInPublic';
import { ChatAboutMe } from './ChatAboutMe';
import { Contact } from './Contact';
import { ScrollReveal } from '../UI/ScrollReveal';

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

  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

      if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        const sections = ['hero', 'about', 'philosophy', 'projects', 'skills', 'github', 'experience', 'education', 'strengths', 'building-in-public', 'chat', 'contact'];
        
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
      data-theme={theme}
      className="relative w-full min-h-screen transition-colors duration-500"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        id="physical-paper-sheet"
        className="relative w-full max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto overflow-x-hidden py-10 sm:py-14 md:py-20 px-4 sm:px-10 md:px-14"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div className="relative z-10">
          <Hero
            onExploreProjects={handleExploreProjects}
            onContactClick={handleContactClick}
            onViewResume={onViewResume}
          />

          <ScrollTextPath text="Coding • Building • Creating • Designing" className="-my-8" />

          <ScrollReveal>
            <About />
          </ScrollReveal>
          <ScrollReveal>
            <Philosophy />
          </ScrollReveal>
          <ScrollReveal>
            <Projects />
          </ScrollReveal>
          <ScrollReveal>
            <Skills />
          </ScrollReveal>
          <ScrollReveal>
            <GitHubSection theme={theme} />
          </ScrollReveal>
          <ScrollReveal>
            <Experience />
          </ScrollReveal>
          <ScrollReveal>
            <Education />
          </ScrollReveal>
          <ScrollReveal>
            <Strengths />
          </ScrollReveal>
          <ScrollReveal>
            <BuildingInPublic />
          </ScrollReveal>
          <ScrollReveal>
            <ChatAboutMe theme={theme} paperState={paperState} />
          </ScrollReveal>
          <ScrollReveal>
            <Contact />
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
});

PortfolioContainer.displayName = 'PortfolioContainer';

