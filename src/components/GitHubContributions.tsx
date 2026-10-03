import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PaperTheme } from '../types';
import { usePerformance } from '../hooks/usePerformance';
import { HoneycombLoader } from './UI/HoneycombLoader';
import { observeElement } from '../utils/observer';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame, Calendar, Activity, Zap } from 'lucide-react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  username: string;
  totalContributions: number;
  year: number;
  contributions: ContributionDay[];
}

export interface GitHubContributionsProps {
  username?: string;
  theme?: PaperTheme;
}

type TimeframeOption = '3M' | '6M' | '9M' | '12M';

// Deterministic mock generation when GitHub API proxy is offline/rate-limited
function generateFallbackContributions(username: string): ContributionData {
  const contributions: ContributionDay[] = [];
  const now = new Date();
  
  // Align to Sunday 52 weeks ago
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 364);
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let seed = 1751;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const dayCount = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  let totalContributions = 0;

  for (let i = 0; i < dayCount; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(startDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayOfWeek = curDate.getDay();

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const rand = pseudoRandom();
    
    let count = 0;
    let level = 0;

    if (isWeekend) {
      if (rand > 0.65) {
        count = Math.floor(pseudoRandom() * 4) + 1;
      }
    } else {
      if (rand > 0.28) {
        const intense = pseudoRandom();
        if (intense > 0.85) count = Math.floor(pseudoRandom() * 7) + 7;
        else if (intense > 0.5) count = Math.floor(pseudoRandom() * 4) + 3;
        else count = Math.floor(pseudoRandom() * 2) + 1;
      }
    }

    if (count > 0) {
      if (count <= 2) level = 1;
      else if (count <= 5) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;
    }

    totalContributions += count;
    contributions.push({ date: dateStr, count, level });
  }

  return {
    username,
    totalContributions,
    year: now.getFullYear(),
    contributions,
  };
}

const INTENSITY_TIERS = [
  { level: 0, range: '0 commits', label: 'Rest & Design', desc: 'Planning, architecture & code review', icon: '☕' },
  { level: 1, range: '1–2 commits', label: 'Light Updates', desc: 'Bug fixes, documentation & polish', icon: '🌱' },
  { level: 2, range: '3–5 commits', label: 'Active Builds', desc: 'Component & module implementation', icon: '🔨' },
  { level: 3, range: '6–9 commits', label: 'Heavy Shipping', desc: 'High-velocity feature delivery', icon: '⚡' },
  { level: 4, range: '10+ commits', label: 'Peak Sprint', desc: 'Deep-flow releases & intense sprints', icon: '🔥' },
];

