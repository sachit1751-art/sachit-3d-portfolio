import React, { memo } from 'react';
import { Hammer, Feather, FlaskConical, Palette, BookOpen } from 'lucide-react';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';

const principles = [
  {
    icon: Hammer,
    title: 'Build What You Want to Understand',
    description: "I learn best by building. When I want to understand a technology, I try to use it in a real project instead of only studying its theory.",
  },
  {
    icon: Feather,
    title: 'Keep It Simple',
    description: 'Good software does not need unnecessary complexity. I prefer interfaces and solutions that are clear and easy to understand.',
  },
  {
    icon: FlaskConical,
    title: 'Experiment',
    description: 'Not every idea will become a finished product. Experimenting, breaking things, and learning from mistakes are part of development.',
  },
  {
    icon: Palette,
    title: 'Design Matters',
    description: 'Development is not only about making something work. The way a product looks, feels, and interacts with the user also matters.',
  },
  {
    icon: BookOpen,
    title: 'Keep Learning',
    description: 'Technology keeps changing, so I try to keep learning and exploring new tools, frameworks, and ideas.',
  },
];

export const Philosophy = memo(() => {
  return (
    <ScrollReveal>
      <section id="philosophy" className="relative mb-16 sm:mb-20 pt-8 sm:pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <SectionHeader
          kicker="02. Philosophy"
          title="How I Think"
          description="A set of practical engineering principles that guide my decisions when building software."
        />

        <div className="space-y-4">
          {principles.map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <Card
                key={idx}
                className="p-5 sm:p-6 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--c-border)]"
                    style={{ backgroundColor: 'var(--c-surface-hover)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--c-heading)' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans text-lg sm:text-xl font-bold mb-1.5 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                      {principle.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--c-body)' }}>
                      {principle.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </ScrollReveal>
  );
});

Philosophy.displayName = 'Philosophy';

