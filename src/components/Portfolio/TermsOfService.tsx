import React from 'react';
import { Scale, ArrowLeft, Code } from 'lucide-react';
import { motion } from 'motion/react';
import { PaperTheme } from '../../types';
import { SEOHead } from '../SEO/SEOHead';
import { useSwipeToDismiss } from '../../hooks/useSwipeToDismiss';

interface TermsOfServiceProps {
  theme?: PaperTheme;
  onBack?: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ theme = 'cotton', onBack }) => {
  const {
    bind: swipeBackBind,
    style: swipeBackStyle,
    isTouchDevice: isTouchTerms,
  } = useSwipeToDismiss({
    onDismiss: onBack || (() => {}),
    direction: 'down',
    threshold: 80,
    velocityThreshold: 0.45,
    enabled: Boolean(onBack),
    onlyTouch: true,
  });

  return (
    <motion.main
      data-theme={theme}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full min-h-screen py-8 sm:py-12 px-4 sm:px-8 transition-colors duration-300 bg-transparent font-body"
      style={{ color: 'var(--c-body)', ...swipeBackStyle }}
    >
      <SEOHead
        title="Terms of Service — Sachit"
        description="Terms of service and usage conditions for Sachit's developer portfolio website and interactive components."
        canonicalUrl="https://sachin-portfoli.vercel.app/terms"
      />

      <div
        id="physical-paper-sheet"
        className="relative z-10 max-w-4xl mx-auto p-6 sm:p-10 rounded-[var(--radius-lg)] shadow-sm transition-all border"
        style={{
          backgroundColor: 'var(--c-card)',
          borderColor: 'var(--c-border)',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06)',
        }}
      >
        {/* Mobile Touch Swipe-to-Dismiss Grab Bar */}
        {onBack && isTouchTerms && (
          <div
            {...swipeBackBind()}
            className="sm:hidden flex flex-col items-center pt-0 pb-3 cursor-grab active:cursor-grabbing select-none touch-none"
            aria-label="Swipe down to return to portfolio"
          >
            <div className="w-10 h-1 rounded-full bg-[var(--c-border-hover)] opacity-70 transition-transform active:scale-95" />
            <span className="text-[9px] font-mono tracking-widest uppercase opacity-40 mt-1">
              swipe down to return
            </span>
          </div>
        )}

        <div className="mb-8 pb-6 border-b" style={{ borderColor: 'var(--c-border)' }}>
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-[var(--radius-sm)] transition-all cursor-pointer hover:border-[var(--c-border-focus)] active:scale-95"
              style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)', color: 'var(--c-heading)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Portfolio</span>
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-6 h-6" style={{ color: 'var(--c-heading)' }} />
            <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
              LEGAL & USAGE
            </span>
          </div>
          <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--c-heading)' }}>
            Terms of Service
          </h1>
          <p className="font-mono text-xs opacity-70">
            Last Updated: September 27, 2026 • Usage & Licensing Conditions
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section className="p-6 rounded-[var(--radius-lg)] space-y-3" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>
            <div className="flex items-center gap-2 font-sans text-lg font-bold" style={{ color: 'var(--c-heading)' }}>
              <Code className="w-5 h-5" />
              <h2>1. Intellectual Property & Code Rights</h2>
            </div>
            <p>
              The bespoke interface designs, 3D procedural paper physics, custom animations, visual shaders, and proprietary code architecture powering this portfolio are the copyrighted intellectual property of Sachit. Unless otherwise noted, open-source projects showcased here (such as SKY ROMs, MoneyPal, Audify, and the AI MCP Tool) are licensed under their respective open-source repositories (typically MIT or Apache-2.0).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              2. Permitted Use & Acceptable Conduct
            </h2>
            <p>
              Visitors are granted a personal, revocable, non-exclusive license to browse, interact with, review code demos, and test functionality on this website. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 font-mono text-xs">
              <li>Launch automated denial-of-service (DoS/DDoS) attacks or exploit server endpoints.</li>
              <li>Attempt unauthorized access to private server environments or bypass security headers.</li>
              <li>Claim uncredited authorship or duplicate the unique visual design without explicit written consent.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              3. Interactive AI Assistant & Live Demos Disclaimer
            </h2>
            <p>
              The interactive features (including the on-site AI Assistant, interactive console, and portfolio playground components) are provided strictly for educational and professional demonstration purposes on an "as-is" and "as-available" basis without warranties of any kind.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              4. External Links & Showcase Services
            </h2>
            <p>
              This website links to external third-party platforms such as GitHub, Vercel, Telegram, and project live demos. Sachit is not responsible for the content, privacy practices, or uptime of third-party domains.
            </p>
          </section>

          <section className="p-6 rounded-[var(--radius-lg)]" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>
            <h2 className="font-sans text-lg font-bold mb-2" style={{ color: 'var(--c-heading)' }}>
              5. Collaboration, Licensing & Contact
            </h2>
            <p className="text-xs leading-relaxed">
              For project collaborations, software engineering inquiries, contract work, or commercial licensing permissions, please contact Sachit directly at{' '}
              <a href="mailto:sachit1771@gmail.com" className="font-bold underline" style={{ color: 'var(--c-heading)' }}>
                sachit1771@gmail.com
              </a>{' '}
              or{' '}
              <a href="mailto:sachit1751@gmail.com" className="font-bold underline" style={{ color: 'var(--c-heading)' }}>
                sachit1751@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </motion.main>
  );
};
