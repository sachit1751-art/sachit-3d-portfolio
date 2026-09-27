import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePerformance } from '../../hooks/usePerformance';
import { measureTextWidth } from '../../utils/pretext';

interface DepthFlipTextProps {
  phrases?: string[];
  singleText?: string;
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_PHRASES = [
  'AI & Web Developer',
  'Full-Stack Architect',
  'Prompt Engineer',
  'MCP Tools Creator',
];

export const DepthFlipText = memo<DepthFlipTextProps>(({
  phrases = DEFAULT_PHRASES,
  singleText,
  interval = 3600,
  className = '',
  style,
}) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { simplify } = usePerformance();

  const activePhrases = singleText ? [singleText] : phrases;
  const currentPhrase = activePhrases[index % activePhrases.length];

  // Pre-calculate phrase text widths using Pretext for smooth bounding stability
  const phraseWidth = useMemo(() => {
    return measureTextWidth(currentPhrase, '700 64px Kalam, sans-serif');
  }, [currentPhrase]);

  // Next phrase trigger
  const triggerNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % activePhrases.length);
  }, [activePhrases.length]);

  useEffect(() => {
    if (simplify || activePhrases.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      triggerNext();
    }, interval);

    return () => clearInterval(timer);
  }, [activePhrases.length, interval, isHovered, simplify, triggerNext]);

  if (simplify) {
    return <span className={className} style={style}>{currentPhrase}</span>;
  }

  // Split phrase into words to preserve word boundary wrapping
  const words = currentPhrase.split(' ');
  let charGlobalIndex = 0;

  return (
    <span
      className={`inline-block relative cursor-pointer select-none ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        overflow: 'visible',
        ...style,
      }}
      onClick={triggerNext}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click or flip 3D title"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={`${currentPhrase}-${index}`}
          className="inline-block transform-gpu overflow-visible"
          style={{ transformStyle: 'preserve-3d', overflow: 'visible' }}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {words.map((word, wordIdx) => {
            const chars = Array.from(word);
            return (
              <span
                key={`word-${wordIdx}-${word}`}
                className="inline-block whitespace-nowrap mr-[0.25em] overflow-visible"
                style={{ transformStyle: 'preserve-3d', overflow: 'visible' }}
              >
                {chars.map((char) => {
                  const i = charGlobalIndex++;
                  return (
                    <motion.span
                      key={`char-${i}-${char}`}
                      className="inline-block relative transform-gpu"
                      style={{
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        willChange: 'transform, opacity',
                      }}
                      variants={{
                        initial: {
                          rotateX: -60,
                          y: 10,
                          opacity: 0,
                          filter: 'blur(3px)',
                          scale: 0.96,
                        },
                        animate: {
                          rotateX: 0,
                          y: 0,
                          opacity: 1,
                          filter: 'blur(0px)',
                          scale: 1,
                          transition: {
                            duration: 0.52,
                            ease: [0.22, 1, 0.36, 1],
                            delay: Math.min(i * 0.016, 0.22),
                          },
                        },
                        exit: {
                          rotateX: 60,
                          y: -10,
                          opacity: 0,
                          filter: 'blur(2px)',
                          scale: 0.96,
                          transition: {
                            duration: 0.36,
                            ease: [0.32, 0, 0.67, 0],
                            delay: Math.min(i * 0.01, 0.14),
                          },
                        },
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

DepthFlipText.displayName = 'DepthFlipText';
