import React, { useEffect, useRef, memo } from 'react';
import { PaperTheme } from '../../types';
import { usePerformance } from '../../hooks/usePerformance';

interface ParchmentCanvasProps {
  theme?: PaperTheme;
  className?: string;
  opacity?: number;
}

interface ThemeParchmentConfig {
  baseRgb: [number, number, number];
  fiberRgb: [number, number, number];
  stainRgb: [number, number, number];
  highlightRgb: [number, number, number];
  vignetteOpacity: number;
  fiberDensity: number;
  contrast: number;
}

const THEME_CONFIGS: Record<string, ThemeParchmentConfig> = {
  kraft: {
    baseRgb: [236, 222, 194],
    fiberRgb: [130, 92, 54],
    stainRgb: [180, 140, 95],
    highlightRgb: [255, 248, 230],
    vignetteOpacity: 0.28,
    fiberDensity: 110,
    contrast: 0.12,
  },
  dark: {
    baseRgb: [24, 25, 28],
    fiberRgb: [60, 64, 72],
    stainRgb: [15, 16, 18],
    highlightRgb: [80, 85, 96],
    vignetteOpacity: 0.45,
    fiberDensity: 80,
    contrast: 0.16,
  },
  cool: {
    baseRgb: [232, 240, 248],
    fiberRgb: [100, 130, 160],
    stainRgb: [180, 205, 225],
    highlightRgb: [255, 255, 255],
    vignetteOpacity: 0.22,
    fiberDensity: 90,
    contrast: 0.1,
  },
  newsprint: {
    baseRgb: [238, 232, 220],
    fiberRgb: [110, 105, 95],
    stainRgb: [195, 185, 170],
    highlightRgb: [255, 250, 240],
    vignetteOpacity: 0.32,
    fiberDensity: 130,
    contrast: 0.14,
  },
  minimalist: {
    baseRgb: [248, 247, 244],
    fiberRgb: [170, 168, 160],
    stainRgb: [225, 222, 215],
    highlightRgb: [255, 255, 255],
    vignetteOpacity: 0.15,
    fiberDensity: 60,
    contrast: 0.08,
  },
  blueprint: {
    baseRgb: [20, 48, 86],
    fiberRgb: [70, 130, 190],
    stainRgb: [12, 32, 60],
    highlightRgb: [110, 180, 240],
    vignetteOpacity: 0.38,
    fiberDensity: 75,
    contrast: 0.15,
  },
};

/**
 * Procedural Animated Parchment Canvas
 * Generates organic paper pulp, cellulose fibers, tactile specks, aged tea-stains,
 * and an animated ambient physical lighting relief that reacts to time and mouse motion.
 */
