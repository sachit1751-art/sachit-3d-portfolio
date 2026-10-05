import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, disabled, type = 'button', ...props }, ref) => {
    // Base styles: Fast, intentional interactions (150ms ease-out)
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-medium whitespace-nowrap rounded-[var(--radius-md)] cursor-pointer select-none transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

    // Variant styles
    const variants: Record<string, string> = {
      primary:
        'bg-[var(--c-btn-bg)] text-[var(--c-btn-text)] shadow-sm hover:bg-[var(--c-btn-bg-hover)] hover:-translate-y-0.5 active:translate-y-0',
      secondary:
        'bg-[var(--c-surface)] text-[var(--c-heading)] border border-[var(--c-border)] shadow-sm hover:bg-[var(--c-surface-hover)] hover:border-[var(--c-border-hover)] hover:-translate-y-0.5 active:translate-y-0',
      outline:
        'bg-transparent text-[var(--c-heading)] border border-[var(--c-border)] hover:border-[var(--c-border-hover)] hover:bg-[var(--c-surface)] hover:-translate-y-0.5 active:translate-y-0',
      ghost:
        'bg-transparent text-[var(--c-heading)] hover:bg-[var(--c-surface)] hover:text-[var(--c-heading)] active:bg-[var(--c-surface-hover)]',
    };

    // Size styles
    const sizes: Record<string, string> = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
