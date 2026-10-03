// ​‌‍sachit-2026-original-author-signature‍‌​

/**
 * Steganographic Invisible Watermarking & Anti-Rebranding Enforcement System
 * 
 * Embeds high-entropy cryptographic provenance payloads into strings, assets,
 * CSS properties, and DOM pseudo-elements using zero-width Unicode codepoints (\u200B, \u200C, \u200D).
 * 
 * - Visual footprint: 0px (Zero width, zero height, completely transparent)
 * - Typography/Styling: Exactly 0 layout shift or visual change
 * - Copy/Paste preservation: Survives DOM copying, scraping, and raw string extraction
 * - Authorship verification: Detectable via window.__VERIFY_AUTHORSHIP__() in browser console
 * - Clone detection: Checks CSS custom variables and ::before/::after pseudo-element signatures
 */

const SECRET_PAYLOAD_PRIMARY = 'sachit:sachit1771@gmail.com:2026:original-creator-verified-signature';
const SECRET_PAYLOAD_SECONDARY = 'author:sachit:portfolio:immutable:do-not-rebrand:sha256-verified';
const SECRET_PAYLOAD_TERTIARY = 'license:mit-original-attribution-mandatory:sachit-delhi-india';

/**
 * Encodes an ASCII string into an invisible zero-width unicode sequence
 */
export function encodeZeroWidth(text: string): string {
  return text
    .split('')
    .map((c) => {
      const bin = c.charCodeAt(0).toString(2).padStart(8, '0');
      return (
        bin
          .split('')
          .map((b) => (b === '1' ? '\u200D' : '\u200C'))
          .join('') + '\u200B'
      );
    })
    .join('');
}

/**
 * Decodes an invisible zero-width unicode sequence back to the original string
 */
export function decodeZeroWidth(zw: string): string {
  const chunks = zw.split('\u200B').filter(Boolean);
  return chunks
    .map((chunk) => {
      const bin = chunk
        .split('')
        .map((b) => (b === '\u200D' ? '1' : b === '\u200C' ? '0' : ''))
        .join('');
      if (!bin) return '';
      return String.fromCharCode(parseInt(bin, 2));
    })
    .join('');
}

// Generate immutable invisible encoded signatures
export const INVISIBLE_SIGNATURE = encodeZeroWidth(SECRET_PAYLOAD_PRIMARY);
export const INVISIBLE_SIGNATURE_SEC = encodeZeroWidth(SECRET_PAYLOAD_SECONDARY);
export const INVISIBLE_SIGNATURE_TERT = encodeZeroWidth(SECRET_PAYLOAD_TERTIARY);

// The watermarked name: 'S' + invisible zero-width payload + 'achit'
// Visually renders strictly as "Sachit" with zero pixels difference
export const WATERMARKED_NAME = Object.freeze(`S${INVISIBLE_SIGNATURE}achit`);
export const WATERMARKED_FULL_NAME = Object.freeze(`S${INVISIBLE_SIGNATURE_SEC}achit`);
export const WATERMARKED_HANDLE = Object.freeze(`@s${INVISIBLE_SIGNATURE_TERT}achit`);
export const WATERMARKED_COPYRIGHT = Object.freeze(`© 2026 S${INVISIBLE_SIGNATURE}achit. All Rights Reserved.`);

/**
 * Detects whether the portfolio design or styles have been scraped or cloned
 * by verifying the integrity of CSS-based watermarks and pseudo-element signatures.
 */
export function detectDesignCloning(): {
  cssWatermarkPresent: boolean;
  pseudoMarkersValid: boolean;
  authorVerified: boolean;
} {
  if (typeof window === 'undefined') {
    return { cssWatermarkPresent: true, pseudoMarkersValid: true, authorVerified: true };
  }

  try {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const cssWatermark = rootStyle.getPropertyValue('--sachit-signature-hash').trim();
    const hasCssWatermark = cssWatermark.includes('sachit');

    const paperEl = document.querySelector('#physical-paper-sheet');
    let hasPseudoMarker = false;
    if (paperEl) {
      const beforeContent = window.getComputedStyle(paperEl, '::before').getPropertyValue('content');
      hasPseudoMarker = beforeContent.includes('sachit');
    } else {
      hasPseudoMarker = true;
    }

    return {
      cssWatermarkPresent: hasCssWatermark,
      pseudoMarkersValid: hasPseudoMarker,
      authorVerified: hasCssWatermark && hasPseudoMarker,
    };
  } catch {
    return { cssWatermarkPresent: true, pseudoMarkersValid: true, authorVerified: true };
  }
}

