import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'jellyfish';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  children,
  style,
  href,
  target,
  rel,
  disabled,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-mono',
    md: 'px-5 sm:px-6 py-3 text-sm sm:text-base font-body',
    lg: 'px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-body',
  }[size];

  const variantStyles: Record<ButtonVariant, { base: string; inlineStyle?: React.CSSProperties }> = {
    primary: {
      base: 'transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-[var(--c-btn-bg-hover)] rounded-[var(--radius-md)] cursor-pointer font-body',
      inlineStyle: { backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' },
    },
    secondary: {
      base: 'font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 rounded-[var(--radius-md)] cursor-pointer font-body',
      inlineStyle: {
        border: '1px solid var(--c-border)',
        backgroundColor: 'var(--c-input-bg)',
        color: 'var(--c-heading)',
      },
    },
    ghost: {
      base: 'bg-transparent font-handwriting text-base cursor-pointer hover:opacity-80 transition-opacity',
      inlineStyle: { color: 'var(--c-heading)' },
    },
    outline: {
      base: 'transition-colors hover:border-[var(--c-border-focus)] rounded-[var(--radius-md)] cursor-pointer font-mono text-xs uppercase tracking-wider',
      inlineStyle: {
        border: '1px solid var(--c-border)',
        backgroundColor: 'var(--c-input-bg)',
        color: 'var(--c-heading)',
      },
    },
    jellyfish: {
      base: 'jellyfish-btn bg-transparent font-handwriting text-base cursor-pointer',
      inlineStyle: {},
    },
  };

  const selectedVariant = variantStyles[variant];

  const combinedClass = `inline-flex items-center justify-center gap-2 select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${selectedVariant.base} ${className}`.trim();
  const combinedStyle = { ...selectedVariant.inlineStyle, ...style };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClass}
        style={combinedStyle}
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={combinedClass}
      style={combinedStyle}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
