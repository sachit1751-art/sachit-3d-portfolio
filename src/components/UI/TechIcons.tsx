import React from 'react';

export interface TechIconProps {
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
}

/**
 * Authentic SVG icons for development technologies and frameworks.
 */

// Kotlin
export const KotlinIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="Kotlin">
    <path d="M24 24H0V0h24L12 12Z" />
  </svg>
);

// Jetpack Compose
export const JetpackComposeIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Jetpack Compose">
    <path d="m12 2 10 5.5v9L12 22 2 16.5v-9L12 2z" />
    <path d="M12 22V12" />
    <path d="m22 7.5-10 4.5L2 7.5" />
    <path d="m17 4.75-5 2.75-5-2.75" />
  </svg>
);

// Android / Android SDK
export const AndroidIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="Android">
    <path d="M17.523 15.341a.835.835 0 0 1-.837-.837c0-.46.377-.837.837-.837.46 0 .837.377.837.837 0 .46-.377.837-.837.837m-11.046 0a.835.835 0 0 1-.837-.837c0-.46.377-.837.837-.837.46 0 .837.377.837.837 0 .46-.377.837-.837.837m11.455-5.302l1.644-2.848a.42.42 0 0 0-.153-.574.42.42 0 0 0-.574.153l-1.67 2.893a11.9 11.9 0 0 0-4.679-.942c-1.696 0-3.29.345-4.68.942L6.15 6.77a.42.42 0 0 0-.574-.153.42.42 0 0 0-.153.574l1.644 2.848C3.896 11.758 1.848 15.02 1.848 18.8h20.304c0-3.78-2.048-7.042-5.22-8.761" />
  </svg>
);

// Room Database
export const RoomDatabaseIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Room Database">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

// Wear OS
export const WearOSIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Wear OS">
    <rect x="7" y="5" width="10" height="14" rx="3" />
    <path d="M10 2h4M10 22h4" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// Git
export const GitIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Git">
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 15V9a4 4 0 0 0-4-4H9" />
    <line x1="6" y1="9" x2="6" y2="15" />
  </svg>
);

// Python
export const PythonIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="Python">
    <path d="M14.25.18c-.98.2-1.74.83-2.11 1.78l-.16.4v1.89h4.15c.67 0 1.25.43 1.45 1.07.18.57-.1 1.25-.66 1.54l-4.24 2.22h3.9c1.94 0 3.51-1.57 3.51-3.51V3.69c0-1.94-1.57-3.51-3.51-3.51H14.25zm-1.85 6.6c.31-.03.58.2.61.51.03.31-.2.58-.51.61-.31.03-.58-.2-.61-.51-.03-.31.2-.58.51-.61zM9.75 12.25c-1.94 0-3.51 1.57-3.51 3.51v1.88c0 1.94 1.57 3.51 3.51 3.51h2.43c.98-.2 1.74-.83 2.11-1.78l.16-.4v-1.89h-4.15c-.67 0-1.25-.43-1.45-1.07-.18-.57.1-1.25.66-1.54l4.24-2.22h-3.9zm3.5 5.47c.31.03.58-.2.61-.51.03-.31-.2-.58-.51-.61-.31-.03-.58.2-.61.51-.03.31.2.58.51.61z" />
  </svg>
);

// Anthropic Claude
export const ClaudeIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="Anthropic Claude">
    <path d="M13.827 1.996h-3.654L4.476 22.004h3.766l1.398-4.043h5.718l1.398 4.043h3.767L13.827 1.996zm-3.08 13.064l1.753-5.07 1.753 5.07h-3.506z" />
  </svg>
);

// Model Context Protocol (MCP)
export const MCPIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Model Context Protocol">
    <rect x="2" y="2" width="8" height="8" rx="1.5" />
    <rect x="14" y="14" width="8" height="8" rx="1.5" />
    <path d="M10 6h4a2 2 0 0 1 2 2v2M14 18h-4a2 2 0 0 1-2-2v-2" />
  </svg>
);

