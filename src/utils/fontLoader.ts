/**
 * Utility to monitor font and critical asset loading status (preloader).
 * Prioritizes loading of critical fonts (Kalam, Courier Prime), mascot sprite sheets
 * (cap-directions.webp, cap-reactions.webp), and project thumbnails.
 * 
 * Prevents Cumulative Layout Shift (CLS) and animation stutter during the initial
 * reveal animation by warming the browser's cache and decoding raster bitmaps off-thread.
 */

// In-memory cache for preloaded HTMLImageElement instances to retain decoded memory
const preloadedImageCache = new Map<string, HTMLImageElement>();

/**
 * List of critical mascot sprite sheets that must be preloaded & decoded
 * before or during the initial reveal animation.
 */
export const CRITICAL_MASCOT_ASSETS = [
  '/mascots/cap-directions.webp',
  '/mascots/cap-reactions.webp',
] as const;

/**
 * List of critical image thumbnails and UI assets.
 */
export const CRITICAL_THUMBNAILS = [
  '/favicon.png',
  '/apple-touch-icon.png',
] as const;

let isMascotLoadedFlag = false;
let areCriticalImagesLoadedFlag = false;

/**
 * Checks whether the mascot sprite sheet has been decoded and ready for display.
 */
export const isMascotPreloaded = (): boolean => isMascotLoadedFlag;

/**
 * Checks whether all critical image assets have completed loading.
 */
export const areCriticalAssetsLoaded = (): boolean => areCriticalImagesLoadedFlag;

/**
 * Dynamically injects an HTML <link rel="preload" as="image"> tag into document <head>
 * if it does not already exist.
 */
const injectPreloadLink = (href: string, priority: 'high' | 'auto' = 'auto') => {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = href;
  if (href.endsWith('.webp')) {
    link.type = 'image/webp';
  } else if (href.endsWith('.png')) {
    link.type = 'image/png';
  }
  if (priority === 'high') {
    link.setAttribute('fetchpriority', 'high');
  }
  document.head.appendChild(link);
};

/**
 * Preloads a single image and decodes it using HTMLImageElement.decode()
 * off the main UI thread to prevent layout shifts and jank during reveal animations.
 */
export const preloadImage = (src: string, priority: 'high' | 'auto' = 'auto'): Promise<HTMLImageElement> => {
  if (typeof window === 'undefined') {
    return Promise.resolve({} as HTMLImageElement);
  }

  if (preloadedImageCache.has(src)) {
    return Promise.resolve(preloadedImageCache.get(src)!);
  }

  // Inject link preload tag to inform browser network scheduler
  injectPreloadLink(src, priority);

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    if (priority === 'high') {
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'high';
    }
    img.decoding = 'async';

    const onDone = () => {
      preloadedImageCache.set(src, img);
      resolve(img);
    };

    if (img.decode) {
      img
        .decode()
        .then(() => onDone())
        .catch(() => {
          // If decode fails (e.g. format test or unsupported), resolve gracefully
          onDone();
        });
    } else {
      img.onload = () => onDone();
      img.onerror = () => onDone();
    }
  });
};

/**
 * Preloads mascot sprite sheets (cap-directions.webp) and project thumbnails
 * with priority scheduling. Updates DOM attributes to coordinate layout readiness.
 */
export const preloadMascotAndThumbnails = async (additionalThumbnails: string[] = []): Promise<void> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const doc = document as Document & { body: HTMLElement };

  try {
    // 1. Prioritize cap-directions.webp with highest priority
    const mascotDirectionPromise = preloadImage(CRITICAL_MASCOT_ASSETS[0], 'high').then((img) => {
      isMascotLoadedFlag = true;
      if (doc.body) {
        doc.body.setAttribute('data-mascot-preloaded', 'true');
      }
      return img;
    });

    // 2. Load reaction sprites and project thumbnails in parallel
    const otherAssets = [
      CRITICAL_MASCOT_ASSETS[1],
      ...CRITICAL_THUMBNAILS,
      ...additionalThumbnails,
    ];

    const secondaryPromises = otherAssets.map((url) => preloadImage(url, 'auto'));

    // 3. Race against a safety timeout so slow connections never stall reveal animation
    const safetyTimeout = new Promise((resolve) => setTimeout(resolve, 2000));

    await Promise.race([
      Promise.all([mascotDirectionPromise, ...secondaryPromises]),
      safetyTimeout,
    ]);

    areCriticalImagesLoadedFlag = true;

    if (doc.body) {
      doc.body.setAttribute('data-images-loaded', 'true');
    }
  } catch (err) {
    console.warn('[Preloader] Mascot and thumbnail preloading warning:', err);
    if (doc.body) {
      doc.body.setAttribute('data-images-loaded', 'true');
    }
  }
};

