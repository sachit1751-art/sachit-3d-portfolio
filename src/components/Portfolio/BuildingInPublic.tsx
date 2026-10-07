import React, { memo } from 'react';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';

const updates = [
  {
    date: 'Sep 2026',
    title: 'MCP Tooling & Integrations',
    description: 'Developed Model Context Protocol (MCP) server integration pipelines and structured JSON-RPC workflows.',
  },
  {
    date: 'Sep 2026',
    title: 'Portfolio Launch',
    description: 'Launched my interactive 3D paper-themed portfolio built with React, Three.js, and custom WebGL shaders.',
  },
  {
    date: 'Aug 2026',
    title: 'Anthropic Curriculum Complete',
    description: 'Finished 100% of the Anthropic Skill Jar — prompt engineering, Claude API architecture, and advanced workflows.',
  },
  {
    date: 'Jul 2026',
    title: 'SKY ROMs Beta',
    description: 'Shipped the beta of SKY ROMs — an Android custom ROM discovery and management platform.',
  },
];

export const BuildingInPublic = memo(() => {
  return (
    <ScrollReveal>
      <section id="building-in-public" className="relative mb-20 pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <SectionHeader
          kicker="10. Journal"
          title="Building in Public"
          description="Milestones, engineering logs, and updates on what I'm creating."
        />

        <div className="space-y-4 max-w-3xl mx-auto">
          {updates.map((update, idx) => (
            <Card
              key={idx}
              className="p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] font-mono text-xs font-bold border border-[var(--c-border)]"
                  style={{ backgroundColor: 'var(--c-surface-hover)', color: 'var(--c-heading)' }}
                >
                  {update.date.split(' ')[0].slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] block mb-1" style={{ color: 'var(--c-muted)' }}>
                    {update.date}
                  </span>
                  <h3 className="font-sans text-lg sm:text-xl font-bold mb-1.5 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                    {update.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed font-sans" style={{ color: 'var(--c-body)' }}>
                    {update.description}
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

BuildingInPublic.displayName = 'BuildingInPublic';
