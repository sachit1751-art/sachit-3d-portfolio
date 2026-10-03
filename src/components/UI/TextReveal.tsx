import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { usePerformance } from '../../hooks/usePerformance';
import { observeElement } from '../../utils/observer';

export interface TypewriterProps {
  text: string;
  baseDelay?: number;
  speed?: number; // Base streaming interval (~26ms per char)
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

/**
 * Scroll-Activated Typewriter Hook with:
 * - Immediate bounding box viewport detection (for Hero, top sections, hash navigation)
 * - Main scroll container IntersectionObserver (#content-scroll-container)
 * - Natural humanized typing cadence (~26ms per character + realistic micro-pauses on punctuation)
 * - Pulsing caret that cleanly unmounts upon completion (zero floating cursors left behind)
 * - Zero Layout Shift (CLS-proof): native inline text flow with invisible text layout spacer
 * - Safety fallback ensuring bottom & lazy-loaded sections (Contact, cards, footer) NEVER get stuck
 */
export function useScrollTypewriter({
  text,
  baseDelay = 0,
  speed = 26,
  onComplete,
}: {
  text: string;
  baseDelay?: number;
  speed?: number;
  onComplete?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [typedIndex, setTypedIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const { simplify } = usePerformance();

  useEffect(() => {
    // Immediate full render if simplified mode or reduced-motion is requested
    if (
      simplify ||
      (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
    ) {
      setTypedIndex(text.length);
      setIsComplete(true);
      setIsTyping(false);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let isMounted = true;
    let hasTriggered = false;
    let streamTimer: NodeJS.Timeout | null = null;
    let initialDelayTimer: NodeJS.Timeout | null = null;

    const startTypingSequence = () => {
      if (hasTriggered || !isMounted) return;
      hasTriggered = true;

      const runStreaming = () => {
        if (!isMounted) return;
        setIsTyping(true);
        let currentIndex = 0;

        const streamNextChar = () => {
          if (!isMounted) return;
          if (currentIndex < text.length) {
            currentIndex++;
            setTypedIndex(currentIndex);

            if (currentIndex >= text.length) {
              setIsTyping(false);
              setIsComplete(true);
              onComplete?.();
              return;
            }

            const prevChar = text[currentIndex - 1];
            let nextInterval = speed; // Default ~26ms

            // Humanized micro-pauses on punctuation marks
            if (prevChar === ',' || prevChar === ';') {
              nextInterval = speed + 68; // ~94ms pause on commas & semicolons
            } else if (prevChar === ':' || prevChar === '-' || prevChar === '—') {
              nextInterval = speed + 62; // ~88ms pause on colons & em-dashes
            } else if (prevChar === '.' || prevChar === '!' || prevChar === '?') {
              nextInterval = speed + 124; // ~150ms natural sentence cadence
            } else if (prevChar === ' ') {
              nextInterval = speed + 6; // subtle word-boundary breath
            } else {
              // Natural micro-jitter (+/- 3ms)
              const jitter = ((currentIndex % 3) - 1) * 3;
              nextInterval = Math.max(12, speed + jitter);
            }

            streamTimer = setTimeout(streamNextChar, nextInterval);
          }
        };

        streamNextChar();
      };

      if (baseDelay > 0) {
        initialDelayTimer = setTimeout(runStreaming, baseDelay * 1000);
      } else {
        runStreaming();
      }
    };

    const scroller = document.getElementById('content-scroll-container');

    // 1. Immediate Bounding Box Detection:
    // If the element is already in the active viewport (e.g. Hero on page load, active anchor link),
    // trigger typing immediately without waiting for scroll events.
    const checkBoundingBoxInView = () => {
      if (!el.isConnected) return false;
      const rect = el.getBoundingClientRect();
      const sRect = scroller
        ? scroller.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
      return rect.top <= sRect.bottom + 80 && rect.bottom >= sRect.top - 80;
    };

    if (checkBoundingBoxInView()) {
      startTypingSequence();
    } else {
      // 2. IntersectionObserver tied to the main scroll container
      const unobserve = observeElement(
        el,
        (isIntersecting) => {
          if (isIntersecting) {
            startTypingSequence();
          }
        },
        {
          root: scroller || null,
          threshold: 0.01,
          rootMargin: '100px 0px 100px 0px',
        },
        true // One-shot trigger
      );

      // 3. Fallback on scroll events (covers rapid wheel scrolls or smooth-scroll jumps)
      const onScrollCheck = () => {
        if (!hasTriggered && checkBoundingBoxInView()) {
          startTypingSequence();
        }
      };
      scroller?.addEventListener('scroll', onScrollCheck, { passive: true });
      window.addEventListener('scroll', onScrollCheck, { passive: true });

      // 4. Stuck Text Prevention & Safety Fallback:
      // Guarantees that lazy-loaded or bottom sections (Contact, cards, footer) are NEVER stuck
      const safetyFallbackTimer = setTimeout(() => {
        if (!hasTriggered && isMounted && el.isConnected) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.6) {
            startTypingSequence();
          }
        }
      }, 1600);

      // Absolute safety ceiling (3.5s max)
      const absoluteSafetyTimer = setTimeout(() => {
        if (!hasTriggered && isMounted) {
          startTypingSequence();
        }
      }, 3500);

      return () => {
        isMounted = false;
        if (initialDelayTimer) clearTimeout(initialDelayTimer);
        if (streamTimer) clearTimeout(streamTimer);
        if (safetyFallbackTimer) clearTimeout(safetyFallbackTimer);
        if (absoluteSafetyTimer) clearTimeout(absoluteSafetyTimer);
        if (unobserve) unobserve();
        scroller?.removeEventListener('scroll', onScrollCheck);
        window.removeEventListener('scroll', onScrollCheck);
      };
    }

    return () => {
      isMounted = false;
      if (initialDelayTimer) clearTimeout(initialDelayTimer);
      if (streamTimer) clearTimeout(streamTimer);
    };
  }, [text, baseDelay, speed, simplify, onComplete]);

  const typedText = text.slice(0, typedIndex);
  const untypedText = text.slice(typedIndex);

  return {
    ref,
    typedText,
    untypedText,
    isTyping,
    isComplete,
    simplify,
  };
}

/**
 * WordReveal:
 * High-precision, zero-CLS scroll-activated typewriter component.
 * Features:
 * - Native inline text flow (eliminating absolute overlay positioning)
 * - Invisible pre-measured text layout spacer (100% stable CLS-proof container)
 * - Pulsing terminal/pencil cursor (|) that cleanly disappears on completion
 * - No floating or blinking cursor left behind on titles, cards, or footer
 */
export const WordReveal = memo<TypewriterProps>(({
  text,
  baseDelay = 0,
  speed = 26,
  className = '',
  showCursor = true,
  onComplete,
}) => {
  const { ref, typedText, untypedText, isTyping, isComplete, simplify } = useScrollTypewriter({
    text,
    baseDelay,
    speed,
    onComplete,
  });

  // When animation finishes or performance is simplified:
  // Render clean, pristine native text with zero spacer or cursor markup
  if (simplify || isComplete) {
    return (
      <span ref={ref} className={`typewriter-stream inline ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={`typewriter-stream inline ${className}`}
      aria-label={text}
    >
      {/* 1. Visible typed characters in native inline flow */}
      <span className="typewriter-typed inline" aria-hidden="true">
        {typedText}
      </span>

      {/* 2. Pulsing typewriter caret - ONLY visible during active typing; cleanly removed on complete */}
      {showCursor && isTyping && !isComplete && (
        <span
          className="typewriter-caret inline-block font-mono font-normal select-none pointer-events-none opacity-85"
          aria-hidden="true"
          style={{
            marginLeft: '1px',
            marginRight: '1px',
            verticalAlign: 'baseline',
            color: 'var(--c-heading)',
          }}
        >
          |
        </span>
      )}

      {/* 3. Invisible pre-measured layout spacer in native inline flow (CLS-proof) */}
      {!isComplete && (
        <span
          className="typewriter-spacer select-none pointer-events-none"
          aria-hidden="true"
          style={{
            visibility: 'hidden',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {untypedText}
        </span>
      )}
    </span>
  );
});
WordReveal.displayName = 'WordReveal';

/**
 * CharReveal:
 * Alias for character-by-character typewriter streaming.
 */
export const CharReveal = memo<TypewriterProps>(({
  text,
  baseDelay = 0,
  speed = 26,
  className = '',
  showCursor = true,
  onComplete,
}) => {
  return (
    <WordReveal
      text={text}
      baseDelay={baseDelay}
      speed={speed}
      className={className}
      showCursor={showCursor}
      onComplete={onComplete}
    />
  );
});
CharReveal.displayName = 'CharReveal';

/**
 * TypewriterText:
 * Direct export for explicit typewriter usage.
 */
export const TypewriterText = WordReveal;

/**
 * LineReveal:
 * Smooth scroll-triggered line/container fade with bounding-box check & safety fallback.
 */
export const LineReveal = memo(({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { simplify } = usePerformance();

  useEffect(() => {
    if (simplify) {
      setIsVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const scroller = document.getElementById('content-scroll-container');
    const checkBoundingBox = () => {
      const rect = el.getBoundingClientRect();
      const sRect = scroller
        ? scroller.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
      return rect.top <= sRect.bottom + 80 && rect.bottom >= sRect.top - 80;
    };

    if (checkBoundingBox()) {
      setIsVisible(true);
      return;
    }

    const unobserve = observeElement(
      el,
      (isIntersecting) => {
        if (isIntersecting) {
          setIsVisible(true);
        }
      },
      { root: scroller || null, threshold: 0.01, rootMargin: '80px 0px 80px 0px' },
      true
    );

    const fallback = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => {
      clearTimeout(fallback);
      if (unobserve) unobserve();
    };
  }, [simplify]);

  return (
    <div
      ref={ref}
      className={`${isVisible ? 'animate-line-reveal' : 'opacity-0'} ${className}`}
      style={{ ...style, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
});
LineReveal.displayName = 'LineReveal';
