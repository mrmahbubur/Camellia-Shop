import React, { useEffect, useState } from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

interface OwnerCredit {
  displayName: string;
  username: string;
  email: string;
  gravatarUrl: string;
}

const DEFAULT_OWNER_CREDIT: OwnerCredit = {
  displayName: 'M R S',
  username: 'mrxshahin',
  email: 'mr216873@gmail.com',
  gravatarUrl: 'https://gravatar.com/mrxshahin'
};

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { setSelectedCategory } = useProducts();
  const [owner, setOwner] = useState<OwnerCredit>(DEFAULT_OWNER_CREDIT);

  useEffect(() => {
    fetch('/api/owner')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.displayName && data.username) {
          setOwner({
            displayName: data.displayName,
            username: data.username,
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
    setSelectedCategory(category);
    onNavigate('store');
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] py-10 sm:py-12 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-8 sm:pb-10 border-b border-slate-800/80">
          {/* Brand & Concise Owner Credit */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-base font-bold text-white tracking-tight">
              Camellia Shop
            </span>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Curated electronics, computer peripherals, and workspace hardware linked directly to Amazon and Shopz BD.
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-slate-400 pt-1">
              <span>Owner: {owner.displayName}</span>
              <span aria-hidden="true">·</span>
              <a
                href={owner.gravatarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                @{owner.username} ↗
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
                  onClick={() => handleCategoryNav('All Departments (Mega Store)')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  All Store Hardware
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('Electronics & Gadgets')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Electronics &amp; Gadgets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('Shopz BD Tech Deals')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Shopz BD Tech Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('amazon-products')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Amazon Featured Picks
                </button>
              </li>
            </ul>
          </div>

          {/* Partner Fulfillment */}
          <div className="sm:col-span-2 md:col-span-4 space-y-3">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">
              Direct Retailer Fulfillment
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              All product purchases take place directly on Amazon or Shopz BD under their official checkouts, live pricing, shipping options, and manufacturer warranties.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Direct Retailer Checkout</span>
              </span>
              <span>Amazon · Shopz BD</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Camellia Shop · Owned by {owner.displayName} (@{owner.username}).
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('store')}
              className="hover:text-slate-300 transition-colors cursor-pointer py-1"
            >
              Shop Catalog
            </button>
            <button
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
