import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'default',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wide rounded-[var(--radius-sm)] select-none px-2 py-0.5 transition-colors';

  const variants: Record<string, string> = {
    default:
      'bg-[var(--c-surface)] text-[var(--c-body)] border border-[var(--c-border)]',
    outline:
      'bg-transparent text-[var(--c-body)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)]',
    secondary:
      'bg-[var(--c-border)]/20 text-[var(--c-heading)] border border-[var(--c-border)] font-medium',
    muted:
      'bg-transparent text-[var(--c-muted)] border border-transparent',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </span>
  );
};
