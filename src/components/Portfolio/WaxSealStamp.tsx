import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic, HAPTIC_PATTERNS } from '../../utils/haptics';

interface WaxSealStampProps {
  isBroken: boolean;
  onBreak: () => void;
}

/**
 * Synthetic wax crack & parchment unroll sound using Web Audio API
 */
function playWaxCrackSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const t = ctx.currentTime;

    // 1. Sharp initial crack snap
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(680, t);
    snapOsc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

    snapGain.gain.setValueAtTime(0.35, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(t);
    snapOsc.stop(t + 0.09);

    // 2. Crumbling wax noise burst
    const dur = 0.22;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < buf.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.8 ? 0.9 : 0.2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, t + 0.02);
    filter.frequency.exponentialRampToValueAtTime(450, t + dur);
    filter.Q.value = 3.0;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, t);
    noiseGain.gain.linearRampToValueAtTime(0.28, t + 0.03);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t + 0.02);
    noise.stop(t + dur + 0.02);
  } catch {
    // Audio safe fallback
  }
}

export const WaxSealStamp: React.FC<WaxSealStampProps> = ({ isBroken, onBreak }) => {
  const [isCracking, setIsCracking] = useState(false);

  const handleClick = useCallback(() => {
    if (isBroken || isCracking) return;

    setIsCracking(true);
    playWaxCrackSound();
    triggerHaptic(HAPTIC_PATTERNS.waxCrack);

    setTimeout(() => {
      onBreak();
      setIsCracking(false);
    }, 450);
  }, [isBroken, isCracking, onBreak]);

  if (isBroken && !isCracking) return null;

  return (
    <div 
      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto rounded-[var(--radius-lg)] overflow-hidden"
      style={{
        backgroundColor: 'rgba(28, 22, 14, 0.52)',
        backdropFilter: 'blur(3px)',
      }}
    >
      {/* Parchment Document Ribbon Band */}
      <motion.div 
        initial={{ scaleX: 1, opacity: 1 }}
        animate={isCracking ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.38, ease: 'easeInOut' }}
        className="absolute w-full h-14 sm:h-16 flex items-center justify-between px-6 pointer-events-none select-none shadow-md"
        style={{
          backgroundColor: '#382f25',
          borderTop: '1px solid rgba(220, 195, 160, 0.35)',
          borderBottom: '1px solid rgba(220, 195, 160, 0.35)',
          backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.3) 100%)',
        }}
      >
        <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.25em] text-[#d9ceb8] uppercase font-bold hidden sm:inline">
          OFFICIAL CURRICULUM VITAE
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.25em] text-[#d9ceb8] uppercase font-bold sm:hidden">
          SEALED DOSSIER
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.25em] text-[#d9ceb8] uppercase font-bold hidden md:inline">
          VERIFIED ARCHITECTURE
        </span>
      </motion.div>

      {/* Interactive 3D Wax Seal Badge */}
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={isCracking}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={
          isCracking 
            ? { scale: [1, 1.15, 0.4], opacity: [1, 1, 0], rotate: [0, -6, 12] } 
            : { scale: 1, opacity: 1 }
        }
        whileHover={{ scale: 1.06, rotate: 1.5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: isCracking ? 0.45 : 0.2 }}
        className="group relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full cursor-pointer focus:outline-none select-none flex items-center justify-center"
        aria-label="Click to break wax seal and reveal resume"
        title="Click to break wax seal"
        style={{
          filter: 'drop-shadow(0 14px 22px rgba(15, 8, 4, 0.65))',
        }}
      >
        {/* Organic scalloped wax edge SVG */}
        <svg 
          viewBox="0 0 140 140" 
          className="w-full h-full absolute inset-0"
        >
          <defs>
            <radialGradient id="wax-grad" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#c52828" />
              <stop offset="45%" stopColor="#9a1c1c" />
              <stop offset="85%" stopColor="#6e1010" />
              <stop offset="100%" stopColor="#480808" />
            </radialGradient>
            <filter id="wax-specular" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#1a0404" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Organic Wax Blob Rim */}
          <path
            d="M 70 8 
               C 85 6, 98 14, 108 24 
               C 118 34, 134 46, 132 62 
               C 130 78, 132 94, 120 106 
               C 108 118, 96 132, 80 132 
               C 64 132, 50 134, 36 122 
               C 22 110, 8 100, 8 82 
               C 8 64, 6 48, 18 34 
               C 30 20, 52 10, 70 8 Z"
            fill="url(#wax-grad)"
            filter="url(#wax-specular)"
            stroke="#e04040"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />

          {/* Inner embossed concentric circle ring */}
          <circle cx="70" cy="70" r="44" fill="none" stroke="#7a1414" strokeWidth="2.5" />
          <circle cx="70" cy="70" r="42" fill="none" stroke="#e04a4a" strokeWidth="0.8" strokeOpacity="0.6" />
          <circle cx="70" cy="70" r="37" fill="#881515" />

          {/* Embossed Initial 'S' Monogram */}
          <text 
            x="70" 
            y="81" 
            textAnchor="middle" 
            className="font-serif font-black select-none pointer-events-none"
            style={{
              fontSize: '36px',
              fill: '#b82020',
              stroke: '#f87171',
              strokeWidth: '0.6',
              filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.6))',
            }}
          >
            S
          </text>

          {/* Star Accents */}
          <circle cx="70" cy="40" r="2.2" fill="#fca5a5" opacity="0.8" />
          <circle cx="43" cy="70" r="2.2" fill="#fca5a5" opacity="0.8" />
          <circle cx="97" cy="70" r="2.2" fill="#fca5a5" opacity="0.8" />
          <circle cx="70" cy="100" r="2.2" fill="#fca5a5" opacity="0.8" />

          {/* Dynamic Crack Lines (visible when breaking) */}
          {isCracking && (
            <g stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 70 20 L 68 55 L 75 75 L 65 95 L 70 120" />
              <path d="M 30 65 L 68 55 L 110 75" />
            </g>
          )}
        </svg>

        {/* Hover / Touch Hint Prompt Badge */}
        {!isCracking && (
          <div 
            className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-md font-mono text-[9px] uppercase tracking-wider text-white transition-all shadow-md group-hover:bg-red-800"
            style={{
              backgroundColor: 'rgba(120, 20, 20, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            Click to break seal
          </div>
        )}
      </motion.button>
    </div>
  );
};
