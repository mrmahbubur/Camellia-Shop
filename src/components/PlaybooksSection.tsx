import React, { useState, useEffect } from 'react';
import { Clock, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { PLAYBOOKS } from '../data/playbooksData';

interface PlaybooksSectionProps {
  selectedPlaybookId?: string | null;
}

export const PlaybooksSection: React.FC<PlaybooksSectionProps> = ({ selectedPlaybookId }) => {
  const [expandedPlaybookId, setExpandedPlaybookId] = useState<string>(PLAYBOOKS[0].id);

  useEffect(() => {
    if (selectedPlaybookId && PLAYBOOKS.some((p) => p.id === selectedPlaybookId)) {
      setExpandedPlaybookId(selectedPlaybookId);
    }
  }, [selectedPlaybookId]);

  const toggleExpand = (id: string) => {
    setExpandedPlaybookId(expandedPlaybookId === id ? '' : id);
  };

  return (
    <section
      id="blueprints"
      className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span>Online Business Systems</span>
              <span aria-hidden="true">·</span>
              <span>Tested &amp; Documented</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Verified Digital Income Playbooks
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
            The core knowledge library curated by Camellia Shop. Zero gimmicks: each framework breaks down exact startup capital, timelines, tools, and execution milestones.
          </p>
        </div>

        {/* Playbooks Accordion */}
        <div className="space-y-4">
          {PLAYBOOKS.map((playbook, index) => {
            const isExpanded = expandedPlaybookId === playbook.id;

            return (
              <div
                key={playbook.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(playbook.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(playbook.id);
                    }
                  }}
                  aria-expanded={isExpanded}
                  className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-slate-400 dark:text-slate-500">
                        0{index + 1}.
                      </span>
                      <span className="font-medium text-amber-700 dark:text-amber-400">{playbook.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>Capital: {playbook.startupCapital}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        {playbook.marginRate} Margin
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {playbook.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {playbook.subtitle}
                    </p>
                  </div>

                  {/* Right Metric Quick Badges & Expand Trigger */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">Target Monthly Potential</div>
                      <div className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        {playbook.monthlyPotential}
                      </div>
                    </div>

                    <div className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6 pt-3 sm:pt-4">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                        <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>System Architecture</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {playbook.overview}
                        </p>
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <strong className="text-slate-900 dark:text-white">Core Engine: </strong>
                          {playbook.coreMechanism}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Recommended Tool Stack</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {playbook.toolsStack.map((tool, i) => (
                              <span
                                key={i}
                                className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-mono"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-500/15 rounded-lg border border-amber-200/70 dark:border-amber-500/30 text-xs text-amber-900 dark:text-amber-200">
                          <span className="font-bold">Camellia Shop Insight: </span>
                          <span>{playbook.mrsTip}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sequential Milestones */}
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                        Step-by-Step Execution Sequence
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {playbook.milestones.map((m, i) => (
                          <div
                            key={i}
                            className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/70 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2 text-[11px]">
                              <span className="font-bold text-slate-800 dark:text-slate-100">{m.step}</span>
                              <span className="text-slate-400 dark:text-slate-500 font-mono shrink-0">{m.duration}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                              {m.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
