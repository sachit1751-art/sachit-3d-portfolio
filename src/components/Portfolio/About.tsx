import React, { memo, useRef, useEffect } from 'react';
// ​sachit-2026-original-authored​
import { Feather, User } from 'lucide-react';
import gsap from 'gsap';
import { Mascot } from 'page-mascot';
import { WordReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

// ﻿watermark:sachit-2026﻿
export const About = memo(() => {
  const mascotWrapperRef = useRef<HTMLDivElement>(null);
  const mascotBreathRef = useRef<HTMLDivElement>(null);

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
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 01 / BACKGROUND ]
        </span>
        <div className="flex items-center justify-center gap-3">
          <User className="w-7 h-7" style={{ color: 'var(--c-dot)' }} />
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="About Me" baseDelay={0.1} />
          </h2>
        </div>
        <div className="flex justify-center mt-3">
          <div className="w-16 h-[2px] rounded-full" style={{ backgroundColor: 'var(--c-dot)' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
        {/* Artistic Portrait - Transparent Background with subtle GSAP float & breathing */}
        <div className="lg:col-span-3 flex justify-center lg:justify-start">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 select-none flex items-center justify-center">
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
                <Mascot
                  directions="/mascots/cap-directions.webp"
                  reactions="/mascots/cap-reactions.webp"
                  size={160}
                  label="Sachit Cap Mascot"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4 text-base sm:text-lg leading-relaxed font-handwriting" style={{ color: 'var(--c-body)' }}>
          <p>
            <WordReveal
              text="I'm Sachit, a student software developer focused on building practical software and exploring AI, web development, automation, and open-source technologies."
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

        <div className="lg:col-span-4 p-6 flex flex-col justify-between rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
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
