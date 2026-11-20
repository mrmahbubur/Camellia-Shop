import React, { useEffect, useState } from 'react';
import { ArrowUp, ShieldCheck, ExternalLink } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { isStaticHostedWithoutApi, resolveApiUrl } from '../utils/apiClient';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

interface OwnerCredit {
  displayName: string;
  email: string;
  gravatarUrl: string;
}

const DEFAULT_OWNER_CREDIT: OwnerCredit = {
  displayName: 'M R S',
  email: 'mr216873@gmail.com',
  gravatarUrl: 'https://gravatar.com/mrxshahin'
};

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { setSelectedCategory, setSelectedStoreFilter, storefrontCopy } = useProducts();
  const [owner, setOwner] = useState<OwnerCredit>(DEFAULT_OWNER_CREDIT);

  useEffect(() => {
    if (isStaticHostedWithoutApi()) return;

    fetch(resolveApiUrl('/api/owner'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.displayName) {
          setOwner({
            displayName: data.displayName,
            email: data.email || DEFAULT_OWNER_CREDIT.email,
            gravatarUrl: data.gravatarUrl || DEFAULT_OWNER_CREDIT.gravatarUrl
          });
        }
      })
      .catch(() => {
        // Keep verified fallback
      });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryNav = (category: string) => {
    setSelectedStoreFilter('all');
    setSelectedCategory(category);
    onNavigate('store');
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] py-10 sm:py-12 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        {/* Concise 3-Step Affiliate Checkout Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8 mb-8 border-b border-slate-800/80">
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
              Step 1 · Compare &amp; Filter
            </div>
            <div className="text-sm font-bold text-white">Browse Curated Listings</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Filter by shopping region, partner store, category tabs, listed price range, or product specs.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
              Step 2 · Save or Match
            </div>
            <div className="text-sm font-bold text-white">Use Buying Guide &amp; Saved List</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Match items by goal and budget, inspect specs side by side, and bookmark items locally.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              Step 3 · Partner Checkout
            </div>
            <div className="text-sm font-bold text-white">Complete Order on Partner Site</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verify live price, stock, shipping, and returns directly on Amazon, Shopz BD, Star Tech, BanglaShoppers, Illin BD, Releva BD, Alibaba, ExonHost, or Sohoj Affiliates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-8 sm:pb-10 border-b border-slate-800/80">
          {/* Brand & Concise Owner Credit */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-base font-bold text-white tracking-tight">
              {storefrontCopy.siteName}
            </span>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Curated workspace electronics, smartwatches, skincare, home appliances, and hosting portals linked directly to Amazon, Shopz BD, Star Tech, BanglaShoppers, Illin BD, Releva BD, Alibaba, ExonHost, and Sohoj Affiliates.
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-slate-400 pt-1">
              <span>Owner: {owner.displayName}</span>
              <span aria-hidden="true">·</span>
              <a
                href={owner.gravatarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span aria-hidden="true">·</span>
              <a href={`mailto:${owner.email}`} className="hover:text-slate-200 transition-colors break-all">
                {owner.email}
              </a>
            </div>
          </div>

          {/* Shop Departments */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">
              Shop Departments
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('buying-guide')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Buying Guide &amp; Matchmaker
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('customer-themes')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Collections &amp; Store Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('All Departments (Mega Store)')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  All Store Listings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('Shopz BD Tech Deals')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Shopz BD Tech Deals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('Star Tech BD Gadgets')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Star Tech Smartwatches
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('BanglaShoppers Beauty')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  BanglaShoppers Skincare &amp; Beauty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('Illin BD Home & Tech')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Illin BD Home &amp; Appliances
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('Sohoj Affiliate Network')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Sohoj Affiliates Partner Hub
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('Releva BD Picks')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Releva BD Picks
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('Cloud Hosting & Domains')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  ExonHost Hosting &amp; Domains
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('amazon-products')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Amazon Featured Picks
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('sponsors')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Sponsored Partners
                </button>
              </li>
            </ul>
          </div>

          {/* Partner Fulfillment & Disclosure */}
          <div className="sm:col-span-2 md:col-span-4 space-y-3">
              <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">
                Affiliate Disclosure
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                As an Amazon Associate, {storefrontCopy.siteName} earns from qualifying purchases. We also partner with Shopz BD, Star Tech, BanglaShoppers, Illin BD, Releva BD, Alibaba, ExonHost, Sohoj Affiliates, and featured sponsors.
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                All live prices, stock status, shipping coverage, and returns are set directly by each partner store at checkout.
              </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Direct Retailer Checkout</span>
              </span>
              <span>Amazon · Shopz BD · Star Tech · BanglaShoppers · Illin BD · Releva BD · Alibaba · ExonHost · Sohoj Affiliates</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} {storefrontCopy.siteName} · Owned by {owner.displayName}.
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('store')}
              className="hover:text-slate-300 transition-colors cursor-pointer py-1"
            >
              Shop Catalog
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
