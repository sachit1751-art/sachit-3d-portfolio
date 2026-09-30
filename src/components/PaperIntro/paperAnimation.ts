import { PaperState } from '../../types';

export interface PaperAnimationController {
  progress: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  positionY: number;
  positionZ: number;
  scale: number;
  shadowScaleX: number;
  shadowScaleY: number;
  shadowOpacity: number;
  creaseIntensity: number;
  cameraZ: number;
  paperScale: number;
}

export interface AnimationCallbacks {
  onStateChange?: (state: PaperState) => void;
  onUpdate?: () => void;
  onComplete?: () => void;
  onSound?: () => void;
}

export interface AnimationTimeline {
  play: () => void;
  kill: () => void;
  isActive: () => boolean;
}

// Easing functions for smooth, physical, organic paper motion
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeInQuad(t: number): number {
  return t * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * requestAnimationFrame-driven Unfold Animation
 * Stage 1: Quick tactile squeeze + initial burst (300ms)
 * Stage 2: Full unfold → flat physical paper sheet (2600ms, smooth cubic out)
 * Total duration: 2.9s (matching sound and physical feedback)
 * Completely frame-rate independent via high-precision timestamps
 */
export function createPaperUnfoldTimeline(
  params: PaperAnimationController,
  callbacks: AnimationCallbacks = {}
): AnimationTimeline {
  let active = false;
  let rafId: number | null = null;
  let startTime = 0;
  const stage1Duration = 300;
  const stage2Duration = 2600;
  const totalDuration = stage1Duration + stage2Duration;

  let startVals = { ...params };
  let stage1Target: PaperAnimationController;
  const stage2Target: PaperAnimationController = {
    progress: 1.0,
    scale: 1.0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    positionY: 0,
    positionZ: 0,
    shadowScaleX: 5.0,
    shadowScaleY: 5.0,
    shadowOpacity: 0.0,
    creaseIntensity: 1.0,
    cameraZ: 18.0,
    paperScale: 4.0,
  };

  let stage1Completed = false;

  const step = (timestamp: number) => {
    if (!active) return;
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;

    if (elapsed <= stage1Duration) {
      // Stage 1: Quick squeeze + initial burst
      const p1 = Math.min(Math.max(elapsed / stage1Duration, 0), 1);
      const ease1 = easeInQuad(p1);

      params.progress = lerp(startVals.progress, stage1Target.progress, ease1);
      params.scale = lerp(startVals.scale, stage1Target.scale, ease1);
      params.rotationX = lerp(startVals.rotationX, stage1Target.rotationX, ease1);
      params.rotationY = lerp(startVals.rotationY, stage1Target.rotationY, ease1);
      params.positionY = lerp(startVals.positionY, stage1Target.positionY, ease1);
    } else {
      // Transition to stage 2 once
      if (!stage1Completed) {
        stage1Completed = true;
        callbacks.onStateChange?.('unfolding');
      }

      // Stage 2: Full unfold -> flat sheet
      const elapsedStage2 = elapsed - stage1Duration;
      const p2 = Math.min(Math.max(elapsedStage2 / stage2Duration, 0), 1);
      const ease2 = easeOutCubic(p2);

      params.progress = lerp(stage1Target.progress, stage2Target.progress, ease2);
      params.scale = lerp(stage1Target.scale, stage2Target.scale, ease2);
      params.rotationX = lerp(stage1Target.rotationX, stage2Target.rotationX, ease2);
      params.rotationY = lerp(stage1Target.rotationY, stage2Target.rotationY, ease2);
      params.rotationZ = lerp(startVals.rotationZ, stage2Target.rotationZ, ease2);
      params.positionY = lerp(stage1Target.positionY, stage2Target.positionY, ease2);
      params.positionZ = lerp(startVals.positionZ, stage2Target.positionZ, ease2);
      params.shadowScaleX = lerp(startVals.shadowScaleX, stage2Target.shadowScaleX, ease2);
      params.shadowScaleY = lerp(startVals.shadowScaleY, stage2Target.shadowScaleY, ease2);
      params.shadowOpacity = lerp(startVals.shadowOpacity, stage2Target.shadowOpacity, ease2);
      params.cameraZ = lerp(startVals.cameraZ, stage2Target.cameraZ, ease2);
      params.paperScale = lerp(startVals.paperScale, stage2Target.paperScale, ease2);
    }

    callbacks.onUpdate?.();

    if (elapsed < totalDuration) {
      rafId = requestAnimationFrame(step);
    } else {
      Object.assign(params, stage2Target);
      active = false;
      rafId = null;
      callbacks.onStateChange?.('opened');
      callbacks.onComplete?.();
    }
  };

  return {
    play() {
      if (active) return;
      active = true;
      startTime = 0;
      stage1Completed = false;
      startVals = { ...params };
      stage1Target = {
        ...startVals,
        progress: 0.15,
        scale: 0.92,
        rotationX: startVals.rotationX + 0.12,
        rotationY: startVals.rotationY - 0.15,
        positionY: -0.08,
      };
      callbacks.onSound?.();
      callbacks.onStateChange?.('opening');
      rafId = requestAnimationFrame(step);
    },
    kill() {
      active = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    isActive: () => active,
  };
}

/**
 * requestAnimationFrame-driven Crumple Animation
 * Physical paper folding and crumpling back into a 3D ball (2.9s duration synced with audio)
 * Locks animation progress to hardware requestAnimationFrame timestamps, eliminating jitter
 * and frame-rate discrepancies across 60Hz, 90Hz, 120Hz ProMotion, and 144Hz displays.
 */
export function createPaperCrumpleTimeline(
  params: PaperAnimationController,
  callbacks: AnimationCallbacks = {}
): AnimationTimeline {
  let active = false;
  let rafId: number | null = null;
  let startTime = 0;
  const duration = 2900; // 2.9s duration synced with physical audio

  let startVals = { ...params };
  const targetVals: PaperAnimationController = {
    progress: 0.0,
    scale: 1.0,
    rotationX: 0.18,
    rotationY: 0.38,
    rotationZ: -0.12,
    positionY: 0.0,
    positionZ: 0.0,
    shadowScaleX: 1.0,
    shadowScaleY: 1.0,
    shadowOpacity: 0.65,
    creaseIntensity: 1.0,
    cameraZ: 8.2,
    paperScale: 1.0,
  };

  const step = (timestamp: number) => {
    if (!active) return;
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(Math.max(elapsed / duration, 0), 1);
    const ease = easeInOutQuad(progress);

    params.progress = lerp(startVals.progress, targetVals.progress, ease);
    params.scale = lerp(startVals.scale, targetVals.scale, ease);
    params.rotationX = lerp(startVals.rotationX, targetVals.rotationX, ease);
    params.rotationY = lerp(startVals.rotationY, targetVals.rotationY, ease);
    params.rotationZ = lerp(startVals.rotationZ, targetVals.rotationZ, ease);
    params.positionY = lerp(startVals.positionY, targetVals.positionY, ease);
    params.positionZ = lerp(startVals.positionZ, targetVals.positionZ, ease);
    params.shadowScaleX = lerp(startVals.shadowScaleX, targetVals.shadowScaleX, ease);
    params.shadowScaleY = lerp(startVals.shadowScaleY, targetVals.shadowScaleY, ease);
    params.shadowOpacity = lerp(startVals.shadowOpacity, targetVals.shadowOpacity, ease);
    params.cameraZ = lerp(startVals.cameraZ, targetVals.cameraZ, ease);
    params.paperScale = lerp(startVals.paperScale, targetVals.paperScale, ease);

    callbacks.onUpdate?.();

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      Object.assign(params, targetVals);
      active = false;
      rafId = null;
      callbacks.onStateChange?.('crumpled');
      callbacks.onComplete?.();
    }
  };

  return {
    play() {
      if (active) return;
      active = true;
      startTime = 0;
      startVals = { ...params };
      callbacks.onSound?.();
      callbacks.onStateChange?.('settling');
      rafId = requestAnimationFrame(step);
    },
    kill() {
      active = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    isActive: () => active,
  };
}
