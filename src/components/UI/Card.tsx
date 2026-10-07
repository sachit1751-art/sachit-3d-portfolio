import React, { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ as: Component = 'div', className = '', style, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`rounded-[var(--radius-lg)] border border-[var(--c-border)] bg-[var(--c-surface)] backdrop-blur-sm transition-all duration-200 hover:border-[var(--c-border-hover)] ${className}`}
        style={{
          boxShadow: '0 2px 12px -2px rgba(24, 21, 18, 0.05)',
          ...style,
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
