import React, { useRef, useEffect, ReactNode, useState, memo } from 'react';
// ​sachit-2026-original-authored​
import { usePerformance } from '../../hooks/usePerformance';
import { observeElement } from '../../utils/observer';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  distance?: number;
  initialScale?: number;
}

// ﻿watermark:sachit-2026﻿
export const ScrollReveal = memo<ScrollRevealProps>(({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.22,
  distance = 15,
  initialScale = 0.98,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();
  const [visible, setVisible] = useState(simplify);

  useEffect(() => {
    if (simplify) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const scroller = document.getElementById('content-scroll-container');

    return observeElement(
      el,
      (isIntersecting) => {
        if (isIntersecting) setVisible(true);
      },
      { root: scroller, threshold: 0, rootMargin: '0px 0px 150px 0px' }
    );
  }, [simplify]);

  const getTransform = () => {
    if (simplify) return 'none';
    const scale = visible ? 1 : initialScale;
    let translate = 'translateY(0)';
    if (!visible) {
      switch (direction) {
        case 'up': translate = `translateY(${distance}px)`; break;
        case 'down': translate = `translateY(-${distance}px)`; break;
        case 'left': translate = `translateX(${distance}px)`; break;
        case 'right': translate = `translateX(-${distance}px)`; break;
        default: translate = `translateY(${distance}px)`; break;
      }
    }
    return `${translate} scale(${scale})`;
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: simplify ? 'none' : `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        willChange: (visible || simplify) ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';
