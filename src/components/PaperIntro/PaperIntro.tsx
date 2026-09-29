import React, { useEffect, useState, useCallback, useRef, lazy, Suspense, memo } from 'react';
// ​‌sachit-2026-original-author‌​
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';
import { usePaperSound } from '../../hooks/usePaperSound';
import { useSound } from '../../utils/soundManager';
import { PaperState, PaperTheme } from '../../types';
import { PaperScene, PaperSceneAPI } from './PaperScene';
import { CursorHint } from '../UI/CursorHint';
import { FloatingPieces } from '../DoomEasterEgg/FloatingPieces';
import { usePerformance } from '../../hooks/usePerformance';
import { HoneycombLoader } from '../UI/HoneycombLoader';
const MoodGame = lazy(() => import('../MoodGame/MoodGame').then(m => ({ default: m.MoodGame })));

function MoodGameFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'var(--c-modal-backdrop, rgba(0,0,0,0.85))' }}>
      <HoneycombLoader size="lg" label="INITIALIZING MOOD GAME..." color="var(--c-heading)" />
    </div>
  );
}

interface PaperIntroProps {
  paperState: PaperState;
  setPaperState: (state: PaperState) => void;
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onOpenComplete?: () => void;
  showMoodGame: boolean;
  setShowMoodGame: (v: boolean) => void;
  onMoodUnlocked: () => void;
}

