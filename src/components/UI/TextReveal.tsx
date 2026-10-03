import React, { useRef, useState, useEffect, memo, useMemo } from 'react';
import { usePerformance } from '../../hooks/usePerformance';
import { observeElement } from '../../utils/observer';

function useScrollTrigger(threshold = 0.05, rootMargin = '150px 0px 150px 0px') {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const { simplify } = usePerformance();

  useEffect(() => {
    if (simplify) {
      setVisible(true);
      return;
    }
    
    const el = ref.current;
    if (!el) return;

    // Immediate viewport check
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
      setVisible(true);
      return;
    }

    const scroller = document.getElementById('content-scroll-container');
    
    const unobserve = observeElement(
      el, 
      (isIntersecting) => {
        if (isIntersecting) {
          setVisible(true);
        }
      },
      { root: scroller, threshold, rootMargin },
      true
    );

    // Fallback safety timeout so text is never permanently stuck
    const safetyTimer = setTimeout(() => {
      setVisible(true);
    }, 450);

    return () => {
      if (unobserve) unobserve();
      clearTimeout(safetyTimer);
    };
  }, [simplify, threshold, rootMargin]);

  return { ref, visible, simplify };
}

/**
 * CharReveal - Smooth, progressive letter-by-letter typing reveal with ZERO layout shift.
 * All characters maintain their natural layout position.
 */
export const CharReveal = memo(({ 
  text, 
  baseDelay = 0, 
  className = '' 
}: { 
  text: string; 
  baseDelay?: number; 
  className?: string; 
}) => {
  const { ref, visible, simplify } = useScrollTrigger();
  const words = useMemo(() => text.split(' '), [text]);

  if (simplify) {
    return <span className={className}>{text}</span>;
  }

  let charIndex = 0;

  return (
    <span ref={ref} className={`inline ${className}`} aria-label={text}>
      {words.map((word, wordIdx) => {
        const chars = word.split('');
        return (
          <React.Fragment key={wordIdx}>
            <span className="inline-block whitespace-nowrap">
              {chars.map((char, charInWordIdx) => {
                const delay = baseDelay + charIndex++ * 0.022;
                return (
                  <span
                    key={charInWordIdx}
                    className="inline-block transition-all duration-200 ease-out"
                    style={
                      visible
                        ? {
                            opacity: 1,
                            transform: 'translateY(0)',
                            transitionDelay: `${delay}s`,
                          }
                        : {
                            opacity: 0,
                            transform: 'translateY(4px)',
                          }
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {wordIdx < words.length - 1 && <span>&nbsp;</span>}
          </React.Fragment>
        );
      })}
    </span>
  );
});
CharReveal.displayName = 'CharReveal';

/**
 * WordReveal - Smooth typing/word reveal that starts cleanly on scroll with zero text shift.
 */
export const WordReveal = memo(({ 
  text, 
  baseDelay = 0, 
  className = '' 
}: { 
  text: string; 
  baseDelay?: number; 
  className?: string; 
}) => {
  const { ref, visible, simplify } = useScrollTrigger();
  const words = useMemo(() => text.split(' '), [text]);

  if (simplify) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={`inline ${className}`} aria-label={text}>
      {words.map((word, i) => {
        const delay = baseDelay + i * 0.032;
        return (
          <React.Fragment key={i}>
            <span
              className="inline-block transition-all duration-250 ease-out"
              style={
                visible
                  ? {
                      opacity: 1,
                      transform: 'translateY(0)',
                      transitionDelay: `${delay}s`,
                    }
                  : {
                      opacity: 0,
                      transform: 'translateY(5px)',
                    }
              }
            >
              {word}
            </span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </React.Fragment>
        );
      })}
    </span>
  );
});
WordReveal.displayName = 'WordReveal';

export const LineReveal = memo(({ 
  children, 
  delay = 0, 
  className = '', 
  style 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
  style?: React.CSSProperties; 
}) => {
  return (
    <div
      className={`animate-line-reveal ${className}`}
      style={{ ...style, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
});
LineReveal.displayName = 'LineReveal';
