import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Search, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { TECH_GUIDES, TechGuide } from '../data/guidesData';
import { useAffiliate } from '../context/AffiliateContext';
import { useProducts } from '../context/ProductsContext';

export const TechGuidesSection: React.FC = () => {
  const { config } = useAffiliate();
  const { recordAffiliateClick } = useProducts();
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
    <section id="guides" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <span>Practical Engineering</span>
              <span aria-hidden="true">·</span>
              <span>100% Free Resources</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Tech Troubleshooting &amp; System Optimization
            </h2>
          </div>

          <p className="text-sm text-slate-600 max-w-md">
            Grounded in the original tech guides from mrxshahin. Zero fluff, fully copyable scripts, and verifiable step-by-step diagnostic workflows.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Guide Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">No troubleshooting guides match your search</h3>
            <p className="text-xs text-slate-500 mb-4">
              Try a different keyword or reset your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reset Guide Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setActiveGuide(guide)}
                className="group bg-slate-50 hover:bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-amber-700 uppercase tracking-wider text-[11px]">
                      {guide.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{guide.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-amber-600 transition-colors">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {guide.steps.length} Verified Action Steps
                  </span>
                  <span className="font-semibold text-slate-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Read Guide &amp; Scripts</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Guide Detail Modal / Reader */}
      {activeGuide && (
        <div
          onClick={() => setActiveGuide(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8"
          >
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-amber-700">{activeGuide.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeGuide.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>Updated {activeGuide.updatedAt}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {activeGuide.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveGuide(null)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors shrink-0"
                aria-label="Close guide"
              >
                ✕
              </button>
            </div>

            {/* Summary */}
            <p className="text-sm text-slate-600 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {activeGuide.summary}
            </p>

            {/* Steps Walkthrough */}
            <div className="space-y-6 mb-8">
              {activeGuide.steps.map((step, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <span className="font-mono text-amber-600 text-xs px-2 py-0.5 bg-amber-50 rounded">
                      {step.stepNumber}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {step.explanation}
                  </p>

                  {/* Code snippet if present */}
                  {step.codeSnippet && (
                    <div className="ml-8 mt-2 rounded-lg bg-slate-900 text-slate-200 p-3.5 text-xs font-mono relative overflow-x-auto border border-slate-800">
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                        <span>{step.codeLanguage || 'terminal'}</span>
                        <button
                          onClick={() => handleCopy(step.codeSnippet!, `${activeGuide.id}-${idx}`)}
                          className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
                      <pre className="text-emerald-300 whitespace-pre font-mono">
                        {step.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Takeaway */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 mb-6">
              <strong className="block mb-1 text-emerald-900">Key Takeaway:</strong>
              {activeGuide.keyTakeaway}
            </div>

            {/* Contextual Automated Affiliate Partner Recommendation */}
            <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  Recommended Tested Solution
                </div>
                <div className="text-xs font-bold text-white">
                  {activeGuide.category === 'Web & SEO'
                    ? 'Hostinger Business Cloud & Free Domain (78% Off)'
                    : activeGuide.category === 'Network & WiFi'
                    ? 'NordVPN Threat Protection & High-Speed Meshnet (72% Off)'
                    : 'Amazon Verified Creator Gear Special (Prime Fast Shipping)'}
                </div>
                <p className="text-[11px] text-slate-300">
                  {activeGuide.category === 'Web & SEO'
                    ? '1-click migration from WordPress or legacy platforms with free SSL and NVMe SSD speeds.'
                    : activeGuide.category === 'Network & WiFi'
                    ? 'Audited zero-logs and encrypted DNS to fix ISP packet filtering and jitter.'
                    : 'Curated ergonomic hardware tested for heavy workflow sessions and zero latency.'}
                </p>
              </div>

              <a
                href={
                  activeGuide.category === 'Web & SEO'
                    ? `https://www.hostinger.com/web-hosting?REFERRALCODE=${config.hostingerId}`
                    : activeGuide.category === 'Network & WiFi'
                    ? `https://nordvpn.com/pricing/?aff=${config.vpnPartnerId}`
                    : 'https://link.amazon/B0ae4X6pk'
                }
                target="_blank"
                rel="noreferrer noopener sponsored"
                onClick={() => recordAffiliateClick()}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>
                  {activeGuide.category === 'Web & SEO'
                    ? 'Claim Hostinger Deal'
                    : activeGuide.category === 'Network & WiFi'
                    ? 'Claim NordVPN Deal'
                    : 'Claim Amazon Partner Deal'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveGuide(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
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
