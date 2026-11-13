import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, TrendingUp, ShoppingCart, Heart, ExternalLink } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCharity } from '../context/CharityContext';
import mrsHeroWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';

interface HeroProps {
  onExploreStore: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreStore, onOpenCalculator }) => {
  const { setSelectedCategory, amazonStoreUrl } = useProducts();
  const { selectedCause, setIsCharityModalOpen, charityEnabled, pledgePercentage } = useCharity();

  const handleBrowseAllAccessories = () => {
    setSelectedCategory('All Departments (Mega Store)');
    onExploreStore();
  };

  return (
    <section
      id="hero"
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white pt-6 sm:pt-8 pb-10 sm:pb-14 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Main 2-Column Balanced Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center py-2 sm:py-4 min-w-0">
            {/* Editorial Lead Kicker */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400 mb-3">
              <span>Universal Amazon Megastore</span>
              <span aria-hidden="true">·</span>
              <span>Prime Fast Delivery</span>
              <span aria-hidden="true">·</span>
              <span>All Accessories Collection</span>
            </div>

            {/* Fluid Main Headline */}
            <h1 className="text-[clamp(1.65rem,3.6vw,3rem)] font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-5 leading-[1.14] [text-wrap:balance]">
              Shop Anything Just Like Amazon · Verified Prime Deals &amp; Modern Gear.
            </h1>

            {/* Body Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              Explore top-rated products across Electronics, Home, Kitchen, Computers, Audio, and Workspace Accessories. Enjoy official Amazon Prime 1-2 day express fulfillment, authentic warranties, and 30-day hassle-free returns.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <button
                onClick={handleBrowseAllAccessories}
                className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-3 text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Browse All Accessories</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreStore}
                className="w-full sm:w-auto min-h-[44px] px-5 py-3 text-sm font-bold text-white dark:text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-900 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Shop Megastore</span>
              </button>

              <div className="flex items-center gap-2.5 sm:contents">
                <button
                  onClick={onOpenCalculator}
                  className="flex-1 sm:flex-initial min-h-[44px] px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 sm:bg-transparent border border-slate-200 dark:border-slate-800 sm:border-transparent rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>ROI Calculator</span>
                </button>

                <a
                  href={amazonStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial min-h-[44px] px-4 py-3 text-sm font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 border border-amber-300 dark:border-amber-500/40 hover:border-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Amazon Store</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </a>
              </div>
            </div>

            {/* Simple Charity Support Option Card */}
            <div className="mb-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 fill-rose-500 dark:fill-rose-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-slate-900 dark:text-white font-bold flex flex-wrap items-center gap-1.5">
                    <span>Our Charity Support Pledge</span>
                    {charityEnabled && (
                      <span className="text-[10px] font-extrabold bg-rose-100 dark:bg-rose-500/30 text-rose-800 dark:text-rose-200 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-500/40">
                        {pledgePercentage}% Active
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                    Every purchase supports <strong className="text-slate-900 dark:text-slate-200">{selectedCause.name}</strong> at $0 extra cost to you.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCharityModalOpen(true)}
                className="min-h-[38px] px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer shrink-0 self-start sm:self-auto border border-slate-300 dark:border-slate-700"
              >
                Charity Details
              </button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Verified Zero-Fluff Methodology</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>Prime 1-2 Day Express Delivery &amp; Verified Tech Deals</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Asset */}
          <div className="lg:col-span-5 relative flex items-center min-w-0">
            <div className="w-full relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
              <img
                src={mrsHeroWorkspaceImg}
                alt="Camellia Shop High Performance Workspace"
                className="w-full h-60 sm:h-80 md:h-96 lg:h-full lg:min-h-[380px] object-cover"
              />
              {/* Subtle Scrim for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-white/95">
                  <span className="font-semibold text-white truncate">The Camellia Shop Creator Workspace Setup</span>
                  <span className="text-amber-300 font-mono tabular-nums shrink-0">4K Studio Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI / Proof Strip */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              $1.2M+
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Community Member Revenue</div>
            <p className="text-[11px] text-slate-500">Across 5 verified income playbooks</p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Affiliate Transparency</div>
            <p className="text-[11px] text-slate-500">Direct creator links &amp; FTC compliance</p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              4.9 / 5.0
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Average Hardware Rating</div>
            <p className="text-[11px] text-slate-500">From 14,000+ verified customer reviews</p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              24-Hour
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Commission Window</div>
            <p className="text-[11px] text-slate-500">Cart spillover on full Amazon checkout</p>
          </div>
        </div>
      </div>
    </section>
  );
};
