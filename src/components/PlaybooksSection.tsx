import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, DollarSign, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { PLAYBOOKS, Playbook } from '../data/playbooksData';

export const PlaybooksSection: React.FC = () => {
  const [expandedPlaybookId, setExpandedPlaybookId] = useState<string>(PLAYBOOKS[0].id);

  const toggleExpand = (id: string) => {
    setExpandedPlaybookId(expandedPlaybookId === id ? '' : id);
  };

  return (
    <section id="blueprints" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <span>Online Business Systems</span>
              <span aria-hidden="true">·</span>
              <span>Tested &amp; Documented</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Verified Digital Income Playbooks
            </h2>
          </div>

          <p className="text-sm text-slate-600 max-w-md">
            The core knowledge library curated by MRS Digital. Zero gimmicks: each framework breaks down exact startup capital, timelines, tools, and execution milestones.
          </p>
        </div>

        {/* Playbooks Accordion / Bento Cards */}
        <div className="space-y-4">
          {PLAYBOOKS.map((playbook, index) => {
            const isExpanded = expandedPlaybookId === playbook.id;

            return (
              <div
                key={playbook.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(playbook.id)}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-400">
                        0{index + 1}.
                      </span>
                      <span className="font-medium text-amber-700">{playbook.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>Capital: {playbook.startupCapital}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-semibold">{playbook.marginRate} Margin</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600">
                      {playbook.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {playbook.subtitle}
                    </p>
                  </div>

                  {/* Right Metric Quick Badges & Expand Trigger */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-slate-400">Target Monthly Potential</div>
                      <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                        {playbook.monthlyPotential}
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                    
                    {/* Overview & Mechanism */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-slate-500" />
                          <span>System Architecture</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {playbook.overview}
                        </p>
                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-700 font-medium">
                          <strong className="text-slate-900">Core Engine: </strong>
                          {playbook.coreMechanism}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>Recommended Tool Stack</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {playbook.toolsStack.map((tool, i) => (
                              <span
                                key={i}
                                className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/70 text-xs text-amber-900">
                          <span className="font-bold">MRS Field Insight: </span>
                          <span>{playbook.mrsTip}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sequential Milestones */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/80">
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Step-by-Step Execution Sequence
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {playbook.milestones.map((m, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-800">{m.step}</span>
                              <span className="text-slate-400 font-mono">{m.duration}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
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
