import React, { memo } from 'react';
import { Cpu } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { PretextText } from '../UI/PretextText';

export const CurrentlyBuilding = memo(() => {
  return (
    <ScrollReveal>
      <section id="currently-building" className="relative mb-12 sm:mb-16 md:mb-20 pt-6 sm:pt-8" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-center mb-2.5">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--c-dot)' }} />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
            [ 05 / NOW ]
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Something New" baseDelay={0.1} />
          </h2>
        </div>

        <LineReveal delay={0.3} className="p-6 sm:p-8 rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
          <PretextText
            text="I'm building OutreachOS, a personal CRM for tracking startup research, contacts, email outreach, and follow-ups. It's currently in development; I'm working through setup and validating the core workflows before calling it ready to use."
            font="20px sans-serif"
            lineHeight={30}
            mode="balanced"
            className="text-lg sm:text-xl leading-relaxed font-body"
            style={{ color: 'var(--c-body)' }}
          />
        </LineReveal>
      </section>
    </ScrollReveal>
  );
});

CurrentlyBuilding.displayName = 'CurrentlyBuilding';

