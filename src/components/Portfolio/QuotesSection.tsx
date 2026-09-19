import React, { memo } from 'react';
import { Quote } from 'lucide-react';
import { WordReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { QuotesGrid } from '../UI/QuoteRoll';
import { DEV_QUOTES } from '../../data/quotes';

export const QuotesSection = memo(() => {
  return (
    <ScrollReveal>
      <section id="quotes" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-8">
          <div className="flex justify-center mb-3">
            <Quote className="w-6 h-6" style={{ color: 'var(--c-dot)' }} />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
            [ DEV MINDSET / QUOTES ]
          </span>
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight mb-2" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Words to Code By" baseDelay={0.1} />
          </h2>
          <p className="text-center font-body text-base sm:text-lg max-w-xl mx-auto opacity-80" style={{ color: 'var(--c-body)' }}>
            Timeless engineering principles and philosophies that guide software craftsmanship.
          </p>
        </div>

        {/* Dynamic Responsive CSS Grid Layout with Staggered Entrance Animation */}
        <QuotesGrid quotes={DEV_QUOTES} />
      </section>
    </ScrollReveal>
  );
});

QuotesSection.displayName = 'QuotesSection';
