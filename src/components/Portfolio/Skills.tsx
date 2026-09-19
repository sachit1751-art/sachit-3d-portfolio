import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { SkillCategory } from '../../types';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import * as LucideIcons from 'lucide-react';

const categories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    description: 'Core languages for systems, scripting, and full-stack web engineering.',
    skills: [
      { name: 'Python', iconName: 'Terminal' },
      { name: 'TypeScript', iconName: 'FileCode' },
      { name: 'JavaScript', iconName: 'Code' },
      { name: 'HTML5', iconName: 'Layout' },
      { name: 'CSS3', iconName: 'Palette' },
    ],
  },
  {
    title: 'AI Tools & Automation',
    description: 'LLM integrations, prompt caching, MCP servers, and agent architectures.',
    skills: [
      { name: 'Anthropic Claude API', iconName: 'Sparkles' },
      { name: 'Prompt Engineering', iconName: 'MessageSquare' },
      { name: 'Prompt Caching', iconName: 'Zap' },
      { name: 'OpenAI API', iconName: 'Bot' },
      { name: 'Model Context Protocol (MCP)', iconName: 'Layers' },
      { name: 'Cursor IDE', iconName: 'Code2' },
    ],
  },
  {
    title: 'Web & Backend',
    description: 'Modern frontend frameworks, server runtimes, databases, and APIs.',
    skills: [
      { name: 'React', iconName: 'Atom' },
      { name: 'Vite', iconName: 'Zap' },
      { name: 'Supabase', iconName: 'Database' },
      { name: 'PostgreSQL', iconName: 'HardDrive' },
      { name: 'Node.js', iconName: 'Server' },
      { name: 'REST APIs', iconName: 'Globe' },
    ],
  },
  {
    title: 'Development & Version Control',
    description: 'Toolchains, deployment platforms, and mobile build environments.',
    skills: [
      { name: 'Git', iconName: 'GitBranch' },
      { name: 'GitHub', iconName: 'Github' },
      { name: 'VS Code', iconName: 'Code' },
      { name: 'Command Line', iconName: 'Terminal' },
      { name: 'Vercel', iconName: 'Cloud' },
      { name: 'Capacitor', iconName: 'Smartphone' },
      { name: 'Android Studio', iconName: 'Smartphone' },
    ],
  },
  {
    title: 'Operating Systems',
    description: 'Development environments and server operating systems.',
    skills: [
      { name: 'Linux (Ubuntu)', iconName: 'Terminal' },
      { name: 'Windows', iconName: 'Laptop' },
    ],
  },
];

export const Skills = memo(() => {
  return (
    <ScrollReveal>
    <section id="skills" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-12">
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 03 / CAPABILITIES ]
        </span>
        <div className="flex items-center gap-4">
          <Sparkles className="w-7 h-7 flex-shrink-0" style={{ color: 'var(--c-dot)' }} />
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold whitespace-nowrap tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Skills & Stack" baseDelay={0.1} />
          </h2>
          <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--c-border)' }} />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest mt-2 font-bold" style={{ color: 'var(--c-muted)' }}>
          <WordReveal text="Technical Proficiencies" baseDelay={0.3} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {categories.map((category, cIdx) => (
          <LineReveal 
            key={cIdx} 
            delay={0.1 * cIdx} 
            className="p-6 sm:p-8 rounded-[var(--radius-lg)] transition-all duration-300 hover:bg-[var(--c-border)]/10" 
            style={{ border: '1px solid var(--c-border)' }}
          >
            <div className="mb-6">
              <h3 className="font-sans text-xl font-bold mb-1 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                {category.title}
              </h3>
              <p className="text-sm font-body opacity-70" style={{ color: 'var(--c-body)' }}>
                {category.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {category.skills.map((skill, sIdx) => {
                const Icon = skill.iconName ? (LucideIcons as any)[skill.iconName] : null;
                return (
                  <span
                    key={sIdx}
                    className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-[var(--radius-sm)] flex items-center gap-2 transition-all"
                    style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
                  >
                    {Icon && <Icon size={12} className="opacity-60" />}
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </LineReveal>
        ))}
      </div>
    </section>
    </ScrollReveal>
  );
});

Skills.displayName = 'Skills';
