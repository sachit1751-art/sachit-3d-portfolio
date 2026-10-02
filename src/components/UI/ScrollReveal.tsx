import React, { useRef, useEffect, ReactNode, memo } from 'react';
// ​sachit-2026-original-authored​
import gsap from 'gsap';
import { usePerformance } from '../../hooks/usePerformance';
import { observeElement } from '../../utils/observer';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  duration?: number;
  yOffset?: number;
}

// ﻿watermark:sachit-2026﻿
export const ScrollReveal = memo<ScrollRevealProps>(({
  children,
  className = '',
  stagger = 0.05,
  duration = 0.45,
  yOffset = 18,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (simplify) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const scroller = document.getElementById('content-scroll-container');
    let hasAnimated = false;

    const reveal = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: duration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    // Initially position container lightly
    gsap.set(el, { opacity: 0.85, y: yOffset });

    // Safety fallback: ensure section becomes fully visible quickly
    const fallbackTimer = setTimeout(() => {
      reveal();
    }, 150);

    const unobserve = observeElement(
      el,
      (isIntersecting) => {
        if (isIntersecting) {
          reveal();
        }
      },
      { root: scroller, threshold: 0.01, rootMargin: '300px 0px 300px 0px' }
    );

    return () => {
      clearTimeout(fallbackTimer);
      if (unobserve) unobserve();
    };
  }, [simplify, duration, yOffset]);

  return (
    <div
      ref={containerRef}
      className={className}
    >
      {children}
    </div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';
