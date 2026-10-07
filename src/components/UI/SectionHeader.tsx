import React from 'react';

export interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  description,
  className = '',
  align = 'left',
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-8 sm:mb-10 ${isCenter ? 'text-center max-w-2xl mx-auto' : ''} ${className}`}>
      {kicker && (
        <span
          className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] block mb-2"
          style={{ color: 'var(--c-muted)' }}
        >
          {kicker}
        </span>
      )}
      <h2
        className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
        style={{ color: 'var(--c-heading)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="mt-2.5 sm:mt-3 text-base sm:text-lg leading-relaxed font-sans max-w-2xl"
          style={{ color: 'var(--c-body)' }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
