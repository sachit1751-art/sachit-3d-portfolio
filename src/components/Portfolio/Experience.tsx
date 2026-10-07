import React, { memo } from 'react';
import { Briefcase } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

export const Experience = memo(() => {
  return (
    <ScrollReveal>
      <section id="experience" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-8 text-center">
        <span className="font-mono text-xs font-semibold tracking-widest uppercase block mb-2" style={{ color: 'var(--c-muted)' }}>
          07. Experience
        </span>
        <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--c-heading)' }}>
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
