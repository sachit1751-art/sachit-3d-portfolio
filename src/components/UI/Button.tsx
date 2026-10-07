import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      disabled,
      style,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3.5 text-base',
    }[size];

    const variantClasses = {
      primary:
        'bg-[var(--c-btn-bg)] text-[var(--c-btn-text)] hover:bg-[var(--c-btn-bg-hover)] shadow-sm active:translate-y-0.5',
      secondary:
        'bg-[var(--c-surface)] text-[var(--c-heading)] border border-[var(--c-border)] hover:bg-[var(--c-surface-hover)] hover:border-[var(--c-border-hover)] active:translate-y-0.5',
      outline:
        'bg-transparent text-[var(--c-heading)] border border-[var(--c-border)] hover:bg-[var(--c-surface)] hover:border-[var(--c-border-hover)] active:translate-y-0.5',
      ghost:
        'bg-transparent text-[var(--c-heading)] hover:bg-[var(--c-surface-hover)]',
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 font-medium font-sans rounded-[var(--radius-md)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none ${sizeClasses} ${variantClasses} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
