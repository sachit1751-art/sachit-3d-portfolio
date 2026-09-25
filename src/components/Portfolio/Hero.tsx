import React, { memo, useRef, useEffect } from 'react';
// ​‌sachit-2026-original-author‌​
import gsap from 'gsap';
import { ArrowDownRight, Mail, FileText } from 'lucide-react';
import { WordReveal } from '../UI/TextReveal';
import { DepthFlipText } from '../UI/DepthFlipText';
import { QuoteRoll } from '../UI/QuoteRoll';
import { GitHubIcon } from '../UI/Icons';
import { DEV_QUOTES } from '../../data/quotes';

interface HeroProps {
  onExploreProjects: () => void;
  onContactClick: () => void;
  onViewResume?: () => void;
}

// ﻿watermark:sachit-portfolio-2026﻿
export const Hero = memo<HeroProps>(({
  onExploreProjects,
  onContactClick,
  onViewResume,
}) => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const heroHeader = gsap.utils.toArray<HTMLElement>('.gsap-hero-header', heroRef.current);
      const heroStatus = gsap.utils.toArray<HTMLElement>('.gsap-hero-status', heroRef.current);
      const heroSubtitle = gsap.utils.toArray<HTMLElement>('.gsap-hero-subtitle', heroRef.current);
      const heroTitle = gsap.utils.toArray<HTMLElement>('.gsap-hero-title', heroRef.current);
      const heroDesc = gsap.utils.toArray<HTMLElement>('.gsap-hero-desc', heroRef.current);
      const heroBtn = gsap.utils.toArray<HTMLElement>('.gsap-hero-btn', heroRef.current);
      const heroSocial = gsap.utils.toArray<HTMLElement>('.gsap-hero-social', heroRef.current);
      const heroCard = gsap.utils.toArray<HTMLElement>('.gsap-hero-card', heroRef.current);

      if (heroHeader.length) {
        tl.fromTo(heroHeader, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 });
      }
      if (heroStatus.length) {
        tl.fromTo(heroStatus, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.3');
      }
      if (heroSubtitle.length) {
        tl.fromTo(heroSubtitle, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.35');
      }
      if (heroTitle.length) {
        tl.fromTo(heroTitle, { opacity: 0, y: 16, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.65 }, '-=0.35');
      }
      if (heroDesc.length) {
        tl.fromTo(heroDesc, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.4');
      }
      if (heroBtn.length) {
        tl.fromTo(heroBtn, { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08 }, '-=0.35');
      }
      if (heroSocial.length) {
        tl.fromTo(heroSocial, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, clearProps: 'transform' }, '-=0.3');
      }
      if (heroCard.length) {
        tl.fromTo(heroCard, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, clearProps: 'transform' }, '-=0.3');
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative mb-4 pt-0 pb-4">
      <div className="mb-6">
        <div
          className="gsap-hero-status flex flex-wrap items-center justify-between gap-3 text-xs pb-3.5 mb-6 border-b"
          style={{ borderColor: 'var(--c-border)', color: 'var(--c-subtle)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--c-dot)' }} />
            <QuoteRoll
              quotes={DEV_QUOTES}
              interval={4500}
              className="font-handwriting text-base sm:text-lg italic tracking-normal"
            />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] opacity-80 flex-shrink-0" style={{ color: 'var(--c-heading)' }}>
            <span className="opacity-40">—</span>
            <span>I CAN BUILD ANYTHING.</span>
          </div>
        </div>
        <div className="mb-4">
          <p className="gsap-hero-subtitle font-handwriting text-lg sm:text-xl mb-2" style={{ color: 'var(--c-subtle)' }}>
            Independent Developer
          </p>
        </div>
        <h1 className="gsap-hero-title text-[clamp(2.2rem,1.25rem+4.5vw,5.25rem)] leading-[1.18] font-handwriting font-bold tracking-tight my-2 overflow-visible" style={{ color: 'var(--c-heading)', paddingRight: '0.1em' }}>
          <span className="sr-only">Sachit</span>
          <span className="inline-block" aria-hidden="true">
            <DepthFlipText
              phrases={[
                "Full-Stack Web Developer",
                "AI & Prompt Engineer",
                "Next.js Frontend Developer",
                "Native Android Developer",
                "LLM Integration Developer",
                "REST API & Backend Engineer",
                "Web & Mobile Developer",
                "UI & Motion Engineer",
                "Software Product Engineer",
                "Best Vibecoder"
              ]}
              interval={3800}
            />
          </span>
        </h1>
        <p className="gsap-hero-desc max-w-[540px] leading-relaxed text-lg sm:text-xl font-body opacity-90 mt-5" style={{ color: 'var(--c-heading)' }}>
          <WordReveal
            text="I build full-stack web applications, architect AI integrations, and automate workflows."
            baseDelay={0.1}
          />
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
        <button
          onClick={onExploreProjects}
          className="gsap-hero-btn view-projects-btn px-5 sm:px-6 py-3 font-body text-sm sm:text-base transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-[var(--c-btn-bg-hover)] flex items-center gap-2 cursor-pointer rounded-[var(--radius-md)]"
          style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
        >
          <span>View Projects</span>
          <ArrowDownRight className="arrow-icon w-4 h-4" />
        </button>

        {onViewResume && (
          <button
            onClick={onViewResume}
            className="gsap-hero-btn px-5 sm:px-6 py-3 font-body text-sm sm:text-base font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer rounded-[var(--radius-md)]"
            style={{
              border: '1px solid var(--c-border)',
              backgroundColor: 'var(--c-input-bg)',
              color: 'var(--c-heading)',
            }}
            aria-label="View Resume"
          >
            <FileText className="w-4 h-4" />
            <span>View Resume</span>
          </button>
        )}

        <button
          onClick={onContactClick}
          className="gsap-hero-btn jellyfish-btn px-5 sm:px-6 py-3 bg-transparent font-handwriting text-base cursor-pointer"
        >
          <span>Contact Me</span>
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-3 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/sachit1751-art"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="gsap-hero-social w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
          >
            <GitHubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/sachit"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="gsap-hero-social w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a
            href="mailto:sachit1751@gmail.com"
            aria-label="Email"
            className="gsap-hero-social w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        <div className="gsap-hero-social flex flex-wrap items-center gap-4 text-sm font-mono" style={{ color: 'var(--c-body)' }}>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            sachit1751@gmail.com
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-6 pt-4" role="list" aria-label="Focus areas">
        <div className="gsap-hero-card hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative" role="listitem" aria-label="Web Development focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-subtle)' }}>
              Focus • Building
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              001
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-xl font-bold font-sans" style={{ color: 'var(--c-heading)' }}>
              Web Development
            </h3>
            <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--c-body)' }}>
              React · TypeScript · Vite
            </p>
          </div>
        </div>

        <div className="gsap-hero-card hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative" role="listitem" aria-label="AI & Agents focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-subtle)' }}>
              Focus • Intelligence
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              002
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-xl font-bold font-sans" style={{ color: 'var(--c-heading)' }}>
              AI & Automation
            </h3>
            <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--c-body)' }}>
              Claude API · MCP · Prompt Engineering
            </p>
          </div>
        </div>

        <div className="gsap-hero-card hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative" role="listitem" aria-label="UI/UX focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-subtle)' }}>
              Focus • Craft
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              003
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-xl font-bold font-sans" style={{ color: 'var(--c-heading)' }}>
              UI / UX
            </h3>
            <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--c-body)' }}>
              Interface · Interaction · Design
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
