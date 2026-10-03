import React, { memo, useRef, useEffect, useState } from 'react';
// ​sachit-2026-original-authored​
import { Feather, User } from 'lucide-react';
import gsap from 'gsap';
import { LocalMascot } from '../UI/LocalMascot';
import { WordReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { WATERMARKED_NAME } from '../../utils/watermark';
import { observeElement } from '../../utils/observer';
import { usePerformance } from '../../hooks/usePerformance';

// ﻿watermark:sachit-2026﻿
export const About = memo(() => {
  const mascotWrapperRef = useRef<HTMLDivElement>(null);
  const mascotBreathRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { simplify } = usePerformance();

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // IntersectionObserver for smooth fade-in transition as the user scrolls into view
  useEffect(() => {
    if (simplify || isReducedMotion) {
      setIsVisible(true);
      return;
    }

    const gridEl = gridRef.current;
    if (!gridEl) return;

    const scroller = document.getElementById('content-scroll-container');

    const unobserve = observeElement(
      gridEl,
      (isIntersecting) => {
        if (isIntersecting) {
          setIsVisible(true);
        }
      },
      { root: scroller, threshold: 0.05, rootMargin: '0px 0px -20px 0px' },
      true
    );

    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    return () => {
      clearTimeout(fallbackTimer);
      if (unobserve) unobserve();
    };
  }, [simplify, isReducedMotion]);

  useEffect(() => {
    if (!mascotWrapperRef.current || !mascotBreathRef.current) return;

    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Gentle, subtle vertical float (weightless bobbing)
      gsap.to(mascotWrapperRef.current, {
        y: -6,
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // 2. Subtle rhythmic breathing expansion
      gsap.to(mascotBreathRef.current, {
        scaleY: 1.025,
        scaleX: 1.01,
        transformOrigin: '50% 85%',
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [isReducedMotion]);

  const aboutParagraphs = [
    <>
      I’m <span className="font-handwriting font-bold text-lg sm:text-xl" style={{ color: 'var(--c-heading)' }}>{WATERMARKED_NAME}</span> — a student and developer who enjoys building things from the ground up.
    </>,
    <>
      I work across web development, AI, automation, and open-source software, mostly learning through projects I build myself. I like taking an idea, figuring out how it could work, learning whatever I need along the way, and turning it into something real.
    </>,
    <>
      Most of what I learn comes from building — whether it’s a full-stack application, an automation system, an AI-powered tool, or an experiment that started as a simple idea. I care less about having projects on a résumé and more about making things that actually work, understanding what breaks, and improving them until they’re worth using.
    </>,
  ];

  return (
    <ScrollReveal>
    <section id="about" className="relative mb-16 sm:mb-20 pt-8 sm:pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-center mb-2.5">
          <User className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--c-dot)' }} />
        </div>
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-1.5" style={{ color: 'var(--c-muted)' }}>
          [ 01 / BACKGROUND ]
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
          <WordReveal text="About Me" baseDelay={0.1} />
        </h2>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Paragraphs (Left Side) mapped over with index * 0.1s transitionDelay */}
        <div 
          className="lg:col-span-7 lg:order-1 space-y-4 text-sm sm:text-base leading-relaxed font-body" 
          style={{ 
            color: 'var(--c-body)', 
            border: 'none',
          }}
        >
          {aboutParagraphs.map((paragraph, index) => (
            <p
              key={index}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
                transition: isReducedMotion ? 'none' : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isReducedMotion ? '0s' : `${index * 0.1}s`,
                willChange: 'opacity, transform',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Mascot & Snapshot (Right Side) with index * 0.1s transitionDelay */}
        <div 
          className="lg:col-span-5 lg:order-2 flex flex-col sm:flex-row lg:flex-col gap-6 items-center lg:items-stretch"
        >
          {/* Physical Scrapbook Polaroid Photo (Child Index 3) */}
          <div 
            className="flex flex-col items-center lg:items-center justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
              transition: isReducedMotion ? 'none' : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: isReducedMotion ? '0s' : `${3 * 0.1}s`,
              willChange: 'opacity, transform',
            }}
          >
            <div
              className="group relative pb-4 cursor-pointer select-none transition-colors duration-200"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
              title="Interactive Mascot"
            >
              {/* Inner Photo Frame */}
              <div 
                className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center overflow-visible"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                {/* Mascot Container with Subtle Float & Breathing Animations */}
                <div 
                  ref={mascotWrapperRef}
                  className="relative w-full h-full flex items-center justify-center bg-transparent will-change-transform"
                  style={{ 
                    backgroundColor: 'transparent',
                  }}
                >
                  <div 
                    ref={mascotBreathRef}
                    className="w-full h-full flex items-center justify-center relative bg-transparent will-change-transform"
                    style={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    <LocalMascot
                      directions="/mascots/cap-directions.webp"
                      reactions="/mascots/cap-reactions.webp"
                      size={140}
                      label="Sachit Cap Mascot"
                    />
                  </div>
                </div>
              </div>

              {/* Polaroid Bottom Handwritten Caption */}
              <div 
                className="pt-2 text-center text-xs font-handwriting select-none"
                style={{
                  color: 'var(--c-subtle)',
                }}
              >
                ( tap me! )
              </div>
            </div>
          </div>

          {/* Snapshot Container (Child Index 4) */}
          <div 
            className="w-full p-6 relative flex flex-col justify-between rounded-[var(--radius-lg)] overflow-hidden transition-all duration-300" 
            style={{ 
              backgroundColor: 'transparent',
              border: 'none',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
              transition: isReducedMotion ? 'none' : 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: isReducedMotion ? '0s' : `${4 * 0.1}s`,
              willChange: 'opacity, transform',
            }}
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-1.5 font-semibold" style={{ color: 'var(--c-subtle)' }}>
                <Feather className="w-3.5 h-3.5" style={{ color: 'var(--c-heading)' }} />
                Snapshot
              </div>
              <ul className="space-y-4 text-base font-body" style={{ color: 'var(--c-body)' }}>
                <li>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--c-faint)' }}>Currently</span>
                  <span className="font-handwriting text-lg" style={{ color: 'var(--c-heading)' }}>Class 12 — PCMB</span>
                </li>
                <li>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--c-faint)' }}>Primary Focus</span>
                  <span className="font-handwriting text-lg" style={{ color: 'var(--c-heading)' }}>Full-Stack · AI · Automation</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between text-sm font-handwriting" style={{ borderTop: 'none', color: 'var(--c-muted)' }}>
              <span>Based: Remote</span>
              <span>Mode: Building</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    </ScrollReveal>
  );
});

About.displayName = 'About';

