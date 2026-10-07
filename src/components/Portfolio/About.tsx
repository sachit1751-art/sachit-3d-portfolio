import React, { memo, useRef, useEffect } from 'react';
// ​sachit-2026-original-authored​
import gsap from 'gsap';
import { LocalMascot } from '../UI/LocalMascot';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';
import { Compass } from 'lucide-react';
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
      <section id="about" className="relative mb-16 sm:mb-20 pt-8 sm:pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <SectionHeader
          kicker="01. Background"
          title="About Me"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          {/* Paragraphs Column */}
          <div className="lg:col-span-7 lg:order-1 space-y-4 text-base sm:text-lg leading-relaxed font-sans" style={{ color: 'var(--c-body)' }}>
            <p>
              I’m <span className="font-bold text-[var(--c-heading)]">{WATERMARKED_NAME}</span> — an independent developer who enjoys building software products from the ground up.
            </p>
            <p>
              I work across full-stack web development, AI integrations, automation, and open-source systems. My approach is project-driven: I take ideas, architect how they should work, learn whatever tools are needed, and turn them into resilient production software.
            </p>
            <p>
              I care less about adding items to a résumé and more about building tools that actually solve problems, understanding failure modes, and refining the user experience until every interaction feels deliberate.
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

            {/* Polaroid Bottom Caption */}
            <div 
              className="pt-2 text-center text-xs font-mono select-none"
              style={{
                color: 'var(--c-muted)',
              }}
            >
              ( interactive mascot )
            </div>
          </div>

          {/* Snapshot Card — Standardized with Card primitive */}
          <Card className="w-full p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5 font-semibold" style={{ color: 'var(--c-muted)' }}>
                <Compass className="w-4 h-4" style={{ color: 'var(--c-heading)' }} />
                Snapshot
              </div>
              <ul className="space-y-4 font-sans" style={{ color: 'var(--c-body)' }}>
                <li>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--c-muted)' }}>Currently</span>
                  <span className="font-sans font-semibold text-base sm:text-lg" style={{ color: 'var(--c-heading)' }}>Class 12 — PCMB</span>
                </li>
                <li>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--c-muted)' }}>Primary Focus</span>
                  <span className="font-sans font-semibold text-base sm:text-lg" style={{ color: 'var(--c-heading)' }}>Full-Stack · AI · Automation</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider" style={{ borderTop: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>
              <span>Based: Remote</span>
              <span>Mode: Building</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
    </ScrollReveal>
  );
});

About.displayName = 'About';
