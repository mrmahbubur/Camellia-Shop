import React, { useState } from 'react';
import { Quote, Sparkles, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { THOUGHTS, ThoughtQuote } from '../data/quotesData';

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
    <section id="thoughts" className="py-16 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <span>Mindset &amp; Philosophy</span>
            <span aria-hidden="true">·</span>
            <span>MRS Digital Thoughts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white [text-wrap:balance]">
            Clarity, Discipline &amp; Autonomous Thinking
          </h2>
        </div>

        {/* Dynamic Thought Carousel Card */}
        <div className="relative bg-slate-800/80 rounded-2xl border border-slate-700/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xs">
          
          <Quote className="w-10 h-10 text-amber-400/30 mb-4" />

          {/* Quote Text */}
          <blockquote className="text-xl sm:text-2xl font-serif text-slate-100 leading-relaxed mb-6 italic">
            "{currentThought.quote}"
          </blockquote>

          {/* Author & Category */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-700">
            <div>
              <div className="text-sm font-bold text-white tracking-wide">
                {currentThought.author}
              </div>
              <div className="text-xs text-amber-400/90 mt-0.5">
                Focus Pillar: {currentThought.category}
              </div>
            </div>

            {/* Actions & Carousel Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyQuote}
                className="px-3 py-1.5 text-xs bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy quote"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
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
                className="p-2 bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Previous quote"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono tabular-nums text-slate-400 px-1">
                0{currentIndex + 1} / 0{THOUGHTS.length}
              </span>

              <button
                onClick={handleNext}
                className="p-2 bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Next quote"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Takeaway */}
          <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs text-slate-400">
            <strong className="text-slate-300">Action Takeaway: </strong>
            {currentThought.takeaway}
          </div>

        </div>

      </div>
    </section>
  );
};
