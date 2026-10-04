import React from 'react';
import { Shield, ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { PaperTheme } from '../../types';
import { SEOHead } from '../SEO/SEOHead';
import { useSwipeToDismiss } from '../../hooks/useSwipeToDismiss';

interface PrivacyPolicyProps {
  theme?: PaperTheme;
  onBack?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ theme = 'cotton', onBack }) => {
  const {
    bind: swipeBackBind,
    style: swipeBackStyle,
    isTouchDevice: isTouchPrivacy,
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
        title="Privacy Policy — Sachit"
        description="Privacy policy and data transparency statement for Sachit's developer portfolio. Learn how local storage and privacy-respecting analytics are handled."
        canonicalUrl="https://sachin-portfoli.vercel.app/privacy"
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
        {onBack && isTouchPrivacy && (
          <div
            {...swipeBackBind()}
            className="sm:hidden flex flex-col items-center pt-0 pb-3 cursor-grab active:cursor-grabbing select-none touch-none"
            role="region"
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
            <Shield className="w-6 h-6" style={{ color: 'var(--c-heading)' }} />
            <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
              LEGAL & TRANSPARENCY
            </span>
          </div>
          <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--c-heading)' }}>
            Privacy Policy
          </h1>
          <p className="font-mono text-xs opacity-70">
            Last Updated: September 27, 2026 • Privacy-First & Zero-Tracking Infrastructure
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section className="p-6 rounded-[var(--radius-lg)] space-y-3" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>
            <div className="flex items-center gap-2 font-sans text-lg font-bold" style={{ color: 'var(--c-heading)' }}>
              <Lock className="w-5 h-5 text-emerald-600" />
              <h2>1. Zero-PII & Privacy-By-Design Commitment</h2>
            </div>
            <p>
              Your privacy is fundamental. This developer portfolio operates on a strict privacy-first architecture. We do not sell, rent, monetize, or track your identity across the web. There are no invasive third-party ad trackers, fingerprinting scripts, or cross-site marketing pixels deployed anywhere on this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              2. Client-Side Local Storage & Session Data
            </h2>
            <p>
              This website uses standard browser <code className="px-1.5 py-0.5 rounded font-mono text-xs" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>localStorage</code> and <code className="px-1.5 py-0.5 rounded font-mono text-xs" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>sessionStorage</code> strictly for client-side user experience enhancements:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 font-mono text-xs">
              <li><strong>Theme Palette:</strong> Stores your selected theme (Kraft, Cotton, Blueprint, or Slate).</li>
              <li><strong>Audio & FX Preferences:</strong> Saves paper sound effect volume and animation toggles.</li>
              <li><strong>Interactive State:</strong> Preserves easter egg progress and modal dismiss states during your active visit.</li>
            </ul>
            <p className="text-xs opacity-80">
              No private data stored in your browser's local storage is ever transmitted to external servers or advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              3. Direct Contact & Communication
            </h2>
            <p>
              When you contact Sachit via the on-site direct dispatch form or email (<code className="font-mono text-xs px-1">sachit1771@gmail.com</code> / <code className="font-mono text-xs px-1">sachit1751@gmail.com</code>), the information you provide (name, email address, message body) is used solely to reply to your inquiry. Your contact information is never shared with third parties or added to marketing newsletters.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              4. Server Logging & Privacy-Respecting Telemetry
            </h2>
            <p>
              Standard, ephemeral server request logs (e.g. status codes, requested URL path) may be generated for reliability, DDoS defense, and routing integrity. Any performance telemetry collected is anonymized, aggregated, and strictly non-identifiable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              5. AI Crawlers & Provenance Directives
            </h2>
            <p>
              This site provides structured, machine-readable developer indices via <code className="font-mono text-xs px-1">/llms.txt</code> and respects standard crawler directives in <code className="font-mono text-xs px-1">/robots.txt</code>. All content, projects, and codebase artifacts remain the verifiable, copyrighted work of Sachit.
            </p>
          </section>

          <section className="p-6 rounded-[var(--radius-lg)]" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>
            <h2 className="font-sans text-lg font-bold mb-2" style={{ color: 'var(--c-heading)' }}>
              6. Data Rights & Inquiries
            </h2>
            <p className="text-xs leading-relaxed">
              If you have any questions regarding this Privacy Policy, your rights, or wish to request the deletion of any communications, please contact Sachit directly at{' '}
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
