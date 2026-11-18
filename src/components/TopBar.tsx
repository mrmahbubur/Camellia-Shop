import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight, Tag, Sun, Moon, Monitor, ShieldCheck } from 'lucide-react';
import { useCart, Currency } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface TopBarProps {
  onNavigate: (sectionId: string) => void;
}

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'BDT', 'INR'];

export const TopBar: React.FC<TopBarProps> = ({ onNavigate }) => {
  const { totalItems, setIsCartOpen, currency, setCurrency } = useCart();
  const { setSelectedCategory, setSelectedStoreFilter, amazonStoreUrl, storefrontCopy } = useProducts();
  const { themeMode, setThemeMode, cycleThemeMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const handleAmazonDealsClick = () => {
    setSelectedStoreFilter('Amazon');
    setSelectedCategory('All Departments (Mega Store)');
    handleNavClick('store');
  };

  const handleShopzDealsClick = () => {
    setSelectedStoreFilter('Shopz BD');
    setSelectedCategory('Shopz BD Tech Deals');
    handleNavClick('store');
  };

  const handleRelevaClick = () => {
    setSelectedStoreFilter('Releva BD');
    setSelectedCategory('All Departments (Mega Store)');
    handleNavClick('store');
  };

  const themeLabel =
    themeMode === 'system' ? 'Theme: Auto' : themeMode === 'dark' ? 'Theme: Dark' : 'Theme: Light';

  return (
    <>
      {/* Top Bar Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{storefrontCopy.announcementText}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
            <a
              href={amazonStoreUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="text-amber-300 hover:text-white transition-colors font-semibold whitespace-nowrap inline-flex items-center gap-1"
            >
              <span>Amazon Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('hero')}
            className="text-left group cursor-pointer shrink-0 min-h-[40px] flex items-center"
          >
            <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {storefrontCopy.siteName}
            </span>
          </button>

          {/* Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <button
              type="button"
              onClick={() => handleNavClick('buying-guide')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer font-semibold"
            >
              Buying Guide
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('store')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer font-semibold"
            >
              Shop Catalog
            </button>

            <button
              type="button"
              onClick={handleShopzDealsClick}
              className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              Shopz BD
            </button>

            <button
              type="button"
              onClick={handleRelevaClick}
              className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 font-semibold text-teal-700 dark:text-teal-400 cursor-pointer"
            >
              Releva BD
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('amazon-products')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 font-semibold text-amber-600 dark:text-amber-400 cursor-pointer"
            >
              Amazon Picks
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('sponsors')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 font-semibold cursor-pointer"
            >
              Sponsors
            </button>
          </nav>

          {/* Compact Primary Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Currency Selector (Tablet & Desktop) */}
            <div
              role="group"
              aria-label="Select display currency"
              className="hidden md:flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5"
            >
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  aria-pressed={currency === c}
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
              className="flex items-center justify-center gap-1.5 min-h-[40px] min-w-[40px] px-2 sm:px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold whitespace-nowrap shrink-0"
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

            {/* Saved List Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="View saved items"
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 min-h-[40px] text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-amber-400 rounded-lg hover:bg-slate-800 dark:hover:bg-amber-300 transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Saved</span>
              {totalItems > 0 && (
                <span className="bg-amber-500 dark:bg-slate-950 text-slate-950 dark:text-amber-400 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
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
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`px-2 min-h-[36px] rounded-md cursor-pointer transition-colors ${
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
              <button
                type="button"
                onClick={handleAmazonDealsClick}
                className="text-left px-3 min-h-[44px] py-2 rounded-lg bg-amber-50 dark:bg-amber-500/15 text-amber-950 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-500/30 flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Amazon Tech Picks</span>
                </div>
                <span className="text-xs bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-mono shrink-0">
                  Direct
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('buying-guide')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer"
              >
                Buying Guide &amp; Recommendations
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('customer-themes')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer"
              >
                Collections &amp; Store Directory
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('store')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Shop Full Catalog
              </button>
              <button
                type="button"
                onClick={handleShopzDealsClick}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer"
              >
                Shopz BD Tech Deals
              </button>
              <button
                type="button"
                onClick={handleRelevaClick}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-400 font-semibold cursor-pointer"
              >
                Releva BD Tracked Products
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('amazon-products')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold cursor-pointer"
              >
                Amazon Featured Picks
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('sponsors')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
              >
                Sponsored Partners
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
