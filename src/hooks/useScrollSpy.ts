import { useIntersectionHighlighting } from './useIntersectionHighlighting';

export interface UseScrollSpyOptions {
  sectionIds: string[];
  isViewingResume?: boolean;
  isScrollingRef?: React.MutableRefObject<boolean>;
  containerId?: string;
  headerHeight?: number;
}

export interface UseScrollSpyReturn {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  activeTab: string;
  scrolled: boolean;
  lastActiveSectionRef: React.MutableRefObject<string>;
}

export function getHeaderNavTabId(sectionId: string): string {
  if (!sectionId || sectionId === 'hero' || sectionId === 'top') return '';
  if (sectionId === 'about' || sectionId === 'philosophy') return 'about';
  if (sectionId === 'projects') return 'projects';
  if (
    sectionId === 'skills' ||
    sectionId === 'currently-building' ||
    sectionId === 'github' ||
    sectionId === 'experience' ||
    sectionId === 'education' ||
    sectionId === 'strengths'
  )
    return 'skills';
  if (sectionId === 'building-in-public' || sectionId === 'chat-about-me') return 'building-in-public';
  if (sectionId === 'contact') return 'contact';
  return '';
}

export function useScrollSpy({
  sectionIds,
  isViewingResume = false,
  isScrollingRef,
  containerId = 'content-scroll-container',
  headerHeight = 72,
}: UseScrollSpyOptions): UseScrollSpyReturn {
  const {
    activeSection,
    setActiveSection,
    scrolled,
    lastActiveSectionRef,
  } = useIntersectionHighlighting({
    sectionIds,
    isViewingResume,
    isScrollingRef,
    containerId,
    headerHeight,
  });

  const activeTab = isViewingResume ? 'resume' : getHeaderNavTabId(activeSection);

  return {
    activeSection,
    setActiveSection,
    activeTab,
    scrolled,
    lastActiveSectionRef,
  };
}
