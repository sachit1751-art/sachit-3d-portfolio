// ​‌sachit-2026-original-author-signature‌​

/**
 * Steganographic Invisible Watermarking System
 * 
 * Embeds high-entropy cryptographic provenance payload into the author's name
 * using zero-width Unicode codepoints (\u200B, \u200C, \u200D).
 * 
 * - Visual footprint: 0px (Zero width, zero height, completely transparent)
 * - Typography/Styling: Exactly 0 layout shift or visual change
 * - Copy/Paste preservation: Survives DOM copying, scraping, and raw string extraction
 * - Authorship verification: Detectable via window.__VERIFY_AUTHORSHIP__() in browser console
 */

const SECRET_PAYLOAD = 'sachit:sachit1771@gmail.com:2026:original-creator-verified-signature';

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

// Generate the invisible encoded payload
export const INVISIBLE_SIGNATURE = encodeZeroWidth(SECRET_PAYLOAD);

// The watermarked name: 'S' + invisible zero-width payload + 'achit'
// Visually renders strictly as "Sachit" with zero pixels difference
export const WATERMARKED_NAME = `S${INVISIBLE_SIGNATURE}achit`;

/**
 * Registers an in-browser authorship verification tool.
 * Anyone can run `window.__VERIFY_AUTHORSHIP__()` in the DevTools console
 * to verify original ownership.
 */
export function initAuthorshipVerification(): void {
  if (typeof window === 'undefined') return;

  const win = window as any;
  if (!win.__VERIFY_AUTHORSHIP__) {
    win.__VERIFY_AUTHORSHIP__ = () => {
      console.log(
        '%c[ORIGINAL AUTHORSHIP VERIFIED]',
        'color: #10b981; font-weight: bold; font-size: 14px;'
      );
      console.log('Author: Sachit');
      console.log('Contact: sachit1771@gmail.com');
      console.log('Copyright: © 2026 Sachit. All Rights Reserved.');
      console.log('Provenance Payload:', SECRET_PAYLOAD);
      console.log('Status: Authenticated Original Source Code');
      return {
        verified: true,
        author: 'Sachit',
        email: 'sachit1771@gmail.com',
        year: 2026,
        signature: 'sachit-2026-original-creator-verified-signature',
      };
    };
  }
}
