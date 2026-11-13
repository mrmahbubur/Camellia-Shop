import React, { useState } from 'react';
import { ExternalLink, Tag, Check, ShieldCheck } from 'lucide-react';
import { AFFILIATE_DEALS } from '../data/affiliateData';
import { useAffiliate } from '../context/AffiliateContext';
import { useProducts } from '../context/ProductsContext';

export const AffiliateHubSection: React.FC = () => {
  const { getAutomatedUrl } = useAffiliate();
  const { recordAffiliateClick } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const categories = [
    'All',
    'Cloud & Hosting',
    'Ergonomic Hardware',
    'SaaS & Creator Tools',
    'Cyber Security & VPN'
  ];

  const filteredDeals = AFFILIATE_DEALS.filter((deal) => {
    return selectedCategory === 'All' || deal.category === selectedCategory;
  });

  const handleCopyCode = (code: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <section
      id="affiliate-hub"
      className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span>Automated Monetization Engine</span>
              <span aria-hidden="true">·</span>
              <span>Exclusive Partner Deals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Curated Partner Deals &amp; Verified Hardware
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Verified Partner Guarantees</span>
            </span>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 scrollbar-none">
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

        {/* 3-Column Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-10">
          {filteredDeals.map((deal) => {
            const affiliateUrl = getAutomatedUrl(deal);
            const isCopied = copiedCodeId === deal.id;

            return (
              <div
                key={deal.id}
                className="bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400 dark:text-slate-500">
                      {deal.brand}
                    </span>
                    <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-medium px-2 py-0.5 rounded text-[11px]">
                      {deal.discountText}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {deal.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {deal.description}
                  </p>

                  <ul className="space-y-1.5 mb-5 text-xs text-slate-600 dark:text-slate-300">
                    {deal.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Affiliate Monetization Row */}
                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    {deal.promoCode ? (
                      <button
                        onClick={(e) => handleCopyCode(deal.promoCode!, deal.id, e)}
                        className="flex items-center gap-1.5 font-mono px-2.5 min-h-[34px] py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer"
                        title="Click to copy coupon code"
                      >
                        <Tag className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>{deal.promoCode}</span>
                        {isCopied ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Copy</span>
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-[11px]">Direct Discount Applied</span>
                    )}

                    <span className="text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded">
                      {deal.commissionType}
                    </span>
                  </div>

                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noreferrer noopener sponsored"
                    onClick={() => recordAffiliateClick(deal.id)}
                    className="w-full min-h-[42px] py-2.5 px-4 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 rounded-lg text-xs font-semibold dark:font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <span>Claim Exclusive Deal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* FTC Affiliate Disclosure Card */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-200">Affiliate Disclosure: </strong>
            We recommend verified tools and hardware that we personally audit. When you purchase through the links above, we may earn an affiliate commission at no extra cost to you. This directly funds our free open-source tech guides and community playbooks.
          </p>
        </div>
      </div>
    </section>
  );
};
