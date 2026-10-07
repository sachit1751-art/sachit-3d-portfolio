import React, { memo } from 'react';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';

export const CurrentlyBuilding = memo(() => {
  return (
    <ScrollReveal>
      <section id="currently-building" className="relative mb-20 pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <SectionHeader
          kicker="05. Now"
          title="Currently Building"
        />

        <Card className="p-6 sm:p-8 max-w-3xl mx-auto">
          <p className="text-base sm:text-lg leading-relaxed font-sans text-center" style={{ color: 'var(--c-body)' }}>
            I'm currently working on a new application. The project is focused on defining core workflows, planning product ergonomics, and validating the architectural design.
          </p>
        </Card>
      </section>
    </ScrollReveal>
  );
});

CurrentlyBuilding.displayName = 'CurrentlyBuilding';


