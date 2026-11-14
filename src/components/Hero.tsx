import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Package, BookOpen, ShoppingCart, ExternalLink } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { TECH_GUIDES } from '../data/guidesData';
import mrsHeroWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';

interface HeroProps {
  onExploreStore: () => void;
  onOpenGuides: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreStore, onOpenGuides }) => {
  const { setSelectedCategory, amazonStoreUrl, products } = useProducts();

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
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400 mb-3">
              <span>Curated Hardware Storefront</span>
              <span aria-hidden="true">·</span>
              <span>Amazon Prime &amp; Shopz BD</span>
              <span aria-hidden="true">·</span>
              <span>Practical IT Guides</span>
            </div>

            <h1 className="text-[clamp(1.65rem,3.6vw,3rem)] font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-5 leading-[1.14] [text-wrap:balance]">
              Curated Workspace Hardware, Tech Guides &amp; Direct Store Links.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              Browse selected electronics, peripherals, power gear, and desk hardware linked directly to official Amazon and Shopz BD product pages, alongside practical IT troubleshooting guides by M R S.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <button
                onClick={handleBrowseAllAccessories}
                className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-3 text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Package className="w-4 h-4 text-slate-950" />
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreStore}
                className="w-full sm:w-auto min-h-[44px] px-5 py-3 text-sm font-bold text-white dark:text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-900 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Shop Hardware</span>
              </button>

              <div className="flex items-center gap-2.5 sm:contents">
                <button
                  onClick={onOpenGuides}
                  className="flex-1 sm:flex-initial min-h-[44px] px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 sm:bg-transparent border border-slate-200 dark:border-slate-800 sm:border-transparent rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tech Guides</span>
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

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Official Amazon &amp; Shopz BD Checkouts</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>Live Exchange Rate Conversion</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Asset */}
          <div className="lg:col-span-5 relative flex items-center min-w-0">
            <div className="w-full relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
              <img
                src={mrsHeroWorkspaceImg}
                alt="Camellia Shop Creator Workspace Setup"
                className="w-full h-60 sm:h-80 md:h-96 lg:h-full lg:min-h-[380px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-white/95">
                  <span className="font-semibold text-white truncate">Camellia Shop Workspace Curations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Verifiable Catalog & Resource Strip */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {products.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Curated Hardware Items</div>
            <p className="text-[11px] text-slate-500">Direct Amazon &amp; Shopz BD links</p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              2
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Partner Storefronts</div>
            <p className="text-[11px] text-slate-500">Amazon Associates &amp; Shopz BD</p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {TECH_GUIDES.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Free Tech Guides</div>
            <p className="text-[11px] text-slate-500">Windows, WiFi &amp; Android</p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              Direct
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Official Retailer Checkout</div>
            <p className="text-[11px] text-slate-500">Fulfilled directly by partner stores</p>
          </div>
        </div>
      </div>
    </section>
  );
};
