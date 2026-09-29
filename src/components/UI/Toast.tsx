import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckIcon } from 'lucide-react';
import { isSoundMuted } from '../../utils/soundManager';

export interface ToastDetail {
  id?: string;
  type?: 'success' | 'info' | 'error';
  title?: string;
  message?: string;
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
 * Trigger a minimal success toast specifically for copying actions.
 */
export function showSuccessToast(title: string = 'Copied') {
  triggerToast({
    type: 'success',
    title,
    duration: 1800,
  });
}

/**
 * Copies the specified email address to clipboard with multi-tier fallback
 * and immediately triggers the simple "Copied" toast.
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

  showSuccessToast('Copied');
  return success;
}

/**
 * Subtle audio tick for confirmation (respects mute state)
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
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Clean, lightweight "Copied" toast notification
 */
export const ToastNotification: React.FC = () => {
  const [toast, setToast] = useState<ToastDetail | null>(null);
  const timerRef = useRef<number | null>(null);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastDetail>;
      if (!customEvent.detail) return;

      const newToast = customEvent.detail;
      setToast(newToast);
      playToastChime();

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        dismissToast();
      }, newToast.duration || 1800);
    };

    window.addEventListener(PORTFOLIO_TOAST_EVENT, handleToastEvent);
    return () => {
      window.removeEventListener(PORTFOLIO_TOAST_EVENT, handleToastEvent);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [dismissToast]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[160] pointer-events-none select-none"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-md)] shadow-lg backdrop-blur-md font-mono text-xs font-medium"
            style={{
              backgroundColor: 'var(--c-card)',
              color: 'var(--c-heading)',
              border: '1px solid var(--c-border-focus)',
              boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.22)',
            }}
          >
            <CheckIcon size={14} className="text-emerald-500" />
            <span className="tracking-tight">{toast.title || 'Copied'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
