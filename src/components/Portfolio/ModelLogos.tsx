import React from 'react';

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'anthropic' | 'openai' | 'gemini' | 'deepseek' | 'meta';
  badgeLabel: string;
  version: string;
}

export const SUPPORTED_MODELS: ModelInfo[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'gemini',
    badgeLabel: 'Google Gemini',
    version: '3.8-flash',
  },
  {
    id: 'claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    badgeLabel: 'Anthropic Claude',
    version: '3.7-sonnet',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Codex)',
    provider: 'openai',
    badgeLabel: 'OpenAI GPT-4o',
    version: 'omni-preview',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'deepseek',
    badgeLabel: 'DeepSeek AI',
    version: 'r1-distill',
  },
];

export const AnthropicLogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="Anthropic logo">
    <path d="M13.827 1.996h-3.654L4.476 22.004h3.766l1.398-4.043h5.718l1.398 4.043h3.767L13.827 1.996zm-3.08 13.064l1.753-5.07 1.753 5.07h-3.506z" />
  </svg>
);

export const OpenAILogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="OpenAI logo">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 10.457.513 6.04 6.04 0 0 0 4.908 3.78a5.98 5.98 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 23.5a6.056 6.056 0 0 0 5.772-3.268 5.99 5.99 0 0 0 3.997-2.901 6.056 6.056 0 0 0-.747-7.51zm-9.022 12.608a4.975 4.975 0 0 1-3.376-1.315l.1-.057 4.254-2.456a.53.53 0 0 0 .265-.46v-5.996l1.802 1.04v4.945a4.994 4.994 0 0 1-3.045 4.283zm-8.82-3.86a4.988 4.988 0 0 1-.616-3.571l.1.06 4.255 2.457a.53.53 0 0 0 .531 0l5.193-2.999v2.08l-4.282 2.472a4.994 4.994 0 0 1-5.181-.5zm-1.848-9.458a4.98 4.98 0 0 1 2.76-2.256v5.03a.53.53 0 0 0 .266.459l5.192 2.998-1.802 1.04-4.283-2.472a5.004 5.004 0 0 1-2.133-4.8zm14.64 2.873-5.193-2.999 1.802-1.04 4.282 2.472a5.004 5.004 0 0 1 2.134 4.8 4.98 4.98 0 0 1-2.76 2.257v-5.031a.53.53 0 0 0-.265-.459zm2.05-3.315l-.1-.06-4.255-2.456a.53.53 0 0 0-.531 0l-5.193 2.999V6.936l4.282-2.472a4.994 4.994 0 0 1 5.181.5 4.988 4.988 0 0 1 .616 3.571zm-9.742 4.148 2.37-1.368 2.37 1.368v2.737l-2.37 1.368-2.37-1.368z"/>
  </svg>
);

export const GeminiLogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="Google Gemini logo">
    <path d="M12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24Z" />
  </svg>
);

export const DeepSeekLogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="DeepSeek logo">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 2.22.724 4.27 1.95 5.932l-.934 3.036 3.14-.882A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
  </svg>
);

export const MetaLogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="Meta logo">
    <path d="M16.924 6.09c-1.583 0-2.903.88-3.81 2.023-.907-1.143-2.227-2.023-3.81-2.023-2.955 0-5.304 2.456-5.304 5.91 0 4.195 3.376 7.896 6.84 9.897.68.393 1.54.603 2.274.603.734 0 1.594-.21 2.274-.603 3.464-2.001 6.84-5.702 6.84-9.897 0-3.454-2.35-5.91-5.304-5.91zm-7.62 10.378c-2.47-1.62-4.14-4.22-4.14-6.468 0-2.14 1.34-3.59 3.04-3.59 1.43 0 2.65.98 3.19 2.46.22.61.34 1.28.34 1.98 0 .69-.12 1.36-.34 1.97-.54 1.48-1.76 2.46-3.19 2.46-.29 0-.6-.05-.9-.18l-.19-.07.05-.57zm9.33-6.468c0 2.248-1.67 4.848-4.14 6.468-.3.13-.61.18-.9.18-1.43 0-2.65-.98-3.19-2.46-.22-.61-.34-1.28-.34-1.97 0-.7.12-1.37.34-1.98.54-1.48 1.76-2.46 3.19-2.46 1.7 0 3.04 1.45 3.04 3.59v.65l-.01.58z"/>
  </svg>
);

export const renderModelBadge = (modelId?: string, className = "w-3.5 h-3.5") => {
  const norm = (modelId || '').toLowerCase();
  if (norm.includes('claude') || norm.includes('anthropic')) {
    return <AnthropicLogo className={className} />;
  }
  if (norm.includes('openai') || norm.includes('gpt') || norm.includes('codex')) {
    return <OpenAILogo className={className} />;
  }
  if (norm.includes('deepseek')) {
    return <DeepSeekLogo className={className} />;
  }
  if (norm.includes('meta') || norm.includes('llama')) {
    return <MetaLogo className={className} />;
  }
  return <GeminiLogo className={className} />;
};

export const getModelBadgeDetails = (modelId?: string) => {
  const norm = (modelId || '').toLowerCase();
  if (norm.includes('claude') || norm.includes('anthropic')) {
    return {
      provider: 'Anthropic',
      modelName: 'Claude 3.7 Sonnet',
      badgeClass: 'text-amber-800 dark:text-amber-300 bg-amber-500/10 border-amber-500/30',
      logo: <AnthropicLogo className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />,
      activeLabel: 'Claude Active',
    };
  }
  if (norm.includes('openai') || norm.includes('gpt') || norm.includes('codex')) {
    return {
      provider: 'OpenAI',
      modelName: 'GPT-4o Codex',
      badgeClass: 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
      logo: <OpenAILogo className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />,
      activeLabel: 'OpenAI Active',
    };
  }
  if (norm.includes('deepseek')) {
    return {
      provider: 'DeepSeek',
      modelName: 'DeepSeek R1',
      badgeClass: 'text-blue-800 dark:text-blue-300 bg-blue-500/10 border-blue-500/30',
      logo: <DeepSeekLogo className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300" />,
      activeLabel: 'DeepSeek Active',
    };
  }
  if (norm.includes('meta') || norm.includes('llama')) {
    return {
      provider: 'Meta',
      modelName: 'Llama 3.3',
      badgeClass: 'text-sky-800 dark:text-sky-300 bg-sky-500/10 border-sky-500/30',
      logo: <MetaLogo className="w-3.5 h-3.5 text-sky-700 dark:text-sky-300" />,
      activeLabel: 'Meta Active',
    };
  }
  return {
    provider: 'Google',
    modelName: 'Gemini 3.8 Flash',
    badgeClass: 'text-purple-800 dark:text-purple-300 bg-purple-500/10 border-purple-500/30',
    logo: <GeminiLogo className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />,
    activeLabel: 'Gemini Active',
  };
};
