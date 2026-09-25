import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePerformance } from '../../hooks/usePerformance';
import { observeElement } from '../../utils/observer';

interface QuoteRollProps {
  quotes: string[];
  interval?: number;
  className?: string;
  mode?: 'roll' | 'grid';
}

export function QuoteRoll({ quotes, interval = 5000, className = '', mode = 'roll' }: QuoteRollProps) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    return observeElement(
      el,
      (isIntersecting) => setIsVisible(isIntersecting),
      { threshold: 0 },
      false // continuous tracking (not once)
    );
  }, []);

  useEffect(() => {
    if (mode === 'grid' || !isVisible || simplify) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, interval);
    return () => clearInterval(timer);
  }, [quotes.length, interval, isVisible, simplify, mode]);

  if (mode === 'grid') {
    return <QuotesGrid quotes={quotes} className={className} />;
  }

  return (
    <span
      ref={containerRef as any}
      className={`relative inline-grid overflow-hidden align-baseline max-w-full ${className}`}
    >
      {/* Invisible ghost elements to reserve space without forcing layout overflow */}
      {quotes.map((q, i) => (
        <span
          key={`ghost-${i}`}
          aria-hidden="true"
          className="[grid-area:1/1] invisible pointer-events-none select-none opacity-0 line-clamp-1 truncate max-w-full"
        >
          {q}
        </span>
      ))}

      {/* Active animated quote */}
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={simplify ? { opacity: 0 } : { y: 12, opacity: 0, filter: 'blur(3px)' }}
          animate={simplify ? { opacity: 1 } : { y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={simplify ? { opacity: 0 } : { y: -12, opacity: 0, filter: 'blur(3px)' }}
          transition={simplify ? { duration: 0.2 } : { type: 'spring', stiffness: 300, damping: 28 }}
          className="[grid-area:1/1] line-clamp-1 truncate max-w-full pr-1.5"
        >
          {quotes[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface QuotesGridProps {
  quotes: string[];
  className?: string;
}

export function QuotesGrid({ quotes, className = '' }: QuotesGridProps) {
  const { simplify } = usePerformance();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={simplify ? undefined : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 w-full p-1 overflow-visible ${className}`}
    >
      {quotes.map((q, i) => {
        // Parse quote text and author delimiter ('—' or '·' or '-')
        let quoteText = q;
        let author = '';

        if (q.includes(' — ')) {
          const parts = q.split(' — ');
          quoteText = parts[0];
          author = parts[1];
        } else if (q.includes(' · ')) {
          const parts = q.split(' · ');
          quoteText = parts[0];
          author = parts[1];
        } else if (q.includes(' - ')) {
          const parts = q.split(' - ');
          quoteText = parts[0];
          author = parts[1];
        }

        return (
          <motion.div
            key={`quote-card-${i}`}
            variants={simplify ? undefined : itemVariants}
            className="flex flex-col justify-between items-center text-center p-5 sm:p-6 rounded-[var(--radius-lg)] border border-[var(--c-border)] bg-[var(--c-card)] min-w-0 w-full hover:border-[var(--c-border-focus)] transition-all duration-300 shadow-xs group"
          >
            <p className="font-handwriting text-base sm:text-lg italic leading-relaxed text-[var(--c-heading)] break-words max-w-full my-auto py-1">
              {quoteText}
            </p>
            {author && (
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--c-subtle)] mt-3 opacity-75 group-hover:opacity-100 transition-opacity">
                — {author}
              </span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

