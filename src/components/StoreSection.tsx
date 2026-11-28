import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  ShoppingCart,
  Eye,
  ExternalLink,
  Grid,
  List,
  Package,
  Compass,
  ShieldCheck,
  Cpu,
  Layers,
  Watch,
  Headphones,
  Laptop,
  Zap,
  Building2,
  Check,
  Cloud,
  Droplets,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EcomProduct, ProductCategory } from '../data/unifiedProductsData';
import { getContextualSponsors } from '../data/sponsorsData';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import {
  REGION_ORDER,
  REGION_PROFILES,
  VisitorRegionCode,
  PartnerStoreOrigin
} from '../utils/regionProfile';
import {
  STORE_CATEGORIES,
  SearchScope,
  PriceStatusFilter,
  CatalogSortBy,
  scoreProductSearchMatch,
  buildSearchSuggestions,
  loadRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearRecentSearches
} from '../utils/catalogSearch';
import { ModernProductModal } from './ModernProductModal';
import { ProductCompareDock } from './ProductCompareDock';
import { SearchSuggestionsDropdown } from './SearchSuggestionsDropdown';
import { ResilientImage } from './ResilientImage';
import { AliExpressEventBanner } from './AliExpressEventBanner';

export const StoreSection: React.FC = () => {
  const { formatPrice, addToCart, toUsdAmount, cart } = useCart();
  const {
    products,
    sponsors,
    storefrontCopy,
    selectedCategory,
    setSelectedCategory,
    selectedStoreFilter: storeFilter,
    setSelectedStoreFilter: setStoreFilter,
    searchQuery,
    setSearchQuery,
    visitorRegion,
    setVisitorRegion,
    regionProfile,
    highlightedProductId,
    setHighlightedProductId,
    getAffiliateBuyUrl,
    getAmazonSearchAffiliateUrl,
    getShopzSearchAffiliateUrl,
    getRelevaSearchUrl,
    recordAffiliateClick,
    amazonStoreUrl,
    aliexpressStoreUrl,
    shopzStoreUrl,
    relevaStoreUrl,
    exonhostStoreUrl,
    banglashoppersStoreUrl,
    illinStoreUrl,
    startechStoreUrl,
    sohojStoreUrl
  } = useProducts();

  // Complete Search & Filter Options State
  const [searchScope, setSearchScope] = useState<SearchScope>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceStatusFilter, setPriceStatusFilter] = useState<PriceStatusFilter>('all');
  const [minPriceUsd, setMinPriceUsd] = useState<number>(0);
  const [maxPriceUsd, setMaxPriceUsd] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<CatalogSortBy>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pageSize, setPageSize] = useState<number>(48);
  const [visibleCount, setVisibleCount] = useState<number>(48);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [showPartnerSearchBar, setShowPartnerSearchBar] = useState<boolean>(false);

  // Suggestions UI state
  const [isSuggestOpen, setIsSuggestOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecentSearches());
  const searchBoxWrapperRef = useRef<HTMLDivElement | null>(null);

  // Direct external partner search target
  const [targetPlatform, setTargetPlatform] = useState<PartnerStoreOrigin>('Amazon');

  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<EcomProduct | null>(null);
  const [comparedProducts, setComparedProducts] = useState<EcomProduct[]>([]);

  const savedIds = useMemo(() => new Set(cart.map((c) => c.product.id)), [cart]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxWrapperRef.current &&
        !searchBoxWrapperRef.current.contains(event.target as Node)
      ) {
        setIsSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [
    selectedCategory,
    storeFilter,
    searchQuery,
    searchScope,
    selectedBrand,
    priceStatusFilter,
    minPriceUsd,
    maxPriceUsd,
    sortBy,
    pageSize
  ]);

  const categories = STORE_CATEGORIES;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Departments (Mega Store)': products.length
    };
    categories.forEach((cat) => {
      if (cat !== 'All Departments (Mega Store)') {
        counts[cat] = products.filter((p) => p.category === cat || p.department === cat).length;
      }
    });
    return counts;
  }, [products, categories]);

  const storeCounts = useMemo(() => {
    const counts: Record<'all' | PartnerStoreOrigin, number> = {
      all: products.length,
      Amazon: 0,
      AliExpress: 0,
      'Shopz BD': 0,
      'Releva BD': 0,
      ExonHost: 0,
      BanglaShoppers: 0,
      'Illin BD': 0,
      'Star Tech': 0,
      'Sohoj Affiliates': 0
    };
    for (const item of products) {
      if (item.originStore in counts) {
        counts[item.originStore] += 1;
      }
    }
    return counts;
  }, [products]);

  const availableBrands = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of products) {
      const matchCat =
        selectedCategory === 'All Departments (Mega Store)' ||
        item.category === selectedCategory ||
        item.department === selectedCategory;
      const matchStore = storeFilter === 'all' || item.originStore === storeFilter;
      if (!matchCat || !matchStore) continue;
      const cleanBrand = item.brand?.trim();
      if (cleanBrand) {
        map.set(cleanBrand, (map.get(cleanBrand) || 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand));
  }, [products, selectedCategory, storeFilter]);

  useEffect(() => {
    if (selectedBrand !== 'all' && !availableBrands.some((b) => b.brand === selectedBrand)) {
      setSelectedBrand('all');
    }
  }, [availableBrands, selectedBrand]);

  const searchSuggestions = useMemo(
    () =>
      buildSearchSuggestions({
        query: searchQuery,
        products,
        recentSearches,
        scope: searchScope,
        limitProducts: 6
      }),
    [searchQuery, products, recentSearches, searchScope]
  );

  const filteredProducts = useMemo(() => {
    const cleanQuery = searchQuery.trim();
    const minActive = minPriceUsd > 0;
    const maxActive = maxPriceUsd < 1000;

    const scored = products
      .map((item) => {
        const matchCategory =
          selectedCategory === 'All Departments (Mega Store)'
            ? true
            : item.category === selectedCategory || item.department === selectedCategory;
        if (!matchCategory) return null;

        const matchStore = storeFilter === 'all' || item.originStore === storeFilter;
        if (!matchStore) return null;

        const matchBrand =
          selectedBrand === 'all' ||
          item.brand.trim().toLowerCase() === selectedBrand.trim().toLowerCase();
        if (!matchBrand) return null;

        const normalizedUsd = toUsdAmount(item.price, item.nativePrice, item.nativeCurrency);
        const knownPrice = normalizedUsd > 0;

        if (priceStatusFilter === 'priced' && !knownPrice) return null;
        if (priceStatusFilter === 'live-at-partner' && knownPrice) return null;

        // Strict numeric bounds: when a min or max price cap is active, unknown prices do not match.
        if (minActive && (!knownPrice || normalizedUsd < minPriceUsd)) return null;
        if (maxActive && (!knownPrice || normalizedUsd > maxPriceUsd)) return null;

        const searchResult = scoreProductSearchMatch(item, cleanQuery, searchScope);
        if (!searchResult.matched) return null;

        return {
          item,
          score: searchResult.score,
          normalizedUsd
        };
      })
      .filter((entry): entry is { item: EcomProduct; score: number; normalizedUsd: number } =>
        entry !== null
      );

    scored.sort((a, b) => {
      if (a.item.id === highlightedProductId) return -1;
      if (b.item.id === highlightedProductId) return 1;

      if (sortBy === 'relevance' && cleanQuery.length > 0 && b.score !== a.score) {
        return b.score - a.score;
      }

      if (sortBy === 'price-asc') {
        if (a.normalizedUsd <= 0 && b.normalizedUsd <= 0) return 0;
        if (a.normalizedUsd <= 0) return 1;
        if (b.normalizedUsd <= 0) return -1;
        return a.normalizedUsd - b.normalizedUsd;
      }

      if (sortBy === 'price-desc') {
        if (a.normalizedUsd <= 0 && b.normalizedUsd <= 0) return 0;
        if (a.normalizedUsd <= 0) return 1;
        if (b.normalizedUsd <= 0) return -1;
        return b.normalizedUsd - a.normalizedUsd;
      }

      if (sortBy === 'title-asc') {
        return a.item.title.localeCompare(b.item.title);
      }

      if (sortBy === 'title-desc') {
        return b.item.title.localeCompare(a.item.title);
      }

      return 0;
    });

    return scored.map((entry) => entry.item);
  }, [
    products,
    selectedCategory,
    storeFilter,
    selectedBrand,
    priceStatusFilter,
    minPriceUsd,
    maxPriceUsd,
    searchQuery,
    searchScope,
    sortBy,
    highlightedProductId,
    toUsdAmount
  ]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasActiveFilter =
    selectedCategory !== 'All Departments (Mega Store)' ||
    storeFilter !== 'all' ||
    selectedBrand !== 'all' ||
    searchQuery.trim() !== '' ||
    searchScope !== 'all' ||
    priceStatusFilter !== 'all' ||
    minPriceUsd > 0 ||
    maxPriceUsd < 1000;

  const activeFilterCount = [
    selectedCategory !== 'All Departments (Mega Store)',
    storeFilter !== 'all',
    selectedBrand !== 'all',
    searchQuery.trim() !== '',
    searchScope !== 'all',
    priceStatusFilter !== 'all',
    minPriceUsd > 0 || maxPriceUsd < 1000
  ].filter(Boolean).length;

  const handleToggleCompare = (product: EcomProduct) => {
    setComparedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory('All Departments (Mega Store)');
    setStoreFilter('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setSearchScope('all');
    setPriceStatusFilter('all');
    setMinPriceUsd(0);
    setMaxPriceUsd(1000);
    setSortBy('relevance');
  };

  const handleCommitSearch = (term: string) => {
    const clean = term.trim();
    setSearchQuery(term);
    if (clean.length >= 2) {
      setRecentSearches(saveRecentSearch(clean));
    }
    setIsSuggestOpen(false);
  };

  const handleSelectSuggestionCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setIsSuggestOpen(false);
  };

  const handleSelectSuggestionBrand = (brand: string) => {
    setSelectedBrand(brand);
    setSearchQuery('');
    setRecentSearches(saveRecentSearch(brand));
    setIsSuggestOpen(false);
  };

  const handleSelectSuggestionStore = (store: PartnerStoreOrigin) => {
    setStoreFilter(store);
    setSelectedCategory('All Departments (Mega Store)');
    setIsSuggestOpen(false);
  };

  const handleSelectSuggestionProduct = (product: EcomProduct) => {
    setHighlightedProductId(product.id);
    setRecentSearches(saveRecentSearch(product.title));
    setIsSuggestOpen(false);
    setActiveQuickViewProduct(product);
  };

  const handleSaveProduct = (product: EcomProduct, affiliateUrl: string) => {
    addToCart(
      {
        id: product.id,
        asin: product.asin,
        title: product.title,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        badge: product.badge,
        description: product.description,
        highlights: product.highlights,
        specs: product.specs,
        image: product.mainImage,
        nativePrice: product.nativePrice,
        nativeCurrency: product.nativeCurrency,
        priceStatus: product.priceStatus,
        imageIsIllustrative: product.imageIsIllustrative,
        urlKind: product.urlKind,
        csvCategory: product.csvCategory,
        sourceType: product.sourceType,
        originStore: product.originStore,
        affiliateUrl
      },
      1
    );
  };

  const livePartnerSearchHref =
    targetPlatform === 'ExonHost'
      ? exonhostStoreUrl
      : targetPlatform === 'AliExpress'
      ? aliexpressStoreUrl
      : targetPlatform === 'BanglaShoppers'
      ? banglashoppersStoreUrl
      : targetPlatform === 'Illin BD'
      ? illinStoreUrl
      : targetPlatform === 'Star Tech'
      ? startechStoreUrl
      : targetPlatform === 'Sohoj Affiliates'
      ? sohojStoreUrl
      : targetPlatform === 'Releva BD'
      ? getRelevaSearchUrl(searchQuery)
      : targetPlatform === 'Shopz BD'
      ? getShopzSearchAffiliateUrl(searchQuery)
      : getAmazonSearchAffiliateUrl(searchQuery);

  const getStoreBadgeClasses = (store: PartnerStoreOrigin) => {
    if (store === 'ExonHost') return 'bg-sky-500 text-slate-950';
    if (store === 'AliExpress') return 'bg-red-600 text-white';
    if (store === 'Shopz BD') return 'bg-emerald-600 text-white';
    if (store === 'Releva BD') return 'bg-teal-500 text-slate-950';
    if (store === 'BanglaShoppers') return 'bg-rose-500 text-white';
    if (store === 'Illin BD') return 'bg-cyan-400 text-slate-950';
    if (store === 'Star Tech') return 'bg-orange-600 text-white';
    if (store === 'Sohoj Affiliates') return 'bg-violet-600 text-white';
    return 'bg-amber-500 text-slate-950';
  };

  const getStoreCtaClasses = (store: PartnerStoreOrigin) => {
    if (store === 'ExonHost') return 'bg-sky-500 hover:bg-sky-400 text-slate-950';
    if (store === 'AliExpress') return 'bg-red-600 hover:bg-red-500 text-white';
    if (store === 'Shopz BD') return 'bg-emerald-500 hover:bg-emerald-400 text-slate-950';
    if (store === 'Releva BD') return 'bg-teal-500 hover:bg-teal-400 text-slate-950';
    if (store === 'BanglaShoppers') return 'bg-rose-500 hover:bg-rose-400 text-white';
    if (store === 'Illin BD') return 'bg-cyan-400 hover:bg-cyan-300 text-slate-950';
    if (store === 'Star Tech') return 'bg-orange-600 hover:bg-orange-500 text-white';
    if (store === 'Sohoj Affiliates') return 'bg-violet-600 hover:bg-violet-500 text-white';
    return 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950';
  };

  const getStoreCtaLabel = (product: EcomProduct) => {
    if (product.urlKind === 'portal') return `Open ${product.originStore}`;
    return `View on ${product.originStore}`;
  };

  const hasKnownPrice = (product: EcomProduct) =>
    product.nativeCurrency === 'BDT'
      ? typeof product.nativePrice === 'number' && product.nativePrice > 0
      : product.price > 0;

  return (
    <section
      id="store"
      className="pt-6 sm:pt-8 pb-12 sm:pb-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 scroll-mt-14 sm:scroll-mt-16 transition-colors"
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        {/* Storefront Catalog Top Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="min-w-0 w-full max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-amber-600 dark:text-amber-400 font-bold inline-flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 shrink-0" />
                <span>Product Catalog &amp; Categories</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
                {products.length} Products
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                {regionProfile.label}
              </span>
            </div>
            <h1 className="text-[clamp(1.3125rem,1.05rem+1.5vw,2.25rem)] font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance] leading-[1.15] break-words">
              {storefrontCopy.storeTitle}
            </h1>
            <p className="text-[clamp(1rem,0.95rem+0.2vw,1.125rem)] text-slate-600 dark:text-slate-400 mt-2 max-w-[70ch] leading-relaxed [text-wrap:pretty]">
              {storefrontCopy.storeSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap pb-1 sm:pb-0 scrollbar-none w-full min-w-0 pt-0.5">
            <a
              href={amazonStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-amazon', 'Amazon')}
              className="flex items-center gap-1.5 text-xs text-amber-950 bg-amber-400 hover:bg-amber-300 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Package className="w-3.5 h-3.5 text-slate-950" />
              <span>Amazon</span>
              <ExternalLink className="w-3 h-3 text-slate-900" />
            </a>

            <a
              href={aliexpressStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-aliexpress', 'AliExpress')}
              className="flex items-center gap-1.5 text-xs text-white bg-red-600 hover:bg-red-500 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>AliExpress</span>
              <ExternalLink className="w-3 h-3 text-white" />
            </a>

            <a
              href={shopzStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-shopz', 'Shopz BD')}
              className="flex items-center gap-1.5 text-xs text-emerald-950 bg-emerald-400 hover:bg-emerald-300 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-950" />
              <span>Shopz BD</span>
              <ExternalLink className="w-3 h-3 text-emerald-950" />
            </a>

            <a
              href={relevaStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-releva', 'Releva BD')}
              className="flex items-center gap-1.5 text-xs text-slate-950 bg-teal-400 hover:bg-teal-300 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Releva BD</span>
              <ExternalLink className="w-3 h-3 text-slate-950" />
            </a>

            <a
              href={exonhostStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-exonhost', 'ExonHost')}
              className="flex items-center gap-1.5 text-xs text-slate-950 bg-sky-400 hover:bg-sky-300 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Cloud className="w-3.5 h-3.5 text-slate-950" />
              <span>ExonHost</span>
              <ExternalLink className="w-3 h-3 text-slate-950" />
            </a>

            <a
              href={banglashoppersStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-banglashoppers', 'BanglaShoppers')}
              className="flex items-center gap-1.5 text-xs text-white bg-rose-500 hover:bg-rose-400 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Droplets className="w-3.5 h-3.5 text-white" />
              <span>BanglaShoppers</span>
              <ExternalLink className="w-3 h-3 text-white" />
            </a>

            <a
              href={illinStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-illin', 'Illin BD')}
              className="flex items-center gap-1.5 text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Illin BD</span>
              <ExternalLink className="w-3 h-3 text-slate-950" />
            </a>

            <a
              href={startechStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-startech', 'Star Tech')}
              className="flex items-center gap-1.5 text-xs text-white bg-orange-600 hover:bg-orange-500 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Watch className="w-3.5 h-3.5 text-white" />
              <span>Star Tech</span>
              <ExternalLink className="w-3 h-3 text-white" />
            </a>

            <a
              href={sohojStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-sohoj', 'Sohoj Affiliates')}
              className="flex items-center gap-1.5 text-xs text-white bg-violet-600 hover:bg-violet-500 font-extrabold px-3 min-h-[44px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Sohoj Affiliates</span>
              <ExternalLink className="w-3 h-3 text-white" />
            </a>
          </div>
        </div>

        {/* CATEGORIES & COMPLETE SEARCH SYSTEM WORKBENCH */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs mb-6 space-y-4 transition-colors">
          {/* 1. Prominent Department & Category Switcher Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-100 dark:border-slate-800">
            <div
              role="tablist"
              aria-label="Product categories"
              className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full flex-1 min-w-0"
            >
              {categories.map((c) => {
                const count = categoryCounts[c] || 0;
                const isSelected = selectedCategory === c;
                const isShopzTab = c === 'Shopz BD Tech Deals';
                const isStarTechTab = c === 'Star Tech BD Gadgets';
                const isBanglaShoppersTab = c === 'BanglaShoppers Beauty';
                const isIllinTab = c === 'Illin BD Home & Tech';
                const isSohojTab = c === 'Sohoj Affiliate Network';
                const isRelevaTab = c === 'Releva BD Picks';
                const isCloudTab = c === 'Cloud Hosting & Domains';
                const isAliExpressTab = c === 'AliExpress Global Picks';
                const isMegaStoreTab = c === 'All Departments (Mega Store)';

                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3.5 min-h-[44px] py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? isShopzTab
                          ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                          : isStarTechTab
                          ? 'bg-orange-600 text-white shadow-xs font-extrabold'
                          : isBanglaShoppersTab
                          ? 'bg-rose-500 text-white shadow-xs font-extrabold'
                          : isIllinTab
                          ? 'bg-cyan-400 text-slate-950 shadow-xs font-extrabold'
                          : isSohojTab
                          ? 'bg-violet-600 text-white shadow-xs font-extrabold'
                          : isRelevaTab
                          ? 'bg-teal-500 text-slate-950 shadow-xs font-extrabold'
                          : isCloudTab
                          ? 'bg-sky-500 text-slate-950 shadow-xs font-extrabold'
                          : isAliExpressTab
                          ? 'bg-red-600 text-white shadow-xs font-extrabold'
                          : 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-xs'
                        : isShopzTab
                        ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-950 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 font-bold'
                        : isStarTechTab
                        ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-950 dark:text-orange-300 border border-orange-200/80 dark:border-orange-500/30 hover:bg-orange-100 dark:hover:bg-orange-500/25 font-bold'
                        : isBanglaShoppersTab
                        ? 'bg-rose-50 dark:bg-rose-500/15 text-rose-950 dark:text-rose-300 border border-rose-200/80 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/25 font-bold'
                        : isIllinTab
                        ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-950 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-500/30 hover:bg-cyan-100 dark:hover:bg-cyan-500/25 font-bold'
                        : isSohojTab
                        ? 'bg-violet-50 dark:bg-violet-500/15 text-violet-950 dark:text-violet-300 border border-violet-200/80 dark:border-violet-500/30 hover:bg-violet-100 dark:hover:bg-violet-500/25 font-bold'
                        : isRelevaTab
                        ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-950 dark:text-teal-300 border border-teal-200/80 dark:border-teal-500/30 hover:bg-teal-100 dark:hover:bg-teal-500/25 font-bold'
                        : isCloudTab
                        ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-950 dark:text-sky-300 border border-sky-200/80 dark:border-sky-500/30 hover:bg-sky-100 dark:hover:bg-sky-500/25 font-bold'
                        : isAliExpressTab
                        ? 'bg-red-50 dark:bg-red-500/15 text-red-950 dark:text-red-300 border border-red-200/80 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/25 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isMegaStoreTab && <Compass className="w-3.5 h-3.5 opacity-75" />}
                    {isAliExpressTab && <ShoppingBag className="w-3.5 h-3.5" />}
                    {isBanglaShoppersTab && <Droplets className="w-3.5 h-3.5" />}
                    {isStarTechTab && <Watch className="w-3.5 h-3.5" />}
                    {(isShopzTab || isRelevaTab || isIllinTab || isSohojTab) && (
                      <Building2 className="w-3.5 h-3.5" />
                    )}
                    {isCloudTab && <Cloud className="w-3.5 h-3.5" />}
                    {c.includes('Audio') && <Headphones className="w-3.5 h-3.5 opacity-75" />}
                    {c.includes('Computers') && <Laptop className="w-3.5 h-3.5 opacity-75" />}
                    {c.includes('Wearables') && <Watch className="w-3.5 h-3.5 opacity-75" />}
                    {c.includes('Smart Home') && <Zap className="w-3.5 h-3.5 opacity-75" />}
                    {c.includes('Electronics') && <Cpu className="w-3.5 h-3.5 opacity-75" />}

                    <span>{c}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
                        isSelected
                          ? 'bg-slate-800 dark:bg-slate-950 text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle + Advanced Search Options Toggle */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <button
                type="button"
                onClick={() => setShowAdvancedSearch((prev) => !prev)}
                aria-expanded={showAdvancedSearch}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Search Options</span>
                {activeFilterCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono tabular-nums">
                    {activeFilterCount}
                  </span>
                )}
                {showAdvancedSearch ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`min-h-[44px] min-w-[44px] p-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Grid View"
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`min-h-[44px] min-w-[44px] p-2 rounded flex items-center justify-center transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="List View"
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Primary Search Input with Live Search Suggestions & Search Scope */}
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-3 text-xs">
            <div ref={searchBoxWrapperRef} className="relative flex-1 min-w-0">
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommitSearch(searchQuery);
                }}
                className="flex flex-col sm:flex-row items-stretch gap-2"
              >
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="catalog-search-input"
                    type="search"
                    name="q"
                    placeholder="Search all products, brands, specs, ASINs, categories, or partner stores..."
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
                    aria-label="Search store catalog with suggestions"
                    aria-expanded={isSuggestOpen}
                    aria-autocomplete="list"
                    className="w-full min-h-[44px] pl-10 pr-20 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white dark:focus:bg-slate-900 text-xs sm:text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1 px-1.5 py-1 rounded hover:bg-slate-200/70 dark:hover:bg-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {/* Search In Scope Selector */}
                <select
                  value={searchScope}
                  onChange={(e) => setSearchScope(e.target.value as SearchScope)}
                  aria-label="Search field scope"
                  className="min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer shrink-0"
                >
                  <option value="all">Search: All Fields</option>
                  <option value="title-brand">Search: Title &amp; Brand</option>
                  <option value="specs-tags">Search: Specs &amp; Details</option>
                  <option value="category-store">Search: Category &amp; Store</option>
                </select>

                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-extrabold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Catalog</span>
                </button>
              </form>

              <SearchSuggestionsDropdown
                isOpen={isSuggestOpen}
                query={searchQuery}
                suggestions={searchSuggestions}
                onSelectQuery={handleCommitSearch}
                onRemoveRecent={(term) => setRecentSearches(removeRecentSearch(term))}
                onClearRecent={() => setRecentSearches(clearRecentSearches())}
                onSelectCategory={handleSelectSuggestionCategory}
                onSelectBrand={handleSelectSuggestionBrand}
                onSelectStore={handleSelectSuggestionStore}
                onSelectProduct={handleSelectSuggestionProduct}
                onClose={() => setIsSuggestOpen(false)}
              />
            </div>

            {/* Direct Live Partner Search Trigger */}
            <button
              type="button"
              onClick={() => setShowPartnerSearchBar((prev) => !prev)}
              aria-expanded={showPartnerSearchBar}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Live Partner Search</span>
              {showPartnerSearchBar ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Quick Search Chips Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
              Quick Filters:
            </span>
            {[
              'Smartwatch',
              'POEDAGAR Watch',
              'COSRX',
              'Wireless Earbuds',
              'Portable Fan',
              'Laptop',
              'Coffee Maker',
              'USB-C Dock',
              'Power Station',
              'Monitor'
            ].map((term) => {
              const active = searchQuery.trim().toLowerCase() === term.toLowerCase();
              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleCommitSearch(active ? '' : term)}
                  className={`px-3 min-h-[44px] py-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-amber-400 border-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                  }`}
                >
                  {term}
                </button>
              );
            })}
          </div>

          {/* 3. All Advanced Search Options Panel (Collapsible on all screens) */}
          {showAdvancedSearch && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              {/* Store Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                {(
                  [
                    { key: 'all', label: 'All Stores', activeClass: 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white' },
                    { key: 'Amazon', label: 'Amazon', activeClass: 'bg-amber-400 text-slate-950' },
                    { key: 'AliExpress', label: 'AliExpress', activeClass: 'bg-red-600 text-white' },
                    { key: 'Shopz BD', label: 'Shopz BD', activeClass: 'bg-emerald-500 text-slate-950' },
                    { key: 'Star Tech', label: 'Star Tech', activeClass: 'bg-orange-600 text-white' },
                    { key: 'BanglaShoppers', label: 'BanglaShoppers', activeClass: 'bg-rose-500 text-white' },
                    { key: 'Illin BD', label: 'Illin BD', activeClass: 'bg-cyan-400 text-slate-950' },
                    { key: 'Releva BD', label: 'Releva BD', activeClass: 'bg-teal-400 text-slate-950' },
                    { key: 'ExonHost', label: 'ExonHost', activeClass: 'bg-sky-500 text-slate-950' },
                    { key: 'Sohoj Affiliates', label: 'Sohoj Affiliates', activeClass: 'bg-violet-600 text-white' }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStoreFilter(tab.key)}
                    className={`px-3 min-h-[44px] py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1 ${
                      storeFilter === tab.key
                        ? `${tab.activeClass} shadow-2xs`
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="font-mono text-[10px] opacity-75">
                      ({storeCounts[tab.key]})
                    </span>
                  </button>
                ))}
              </div>

              {/* Granular Options Grid: Category Dropdown, Brand, Price Status, Min/Max Price, Region, Sort, Page Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
                {/* Category Select */}
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Department / Category
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label="Filter by category"
                    className="min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({categoryCounts[cat] || 0})
                      </option>
                    ))}
                  </select>
                </label>

                {/* Brand Filter */}
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Brand ({availableBrands.length})
                  </span>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    aria-label="Filter by brand"
                    className="min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">All Brands</option>
                    {availableBrands.map((b) => (
                      <option key={b.brand} value={b.brand}>
                        {b.brand} ({b.count})
                      </option>
                    ))}
                  </select>
                </label>

                {/* Pricing Status Filter */}
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Price Display
                  </span>
                  <select
                    value={priceStatusFilter}
                    onChange={(e) => setPriceStatusFilter(e.target.value as PriceStatusFilter)}
                    aria-label="Filter by price status"
                    className="min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">All Listings</option>
                    <option value="priced">With Listed Price Only</option>
                    <option value="live-at-partner">Live Price on Partner</option>
                  </select>
                </label>

                {/* Price Range (Min - Max) */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Price Range (USD ref)</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                      ${minPriceUsd} – {maxPriceUsd >= 1000 ? 'All' : `$${maxPriceUsd}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={980}
                      step={5}
                      value={minPriceUsd}
                      onChange={(e) =>
                        setMinPriceUsd(Math.max(0, Math.min(Number(e.target.value) || 0, maxPriceUsd)))
                      }
                      aria-label="Minimum USD price"
                      placeholder="Min"
                      className="w-16 min-h-[44px] px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                    <input
                      type="range"
                      min={20}
                      max={1000}
                      step={20}
                      value={maxPriceUsd}
                      onChange={(e) => {
                        const nextMax = Number(e.target.value);
                        setMaxPriceUsd(nextMax);
                        if (minPriceUsd > nextMax) setMinPriceUsd(nextMax);
                      }}
                      aria-label="Maximum USD price cap"
                      className="flex-1 min-h-[44px] accent-slate-900 dark:accent-amber-400 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Region Priority */}
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Shopping Region</span>
                  </span>
                  <select
                    value={visitorRegion}
                    onChange={(e) => setVisitorRegion(e.target.value as VisitorRegionCode)}
                    aria-label="Shopping region"
                    className="min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
                  >
                    {REGION_ORDER.map((code) => (
                      <option key={code} value={code}>
                        {REGION_PROFILES[code].label}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Sort & Per-Page */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Sort &amp; Show
                  </span>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as CatalogSortBy)}
                      aria-label="Sort products"
                      className="flex-1 min-w-0 min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 px-2 text-xs focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
                    >
                      <option value="relevance">Best Match</option>
                      <option value="featured">Featured Order</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="title-asc">Name: A–Z</option>
                      <option value="title-desc">Name: Z–A</option>
                    </select>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      aria-label="Results per page"
                      className="w-16 min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 px-1.5 text-xs font-mono focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer shrink-0"
                    >
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                      <option value={120}>120</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Expandable Direct Live Partner Search Strip */}
          {showPartnerSearchBar && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Direct Partner Site Search
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Choose a partner store to open live search results using your current query.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex flex-wrap bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-0.5">
                    {(
                      [
                        { name: 'Amazon', activeClass: 'bg-amber-500 text-slate-950' },
                        { name: 'AliExpress', activeClass: 'bg-red-600 text-white' },
                        { name: 'Shopz BD', activeClass: 'bg-emerald-500 text-slate-950' },
                        { name: 'Star Tech', activeClass: 'bg-orange-600 text-white' },
                        { name: 'BanglaShoppers', activeClass: 'bg-rose-500 text-white' },
                        { name: 'Illin BD', activeClass: 'bg-cyan-400 text-slate-950' },
                        { name: 'Releva BD', activeClass: 'bg-teal-400 text-slate-950' },
                        { name: 'ExonHost', activeClass: 'bg-sky-400 text-slate-950' },
                        { name: 'Sohoj Affiliates', activeClass: 'bg-violet-600 text-white' }
                      ] as const
                    ).map((plat) => (
                      <button
                        key={plat.name}
                        type="button"
                        onClick={() => setTargetPlatform(plat.name)}
                        className={`px-2.5 min-h-[40px] py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                          targetPlatform === plat.name
                            ? `${plat.activeClass} shadow-xs`
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {plat.name}
                      </button>
                    ))}
                  </div>

                  <a
                    href={livePartnerSearchHref}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    onClick={() =>
                      recordAffiliateClick(`partner-search-${targetPlatform.toLowerCase()}`, targetPlatform)
                    }
                    className={`px-4 min-h-[44px] py-2 font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${getStoreCtaClasses(
                      targetPlatform
                    )}`}
                  >
                    <span>
                      {targetPlatform === 'Amazon' ||
                      targetPlatform === 'Shopz BD' ||
                      targetPlatform === 'Releva BD'
                        ? `Search ${targetPlatform}`
                        : `Open ${targetPlatform}`}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filter Summary & Removable Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Showing{' '}
              <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                {visibleProducts.length}
              </strong>{' '}
              of{' '}
              <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
                {filteredProducts.length}
              </strong>{' '}
              matching products
            </span>

            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-semibold cursor-pointer"
              >
                <span>Query: &quot;{searchQuery.trim()}&quot;</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {storeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setStoreFilter('all')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-500/20 text-sky-900 dark:text-sky-300 font-semibold cursor-pointer"
              >
                <span>Store: {storeFilter}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {selectedCategory !== 'All Departments (Mega Store)' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All Departments (Mega Store)')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-semibold cursor-pointer"
              >
                <span>Category: {selectedCategory}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {selectedBrand !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedBrand('all')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <span>Brand: {selectedBrand}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {priceStatusFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setPriceStatusFilter('all')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <span>
                  {priceStatusFilter === 'priced' ? 'With Listed Price' : 'Live Price on Partner'}
                </span>
                <X className="w-3 h-3" />
              </button>
            )}

            {(minPriceUsd > 0 || maxPriceUsd < 1000) && (
              <button
                type="button"
                onClick={() => {
                  setMinPriceUsd(0);
                  setMaxPriceUsd(1000);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold font-mono cursor-pointer"
              >
                <span>
                  ${minPriceUsd} – {maxPriceUsd >= 1000 ? 'Any' : `$${maxPriceUsd}`}
                </span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 underline underline-offset-4 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* RESULTS */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-14 sm:py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 sm:p-8">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              No curated items match those search options
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
              Try clearing one of your active filters, changing the search scope, or searching directly on a partner store.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleClearFilters}
                className="px-4 min-h-[44px] py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
              {searchQuery.trim() && (
                <>
                  <a
                    href={getAmazonSearchAffiliateUrl(searchQuery)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    onClick={() => recordAffiliateClick('empty-search-amazon', 'Amazon')}
                    className="px-4 min-h-[44px] py-2 bg-[#FF9900] text-slate-950 rounded-xl text-xs font-extrabold hover:bg-[#e88b00] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Search &quot;{searchQuery}&quot; on Amazon</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={getShopzSearchAffiliateUrl(searchQuery)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    onClick={() => recordAffiliateClick('empty-search-shopz', 'Shopz BD')}
                    className="px-4 min-h-[44px] py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-extrabold hover:bg-emerald-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Search &quot;{searchQuery}&quot; on Shopz BD</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={getRelevaSearchUrl(searchQuery)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    onClick={() => recordAffiliateClick('empty-search-releva', 'Releva BD')}
                    className="px-4 min-h-[44px] py-2 bg-teal-500 text-slate-950 rounded-xl text-xs font-extrabold hover:bg-teal-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Search &quot;{searchQuery}&quot; on Releva BD</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 min-[1025px]:grid-cols-4 min-[1441px]:grid-cols-5 gap-2.5 sm:gap-4 min-[1025px]:gap-5 xl:gap-6 items-stretch mb-8">
            {visibleProducts.map((product) => {
              const isCompared = comparedProducts.some((p) => p.id === product.id);
              const affiliateUrl = getAffiliateBuyUrl(product);
              const isHighlighted = product.id === highlightedProductId;
              const knownPrice = hasKnownPrice(product);
              const hasDiscount =
                knownPrice &&
                typeof product.originalPrice === 'number' &&
                product.originalPrice > product.price &&
                product.nativeCurrency !== 'BDT';

              return (
                <article
                  id={`product-${product.id}`}
                  key={product.id}
                  onClick={() => setActiveQuickViewProduct(product)}
                  className={`h-full min-w-0 responsive-card group bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border flex flex-col justify-between overflow-hidden cursor-pointer relative ${
                    isHighlighted
                      ? 'ring-2 ring-amber-500 shadow-xl border-amber-400'
                      : 'border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  {/* Visual Stage (Clean unblocked aspect-ratio container) */}
                  <div className="relative w-full aspect-[4/3] bg-white p-2 sm:p-3 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <ResilientImage
                      src={product.mainImage}
                      alt={product.title}
                      className="max-w-full max-h-full w-auto h-auto object-contain responsive-card-media"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Body Metadata & Details */}
                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between gap-2 sm:gap-3 min-w-0">
                    <div className="min-w-0">
                      {/* Non-overlapping Badge & Origin Metadata Bar */}
                      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2 min-w-0">
                        <span
                          className={`font-extrabold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider truncate max-w-[65%] ${getStoreBadgeClasses(
                            product.originStore
                          )}`}
                        >
                          {product.badge || product.originStore}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate min-w-0">
                          {product.brand}
                        </span>
                      </div>

                      <div className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 truncate mb-0.5 sm:mb-1">
                        {product.csvCategory || product.category}
                      </div>

                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white mb-1 sm:mb-1.5 leading-snug line-clamp-2 min-h-[2.125rem] sm:min-h-[2.6rem] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {product.title}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug sm:leading-relaxed min-h-[1.875rem] sm:min-h-[2.4rem]">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 sm:space-y-2.5 min-w-0">
                      <div className="flex items-baseline justify-between gap-1.5 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 min-w-0">
                          <span
                            className={
                              knownPrice
                                ? 'text-sm sm:text-base md:text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums truncate max-w-full'
                                : 'text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 leading-tight truncate max-w-full'
                            }
                          >
                            {knownPrice
                              ? formatPrice(product.price, product.nativePrice, product.nativeCurrency)
                              : 'See Price on Partner'}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] sm:text-xs font-mono text-slate-400 line-through tabular-nums">
                              {formatPrice(product.originalPrice!)}
                            </span>
                          )}
                          {knownPrice && (
                            <span className="hidden sm:inline text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                              Listed Price
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-[9px] sm:text-[10px] bg-slate-50 dark:bg-slate-800/80 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md sm:rounded-lg border border-slate-200/70 dark:border-slate-700 font-semibold flex items-center justify-between gap-1.5 min-w-0">
                        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate min-w-0">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{product.deliveryEstimate}</span>
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 min-w-0">
                        <a
                          href={affiliateUrl}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            recordAffiliateClick(product.id, product.originStore, product.category);
                          }}
                          className={`w-full min-w-0 min-h-[38px] sm:min-h-[42px] py-1.5 sm:py-2 px-2 sm:px-2.5 font-extrabold rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shadow-xs ${getStoreCtaClasses(
                            product.originStore
                          )}`}
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          <span className="truncate">{getStoreCtaLabel(product)}</span>
                          <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                        </a>

                        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveQuickViewProduct(product);
                            }}
                            title={`Quick look ${product.title}`}
                            aria-label={`Quick look ${product.title}`}
                            className="min-h-[36px] sm:min-h-[40px] p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg sm:rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCompare(product);
                            }}
                            title={isCompared ? 'Remove from comparison' : 'Compare product'}
                            aria-label={isCompared ? `Remove ${product.title} from comparison` : `Compare ${product.title}`}
                            className={`min-h-[36px] sm:min-h-[40px] p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                              isCompared
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveProduct(product, affiliateUrl);
                            }}
                            className={`min-h-[36px] sm:min-h-[40px] p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                              savedIds.has(product.id)
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                            }`}
                            title={savedIds.has(product.id) ? 'Saved in list' : 'Save to List'}
                            aria-label={`Save ${product.title} to List`}
                          >
                            {savedIds.has(product.id) ? (
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            ) : (
                              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* RESULTS: List View Mode */
          <div className="space-y-4 mb-8">
            {visibleProducts.map((product) => {
              const affiliateUrl = getAffiliateBuyUrl(product);
              const isCompared = comparedProducts.some((p) => p.id === product.id);
              const knownPrice = hasKnownPrice(product);
              const hasDiscount =
                knownPrice &&
                typeof product.originalPrice === 'number' &&
                product.originalPrice > product.price &&
                product.nativeCurrency !== 'BDT';

              return (
                <article
                  id={`product-${product.id}`}
                  key={product.id}
                  onClick={() => setActiveQuickViewProduct(product)}
                  className="responsive-card group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 cursor-pointer relative"
                >
                  <div className="w-full sm:w-52 md:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-white p-2.5 border border-slate-100 dark:border-slate-800 shrink-0 relative flex items-center justify-center">
                    <ResilientImage
                      src={product.mainImage}
                      alt={product.title}
                      className="max-w-full max-h-full w-auto h-auto object-contain responsive-card-media"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
                      {product.badge && (
                        <span
                          className={`font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${getStoreBadgeClasses(
                            product.originStore
                          )}`}
                        >
                          {product.badge}
                        </span>
                      )}
                      <span className="uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 text-[11px]">
                        {product.csvCategory ? `${product.category} · ${product.csvCategory}` : product.category}
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                        {product.originStore}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="min-h-[44px] text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{product.deliveryEstimate}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCompare(product);
                        }}
                        className={`min-h-[44px] flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isCompared
                            ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isCompared ? 'Compared' : 'Compare'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-60 shrink-0 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-3">
                    <div className="text-left md:text-right w-full">
                      <div className="flex items-baseline md:justify-end gap-2">
                        <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                          {knownPrice
                            ? formatPrice(product.price, product.nativePrice, product.nativeCurrency)
                            : 'See Price on Partner'}
                        </div>
                        {hasDiscount && (
                          <span className="text-xs font-mono text-slate-400 line-through tabular-nums">
                            {formatPrice(product.originalPrice!)}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {knownPrice ? 'Listed Price' : `Live price on ${product.originStore}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <a
                        href={affiliateUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          recordAffiliateClick(product.id, product.originStore, product.category);
                        }}
                        className={`flex-1 min-h-[44px] py-2.5 px-3 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap ${getStoreCtaClasses(
                          product.originStore
                        )}`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                        <span>{getStoreCtaLabel(product)}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveProduct(product, affiliateUrl);
                        }}
                        className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                          savedIds.has(product.id)
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                        }`}
                        title={savedIds.has(product.id) ? 'Saved in list' : 'Save to List'}
                        aria-label={`Save ${product.title} to List`}
                      >
                        {savedIds.has(product.id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {filteredProducts.length > visibleProducts.length && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + pageSize)}
              className="px-5 min-h-[44px] py-2.5 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Load {Math.min(pageSize, filteredProducts.length - visibleProducts.length)} More Listings
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filteredProducts.length)}
              className="px-4 min-h-[44px] py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Show All ({filteredProducts.length})
            </button>
          </div>
        )}

        {/* Clear Near-Catalog Affiliate Disclosure & Checkout Notice */}
        <div className="mb-8 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="flex items-start sm:items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Affiliate Disclosure:</strong> As an Amazon Associate and affiliate partner with AliExpress, Shopz BD, Star Tech, BanglaShoppers, Illin BD, Releva BD, ExonHost, and Sohoj Affiliates, {storefrontCopy.siteName} earns from qualifying purchases at no extra cost to you.
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 sm:pl-6">
            {storefrontCopy.checkoutNotice}
          </p>
        </div>

        <div className="mb-8">
          <AliExpressEventBanner variant="responsive-strip" />
        </div>

        {sponsors.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="text-amber-700 dark:text-amber-400">Sponsored</span>
                <span aria-hidden="true">·</span>
                <span>Featured Partner Spotlights</span>
              </div>
              <a
                href="#sponsors"
                className="min-h-[44px] inline-flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                View all {sponsors.length} partner offers
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {getContextualSponsors(sponsors, selectedCategory, 2).map((sp) => (
                <a
                  key={sp.id}
                  href={sp.url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={() => recordAffiliateClick(sp.id)}
                  className="responsive-card group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center justify-between gap-4 transition-all duration-200"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span className="text-amber-700 dark:text-amber-400">Sponsored</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{sp.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {sp.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                      {sp.subtitle}
                    </p>
                  </div>
                  <span className="px-3 min-h-[44px] py-2 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                    <span>{sp.ctaLabel}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <ProductCompareDock
          comparedProducts={comparedProducts}
          onRemove={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
          onClear={() => setComparedProducts([])}
        />

        <ModernProductModal
          product={activeQuickViewProduct}
          onClose={() => setActiveQuickViewProduct(null)}
          onToggleCompare={handleToggleCompare}
          isCompared={comparedProducts.some((p) => p.id === activeQuickViewProduct?.id)}
        />
      </div>
    </section>
  );
};
