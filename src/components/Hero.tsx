import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Package,
  ShoppingCart,
  ExternalLink,
  Eye,
  ShoppingBag,
  Check,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { EcomProduct } from '../data/unifiedProductsData';
import type { PartnerStoreOrigin } from '../utils/regionProfile';
import { ModernProductModal } from './ModernProductModal';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onExploreStore: () => void;
}

const SPOTLIGHT_PRODUCT_IDS = [
  'amz-mx-master-3s',
  'startech-msi-cyborg-15-black-edition-a13uc-core-i5-laptop',
  'startech-dji-mini-5-pro-fly-more-combo-plus',
  'startech-anker-solix-c1000-gen-2-portable-power-station',
  'startech-colmi-p71',
  'illin-poedagar-men-watch-1563',
  'illin-royal-purple-bedsheet',
  'startech-acer-aspire-3',
  'startech-flyx-ae8-pro-drone',
  'bs-some-by-mi-miracle-serum',
  'illin-folding-fan-lr2018',
  'illin-jennie-moon-soap',
  'csv-qcy-ht05-melobuds-anc-true-wireless-earbuds',
  'sohoj-affiliate-program',
  'startech-colmi-p81',
  'releva-bd-130',
  'exonhost-turbo-nvme',
  'alibaba-smart-qi2-charging-pad-pro'
];

