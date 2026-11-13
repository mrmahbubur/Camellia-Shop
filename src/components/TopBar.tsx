import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight, Sparkles, Heart, Sun, Moon, Monitor } from 'lucide-react';
import { useCart, Currency } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useCharity } from '../context/CharityContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface TopBarProps {
  onNavigate: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigate }) => {
  const { totalItems, setIsCartOpen, currency, setCurrency } = useCart();
  const { setSelectedCategory } = useProducts();
  const { selectedCause, setIsCharityModalOpen, charityEnabled } = useCharity();
  const { themeMode, setThemeMode, cycleThemeMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const handleAmazonDealsClick = () => {
    setSelectedCategory('Electronics & Gadgets');
    handleNavClick('store');
  };

  const themeLabel =
    themeMode === 'system' ? 'Theme: Auto (System)' : themeMode === 'dark' ? 'Theme: Dark' : 'Theme: Light';

  return (
    <>
      {/* Top Bar Announcement Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <span className="font-bold text-rose-400 flex items-center gap-1 shrink-0">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Charity Pledge:</span>
            </span>
            <span className="truncate">
              5% of affiliate profits donated to {selectedCause.shortLabel} · $0 extra cost
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
            <button
              onClick={() => setIsCharityModalOpen(true)}
              className="text-rose-300 hover:text-white transition-colors cursor-pointer font-semibold underline underline-offset-4 whitespace-nowrap"
            >
              Charity Details
            </button>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">
              Code: <strong className="text-white">CAMELLIA15</strong> (15% Off)
            </span>
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Top Navigation Contract */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('hero')}
            className="text-left group cursor-pointer shrink-0 min-h-[40px] flex items-center"
          >
            <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Camellia Shop
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={handleAmazonDealsClick}
              className="font-bold hover:text-amber-700 dark:hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer bg-amber-50 dark:bg-amber-500/15 text-amber-950 dark:text-amber-300 px-2.5 py-1.5 rounded-md border border-amber-200/80 dark:border-amber-500/30"
              title="Filter Electronics & Gadgets"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Prime Tech</span>
            </button>

            <button
              onClick={() => handleNavClick('store')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer font-semibold"
            >
              Shop Catalog
            </button>
            <button
              onClick={() => handleNavClick('amazon-products')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <span>Amazon Deals</span>
            </button>
            <button
              onClick={() => handleNavClick('blueprints')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer"
            >
              Playbooks
            </button>
            <button
              onClick={() => handleNavClick('roi-calculator')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer"
            >
              Calculator
            </button>
            <button
              onClick={() => handleNavClick('guides')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer"
            >
              Tech Guides
            </button>
          </nav>

          {/* Zone 3: Compact Primary Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Charity Support Option Button */}
            <button
              onClick={() => setIsCharityModalOpen(true)}
              className="flex items-center gap-1.5 px-2 sm:px-3 min-h-[38px] text-[11px] sm:text-xs font-bold rounded-lg bg-rose-50 dark:bg-rose-500/15 text-rose-900 dark:text-rose-200 border border-rose-200/90 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/25 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              title="Charity Support: 5% of affiliate earnings donated to verified causes"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 fill-rose-500 shrink-0" />
              <span className="hidden xl:inline text-rose-700 dark:text-rose-300">Charity:</span>
              <span className="hidden xs:inline sm:inline font-extrabold text-rose-900 dark:text-rose-100 max-w-[84px] sm:max-w-none truncate">
                {selectedCause.shortLabel}
              </span>
              <span className="sr-only sm:hidden">Charity ({charityEnabled ? '5%' : 'Off'})</span>
            </button>

            {/* Currency Selector (Tablet & Desktop) */}
            <div className="hidden md:flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
              {(['USD', 'EUR', 'GBP', 'BDT'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    currency === c
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Adaptive Theme Switcher (Auto / Light / Dark) */}
            <button
              type="button"
              onClick={cycleThemeMode}
              title={themeLabel}
              aria-label={themeLabel}
              className="flex items-center justify-center gap-1.5 min-h-[38px] min-w-[38px] px-2 sm:px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold whitespace-nowrap shrink-0"
            >
              {themeMode === 'system' ? (
                <Monitor className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              ) : themeMode === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className="hidden xl:inline capitalize">
                {themeMode === 'system' ? 'Auto' : themeMode}
              </span>
            </button>

            {/* Shopping Bag Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping bag"
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 min-h-[38px] text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-amber-400 rounded-lg hover:bg-slate-800 dark:hover:bg-amber-300 transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalItems > 0 && (
                <span className="bg-amber-500 dark:bg-slate-950 text-slate-950 dark:text-amber-400 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-3 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain">
            {/* Currency + Theme Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Currency</span>
                <div className="flex items-center gap-1 text-xs">
                  {(['USD', 'EUR', 'GBP', 'BDT'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2.5 min-h-[36px] rounded-md cursor-pointer transition-colors ${
                        currency === c
                          ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Theme</span>
                <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                  {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setThemeMode(mode)}
                      className={`px-2.5 min-h-[34px] rounded-md capitalize cursor-pointer transition-colors ${
                        themeMode === mode
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {mode === 'system' ? 'Auto' : mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              {/* Charity Support Action */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCharityModalOpen(true);
                }}
                className="text-left px-3 min-h-[44px] py-2 rounded-lg bg-rose-50 dark:bg-rose-500/15 text-rose-950 dark:text-rose-100 font-bold border border-rose-200 dark:border-rose-500/30 flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400 fill-rose-500 shrink-0" />
                  <span className="truncate">Charity: {selectedCause.shortLabel}</span>
                </div>
                <span className="text-xs bg-rose-200 dark:bg-rose-500/30 text-rose-950 dark:text-rose-100 px-2 py-0.5 rounded font-mono shrink-0">
                  {charityEnabled ? '5% Active' : 'Paused'}
                </span>
              </button>

              {/* Highlighted Amazon Prime Deals Button */}
              <button
                onClick={handleAmazonDealsClick}
                className="text-left px-3 min-h-[44px] py-2 rounded-lg bg-amber-50 dark:bg-amber-500/15 text-amber-950 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-500/30 flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Amazon Prime Deals</span>
                </div>
                <span className="text-xs bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-mono shrink-0">
                  Verified
                </span>
              </button>

              <button
                onClick={() => handleNavClick('store')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Shop Gear &amp; Hardware
              </button>
              <button
                onClick={() => handleNavClick('amazon-products')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold cursor-pointer"
              >
                Amazon Prime Deals
              </button>
              <button
                onClick={() => handleNavClick('blueprints')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Online Income Playbooks
              </button>
              <button
                onClick={() => handleNavClick('roi-calculator')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Profit &amp; ROI Calculator
              </button>
              <button
                onClick={() => handleNavClick('guides')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Tech Troubleshooting Guides
              </button>
              <button
                onClick={() => handleNavClick('thoughts')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Mindset &amp; Philosophy
              </button>

              <button
                onClick={() => handleNavClick('about-contact')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>About M R S &amp; Contact</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
