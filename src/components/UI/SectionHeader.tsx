import React from 'react';

export interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  description,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-8 sm:mb-10 ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {kicker && (
        <span
          className="font-mono text-xs font-semibold uppercase tracking-[0.2em] block mb-2"
          style={{ color: 'var(--c-muted)' }}
        >
          {kicker}
        </span>
      )}
      <h2
        className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
        style={{ color: 'var(--c-heading)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-base sm:text-lg leading-relaxed font-sans opacity-85 ${
            isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'
          }`}
          style={{ color: 'var(--c-body)' }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