export const ParchmentCanvas = memo<ParchmentCanvasProps>(({
  theme = 'kraft',
  className = '',
  opacity = 0.85,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { simplify } = usePerformance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Track mouse position smoothly
    let mouseX = 0.5;
    let mouseY = 0.3;
    let targetMouseX = 0.5;
    let targetMouseY = 0.3;

    const config = THEME_CONFIGS[theme] || THEME_CONFIGS.kraft;

    // Offscreen canvas to bake procedural fibers and grain once (avoids CPU cost per frame)
    const textureCanvas = document.createElement('canvas');
    const textureCtx = textureCanvas.getContext('2d');

    // Pseudo-random deterministic generator for consistent tactile grain
    let seed = 42;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const bakeParchmentTexture = (w: number, h: number) => {
      if (!textureCtx) return;
      textureCanvas.width = w;
      textureCanvas.height = h;
      textureCtx.clearRect(0, 0, w, h);

      const [fR, fG, fB] = config.fiberRgb;
      const [sR, sG, sB] = config.stainRgb;

      // 1. Draw organic cellulose pulp fibers (curved filaments)
      const fiberCount = Math.floor(((w * h) / 18000) * (config.fiberDensity / 100));
      for (let i = 0; i < fiberCount; i++) {
        const startX = random() * w;
        const startY = random() * h;
        const len = 6 + random() * 26;
        const angle = random() * Math.PI * 2;
        const curve = (random() - 0.5) * 18;

        const endX = startX + Math.cos(angle) * len;
        const endY = startY + Math.sin(angle) * len;
        const ctrlX = (startX + endX) / 2 + Math.cos(angle + Math.PI / 2) * curve;
        const ctrlY = (startY + endY) / 2 + Math.sin(angle + Math.PI / 2) * curve;

        textureCtx.beginPath();
        textureCtx.moveTo(startX, startY);
        textureCtx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
        textureCtx.strokeStyle = `rgba(${fR}, ${fG}, ${fB}, ${(0.04 + random() * 0.12).toFixed(3)})`;
        textureCtx.lineWidth = 0.4 + random() * 0.8;
        textureCtx.stroke();
      }

      // 2. Draw tactile specks & paper pulp flakes
      const speckCount = Math.floor((w * h) / 7000);
      for (let i = 0; i < speckCount; i++) {
        const x = random() * w;
        const y = random() * h;
        const size = 0.5 + random() * 1.6;
        const isDark = random() > 0.4;
        const alpha = isDark ? 0.03 + random() * 0.08 : 0.05 + random() * 0.12;

        textureCtx.beginPath();
        textureCtx.arc(x, y, size, 0, Math.PI * 2);
        textureCtx.fillStyle = isDark
          ? `rgba(${fR}, ${fG}, ${fB}, ${alpha.toFixed(3)})`
          : `rgba(${config.highlightRgb.join(',')}, ${alpha.toFixed(3)})`;
        textureCtx.fill();
      }

      // 3. Draw subtle vellum tea-stains & aged clouding
      const stainCount = 5 + Math.floor(random() * 4);
      for (let i = 0; i < stainCount; i++) {
        const sx = random() * w;
        const sy = random() * h;
        const radius = 90 + random() * 240;
        const stainGrad = textureCtx.createRadialGradient(sx, sy, 0, sx, sy, radius);
        stainGrad.addColorStop(0, `rgba(${sR}, ${sG}, ${sB}, ${(0.02 + random() * 0.04).toFixed(3)})`);
        stainGrad.addColorStop(0.6, `rgba(${sR}, ${sG}, ${sB}, ${(0.01 + random() * 0.02).toFixed(3)})`);
        stainGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        textureCtx.fillStyle = stainGrad;
        textureCtx.beginPath();
        textureCtx.arc(sx, sy, radius, 0, Math.PI * 2);
        textureCtx.fill();
      }
    };

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      seed = 42;
      bakeParchmentTexture(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Subtle mouse tracking for realistic physical light angle
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Render loop
    let startTime = performance.now();

    const render = (now: number) => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (now - startTime) * 0.001;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw base procedural baked texture
      ctx.drawImage(textureCanvas, 0, 0, width, height);

      // 2. Animated physical light highlight (drifting ambient sunlight)
      if (!simplify) {
        // Subtle organic breathing oscillation
        const waveX = Math.sin(elapsed * 0.4) * 0.08 + mouseX * 0.2;
        const waveY = Math.cos(elapsed * 0.3) * 0.08 + mouseY * 0.2;

        const lightX = width * (0.4 + waveX);
        const lightY = height * (0.3 + waveY);
        const lightRadius = Math.max(width, height) * 0.85;

        const lightGrad = ctx.createRadialGradient(
          lightX,
          lightY,
          lightRadius * 0.05,
          lightX,
          lightY,
          lightRadius
        );

        const [hR, hG, hB] = config.highlightRgb;
        const pulse = 0.02 + Math.sin(elapsed * 0.6) * 0.008;

        lightGrad.addColorStop(0, `rgba(${hR}, ${hG}, ${hB}, ${(0.05 + pulse).toFixed(3)})`);
        lightGrad.addColorStop(0.5, `rgba(${hR}, ${hG}, ${hB}, ${(0.015 + pulse * 0.5).toFixed(3)})`);
        lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, width, height);

        // 3. Gentle physical depth edge vignette
        const [bR, bG, bB] = config.baseRgb;
        const vignetteGrad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.45,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.85
        );
        vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignetteGrad.addColorStop(
          1,
          `rgba(${Math.max(0, bR - 50)}, ${Math.max(0, bG - 50)}, ${Math.max(0, bB - 50)}, ${(
            config.vignetteOpacity * 0.6
          ).toFixed(3)})`
        );

        ctx.fillStyle = vignetteGrad;
        ctx.fillRect(0, 0, width, height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [theme, simplify]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        opacity,
        mixBlendMode: 'multiply',
      }}
    />
  );
});

ParchmentCanvas.displayName = 'ParchmentCanvas';
