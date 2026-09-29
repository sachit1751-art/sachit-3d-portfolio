import React, { useState, useRef, useEffect } from 'react';
// ​sachit-2026-original-authored​
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRightIcon, HomeIcon, ChevronDownIcon, CheckIcon } from 'lucide-animated';

export interface BreadcrumbTab {
  id: string;
  label: string;
  numeral: string;
  icon?: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
}

interface StructureBreadcrumbProps {
  activeTabId: string;
  activeTabLabel?: string;
  activeSubTab?: string | null;
  tabs?: BreadcrumbTab[];
  onSelectTab: (tabId: string) => void;
  onSelectSubTab?: (subTabId: string | null) => void;
  onExit: () => void;
  onResetToRootTab?: () => void;
}

export const StructureBreadcrumb: React.FC<StructureBreadcrumbProps> = ({
  activeTabId,
  activeTabLabel,
  tabs = [],
  onSelectTab,
  onExit,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav aria-label="Architecture Breadcrumb" className="text-xs font-mono flex items-center gap-1.5 flex-wrap">
      {/* Root Portfolio Link */}
      <button
        onClick={onExit}
        className="opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1 hover:underline cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 -ml-1"
        title="Return to Main Document Page"
      >
        <HomeIcon size={12} className="opacity-80" />
        <span>Document</span>
      </button>

      <ChevronRightIcon size={12} className="opacity-40 flex-shrink-0" />

      {/* Structure Room Title */}
      <button
        onClick={onExit}
        className="opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1 hover:underline cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
        title="Structure Room Home"
      >
        <span>Structure</span>
      </button>

      {/* Active Sub-section Selector Dropdown */}
      {activeTabId && (
        <div className="relative inline-flex items-center gap-1.5 flex-shrink-0" ref={dropdownRef}>
          <ChevronRightIcon size={12} className="opacity-40 flex-shrink-0" />

          {(() => {
            const activeTabItem = tabs.find((t) => t.id === activeTabId);
            const ActiveIcon = activeTabItem?.icon;
            return (
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="font-bold py-0.5 px-2 rounded flex-shrink-0 flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-110"
                style={{
                  color: 'var(--c-heading)',
                  backgroundColor: 'var(--c-input-bg)',
                  border: '1px solid var(--c-border-hover)',
                }}
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                aria-current="page"
                title="Click to quickly jump to another sub-section"
              >
                {ActiveIcon ? (
                  <ActiveIcon size={14} className="flex-shrink-0 text-amber-600" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: 'var(--c-dot)' }} />
                )}
                <span>{activeTabLabel}</span>
                <ChevronDownIcon size={12} className={`opacity-70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            );
          })()}

          {/* Quick Sub-section Selector Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 top-full mt-1.5 z-50 min-w-[210px] py-1.5 rounded-md shadow-lg border"
                style={{
                  backgroundColor: 'var(--c-card)',
                  borderColor: 'var(--c-border-hover)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                }}
                role="listbox"
                aria-label="Structure Sub-sections"
              >
                <div className="px-2.5 py-1 text-[9px] font-mono opacity-50 uppercase tracking-widest border-b border-[var(--c-border)] mb-1">
                  Architecture Sub-sections
                </div>
                {tabs.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTab(t.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer ${
                        activeTabId === t.id
                          ? 'bg-[var(--c-input-bg)] text-[var(--c-heading)] font-bold'
                          : 'text-[var(--c-body)] hover:bg-[var(--c-input-bg)] hover:text-[var(--c-heading)]'
                      }`}
                      role="option"
                      aria-selected={activeTabId === t.id}
                    >
                      <span className="flex items-center gap-2">
                        {Icon && <Icon size={14} className="opacity-80 flex-shrink-0 text-amber-600" />}
                        <span className="opacity-50 text-[10px]">{t.numeral}.</span>
                        <span>{t.label}</span>
                      </span>
                      {activeTabId === t.id && <CheckIcon size={12} className="text-amber-500" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </nav>
  );
};
