import { useState, useEffect, useRef, useCallback } from 'react';

export type SwipeDirection = 'down' | 'up' | 'left' | 'right';

export interface UseSwipeToDismissOptions {
  /** Callback fired when swipe threshold or velocity criteria are satisfied to dismiss */
  onDismiss: () => void;
  /** Primary swipe dismiss direction */
  direction?: SwipeDirection;
  /** Distance in pixels to trigger dismissal (default: 65) */
  threshold?: number;
  /** Velocity in px/ms to trigger flick dismissal (default: 0.4) */
  velocityThreshold?: number;
  /** Whether the gesture is enabled (default: true) */
  enabled?: boolean;
  /** Whether to strictly require touch-capable device (default: true) */
  onlyTouch?: boolean;
  /** Custom resistance factor for opposite direction dragging (default: 0.18) */
  resistance?: number;
}

/**
 * Checks if the current browser environment supports touch interaction.
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

/**
 * High-performance, zero-dependency hook providing fluid, native-feeling
 * swipe-to-dismiss functionality for modals, sheets, and navigation drawers.
 * Built directly on native DOM Pointer and Touch APIs to eliminate external
 * package dependencies and build-time resolution failures.
 */
export function useSwipeToDismiss({
  onDismiss,
  direction = 'down',
  threshold = 65,
  velocityThreshold = 0.4,
  enabled = true,
  onlyTouch = true,
  resistance = 0.18,
}: UseSwipeToDismissOptions) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isTouch, setIsTouch] = useState<boolean>(() => isTouchDevice());

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  // Gesture tracking refs
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  useEffect(() => {
    setIsTouch(isTouchDevice());
    const handleMediaChange = () => setIsTouch(isTouchDevice());
    const media = window.matchMedia('(pointer: coarse)');
    media.addEventListener?.('change', handleMediaChange);
    return () => {
      media.removeEventListener?.('change', handleMediaChange);
    };
  }, []);

  const isGestureActive = enabled && (!onlyTouch || isTouch);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isGestureActive) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      const target = e.currentTarget;
      try {
        target.setPointerCapture(e.pointerId);
        pointerIdRef.current = e.pointerId;
      } catch {
        // Fallback for environments where setPointerCapture isn't supported
      }

      const now = performance.now();
      dragStartRef.current = { x: e.clientX, y: e.clientY, time: now };
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
      setIsDragging(true);
    },
    [isGestureActive]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!dragStartRef.current) return;

      const mx = e.clientX - dragStartRef.current.x;
      const my = e.clientY - dragStartRef.current.y;

      let clampedX = 0;
      let clampedY = 0;

      switch (direction) {
        case 'down':
          clampedY = my > 0 ? my : my * resistance;
          break;
        case 'up':
          clampedY = my < 0 ? my : my * resistance;
          break;
        case 'right':
          clampedX = mx > 0 ? mx : mx * resistance;
          break;
        case 'left':
          clampedX = mx < 0 ? mx : mx * resistance;
          break;
      }

      setOffset({ x: clampedX, y: clampedY });
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    },
    [direction, resistance]
  );

  const handlePointerEnd = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!dragStartRef.current) return;

      const start = dragStartRef.current;
      const last = lastPosRef.current || { x: e.clientX, y: e.clientY, time: performance.now() };
      const duration = Math.max(1, last.time - start.time);

      const totalDx = e.clientX - start.x;
      const totalDy = e.clientY - start.y;
      const vx = Math.abs(totalDx) / duration;
      const vy = Math.abs(totalDy) / duration;

      let shouldDismiss = false;

      switch (direction) {
        case 'down': {
          const passedDistance = totalDy > threshold;
          const isFlick = vy > velocityThreshold && totalDy > 20;
          if (passedDistance || isFlick) shouldDismiss = true;
          break;
        }
        case 'up': {
          const passedDistance = totalDy < -threshold;
          const isFlick = vy > velocityThreshold && totalDy < -20;
          if (passedDistance || isFlick) shouldDismiss = true;
          break;
        }
        case 'right': {
          const passedDistance = totalDx > threshold;
          const isFlick = vx > velocityThreshold && totalDx > 20;
          if (passedDistance || isFlick) shouldDismiss = true;
          break;
        }
        case 'left': {
          const passedDistance = totalDx < -threshold;
          const isFlick = vx > velocityThreshold && totalDx < -20;
          if (passedDistance || isFlick) shouldDismiss = true;
          break;
        }
      }

      if (pointerIdRef.current !== null) {
        try {
          e.currentTarget.releasePointerCapture(pointerIdRef.current);
        } catch {
          // Fallback
        }
        pointerIdRef.current = null;
      }

      dragStartRef.current = null;
      lastPosRef.current = null;
      setIsDragging(false);
      setOffset({ x: 0, y: 0 });

      if (shouldDismiss) {
        onDismissRef.current();
      }
    },
    [direction, threshold, velocityThreshold]
  );

  const bind = useCallback(
    () => ({
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
      style: {
        touchAction: direction === 'down' || direction === 'up' ? 'pan-x' : 'pan-y',
      },
    }),
    [handlePointerDown, handlePointerMove, handlePointerEnd, direction]
  );

  // Calculate dynamic transform and opacity decay
  const displacement = Math.abs(direction === 'down' || direction === 'up' ? offset.y : offset.x);
  const opacity = isDragging
    ? Math.max(0.4, 1 - displacement / (threshold * 3.5))
    : 1;

  const style: React.CSSProperties = {
    transform:
      offset.x !== 0 || offset.y !== 0
        ? `translate3d(${offset.x}px, ${offset.y}px, 0)`
        : undefined,
    opacity: isDragging ? opacity : undefined,
    transition: isDragging
      ? 'none'
      : 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.32s ease-out',
    touchAction: direction === 'down' || direction === 'up' ? 'pan-x' : 'pan-y',
    willChange: isDragging ? 'transform, opacity' : undefined,
  };

  return {
    bind,
    offset,
    isDragging,
    isTouchDevice: isTouch,
    style,
    reset: () => setOffset({ x: 0, y: 0 }),
  };
}