// JSON-RPC / Structured Protocol
export const JsonRpcIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="JSON-RPC">
    <path d="M7 4c-1.5 0-2.5 1-2.5 2.5v3c0 1-.5 1.5-1.5 2 1 .5 1.5 1 1.5 2v3C4.5 19 5.5 20 7 20" />
    <path d="M17 4c1.5 0 2.5 1 2.5 2.5v3c0 1 .5 1.5 1.5 2-1 .5-1.5 1-1.5 2v3c0 1.5-1 2.5-2.5 2.5" />
    <circle cx="10" cy="12" r="1" fill="currentColor" />
    <circle cx="14" cy="12" r="1" fill="currentColor" />
  </svg>
);

// Context Injection / Memory Pipe
export const ContextInjectionIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Context Injection">
    <path d="M12 2v6M12 16v6M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h6M16 12h6" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

// React
export const ReactIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="-11.5 -10.23 23 20.46" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.2" aria-label="React">
    <circle r="2.05" fill="currentColor"/>
    <ellipse rx="11" ry="4.2"/>
    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
  </svg>
);

// TypeScript
export const TypeScriptIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="TypeScript">
    <path d="M22 2H2v20h20V2zM11.2 16.5c0 1.2-.5 2-1.5 2-.8 0-1.4-.4-1.7-1l1.1-.7c.2.4.4.6.7.6.3 0 .5-.2.5-.5V8.5h1.9v8zm6 .7c-.4.5-1 .8-1.8.8-1.2 0-2-.7-2-2.2V8.5h1.9v7c0 .5.3.7.7.7.3 0 .6-.2.8-.4V8.5h1.9v8.7z"/>
  </svg>
);

// JavaScript
export const JavaScriptIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="JavaScript">
    <path d="M22 2H2v20h20V2zM11.5 16.5c.3.5.7.8 1.4.8.6 0 1-.2 1-.7 0-.4-.3-.6-.9-.8l-1.1-.4c-1.2-.4-1.8-1-1.8-2 0-1.2 1-2.1 2.5-2.1 1.2 0 1.9.5 2.3 1.2l-1.2.8c-.3-.4-.6-.6-1-.6-.4 0-.6.2-.6.5 0 .3.2.5.7.6l1.2.4c1.4.5 2 1.1 2 2.1 0 1.4-1.1 2.3-2.8 2.3-1.6 0-2.5-.8-2.8-1.7l1.2-.8z"/>
  </svg>
);

// Tailwind CSS
export const TailwindIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="Tailwind CSS">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
  </svg>
);

// Vite
export const ViteIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="Vite">
    <path d="m21.414 4.586-9.141 16.453a.5.5 0 0 1-.873 0L2.259 4.586a.5.5 0 0 1 .437-.743h4.482l4.822 8.914 4.822-8.914h4.155a.5.5 0 0 1 .437.743z" />
  </svg>
);

// Supabase
export const SupabaseIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="Supabase">
    <path d="M13.4 1.1c-.5-.5-1.4-.2-1.4.6v7.3H5.2c-.8 0-1.2.9-.6 1.4l10 10.1c.5.5 1.4.2 1.4-.6v-7.3h6.8c.8 0 1.2-.9.6-1.4L13.4 1.1z" />
  </svg>
);

// PostgreSQL
export const PostgreSQLIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="PostgreSQL">
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v8c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
    <path d="M7 17.5c1.4.8 3.1 1.2 5 1.2s3.6-.4 5-1.2" />
    <path d="M12 9v12" />
  </svg>
);

// Capacitor
export const CapacitorIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Capacitor">
    <circle cx="12" cy="12" r="9" />
    <path d="m14 8-4 4 4 4" />
  </svg>
);

