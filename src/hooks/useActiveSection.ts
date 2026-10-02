import { useState, useEffect, useRef } from 'react';

const ALL_SECTIONS = [
  'hero',
  'about',
  'philosophy',
  'projects',
  'skills',
  'currently-building',
  'github',
  'experience',
  'education',
  'strengths',
  'building-in-public',
  'contact',
];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('hero');
  const sectionRatios = useRef<Record<string, number>>({});

  useEffect(() => {
    const container = document.getElementById('content-scroll-container');
    if (!container) return;

    // Use passive IntersectionObserver - offloads visibility calculations from the main JS scroll thread
    // Completely eliminates synchronous layout reflows (getBoundingClientRect layout thrashing)
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        sectionRatios.current[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });

      if (container.scrollTop < 80) {
        setActiveSection('hero');
        return;
      }

      let bestSection = 'hero';
      let maxRatio = 0;

      // 40% threshold preference
      ALL_SECTIONS.forEach((id) => {
        if (id === 'hero') return;
        const ratio = sectionRatios.current[id] || 0;
        if (ratio >= 0.4 && ratio > maxRatio) {
          maxRatio = ratio;
          bestSection = id;
        }
      });

      if (!maxRatio) {
        ALL_SECTIONS.forEach((id) => {
          if (id === 'hero') return;
          const ratio = sectionRatios.current[id] || 0;
          if (ratio > maxRatio && ratio > 0.15) {
            maxRatio = ratio;
            bestSection = id;
          }
        });
      }

      if (maxRatio > 0.15) {
        setActiveSection((prev) => (prev !== bestSection ? bestSection : prev));
      } else if (container.scrollTop < 80) {
        setActiveSection('hero');
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: container,
      threshold: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 1.0],
      rootMargin: '-10% 0px -35% 0px',
    });

    ALL_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return activeSection;
}

