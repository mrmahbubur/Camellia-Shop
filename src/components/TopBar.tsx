import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight, Sparkles, Heart } from 'lucide-react';
import { useCart, Currency } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useCharity } from '../context/CharityContext';

interface TopBarProps {
  onNavigate: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigate }) => {
  const { totalItems, setIsCartOpen, currency, setCurrency } = useCart();
  const { setSelectedCategory } = useProducts();
  const { selectedCause, setIsCharityModalOpen, charityEnabled } = useCharity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const handleAmazonDealsClick = () => {
    setSelectedCategory('Electronics & Gadgets');
    handleNavClick('store');
  };

  return (
    <>
      {/* Top Bar Announcement Header */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Charity Pledge:</span>
            </span>
            <span className="truncate">5% of all affiliate profits donated to {selectedCause.shortLabel} · $0 extra cost to you</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
            <button
              onClick={() => setIsCharityModalOpen(true)}
              className="text-rose-300 hover:text-white transition-colors cursor-pointer font-semibold underline underline-offset-4"
            >
              Charity Details
            </button>
            <span aria-hidden="true">·</span>
            <span>Code: <strong className="text-white">MRSLAUNCH</strong> (15% Off)</span>
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Top Navigation Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={() => handleNavClick('hero')}
            className="text-left group cursor-pointer shrink-0"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap group-hover:text-amber-600 transition-colors">
              MRS DIGITAL
            </span>
          </button>

          {/* Zone 2: 4-5 Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {/* Amazon Prime Deals Showing Option */}
            <button
              onClick={handleAmazonDealsClick}
              className="text-slate-900 font-bold hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer bg-amber-50 text-amber-950 px-2.5 py-1 rounded-md border border-amber-200/80"
              title="Filter Electronics & Gadgets"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Prime Tech</span>
            </button>

            <button
              onClick={() => handleNavClick('store')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer font-semibold"
            >
              Shop Catalog
            </button>
            <button
              onClick={() => handleNavClick('amazon-products')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 font-semibold text-amber-600 flex items-center gap-1 cursor-pointer"
            >
              <span>Amazon Deals</span>
            </button>
            <button
              onClick={() => handleNavClick('affiliate-hub')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer"
            >
              Partner Deals
            </button>
            <button
              onClick={() => handleNavClick('blueprints')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer"
            >
              Income Playbooks
            </button>
            <button
              onClick={() => handleNavClick('roi-calculator')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer"
            >
              Profit Calculator
            </button>
            <button
              onClick={() => handleNavClick('guides')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer"
            >
              Tech Guides
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action Area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Charity Support Option Button */}
            <button
              onClick={() => setIsCharityModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-50 text-rose-900 border border-rose-200/90 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
              title="Charity Support: 5% of affiliate earnings donated to verified causes"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500 shrink-0" />
              <span className="hidden lg:inline text-rose-700">Charity:</span>
              <span className="font-extrabold text-rose-900">{selectedCause.shortLabel}</span>
              {charityEnabled && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse hidden sm:inline-block" />
              )}
            </button>

            {/* Currency Selector */}
            <div className="hidden sm:flex items-center text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg p-0.5">
              {(['USD', 'EUR', 'GBP', 'BDT'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    currency === c
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Shopping Bag Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping bag"
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalItems > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs text-slate-500">Currency</span>
              <div className="flex items-center gap-1 text-xs">
                {(['USD', 'EUR', 'GBP', 'BDT'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1 rounded cursor-pointer ${
                      currency === c
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {/* Charity Support Action */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCharityModalOpen(true);
                }}
                className="text-left px-3 py-2.5 rounded-lg bg-rose-50 text-rose-950 font-bold border border-rose-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
                  <span>Charity Support: {selectedCause.shortLabel}</span>
                </div>
                <span className="text-xs bg-rose-200 text-rose-950 px-2 py-0.5 rounded font-mono">
                  {charityEnabled ? '5% Active' : 'Paused'}
                </span>
              </button>

              {/* Highlighted Amazon Prime Deals Button */}
              <button
                onClick={handleAmazonDealsClick}
                className="text-left px-3 py-2.5 rounded-lg bg-amber-50 text-amber-950 font-bold border border-amber-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Amazon Prime Deals</span>
                </div>
                <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono">Verified</span>
              </button>

              <button
                onClick={() => handleNavClick('store')}
                className="text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900"
              >
                Shop Gear & Hardware
              </button>
              <button
                onClick={() => handleNavClick('amazon-products')}
                className="text-left px-3 py-2 rounded-md hover:bg-slate-50 text-amber-600 font-semibold"
              >
                Amazon Prime Deals
              </button>
              <button
                onClick={() => handleNavClick('affiliate-hub')}
                className="text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900"
              >
                Verified Partner Deals
              </button>
              <button
                onClick={() => handleNavClick('blueprints')}
                className="text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900"
              >
                Online Income Playbooks
              </button>
              <button
                onClick={() => handleNavClick('roi-calculator')}
                className="text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900"
              >
                Profit &amp; ROI Calculator
              </button>
              <button
                onClick={() => handleNavClick('guides')}
                className="text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900"
              >
                Tech Troubleshooting Guides
              </button>
              <button
                onClick={() => handleNavClick('thoughts')}
                className="text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900"
              >
                Mindset & Philosophy
              </button>

              <button
                onClick={() => handleNavClick('about-contact')}
                className="text-left px-3 py-2 rounded-md hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between"
              >
                <span>About Shahin & Contact</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
