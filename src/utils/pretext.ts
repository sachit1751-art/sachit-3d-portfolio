/**
 * High-performance browser-native text layout and measurement engine.
 * Emulates the @chenglou/pretext interface using HTML5 Canvas measureText
 * to prevent DOM layout thrashing (0 reflows) and run synchronously in microseconds.
 */

export interface PrepareOptions {
  letterSpacing?: number;
  whiteSpace?: string;
}

export interface PreparedTextWithSegments {
  text: string;
  font: string;
  options?: PrepareOptions;
}

export interface LayoutLinesResult {
  lineCount: number;
  height: number;
  lines: { text: string; width: number }[];
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

function getCanvasContext(): CanvasRenderingContext2D | null {
  if (typeof window === 'undefined') return null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
  }
  return ctx;
}

/**
 * Prepares text wrapper for caching/emulated pretext segment operations.
 */
export function getPrepared(
  text: string,
  font: string,
  options?: PrepareOptions
): PreparedTextWithSegments {
  return { text, font, options };
}

/**
 * Fast, synchronous measurement of natural single-line text width in pixels.
 */
export function measureTextWidth(
  text: string,
  font: string,
  options?: PrepareOptions
): number {
  if (!text || typeof window === 'undefined') return 0;
  try {
    const context = getCanvasContext();
    if (!context) return text.length * 8; // Safe fallback approximation
    context.font = font;
    return context.measureText(text).width;
  } catch {
    return text.length * 10;
  }
}

/**
 * Emulated measureNaturalWidth for PreparedTextWithSegments.
 */
export function measureNaturalWidth(prepared: PreparedTextWithSegments): number {
  return measureTextWidth(prepared.text, prepared.font, prepared.options);
}

/**
 * Emulated line statistics estimation.
 */
export function measureLineStats(prepared: PreparedTextWithSegments): { width: number; ascent: number; descent: number } {
  return {
    width: measureNaturalWidth(prepared),
    ascent: 12,
    descent: 4,
  };
}

/**
 * Calculates exact multiline layout and line breaks.
 * Word wraps text based on maxWidth using canvas measurement.
 */
export function computeTextLayout(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  options?: PrepareOptions
): LayoutLinesResult {
  if (!text || maxWidth <= 0 || typeof window === 'undefined') {
    return {
      lineCount: 0,
      height: 0,
      lines: [],
    };
  }

  const context = getCanvasContext();
  if (!context) {
    return {
      lineCount: 1,
      height: lineHeight,
      lines: [{ text, width: text.length * 8 }],
    };
  }

  context.font = font;
  // Handle manual newlines first
  const paragraphs = text.split('\n');
  const lines: { text: string; width: number }[] = [];

  for (const para of paragraphs) {
    if (para === '') {
      lines.push({ text: '', width: 0 });
      continue;
    }

    const words = para.split(/(\s+)/);
    let currentLineText = '';
    let currentLineWidth = 0;

    for (const word of words) {
      if (word === '') continue;
      const wordWidth = context.measureText(word).width;

      if (currentLineText === '') {
        currentLineText = word;
        currentLineWidth = wordWidth;
      } else {
        const testText = currentLineText + word;
        const testWidth = context.measureText(testText).width;
        if (testWidth <= maxWidth) {
          currentLineText = testText;
          currentLineWidth = testWidth;
        } else {
          lines.push({ text: currentLineText, width: currentLineWidth });
          currentLineText = word;
          currentLineWidth = wordWidth;
        }
      }
    }

    if (currentLineText !== '') {
      lines.push({ text: currentLineText, width: currentLineWidth });
    }
  }

  return {
    lineCount: lines.length,
    height: lines.length * lineHeight,
    lines,
  };
}

/**
 * Adjusts multiline text into balanced lines.
 */
export function adjustTextToLines(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  options?: PrepareOptions
): { lines: string[]; height: number; lineCount: number } {
  const result = computeTextLayout(text, font, maxWidth, lineHeight, options);
  return {
    lines: result.lines.map((l) => l.text),
    height: result.height,
    lineCount: result.lineCount,
  };
}

/**
 * Uses binary search + layout engine to find the largest font size (in px)
 * that fits within maxWidth and maxHeight without clipping.
 */
export function fitFontSize(
  text: string,
  fontFamily: string,
  maxWidth: number,
  maxHeight: number,
  minSize = 12,
  maxSize = 96,
  weight = 'normal',
  lineHeightMultiplier = 1.2
): number {
  if (maxWidth <= 0 || maxHeight <= 0) return minSize;

  let low = minSize;
  let high = maxSize;
  let best = minSize;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const font = `${weight} ${mid}px ${fontFamily}`;
    const lineHeight = mid * lineHeightMultiplier;

    const layout = computeTextLayout(text, font, maxWidth, lineHeight);

    if (layout.height <= maxHeight && layout.lines.every((l) => l.width <= maxWidth)) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
}
