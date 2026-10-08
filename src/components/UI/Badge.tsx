import React, { memo } from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'text' | 'pill' | 'mono' | 'outline';
  icon?: React.ReactNode;
}

export const Badge = memo<BadgeProps>(({
  variant = 'text',
  icon,
  className = '',
  style,
  children,
  ...props
}) => {
  const variantStyles = {
    text: {
      className: 'font-mono text-[11px] font-bold uppercase tracking-wider',
      style: { color: 'var(--c-subtle)' },
    },
    mono: {
      className: 'font-mono text-[10px] uppercase tracking-wider',
      style: { color: 'var(--c-muted)' },
    },
    pill: {
      className: 'font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)]',
      style: {
        backgroundColor: 'var(--c-input-bg)',
        border: '1px solid var(--c-border)',
        color: 'var(--c-subtle)',
      },
    },
    outline: {
      className: 'px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[var(--radius-sm)]',
      style: {
        border: '1px solid var(--c-border)',
        backgroundColor: 'var(--c-input-bg)',
        color: 'var(--c-heading)',
      },
    },
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${variantStyles.className} ${className}`.trim()}
      style={{ ...variantStyles.style, ...style }}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
});

Badge.displayName = 'Badge';

export const MetadataLabel = Badge;
