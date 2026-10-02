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
  stagger = 0.08,
  duration = 0.6,
  yOffset = 35,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();

  useEffect(() => {
    if (simplify) {
      if (containerRef.current) {
        gsap.set(containerRef.current, { opacity: 1, y: 0 });
      }
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    // Target elements within the section for staggered entrance
    const items = el.querySelectorAll('h2, h3, h4, p, article, li, div.card, div.rounded-xl, button, .stagger-item');
    const targets = items.length > 0 ? items : el;

    gsap.set(targets, { opacity: 0, y: yOffset });

    const scroller = document.getElementById('content-scroll-container');
    let hasAnimated = false;

    return observeElement(
      el,
      (isIntersecting) => {
        if (isIntersecting && !hasAnimated) {
          hasAnimated = true;
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      },
      { root: scroller, threshold: 0.05, rootMargin: '0px 0px 120px 0px' }
    );
  }, [simplify, stagger, duration, yOffset]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';
