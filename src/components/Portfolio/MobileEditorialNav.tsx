import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { PaperTheme } from '../../types';
import { useSound } from '../../utils/soundManager';

interface MobileEditorialNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onNavigateSection: (id: string, isResume?: boolean) => void;
  onViewResume?: () => void;
  onRecrumple: () => void;
  onOpenSiteMap?: () => void;
}

const NAV_ITEMS = [
  { id: 'projects', label: 'WORK', subtitle: 'Selected Projects & Intelligent Systems' },
  { id: 'about', label: 'ABOUT', subtitle: 'Background, Core Values & Engineering' },
  { id: 'skills', label: 'SKILLS', subtitle: 'Full-Stack, AI Models & Architecture' },
  { id: 'building-in-public', label: 'JOURNAL', subtitle: 'Engineering Logs & Process Insights' },
  { id: 'contact', label: 'CONTACT', subtitle: 'Direct Transmission & Inquiry' },
  { id: 'resume', label: 'RESUME', subtitle: 'Curriculum Vitae & Career Experience', isResume: true },
];

const THEMES: { id: PaperTheme; label: string; color: string }[] = [
  { id: 'cotton', label: 'Cotton', color: '#fbf9f4' },
  { id: 'kraft', label: 'Kraft', color: '#d6bfa2' },
  { id: 'blueprint', label: 'Blueprint', color: '#1a334d' },
  { id: 'slate', label: 'Slate', color: '#232428' },
];

// Pre-computed geometric network nodes
const NODES_R1 = [
  { x: 360, y: 300 },
  { x: 330, y: 352 },
  { x: 270, y: 352 },
  { x: 240, y: 300 },
  { x: 270, y: 248 },
  { x: 330, y: 248 },
];

const NODES_R2 = [
  { x: 440, y: 300 },
  { x: 421, y: 370 },
  { x: 370, y: 421 },
  { x: 300, y: 440 },
  { x: 230, y: 421 },
  { x: 179, y: 370 },
  { x: 160, y: 300 },
  { x: 179, y: 230 },
  { x: 230, y: 179 },
  { x: 300, y: 160 },
  { x: 370, y: 179 },
  { x: 421, y: 230 },
];

const NODES_R3 = [
  { x: 512, y: 357 },
  { x: 456, y: 456 },
  { x: 357, y: 512 },
  { x: 243, y: 512 },
  { x: 144, y: 456 },
  { x: 88, y: 357 },
  { x: 88, y: 243 },
  { x: 144, y: 144 },
  { x: 243, y: 88 },
  { x: 357, y: 88 },
  { x: 456, y: 144 },
  { x: 512, y: 243 },
];

const NODES_R4 = [
  { x: 575, y: 300 },
  { x: 494, y: 494 },
  { x: 300, y: 575 },
  { x: 106, y: 494 },
  { x: 25, y: 300 },
  { x: 106, y: 106 },
  { x: 300, y: 25 },
  { x: 494, y: 106 },
];

