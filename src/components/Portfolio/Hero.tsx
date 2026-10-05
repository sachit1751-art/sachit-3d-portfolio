import React, { memo, useRef, useEffect } from 'react';
// ​‌sachit-2026-original-author‌​
import gsap from 'gsap';
import { ArrowDownRight, Mail, FileText } from 'lucide-react';
import { DepthFlipText } from '../UI/DepthFlipText';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { GitHubIcon } from '../UI/Icons';
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
    let ctx: gsap.Context | null = null;
    let animRaf: number | null = null;

    animRaf = requestAnimationFrame(() => {
      if (!heroRef.current) return;

      ctx = gsap.context(() => {
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
    });

    return () => {
      if (animRaf) cancelAnimationFrame(animRaf);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative mb-8 pt-2 pb-6">
      <div className="mb-8">
        {/* Restrained single status kicker — no competing QuoteRoll */}
        <div
          className="gsap-hero-status flex flex-wrap items-center justify-between gap-3 text-xs pb-4 mb-6 border-b"
          style={{ borderColor: 'var(--c-border)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--c-muted)]">
              Available for projects & engineering
            </span>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--c-muted)]">
            Delhi, India
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-2">
          <p className="gsap-hero-subtitle font-sans text-sm sm:text-base font-semibold uppercase tracking-[0.16em] text-[var(--c-muted)]">
            Independent Developer
          </p>

          <h1 className="gsap-hero-title text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[var(--c-heading)] leading-[1.08] my-3">
            <span className="sr-only" data-author="Sachit" data-provenance="sachit-2026-original-creator">{WATERMARKED_NAME}</span>
            <span className="block mb-2">{WATERMARKED_NAME}</span>
            {/* The single restrained animated detail in Hero */}
            <span className="block text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--c-muted)]" aria-hidden="true">
              <DepthFlipText
                phrases={[
                  "Full-Stack Web Developer",
                  "AI & Automation Engineer",
                  "Frontend & Mobile Developer",
                  "Systems & Backend Developer",
                  "Open Source Builder"
                ]}
                interval={3200}
              />
            </span>
          </h1>

          <p className="gsap-hero-desc max-w-xl text-base sm:text-lg leading-relaxed text-[var(--c-body)] pt-2">
            I build full-stack web applications, architect AI integrations, and automate workflows with TypeScript, React, Python, and modern cloud primitives.
          </p>
        </div>
      </div>

      {/* Standardized Call to Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
        <Button
          onClick={onExploreProjects}
          aria-label="View Projects"
          size="lg"
          variant="primary"
          className="group gsap-hero-btn"
        >
          <span>View Projects</span>
          <ArrowDownRight className="w-4 h-4 transition-transform duration-150 ease-out group-hover:translate-x-1 group-hover:translate-y-1" />
        </Button>

        {onViewResume && (
          <Button
            onClick={onViewResume}
            aria-label="View Resume"
            size="lg"
            variant="secondary"
            className="group gsap-hero-btn"
          >
            <FileText className="w-4 h-4 transition-transform duration-150 ease-out group-hover:-translate-y-0.5" />
            <span>View Resume</span>
          </Button>
        )}

        <Button
          onClick={onContactClick}
          aria-label="Contact Me"
          size="lg"
          variant="outline"
          className="group gsap-hero-btn"
        >
          <span>Contact Me</span>
        </Button>
      </div>

      {/* Social Links Bar */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 mb-10 text-sm">
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/sachit1751-art"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="gsap-hero-social w-9 h-9 flex items-center justify-center rounded-md border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-heading)] hover:border-[var(--c-border-hover)] hover:bg-[var(--c-surface-hover)] transition-all"
          >
            <GitHubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/sachit-undefined-975503440"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="gsap-hero-social w-9 h-9 flex items-center justify-center rounded-md border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-heading)] hover:border-[var(--c-border-hover)] hover:bg-[var(--c-surface-hover)] transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <button
            onClick={() => copyEmailToClipboard('sachit1751@gmail.com')}
            aria-label="Copy email address"
            title="Click to copy email address"
            className="gsap-hero-social w-9 h-9 flex items-center justify-center rounded-md border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-heading)] hover:border-[var(--c-border-hover)] hover:bg-[var(--c-surface-hover)] transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => copyEmailToClipboard('sachit1751@gmail.com')}
          className="font-mono text-xs text-[var(--c-body)] hover:text-[var(--c-heading)] transition-colors cursor-pointer pl-1"
        >
          sachit1751@gmail.com
        </button>
      </div>

      {/* Focus Area Cards — Standardized with Card primitive */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2" role="list" aria-label="Focus areas">
        <Card className="gsap-hero-card p-5 flex flex-col justify-between min-h-[140px]" role="listitem">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[var(--c-muted)]">
              Focus 01
            </span>
            <span className="font-mono text-xs text-[var(--c-muted)]">
              Web
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--c-heading)]">
              Web Development
            </h3>
            <p className="text-xs mt-1 text-[var(--c-body)]">
              React · TypeScript · Vite · APIs
            </p>
          </div>
        </Card>

        <Card className="gsap-hero-card p-5 flex flex-col justify-between min-h-[140px]" role="listitem">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[var(--c-muted)]">
              Focus 02
            </span>
            <span className="font-mono text-xs text-[var(--c-muted)]">
              AI
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--c-heading)]">
              AI & Automation
            </h3>
            <p className="text-xs mt-1 text-[var(--c-body)]">
              Claude API · MCP · Agent Workflows
            </p>
          </div>
        </Card>

        <Card className="gsap-hero-card p-5 flex flex-col justify-between min-h-[140px]" role="listitem">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[var(--c-muted)]">
              Focus 03
            </span>
            <span className="font-mono text-xs text-[var(--c-muted)]">
              Systems
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--c-heading)]">
              Full-Stack Architecture
            </h3>
            <p className="text-xs mt-1 text-[var(--c-body)]">
              Supabase · Python · UI Motion
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

