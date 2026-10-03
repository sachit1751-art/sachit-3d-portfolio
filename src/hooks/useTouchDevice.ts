import { useState, useEffect } from 'react';

/**
 * useTouchDevice Hook
 * Reliably detects touch-enabled mobile/tablet devices across modern browsers.
 * Checks ontouchstart, navigator.maxTouchPoints, and (pointer: coarse) media query.
 */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const updateTouch = () => {
      const touchAvailable =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        mediaQuery.matches;
      setIsTouch(touchAvailable);
    };

    updateTouch();
    mediaQuery.addEventListener('change', updateTouch);
    return () => mediaQuery.removeEventListener('change', updateTouch);
  }, []);

  return isTouch;
}
