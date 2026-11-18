import React, { useState, useMemo } from 'react';
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
  Info
} from 'lucide-react';
import { EcomProduct, ProductCategory, buildRelevaProductUrl } from '../data/unifiedProductsData';
import { getContextualSponsors } from '../data/sponsorsData';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import {
  REGION_ORDER,
  REGION_PROFILES,
  VisitorRegionCode,
  PartnerStoreOrigin
} from '../utils/regionProfile';
import { ModernProductModal } from './ModernProductModal';
import { ProductCompareDock } from './ProductCompareDock';
import { ResilientImage } from './ResilientImage';

export const StoreSection: React.FC = () => {
  const { formatPrice, addToCart, toUsdAmount, ratesDisclaimer } = useCart();
  const {
    products,
    sponsors,
    storefrontCopy,
    selectedCategory,
    setSelectedCategory,
    selectedStoreFilter: storeFilter,
    setSelectedStoreFilter: setStoreFilter,
    visitorRegion,
    setVisitorRegion,
    regionProfile,
    highlightedProductId,
    getAffiliateBuyUrl,
    getAmazonSearchAffiliateUrl,
    getShopzSearchAffiliateUrl,
    recordAffiliateClick,
    amazonStoreUrl,
    shopzStoreUrl,
    exonhostStoreUrl,
    aliexpressStoreUrl,
    alibabaStoreUrl
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pricedOnly, setPricedOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Live partner store search query
  const [partnerQuery, setPartnerQuery] = useState<string>('');
  const [targetPlatform, setTargetPlatform] = useState<PartnerStoreOrigin>('Amazon');

  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<EcomProduct | null>(null);
  const [comparedProducts, setComparedProducts] = useState<EcomProduct[]>([]);

  const relevaStoreUrl = buildRelevaProductUrl(130);

  const categories: ProductCategory[] = [
    'All Departments (Mega Store)',
    'Electronics & Gadgets',
    'Computers & Accessories',
    'Audio & Headphones',
    'Smart Home & Power',
    'Wearables & Smartwatches',
    'Office & Workspace',
    'Shopz BD Tech Deals',
    'Releva BD Picks',
    'Cloud Hosting & Domains'
  ];

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
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchCategory =
          selectedCategory === 'All Departments (Mega Store)'
            ? true
            : item.category === selectedCategory || item.department === selectedCategory;

        const matchStore = storeFilter === 'all' || item.originStore === storeFilter;

        const q = searchQuery.trim().toLowerCase();
        const matchSearch =
          q === '' ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          (item.csvCategory && item.csvCategory.toLowerCase().includes(q)) ||
          (item.department && item.department.toLowerCase().includes(q)) ||
          (item.asin && item.asin.toLowerCase().includes(q));

        const normalizedUsd = toUsdAmount(item.price, item.nativePrice, item.nativeCurrency);
        const hasKnownPrice = normalizedUsd > 0;
        const matchPricedOnly = !pricedOnly || hasKnownPrice;
        // Strict rule: when a budget slider (< 1000) is active, unknown prices ($0) do NOT satisfy budget constraints.
        const matchPrice = maxPrice >= 1000 ? true : hasKnownPrice && normalizedUsd <= maxPrice;

        return matchCategory && matchStore && matchSearch && matchPricedOnly && matchPrice;
      })
      .sort((a, b) => {
        if (a.id === highlightedProductId) return -1;
        if (b.id === highlightedProductId) return 1;

        const priceA = toUsdAmount(a.price, a.nativePrice, a.nativeCurrency);
        const priceB = toUsdAmount(b.price, b.nativePrice, b.nativeCurrency);

        if (sortBy === 'price-asc') {
          if (priceA <= 0 && priceB <= 0) return 0;
          if (priceA <= 0) return 1;
          if (priceB <= 0) return -1;
          return priceA - priceB;
        }
        if (sortBy === 'price-desc') {
          if (priceA <= 0 && priceB <= 0) return 0;
          if (priceA <= 0) return 1;
          if (priceB <= 0) return -1;
          return priceB - priceA;
        }
        return 0;
      });
  }, [
    products,
    selectedCategory,
    storeFilter,
    searchQuery,
    sortBy,
    pricedOnly,
    maxPrice,
    highlightedProductId,
    toUsdAmount
  ]);

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
    setSearchQuery('');
    setPricedOnly(false);
    setMaxPrice(1000);
    setSortBy('featured');
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
      : targetPlatform === 'Alibaba'
      ? alibabaStoreUrl
      : targetPlatform === 'Releva BD'
      ? relevaStoreUrl
      : targetPlatform === 'Shopz BD'
      ? getShopzSearchAffiliateUrl(partnerQuery)
      : getAmazonSearchAffiliateUrl(partnerQuery);

  const getStoreBadgeClasses = (store: PartnerStoreOrigin) => {
    if (store === 'ExonHost') return 'bg-sky-500 text-slate-950';
    if (store === 'Shopz BD') return 'bg-emerald-600 text-white';
    if (store === 'Releva BD') return 'bg-teal-500 text-slate-950';
    if (store === 'AliExpress') return 'bg-orange-500 text-slate-950';
    if (store === 'Alibaba') return 'bg-indigo-600 text-white';
    return 'bg-amber-500 text-slate-950';
  };

  const getStoreCtaClasses = (store: PartnerStoreOrigin) => {
    if (store === 'ExonHost') return 'bg-sky-500 hover:bg-sky-400 text-slate-950';
    if (store === 'Shopz BD') return 'bg-emerald-500 hover:bg-emerald-400 text-slate-950';
    if (store === 'Releva BD') return 'bg-teal-500 hover:bg-teal-400 text-slate-950';
    if (store === 'AliExpress') return 'bg-orange-500 hover:bg-orange-400 text-slate-950';
    if (store === 'Alibaba') return 'bg-indigo-600 hover:bg-indigo-500 text-white';
    return 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950';
  };

  const getStoreCtaLabel = (product: EcomProduct) => {
    if (product.urlKind === 'portal') return `Open ${product.originStore}`;
    if (product.originStore === 'Alibaba') return 'Open Alibaba';
    return `View on ${product.originStore}`;
  };

  const hasKnownPrice = (product: EcomProduct) =>
    product.nativeCurrency === 'BDT'
      ? typeof product.nativePrice === 'number' && product.nativePrice > 0
      : product.price > 0;

  return (
    <section
      id="store"
      className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 scroll-mt-14 sm:scroll-mt-16 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                <span>Curated Affiliate Catalog</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
                {products.length} Listings
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                {regionProfile.label}: {regionProfile.storePriority[0]} First
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              {storefrontCopy.storeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              {storefrontCopy.storeSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <a
              href={amazonStoreUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-amazon', 'Amazon')}
              className="flex items-center gap-1.5 text-xs text-amber-950 bg-amber-400 hover:bg-amber-300 font-extrabold px-3 min-h-[40px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Package className="w-4 h-4 text-slate-950" />
              <span>Amazon</span>
              <ExternalLink className="w-3 h-3 text-slate-900" />
            </a>

            <a
              href={shopzStoreUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-shopz', 'Shopz BD')}
              className="flex items-center gap-1.5 text-xs text-emerald-950 bg-emerald-400 hover:bg-emerald-300 font-extrabold px-3 min-h-[40px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Building2 className="w-4 h-4 text-emerald-950" />
              <span>Shopz BD</span>
              <ExternalLink className="w-3 h-3 text-emerald-950" />
            </a>

            <a
              href={relevaStoreUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-releva', 'Releva BD')}
              className="flex items-center gap-1.5 text-xs text-slate-950 bg-teal-400 hover:bg-teal-300 font-extrabold px-3 min-h-[40px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>Releva BD</span>
              <ExternalLink className="w-3 h-3 text-slate-950" />
            </a>

            <a
              href={aliexpressStoreUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-aliexpress', 'AliExpress')}
              className="flex items-center gap-1.5 text-xs text-slate-950 bg-orange-400 hover:bg-orange-300 font-extrabold px-3 min-h-[40px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>AliExpress</span>
              <ExternalLink className="w-3 h-3 text-slate-950" />
            </a>

            <a
              href={alibabaStoreUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-alibaba', 'Alibaba')}
              className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-500 font-extrabold px-3 min-h-[40px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>Alibaba</span>
              <ExternalLink className="w-3 h-3 text-white" />
            </a>

            <a
              href={exonhostStoreUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('store-header-exonhost', 'ExonHost')}
              className="flex items-center gap-1.5 text-xs text-slate-950 bg-sky-400 hover:bg-sky-300 font-extrabold px-3 min-h-[40px] py-2 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Cloud className="w-4 h-4 text-slate-950" />
              <span>ExonHost</span>
              <ExternalLink className="w-3 h-3 text-slate-950" />
            </a>
          </div>
        </div>

        {/* Truthful Affiliate Disclosure, Regional Availability & Illustrative Imagery Banner */}
        <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-600 dark:text-slate-300 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Affiliate Disclosure &amp; Pricing Note:</strong>{' '}
              As an Amazon Associate and partner publisher, Camellia Shop earns from qualifying purchases. Product photos are illustrative thumbnails.{' '}
              <span className="text-slate-500 dark:text-slate-400">{regionProfile.availabilityNote}</span>
            </p>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 lg:text-right max-w-sm">
            {ratesDisclaimer}
          </span>
        </div>

        {/* DIRECT PARTNER STORE SEARCH */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 shadow-md border border-slate-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Search className="w-4 h-4 shrink-0" />
                <span>Direct Partner Store Search</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Search Amazon, Shopz BD, Releva BD, AliExpress, Alibaba &amp; ExonHost
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Filter our local directory below or jump to the selected external partner site.
              </p>
            </div>

            {/* Platform Switcher & Direct Live Search Trigger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 lg:max-w-3xl lg:w-full justify-end">
              <div className="flex flex-wrap sm:flex-nowrap bg-slate-800/90 p-1 rounded-xl border border-slate-700 shrink-0 gap-0.5">
                {(
                  [
                    { name: 'Amazon', activeClass: 'bg-amber-500 text-slate-950' },
                    { name: 'Shopz BD', activeClass: 'bg-emerald-500 text-slate-950' },
                    { name: 'Releva BD', activeClass: 'bg-teal-400 text-slate-950' },
                    { name: 'AliExpress', activeClass: 'bg-orange-400 text-slate-950' },
                    { name: 'Alibaba', activeClass: 'bg-indigo-500 text-white' },
                    { name: 'ExonHost', activeClass: 'bg-sky-400 text-slate-950' }
                  ] as const
                ).map((plat) => (
                  <button
                    key={plat.name}
                    type="button"
                    onClick={() => setTargetPlatform(plat.name)}
                    className={`flex-1 sm:flex-initial px-2.5 min-h-[36px] py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      targetPlatform === plat.name
                        ? `${plat.activeClass} shadow-xs`
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {plat.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="e.g., 'Logitech', 'Casio', 'Qi2', 'Shure'..."
                  value={partnerQuery}
                  onChange={(e) => {
                    setPartnerQuery(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="px-3.5 min-h-[40px] py-2 bg-slate-950/80 border border-slate-600 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400 min-w-0 flex-1 w-full"
                />
                <a
                  href={livePartnerSearchHref}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  onClick={() =>
                    recordAffiliateClick(`partner-search-${targetPlatform.toLowerCase()}`, targetPlatform)
                  }
                  className={`px-4 min-h-[40px] py-2 font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
                    targetPlatform === 'ExonHost'
                      ? 'bg-sky-400 hover:bg-sky-300 text-slate-950'
                      : targetPlatform === 'Shopz BD'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : targetPlatform === 'Releva BD'
                      ? 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                      : targetPlatform === 'AliExpress'
                      ? 'bg-orange-400 hover:bg-orange-300 text-slate-950'
                      : targetPlatform === 'Alibaba'
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <span>
                    {targetPlatform === 'Amazon' || targetPlatform === 'Shopz BD'
                      ? `Search ${targetPlatform}`
                      : `Open ${targetPlatform}`}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Direct Live Search Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none min-w-0">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Partner Search Shortcuts:</span>
              {[
                { label: 'Wireless ANC Earbuds', store: 'Amazon' as const },
                { label: 'Baseus Lamp', store: 'Shopz BD' as const },
                { label: 'Mechanical Keyboard', store: 'Amazon' as const },
                { label: 'AMOLED Smartwatch', store: 'Shopz BD' as const },
                { label: 'USB-C Dock', store: 'Amazon' as const },
                { label: 'Casio Watch', store: 'Shopz BD' as const }
              ].map((chip) => (
                <a
                  key={chip.label}
                  href={
                    chip.store === 'Shopz BD'
                      ? getShopzSearchAffiliateUrl(chip.label)
                      : getAmazonSearchAffiliateUrl(chip.label)
                  }
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  onClick={() => recordAffiliateClick(`quick-chip-${chip.store}`, chip.store)}
                  className="px-2.5 min-h-[34px] py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer text-[11px] shrink-0"
                >
                  <span>{chip.label}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-amber-400 font-mono inline-flex items-center gap-1">
                    <span>{chip.store}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* DEPARTMENT TABS & STORE FILTER */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs mb-8 space-y-4 transition-colors">
          {/* Row 1: Department Tabs */}
          <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full flex-1 min-w-0">
              {categories.map((c) => {
                const count = categoryCounts[c] || 0;
                const isSelected = selectedCategory === c;
                const isShopzTab = c === 'Shopz BD Tech Deals';
                const isRelevaTab = c === 'Releva BD Picks';
                const isCloudTab = c === 'Cloud Hosting & Domains';
                const isMegaStoreTab = c === 'All Departments (Mega Store)';

                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3.5 min-h-[40px] py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? isShopzTab
                          ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                          : isRelevaTab
                          ? 'bg-teal-500 text-slate-950 shadow-xs font-extrabold'
                          : isCloudTab
                          ? 'bg-sky-500 text-slate-950 shadow-xs font-extrabold'
                          : 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-xs'
                        : isShopzTab
                        ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-950 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 font-bold'
                        : isRelevaTab
                        ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-950 dark:text-teal-300 border border-teal-200/80 dark:border-teal-500/30 hover:bg-teal-100 dark:hover:bg-teal-500/25 font-bold'
                        : isCloudTab
                        ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-950 dark:text-sky-300 border border-sky-200/80 dark:border-sky-500/30 hover:bg-sky-100 dark:hover:bg-sky-500/25 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isMegaStoreTab && <Compass className="w-3.5 h-3.5 opacity-75" />}
                    {(isShopzTab || isRelevaTab) && <Building2 className="w-3.5 h-3.5" />}
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

            {/* View Mode Toggle (Grid / List) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors cursor-pointer ${
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
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors cursor-pointer ${
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

          {/* Row 2: Search, Store Filter, Price Slider & Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
            <div className="relative flex-1 lg:max-w-lg min-w-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter catalog: 'Casio', 'earbuds', 'releva', 'lamp', 'exonhost'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[40px] pl-8 pr-14 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:bg-white dark:focus:bg-slate-800 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Store Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(
                  [
                    { key: 'all', label: 'All Stores', activeClass: 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white' },
                    { key: 'Amazon', label: 'Amazon', activeClass: 'bg-amber-400 text-slate-950' },
                    { key: 'Shopz BD', label: 'Shopz BD', activeClass: 'bg-emerald-500 text-slate-950' },
                    { key: 'Releva BD', label: 'Releva BD', activeClass: 'bg-teal-400 text-slate-950' },
                    { key: 'AliExpress', label: 'AliExpress', activeClass: 'bg-orange-400 text-slate-950' },
                    { key: 'Alibaba', label: 'Alibaba', activeClass: 'bg-indigo-600 text-white' },
                    { key: 'ExonHost', label: 'ExonHost', activeClass: 'bg-sky-500 text-slate-950' }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStoreFilter(tab.key)}
                    className={`px-2.5 min-h-[34px] py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap ${
                      storeFilter === tab.key
                        ? `${tab.activeClass} shadow-2xs`
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* CSV Reference Price Only Toggle (replaces fabricated Prime filter) */}
              <label className="flex items-center gap-1.5 min-h-[36px] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pricedOnly}
                  onChange={(e) => setPricedOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  CSV Ref. Price Only
                </span>
              </label>

              {/* Price Filter Slider */}
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>Ref. Cap:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {maxPrice >= 1000 ? 'All' : formatPrice(maxPrice)}
                </span>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="20"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label="Maximum reference price cap"
                  className="w-24 accent-slate-900 dark:accent-amber-400 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Shopping Region Selector */}
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <select
                  value={visitorRegion}
                  onChange={(e) => setVisitorRegion(e.target.value as VisitorRegionCode)}
                  aria-label="Shopping region"
                  className="min-h-[38px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
                >
                  {REGION_ORDER.map((code) => (
                    <option key={code} value={code}>
                      Region: {REGION_PROFILES[code].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  aria-label="Sort products"
                  className="min-h-[38px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">Regional Featured Order</option>
                  <option value="price-asc">Ref. Price: Low to High</option>
                  <option value="price-desc">Ref. Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-14 sm:py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 sm:p-8">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              No curated items match those filters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
              Note: setting a reference price cap excludes items that only show live pricing at partner checkout. Reset filters or search Amazon and Shopz BD directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleClearFilters}
                className="px-4 min-h-[40px] py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
              {searchQuery.trim() && (
                <>
                  <a
                    href={getAmazonSearchAffiliateUrl(searchQuery)}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    onClick={() => recordAffiliateClick('empty-search-amazon', 'Amazon')}
                    className="px-4 min-h-[40px] py-2 bg-[#FF9900] text-slate-950 rounded-xl text-xs font-extrabold hover:bg-[#e88b00] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Search &quot;{searchQuery}&quot; on Amazon</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={getShopzSearchAffiliateUrl(searchQuery)}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    onClick={() => recordAffiliateClick('empty-search-shopz', 'Shopz BD')}
                    className="px-4 min-h-[40px] py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-extrabold hover:bg-emerald-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Search &quot;{searchQuery}&quot; on Shopz BD</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mb-12">
            {filteredProducts.map((product) => {
              const isCompared = comparedProducts.some((p) => p.id === product.id);
              const affiliateUrl = getAffiliateBuyUrl(product);
              const isHighlighted = product.id === highlightedProductId;
              const knownPrice = hasKnownPrice(product);

              return (
                <div
                  id={`product-${product.id}`}
                  key={product.id}
                  onClick={() => setActiveQuickViewProduct(product)}
                  className={`group bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative ${
                    isHighlighted
                      ? 'ring-2 ring-amber-500 shadow-xl border-amber-400'
                      : 'border-slate-200/90 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {/* Visual Header */}
                  <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                    <ResilientImage
                      src={product.mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Platform Origin Badge */}
                    <span
                      className={`absolute top-3 left-3 font-extrabold text-[10px] px-2.5 py-0.5 rounded shadow-xs uppercase tracking-wider ${getStoreBadgeClasses(
                        product.originStore
                      )}`}
                    >
                      {product.badge || product.originStore}
                    </span>

                    <span className="absolute bottom-3 left-3 bg-slate-950/75 text-slate-200 text-[10px] px-2 py-0.5 rounded">
                      Illustrative photo
                    </span>

                    {/* Quick Look Overlay Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveQuickViewProduct(product);
                      }}
                      className="absolute bottom-3 right-3 p-2 bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white rounded-lg shadow-sm sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Quick Look</span>
                    </button>
                  </div>

                  {/* Body Metadata & Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-400 dark:text-slate-500 truncate max-w-[165px]">
                          {product.csvCategory || product.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                          {product.asin || product.originStore}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {product.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums truncate">
                            {knownPrice
                              ? formatPrice(product.price, product.nativePrice, product.nativeCurrency)
                              : 'Check Live Price'}
                          </span>
                          {knownPrice && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                              CSV Ref.
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompare(product);
                          }}
                          className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                            isCompared
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>{isCompared ? 'Compared' : 'Compare'}</span>
                        </button>
                      </div>

                      <div className="text-[10px] bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700 font-semibold flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{product.deliveryEstimate}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={affiliateUrl}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            recordAffiliateClick(product.id, product.originStore, product.category);
                          }}
                          className={`flex-1 min-h-[40px] py-2.5 px-3 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap ${getStoreCtaClasses(
                            product.originStore
                          )}`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                          <span>{getStoreCtaLabel(product)}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveProduct(product, affiliateUrl);
                          }}
                          className="min-h-[40px] min-w-[40px] p-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                          title="Save to List"
                          aria-label={`Save ${product.title} to List`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* RESULTS: List View Mode */
          <div className="space-y-4 mb-12">
            {filteredProducts.map((product) => {
              const affiliateUrl = getAffiliateBuyUrl(product);
              const isCompared = comparedProducts.some((p) => p.id === product.id);
              const knownPrice = hasKnownPrice(product);

              return (
                <div
                  id={`product-${product.id}`}
                  key={product.id}
                  onClick={() => setActiveQuickViewProduct(product)}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl p-4 sm:p-5 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 cursor-pointer relative"
                >
                  <div className="w-full md:w-48 aspect-4/3 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative flex items-center justify-center">
                    <ResilientImage
                      src={product.mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {product.badge && (
                      <span
                        className={`absolute top-2 left-2 font-bold text-[9px] px-2 py-0.5 rounded shadow-xs uppercase ${getStoreBadgeClasses(
                          product.originStore
                        )}`}
                      >
                        {product.badge}
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 bg-slate-950/75 text-slate-200 text-[9px] px-1.5 py-0.5 rounded">
                      Illustrative
                    </span>
                  </div>

                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 text-xs">
                      <span className="uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 text-[11px]">
                        {product.csvCategory ? `${product.category} · ${product.csvCategory}` : product.category}
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[10px]">
                        {product.asin ? `ASIN: ${product.asin}` : product.originStore}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{product.deliveryEstimate}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCompare(product);
                        }}
                        className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isCompared
                            ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{isCompared ? 'Compared' : 'Compare'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-56 shrink-0 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-3">
                    <div className="text-left md:text-right w-full">
                      <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                        {knownPrice
                          ? formatPrice(product.price, product.nativePrice, product.nativeCurrency)
                          : 'Check Live Price'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {knownPrice ? 'Historical CSV reference' : `Live price on ${product.originStore}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <a
                        href={affiliateUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          recordAffiliateClick(product.id, product.originStore, product.category);
                        }}
                        className={`flex-1 min-h-[40px] py-2.5 px-3 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap ${getStoreCtaClasses(
                          product.originStore
                        )}`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{getStoreCtaLabel(product)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveProduct(product, affiliateUrl);
                        }}
                        className="min-h-[40px] min-w-[40px] p-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        title="Save to List"
                        aria-label={`Save ${product.title} to List`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sponsors.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="text-amber-700 dark:text-amber-400">Sponsored</span>
                <span aria-hidden="true">·</span>
                <span>Featured Partner Spotlights</span>
              </div>
              <a
                href="#sponsors"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
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
                  rel="sponsored noopener noreferrer"
                  onClick={() => recordAffiliateClick(sp.id)}
                  className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center justify-between gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
                  <span className="px-3 min-h-[36px] py-1.5 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
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
