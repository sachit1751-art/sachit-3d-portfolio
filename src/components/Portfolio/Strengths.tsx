import React, { memo } from 'react';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';

const strengths = [
  {
    title: 'Curiosity',
    description: 'I like understanding how technology works and exploring architectures beyond the surface.',
  },
  {
    title: 'Creativity',
    description: 'I enjoy coming up with novel product ideas and finding clean ways to approach technical problems.',
  },
  {
    title: 'Problem Solving',
    description: 'I enjoy breaking complex problems down and implementing structured, reliable solutions.',
  },
];

export const Strengths = memo(() => {
  return (
    <ScrollReveal>
      <section id="strengths" className="relative mb-20 pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <SectionHeader
          kicker="09. Strengths"
          title="Core Strengths"
        />

        <div className="space-y-4 max-w-3xl mx-auto">
          {strengths.map((strength, idx) => (
            <Card
              key={idx}
              className="p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] font-mono text-xs font-bold border border-[var(--c-border)]"
                  style={{ backgroundColor: 'var(--c-surface-hover)', color: 'var(--c-heading)' }}
                >
                  0{idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-sans text-lg sm:text-xl font-bold mb-1 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                    {strength.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed font-sans" style={{ color: 'var(--c-body)' }}>
                    {strength.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
});

Strengths.displayName = 'Strengths';


export default Strengths;
