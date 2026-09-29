import React, { memo } from 'react';
import { Briefcase } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

export const Experience = memo(() => {
  return (
    <ScrollReveal>
      <section id="experience" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-8">
          <div className="flex justify-center mb-3">
            <Briefcase className="w-6 h-6" style={{ color: 'var(--c-dot)' }} />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
            [ 07 / EXPERIENCE ]
          </span>
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Independent Developer" baseDelay={0.1} />
          </h2>
        </div>

        <LineReveal delay={0.3} className="p-6 sm:p-8 mb-6 rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
          <p className="text-lg sm:text-xl leading-relaxed font-body" style={{ color: 'var(--c-body)' }}>
            <WordReveal
              text="I build personal and experimental software projects to learn new technologies and turn ideas into working products."
              baseDelay={0.4}
            />
          </p>
        </LineReveal>

      </section>
    </ScrollReveal>
  );
});

Experience.displayName = 'Experience';