// Android Studio
export const AndroidStudioIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Android Studio">
    <circle cx="12" cy="12" r="9" />
    <path d="m10 8 5 4-5 4V8z" fill="currentColor" />
  </svg>
);

// Web Audio API
export const WebAudioIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Web Audio API">
    <path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4" />
  </svg>
);

// HTML5
export const HTMLIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="HTML5">
    <path d="M1.5 1.5h21l-1.9 19.3L12 22.5l-8.6-1.7L1.5 1.5zm14.5 6.2H8.3l-.2 2h7.6l-.3 3.5-3.6.7-3.6-.7-.1-1.5h-2l.2 3.1 5.5 1.1 5.5-1.1.7-7.1z" />
  </svg>
);

// CSS3
export const CSSIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-label="CSS3">
    <path d="M1.5 1.5h21l-1.9 19.3L12 22.5l-8.6-1.7L1.5 1.5zm14.8 6.2H7.3l.1 1.5h7.5l-.2 2.2H8.8l-.1 1.5h4.9l-.3 3-3.3.6-3.3-.6-.1-1.5h-1.5l.2 3.1 4.7 1 4.7-1 .8-8.2z" />
  </svg>
);

// Minimax / Game AI Tree
export const MinimaxIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Minimax">
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="m10.5 7.5-3 8M13.5 7.5l3 8" />
  </svg>
);

// Game Logic
export const GameLogicIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Game Logic">
    <rect x="2" y="6" width="20" height="12" rx="4" />
    <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
  </svg>
);

// Default Tag
export const GenericTagIcon: React.FC<TechIconProps> = ({ className = 'w-3 h-3', style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Tag">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

/**
 * Returns the matching SVG icon component for any technology or stack tag.
 */
export function getTechStackSVG(tag: string): React.FC<TechIconProps> {
  const norm = tag.toLowerCase().trim();

  // Kotlin & Jetpack
  if (norm === 'kotlin' || norm.includes('kotlin')) return KotlinIcon;
  if (norm.includes('compose') || norm.includes('jetpack')) return JetpackComposeIcon;
  if (norm.includes('wear os') || norm.includes('wearos') || norm.includes('wear')) return WearOSIcon;
  if (norm.includes('room database') || norm.includes('room')) return RoomDatabaseIcon;
  if (norm.includes('android studio')) return AndroidStudioIcon;
  if (norm.includes('android')) return AndroidIcon;

  // AI & MCP & Protocols
  if (norm.includes('claude') || norm.includes('anthropic')) return ClaudeIcon;
  if (norm.includes('mcp') || norm.includes('context protocol')) return MCPIcon;
  if (norm.includes('json-rpc') || norm.includes('jsonrpc') || norm.includes('rpc')) return JsonRpcIcon;
  if (norm.includes('context injection') || norm.includes('injection')) return ContextInjectionIcon;
  if (norm.includes('python')) return PythonIcon;

  // Web & Frameworks
  if (norm.includes('react native') || norm.includes('react')) return ReactIcon;
  if (norm.includes('typescript') || norm === 'ts') return TypeScriptIcon;
  if (norm.includes('javascript') || norm === 'js') return JavaScriptIcon;
  if (norm.includes('tailwind')) return TailwindIcon;
  if (norm.includes('vite')) return ViteIcon;
  if (norm.includes('supabase')) return SupabaseIcon;
  if (norm.includes('postgresql') || norm.includes('postgres')) return PostgreSQLIcon;
  if (norm.includes('capacitor')) return CapacitorIcon;
  if (norm.includes('web audio') || norm.includes('audio api') || norm.includes('audio')) return WebAudioIcon;
  if (norm.includes('html')) return HTMLIcon;
  if (norm.includes('css')) return CSSIcon;
  if (norm.includes('git')) return GitIcon;
  if (norm.includes('minimax')) return MinimaxIcon;
  if (norm.includes('game')) return GameLogicIcon;

  return GenericTagIcon;
}
