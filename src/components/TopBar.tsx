import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
  Tag,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useCart, Currency } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import {
  buildSearchSuggestions,
  clearRecentSearches,
  loadRecentSearches,
  removeRecentSearch,
  saveRecentSearch
} from '../utils/catalogSearch';
import type { EcomProduct, ProductCategory } from '../data/unifiedProductsData';
import type { PartnerStoreOrigin } from '../utils/regionProfile';
import { SearchSuggestionsDropdown } from './SearchSuggestionsDropdown';

interface TopBarProps {
  onNavigate: (sectionId: string) => void;
}

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'BDT', 'INR'];

export const TopBar: React.FC<TopBarProps> = ({ onNavigate }) => {
  const { totalItems, setIsCartOpen, currency, setCurrency } = useCart();
  const {
    products,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStoreFilter,
    setHighlightedProductId,
    amazonStoreUrl,
    aliexpressEventUrl,
    recordAffiliateClick,
    storefrontCopy
  } = useProducts();
  const { themeMode, resolvedTheme, systemTheme, setThemeMode, cycleThemeMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecentSearches());
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const inDesktop = searchWrapperRef.current?.contains(target);
      const inMobile = mobileSearchWrapperRef.current?.contains(target);
      if (!inDesktop && !inMobile) {
        setIsSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const suggestions = useMemo(
    () =>
      buildSearchSuggestions({
        query: searchQuery,
        products,
        recentSearches,
        scope: 'all',
        limitProducts: 5
      }),
    [searchQuery, products, recentSearches]
  );

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    setIsSuggestOpen(false);
    onNavigate(id);
  };

  const commitSearch = (term: string) => {
    const clean = term.trim();
    setSearchQuery(term);
    if (clean.length >= 2) {
      setRecentSearches(saveRecentSearch(clean));
    }
    setIsSuggestOpen(false);
    setMobileSearchOpen(false);
    onNavigate('store');
  };

  const handleSelectCategorySuggestion = (cat: ProductCategory) => {
    setSelectedStoreFilter('all');
    setSelectedCategory(cat);
    setSearchQuery('');
    setIsSuggestOpen(false);
    setMobileSearchOpen(false);
    onNavigate('store');
  };

  const handleSelectBrandSuggestion = (brand: string) => {
    setSearchQuery(brand);
    setRecentSearches(saveRecentSearch(brand));
    setIsSuggestOpen(false);
    setMobileSearchOpen(false);
    onNavigate('store');
  };

  const handleSelectStoreSuggestion = (store: PartnerStoreOrigin) => {
    setSelectedStoreFilter(store);
    setSelectedCategory('All Departments (Mega Store)');
    setIsSuggestOpen(false);
    setMobileSearchOpen(false);
    onNavigate('store');
  };

  const handleSelectProductSuggestion = (product: EcomProduct) => {
    setHighlightedProductId(product.id);
    setSelectedCategory('All Departments (Mega Store)');
    setSelectedStoreFilter('all');
    setSearchQuery(product.title);
    setRecentSearches(saveRecentSearch(product.title));
    setIsSuggestOpen(false);
    setMobileSearchOpen(false);
    onNavigate('store');
    setTimeout(() => {
      const cardEl = document.getElementById(`product-${product.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 180);
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

  const handleAliExpressClick = () => {
    setSelectedStoreFilter('AliExpress');
    setSelectedCategory('AliExpress Global Picks');
    handleNavClick('store');
  };

  const themeLabel =
    themeMode === 'system'
      ? `Theme: Auto (${systemTheme})`
      : themeMode === 'dark'
      ? 'Theme: Dark'
      : 'Theme: Light';

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{storefrontCopy.announcementText}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0 text-slate-400">
            <a
              href={aliexpressEventUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('topbar-aliexpress-event', 'AliExpress')}
              className="text-red-300 hover:text-white transition-colors font-semibold whitespace-nowrap inline-flex items-center gap-1 min-h-[32px]"
            >
              <span>AliExpress Deals</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <a
              href={amazonStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('topbar-amazon-store', 'Amazon')}
              className="text-amber-300 hover:text-white transition-colors font-semibold whitespace-nowrap inline-flex items-center gap-1 min-h-[32px]"
            >
              <span>Amazon Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-[1600px] mx-auto px-2.5 sm:px-6 lg:px-8 pl-[max(0.625rem,env(safe-area-inset-left))] pr-[max(0.625rem,env(safe-area-inset-right))] min-h-[3.75rem] sm:min-h-[4.25rem] flex items-center justify-between gap-1.5 sm:gap-3 lg:gap-4">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('store')}
            className="text-left group cursor-pointer shrink-0 min-h-[44px] flex items-center min-w-0"
          >
            <span className="text-[clamp(1rem,2.6vw,1.25rem)] font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap truncate max-w-[132px] min-[360px]:max-w-none group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {storefrontCopy.siteName}
            </span>
          </button>

          {/* Primary Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 shrink-0"
          >
            <button
              type="button"
              onClick={() => handleNavClick('store')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer font-semibold"
            >
              Products
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('buying-guide')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer font-semibold"
            >
              Buying Guide
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('customer-themes')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 cursor-pointer font-semibold"
            >
              Collections
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

          {/* Header Search Box with Suggestions (Tablet & Desktop) */}
          <div ref={searchWrapperRef} className="hidden sm:block relative flex-1 max-w-xs lg:max-w-sm min-w-[170px]">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                commitSearch(searchQuery);
              }}
              className="relative flex items-center"
            >
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="search"
                name="q"
                value={searchQuery}
                onFocus={() => setIsSuggestOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSuggestOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSuggestOpen(false);
                  }
                }}
                placeholder="Search products, brands, stores..."
                aria-label="Search products with suggestions"
                className="w-full min-h-[44px] pl-8 pr-9 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:bg-white dark:focus:bg-slate-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear header search"
                  className="absolute right-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <SearchSuggestionsDropdown
              isOpen={isSuggestOpen}
              query={searchQuery}
              suggestions={suggestions}
              onSelectQuery={commitSearch}
              onRemoveRecent={(term) => setRecentSearches(removeRecentSearch(term))}
              onClearRecent={() => setRecentSearches(clearRecentSearches())}
              onSelectCategory={handleSelectCategorySuggestion}
              onSelectBrand={handleSelectBrandSuggestion}
              onSelectStore={handleSelectStoreSuggestion}
              onSelectProduct={handleSelectProductSuggestion}
              onClose={() => setIsSuggestOpen(false)}
            />
          </div>

          {/* Compact Primary Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Quick Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              title="Search products"
              aria-label="Search products"
              className="sm:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>

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
                  className={`px-2 min-h-[40px] lg:min-h-[38px] py-1 rounded transition-colors cursor-pointer ${
                    currency === c
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Real-Time Theme Switcher (Auto / Light / Dark) */}
            <div
              role="group"
              aria-label="Theme mode"
              title={themeLabel}
              className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700 shrink-0"
            >
              {(
                [
                  { mode: 'system' as const, label: 'Auto', Icon: Monitor },
                  { mode: 'light' as const, label: 'Light', Icon: Sun },
                  { mode: 'dark' as const, label: 'Dark', Icon: Moon }
                ] as const
              ).map(({ mode, label, Icon }) => {
                const active = themeMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setThemeMode(mode)}
                    aria-pressed={active}
                    title={
                      mode === 'system'
                        ? `Auto (System: ${systemTheme === 'dark' ? 'Dark' : 'Light'})`
                        : `${label} theme`
                    }
                    aria-label={`${label} theme`}
                    className={`flex items-center gap-1 px-2.5 py-1 min-h-[44px] sm:min-h-[40px] rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        active ? 'text-amber-600 dark:text-amber-400' : ''
                      }`}
                    />
                    <span className="hidden xl:inline">{label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={cycleThemeMode}
              title={themeLabel}
              aria-label={themeLabel}
              className="sm:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600 shrink-0" />
              )}
            </button>

            {/* Saved List Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="View saved items"
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 min-h-[44px] text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-amber-400 rounded-lg hover:bg-slate-800 dark:hover:bg-amber-300 transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0"
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
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileSearchOpen(false);
              }}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Search Bar with Live Suggestions */}
        {mobileSearchOpen && (
          <div
            ref={mobileSearchWrapperRef}
            className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 relative"
          >
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                commitSearch(searchQuery);
              }}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="search"
                  name="q"
                  autoFocus
                  value={searchQuery}
                  onFocus={() => setIsSuggestOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSuggestOpen(true);
                  }}
                  placeholder="Search products, brands, categories..."
                  aria-label="Search products"
                  className="w-full min-h-[44px] pl-9 pr-10 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm sm:text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="min-h-[44px] px-4 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            <SearchSuggestionsDropdown
              isOpen={isSuggestOpen}
              query={searchQuery}
              suggestions={suggestions}
              onSelectQuery={commitSearch}
              onRemoveRecent={(term) => setRecentSearches(removeRecentSearch(term))}
              onClearRecent={() => setRecentSearches(clearRecentSearches())}
              onSelectCategory={handleSelectCategorySuggestion}
              onSelectBrand={handleSelectBrandSuggestion}
              onSelectStore={handleSelectStoreSuggestion}
              onSelectProduct={handleSelectProductSuggestion}
              onClose={() => setIsSuggestOpen(false)}
            />
          </div>
        )}

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
                      className={`px-3 min-h-[44px] rounded-md cursor-pointer transition-colors ${
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
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Theme ({resolvedTheme})
                </span>
                <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                  {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setThemeMode(mode)}
                      className={`px-3 min-h-[44px] rounded-md capitalize cursor-pointer transition-colors ${
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
                onClick={handleAliExpressClick}
                className="text-left px-3 min-h-[44px] py-2 rounded-lg bg-red-50 dark:bg-red-500/15 text-red-950 dark:text-red-200 font-bold border border-red-200 dark:border-red-500/30 flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ShoppingBag className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>AliExpress Global Picks</span>
                </div>
                <span className="text-xs bg-red-200 dark:bg-red-500/30 text-red-900 dark:text-red-200 px-2 py-0.5 rounded font-mono shrink-0">
                  Event
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('store')}
                className="text-left px-3 min-h-[44px] rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer"
              >
                Products &amp; Categories
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
                Releva BD Featured Picks
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
