import { useRef, useState, useEffect, memo } from 'react';
import { usePerformance } from '../../hooks/usePerformance';
import { observeElement } from '../../utils/observer';

export interface TypewriterEffectProps {
  text: string;
  delay?: number;
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  hideCursorOnComplete?: boolean;
  font?: string;
  showCursor?: boolean;
}

export const TypewriterEffect = memo(({ 
  text, 
  delay = 0, 
  className = '',
  cursorClassName = '',
  typingSpeed = 26,
  hideCursorOnComplete = true,
  showCursor = true,
}: TypewriterEffectProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [typedIndex, setTypedIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { simplify } = usePerformance();

  useEffect(() => {
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

    const startTyping = () => {
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
              return;
            }

            const prevChar = text[currentIndex - 1];
            let nextInterval = typingSpeed;

            // Realistic micro-pauses on punctuation marks
            if (prevChar === ',' || prevChar === ';') {
              nextInterval = typingSpeed + 68;
            } else if (prevChar === ':' || prevChar === '-' || prevChar === '—') {
              nextInterval = typingSpeed + 62;
            } else if (prevChar === '.' || prevChar === '!' || prevChar === '?') {
              nextInterval = typingSpeed + 124;
            } else if (prevChar === ' ') {
              nextInterval = typingSpeed + 6;
            } else {
              const jitter = ((currentIndex % 3) - 1) * 3;
              nextInterval = Math.max(12, typingSpeed + jitter);
            }

            streamTimer = setTimeout(streamNextChar, nextInterval);
          }
        };

        streamNextChar();
      };

      if (delay > 0) {
        initialDelayTimer = setTimeout(runStreaming, delay * 1000);
      } else {
        runStreaming();
      }
    };

    const scroller = document.getElementById('content-scroll-container');

    const checkBoundingBoxInView = () => {
      if (!el.isConnected) return false;
      const rect = el.getBoundingClientRect();
      const sRect = scroller
        ? scroller.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
      return rect.top <= sRect.bottom + 80 && rect.bottom >= sRect.top - 80;
    };

    if (checkBoundingBoxInView()) {
      startTyping();
    } else {
      const unobserve = observeElement(
        el,
        (isIntersecting) => {
          if (isIntersecting) {
            startTyping();
          }
        },
        {
          root: scroller || null,
          threshold: 0.01,
          rootMargin: '100px 0px 100px 0px',
        },
        true
      );

      const onScrollCheck = () => {
        if (!hasTriggered && checkBoundingBoxInView()) {
          startTyping();
        }
      };
      scroller?.addEventListener('scroll', onScrollCheck, { passive: true });
      window.addEventListener('scroll', onScrollCheck, { passive: true });

      const safetyFallbackTimer = setTimeout(() => {
        if (!hasTriggered && isMounted && el.isConnected) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.6) {
            startTyping();
          }
        }
      }, 1600);

      const absoluteSafetyTimer = setTimeout(() => {
        if (!hasTriggered && isMounted) {
          startTyping();
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
  }, [text, delay, typingSpeed, simplify]);

  const typedText = text.slice(0, typedIndex);
  const untypedText = text.slice(typedIndex);

  if (simplify || isComplete) {
    return (
      <span ref={ref} className={`typewriter-stream inline ${className}`}>
        {text}
      </span>
    );
  }

  const renderCursor = showCursor && isTyping && (!hideCursorOnComplete || !isComplete);

  return (
    <span
      ref={ref}
      className={`typewriter-stream inline ${className}`}
      aria-label={text}
    >
      <span className="typewriter-typed inline" aria-hidden="true">
        {typedText}
      </span>

      {renderCursor && (
        <span
          className={`typewriter-caret inline-block font-mono font-normal select-none pointer-events-none opacity-85 ${cursorClassName}`}
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

TypewriterEffect.displayName = 'TypewriterEffect';