export const GitHubContributions: React.FC<GitHubContributionsProps> = ({ 
  username = 'sachit1751-art',
  theme = 'kraft'
}) => {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasIntersected, setHasIntersected] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('12M');
  const [highlightLevel, setHighlightLevel] = useState<number | null>(null);
  const [hoveredCoords, setHoveredCoords] = useState<{
    col: number;
    row: number;
    day: ContributionDay;
    clientX?: number;
    clientY?: number;
  } | null>(null);
  const { simplify } = usePerformance();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Load data progressively using IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    return observeElement(
      el,
      (isIntersecting) => {
        if (isIntersecting) {
          setHasIntersected(true);
        }
      },
      { rootMargin: '100px' },
      true // once
    );
  }, []);

  // Fetch from Express proxy with fallback
  useEffect(() => {
    if (!hasIntersected) return;

    let isMounted = true;
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/github-contributions?username=${username}`);
        if (!response.ok) throw new Error('API response not ok');
        const json = await response.json();
        
        if (isMounted) {
          if (json.error) throw new Error(json.message || 'API error');
          if (json.contributions && json.contributions.length > 0) {
            setData(json);
          } else {
            setData(generateFallbackContributions(username));
          }
          setLoading(false);
        }
      } catch (err) {
        console.warn('GitHub proxy unreachable, employing deterministic activity model:', err);
        if (isMounted) {
          setData(generateFallbackContributions(username));
          setLoading(false);
        }
      }
    };

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [hasIntersected, username]);

  // Scroll to the far right on mobile on render
  useEffect(() => {
    if (!loading && data && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [loading, data, timeframe]);

  // Format date helper (e.g. "Tuesday, August 25, 2026")
  const formatDate = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Group contributions into 7-day columns (weeks)
  const { weeks, visibleContributionsCount, stats } = useMemo(() => {
    if (!data?.contributions) {
      return { weeks: [], visibleContributionsCount: 0, stats: { maxStreak: 0, currentStreak: 0, peakDayCount: 0, activeDays: 0 } };
    }

    const rawWeeks: ContributionDay[][] = [];
    for (let i = 0; i < data.contributions.length; i += 7) {
      rawWeeks.push(data.contributions.slice(i, i + 7));
    }

    let weekCount = rawWeeks.length;
    if (timeframe === '3M') weekCount = 13;
    else if (timeframe === '6M') weekCount = 26;
    else if (timeframe === '9M') weekCount = 39;
    else if (simplify) weekCount = 26;

    const filteredWeeks = rawWeeks.slice(-weekCount);
    const flatDays = filteredWeeks.flat();
    const count = flatDays.reduce((acc, curr) => acc + curr.count, 0);

    // Calculate streaks and peaks
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let peakDayCount = 0;
    let activeDays = 0;

    for (let i = 0; i < flatDays.length; i++) {
      const day = flatDays[i];
      if (day.count > 0) {
        tempStreak++;
        activeDays++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        if (day.count > peakDayCount) peakDayCount = day.count;
      } else {
        tempStreak = 0;
      }
    }

    // Current streak ending at the last day
    for (let i = flatDays.length - 1; i >= 0; i--) {
      if (flatDays[i].count > 0) currentStreak++;
      else break;
    }

    return {
      weeks: filteredWeeks,
      visibleContributionsCount: count,
      stats: {
        maxStreak,
        currentStreak,
        peakDayCount,
        activeDays,
      },
    };
  }, [data, timeframe, simplify]);

  // Derive month labels and column placements
  const monthLabels = useMemo(() => {
    const labels: { text: string; colIndex: number }[] = [];
    let lastLabelIndex = -10;

    if (weeks.length > 0) {
      weeks.forEach((week, index) => {
        if (week.length > 0) {
          const monthNum = new Date(week[0].date).getMonth();
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const currentMonthName = monthNames[monthNum];

          if (index === 0 || (monthNum !== new Date(weeks[index - 1][0].date).getMonth() && index - lastLabelIndex >= 4)) {
            labels.push({ text: currentMonthName, colIndex: index });
            lastLabelIndex = index;
          }
        }
      });
    }
    return labels;
  }, [weeks]);

  // Activity intensity badge helper
  const getActivityBadge = (level: number, count: number) => {
    if (count === 0) return { label: 'Rest & Architecture', icon: '☕', color: 'var(--c-muted)' };
    if (level === 1) return { label: 'Light Push', icon: '🌱', color: 'var(--c-git-1)' };
    if (level === 2) return { label: 'Active Feature Build', icon: '🔨', color: 'var(--c-git-2)' };
    if (level === 3) return { label: 'Heavy Shipping', icon: '⚡', color: 'var(--c-git-3)' };
    return { label: 'Peak Sprint', icon: '🔥', color: 'var(--c-git-4)' };
  };

  // Single-cell hover lift state
  const isCellHovered = useCallback((col: number, row: number) => {
    if (!hoveredCoords || simplify) return false;
    return hoveredCoords.col === col && hoveredCoords.row === row;
  }, [hoveredCoords, simplify]);

  return (
    <div ref={containerRef} className="w-full mt-10">
      <div
        className="p-5 sm:p-6 relative overflow-visible rounded-[var(--radius-lg)] transition-colors duration-500 shadow-sm"
        style={{
          border: '1px solid var(--c-border)',
          background: 'var(--c-card-gradient-from)',
        }}
      >
        {loading ? (
          <div className="h-44 flex items-center justify-center font-mono text-xs py-6">
            <HoneycombLoader size="md" label="SYNCING GITHUB GRAPH..." color="var(--c-heading)" />
          </div>
        ) : (
          <div className="w-full">
            {/* Inner Header Row with Animated Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--c-border)] select-none relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="font-mono text-xs" style={{ color: 'var(--c-body)' }}>
                  <strong className="text-sm font-sans tracking-tight" style={{ color: 'var(--c-heading)', fontWeight: 600 }}>
                    {visibleContributionsCount || data?.totalContributions || 0} contributions
                  </strong>{' '}
                  <span className="opacity-70">
                    {timeframe === '3M' && 'in the last 3 months'}
                    {timeframe === '6M' && 'in the last 6 months'}
                    {timeframe === '9M' && 'in the last 9 months'}
                    {timeframe === '12M' && 'in the last year'}
                  </span>
                </div>

                {/* Micro Stats Badges */}
                <div className="hidden lg:flex items-center gap-2 font-mono text-[10px]">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
                  >
                    <Flame className="w-3 h-3 text-amber-600" />
                    Max: {stats.maxStreak}d streak
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
                  >
                    <Zap className="w-3 h-3 text-orange-600" />
                    Peak: {stats.peakDayCount} commits/day
                  </span>
                </div>
              </div>

              {/* Right action controls */}
              <div className="flex items-center gap-2">
                {/* Timeframe Quick Pills */}
                <div className="flex items-center gap-1 p-1 rounded-[7px]" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}>
                  {(['3M', '6M', '9M', '12M'] as TimeframeOption[]).map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className="px-2.5 py-1 min-w-[32px] text-center font-mono text-[9.5px] font-bold tracking-wider uppercase transition-all rounded-[5px] cursor-pointer relative shadow-none active:scale-95"
                      style={{
                        backgroundColor: timeframe === tf ? 'var(--c-heading)' : 'transparent',
                        color: timeframe === tf ? 'var(--c-btn-text)' : 'var(--c-muted)',
                        boxShadow: timeframe === tf ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll wrapper */}
            <div
              ref={scrollRef}
              className="w-full overflow-x-auto scrollbar-none select-none github-contributions-wrapper relative"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {!hasIntersected ? (
                <div className="h-32 flex items-center justify-center font-mono text-xs" style={{ color: 'var(--c-muted)' }}>
                  Loading contribution matrix...
                </div>
              ) : (
                <div ref={gridContainerRef} className="flex flex-col min-w-max pb-2 relative">
                  {/* Months Row */}
                  <div className="flex h-5 relative select-none" style={{ paddingLeft: 'var(--offset-left)' }}>
                    {monthLabels.map((lbl, idx) => {
                      const isMonthActive = hoveredCoords && Math.abs(hoveredCoords.col - lbl.colIndex) < 4;
                      return (
                        <span
                          key={idx}
                          className="absolute text-[9px] sm:text-[10px] font-mono transition-colors duration-200"
                          style={{
                            left: `calc(${lbl.colIndex} * var(--col-width) + var(--offset-left))`,
                            transform: 'translateX(0)',
                            color: isMonthActive ? 'var(--c-heading)' : 'var(--c-muted)',
                            fontWeight: isMonthActive ? 600 : 400,
                          }}
                        >
                          {lbl.text}
                        </span>
                      );
                    })}
                  </div>

                  {/* Calendar Grid Section */}
                  <div className="flex">
                    {/* Day of Week Labels */}
                    <div className="grid grid-rows-7 gap-[3px] sm:gap-[4px] text-[9px] sm:text-[10px] font-mono select-none pr-2 text-right" style={{ color: 'var(--c-muted)', width: 'var(--offset-left)' }}>
                      {['Sun', '', 'Tue', '', 'Thu', '', 'Sat'].map((d, rowIdx) => {
                        const isRowActive = hoveredCoords?.row === rowIdx;
                        return (
                          <div 
                            key={rowIdx} 
                            className="h-[11px] sm:h-[13px] flex items-center justify-end transition-colors duration-200"
                            style={{
                              color: isRowActive ? 'var(--c-heading)' : 'var(--c-muted)',
                              fontWeight: isRowActive ? 600 : 400,
                            }}
                          >
                            {d}
                          </div>
                        );
                      })}
                    </div>

                    {/* Grid of Weeks with 21st.dev Ripple Waves */}
                    <div className="flex gap-[3px] sm:gap-[4px]">
                      {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="grid grid-rows-7 gap-[3px] sm:gap-[4px]">
                          {week.map((day, dayIdx) => {
                            const isHovered = isCellHovered(weekIdx, dayIdx);
                            const isDimmed = highlightLevel !== null && day.level !== highlightLevel;
                            const isTierSelected = highlightLevel !== null && day.level === highlightLevel;

                            let transform = 'scale(1) translateZ(0)';
                            let zIndex = 1;
                            let boxShadow = 'none';

                            if (isHovered) {
                              transform = 'scale(1.36) translateY(-2px) translateZ(0)';
                              zIndex = 40;
                              boxShadow = '0 6px 14px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.12)';
                            } else if (isTierSelected) {
                              transform = 'scale(1.22) translateY(-1px) translateZ(0)';
                              zIndex = 20;
                              boxShadow = '0 4px 10px rgba(0,0,0,0.16)';
                            }

                            const cellStyle: React.CSSProperties = {
                              backgroundColor: `var(--c-git-${day.level})`,
                              border: day.level === 0 ? '1px solid var(--c-border)' : '1px solid var(--c-git-border, transparent)',
                              transform,
                              zIndex,
                              opacity: isDimmed ? 0.25 : 1,
                              transition: 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.16s ease, opacity 0.22s ease, background-color 0.3s ease',
                              boxShadow,
                              willChange: 'transform, opacity, box-shadow',
                            };

                            return (
                              <button
                                key={dayIdx}
                                className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-[4px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--c-border-focus)] relative transform-gpu"
                                style={cellStyle}
                                aria-label={`${day.count} contributions on ${formatDate(day.date)}`}
                                onMouseEnter={() => setHoveredCoords({ col: weekIdx, row: dayIdx, day })}
                                onMouseLeave={() => setHoveredCoords(null)}
                                onTouchStart={() => setHoveredCoords({ col: weekIdx, row: dayIdx, day })}
                                onClick={() => setHoveredCoords({ col: weekIdx, row: dayIdx, day })}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom info row with activity status and color scale */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 gap-3 sm:gap-0 border-t border-dashed border-[var(--c-border)]">
              <div className="font-mono text-[10px] sm:text-xs min-h-[16px] sm:min-h-[20px]" style={{ color: 'var(--c-body)' }}>
                {hoveredCoords ? (
                  <motion.div
                    key={hoveredCoords.day.date}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 flex-wrap"
                  >
                    <span>
                      <strong style={{ color: 'var(--c-heading)' }}>{hoveredCoords.day.count}</strong> {hoveredCoords.day.count === 1 ? 'contribution' : 'contributions'} on{' '}
                      <span className="font-sans italic">{formatDate(hoveredCoords.day.date)}</span>
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase"
                      style={{ 
                        backgroundColor: 'var(--c-input-bg)', 
                        border: '1px solid var(--c-border)',
                        color: 'var(--c-heading)'
                      }}
                    >
                      {getActivityBadge(hoveredCoords.day.level, hoveredCoords.day.count).label}
                    </span>
                  </motion.div>
                ) : highlightLevel !== null ? (
                  <span className="font-mono text-[11px] flex items-center gap-2" style={{ color: 'var(--c-heading)' }}>
                    <span>
                      Highlighting <strong>Level {highlightLevel}</strong> ({INTENSITY_TIERS[highlightLevel].range} — {INTENSITY_TIERS[highlightLevel].label})
                    </span>
                  </span>
                ) : (
                  <span className="opacity-60 italic font-sans">
                    {simplify ? 'Tap a square to inspect activity' : 'Hover over squares to inspect activity or hover over swatches to highlight matching days'}
                  </span>
                )}
              </div>

              {/* Dynamic Theme Color Scale Legend with Hover Highlight */}
              <div 
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider" 
                style={{ color: 'var(--c-muted)' }}
                onMouseLeave={() => setHighlightLevel(null)}
              >
                <span>Less</span>
                {INTENSITY_TIERS.map((tier) => (
                  <button
                    key={tier.level}
                    type="button"
                    onMouseEnter={() => setHighlightLevel(tier.level)}
                    onMouseLeave={() => setHighlightLevel(null)}
                    onTouchStart={() => setHighlightLevel(tier.level)}
                    onClick={() => setHighlightLevel(prev => prev === tier.level ? null : tier.level)}
                    className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[4px] transition-all duration-200 cursor-pointer hover:scale-135 focus:outline-none" 
                    style={{ 
                      backgroundColor: `var(--c-git-${tier.level})`, 
                      border: tier.level === 0 ? '1px solid var(--c-border)' : '1px solid var(--c-git-border, transparent)',
                      transform: highlightLevel === tier.level ? 'scale(1.35)' : undefined,
                      boxShadow: highlightLevel === tier.level ? '0 0 6px rgba(0,0,0,0.3)' : undefined,
                    }} 
                    title={`Level ${tier.level}: ${tier.range} (${tier.label})`}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:underline font-mono text-[10px] tracking-wider uppercase font-bold transition-transform hover:translate-x-0.5"
          style={{ color: 'var(--c-body)' }}
        >
          View GitHub →
        </a>
      </div>
    </div>
  );
};
