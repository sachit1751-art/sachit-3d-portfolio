import { useState, useEffect } from 'react';
import { useActiveSection } from './useActiveSection';
import { PaperTheme, PaperState } from '../types';

export interface ProjectSummary {
  name: string;
  category: string;
  description: string;
  techStack: string[];
  url?: string;
}

export interface ConversationContextPayload {
  theme: PaperTheme | string;
  paperState: PaperState | string;
  activeRoute: string;
  projectSummaries: ProjectSummary[];
  updatedAt: string;
}

export interface UseConversationContextOptions {
  theme?: PaperTheme | string;
  paperState?: PaperState | string;
  activeRoute?: string;
}

export const DEFAULT_PROJECT_SUMMARIES: ProjectSummary[] = [
  {
    name: 'SKY ROMs',
    category: 'Android / Web',
    description: 'Android Custom ROM Discovery & Management Platform with device compatibility checks and side-by-side ROM comparisons.',
    techStack: ['React', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS', 'Capacitor'],
    url: 'https://sky-roms.vercel.app'
  },
  {
    name: 'MoneyPal',
    category: 'Android / Wear OS',
    description: 'Native Android budget tracker with calculator-style expense logging, Wear OS companion app, and home-screen widgets.',
    techStack: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Room Database', 'Wear OS']
  },
  {
    name: 'Audify',
    category: 'Web Audio / Frontend',
    description: 'Feature-rich web audio streaming player with fluid playlist management, Web Audio API hooks, and local preference caching.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Web Audio API', 'Vite']
  },
  {
    name: 'AI-Powered MCP Tool',
    category: 'AI Tool / Automation',
    description: 'Model Context Protocol server endpoints and JSON-RPC messaging handlers enabling LLMs to securely query local resources using Claude API.',
    techStack: ['Python', 'Anthropic Claude API', 'MCP Servers', 'JSON-RPC']
  },
  {
    name: 'Tic-Tac-Toe Mini Game',
    category: 'Browser Game',
    description: 'Interactive browser game with an unbeatable Minimax AI recursive decision algorithm and turn locking.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Minimax Algorithm']
  }
];

export function useConversationContext(options: UseConversationContextOptions = {}) {
  const activeSection = useActiveSection();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const theme = options.theme || 'kraft';
  const paperState = options.paperState || 'opened';
  const effectiveRoute = options.activeRoute || (activeSection ? `#${activeSection}` : currentPath);

  const [contextPayload, setContextPayload] = useState<ConversationContextPayload>(() => ({
    theme,
    paperState,
    activeRoute: effectiveRoute,
    projectSummaries: DEFAULT_PROJECT_SUMMARIES,
    updatedAt: new Date().toISOString()
  }));

  // Ensure context payload updates whenever paperState, theme, activeSection, or route changes
  useEffect(() => {
    const updatedPayload: ConversationContextPayload = {
      theme,
      paperState,
      activeRoute: effectiveRoute,
      projectSummaries: DEFAULT_PROJECT_SUMMARIES,
      updatedAt: new Date().toISOString()
    };

    setContextPayload(updatedPayload);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('conversation-context-updated', { detail: updatedPayload }));
    }
  }, [paperState, theme, effectiveRoute]);

  return {
    contextPayload,
    projectSummaries: DEFAULT_PROJECT_SUMMARIES
  };
}
