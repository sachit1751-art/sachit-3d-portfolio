/**
 * Utility to monitor font loading status and update the DOM accordingly.
 * This helps prevent Layout Shifts (CLS) by allowing CSS to handle the 
 * visibility of text only when its intended font is ready, prioritizing 
 * critical subsetting and CSS Font Loading API checks.
 */
export const initFontLoader = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const doc = document as Document & { body: HTMLElement; fonts?: any };

  if (!doc.body) return;

  // Initial fallback state
  doc.body.setAttribute('data-fonts-loaded', 'false');

  if (!doc.fonts) {
    doc.body.setAttribute('data-fonts-loaded', 'true');
    return;
  }

  const criticalFonts = [
    { family: 'Kalam', weight: '400', sample: 'Sachit' },
    { family: 'Courier Prime', weight: '400', sample: '01' }
  ];

  // Use CSS Font Loading API to check and load critical fonts efficiently
  const loadCriticalFonts = async () => {
    try {
      // Check if already loaded via document.fonts.check
      const allLoaded = criticalFonts.every(font => 
        doc.fonts.check(`${font.weight} 1em "${font.family}"`, font.sample)
      );

      if (allLoaded && doc.body) {
        doc.body.setAttribute('data-fonts-loaded', 'true');
        return;
      }

      // Load fonts with fallback timeout
      const fontPromises = criticalFonts.map(font =>
        doc.fonts.load(`${font.weight} 1em "${font.family}"`, font.sample)
      );

      // Race against a safety timeout (e.g. 2500ms) to prevent blocking visual readiness
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2500));
      
      await Promise.race([
        Promise.all(fontPromises),
        timeoutPromise
      ]);

      if (doc.body) {
        doc.body.setAttribute('data-fonts-loaded', 'true');
      }
    } catch (err) {
      console.warn('Critical font loading fallback activated:', err);
      if (doc.body) {
        doc.body.setAttribute('data-fonts-loaded', 'true');
      }
    }
  };

  // Trigger loading check
  loadCriticalFonts();

  // Also hook into document.fonts.ready
  doc.fonts.ready.then(() => {
    if (doc.body) {
      doc.body.setAttribute('data-fonts-loaded', 'true');
    }
  }).catch(() => {});
};
