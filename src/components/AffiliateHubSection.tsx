import React, { useState } from 'react';
import { ExternalLink, Tag, Check, ShieldCheck, Sparkles, SlidersHorizontal, ArrowUpRight, DollarSign, Layers } from 'lucide-react';
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
    <section id="affiliate-hub" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <span>Automated Monetization Engine</span>
              <span aria-hidden="true">·</span>
              <span>Exclusive Partner Deals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Curated Partner Deals &amp; Verified Hardware
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
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

        {/* 3-Column Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {filteredDeals.map((deal) => {
            const affiliateUrl = getAutomatedUrl(deal);
            const isCopied = copiedCodeId === deal.id;

            return (
              <div
                key={deal.id}
                className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
                      {deal.brand}
                    </span>
                    <span className="bg-amber-100 text-amber-900 font-medium px-2 py-0.5 rounded text-[11px]">
                      {deal.discountText}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {deal.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Key Benefits */}
                  <ul className="space-y-1.5 mb-5 text-xs text-slate-600">
                    {deal.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Affiliate Monetization Row */}
                <div className="pt-4 border-t border-slate-200/80 space-y-3">
                  
                  {/* Coupon & Payout Information */}
                  <div className="flex items-center justify-between text-xs">
                    {deal.promoCode ? (
                      <button
                        onClick={(e) => handleCopyCode(deal.promoCode!, deal.id, e)}
                        className="flex items-center gap-1.5 font-mono px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:border-slate-400 transition-colors cursor-pointer"
                        title="Click to copy coupon code"
                      >
                        <Tag className="w-3 h-3 text-amber-600" />
                        <span>{deal.promoCode}</span>
                        {isCopied ? (
                          <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Copy</span>
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Direct Discount Applied</span>
                    )}

                    <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {deal.commissionType}
                    </span>
                  </div>

                  {/* Primary Outbound Affiliate Trigger */}
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noreferrer noopener sponsored"
                    onClick={() => recordAffiliateClick(deal.id)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
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
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-700">Affiliate Disclosure: </strong>
            We recommend verified tools and hardware that we personally audit. When you purchase through the links above, we may earn an affiliate commission at no extra cost to you. This directly funds our free open-source tech guides and community playbooks.
          </p>
        </div>

      </div>
    </section>
  );
};
