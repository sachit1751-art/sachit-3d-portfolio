/**
 * Tactile Web Haptics Utility
 * Supports Android Vibration API / Web Haptics with safety guards.
 * Completely silent on unsupported devices or desktop browsers.
 */

export const HAPTIC_PATTERNS = {
  unfold: [15, 30, 15],
  crumple: [20, 25, 35],
  dragTick: 8,
  tear: [12, 20, 28],
  airplaneLaunch: [10, 20, 40],
  waxCrack: [25, 45, 20],
  click: 10,
};

export function triggerHaptic(pattern: number | number[] = 15): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (!('vibrate' in navigator)) return false;
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}
