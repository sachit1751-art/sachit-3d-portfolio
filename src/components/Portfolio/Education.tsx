import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

const learningItems = [
  {
    title: 'Independent, project-led learning',
    subtitle: 'Web development, Android, backend systems, and AI integrations',
    detail: 'I build projects to develop practical skills, test ideas, and learn from implementation and debugging. Individual project READMEs document the technologies and setup where available.',
  },
];

export const Education = memo(() => {
  return (
    <ScrollReveal>
      <section id="education" className="relative mb-12 sm:mb-16 md:mb-20 pt-6 sm:pt-8" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-center mb-2.5">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--c-dot)' }} />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
            [ 08 / LEARNING ]
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Learning & Development" baseDelay={0.1} />
          </h2>
        </div>
        <div className="space-y-6 sm:space-y-8">
          {learningItems.map((item) => (
            <LineReveal
              key={item.title}
              delay={0.3}
              className="p-6 sm:p-8 rounded-[var(--radius-lg)]"
              style={{ border: '1px solid var(--c-border)' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)]" style={{ backgroundColor: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                  <BookOpen className="w-6 h-6" style={{ color: 'var(--c-heading)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-sans text-xl font-bold mt-1 mb-2 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                    <WordReveal text={item.title} baseDelay={0.2} />
                  </h3>
                  <p className="text-base sm:text-lg font-body mb-1" style={{ color: 'var(--c-body)' }}>
                    <WordReveal text={item.subtitle} baseDelay={0.35} />
                  </p>
                  <p className="text-sm font-body" style={{ color: 'var(--c-muted)' }}>
                    <WordReveal text={item.detail} baseDelay={0.5} />
                  </p>
                </div>
              </div>
            </LineReveal>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
});

Education.displayName = 'Education';
export default Education;
