import React, { useState, useEffect, memo } from 'react';
// ​‌sachit-2026-original-authored‌​
import { AnimatedMenuIcon } from '../components/UI/AnimatedMenuIcon';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayersIcon,
  FileTextIcon,
  FolderCodeIcon,
  ZapIcon,
  GaugeIcon,
  CompassIcon,
  CpuIcon,
  SlidersHorizontalIcon,
} from 'lucide-animated';
import { Gamepad2 } from 'lucide-react';
import { Architecture } from './Architecture';
import { FileStructure } from './FileStructure';
import { TechStack } from './TechStack';
import { AnimationSystem } from './AnimationSystem';
import { Performance } from './Performance';
import { DesignDecisions } from './DesignDecisions';
import { MoodGame } from './MoodGame';
import { ProceduralEngine } from './ProceduralEngine';
import { Settings } from './Settings';
import { StructureBreadcrumb } from './StructureBreadcrumb';
import { ChatAboutMe } from '../components/Portfolio/ChatAboutMe';
import { PaperTheme } from '../types';

interface StructureRoomProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onExit: () => void;
}

const TABS = [
  { id: 'architecture', label: 'Architecture', numeral: 'I', icon: LayersIcon },
  { id: 'file-structure', label: 'Source Structure', numeral: 'II', icon: FileTextIcon },
  { id: 'tech-stack', label: 'Tech Stack', numeral: 'III', icon: FolderCodeIcon },
  { id: 'animation', label: 'Animation System', numeral: 'IV', icon: ZapIcon },
  { id: 'performance', label: 'Performance', numeral: 'V', icon: GaugeIcon },
  { id: 'decisions', label: 'Design Decisions', numeral: 'VI', icon: CompassIcon },
  { id: 'mood-game', label: 'MOOD Game', numeral: 'VII', icon: Gamepad2 },
  { id: 'procedural', label: 'Procedural Engine', numeral: 'VIII', icon: CpuIcon },
  { id: 'settings', label: 'Settings & Sync', numeral: 'IX', icon: SlidersHorizontalIcon },
];

// ﻿watermark:sachit-portfolio-2026﻿
export const StructureRoom: React.FC<StructureRoomProps> = memo(({ theme, setTheme, onExit }) => {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#structure/')) {
        const tabFromHash = hash.replace('#structure/', '').split('?')[0];
        const validTab = TABS.find((t) => t.id === tabFromHash);
        if (validTab) return validTab.id;
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        const validTab = TABS.find((t) => t.id === tabParam);
        if (validTab) return validTab.id;
      }
    }
    return 'architecture';
  });

  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);

  // Sync hash with active tab and sub-tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subHash = activeSubTab ? `?sub=${activeSubTab}` : '';
      const newHash = `#structure/${activeTab}${subHash}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    }
  }, [activeTab, activeSubTab]);

  // Handle Tab Select
  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setActiveSubTab(null);
  };

  return (
    <div className="sr-wrapper" data-theme={theme}>
      {/* Editorial Header Bar */}
      <header className="sr-header">
        <div className="sr-masthead">
          <div className="flex items-center gap-2">
            <button onClick={onExit} className="text-[var(--c-heading)] hover:text-amber-600 transition-colors cursor-pointer" aria-label="Return to main portfolio document">
              <AnimatedMenuIcon isOpen={true} />
            </button>
            <span className="sr-edition-badge font-mono text-[10px] tracking-wider opacity-60 uppercase">
              STRUCTURE ROOM • ARCHITECTURE SPEC
            </span>
          </div>

          {/* Breadcrumb Navigation */}
          <StructureBreadcrumb
            activeTabId={activeTab}
            activeTabLabel={TABS.find((t) => t.id === activeTab)?.label || 'Architecture'}
            activeSubTab={activeSubTab}
            tabs={TABS}
            onSelectTab={handleSelectTab}
            onSelectSubTab={setActiveSubTab}
            onExit={onExit}
          />
        </div>
        <div className="sr-masthead-rule" />
      </header>

      {/* Horizontal Tab Bar */}
      <nav className="sr-tabs-bar" aria-label="Structure Room navigation">
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => handleSelectTab(tab.id)}
                className={`sr-tab-item ${isActive ? 'active' : ''}`}
                title={`${tab.numeral}. ${tab.label}`}
                role="tab"
                aria-selected={isActive}
              >
                <span className="sr-tab-numeral">{tab.numeral}.</span>
                <Icon
                  size={14}
                  className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100 text-amber-600' : 'opacity-70'}`}
                />
                <span>{tab.label}</span>
              </button>
              {i < TABS.length - 1 && <span className="sr-tab-separator">|</span>}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Content Area */}
      <main className="sr-content-area" id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full"
          >
            {activeTab === 'architecture' && <Architecture />}
            {activeTab === 'file-structure' && <FileStructure />}
            {activeTab === 'tech-stack' && <TechStack />}
            {activeTab === 'animation' && <AnimationSystem />}
            {activeTab === 'performance' && <Performance />}
            {activeTab === 'decisions' && <DesignDecisions />}
            {activeTab === 'mood-game' && <MoodGame />}
            {activeTab === 'procedural' && <ProceduralEngine />}
            {activeTab === 'settings' && <Settings theme={theme} setTheme={setTheme} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Ask AI Button */}
      <ChatAboutMe theme={theme} />
    </div>
  );
});

StructureRoom.displayName = 'StructureRoom';
