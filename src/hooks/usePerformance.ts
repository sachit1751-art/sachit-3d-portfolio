import { useState, useEffect } from 'react';
// sachit-portfolio-2026-watermark

// sachit-2026-original
export function usePerformance() {
  const [isLowPower, setIsLowPower] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [simplify, setSimplify] = useState(() => {
    try {
      return localStorage.getItem('portfolio_simplify_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // Flag low-spec/throttled mobile devices (<= 4 cores or <= 4GB memory) or small screen
    const isLowSpec = 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4) ||
      window.innerWidth < 768;
    
    // Check connection speed
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowNetwork = Boolean(conn && (conn.saveData || /2g/.test(conn.effectiveType)));
    
    const lowPowerDetected = isLowSpec || isSlowNetwork;
    setIsLowPower(lowPowerDetected);

    // Auto-simplify on low-power devices if user hasn't explicitly configured
    if (lowPowerDetected && localStorage.getItem('portfolio_simplify_mode') === null) {
      setSimplify(true);
    }

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const toggleSimplify = () => {
    setSimplify(prev => {
      const next = !prev;
      try {
        localStorage.setItem('portfolio_simplify_mode', String(next));
      } catch {}
      return next;
    });
  };

  return {
    reducedMotion,
    isLowPower,
    simplify,
    toggleSimplify
  };
}
