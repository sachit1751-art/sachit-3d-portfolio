import React, { memo } from 'react';

export type SectionSkeletonVariant =
  | 'projects'
  | 'skills'
  | 'timeline'
  | 'cards'
  | 'journal'
  | 'chat'
  | 'contact'
  | 'default';

interface SectionSkeletonProps {
  id?: string;
  variant?: SectionSkeletonVariant;
  className?: string;
  title?: string;
}

export const SectionSkeleton = memo<SectionSkeletonProps>(({
  id,
  variant = 'default',
  className = '',
  title,
}) => {
  return (
    <section
      id={id}
      className={`py-12 sm:py-16 w-full animate-pulse select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Header Skeleton */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="h-5 w-20 rounded"
            style={{ backgroundColor: 'var(--c-dot)', opacity: 0.2 }}
          />
          <div
            className="h-4 w-12 rounded"
            style={{ backgroundColor: 'var(--c-border)', opacity: 0.4 }}
          />
        </div>

        <div
          className="h-8 sm:h-10 w-48 sm:w-64 rounded-md"
          style={{ backgroundColor: 'var(--c-heading)', opacity: 0.12 }}
        />

        <div className="space-y-1.5 max-w-xl pt-1">
          <div
            className="h-3.5 w-full rounded"
            style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.15 }}
          />
          <div
            className="h-3.5 w-4/5 rounded"
            style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.12 }}
          />
        </div>
      </div>

      {/* Variant-Specific Body Skeletons */}
      {variant === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-lg border space-y-4"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                borderColor: 'var(--c-border)',
                opacity: 0.6,
              }}
            >
              <div
                className="w-full h-40 rounded-md"
                style={{ backgroundColor: 'var(--c-border)', opacity: 0.3 }}
              />
              <div className="flex gap-2">
                <div
                  className="h-4 w-16 rounded"
                  style={{ backgroundColor: 'var(--c-dot)', opacity: 0.2 }}
                />
                <div
                  className="h-4 w-14 rounded"
                  style={{ backgroundColor: 'var(--c-border)', opacity: 0.4 }}
                />
              </div>
              <div
                className="h-6 w-3/4 rounded"
                style={{ backgroundColor: 'var(--c-heading)', opacity: 0.15 }}
              />
              <div className="space-y-2">
                <div
                  className="h-3 w-full rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.12 }}
                />
                <div
                  className="h-3 w-5/6 rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'skills' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[360px]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg border space-y-3"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                borderColor: 'var(--c-border)',
                opacity: 0.6,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: 'var(--c-border)', opacity: 0.4 }}
                />
                <div
                  className="h-5 w-28 rounded"
                  style={{ backgroundColor: 'var(--c-heading)', opacity: 0.15 }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="h-5 w-14 rounded-full"
                    style={{ backgroundColor: 'var(--c-border)', opacity: 0.3 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'timeline' && (
        <div className="space-y-6 min-h-[340px] pl-4 border-l-2 border-dashed" style={{ borderColor: 'var(--c-border)' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-lg border space-y-2 relative"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                borderColor: 'var(--c-border)',
                opacity: 0.6,
              }}
            >
              <div
                className="absolute -left-[25px] top-6 w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--c-dot)', opacity: 0.4 }}
              />
              <div className="flex justify-between items-center">
                <div
                  className="h-5 w-40 rounded"
                  style={{ backgroundColor: 'var(--c-heading)', opacity: 0.18 }}
                />
                <div
                  className="h-4 w-20 rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.15 }}
                />
              </div>
              <div
                className="h-4 w-28 rounded"
                style={{ backgroundColor: 'var(--c-dot)', opacity: 0.2 }}
              />
              <div className="space-y-1.5 pt-1">
                <div
                  className="h-3 w-full rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.12 }}
                />
                <div
                  className="h-3 w-3/4 rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[280px]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-lg border space-y-3"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                borderColor: 'var(--c-border)',
                opacity: 0.6,
              }}
            >
              <div
                className="w-10 h-10 rounded"
                style={{ backgroundColor: 'var(--c-border)', opacity: 0.4 }}
              />
              <div
                className="h-5 w-32 rounded"
                style={{ backgroundColor: 'var(--c-heading)', opacity: 0.15 }}
              />
              <div className="space-y-1.5">
                <div
                  className="h-3 w-full rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.12 }}
                />
                <div
                  className="h-3 w-4/5 rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'journal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[300px]">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-5 rounded-lg border space-y-3"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                borderColor: 'var(--c-border)',
                opacity: 0.6,
              }}
            >
              <div
                className="h-4 w-24 rounded"
                style={{ backgroundColor: 'var(--c-dot)', opacity: 0.2 }}
              />
              <div
                className="h-6 w-4/5 rounded"
                style={{ backgroundColor: 'var(--c-heading)', opacity: 0.16 }}
              />
              <div className="space-y-1.5">
                <div
                  className="h-3.5 w-full rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.12 }}
                />
                <div
                  className="h-3.5 w-5/6 rounded"
                  style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'chat' && (
        <div
          className="p-6 rounded-lg border space-y-4 min-h-[260px]"
          style={{
            backgroundColor: 'var(--c-input-bg)',
            borderColor: 'var(--c-border)',
            opacity: 0.6,
          }}
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: 'var(--c-dot)', opacity: 0.3 }}
              />
              <div
                className="h-10 w-2/3 rounded-lg"
                style={{ backgroundColor: 'var(--c-border)', opacity: 0.3 }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <div
                className="h-10 w-1/2 rounded-lg"
                style={{ backgroundColor: 'var(--c-heading)', opacity: 0.1 }}
              />
            </div>
          </div>
          <div
            className="h-12 w-full rounded-md mt-4"
            style={{ backgroundColor: 'var(--c-border)', opacity: 0.25 }}
          />
        </div>
      )}

      {variant === 'contact' && (
        <div
          className="p-6 sm:p-8 rounded-xl border space-y-5 max-w-xl mx-auto min-h-[360px]"
          style={{
            backgroundColor: 'var(--c-input-bg)',
            borderColor: 'var(--c-border)',
            opacity: 0.6,
          }}
        >
          <div className="space-y-3">
            <div
              className="h-10 w-full rounded"
              style={{ backgroundColor: 'var(--c-border)', opacity: 0.3 }}
            />
            <div
              className="h-10 w-full rounded"
              style={{ backgroundColor: 'var(--c-border)', opacity: 0.3 }}
            />
            <div
              className="h-28 w-full rounded"
              style={{ backgroundColor: 'var(--c-border)', opacity: 0.3 }}
            />
            <div
              className="h-11 w-32 rounded"
              style={{ backgroundColor: 'var(--c-dot)', opacity: 0.4 }}
            />
          </div>
        </div>
      )}

      {variant === 'default' && (
        <div
          className="p-6 rounded-lg border space-y-4 min-h-[220px]"
          style={{
            backgroundColor: 'var(--c-input-bg)',
            borderColor: 'var(--c-border)',
            opacity: 0.5,
          }}
        >
          <div className="space-y-2">
            <div
              className="h-4 w-full rounded"
              style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.12 }}
            />
            <div
              className="h-4 w-5/6 rounded"
              style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.1 }}
            />
            <div
              className="h-4 w-4/6 rounded"
              style={{ backgroundColor: 'var(--c-subtle)', opacity: 0.08 }}
            />
          </div>
        </div>
      )}
    </section>
  );
});

SectionSkeleton.displayName = 'SectionSkeleton';
