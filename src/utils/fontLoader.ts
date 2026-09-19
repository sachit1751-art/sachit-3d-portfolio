/**
 * Utility to monitor font loading status and update the DOM accordingly.
 * This helps prevent Layout Shifts (CLS) by allowing CSS to handle the 
 * visibility of text only when its intended font is ready.
 */
export const initFontLoader = () => {
  if (typeof window === 'undefined') return;

  document.body.setAttribute('data-fonts-loaded', 'true');

  if (!document.fonts) return;

  const fontsToTrack = [
    { family: 'Kalam', weight: '400' },
    { family: 'Courier Prime', weight: '400' }
  ];

  const fontPromises = fontsToTrack.map(font => 
    document.fonts.load(`${font.weight} 1em "${font.family}"`)
  );

  Promise.all(fontPromises).catch((err) => {
    console.warn('Font loading non-blocking fallback:', err);
  });
};
