import React, { useState } from 'react';
import { Quote, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { THOUGHTS } from '../data/quotesData';

export const ThoughtsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentThought = THOUGHTS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % THOUGHTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + THOUGHTS.length) % THOUGHTS.length);
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${currentThought.quote}" — ${currentThought.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="thoughts"
      className="py-12 sm:py-16 bg-slate-100/80 dark:bg-slate-900 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            <span>Mindset &amp; Philosophy</span>
            <span aria-hidden="true">·</span>
            <span>Camellia Shop Thoughts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
            Clarity, Discipline &amp; Autonomous Thinking
          </h2>
        </div>

        {/* Dynamic Thought Carousel Card */}
        <div className="relative bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 sm:p-8 lg:p-12 shadow-xl backdrop-blur-xs">
          <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500/40 dark:text-amber-400/30 mb-4" />

          <blockquote className="text-lg sm:text-xl lg:text-2xl font-serif text-slate-800 dark:text-slate-100 leading-relaxed mb-6 italic">
            &quot;{currentThought.quote}&quot;
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                {currentThought.author}
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-400/90 mt-0.5">
                Focus Pillar: {currentThought.category}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopyQuote}
                className="px-3 min-h-[40px] py-1.5 text-xs bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy quote"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Thought</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrev}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
                aria-label="Previous quote"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 px-1">
                0{currentIndex + 1} / 0{THOUGHTS.length}
              </span>

              <button
                onClick={handleNext}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
                aria-label="Next quote"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-slate-800 dark:text-slate-200">Action Takeaway: </strong>
            {currentThought.takeaway}
          </div>
        </div>
      </div>
    </section>
  );
};