const GeometricDataNetwork = memo(() => (
  <div
    className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0"
    aria-hidden="true"
  >
    <motion.svg
      viewBox="0 0 600 600"
      className="w-[150vw] max-w-[720px] aspect-square select-none opacity-10"
      style={{ color: 'var(--c-dot, #e05a47)' }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 90,
        ease: 'linear',
      }}
    >
      {/* Concentric Guide Orbits */}
      <circle cx="300" cy="300" r="60" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="300" cy="300" r="140" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
      <circle cx="300" cy="300" r="220" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 4" />
      <circle cx="300" cy="300" r="275" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6 6" />

      {/* Axis Crosshairs */}
      <line x1="300" y1="10" x2="300" y2="590" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 6" />
      <line x1="10" y1="300" x2="590" y2="300" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 6" />
      <line x1="95" y1="95" x2="505" y2="505" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 5" />
      <line x1="95" y1="505" x2="505" y2="95" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 5" />

      {/* Primary Hexagon Ring 1 */}
      <polygon
        points={NODES_R1.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Dodecagon Ring 2 */}
      <polygon
        points={NODES_R2.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
      />

      {/* Geodesic Triangulation Chords (Connecting R1 and R2) */}
      {NODES_R1.map((p1, i) => {
        const p2a = NODES_R2[(i * 2) % NODES_R2.length];
        const p2b = NODES_R2[(i * 2 + 1) % NODES_R2.length];
        const p2c = NODES_R2[(i * 2 + 2) % NODES_R2.length];
        return (
          <g key={`chord-r1-r2-${i}`}>
            <line x1={p1.x} y1={p1.y} x2={p2a.x} y2={p2a.y} stroke="currentColor" strokeWidth="0.7" />
            <line x1={p1.x} y1={p1.y} x2={p2b.x} y2={p2b.y} stroke="currentColor" strokeWidth="0.7" />
            <line x1={p1.x} y1={p1.y} x2={p2c.x} y2={p2c.y} stroke="currentColor" strokeWidth="0.7" />
          </g>
        );
      })}

      {/* Triangulation Outer Struts (Connecting R2 and R3) */}
      {NODES_R2.map((p2, i) => {
        const p3 = NODES_R3[i % NODES_R3.length];
        const p3Next = NODES_R3[(i + 1) % NODES_R3.length];
        return (
          <g key={`chord-r2-r3-${i}`}>
            <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="currentColor" strokeWidth="0.6" />
            <line x1={p2.x} y1={p2.y} x2={p3Next.x} y2={p3Next.y} stroke="currentColor" strokeWidth="0.5" />
          </g>
        );
      })}

      {/* Satellite Links to Outer Bounds (R4) */}
      {NODES_R4.map((p4, i) => {
        const p3 = NODES_R3[(i * 1) % NODES_R3.length];
        return (
          <line
            key={`chord-r4-${i}`}
            x1={p4.x}
            y1={p4.y}
            x2={p3.x}
            y2={p3.y}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
        );
      })}

      {/* Center Origin Node */}
      <circle cx="300" cy="300" r="4" fill="currentColor" />
      <circle cx="300" cy="300" r="9" fill="none" stroke="currentColor" strokeWidth="1" />

      {/* Ring 1 Nodes */}
      {NODES_R1.map((p, i) => (
        <g key={`node-r1-${i}`}>
          <circle cx={p.x} cy={p.y} r="3" fill="currentColor" />
          <circle cx={p.x} cy={p.y} r="6" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </g>
      ))}

      {/* Ring 2 Nodes & Micro Data Points */}
      {NODES_R2.map((p, i) => (
        <g key={`node-r2-${i}`}>
          <circle cx={p.x} cy={p.y} r="2.75" fill="currentColor" />
          {i % 2 === 0 && (
            <circle cx={p.x} cy={p.y} r="6.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
          )}
        </g>
      ))}

      {/* Ring 3 Nodes */}
      {NODES_R3.map((p, i) => (
        <g key={`node-r3-${i}`}>
          <circle cx={p.x} cy={p.y} r="2.25" fill="currentColor" />
        </g>
      ))}

      {/* Ring 4 Satellite Data Points */}
      {NODES_R4.map((p, i) => (
        <g key={`node-r4-${i}`}>
          <circle cx={p.x} cy={p.y} r="2" fill="currentColor" />
          <line x1={p.x - 4} y1={p.y} x2={p.x + 4} y2={p.y} stroke="currentColor" strokeWidth="0.6" />
          <line x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y + 4} stroke="currentColor" strokeWidth="0.6" />
        </g>
      ))}
    </motion.svg>
  </div>
));

GeometricDataNetwork.displayName = 'GeometricDataNetwork';

