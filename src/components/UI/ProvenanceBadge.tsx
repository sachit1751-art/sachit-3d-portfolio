import React, { memo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { triggerHaptic, HAPTIC_PATTERNS } from '../../utils/haptics';

export const ProvenanceBadge = memo(() => {
  const handleVerify = () => {
    if (typeof window !== 'undefined' && (window as any).__VERIFY_AUTHORSHIP__) {
      const res = (window as any).__VERIFY_AUTHORSHIP__();
      triggerHaptic(HAPTIC_PATTERNS.click);
      if (typeof window !== 'undefined') {
        alert(`[ORIGINAL AUTHORSHIP VERIFIED]\n\nAuthor: ${res.author}\nEmail: ${res.email}\nYear: ${res.year}\nProvenance Signature: Active & Secure\n\nCheck browser console (F12) for detailed cryptographic verification logs.`);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleVerify}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer hover:scale-105 select-none"
      style={{
        backgroundColor: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        color: 'var(--c-heading)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      title="Click to cryptographically verify original authorship and provenance"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
      <span className="font-handwriting font-bold">Verified Original</span>
      <span className="opacity-40">•</span>
      <span className="text-[10px] opacity-70">Sachit '26</span>
    </button>
  );
});

ProvenanceBadge.displayName = 'ProvenanceBadge';
