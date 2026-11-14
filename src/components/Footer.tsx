import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] py-10 sm:py-12 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-8 sm:pb-10 border-b border-slate-800/80">
          {/* Brand & Owner */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-base font-bold text-white tracking-tight">
              Camellia Shop
            </span>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Curated workspace hardware, Amazon Associates &amp; Shopz BD directory, and practical tech troubleshooting guides.
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-slate-400 pt-1">
              <span>Owner: M R S</span>
              <span aria-hidden="true">·</span>
              <a
                href="https://gravatar.com/mrxshahin"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                @mrxshahin ↗
              </a>
              <span aria-hidden="true">·</span>
              <a href="mailto:mr216873@gmail.com" className="hover:text-slate-200 transition-colors break-all">
                mr216873@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">
              Explore Shop
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Workspace Gear &amp; Store
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
              <li>
                <button
                  onClick={() => onNavigate('guides')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Tech Troubleshooting Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about-contact')}
                  className="hover:text-white transition-colors cursor-pointer py-0.5"
                >
                  Owner &amp; Direct Contact
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
            © {new Date().getFullYear()} Camellia Shop · Owned by M R S (@mrxshahin).
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
