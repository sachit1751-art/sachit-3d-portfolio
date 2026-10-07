import React, { memo } from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

const educationItems = [
  {
    label: 'Education',
    title: 'CBSE — Class 12',
    subtitle: 'Stream: PCMB (Physics, Chemistry, Mathematics, Biology)',
    detail: 'Graduation Year: 2028',
    icon: GraduationCap,
  },
  {
    label: 'Certification',
    title: 'Anthropic Skill Jar — Full Developer Curriculum Completion',
    subtitle: 'Focus: Prompt Engineering, Claude API Architecture, Advanced Workflows',
    detail: 'Successfully completed 100% of the Anthropic Skill Jar coursework. Gained competencies in advanced generative AI integration.',
    icon: Award,
  },
];

export const Education = memo(() => {
  return (
    <ScrollReveal>
      <section id="education" className="relative mb-20 pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <SectionHeader
          kicker="08. Education"
          title="Education & Certifications"
        />

        <div className="space-y-4 max-w-3xl mx-auto">
          {educationItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="p-6 sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--c-border)]"
                    style={{ backgroundColor: 'var(--c-surface-hover)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--c-heading)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="mb-2">
                      {item.label}
                    </Badge>
                    <h3 className="font-sans text-lg sm:text-xl font-bold mb-1.5 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base font-sans mb-1.5" style={{ color: 'var(--c-body)' }}>
                      {item.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--c-muted)' }}>
                      {item.detail}
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

Education.displayName = 'Education';

export default Education;


