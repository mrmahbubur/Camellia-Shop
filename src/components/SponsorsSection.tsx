import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ExternalLink, Megaphone } from 'lucide-react';
import { SponsorGroup } from '../data/sponsorsData';
import { useProducts } from '../context/ProductsContext';
import { ResilientImage } from './ResilientImage';
import { AliExpressEventBanner } from './AliExpressEventBanner';

type FilterTab = 'All' | SponsorGroup;

const FILTER_TABS: FilterTab[] = [
  'All',
  'Hardware & Power',
  'Workspace & Audio',
  'Deals & Bundles'
];

export const SponsorsSection: React.FC = () => {
  const { sponsors, recordAffiliateClick } = useProducts();
  const [activeGroup, setActiveGroup] = useState<FilterTab>('All');

  const filteredSponsors = useMemo(() => {
    if (activeGroup === 'All') return sponsors;
    return sponsors.filter((item) => item.group === activeGroup);
  }, [sponsors, activeGroup]);

  const featuredSponsors = useMemo(
    () => filteredSponsors.filter((item) => item.featured),
    [filteredSponsors]
  );

  const directorySponsors = useMemo(
    () => filteredSponsors.filter((item) => !item.featured),
    [filteredSponsors]
  );

  return (
    <section
      id="sponsors"
      className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 scroll-mt-14 sm:scroll-mt-16 transition-colors"
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-amber-600 dark:text-amber-400 inline-flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 shrink-0" />
                <span>Sponsored Partner Offers</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Featured Promotions</span>
            </div>
            <h2 className="text-[clamp(1.375rem,2.4vw,1.875rem)] font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Sponsored Partner Links &amp; Promotions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Explore curated external partner promotions. Current offers, product details, and pricing open directly on the sponsor store.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter sponsor offers"
            className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto scrollbar-none shrink-0 max-w-full"
          >
            {FILTER_TABS.map((tab) => {
              const selected = activeGroup === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveGroup(tab)}
                  className={`px-3 min-h-[44px] py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'All' ? 'All Sponsors' : tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* AliExpress Official Multi-Format Event Promotion */}
        {(activeGroup === 'All' || activeGroup === 'Deals & Bundles') && (
          <AliExpressEventBanner variant="showcase" />
        )}

        {/* Featured Sponsor Spotlights */}
        {featuredSponsors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
            {featuredSponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => recordAffiliateClick(sponsor.id)}
                className="responsive-card group bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200 grid grid-cols-1 sm:grid-cols-12 items-stretch"
              >
                <div className="sm:col-span-5 aspect-[16/10] sm:aspect-auto sm:min-h-[210px] lg:min-h-[230px] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <ResilientImage
                    src={sponsor.image}
                    alt={sponsor.title}
                    className="w-full h-full object-cover responsive-card-media"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="sm:col-span-7 p-5 flex flex-col justify-between gap-4 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-amber-700 dark:text-amber-400">Sponsored</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{sponsor.category}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {sponsor.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {sponsor.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                    <span className="min-h-[44px] text-xs font-bold text-slate-900 dark:text-amber-400 inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span>{sponsor.ctaLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Partner Offer
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Partner Directory Cards */}
        {directorySponsors.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 min-[1025px]:grid-cols-4 min-[1441px]:grid-cols-5 gap-2.5 sm:gap-4 min-[1025px]:gap-5 xl:gap-6 items-stretch">
            {directorySponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => recordAffiliateClick(sponsor.id)}
                className="h-full min-w-0 responsive-card group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col justify-between transition-all duration-200"
              >
                <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden relative shrink-0">
                  <ResilientImage
                    src={sponsor.image}
                    alt={sponsor.title}
                    className="w-full h-full object-cover responsive-card-media"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between gap-2 sm:gap-4 min-w-0">
                  <div className="space-y-1 sm:space-y-2 min-w-0">
                    <div className="flex items-center justify-between gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 min-w-0">
                      <span className="text-amber-700 dark:text-amber-400 shrink-0">Sponsored</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate flex-1">{sponsor.category}</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[2.125rem] sm:min-h-[2.5rem] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {sponsor.title}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-snug sm:leading-relaxed line-clamp-2 min-h-[1.875rem] sm:min-h-[2.4rem]">
                      {sponsor.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 min-h-[36px] sm:min-h-[44px] flex items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors min-w-0">
                    <span className="truncate">{sponsor.ctaLabel}</span>
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
