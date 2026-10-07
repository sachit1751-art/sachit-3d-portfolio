import React, { useState, memo } from 'react';
import { PaperTheme } from '../../types';
import { ScrollReveal } from '../UI/ScrollReveal';
import { SectionHeader } from '../UI/SectionHeader';
import { Card } from '../UI/Card';
import { GitHubIcon } from '../UI/Icons';
import { GitHubContributions } from '../GitHubContributions';

const GITHUB_USERNAME = 'sachit1751-art';
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

interface GitHubSectionProps {
  theme?: PaperTheme;
}

export const GitHubSection = memo<GitHubSectionProps>(({ theme }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal>
      <section id="github" className="relative mb-20 pt-10" style={{ borderTop: '1px solid var(--c-border)' }}>
        <SectionHeader
          kicker="06. Open Source"
          title="GitHub Contributions"
          description="Real-time commits, repositories, and activity synced directly from GitHub."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-8">
            <Card className="p-6 sm:p-8 h-full flex flex-col justify-between">
              <p className="text-base sm:text-lg leading-relaxed font-sans mb-6" style={{ color: 'var(--c-body)' }}>
                I actively push code, build public projects, and experiment across full-stack applications, AI models, and developer tooling. Check out repositories and commit activity below.
              </p>
              
              {/* GitHub Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6" style={{ borderTop: '1px solid var(--c-border)' }}>
                <div>
                  <span className="block font-mono text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>Public Repos</span>
                  <span className="font-sans text-2xl font-bold" style={{ color: 'var(--c-heading)' }}>5+</span>
                </div>
                <div>
                  <span className="block font-mono text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>Stars Accrued</span>
                  <span className="font-sans text-2xl font-bold flex items-center gap-1" style={{ color: 'var(--c-heading)' }}>
                    2 <span style={{ color: '#EAB308' }}>★</span>
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>Recent Commits</span>
                  <span className="font-sans text-2xl font-bold" style={{ color: 'var(--c-heading)' }}>5+</span>
                </div>
                <div>
                  <span className="block font-mono text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>Primary Stack</span>
                  <span className="font-sans text-sm font-bold block truncate uppercase tracking-tight" style={{ color: 'var(--c-heading)' }}>TypeScript</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="block h-full relative overflow-hidden cursor-pointer outline-none rounded-[var(--radius-lg)] group"
              aria-label={`Visit ${GITHUB_USERNAME}'s GitHub profile`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
            >
              <Card
                className={`p-6 sm:p-8 h-full flex flex-col items-center justify-center relative rounded-[var(--radius-lg)] transition-all duration-200 min-h-[180px] ${
                  hovered ? 'bg-[var(--c-heading)] border-[var(--c-heading)]' : 'bg-[var(--c-surface)]'
                }`}
              >
                <div
                  className="flex flex-col items-center text-center transition-all duration-200"
                  style={{
                    color: hovered ? 'var(--c-btn-text)' : 'var(--c-heading)',
                  }}
                >
                  <GitHubIcon className="w-10 h-10 mb-3" />
                  <span className="font-sans text-lg font-bold tracking-tight">@{GITHUB_USERNAME}</span>
                  <span className="font-mono text-xs uppercase tracking-wider mt-1 opacity-80 flex items-center gap-1">
                    View Profile <span>↗</span>
                  </span>
                </div>
              </Card>
            </a>
          </div>
        </div>

        {/* Dynamic GitHub Contribution Heatmap / Calendar */}
        <GitHubContributions username={GITHUB_USERNAME} theme={theme} />
      </section>
    </ScrollReveal>
  );
});

GitHubSection.displayName = 'GitHubSection';
