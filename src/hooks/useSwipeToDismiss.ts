import { useState, useEffect, useRef, useCallback } from 'react';
import { useDrag } from '@use-gesture/react';

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
 * Lightweight hook utilizing `@use-gesture/react` to provide fluid,
 * native-feeling swipe-to-dismiss functionality for modals, sheets,
 * and navigation drawers specifically on touch-enabled mobile devices.
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

  // Common drag logic for both full container and dedicated grab handle
  const handleDrag = useCallback(
    ({
      down,
      movement: [mx, my],
      velocity: [vx, vy],
      direction: [dx, dy],
      tap,
      cancel,
    }: {
      down: boolean;
      movement: [number, number];
      velocity: [number, number];
      direction: [number, number];
      tap?: boolean;
      cancel?: () => void;
    }) => {
      if (tap || !isGestureActive) return;

      let clampedX = 0;
      let clampedY = 0;

      switch (direction) {
        case 'down': {
          // Downward dismiss: positive Y follows finger; upward Y is dampened
          clampedY = my > 0 ? my : my * resistance;
          break;
        }
        case 'up': {
          // Upward dismiss: negative Y follows finger; downward Y is dampened
          clampedY = my < 0 ? my : my * resistance;
          break;
        }
        case 'right': {
          // Rightward dismiss: positive X follows finger; leftward X is dampened
          clampedX = mx > 0 ? mx : mx * resistance;
          break;
        }
        case 'left': {
          // Leftward dismiss: negative X follows finger; rightward X is dampened
          clampedX = mx < 0 ? mx : mx * resistance;
          break;
        }
      }

      if (down) {
        setIsDragging(true);
        setOffset({ x: clampedX, y: clampedY });
      } else {
        setIsDragging(false);

        let shouldDismiss = false;
        switch (direction) {
          case 'down': {
            const passedDistance = clampedY > threshold;
            const isFlick = vy > velocityThreshold && dy > 0 && clampedY > 20;
            if (passedDistance || isFlick) shouldDismiss = true;
            break;
          }
          case 'up': {
            const passedDistance = clampedY < -threshold;
            const isFlick = vy > velocityThreshold && dy < 0 && clampedY < -20;
            if (passedDistance || isFlick) shouldDismiss = true;
            break;
          }
          case 'right': {
            const passedDistance = clampedX > threshold;
            const isFlick = vx > velocityThreshold && dx > 0 && clampedX > 20;
            if (passedDistance || isFlick) shouldDismiss = true;
            break;
          }
          case 'left': {
            const passedDistance = clampedX < -threshold;
            const isFlick = vx > velocityThreshold && dx < 0 && clampedX < -20;
            if (passedDistance || isFlick) shouldDismiss = true;
            break;
          }
        }

        if (shouldDismiss) {
          onDismissRef.current();
        }

        // Reset offset with spring transition
        setOffset({ x: 0, y: 0 });
      }
    },
    [direction, isGestureActive, resistance, threshold, velocityThreshold]
  );

  const bind = useDrag(handleDrag, {
    enabled: isGestureActive,
    axis: direction === 'down' || direction === 'up' ? 'y' : 'x',
    filterTaps: true,
    pointer: { touch: true },
  });

  // Calculate dynamic transform and opacity decay
  const displacement = Math.abs(direction === 'down' || direction === 'up' ? offset.y : offset.x);
  const opacity = isDragging
    ? Math.max(0.4, 1 - (displacement / (threshold * 3.5)))
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
