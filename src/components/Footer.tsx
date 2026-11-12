import React from 'react';
import { ArrowUp, ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Brand & Mission (Col 5) */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-base font-bold text-white tracking-tight">
              MRS DIGITAL
            </span>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Modern web shopping flagship by MRS Digital. Providing verified Amazon hardware, curated tech gear, and digital business frameworks.
            </p>
            <div className="flex items-center gap-3 text-slate-500 pt-1">
              <span>Founded by Shahin</span>
              <span aria-hidden="true">·</span>
              <a href="mailto:mrxshahin@proton.me" className="hover:text-slate-300 transition-colors">
                mrxshahin@proton.me
              </a>
            </div>
          </div>

          {/* Quick Navigation Links (Col 3) */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">
              Platform Modules
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('store')}
                  className="hover:text-white transition-colors"
                >
                  Workspace Gear &amp; Store
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blueprints')}
                  className="hover:text-white transition-colors"
                >
                  Online Income Playbooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('roi-calculator')}
                  className="hover:text-white transition-colors"
                >
                  Profit &amp; ROI Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guides')}
                  className="hover:text-white transition-colors"
                >
                  Tech Troubleshooting Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('thoughts')}
                  className="hover:text-white transition-colors"
                >
                  Daily Thoughts &amp; Mindset
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantees (Col 4) */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">
              Commerce &amp; Shipping Commitments
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Orders over $50 include free worldwide express shipping. All digital downloads include instant Notion and PDF vault keys. 30-day money-back guarantee on all physical workspace gear.
            </p>
            <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Encrypted Checkout</span>
              </span>
              <span>Visa · Mastercard · Crypto · COD</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} MRS Digital. All rights reserved. Premium Amazon Megastore &amp; E-Commerce Flagship.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('store')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Shop Catalog
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
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
