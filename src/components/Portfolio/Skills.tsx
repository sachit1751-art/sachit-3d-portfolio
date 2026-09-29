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
      { name: 'Linux (ARCH btw)', iconName: 'Terminal' },
      { name: 'Windows', iconName: 'Laptop' },
    ],
  },
];

const renderCustomSVG = (name: string): React.ReactNode | null => {
  const norm = name.toLowerCase().trim();
  
  if (norm.includes('anthropic') || norm.includes('claude')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-85" fill="currentColor">
        <path d="M13.827 1.996h-3.654L4.476 22.004h3.766l1.398-4.043h5.718l1.398 4.043h3.767L13.827 1.996zm-3.08 13.064l1.753-5.07 1.753 5.07h-3.506z" />
      </svg>
    );
  }
  if (norm.includes('openai') || norm.includes('gpt') || norm.includes('codex')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-85" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 10.457.513 6.04 6.04 0 0 0 4.908 3.78a5.98 5.98 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 23.5a6.056 6.056 0 0 0 5.772-3.268 5.99 5.99 0 0 0 3.997-2.901 6.056 6.056 0 0 0-.747-7.51zm-9.022 12.608a4.975 4.975 0 0 1-3.376-1.315l.1-.057 4.254-2.456a.53.53 0 0 0 .265-.46v-5.996l1.802 1.04v4.945a4.994 4.994 0 0 1-3.045 4.283zm-8.82-3.86a4.988 4.988 0 0 1-.616-3.571l.1.06 4.255 2.457a.53.53 0 0 0 .531 0l5.193-2.999v2.08l-4.282 2.472a4.994 4.994 0 0 1-5.181-.5zm-1.848-9.458a4.98 4.98 0 0 1 2.76-2.256v5.03a.53.53 0 0 0 .266.459l5.192 2.998-1.802 1.04-4.283-2.472a5.004 5.004 0 0 1-2.133-4.8zm14.64 2.873-5.193-2.999 1.802-1.04 4.282 2.472a5.004 5.004 0 0 1 2.134 4.8 4.98 4.98 0 0 1-2.76 2.257v-5.031a.53.53 0 0 0-.265-.459zm2.05-3.315l-.1-.06-4.255-2.456a.53.53 0 0 0-.531 0l-5.193 2.999V6.936l4.282-2.472a4.994 4.994 0 0 1 5.181.5 4.988 4.988 0 0 1 .616 3.571zm-9.742 4.148 2.37-1.368 2.37 1.368v2.737l-2.37 1.368-2.37-1.368z"/>
      </svg>
    );
  }
  if (norm.includes('model context protocol') || norm.includes('mcp')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-85" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="8" height="8" rx="1" />
        <rect x="14" y="14" width="8" height="8" rx="1" />
        <path d="M10 6h4a2 2 0 0 1 2 2v2M14 18h-4a2 2 0 0 1-2-2v-2" />
      </svg>
    );
  }
  if (norm.includes('caching') || norm.includes('prompt caching')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-85" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  }
  if (norm.includes('python')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path d="M14.25.18c-.98.2-1.74.83-2.11 1.78l-.16.4v1.89h4.15c.67 0 1.25.43 1.45 1.07.18.57-.1 1.25-.66 1.54l-4.24 2.22h3.9c1.94 0 3.51-1.57 3.51-3.51V3.69c0-1.94-1.57-3.51-3.51-3.51H14.25zm-1.85 6.6c.31-.03.58.2.61.51.03.31-.2.58-.51.61-.31.03-.58-.2-.61-.51-.03-.31.2-.58.51-.61zM9.75 12.25c-1.94 0-3.51 1.57-3.51 3.51v1.88c0 1.94 1.57 3.51 3.51 3.51h2.43c.98-.2 1.74-.83 2.11-1.78l.16-.4v-1.89h-4.15c-.67 0-1.25-.43-1.45-1.07-.18-.57.1-1.25.66-1.54l4.24-2.22h-3.9zm3.5 5.47c.31.03.58-.2.61-.51.03-.31-.2-.58-.51-.61-.31-.03-.58.2-.61.51-.03.31.2.58.51.61z" />
      </svg>
    );
  }
  if (norm.includes('typescript')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path d="M22 2H2v20h20V2zM11.2 16.5c0 1.2-.5 2-1.5 2-.8 0-1.4-.4-1.7-1l1.1-.7c.2.4.4.6.7.6.3 0 .5-.2.5-.5V8.5h1.9v8zm6 .7c-.4.5-1 .8-1.8.8-1.2 0-2-.7-2-2.2V8.5h1.9v7c0 .5.3.7.7.7.3 0 .6-.2.8-.4V8.5h1.9v8.7z"/>
      </svg>
    );
  }
  if (norm.includes('javascript')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path d="M22 2H2v20h20V2zM11.5 16.5c.3.5.7.8 1.4.8.6 0 1-.2 1-.7 0-.4-.3-.6-.9-.8l-1.1-.4c-1.2-.4-1.8-1-1.8-2 0-1.2 1-2.1 2.5-2.1 1.2 0 1.9.5 2.3 1.2l-1.2.8c-.3-.4-.6-.6-1-.6-.4 0-.6.2-.6.5 0 .3.2.5.7.6l1.2.4c1.4.5 2 1.1 2 2.1 0 1.4-1.1 2.3-2.8 2.3-1.6 0-2.5-.8-2.8-1.7l1.2-.8z"/>
      </svg>
    );
  }
  if (norm.includes('html5') || norm.includes('html')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path d="M1.5 1.5h21l-1.9 19.3L12 22.5l-8.6-1.7L1.5 1.5zm14.5 6.2H8.3l-.2 2h7.6l-.3 3.5-3.6.7-3.6-.7-.1-1.5h-2l.2 3.1 5.5 1.1 5.5-1.1.7-7.1z" />
      </svg>
    );
  }
  if (norm.includes('css3') || norm.includes('css')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path d="M1.5 1.5h21l-1.9 19.3L12 22.5l-8.6-1.7L1.5 1.5zm14.8 6.2H7.3l.1 1.5h7.5l-.2 2.2H8.8l-.1 1.5h4.9l-.3 3-3.3.6-3.3-.6-.1-1.5h-1.5l.2 3.1 4.7 1 4.7-1 .8-8.2z" />
      </svg>
    );
  }
  if (norm.includes('react')) {
    return (
      <svg viewBox="-11.5 -10.23 23 20.46" width="12" height="12" className="opacity-80" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle r="2.05" fill="currentColor"/>
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </svg>
    );
  }
  if (norm.includes('supabase')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path d="M13.4 1.1c-.5-.5-1.4-.2-1.4.6v7.3H5.2c-.8 0-1.2.9-.6 1.4l10 10.1c.5.5 1.4.2 1.4-.6v-7.3h6.8c.8 0 1.2-.9.6-1.4L13.4 1.1z" />
      </svg>
    );
  }
  if (norm.includes('postgresql') || norm.includes('postgres')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
      </svg>
    );
  }
  if (norm.includes('node.js') || norm.includes('node')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }
  if (norm.includes('git') && !norm.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 15V9a4 4 0 0 0-4-4H9" />
        <line x1="6" y1="9" x2="6" y2="15" />
      </svg>
    );
  }
  if (norm.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.6-.3.9 0 1.8.1 2.6.3 2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5C19.1 20.2 22 16.4 22 12c0-5.5-4.5-10-10-10z" />
      </svg>
    );
  }
  if (norm.includes('windows')) {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" className="opacity-80" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.101zm10.75-10.583L24 0v11.55H10.75V1.867zM10.75 12.45H24v11.55l-13.25-1.867v-9.683z" />
      </svg>
    );
  }

  return null;
};

export const Skills = memo(() => {
  return (
    <ScrollReveal>
    <section id="skills" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-8">
        <div className="flex justify-center mb-3">
          <Sparkles className="w-6 h-6" style={{ color: 'var(--c-dot)' }} />
        </div>
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 04 / CAPABILITIES ]
        </span>
        <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
          <WordReveal text="Skills & Stack" baseDelay={0.1} />
        </h2>
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
                const CustomIcon = renderCustomSVG(skill.name);
                const LucideIcon = skill.iconName ? (LucideIcons as any)[skill.iconName] : null;
                return (
                  <span
                    key={sIdx}
                    className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-[var(--radius-sm)] flex items-center gap-2 transition-all"
                    style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
                  >
                    {CustomIcon ? (
                      CustomIcon
                    ) : (
                      LucideIcon && <LucideIcon size={12} className="opacity-60" />
                    )}
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
