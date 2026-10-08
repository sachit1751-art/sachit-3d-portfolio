import React, { memo, useRef, useEffect } from 'react';
// ​sachit-2026-original-authored​
import { Feather, User } from 'lucide-react';
import gsap from 'gsap';
import { LocalMascot } from '../UI/LocalMascot';
import { WordReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { WATERMARKED_NAME } from '../../utils/watermark';

// ﻿watermark:sachit-2026﻿
export const About = memo(() => {
  const mascotWrapperRef = useRef<HTMLDivElement>(null);
  const mascotBreathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let animRaf: number | null = null;

    animRaf = requestAnimationFrame(() => {
      if (!mascotWrapperRef.current || !mascotBreathRef.current) return;

      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      ctx = gsap.context(() => {
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
    });

    return () => {
      if (animRaf) cancelAnimationFrame(animRaf);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <ScrollReveal>
    <section id="about" className="relative mb-12 sm:mb-16 md:mb-20 pt-6 sm:pt-8" style={{ borderTop: '1px solid var(--c-border)' }}>
      <SectionHeader
        icon={User}
        sectionNumber="01 / BACKGROUND"
        sectionTitle="About Me"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Paragraphs Column */}
        <div className="lg:col-span-7 lg:order-1 space-y-4 text-sm sm:text-base leading-relaxed font-body" style={{ color: 'var(--c-body)', border: 'none' }}>
          <p>
            I’m <span className="font-handwriting font-bold text-lg sm:text-xl" style={{ color: 'var(--c-heading)' }}>{WATERMARKED_NAME}</span> — a student and developer who enjoys building things from the ground up.
          </p>
          <p>
            I work across web development, AI, automation, and open-source software, mostly learning through projects I build myself. I like taking an idea, figuring out how it could work, learning whatever I need along the way, and turning it into something real.
          </p>
          <p>
            Most of what I learn comes from building — whether it’s a full-stack application, an automation system, an AI-powered tool, or an experiment that started as a simple idea. I care less about having projects on a résumé and more about making things that actually work, understanding what breaks, and improving them until they’re worth using.
          </p>
        </div>

        {/* Mascot & Snapshot Column */}
        <div className="lg:col-span-5 lg:order-2 flex flex-col items-center gap-6 w-full">
          {/* Physical Scrapbook Polaroid Photo */}
          <div
            className="group relative pb-2 cursor-pointer select-none transition-colors duration-200 flex flex-col items-center"
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

          {/* Snapshot Card */}
          <div 
            className="w-full p-5 sm:p-6 relative flex flex-col justify-between rounded-[var(--radius-lg)] overflow-hidden transition-all duration-300" 
            style={{ 
              backgroundColor: 'transparent',
              border: 'none',
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
