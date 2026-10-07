import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  style,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[var(--c-surface-hover)] text-[var(--c-heading)] border-[var(--c-border)]',
    outline: 'bg-transparent text-[var(--c-heading)] border-[var(--c-border)]',
    subtle: 'bg-[var(--c-surface)] text-[var(--c-muted)] border-transparent',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-medium rounded-[var(--radius-sm)] border select-none ${variantStyles} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
};
