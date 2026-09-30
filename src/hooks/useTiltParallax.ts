import { useRef, useEffect, useCallback } from 'react';

interface TiltOptions {
  maxTilt?: number; // Maximum rotation in degrees (e.g. 10 - 12)
  perspective?: number; // Perspective distance in px (e.g. 800)
  scaleOnHover?: number; // Scale factor on hover (e.g. 1.03)
  glare?: boolean; // Whether to render dynamic paper sheen
  disabled?: boolean;
}

export function useTiltParallax<T extends HTMLElement = HTMLDivElement>(options: TiltOptions = {}) {
  const {
    maxTilt = 10,
    perspective = 800,
    scaleOnHover = 1.025,
    glare = true,
    disabled = false,
  } = options;

  const elementRef = useRef<T | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef({
    currentRotateX: 0,
    currentRotateY: 0,
    targetRotateX: 0,
    targetRotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    targetGlareOpacity: 0,
    isHovered: false,
    rafId: 0,
  });

  // RAF loop with smooth lerping
  const updateLoop = useCallback(() => {
    const s = stateRef.current;
    const el = elementRef.current;

    // Responsive lerp factor: snappier when actively tracking, smooth on return
    const lerpFactor = s.isHovered ? 0.18 : 0.1;
    s.currentRotateX += (s.targetRotateX - s.currentRotateX) * lerpFactor;
    s.currentRotateY += (s.targetRotateY - s.currentRotateY) * lerpFactor;
    s.glareOpacity += (s.targetGlareOpacity - s.glareOpacity) * lerpFactor;

    if (el) {
      const scale = s.isHovered ? scaleOnHover : 1;
      el.style.transform = `perspective(${perspective}px) rotateX(${s.currentRotateX.toFixed(2)}deg) rotateY(${s.currentRotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;

      // Dynamic physical desk shadow shifting opposite to tilt direction
      const shadowX = (-s.currentRotateY * 2.2).toFixed(1);
      const shadowY = (s.currentRotateX * 2.2 + (s.isHovered ? 16 : 4)).toFixed(1);
      const shadowBlur = s.isHovered ? '28px' : '10px';
      const shadowAlpha = s.isHovered ? '0.18' : '0.06';
      el.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur} rgba(24, 18, 12, ${shadowAlpha})`;
    }

    if (glareRef.current && glare) {
      glareRef.current.style.opacity = s.glareOpacity.toFixed(2);
      glareRef.current.style.background = `radial-gradient(circle 280px at ${s.glareX.toFixed(1)}% ${s.glareY.toFixed(1)}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0) 100%)`;
    }

    // Check if settled
    const isSettled =
      Math.abs(s.targetRotateX - s.currentRotateX) < 0.02 &&
      Math.abs(s.targetRotateY - s.currentRotateY) < 0.02 &&
      Math.abs(s.targetGlareOpacity - s.glareOpacity) < 0.02 &&
      !s.isHovered;

    if (!isSettled) {
      s.rafId = requestAnimationFrame(updateLoop);
    } else {
      s.rafId = 0;
      if (el) {
        el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        el.style.boxShadow = '';
      }
    }
  }, [perspective, scaleOnHover, glare]);

  const startLoop = useCallback(() => {
    if (!stateRef.current.rafId) {
      stateRef.current.rafId = requestAnimationFrame(updateLoop);
    }
  }, [updateLoop]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || disabled) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Ensure 3D rendering context
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform, box-shadow';

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = Math.max(0, Math.min(1, x / rect.width));
      const percentY = Math.max(0, Math.min(1, y / rect.height));

      // Calculate tilt angles (mouse to the right tilts card clockwise around Y)
      const rotateX = -((percentY - 0.5) * 2) * maxTilt;
      const rotateY = ((percentX - 0.5) * 2) * maxTilt;

      stateRef.current.isHovered = true;
      stateRef.current.targetRotateX = rotateX;
      stateRef.current.targetRotateY = rotateY;
      stateRef.current.glareX = percentX * 100;
      stateRef.current.glareY = percentY * 100;
      stateRef.current.targetGlareOpacity = 0.95;

      startLoop();
    };

    const handlePointerEnter = () => {
      stateRef.current.isHovered = true;
      startLoop();
    };

    const handlePointerLeave = () => {
      stateRef.current.isHovered = false;
      stateRef.current.targetRotateX = 0;
      stateRef.current.targetRotateY = 0;
      stateRef.current.targetGlareOpacity = 0;
      startLoop();
    };

    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);
    el.addEventListener('mousemove', handlePointerMove);

    // Mobile Gyroscope Parallax (DeviceOrientation)
    let gyroCleanup: (() => void) | null = null;
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice && typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      let isVisibleOnScreen = false;

      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleOnScreen = entry.isIntersecting;
        },
        { threshold: 0.1 }
      );
      observer.observe(el);

      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (!isVisibleOnScreen || stateRef.current.isHovered) return;

        const gamma = e.gamma || 0; // [-90, 90]
        const beta = e.beta || 0;   // [-180, 180]

        // Normalize relative to holding phone upright (beta ~45deg, gamma ~0deg)
        const normGamma = Math.max(-1, Math.min(1, gamma / 22));
        const normBeta = Math.max(-1, Math.min(1, (beta - 45) / 25));

        stateRef.current.targetRotateX = -normBeta * (maxTilt * 0.9);
        stateRef.current.targetRotateY = normGamma * (maxTilt * 0.9);
        stateRef.current.glareX = (normGamma + 1) * 50;
        stateRef.current.glareY = (normBeta + 1) * 50;
        stateRef.current.targetGlareOpacity = 0.55;

        startLoop();
      };

      window.addEventListener('deviceorientation', handleOrientation, { passive: true });

      gyroCleanup = () => {
        observer.disconnect();
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }

    return () => {
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      el.removeEventListener('mousemove', handlePointerMove);
      if (gyroCleanup) gyroCleanup();
      if (stateRef.current.rafId) {
        cancelAnimationFrame(stateRef.current.rafId);
      }
    };
  }, [maxTilt, disabled, startLoop]);

  return { elementRef, glareRef };
}