/**
 * Awaitable helper for components waiting on critical assets before starting
 * reveal animations.
 */
export const waitForCriticalPreload = (timeoutMs = 1500): Promise<boolean> => {
  if (isMascotLoadedFlag && areCriticalImagesLoadedFlag) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    }, timeoutMs);

    preloadMascotAndThumbnails().then(() => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve(true);
      }
    });
  });
};

/**
 * Initializes the unified preloader:
 * 1. Checks and loads critical fonts (Kalam, Courier Prime) to prevent FOIT/FOUT.
 * 2. Preloads and decodes mascot images (`cap-directions.webp`, `cap-reactions.webp`)
 *    and thumbnails to eliminate layout shifts (CLS) during initial reveal.
 * 3. Updates DOM data attributes (data-fonts-loaded, data-mascot-preloaded, data-preloader-ready).
 */
export const initFontLoader = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const doc = document as Document & { body: HTMLElement; fonts?: any };

  if (!doc.body) return;

  // Initial fallback states
  doc.body.setAttribute('data-fonts-loaded', 'false');
  doc.body.setAttribute('data-mascot-preloaded', 'false');
  doc.body.setAttribute('data-preloader-ready', 'false');

  // Immediately initiate prioritized mascot and thumbnail preloading
  const imagesPromise = preloadMascotAndThumbnails();

  const criticalFonts = [
    { family: 'Kalam', weight: '400', sample: 'Sachit' },
    { family: 'Courier Prime', weight: '400', sample: '01' },
  ];

  // Use CSS Font Loading API to check and load critical fonts efficiently
  const loadCriticalFonts = async (): Promise<void> => {
    if (!doc.fonts) {
      if (doc.body) {
        doc.body.setAttribute('data-fonts-loaded', 'true');
      }
      return;
    }

    try {
      // Check if already loaded via document.fonts.check
      const allLoaded = criticalFonts.every((font) =>
        doc.fonts.check(`${font.weight} 1em "${font.family}"`, font.sample)
      );

      if (allLoaded && doc.body) {
        doc.body.setAttribute('data-fonts-loaded', 'true');
        return;
      }

      // Load fonts with fallback timeout
      const fontPromises = criticalFonts.map((font) =>
        doc.fonts.load(`${font.weight} 1em "${font.family}"`, font.sample)
      );

      // Race against a safety timeout (2500ms)
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500));

      await Promise.race([Promise.all(fontPromises), timeoutPromise]);

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

  // Run font loading check
  const fontsPromise = loadCriticalFonts();

  // Coordinate completion of both fonts and preloaded critical images
  Promise.allSettled([fontsPromise, imagesPromise]).then(() => {
    if (doc.body) {
      doc.body.setAttribute('data-preloader-ready', 'true');
    }
    window.dispatchEvent(new CustomEvent('preloader-ready', {
      detail: {
        fontsLoaded: doc.body.getAttribute('data-fonts-loaded') === 'true',
        mascotPreloaded: isMascotLoadedFlag,
      },
    }));
  });

  // Also hook into document.fonts.ready for broader font coverage
  if (doc.fonts && doc.fonts.ready) {
    doc.fonts.ready
      .then(() => {
        if (doc.body) {
          doc.body.setAttribute('data-fonts-loaded', 'true');
        }
      })
      .catch(() => {});
  }
};

/**
 * Alias for initFontLoader representing the unified preloader functionality.
 */
export const initPreloader = initFontLoader;