export const MobileEditorialNav = memo<MobileEditorialNavProps>(({
  isOpen,
  onClose,
  activeSection,
  theme,
  setTheme,
  onNavigateSection,
  onViewResume,
  onRecrumple,
}) => {
  const { isMuted, toggleMute } = useSound();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus trap & Escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleItemClick = useCallback((id: string, isResume?: boolean) => {
    onNavigateSection(id, isResume);
    onClose();
  }, [onNavigateSection, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Editorial mobile navigation menu"
          id="mobile-editorial-fullscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] md:hidden w-full h-[100dvh] flex flex-col justify-between overflow-hidden select-none"
          style={{
            backgroundColor: 'var(--c-header-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: 'var(--c-heading)',
          }}
        >
          {/* Subtle Rotating Geometric Network of SVG Data Points (Background) */}
          <GeometricDataNetwork />

          {/* TOP EDITORIAL HEADER */}
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.24, delay: 0.04 }}
            className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0 relative z-20"
            style={{
              borderColor: 'var(--c-border)',
            }}
          >
            {/* Agency / Brand Logo & Subtitle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleItemClick('hero')}
                className="text-2xl font-handwriting font-bold tracking-tight cursor-pointer outline-none text-left"
                style={{ color: 'var(--c-name)' }}
              >
                Sachit
              </button>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--c-dot)]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">
                  EDITION 2026
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border cursor-pointer transition-all duration-200 active:scale-95 group"
              style={{
                borderColor: 'var(--c-border)',
                backgroundColor: 'transparent',
                color: 'var(--c-heading)',
              }}
              aria-label="Close navigation"
            >
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest">
                CLOSE
              </span>
              <span className="text-base font-mono leading-none group-hover:rotate-90 transition-transform duration-200">
                ✕
              </span>
            </button>
          </motion.div>

          {/* MAIN EDITORIAL NAVIGATION LIST */}
          <div className="flex-1 flex flex-col justify-center px-6 py-2 overflow-y-auto relative z-10">
            {/* Navigation Items */}
            <div className="flex flex-col divide-y" style={{ borderColor: 'var(--c-border)' }}>
              {NAV_ITEMS.map((item, index) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredIndex === index;
                const numberStr = `0${index + 1}`;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{
                      duration: 0.28,
                      delay: 0.05 + index * 0.035,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onTouchStart={() => setHoveredIndex(index)}
                    onClick={() => handleItemClick(item.id, item.isResume)}
                    className="group relative w-full text-left py-3.5 sm:py-4 transition-all duration-200 cursor-pointer outline-none flex items-center justify-between"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6 flex-1 min-w-0">
                      {/* Editorial Number */}
                      <span
                        className="font-mono text-xs sm:text-sm font-bold tracking-widest transition-colors duration-200"
                        style={{
                          color: isActive || isHovered ? 'var(--c-dot)' : 'var(--c-muted)',
                        }}
                      >
                        {numberStr}
                      </span>

                      {/* Large Minimal Bold Title */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1"
                          style={{
                            color: isActive ? 'var(--c-dot)' : 'var(--c-heading)',
                          }}
                        >
                          {item.label}
                        </div>

                        {/* Interactive Revealed Subtitle */}
                        <div
                          className="text-xs font-handwriting mt-0.5 transition-all duration-200 truncate"
                          style={{
                            color: 'var(--c-muted)',
                            opacity: isHovered || isActive ? 0.95 : 0.6,
                            transform: isHovered || isActive ? 'translateX(4px)' : 'none',
                          }}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Sliding Arrow Indicator */}
                    <div className="flex items-center gap-2 pl-2">
                      {isActive && (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: 'var(--c-dot)' }}
                        />
                      )}
                      <div
                        className="transition-all duration-200 transform group-hover:translate-x-1 group-hover:opacity-100"
                        style={{
                          opacity: isHovered || isActive ? 1 : 0.35,
                          color: isHovered || isActive ? 'var(--c-dot)' : 'var(--c-heading)',
                        }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM ACTIONS & UTILITIES */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.28, delay: 0.18 }}
            className="px-6 py-4 border-t space-y-3.5 flex-shrink-0 relative z-20"
            style={{
              borderColor: 'var(--c-border)',
            }}
          >
            {/* PRIMARY CTA: START A PROJECT */}
            <button
              type="button"
              onClick={() => handleItemClick('contact')}
              className="w-full py-3.5 px-5 rounded-xl font-sans text-sm font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.98] shadow-sm group"
              style={{
                backgroundColor: 'var(--c-heading)',
                color: 'var(--c-bg)',
              }}
            >
              <span>START A PROJECT</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Email Transmission Line & Socials */}
            <div className="flex items-center justify-between pt-1 text-xs font-mono">
              <a
                href="mailto:sachit1751@gmail.com"
                className="font-bold underline decoration-dotted underline-offset-4 hover:opacity-80 transition-opacity"
                style={{ color: 'var(--c-heading)' }}
              >
                sachit1751@gmail.com
              </a>

              <div className="flex items-center gap-3" style={{ color: 'var(--c-muted)' }}>
                <a
                  href="https://github.com/sachit1751"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-opacity"
                >
                  GitHub
                </a>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleItemClick('resume', true)}
                  className="hover:underline cursor-pointer"
                >
                  CV
                </button>
              </div>
            </div>

            {/* Bottom Minimal Utilities Bar (Audio) */}
            <div
              className="pt-2 flex items-center justify-end border-t text-[11px] font-mono"
              style={{ borderColor: 'var(--c-border)' }}
            >
              {/* Mute toggle & fold button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex items-center gap-1 opacity-75 hover:opacity-100 cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="text-[10px] uppercase">{isMuted ? 'MUTED' : 'AUDIO'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onRecrumple();
                    onClose();
                  }}
                  className="flex items-center gap-1 opacity-75 hover:opacity-100 cursor-pointer"
                  title="Fold Paper"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="text-[10px] uppercase">FOLD</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileEditorialNav.displayName = 'MobileEditorialNav';
