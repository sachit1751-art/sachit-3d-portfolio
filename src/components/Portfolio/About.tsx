import React, { memo, useRef, useEffect } from 'react';
// ​sachit-2026-original-authored​
import { Feather, User } from 'lucide-react';
import gsap from 'gsap';
import { LocalMascot } from '../UI/LocalMascot';
import { WordReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { useTiltParallax } from '../../hooks/useTiltParallax';
import { WATERMARKED_NAME } from '../../utils/watermark';

// ﻿watermark:sachit-2026﻿
export const About = memo(() => {
  const mascotWrapperRef = useRef<HTMLDivElement>(null);
  const mascotBreathRef = useRef<HTMLDivElement>(null);

  // 3D Tilt-Parallax for Polaroid Photo & Snapshot Card
  const { elementRef: polaroidRef, glareRef: polaroidGlareRef } = useTiltParallax<HTMLDivElement>({
    maxTilt: 12,
    perspective: 800,
    scaleOnHover: 1.03,
    glare: true,
  });

  const { elementRef: snapshotCardRef, glareRef: snapshotGlareRef } = useTiltParallax<HTMLDivElement>({
    maxTilt: 8,
    perspective: 800,
    scaleOnHover: 1.02,
    glare: true,
  });

  useEffect(() => {
    if (!mascotWrapperRef.current || !mascotBreathRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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
  }, []);

  return (
    <ScrollReveal>
    <section id="about" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-8">
        <div className="flex justify-center mb-3">
          <User className="w-6 h-6" style={{ color: 'var(--c-dot)' }} />
        </div>
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 01 / BACKGROUND ]
        </span>
        <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
          <WordReveal text="About Me" baseDelay={0.1} />
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
        {/* Physical Scrapbook Polaroid Photo with 3D Tilt-Parallax */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-start justify-center">
          <div
            ref={polaroidRef}
            className="group relative p-3 pb-4 rounded-[var(--radius-md)] cursor-pointer select-none transition-colors duration-200"
            style={{
              backgroundColor: 'var(--c-card)',
              border: '1px solid var(--c-border)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
            title="Interactive Mascot Polaroid"
          >
            {/* Washi Tape Corner Accent */}
            <div 
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 opacity-80 pointer-events-none z-20 shadow-xs"
              style={{
                backgroundColor: 'rgba(215, 195, 165, 0.65)',
                transform: 'rotate(-2deg) translateZ(24px)',
                borderLeft: '2px dashed rgba(180, 160, 130, 0.4)',
                borderRight: '2px dashed rgba(180, 160, 130, 0.4)',
              }}
            />

            {/* Specular glare sheen */}
            <div
              ref={polaroidGlareRef}
              className="pointer-events-none absolute inset-0 z-30 rounded-[var(--radius-md)] opacity-0 overflow-hidden"
              style={{ mixBlendMode: 'overlay' }}
              aria-hidden="true"
            />

            {/* Inner Photo Frame */}
            <div 
              className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-sm flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                border: '1px solid var(--c-border)',
                transform: 'translateZ(14px)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Mascot Container with Subtle Float & Breathing Animations */}
              <div 
                ref={mascotWrapperRef}
                className="relative w-full h-full flex items-center justify-center bg-transparent will-change-transform"
                style={{ 
                  backgroundColor: 'transparent',
                  transform: 'translateZ(20px)',
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
                color: 'var(--c-heading)',
                transform: 'translateZ(18px)',
              }}
            >
              Sachit ( tap me! )
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4 text-base sm:text-lg leading-relaxed font-handwriting" style={{ color: 'var(--c-body)' }}>
          <p>
            <WordReveal
              text={`I'm ${WATERMARKED_NAME}, a student software developer focused on building practical software and exploring AI, web development, automation, and open-source technologies.`}
              baseDelay={0.2}
            />
          </p>
          <p>
            <WordReveal
              text="I work with Python, JavaScript, TypeScript, React, Supabase, PostgreSQL, and AI APIs, while experimenting with tools such as Claude API and MCP."
              baseDelay={0.5}
            />
          </p>
          <p>
            <WordReveal
              text="I enjoy turning ideas into working projects, learning by building, and exploring how AI can make software more useful and efficient."
              baseDelay={0.8}
            />
          </p>
        </div>

        <div 
          ref={snapshotCardRef}
          className="lg:col-span-4 p-6 relative flex flex-col justify-between rounded-[var(--radius-lg)] overflow-hidden transition-all duration-300" 
          style={{ 
            backgroundColor: 'var(--c-card)',
            border: '1px solid var(--c-border)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Subtle paper glare sheen */}
          <div
            ref={snapshotGlareRef}
            className="pointer-events-none absolute inset-0 z-30 rounded-[var(--radius-lg)] opacity-0"
            style={{ mixBlendMode: 'overlay' }}
            aria-hidden="true"
          />

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

          <div className="mt-6 pt-4 flex items-center justify-between text-sm font-handwriting" style={{ borderTop: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>
            <span>Based: Remote</span>
            <span>Mode: Building</span>
          </div>
        </div>
      </div>
    </section>
    </ScrollReveal>
  );
});

About.displayName = 'About';
