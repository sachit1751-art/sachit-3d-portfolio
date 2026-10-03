import React, { memo } from 'react';

/**
 * PaperCrumpleOverlay
 * Renders physical, organic crumple shadows, crease ridges, and tactile depth across the paper sheet
 * matching the realistic tactile unfolded paper aesthetic.
 */
export const PaperCrumpleOverlay = memo(() => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" 
      aria-hidden="true"
    >
      {/* Dynamic SVG Filter for Organic Creases and Surface Topography */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="paper-crumple-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.008 0.015" 
              numOctaves="4" 
              seed="42" 
              result="noise" 
            />
            <feDiffuseLighting 
              in="noise" 
              lightingColor="#ffffff" 
              surfaceScale="2.8" 
              diffuseConstant="1.2" 
              result="light"
            >
              <feDistantLight azimuth="125" elevation="40" />
            </feDiffuseLighting>
            <feBlend mode="multiply" in="SourceGraphic" in2="light" />
          </filter>

          <linearGradient id="crease-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.08)" />
            <stop offset="45%" stopColor="rgba(0,0,0,0.01)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="55%" stopColor="rgba(0,0,0,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.09)" />
          </linearGradient>

          <linearGradient id="crease-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.06)" />
            <stop offset="48%" stopColor="rgba(0,0,0,0.01)" />
            <stop offset="52%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.07)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layer 1: Pronounced Organic Crease Ridges & Valleys */}
      <div 
        className="absolute inset-0 opacity-75 mix-blend-multiply"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 20% 15%, rgba(0,0,0,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 80% 50% at 85% 35%, rgba(0,0,0,0.09) 0%, transparent 65%),
            radial-gradient(ellipse 95% 70% at 15% 65%, rgba(0,0,0,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 85% 55% at 80% 85%, rgba(0,0,0,0.07) 0%, transparent 65%),
            linear-gradient(135deg, transparent 46%, rgba(0,0,0,0.08) 49%, rgba(255,255,255,0.22) 50%, rgba(0,0,0,0.06) 53%, transparent 56%),
            linear-gradient(220deg, transparent 38%, rgba(0,0,0,0.07) 41%, rgba(255,255,255,0.18) 42%, rgba(0,0,0,0.05) 44%, transparent 48%),
            linear-gradient(75deg, transparent 60%, rgba(0,0,0,0.06) 63%, rgba(255,255,255,0.15) 64%, rgba(0,0,0,0.05) 66%, transparent 70%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 850px, 100% 1100px, 100% 950px',
        }}
      />

      {/* Layer 2: Tactile Physical Specular Highlight Ridges */}
      <div 
        className="absolute inset-0 opacity-60 mix-blend-overlay"
        style={{
          backgroundImage: `
            linear-gradient(125deg, transparent 48%, rgba(255,255,255,0.35) 50%, transparent 52%),
            linear-gradient(215deg, transparent 40%, rgba(255,255,255,0.28) 42%, transparent 44%),
            radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)
          `,
          backgroundSize: '100% 900px, 100% 1200px, 100% 100%',
        }}
      />
    </div>
  );
});

PaperCrumpleOverlay.displayName = 'PaperCrumpleOverlay';