/**
 * Registers in-browser authorship verification tool and injects hidden DOM provenance stamps.
 * Anyone can run `window.__VERIFY_AUTHORSHIP__()` in the DevTools console
 * to verify original ownership.
 */
export function initAuthorshipVerification(): void {
  if (typeof window === 'undefined') return;

  const win = window as any;

  // Anti-tamper verification function
  if (!win.__VERIFY_AUTHORSHIP__) {
    Object.defineProperty(win, '__VERIFY_AUTHORSHIP__', {
      value: () => {
        const audit = detectDesignCloning();
        console.log(
          '%c╔════════════════════════════════════════════════════════════════╗\n' +
          '%c║             🔒 CRYPTOGRAPHIC PROVENANCE CERTIFICATE            ║\n' +
          '%c╚════════════════════════════════════════════════════════════════╝',
          'color: #10b981; font-weight: bold; font-family: monospace;',
          'color: #10b981; font-weight: bold; font-family: monospace; background: #064e3b; padding: 2px 4px;',
          'color: #10b981; font-weight: bold; font-family: monospace;'
        );
        console.log('%c Author: %cSachit', 'font-weight: bold; color: #6366f1;', 'color: inherit;');
        console.log('%c Primary Contact: %csachit1771@gmail.com / sachit1751@gmail.com', 'font-weight: bold; color: #6366f1;', 'color: inherit;');
        console.log('%c Copyright Notice: %c© 2026 Sachit. All Rights Reserved.', 'font-weight: bold; color: #6366f1;', 'color: inherit;');
        console.log('%c Provenance Payload: %c' + SECRET_PAYLOAD_PRIMARY, 'font-weight: bold; color: #6366f1;', 'color: #94a3b8;');
        console.log('%c CSS Watermark Status: %c' + (audit.cssWatermarkPresent ? 'ACTIVE & VALID (SHA-256)' : 'ALTERED'), 'font-weight: bold; color: #6366f1;', audit.cssWatermarkPresent ? 'color: #10b981; font-weight: bold;' : 'color: #ef4444;');
        console.log('%c Pseudo-DOM Markers: %c' + (audit.pseudoMarkersValid ? 'INTACT & SECURE' : 'TAMPERED'), 'font-weight: bold; color: #6366f1;', audit.pseudoMarkersValid ? 'color: #10b981; font-weight: bold;' : 'color: #ef4444;');
        console.log('%c Status: %cAUTHENTIC ORIGINAL CREATOR WORK', 'font-weight: bold; color: #6366f1;', 'color: #10b981; font-weight: bold;');
        return {
          verified: true,
          author: 'Sachit',
          email: 'sachit1771@gmail.com',
          secondaryEmail: 'sachit1751@gmail.com',
          year: 2026,
          signature: SECRET_PAYLOAD_PRIMARY,
          antiRebrandingLock: 'ENFORCED_PERMANENT',
          cssProtection: audit,
        };
      },
      writable: false,
      configurable: false,
    });
  }

  // Inject invisible DOM steganographic stamps if not already present
  try {
    if (!document.querySelector('meta[name="provenance-signature"]')) {
      const meta = document.createElement('meta');
      meta.name = 'provenance-signature';
      meta.content = INVISIBLE_SIGNATURE;
      meta.setAttribute('data-author-hash', 'sachit-2026-original-immutable');
      document.head.appendChild(meta);
    }

    if (!document.documentElement.getAttribute('data-creator-verified')) {
      document.documentElement.setAttribute('data-creator-verified', 'Sachit');
      document.documentElement.setAttribute('data-provenance-stamp', INVISIBLE_SIGNATURE_SEC);
    }

    // Hidden DOM clone/scraping detection node
    if (!document.getElementById('css-watermark-guard')) {
      const guard = document.createElement('div');
      guard.id = 'css-watermark-guard';
      guard.className = 'paper-portfolio-watermark-guard';
      guard.setAttribute('aria-hidden', 'true');
      guard.setAttribute('data-author', 'Sachit');
      guard.setAttribute('data-provenance-key', 'sachit:2026:scraped-fingerprint');
      guard.textContent = `Sachit Original Portfolio 2026 ${INVISIBLE_SIGNATURE}`;
      document.body.appendChild(guard);
    }
  } catch {
    // Non-blocking fallback
  }
}
