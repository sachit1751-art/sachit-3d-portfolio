import React, { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}, ref) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  }[padding];

  const variantClasses = {
    default: 'rounded-[var(--radius-lg)] border border-[var(--c-border)] bg-[var(--c-card)] transition-colors',
    elevated: 'rounded-[var(--radius-lg)] border border-[var(--c-border)] bg-[var(--c-card)] shadow-sm transition-all',
    outline: 'rounded-[var(--radius-lg)] border border-[var(--c-border)] bg-transparent transition-colors',
    interactive: 'rounded-[var(--radius-lg)] border border-[var(--c-border)] bg-[var(--c-card)] hover:border-[var(--c-border-hover)] cursor-pointer transition-all duration-300 hover:-translate-y-1',
  }[variant];

  return (
    <Component
      ref={ref}
      className={`${variantClasses} ${paddingClasses} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`mb-4 ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <h3
    className={`font-sans text-xl sm:text-2xl font-bold tracking-tight ${className}`.trim()}
    style={{ color: 'var(--c-heading)', ...style }}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <p
    className={`text-sm sm:text-base font-body leading-relaxed opacity-85 mt-1 ${className}`.trim()}
    style={{ color: 'var(--c-body)', ...style }}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`space-y-3 ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <div
    className={`pt-4 mt-4 flex items-center justify-between border-t border-[var(--c-border)] ${className}`.trim()}
    style={style}
    {...props}
  >
    {children}
  </div>
);
