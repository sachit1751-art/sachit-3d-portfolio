import React, { memo } from 'react';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';

export const Experience = memo(() => {
  return (
    <ScrollReveal>
      <section id="experience" className="relative mb-20 pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <SectionHeader
          kicker="07. Experience"
          title="Independent Developer"
        />

        <Card className="p-6 sm:p-8 max-w-3xl mx-auto">
          <p className="text-base sm:text-lg leading-relaxed font-sans text-center" style={{ color: 'var(--c-body)' }}>
            I build personal and experimental software projects to learn new technologies, explore software architecture, and turn ideas into resilient products.
          </p>
        </Card>
      </section>
    </ScrollReveal>
  );
});

Experience.displayName = 'Experience';