export const Hero: React.FC<HeroProps> = ({ onExploreStore }) => {
  const {
    setSelectedCategory,
    setSelectedStoreFilter,
    amazonStoreUrl,
    amazonShortUrl,
    shopzStoreUrl,
    relevaStoreUrl,
    exonhostStoreUrl,
    alibabaStoreUrl,
    banglashoppersStoreUrl,
    illinStoreUrl,
    startechStoreUrl,
    sohojStoreUrl,
    products,
    sponsors,
    storefrontCopy,
    regionProfile,
    getAffiliateBuyUrl,
    recordAffiliateClick
  } = useProducts();
  const { addToCart, formatPrice, cart } = useCart();

  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [modalProduct, setModalProduct] = useState<EcomProduct | null>(null);
  const swipeStartX = useRef<number | null>(null);

  const savedIds = useMemo(() => new Set(cart.map((c) => c.product.id)), [cart]);

  const spotlightProducts = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    const picked = SPOTLIGHT_PRODUCT_IDS.map((id) => byId.get(id)).filter(
      (item): item is EcomProduct => Boolean(item)
    );
    if (picked.length > 0) return picked;
    return products.slice(0, 6);
  }, [products]);

  useEffect(() => {
    if (spotlightIndex >= spotlightProducts.length && spotlightProducts.length > 0) {
      setSpotlightIndex(0);
    }
  }, [spotlightIndex, spotlightProducts.length]);

  useEffect(() => {
    if (isPaused || spotlightProducts.length <= 1 || modalProduct) return;
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % spotlightProducts.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, spotlightProducts.length, modalProduct]);

  const activeSpotlight = spotlightProducts[spotlightIndex] || spotlightProducts[0];

  const storeCounts = useMemo(() => {
    const counts: Record<PartnerStoreOrigin, number> = {
      Amazon: 0,
      'Shopz BD': 0,
      'Releva BD': 0,
      Alibaba: 0,
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

  const handleBrowseAllProducts = () => {
    setSelectedCategory('All Departments (Mega Store)');
    setSelectedStoreFilter('all');
    onExploreStore();
  };

  const handleOpenBuyingGuide = () => {
    const el = document.getElementById('buying-guide');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExploreStore();
    }
  };

  const handleJumpToStore = (store: PartnerStoreOrigin) => {
    setSelectedStoreFilter(store);
    setSelectedCategory('All Departments (Mega Store)');
    onExploreStore();
  };

  const handleJumpToSponsors = () => {
    const el = document.getElementById('sponsors');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveSpotlight = (product: EcomProduct) => {
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
        affiliateUrl: getAffiliateBuyUrl(product)
      },
      1
    );
  };

  const getStoreAccent = (store: PartnerStoreOrigin) => {
    if (store === 'ExonHost') return 'bg-sky-500 text-slate-950';
    if (store === 'Shopz BD') return 'bg-emerald-500 text-slate-950';
    if (store === 'Releva BD') return 'bg-teal-400 text-slate-950';
    if (store === 'Alibaba') return 'bg-indigo-600 text-white';
    if (store === 'BanglaShoppers') return 'bg-rose-500 text-white';
    if (store === 'Illin BD') return 'bg-cyan-400 text-slate-950';
    if (store === 'Star Tech') return 'bg-orange-600 text-white';
    if (store === 'Sohoj Affiliates') return 'bg-violet-600 text-white';
    return 'bg-amber-400 text-slate-950';
  };

  const partnerButtons = regionProfile.storePriority.map((store) => {
    if (store === 'Star Tech') {
      return (
        <a
          key="startech"
          href={startechStoreUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-startech-store', 'Star Tech')}
          className="min-h-[44px] px-3 py-2 text-xs font-bold text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-500/40 hover:border-orange-400 bg-orange-50 dark:bg-orange-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Star Tech</span>
          <ExternalLink className="w-3 h-3 text-orange-600 dark:text-orange-400" />
        </a>
      );
    }
    if (store === 'Shopz BD') {
      return (
        <a
          key="shopz"
          href={shopzStoreUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-shopz-store', 'Shopz BD')}
          className="min-h-[44px] px-3 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 hover:border-orange-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Shopz BD</span>
          <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        </a>
      );
    }
    if (store === 'BanglaShoppers') {
      return (
        <a
          key="banglashoppers"
          href={banglashoppersStoreUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-banglashoppers-store', 'BanglaShoppers')}
          className="min-h-[44px] px-3 py-2 text-xs font-bold text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 hover:border-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>BanglaShoppers</span>
          <ExternalLink className="w-3 h-3 text-rose-600 dark:text-rose-400" />
        </a>
      );
    }
    if (store === 'Illin BD') {
      return (
        <a
          key="illin"
          href={illinStoreUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-illin-store', 'Illin BD')}
          className="min-h-[44px] px-3 py-2 text-xs font-bold text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 hover:border-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Illin BD</span>
          <ExternalLink className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
        </a>
      );
    }
    if (store === 'Sohoj Affiliates') {
      return (
        <a
          key="sohoj"
          href={sohojStoreUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-sohoj-store', 'Sohoj Affiliates')}
          className="min-h-[44px] px-3 py-2 text-xs font-bold text-violet-800 dark:text-violet-300 border border-violet-300 dark:border-violet-500/40 hover:border-violet-400 bg-violet-50 dark:bg-violet-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Sohoj Affiliates</span>
          <ExternalLink className="w-3 h-3 text-violet-600 dark:text-violet-400" />
        </a>
      );
    }
    if (store === 'Releva BD') {
      return (
        <a
          key="releva"
          href={relevaStoreUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-releva-store', 'Releva BD')}
          className="min-h-[44px] px-3 py-2 text-xs font-bold text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 hover:border-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Releva BD</span>
          <ExternalLink className="w-3 h-3 text-teal-600 dark:text-teal-400" />
        </a>
      );
    }
    if (store === 'ExonHost') {
      return (
        <a
          key="exonhost"
          href={exonhostStoreUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-exonhost-store', 'ExonHost')}
          className="min-h-[44px] px-3 py-2 text-xs font-bold text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 hover:border-sky-400 bg-sky-50 dark:bg-sky-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>ExonHost</span>
          <ExternalLink className="w-3 h-3 text-sky-600 dark:text-sky-400" />
        </a>
      );
    }
    if (store === 'Alibaba') {
      return (
        <a
          key="alibaba"
          href={alibabaStoreUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('hero-alibaba-store', 'Alibaba')}
          className="min-h-[44px] px-3 py-2 text-xs font-bold text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40 hover:border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Alibaba</span>
          <ExternalLink className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
        </a>
      );
    }
    return (
      <a
        key="amazon"
        href={amazonStoreUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        onClick={() => recordAffiliateClick('hero-amazon-store', 'Amazon')}
        className="min-h-[44px] px-3 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 hover:border-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
      >
        <span>Amazon Store</span>
        <ExternalLink className="w-3 h-3 text-amber-600 dark:text-amber-400" />
      </a>
    );
  });

  const activeHasPrice = activeSpotlight
    ? activeSpotlight.nativeCurrency === 'BDT'
      ? typeof activeSpotlight.nativePrice === 'number' && activeSpotlight.nativePrice > 0
      : activeSpotlight.price > 0
    : false;
  const activeBuyUrl = activeSpotlight ? getAffiliateBuyUrl(activeSpotlight) : amazonStoreUrl;
  const activeIsSaved = activeSpotlight ? savedIds.has(activeSpotlight.id) : false;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-slate-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 text-slate-900 dark:text-white pt-6 sm:pt-10 pb-10 sm:pb-14 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        {/* Main 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: High-Contrast Storefront Proposition & Partner Access */}
          <div className="lg:col-span-6 flex flex-col justify-center min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400 mb-3">
              <span className="inline-flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>{storefrontCopy.siteName}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{products.length} Curated Partner Products</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400">{regionProfile.shortLabel}</span>
            </div>

            <h2 className="text-[clamp(1.65rem,3.6vw,3rem)] font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.12] [text-wrap:balance]">
              {storefrontCopy.heroTitle}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 max-w-xl leading-relaxed">
              {storefrontCopy.heroSubtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-6">
              <button
                type="button"
                onClick={handleBrowseAllProducts}
                className="min-h-[46px] px-6 py-3 text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Package className="w-4 h-4 text-slate-950" />
                <span>Shop All {products.length} Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOpenBuyingGuide}
                className="min-h-[46px] px-5 py-3 text-sm font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-900 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Match with Buying Guide</span>
              </button>
            </div>

            {/* Direct Partner Storefront Links */}
            <div className="space-y-2.5 mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Shop by Partner Store
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {partnerButtons}
                <a
                  href={amazonShortUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={() => recordAffiliateClick('hero-amazon-shortlink', 'Amazon')}
                  className="min-h-[44px] px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-400 bg-white dark:bg-slate-900 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Amazon Deals</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Clean Retail Highlights */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-5">
                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{regionProfile.deliverySummary}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Direct partner checkout</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real Product Spotlight Stage (Touch Swipeable) */}
          {activeSpotlight && (
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={(e) => {
                swipeStartX.current = e.touches[0]?.clientX ?? null;
                setIsPaused(true);
              }}
              onTouchEnd={(e) => {
                if (swipeStartX.current === null || spotlightProducts.length <= 1) return;
                const endX = e.changedTouches[0]?.clientX ?? swipeStartX.current;
                const diff = endX - swipeStartX.current;
                swipeStartX.current = null;
                if (Math.abs(diff) < 40) return;
                if (diff < 0) {
                  setSpotlightIndex((prev) => (prev + 1) % spotlightProducts.length);
                } else {
                  setSpotlightIndex(
                    (prev) => (prev - 1 + spotlightProducts.length) % spotlightProducts.length
                  );
                }
              }}
              className="lg:col-span-6 min-w-0"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Spotlight Top Bar */}
                <div className="px-4 py-2.5 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between gap-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${getStoreAccent(
                        activeSpotlight.originStore
                      )}`}
                    >
                      {activeSpotlight.originStore}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      Spotlight ({spotlightIndex + 1}/{spotlightProducts.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPaused(true);
                        setSpotlightIndex(
                          (prev) => (prev - 1 + spotlightProducts.length) % spotlightProducts.length
                        );
                      }}
                      aria-label="Previous featured product"
                      className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPaused(true);
                        setSpotlightIndex((prev) => (prev + 1) % spotlightProducts.length);
                      }}
                      aria-label="Next featured product"
                      className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Spotlight Product Card */}
                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-center">
                  <button
                    type="button"
                    onClick={() => setModalProduct(activeSpotlight)}
                    className="sm:col-span-5 relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-200/80 dark:border-slate-700 group cursor-pointer p-3 flex items-center justify-center"
                  >
                    <ResilientImage
                      src={activeSpotlight.mainImage}
                      alt={activeSpotlight.title}
                      priority
                      className="max-w-full max-h-full w-auto h-auto object-contain responsive-card-media"
                      referrerPolicy="no-referrer"
                    />
                  </button>

                  <div className="sm:col-span-7 flex flex-col justify-between gap-3 min-w-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="uppercase tracking-wider font-semibold truncate">
                          {activeSpotlight.csvCategory || activeSpotlight.category}
                        </span>
                        <span className="font-mono shrink-0">
                          {activeSpotlight.brand}
                        </span>
                      </div>

                      <h2
                        onClick={() => setModalProduct(activeSpotlight)}
                        className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        {activeSpotlight.title}
                      </h2>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {activeSpotlight.description}
                      </p>

                      {/* Top 2 real specs */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        {activeSpotlight.specs
                          .filter((s) => s.label !== 'Price')
                          .slice(0, 2)
                          .map((spec, idx) => (
                            <span key={idx} className="truncate max-w-full">
                              <strong className="text-slate-700 dark:text-slate-200">{spec.label}:</strong>{' '}
                              {spec.value}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-base sm:text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white">
                          {activeHasPrice
                            ? formatPrice(
                                activeSpotlight.price,
                                activeSpotlight.nativePrice,
                                activeSpotlight.nativeCurrency
                              )
                            : `View price on ${activeSpotlight.originStore}`}
                        </span>
                        {activeHasPrice && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            Listed Price
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={activeBuyUrl}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          onClick={() =>
                            recordAffiliateClick(
                              activeSpotlight.id,
                              activeSpotlight.originStore,
                              activeSpotlight.category
                            )
                          }
                          className={`flex-1 min-h-[44px] px-3.5 py-2 font-extrabold text-xs rounded-xl inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 shadow-xs whitespace-nowrap ${getStoreAccent(
                            activeSpotlight.originStore
                          )}`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {activeSpotlight.urlKind === 'portal'
                              ? `Open ${activeSpotlight.originStore}`
                              : `Buy on ${activeSpotlight.originStore}`}
                          </span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setModalProduct(activeSpotlight)}
                          aria-label={`Inspect ${activeSpotlight.title}`}
                          className="min-h-[44px] px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Specs</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveSpotlight(activeSpotlight)}
                          aria-label={`Save ${activeSpotlight.title} to list`}
                          className={`min-h-[44px] min-w-[44px] p-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                            activeIsSaved
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                          }`}
                        >
                          {activeIsSaved ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clickable Spotlight Switcher Strip */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                    {spotlightProducts.map((item, idx) => {
                      const active = idx === spotlightIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setIsPaused(true);
                            setSpotlightIndex(idx);
                          }}
                          className={`min-h-[44px] flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer shrink-0 max-w-[190px] ${
                            active
                              ? 'bg-white dark:bg-slate-800 border-amber-500 shadow-xs text-slate-900 dark:text-white'
                              : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <ResilientImage
                            src={item.mainImage}
                            alt={item.title}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded object-contain bg-white p-0.5 shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 truncate">
                              {item.originStore}
                            </div>
                            <div className="text-[11px] font-semibold truncate">{item.title}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Partner Coverage Strip (Clicks Jump & Filter Real Products) */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200/90 dark:border-slate-800 grid grid-cols-1 min-[481px]:grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-5 gap-3">
          {(
            [
              { store: 'Amazon' as const, label: 'Amazon', count: storeCounts.Amazon, sub: 'Tech & workspace' },
              { store: 'Shopz BD' as const, label: 'Shopz BD', count: storeCounts['Shopz BD'], sub: 'Tech, watches, mics' },
              { store: 'Star Tech' as const, label: 'Star Tech', count: storeCounts['Star Tech'], sub: 'PCs, audio, drones & power' },
              { store: 'BanglaShoppers' as const, label: 'BanglaShoppers', count: storeCounts.BanglaShoppers, sub: 'Skincare & beauty' },
              { store: 'Illin BD' as const, label: 'Illin BD', count: storeCounts['Illin BD'], sub: 'Home, care & kitchen' },
              { store: 'Releva BD' as const, label: 'Releva BD', count: storeCounts['Releva BD'], sub: 'Featured picks' },
              { store: 'Alibaba' as const, label: 'Alibaba', count: storeCounts.Alibaba, sub: 'Direct sourcing' },
              { store: 'ExonHost' as const, label: 'ExonHost', count: storeCounts.ExonHost, sub: 'NVMe, WP & VPS' },
              { store: 'Sohoj Affiliates' as const, label: 'Sohoj', count: storeCounts['Sohoj Affiliates'], sub: 'BD affiliate hub' }
            ] as const
          ).map((entry) => (
            <button
              key={entry.store}
              type="button"
              onClick={() => handleJumpToStore(entry.store)}
              className="responsive-card min-h-[44px] text-left p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/60 transition-all cursor-pointer group"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {entry.count}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                {entry.label}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {entry.sub}
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={handleJumpToSponsors}
            className="responsive-card min-h-[44px] min-[481px]:col-span-2 md:col-span-1 text-left p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/60 transition-all cursor-pointer group"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xl font-extrabold font-mono tabular-nums text-amber-600 dark:text-amber-400">
                {sponsors.length}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              Sponsored
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              Partner promotions
            </div>
          </button>
        </div>
      </div>

      <ModernProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </section>
  );
};
