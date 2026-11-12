import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
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
  PlusCircle,
  Building2,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EcomProduct, ProductCategory } from '../data/unifiedProductsData';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { ModernProductModal } from './ModernProductModal';
import { ProductCompareDock } from './ProductCompareDock';

export const StoreSection: React.FC = () => {
  const { formatPrice, addToCart, showNotification } = useCart();
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    highlightedProductId,
    getAffiliateBuyUrl,
    getAmazonSearchAffiliateUrl,
    getShopzSearchAffiliateUrl,
    recordAffiliateClick,
    addCustomAffiliateItem,
    removeCustomProduct,
    amazonStoreUrl,
    shopzStoreUrl
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [storeFilter, setStoreFilter] = useState<'all' | 'Amazon' | 'Shopz BD'>('all');
  const [primeOnly, setPrimeOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Live partner store search query
  const [partnerQuery, setPartnerQuery] = useState<string>('');
  const [targetPlatform, setTargetPlatform] = useState<'Amazon' | 'Shopz BD'>('Amazon');

  // Collapsible custom listing form (real user-supplied product URL + price)
  const [showAddCustomForm, setShowAddCustomForm] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<ProductCategory>('Electronics & Gadgets');
  const [customStore, setCustomStore] = useState<'Amazon' | 'Shopz BD'>('Amazon');

  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<EcomProduct | null>(null);
  const [comparedProducts, setComparedProducts] = useState<EcomProduct[]>([]);

  const categories: ProductCategory[] = [
    'All Departments (Mega Store)',
    'Electronics & Gadgets',
    'Computers & Accessories',
    'Audio & Headphones',
    'Smart Home & Power',
    'Wearables & Smartwatches',
    'Office & Workspace',
    'Shopz BD Tech Deals'
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
        let matchCategory = false;
        if (selectedCategory === 'All Departments (Mega Store)') {
          matchCategory = true;
        } else {
          matchCategory = item.category === selectedCategory || item.department === selectedCategory;
        }

        const matchStore = storeFilter === 'all' || item.originStore === storeFilter;

        const matchSearch =
          searchQuery.trim() === '' ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.department && item.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.asin && item.asin.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchPrime = !primeOnly || item.primeEligible;
        const matchPrice = item.price <= maxPrice;

        return matchCategory && matchStore && matchSearch && matchPrime && matchPrice;
      })
      .sort((a, b) => {
        if (a.id === highlightedProductId) return -1;
        if (b.id === highlightedProductId) return 1;

        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') {
          const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discountB - discountA;
        }
        return 0;
      });
  }, [products, selectedCategory, storeFilter, searchQuery, sortBy, primeOnly, maxPrice, highlightedProductId]);

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
    setPrimeOnly(false);
    setMaxPrice(1000);
    setSortBy('featured');
  };

  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customUrl.trim()) return;
    const numericPrice = parseFloat(customPrice) || 0;
    const added = addCustomAffiliateItem({
      title: customTitle.trim(),
      affiliateUrl: customUrl.trim(),
      price: numericPrice,
      category: customCategory,
      originStore: customStore
    });
    setCustomTitle('');
    setCustomUrl('');
    setCustomPrice('');
    setShowAddCustomForm(false);
    showNotification(`Saved "${added.title}" to your catalog`);
  };

  const livePartnerSearchHref =
    targetPlatform === 'Shopz BD'
      ? getShopzSearchAffiliateUrl(partnerQuery)
      : getAmazonSearchAffiliateUrl(partnerQuery);

  return (
    <section id="store" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Amazon & Shopz BD Verified Storefront */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                <span>Verified E-Commerce Catalog</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-900 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                {products.length} Curated Products
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200/60">
                100% Partner Tracked
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 [text-wrap:balance]">
              Shop Prime Gear &amp; Shopz BD Electronics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Curated hardware across our Amazon Associates Storefront and Shopz BD official referral channel. All partner purchases ship with manufacturer warranties and full buyer protection.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <a
              href={amazonStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordAffiliateClick()}
              className="flex items-center gap-1.5 text-xs text-amber-950 bg-amber-400 hover:bg-amber-300 font-extrabold px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Package className="w-4 h-4 text-slate-950" />
              <span>Amazon Storefront</span>
              <ExternalLink className="w-3 h-3 text-slate-900" />
            </a>

            <a
              href={shopzStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordAffiliateClick()}
              className="flex items-center gap-1.5 text-xs text-emerald-950 bg-emerald-400 hover:bg-emerald-300 font-extrabold px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-950" />
              <span>Shopz BD Store</span>
              <ExternalLink className="w-3 h-3 text-emerald-950" />
            </a>
          </div>
        </div>

        {/* LIVE PARTNER STORE SEARCH & CUSTOM LINK PINNING BAR */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 mb-8 shadow-md border border-slate-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Search className="w-4 h-4" />
                <span>Direct Partner Store Search</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Search live Amazon Prime &amp; Shopz BD listings directly
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Enter any hardware model to filter our catalog below or jump directly into verified search results on Amazon or Shopz BD.
              </p>
            </div>

            {/* Platform Switcher & Direct Live Search Trigger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700 shrink-0">
                <button
                  type="button"
                  onClick={() => setTargetPlatform('Amazon')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    targetPlatform === 'Amazon'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Amazon Prime
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPlatform('Shopz BD')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    targetPlatform === 'Shopz BD'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Shopz BD
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g., 'Anker GaN 65W', 'QCY Earbuds'..."
                  value={partnerQuery}
                  onChange={(e) => {
                    setPartnerQuery(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="px-3.5 py-2 bg-slate-950/80 border border-slate-600 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400 min-w-[210px]"
                />
                <a
                  href={livePartnerSearchHref}
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  onClick={() => recordAffiliateClick()}
                  className={`px-4 py-2 font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    targetPlatform === 'Shopz BD'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  <span>Search {targetPlatform}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Direct Live Search Chips & Custom Pin Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Live Searches:</span>
              {[
                { label: 'Wireless ANC Earbuds', store: 'Amazon' as const },
                { label: 'Baseus 100W Power Bank', store: 'Shopz BD' as const },
                { label: 'Mechanical Keyboard', store: 'Amazon' as const },
                { label: 'AMOLED Smartwatch', store: 'Shopz BD' as const },
                { label: '4K USB-C Monitor', store: 'Amazon' as const },
                { label: 'Soundcore Speaker', store: 'Shopz BD' as const }
              ].map((chip) => (
                <a
                  key={chip.label}
                  href={
                    chip.store === 'Shopz BD'
                      ? getShopzSearchAffiliateUrl(chip.label)
                      : getAmazonSearchAffiliateUrl(chip.label)
                  }
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  onClick={() => recordAffiliateClick()}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
                >
                  <span>{chip.label}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 text-amber-400 font-mono">
                    {chip.store} ↗
                  </span>
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddCustomForm((prev) => !prev)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Save Custom Product Link</span>
              {showAddCustomForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible Form to Save Real Partner URL + Exact Title & Price */}
          {showAddCustomForm && (
            <form
              onSubmit={handleAddCustomProduct}
              className="mt-4 pt-4 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 text-xs"
            >
              <input
                type="text"
                required
                placeholder="Exact Product Title *"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="lg:col-span-3 px-3 py-2 bg-slate-950/90 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
              />
              <input
                type="url"
                required
                placeholder="Amazon or Shopz BD Product URL *"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="lg:col-span-4 px-3 py-2 bg-slate-950/90 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price (USD)"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="lg:col-span-2 px-3 py-2 bg-slate-950/90 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
              />
              <select
                value={customStore}
                onChange={(e) => {
                  const val = e.target.value as 'Amazon' | 'Shopz BD';
                  setCustomStore(val);
                  if (val === 'Shopz BD') setCustomCategory('Shopz BD Tech Deals');
                }}
                className="lg:col-span-1 px-2 py-2 bg-slate-950/90 border border-slate-600 rounded-lg text-white focus:outline-hidden"
              >
                <option value="Amazon">Amazon</option>
                <option value="Shopz BD">Shopz BD</option>
              </select>
              <button
                type="submit"
                className="lg:col-span-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg transition-colors cursor-pointer"
              >
                Save to Catalog
              </button>
            </form>
          )}
        </div>

        {/* DEPARTMENT TABS & STORE FILTER */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs mb-8 space-y-4">
          {/* Row 1: Department Tabs */}
          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
              {categories.map((c) => {
                const count = categoryCounts[c] || 0;
                const isSelected = selectedCategory === c;
                const isShopzTab = c === 'Shopz BD Tech Deals';
                const isMegaStoreTab = c === 'All Departments (Mega Store)';

                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? isShopzTab
                          ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                          : 'bg-slate-900 text-white shadow-xs'
                        : isShopzTab
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-200/80 hover:bg-emerald-100 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {isMegaStoreTab && <Compass className="w-3.5 h-3.5 text-slate-400" />}
                    {isShopzTab && <Building2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {c.includes('Audio') && <Headphones className="w-3.5 h-3.5 text-slate-400" />}
                    {c.includes('Computers') && <Laptop className="w-3.5 h-3.5 text-slate-400" />}
                    {c.includes('Wearables') && <Watch className="w-3.5 h-3.5 text-slate-400" />}
                    {c.includes('Smart Home') && <Zap className="w-3.5 h-3.5 text-slate-400" />}
                    {c.includes('Electronics') && <Cpu className="w-3.5 h-3.5 text-slate-400" />}

                    <span>{c}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
                        isSelected ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle (Grid / List) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
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
            <div className="relative flex-1 max-w-lg">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter catalog: 'keyboard', 'airpods', 'smartwatch', 'ssd', 'speaker'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Store Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setStoreFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    storeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All Stores
                </button>
                <button
                  type="button"
                  onClick={() => setStoreFilter('Amazon')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    storeFilter === 'Amazon' ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Amazon
                </button>
                <button
                  type="button"
                  onClick={() => setStoreFilter('Shopz BD')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    storeFilter === 'Shopz BD' ? 'bg-emerald-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Shopz BD
                </button>
              </div>

              {/* Amazon Prime Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={primeOnly}
                  onChange={(e) => setPrimeOnly(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 h-4 w-4"
                />
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="text-amber-500 font-black italic">prime</span>
                  <span>Only</span>
                </span>
              </label>

              {/* Price Filter Slider */}
              <div className="flex items-center gap-2 text-slate-600">
                <span>Max:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">${maxPrice}</span>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="20"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-20 accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-slate-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-1.5 px-2 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">Featured Deals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No curated items match those filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
              Reset your local filters or search Amazon Prime and Shopz BD directly for live partner stock.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
              {searchQuery.trim() && (
                <>
                  <a
                    href={getAmazonSearchAffiliateUrl(searchQuery)}
                    target="_blank"
                    rel="noreferrer noopener sponsored"
                    onClick={() => recordAffiliateClick()}
                    className="px-4 py-2 bg-[#FF9900] text-slate-950 rounded-xl text-xs font-extrabold hover:bg-[#e88b00] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Search &quot;{searchQuery}&quot; on Amazon</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={getShopzSearchAffiliateUrl(searchQuery)}
                    target="_blank"
                    rel="noreferrer noopener sponsored"
                    onClick={() => recordAffiliateClick()}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-extrabold hover:bg-emerald-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Search &quot;{searchQuery}&quot; on Shopz BD</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredProducts.map((product) => {
              const isCompared = comparedProducts.some((p) => p.id === product.id);
              const affiliateUrl = getAffiliateBuyUrl(product);
              const isHighlighted = product.id === highlightedProductId;
              const isShopz = product.originStore === 'Shopz BD';

              return (
                <div
                  id={`product-${product.id}`}
                  key={product.id}
                  onClick={() => setActiveQuickViewProduct(product)}
                  className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative ${
                    isHighlighted
                      ? 'ring-2 ring-amber-500 shadow-xl border-amber-400'
                      : 'border-slate-200/90 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {/* Visual Header */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Platform Origin Badge */}
                    <span
                      className={`absolute top-3 left-3 font-extrabold text-[10px] px-2.5 py-0.5 rounded shadow-xs uppercase tracking-wider ${
                        isShopz ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {product.badge || (isShopz ? 'Shopz BD Deal' : "Amazon's Choice")}
                    </span>

                    {/* Remove button for user-saved custom product links */}
                    {product.isUserAdded && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomProduct(product.id);
                        }}
                        title="Remove saved listing"
                        className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Prime or Express Shipping Badge */}
                    {product.primeEligible ? (
                      <span className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <span className="text-amber-400 font-extrabold italic">prime</span>
                        <span className="text-[10px] text-slate-300">Fast 1-Day</span>
                      </span>
                    ) : isShopz ? (
                      <span className="absolute bottom-3 left-3 bg-emerald-950/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <span>Express BD Courier</span>
                      </span>
                    ) : null}

                    {/* Quick Look Overlay Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveQuickViewProduct(product);
                      }}
                      className="absolute bottom-3 right-3 p-2 bg-white/95 text-slate-800 hover:text-slate-950 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick Look</span>
                    </button>
                  </div>

                  {/* Body Metadata & Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-400 truncate max-w-[150px]">
                          {product.category}
                        </span>
                        {product.rating > 0 ? (
                          <div className="flex items-center gap-1 text-slate-700 shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-bold tabular-nums text-slate-900">{product.rating}</span>
                            <span className="text-slate-400 tabular-nums">({product.reviewsCount.toLocaleString()})</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Saved Link
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {product.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Buy Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                            {product.price > 0 ? formatPrice(product.price) : 'Partner Price'}
                          </span>
                          {product.originalPrice && product.price > 0 && (
                            <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompare(product);
                          }}
                          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded transition-colors cursor-pointer ${
                            isCompared
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>{isCompared ? 'Compared' : 'Compare'}</span>
                        </button>
                      </div>

                      <div className="text-[10px] bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/70 font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-700">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{isShopz ? 'Shopz BD Referral Link' : 'Amazon Partner Fulfillment'}</span>
                        </span>
                        <span className="font-mono text-emerald-700">Verified</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={affiliateUrl}
                          target="_blank"
                          rel="noreferrer noopener sponsored"
                          onClick={(e) => {
                            e.stopPropagation();
                            recordAffiliateClick();
                          }}
                          className={`flex-1 py-2.5 px-3 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap ${
                            isShopz
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                              : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{isShopz ? 'Buy on Shopz BD' : 'Buy on Amazon'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {product.price > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(
                                {
                                  id: product.id,
                                  title: product.title,
                                  category: 'Workspace Gear',
                                  price: product.price,
                                  originalPrice: product.originalPrice,
                                  rating: product.rating,
                                  reviewsCount: product.reviewsCount,
                                  inStock: product.inStock,
                                  stockCount: product.stockCount,
                                  badge: product.badge,
                                  description: product.description,
                                  highlights: product.highlights,
                                  specs: product.specs,
                                  image: product.mainImage,
                                  isDigital: product.isDigital
                                },
                                1
                              );
                            }}
                            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer"
                            title="Add to Shopping Bag"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        )}
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
              const isShopz = product.originStore === 'Shopz BD';

              return (
                <div
                  id={`product-${product.id}`}
                  key={product.id}
                  onClick={() => setActiveQuickViewProduct(product)}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl p-4 sm:p-5 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer relative"
                >
                  <div className="w-full md:w-48 aspect-4/3 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative flex items-center justify-center">
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {product.badge && (
                      <span
                        className={`absolute top-2 left-2 font-bold text-[9px] px-2 py-0.5 rounded shadow-xs uppercase ${
                          isShopz ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-1 text-xs">
                      <span className="uppercase tracking-wider font-semibold text-slate-400 text-[11px]">
                        {product.category}
                      </span>
                      <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                        {isShopz ? 'Shopz BD Referral' : `ASIN: ${product.asin || 'Amazon Partner'}`}
                      </span>
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 text-slate-700">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold tabular-nums text-slate-900">{product.rating}</span>
                          <span className="text-slate-400">({product.reviewsCount.toLocaleString()})</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-amber-600 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>

                    <div className="text-[11px] text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 inline-block font-medium">
                      ✓ {isShopz ? 'Shopz BD Official Storefront Referral' : 'Amazon Prime 1-2 Day Delivery & 30-Day Returns'}
                    </div>
                  </div>

                  <div className="w-full md:w-56 shrink-0 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 space-y-3">
                    <div className="text-left md:text-right w-full">
                      <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                        {product.price > 0 ? formatPrice(product.price) : 'Partner Price'}
                      </div>
                      {product.originalPrice && product.price > 0 && (
                        <div className="text-xs text-slate-400 line-through font-mono">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                      {product.primeEligible && (
                        <div className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-0.5 md:justify-end">
                          <span className="italic font-black">prime</span>
                          <span className="text-slate-500 text-[10px]">Free 1-Day Delivery</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <a
                        href={affiliateUrl}
                        target="_blank"
                        rel="noreferrer noopener sponsored"
                        onClick={(e) => {
                          e.stopPropagation();
                          recordAffiliateClick();
                        }}
                        className={`flex-1 py-2.5 px-3 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap ${
                          isShopz
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                            : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{isShopz ? 'Buy on Shopz BD' : 'Buy on Amazon'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {product.price > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(
                              {
                                id: product.id,
                                title: product.title,
                                category: 'Workspace Gear',
                                price: product.price,
                                originalPrice: product.originalPrice,
                                rating: product.rating,
                                reviewsCount: product.reviewsCount,
                                inStock: product.inStock,
                                stockCount: product.stockCount,
                                badge: product.badge,
                                description: product.description,
                                highlights: product.highlights,
                                specs: product.specs,
                                image: product.mainImage,
                                isDigital: product.isDigital
                              },
                              1
                            );
                          }}
                          className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer"
                          title="Add to Shopping Bag"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
