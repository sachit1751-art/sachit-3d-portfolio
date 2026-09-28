import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Mail, ExternalLink, X, Copy } from 'lucide-react';
import { isSoundMuted } from '../../utils/soundManager';

export interface ToastDetail {
  id?: string;
  type?: 'success' | 'info' | 'error';
  title: string;
  message?: string;
  email?: string;
  duration?: number;
}

export const PORTFOLIO_TOAST_EVENT = 'portfolio_toast_notification';

/**
 * Trigger a toast notification globally across the application.
 */
export function triggerToast(detail: ToastDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(PORTFOLIO_TOAST_EVENT, { detail }));
}

/**
 * Trigger a success toast specifically for copying the email or other positive actions.
 */
export function showSuccessToast(title: string, message?: string, email?: string) {
  triggerToast({
    type: 'success',
    title,
    message,
    email,
    duration: 3600,
  });
}

/**
 * Copies the specified email address to clipboard with multi-tier fallback
 * and immediately triggers the success notification toast.
 */
export async function copyEmailToClipboard(email: string = 'sachit1751@gmail.com'): Promise<boolean> {
  let success = false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(email);
      success = true;
    }
  } catch {
    success = false;
  }

  if (!success) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      success = document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      success = false;
    }
  }

  showSuccessToast(
    'Email Copied to Clipboard!',
    'Direct contact address is copied and ready to paste.',
    email
  );

  return success;
}

/**
 * Crisp physical sound effect for toast confirmation (respects mute state)
 */
function playToastChime() {
  if (isSoundMuted() || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle cheerful two-tone chime
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Global Toast Notification Container with Domain-Native Paper Aesthetic
 */
export const ToastNotification: React.FC = () => {
  const [toast, setToast] = useState<ToastDetail | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(0);

  const clearCurrentTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismissToast = useCallback(() => {
    clearCurrentTimer();
    setToast(null);
  }, [clearCurrentTimer]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastDetail>;
      if (!customEvent.detail) return;

      const newToast = customEvent.detail;
      setToast(newToast);
      playToastChime();

      clearCurrentTimer();
      const duration = newToast.duration || 3600;
      remainingTimeRef.current = duration;
      startTimeRef.current = Date.now();

      timerRef.current = window.setTimeout(() => {
        dismissToast();
      }, duration);
    };

    window.addEventListener(PORTFOLIO_TOAST_EVENT, handleToastEvent);
    return () => {
      window.removeEventListener(PORTFOLIO_TOAST_EVENT, handleToastEvent);
      clearCurrentTimer();
    };
  }, [clearCurrentTimer, dismissToast]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(500, (toast?.duration || 3600) - elapsed);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      dismissToast();
    }, remainingTimeRef.current);
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[160] max-w-[calc(100vw-32px)] sm:max-w-md pointer-events-none select-none"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="pointer-events-auto relative overflow-hidden rounded-[var(--radius-lg)] p-4 sm:p-4.5 shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: 'var(--c-card)',
              color: 'var(--c-heading)',
              border: '1.5px solid var(--c-border-focus)',
              boxShadow: '0 16px 36px -6px rgba(0, 0, 0, 0.28), 0 4px 12px -2px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Top Row: Icon + Title + Dismiss */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Status Icon Badge */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10b981',
                  }}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-mono text-xs sm:text-sm font-bold tracking-tight" style={{ color: 'var(--c-heading)' }}>
                      {toast.title}
                    </h4>
                    <span
                      className="px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-wider rounded font-bold"
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#059669',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      Copied
                    </span>
                  </div>

                  {toast.message && (
                    <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--c-body)' }}>
                      {toast.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={dismissToast}
                className="p-1 rounded-[var(--radius-sm)] transition-colors hover:opacity-100 opacity-60 cursor-pointer -mr-1 -mt-1"
                style={{ color: 'var(--c-heading)' }}
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Chip & Action Row */}
            {toast.email && (
              <div
                className="mt-3 pt-2.5 flex flex-wrap items-center justify-between gap-2"
                style={{ borderTop: '1px solid var(--c-border)' }}
              >
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] font-mono text-xs select-all"
                  style={{
                    backgroundColor: 'var(--c-input-bg)',
                    border: '1px solid var(--c-border)',
                    color: 'var(--c-heading)',
                  }}
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{toast.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      copyEmailToClipboard(toast.email);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono rounded-[var(--radius-sm)] cursor-pointer transition-colors hover:opacity-100 opacity-80"
                    style={{
                      border: '1px solid var(--c-border)',
                      backgroundColor: 'var(--c-input-bg)',
                      color: 'var(--c-heading)',
                    }}
                    title="Copy again"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>

                  <a
                    href={`mailto:${toast.email}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded-[var(--radius-sm)] font-medium cursor-pointer transition-all hover:brightness-105 active:scale-95"
                    style={{
                      backgroundColor: 'var(--c-btn-bg)',
                      color: 'var(--c-btn-text)',
                      border: '1px solid var(--c-border-focus)',
                    }}
                  >
                    <span>Send Mail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Progress Countdown Bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2.5px] overflow-hidden"
              style={{ backgroundColor: 'var(--c-border)' }}
            >
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: isPaused ? undefined : '0%' }}
                transition={{
                  duration: (toast.duration || 3600) / 1000,
                  ease: 'linear',
                }}
                className="h-full bg-emerald-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
