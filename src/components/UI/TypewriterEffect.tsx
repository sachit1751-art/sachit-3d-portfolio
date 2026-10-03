import React, { useState, useEffect, useRef, memo } from 'react';
import { usePerformance } from '../../hooks/usePerformance';
import { observeElement } from '../../utils/observer';

interface ScrollTypewriterProps {
  text: string;
  delay?: number;
  typingSpeed?: number;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  threshold?: number;
  rootMargin?: string;
  onComplete?: () => void;
}

/**
 * ScrollTypewriter - Smooth, progressive letter-by-letter typing reveal with no cursor and zero layout shift.
 */
export const ScrollTypewriter = memo(({
  text,
  delay = 0.05,
  typingSpeed = 24,
  className = '',
  as: Component = 'span',
  threshold = 0.05,
  rootMargin = '150px 0px 150px 0px',
  onComplete,
}: ScrollTypewriterProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [displayedLength, setDisplayedLength] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const { simplify } = usePerformance();

  useEffect(() => {
    if (simplify) {
      setDisplayedLength(text.length);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    // Check immediate visibility
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
      setHasStarted(true);
      return;
    }

    const scroller = document.getElementById('content-scroll-container');

    const unobserve = observeElement(
      el,
      (isIntersecting) => {
        if (isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { root: scroller, threshold, rootMargin },
      true
    );

    // Guaranteed fallback timer so text is never stuck hidden
    const safetyTimer = setTimeout(() => {
      setHasStarted(true);
    }, 450);

    return () => {
      if (unobserve) unobserve();
      clearTimeout(safetyTimer);
    };
  }, [simplify, text, threshold, rootMargin, hasStarted]);

  // Progressive typing stream
  useEffect(() => {
    if (!hasStarted || simplify) {
      if (simplify) setDisplayedLength(text.length);
      return;
    }

    let currentIndex = 0;
    let timerId: any = null;

    const startTyping = () => {
      const typeNext = () => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayedLength(currentIndex);
          timerId = setTimeout(typeNext, typingSpeed);
        } else {
          if (onComplete) onComplete();
        }
      };
      typeNext();
    };

    const delayTimer = setTimeout(startTyping, delay * 1000);

    return () => {
      clearTimeout(delayTimer);
      if (timerId) clearTimeout(timerId);
    };
  }, [hasStarted, text, delay, typingSpeed, simplify, onComplete]);

  return (
    <Component
      ref={containerRef as any}
      className={`inline ${className}`}
      aria-label={text}
    >
      {hasStarted ? text.slice(0, displayedLength) : ''}
    </Component>
  );
});

ScrollTypewriter.displayName = 'ScrollTypewriter';

export const TypewriterEffect = ({
  text,
  delay = 0,
  className = '',
  typingSpeed = 24,
}: {
  text: string;
  delay?: number;
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  hideCursorOnComplete?: boolean;
}) => {
  return (
    <ScrollTypewriter
      text={text}
      delay={delay}
      typingSpeed={typingSpeed}
      className={className}
    />
  );
};
