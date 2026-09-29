import React, { memo, useRef, useEffect } from 'react';
// ​‌sachit-2026-original-author‌​
import gsap from 'gsap';
import { ArrowRightIcon, MailCheckIcon, FileTextIcon, LinkedinIcon } from 'lucide-animated';
import { WordReveal } from '../UI/TextReveal';
import { DepthFlipText } from '../UI/DepthFlipText';
import { QuoteRoll } from '../UI/QuoteRoll';
import { GitHubIcon } from '../UI/Icons';
import { DEV_QUOTES } from '../../data/quotes';
import { WATERMARKED_NAME } from '../../utils/watermark';
import { copyEmailToClipboard } from '../UI/Toast';

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
      // Animate Hero Elements with a fast, fluid stagger
      gsap.fromTo(
        '.gsap-hero-title',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
      );

      gsap.fromTo(
        '.gsap-hero-btn',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)', delay: 0.25 }
      );

      gsap.fromTo(
        '.gsap-hero-social',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.4 }
      );

      gsap.fromTo(
        '.gsap-hero-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.5 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Hero Introduction"
      className="relative z-10 pt-20 pb-12 sm:pt-28 sm:pb-16 flex flex-col justify-center min-h-[82vh]"
    >
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-[var(--c-border)] bg-[var(--c-card)]">
          <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
          <span style={{ color: 'var(--c-body)' }}>Available for Software Engineering Roles</span>
        </div>

        {/* Dynamic Dev Quote Carousel */}
        <QuoteRoll quotes={DEV_QUOTES} className="hidden sm:block" />
      </div>

      <div className="relative z-10 mb-6">
        <h1 className="gsap-hero-title text-[var(--fluid-h1)] font-sans font-bold tracking-tight leading-[1.08] mb-4">
          <DepthFlipText
            singleText={`Hello, I'm ${WATERMARKED_NAME}.`}
            className="text-[var(--c-heading)]"
          />
        </h1>

        <p className="max-w-2xl text-base sm:text-lg md:text-xl font-body leading-relaxed text-[var(--c-body)]">
          <WordReveal
            text="Software Developer & Prompt Engineer creating full-stack web applications, custom Android platforms, and AI automation tools."
            baseDelay={0.1}
          />
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
        <button
          onClick={onExploreProjects}
          aria-label="View Projects"
          className="gsap-hero-btn view-projects-btn px-5 sm:px-6 py-3 font-body text-sm sm:text-base transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-[var(--c-btn-bg-hover)] flex items-center gap-2 cursor-pointer rounded-[var(--radius-md)]"
          style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
        >
          <span>View Projects</span>
          <ArrowRightIcon size={16} className="arrow-icon" />
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
            <FileTextIcon size={16} />
            <span>View Resume</span>
          </button>
        )}

        <button
          onClick={onContactClick}
          aria-label="Contact Me"
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
            <LinkedinIcon size={16} />
          </a>
          <a
            href="mailto:sachit1751@gmail.com"
            onClick={(e) => {
              e.preventDefault();
              copyEmailToClipboard('sachit1751@gmail.com');
            }}
            aria-label="Copy email address: sachit1751@gmail.com"
            title="Click to copy email address to clipboard"
            className="gsap-hero-social w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
          >
            <MailCheckIcon size={16} />
          </a>
        </div>

        <div className="gsap-hero-social flex flex-wrap items-center gap-4 text-sm font-mono">
          <a
            href="mailto:sachit1751@gmail.com"
            onClick={(e) => {
              e.preventDefault();
              copyEmailToClipboard('sachit1751@gmail.com');
            }}
            className="hover:underline cursor-pointer transition-colors"
            style={{ color: 'var(--c-heading)' }}
            aria-label="Copy email address: sachit1751@gmail.com"
            title="Click to copy email address to clipboard"
          >
            sachit1751@gmail.com
          </a>
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
              AI Automation
            </h3>
            <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--c-body)' }}>
              Claude API · MCP · Prompt Engineering
            </p>
          </div>
        </div>

        <div className="gsap-hero-card hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative" role="listitem" aria-label="Mobile Platforms focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-subtle)' }}>
              Focus • Mobile
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              003
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-xl font-bold font-sans" style={{ color: 'var(--c-heading)' }}>
              Android Platforms
            </h3>
            <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--c-body)' }}>
              Kotlin · Jetpack Compose · Custom ROMs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
