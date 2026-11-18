import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Package, ShoppingCart, ExternalLink } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import mrsHeroWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';
import { buildRelevaProductUrl } from '../data/unifiedProductsData';

interface HeroProps {
  onExploreStore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreStore }) => {
  const {
    setSelectedCategory,
    setSelectedStoreFilter,
    amazonStoreUrl,
    shopzStoreUrl,
    exonhostStoreUrl,
    aliexpressStoreUrl,
    alibabaStoreUrl,
    products,
    storefrontCopy,
    regionProfile,
    recordAffiliateClick
  } = useProducts();

  const handleBrowseAllProducts = () => {
    setSelectedCategory('All Departments (Mega Store)');
    setSelectedStoreFilter('all');
    onExploreStore();
  };

  const partnerButtons = regionProfile.storePriority.map((store) => {
    if (store === 'Shopz BD') {
      return (
        <a
          key="shopz"
          href={shopzStoreUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-shopz-store', 'Shopz BD')}
          className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Shopz BD</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        </a>
      );
    }
    if (store === 'Releva BD') {
      return (
        <a
          key="releva"
          href={buildRelevaProductUrl(130)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-releva-store', 'Releva BD')}
          className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 border border-teal-300 dark:border-teal-500/40 hover:border-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Releva BD</span>
          <ExternalLink className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        </a>
      );
    }
    if (store === 'ExonHost') {
      return (
        <a
          key="exonhost"
          href={exonhostStoreUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-exonhost-store', 'ExonHost')}
          className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-sky-800 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-200 border border-sky-300 dark:border-sky-500/40 hover:border-sky-400 bg-sky-50 dark:bg-sky-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>ExonHost</span>
          <ExternalLink className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        </a>
      );
    }
    if (store === 'AliExpress') {
      return (
        <a
          key="aliexpress"
          href={aliexpressStoreUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-aliexpress-store', 'AliExpress')}
          className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-orange-800 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-200 border border-orange-300 dark:border-orange-500/40 hover:border-orange-400 bg-orange-50 dark:bg-orange-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>AliExpress</span>
          <ExternalLink className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
        </a>
      );
    }
    if (store === 'Alibaba') {
      return (
        <a
          key="alibaba"
          href={alibabaStoreUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-alibaba-store', 'Alibaba')}
          className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-indigo-800 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200 border border-indigo-300 dark:border-indigo-500/40 hover:border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Alibaba</span>
          <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        </a>
      );
    }
    return (
      <a
        key="amazon"
        href={amazonStoreUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => recordAffiliateClick('hero-amazon-store', 'Amazon')}
        className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 border border-amber-300 dark:border-amber-500/40 hover:border-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
      >
        <span>Amazon</span>
        <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      </a>
    );
  });

  return (
    <section
      id="hero"
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white pt-6 sm:pt-8 pb-10 sm:pb-14 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Main 2-Column Balanced Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Storefront Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center py-2 sm:py-4 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400 mb-3">
              <span>{storefrontCopy.siteName}</span>
              <span aria-hidden="true">·</span>
              <span>{regionProfile.label}</span>
              <span aria-hidden="true">·</span>
              <span>{regionProfile.storePriority.join(' / ')}</span>
            </div>

            <h1 className="text-[clamp(1.65rem,3.6vw,3rem)] font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-5 leading-[1.14] [text-wrap:balance]">
              {storefrontCopy.heroTitle}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              {storefrontCopy.heroSubtitle}
            </p>

            {/* Primary & Secondary Storefront CTAs */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <button
                type="button"
                onClick={handleBrowseAllProducts}
                className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-3 text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Package className="w-4 h-4 text-slate-950" />
                <span>Browse Catalog ({products.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreStore}
                className="w-full sm:w-auto min-h-[44px] px-5 py-3 text-sm font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-900 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Explore Stores</span>
              </button>

              <div className="flex flex-wrap items-center gap-2 sm:contents">{partnerButtons}</div>
            </div>

            {/* Trust Signals & Honest Regional Note */}
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{regionProfile.deliverySummary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span>{regionProfile.shortLabel} Reference Display</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {regionProfile.availabilityNote}
              </p>
            </div>
          </div>

          {/* Right Column: Visual Asset */}
          <div className="lg:col-span-5 relative flex items-center min-w-0">
            <div className="w-full relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
              <img
                src={mrsHeroWorkspaceImg}
                alt="Camellia Shop Workspace Hardware Illustration"
                className="w-full h-60 sm:h-80 md:h-96 lg:h-full lg:min-h-[380px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-white/95">
                  <span className="font-semibold text-white truncate">
                    Camellia Shop Curated Hardware &amp; Partners
                  </span>
                  <span className="text-[10px] text-slate-300 shrink-0">Illustrative image</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Storefront Summary Strip */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {products.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Catalog Listings</div>
            <p className="text-[11px] text-slate-500">
              Amazon ASINs, Shopz BD CSV, Releva BD, AliExpress, Alibaba &amp; ExonHost
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              6
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Partner Retailers</div>
            <p className="text-[11px] text-slate-500">
              Amazon, Shopz BD, Releva BD, AliExpress, Alibaba &amp; ExonHost
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              5
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Display Currencies</div>
            <p className="text-[11px] text-slate-500">USD, EUR, GBP, BDT &amp; INR (approx. FX)</p>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              8
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Shopping Regions</div>
            <p className="text-[11px] text-slate-500">BD, US, UK, EU, IN, APAC, MENA &amp; Global</p>
          </div>
        </div>
      </div>
    </section>
  );
};
