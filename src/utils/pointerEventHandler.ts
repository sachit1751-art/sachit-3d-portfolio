/**
 * Unified PointerEventHandler utility for diagnostic event tracking and pointer-events inspection.
 * Specifically monitors 'Quick Details', 'Live Demo', and 'GitHub' button interactions.
 */

export interface ParentPointerState {
  element: string;
  id?: string;
  className?: string;
  pointerEvents: string;
  zIndex: string;
  position: string;
  overflow: string;
  transform: string;
  opacity: string;
}

export interface PointerEventDiagnostic {
  actionType: 'quick-details' | 'live-demo' | 'github' | 'general-project-button';
  eventType: string;
  targetElement: string;
  targetTag: string;
  coordinates: { clientX: number; clientY: number };
  isBlockedByParent: boolean;
  blockedByElements: ParentPointerState[];
  parentChain: ParentPointerState[];
  timestamp: string;
}

/**
 * Inspects all parents of a target element to check for pointer-events: none or other blockers.
 */
export function inspectElementParentChain(target: HTMLElement): {
  parentChain: ParentPointerState[];
  blockedByElements: ParentPointerState[];
} {
  const parentChain: ParentPointerState[] = [];
  const blockedByElements: ParentPointerState[] = [];
  let current: HTMLElement | null = target;

  while (current && current !== document.documentElement) {
    try {
      const computed = window.getComputedStyle(current);
      const state: ParentPointerState = {
        element: current.tagName.toLowerCase(),
        id: current.id || undefined,
        className: typeof current.className === 'string' ? current.className.trim() : undefined,
        pointerEvents: computed.pointerEvents,
        zIndex: computed.zIndex,
        position: computed.position,
        overflow: computed.overflow,
        transform: computed.transform !== 'none' ? computed.transform : 'none',
        opacity: computed.opacity,
      };

      parentChain.push(state);

      if (computed.pointerEvents === 'none') {
        blockedByElements.push(state);
      }
    } catch {
      // Ignore cross-origin / detached DOM nodes
    }
    current = current.parentElement;
  }

  return { parentChain, blockedByElements };
}

/**
 * Categorizes whether a clicked element belongs to Quick Details, GitHub, or Live Demo.
 */
export function identifyProjectAction(target: HTMLElement): 'quick-details' | 'live-demo' | 'github' | 'general-project-button' | null {
  const buttonOrLink = target.closest<HTMLElement>(
    'button, a, [data-action], .project-btn-quick-details, .project-btn-github, .project-btn-live-demo'
  );

  if (!buttonOrLink) return null;

  const dataAction = buttonOrLink.getAttribute('data-action');
  if (dataAction === 'quick-details' || buttonOrLink.classList.contains('project-btn-quick-details')) {
    return 'quick-details';
  }
  if (dataAction === 'github' || buttonOrLink.classList.contains('project-btn-github')) {
    return 'github';
  }
  if (dataAction === 'live-demo' || buttonOrLink.classList.contains('project-btn-live-demo')) {
    return 'live-demo';
  }

  const textContent = (buttonOrLink.textContent || '').toLowerCase();
  if (textContent.includes('details')) return 'quick-details';
  if (textContent.includes('code') || textContent.includes('github') || textContent.includes('source')) return 'github';
  if (textContent.includes('demo') || textContent.includes('live')) return 'live-demo';

  if (buttonOrLink.closest('[data-project-card="true"]')) {
    return 'general-project-button';
  }

  return null;
}

/**
 * Unified pointer event handler that tracks, inspects, and logs button interaction diagnostics.
 */
export function handlePointerDiagnostic(
  event: MouseEvent | TouchEvent | PointerEvent,
  sourceContext: string = 'PortfolioContainer'
): PointerEventDiagnostic | null {
  const target = event.target as HTMLElement | null;
  if (!target) return null;

  const actionType = identifyProjectAction(target);
  if (!actionType) return null;

  const { parentChain, blockedByElements } = inspectElementParentChain(target);

  const clientX = 'clientX' in event ? event.clientX : (event.touches?.[0]?.clientX ?? 0);
  const clientY = 'clientY' in event ? event.clientY : (event.touches?.[0]?.clientY ?? 0);

  const diagnostic: PointerEventDiagnostic = {
    actionType,
    eventType: event.type,
    targetElement: `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ''}${typeof target.className === 'string' && target.className ? `.${target.className.split(' ').slice(0, 3).join('.')}` : ''}`,
    targetTag: target.tagName.toLowerCase(),
    coordinates: { clientX, clientY },
    isBlockedByParent: blockedByElements.length > 0,
    blockedByElements,
    parentChain,
    timestamp: new Date().toISOString(),
  };

  // Persistent diagnostic output
  const prefix = `[PointerEventHandler:${sourceContext}]`;
  const actionLabel = actionType.toUpperCase();

  if (diagnostic.isBlockedByParent) {
    console.error(
      `${prefix} ⚠️ CRITICAL: Pointer event on '${actionLabel}' target is BLOCKED by parent pointer-events: none!`,
      {
        actionType,
        eventType: event.type,
        target: diagnostic.targetElement,
        blockingAncestors: blockedByElements,
        diagnostic,
      }
    );
  } else {
    console.log(
      `${prefix} 🎯 Action '${actionLabel}' received [${event.type}]:`,
      {
        action: actionType,
        type: event.type,
        target: diagnostic.targetElement,
        coordinates: diagnostic.coordinates,
        ancestorDepth: parentChain.length,
        parentPointerStates: parentChain.map((p) => `${p.element}${p.id ? `#${p.id}` : ''}: pointer-events='${p.pointerEvents}' z-index='${p.zIndex}'`),
      }
    );
  }

  return diagnostic;
}

/**
 * Sets up a capture-phase global listener on a container to monitor all clicks and pointer taps.
 */
export function attachPointerEventInspector(
  container: HTMLElement,
  sourceContext: string = 'PortfolioContainer'
): () => void {
  const events = ['pointerdown', 'click', 'touchend'] as const;

  const listeners = events.map((type) => {
    const handler = (e: Event) => {
      handlePointerDiagnostic(e as any, sourceContext);
    };
    // Use capture: true so we receive events before any stopPropagation or child cancellations
    container.addEventListener(type, handler, { capture: true, passive: false });
    return { type, handler };
  });

  return () => {
    listeners.forEach(({ type, handler }) => {
      container.removeEventListener(type, handler, { capture: true });
    });
  };
}