// ﻿watermark:sachit-portfolio-2026﻿
export const PaperIntro = memo<PaperIntroProps>(({
  paperState,
  setPaperState,
  theme,
  setTheme,
  onOpenComplete,
  showMoodGame,
  setShowMoodGame,
  onMoodUnlocked,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { playUnfold, playCrumple } = usePaperSound();
  const { isMuted, toggleMute } = useSound();
  const { simplify } = usePerformance();
  const touchStartDistRef = useRef<number | null>(null);

  const formattedDate = React.useMemo(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }, []);

  const handlePaperSound = useCallback((type: 'unfold' | 'crumple') => {
    if (type === 'unfold') playUnfold();
    else playCrumple();
  }, [playUnfold, playCrumple]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const paperRef = useRef<PaperSceneAPI | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Detailed logging for PaperIntro state monitoring
  useEffect(() => {
    console.log('[PaperIntro State Monitor Effect]', {
      paperState,
      prefersReducedMotion,
      showMoodGame,
      timestamp: new Date().toISOString()
    });
  }, [paperState, prefersReducedMotion, showMoodGame]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    console.log('[PaperIntro Motion Effect] Initial prefers-reduced-motion:', mediaQuery.matches);
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('[PaperIntro Motion Effect] Motion preference changed:', e.matches);
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paperState === 'crumpled') {
      console.log('[PaperIntro Video Effect] paperState = crumpled -> Playing ambient video loop');
      v.currentTime = 0;
      v.play().catch((err) => console.warn('[PaperIntro Video Effect] Play catch:', err));
    } else {
      console.log('[PaperIntro Video Effect] paperState = ' + paperState + ' -> Pausing ambient video');
      v.pause();
    }
  }, [paperState]);

  const handleUnfold = useCallback(() => {
    console.log('[PaperIntro handleUnfold] Triggered. Current paperState:', paperState, { prefersReducedMotion, showMoodGame });
    if (paperState !== 'crumpled') {
      console.warn('[PaperIntro handleUnfold] Ignored: paperState is not "crumpled"');
      return;
    }
    if (showMoodGame) {
      console.warn('[PaperIntro handleUnfold] Ignored: showMoodGame is active');
      return;
    }
    if (prefersReducedMotion) {
      console.log('[PaperIntro handleUnfold] prefersReducedMotion = true -> Immediately setting paperState = "opened"');
      setPaperState('opened');
      return;
    }
    console.log('[PaperIntro handleUnfold] Setting paperState = "opening"');
    setPaperState('opening');
  }, [paperState, prefersReducedMotion, setPaperState, showMoodGame]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (paperState !== 'crumpled' || e.touches.length !== 2) {
      touchStartDistRef.current = null;
      return;
    }

    const dist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    touchStartDistRef.current = dist;
  }, [paperState]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (paperState !== 'crumpled' || e.touches.length !== 2 || touchStartDistRef.current === null) {
      return;
    }

    const dist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );

    // If fingers move apart by more than 50px, trigger unfold
    if (dist > touchStartDistRef.current + 50) {
      touchStartDistRef.current = null;
      handleUnfold();
    }
  }, [paperState, handleUnfold]);

  const handleButtonClick = useCallback(() => {
    if (btnRef.current) {
      gsap.killTweensOf(btnRef.current);
      gsap.timeline()
        .to(btnRef.current, {
          scale: 1.15,
          duration: 0.14,
          ease: 'back.out(2.5)',
        })
        .to(btnRef.current, {
          scale: 1,
          duration: 0.28,
          ease: 'elastic.out(1.2, 0.4)',
        });
    }
    handleUnfold();
  }, [handleUnfold]);

  useEffect(() => {
    console.log('[PaperIntro openComplete Effect] paperState:', paperState);
    if (paperState === 'opened') {
      console.log('[PaperIntro openComplete Effect] paperState is "opened" -> Triggering onOpenComplete callback to App');
      onOpenComplete?.();
    }
  }, [paperState, onOpenComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (paperState === 'crumpled' && (e.key === 'Enter' || e.key === ' ') && !showMoodGame) {
        e.preventDefault();
        handleButtonClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paperState, handleButtonClick, showMoodGame]);

  const isAnimating = paperState === 'opening' || paperState === 'unfolding' || paperState === 'settling';

  // Doom and Mood sequences are managed by the parent App component
  const doomProgress = 0;
  const doomFlashIndex = null;
  const doomUnlocked = false;
  const moodProgress = 0;
  const moodFlashIndex = null;
  const moodUnlocked = false;
  const exitGame = () => {};

  useEffect(() => {
    if (moodUnlocked && paperState === 'crumpled') {
      onMoodUnlocked();
    }
  }, [moodUnlocked, paperState, onMoodUnlocked]);

  const handleMoodGameComplete = useCallback(() => {
    setShowMoodGame(false);
    exitGame();
  }, [setShowMoodGame, exitGame]);

  return (
    <div 
      data-theme={theme} 
      className="relative w-full h-screen overflow-hidden bg-[var(--c-bg)] transition-colors duration-500"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{ touchAction: paperState === 'crumpled' ? 'none' : 'auto' }}
    >
      {/* Background layer: Paper texture background + radial vignette + video */}
      <div className="absolute inset-0 z-0 overflow-hidden paper-grain pointer-events-none">
        <div 
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 80%),
              radial-gradient(circle at 20% 20%, rgba(0,0,0,0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0,0,0,0.04) 0%, transparent 60%)
            `,
          }}
        />

        {paperState === 'crumpled' && !simplify && (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 mix-blend-multiply opacity-80"
            style={{ opacity: paperState === 'crumpled' ? 0.8 : 0 }}
            src="/scrapbook-bg.mp4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 z-10">
        <PaperScene
          ref={paperRef}
          paperState={paperState}
          onStateChange={(state) => setPaperState(state)}
          theme={theme}
          onPaperClick={handleUnfold}
          onSound={handlePaperSound}
          moodGameActive={showMoodGame}
        />
      </div>

      <CursorHint paperState={paperState} />

      {/* Floating paper pieces — single set for both DOOM and MOOD */}
      {paperState === 'crumpled' && !doomUnlocked && !moodUnlocked && !showMoodGame && (
        <FloatingPieces
          doomProgress={doomProgress}
          doomFlashIndex={doomFlashIndex}
          moodProgress={moodProgress}
          moodFlashIndex={moodFlashIndex}
        />
      )}

      {/* Intro overlay UI */}
      {paperState === 'crumpled' && !showMoodGame && (
        <div
          className="relative z-20 pointer-events-none flex flex-col items-center justify-between w-full h-full p-4 sm:p-8 md:p-12"
          style={{ animation: 'fadeIn 0.5s ease-out' }}
        >
          <header className="flex items-center justify-between w-full max-w-5xl pt-2 sm:pt-0">
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-2">
              <div 
                className="font-handwriting text-xs sm:text-sm font-bold select-none inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md self-start"
                style={{
                  color: 'var(--c-heading)',
                  backgroundColor: 'var(--c-card)',
                  border: '1px solid var(--c-border)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--c-dot)' }} />
                <span className="sm:hidden">tap to unfold</span>
                <span className="hidden sm:inline">drag or click to unfold</span>
              </div>
              <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase flex items-center gap-2" style={{ color: 'var(--c-subtle)' }}>
                <span className="w-1.5 h-1.5" style={{ backgroundColor: 'var(--c-heading)' }} />
                PHYSICAL CANVAS
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-mono tracking-[0.2em] uppercase hidden sm:block" style={{ color: 'var(--c-muted)' }}>
                [ 3D Paper Deformation Engine ]
              </div>
              <button
                type="button"
                data-no-unfold="true"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center pointer-events-auto shadow-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)]"
                style={{
                  backgroundColor: 'var(--c-btn-bg)',
                  color: 'var(--c-btn-text)',
                  borderColor: 'var(--c-border)',
                }}
                title={isMuted ? 'Unmute audio' : 'Mute audio'}
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                aria-pressed={!isMuted}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 opacity-80" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </header>

          <div className="flex-grow" /> {/* Spacer to push the CTA below the center paper ball */}

          {/* Unfold CTA Button (Rich tactile carbon ink finish matching screenshot) */}
          <div className="flex flex-col items-center gap-2 sm:gap-2.5 text-center mb-6 sm:mb-12 pointer-events-auto select-none">
            <button
              ref={btnRef}
              id="unfold-paper-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick();
              }}
              className="group relative inline-flex items-center gap-3.5 sm:gap-5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-[20px] text-white transition-all duration-200 active:scale-95 hover:scale-[1.02] hover:brightness-110 active:brightness-95 cursor-pointer touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                background: 'linear-gradient(180deg, #262320 0%, #171513 100%)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 0 rgba(0, 0, 0, 0.45), 0 12px 28px -4px rgba(20, 16, 12, 0.4), 0 4px 10px -2px rgba(20, 16, 12, 0.2)',
              }}
              aria-label="Click to unfold portfolio"
            >
              <span className="font-handwriting text-xl sm:text-2xl font-bold tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                click to unfold
              </span>

              <div className="flex items-center gap-2 sm:gap-2.5">
                <span
                  className="px-2.5 py-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white rounded-[6px]"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  SPACE
                </span>
                <span className="text-white/40 font-mono text-xs select-none">/</span>
                <span
                  className="px-2.5 py-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white rounded-[6px]"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  ENTER
                </span>
              </div>
            </button>

            <p
              className="font-handwriting text-sm sm:text-base tracking-wide"
              style={{ color: 'var(--c-subtle, #6b655d)' }}
            >
              Tactile portfolio exploration
            </p>
          </div>

          <footer className="w-full max-w-5xl flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-wider pb-2 sm:pb-0" style={{ color: 'var(--c-muted)' }}>
            <div className="flex items-center gap-4">
              <span>Vertex Deformation: Active</span>
              <span className="hidden md:inline">&bull;</span>
              <span className="hidden md:inline">Procedural Creases</span>
            </div>
          </footer>
        </div>
      )}

      {/* MOOD Game Overlay */}
      {showMoodGame && (
        <Suspense fallback={<MoodGameFallback />}>
          <MoodGame
            paperRef={paperRef}
            onComplete={handleMoodGameComplete}
          />
        </Suspense>
      )}
    </div>
  );
});

PaperIntro.displayName = 'PaperIntro';
