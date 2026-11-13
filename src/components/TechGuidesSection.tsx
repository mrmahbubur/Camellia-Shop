import React, { useState, useEffect } from 'react';
import { Copy, Check, Search, BookOpen, Clock, ChevronRight, X } from 'lucide-react';
import { TECH_GUIDES, TechGuide } from '../data/guidesData';

export const TechGuidesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGuide, setActiveGuide] = useState<TechGuide | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  useEffect(() => {
    if (!activeGuide) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveGuide(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeGuide]);

  const categories = ['All', 'Windows', 'Network & WiFi', 'Android', 'Web & SEO'];

  const filteredGuides = TECH_GUIDES.filter((guide) => {
    const matchCategory = selectedCategory === 'All' || guide.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => {
      setCopiedSnippet(null);
    }, 2000);
  };

  return (
    <section
      id="guides"
      className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span>Practical Engineering</span>
              <span aria-hidden="true">·</span>
              <span>100% Free Resources</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Tech Troubleshooting &amp; System Optimization
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
            Grounded in the original tech guides from mrxshahin. Zero fluff, fully copyable scripts, and verifiable step-by-step diagnostic workflows.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 min-h-[38px] py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCategory === c
                    ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides or commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[40px] pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>
        </div>

        {/* Guide Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 sm:p-8">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
              No troubleshooting guides match your search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Try a different keyword or reset your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 min-h-[40px] py-2 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Reset Guide Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setActiveGuide(guide)}
                className="group bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                      {guide.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{guide.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 dark:text-slate-500">
                    {guide.steps.length} Verified Action Steps
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
                    <span>Read Guide &amp; Scripts</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-amber-400" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guide Detail Modal */}
      {activeGuide && (
        <div
          onClick={() => setActiveGuide(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overscroll-contain"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90dvh] overflow-y-auto overscroll-contain shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{activeGuide.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeGuide.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>Updated {activeGuide.updatedAt}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {activeGuide.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveGuide(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0 cursor-pointer"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              {activeGuide.summary}
            </p>

            {/* Steps Walkthrough */}
            <div className="space-y-6 mb-8">
              {activeGuide.steps.map((step, idx) => (
                <div key={idx} className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <span className="font-mono text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-500/20 rounded shrink-0">
                      {step.stepNumber}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-0 sm:pl-8">
                    {step.explanation}
                  </p>

                  {step.codeSnippet && (
                    <div className="ml-0 sm:ml-8 mt-2 rounded-lg bg-slate-900 dark:bg-slate-950 text-slate-200 p-3.5 text-xs font-mono relative overflow-x-auto border border-slate-800">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                        <span>{step.codeLanguage || 'terminal'}</span>
                        <button
                          onClick={() => handleCopy(step.codeSnippet!, `${activeGuide.id}-${idx}`)}
                          className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded bg-slate-800/80"
                        >
                          {copiedSnippet === `${activeGuide.id}-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-emerald-300 whitespace-pre font-mono overflow-x-auto">
                        {step.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Takeaway */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/15 rounded-xl border border-emerald-200/80 dark:border-emerald-500/30 text-xs text-emerald-950 dark:text-emerald-200 mb-6">
              <strong className="block mb-1 text-emerald-900 dark:text-emerald-300">Key Takeaway:</strong>
              {activeGuide.keyTakeaway}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
              <button
                onClick={() => setActiveGuide(null)}
                className="px-5 min-h-[42px] py-2.5 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-amber-300 transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
