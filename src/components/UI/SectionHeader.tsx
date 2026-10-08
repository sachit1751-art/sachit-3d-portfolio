import React, { memo } from 'react';
import { WordReveal } from './TextReveal';

export interface SectionHeaderProps {
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  sectionNumber?: string;
  sectionTitle?: string;
  title?: string;
  centered?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeader = memo<SectionHeaderProps>(({
  icon: Icon,
  sectionNumber,
  sectionTitle,
  title,
  centered = true,
  className = '',
  style,
}) => {
  const displayTitle = title || sectionTitle || '';

  return (
    <div
      className={`mb-6 sm:mb-8 ${centered ? 'text-center' : 'text-left'} ${className}`.trim()}
      style={style}
    >
      {Icon && (
        <div className={`flex ${centered ? 'justify-center' : 'justify-start'} mb-2.5`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--c-dot)' }} />
        </div>
      )}
      {sectionNumber && (
        <span
          className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2"
          style={{ color: 'var(--c-muted)' }}
        >
          [ {sectionNumber} ]
        </span>
      )}
      {displayTitle && (
        <h2
          className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{ color: 'var(--c-heading)' }}
        >
          <WordReveal text={displayTitle} baseDelay={0.1} />
        </h2>
      )}
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';
