import React, { memo } from 'react';
import { CpuIcon } from 'lucide-animated';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { PretextText } from '../UI/PretextText';

export const CurrentlyBuilding = memo(() => {
  return (
    <ScrollReveal>
      <section id="currently-building" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-8">
          <div className="flex justify-center mb-3">
            <CpuIcon size={24} className="text-amber-600" />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
            [ 05 / NOW ]
          </span>
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Something New" baseDelay={0.1} />
          </h2>
        </div>

        <LineReveal delay={0.3} className="p-6 sm:p-8 rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
          <PretextText
            text="I'm currently working on a new application. The project is still in the idea and planning stage, so I'm focusing on defining the problem, planning the product, and figuring out how it should work before development begins."
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

