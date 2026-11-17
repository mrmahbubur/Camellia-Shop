import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Eye,
  ShoppingBag,
  Layers,
  Laptop,
  Headphones,
  Smartphone,
  GraduationCap,
  Globe
} from 'lucide-react';
import { EcomProduct, ProductCategory } from '../data/unifiedProductsData';
import { getContextualSponsors } from '../data/sponsorsData';
import { StoreFilterOption, useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { ModernProductModal } from './ModernProductModal';
import { ResilientImage } from './ResilientImage';

interface CustomerThemeProfile {
  id: string;
  label: string;
  headline: string;
  summary: string;
  idealFor: string;
  partnerStores: string;
  targetStore: StoreFilterOption;
  targetCategory: ProductCategory;
  sponsorContextKey: string;
  productIds: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const CUSTOMER_THEMES: CustomerThemeProfile[] = [
  {
    id: 'remote-desk',
    label: 'Remote Desk & Pro',
    headline: 'Ergonomic Workstation Hardware & Dual-Screen Productivity',
    summary:
      'Built for remote engineers, analysts, and home office professionals looking for tactile precision, glare-free lighting, and single-cable laptop docking.',
    idealFor: 'Software Engineers, Analysts & Home Offices',
    partnerStores: 'Amazon Associates · Shopz BD',
    targetStore: 'all',
    targetCategory: 'Office & Workspace',
    sponsorContextKey: 'Office & Workspace',
    productIds: [
      'amz-mx-master-3s',
      'amz-benq-screenbar',
      'amz-ergotron-monitor-arm',
      'amz-caldigit-ts4-dock',
      'amz-wool-felt-desk-mat',
      'csv-wiwu-s600-laptop-stand'
    ],
    icon: Laptop
  },
  {
    id: 'creator-studio',
    label: 'Creator & Studio',
    headline: 'Podcast Audio, Studio Noise Isolation & Portable Editing Storage',
    summary:
      'Tailored for video creators, podcasters, and mobile streamers combining XLR/USB broadcast microphones, RGB fill lights, tripods, and rugged 2TB NVMe storage.',
    idealFor: 'Podcasters, YouTubers & Mobile Photographers',
    partnerStores: 'Amazon Associates · Shopz BD',
    targetStore: 'all',
    targetCategory: 'Audio & Headphones',
    sponsorContextKey: 'Audio & Studio',
    productIds: [
      'amz-shure-mv7-mic',
      'amz-anc-studio-headphones',
      'amz-samsung-t7-shield-2tb',
      'csv-ulanzi-a100-wireless-lavalier-microphone',
      'csv-ulanzi-vl120-rgb-mini-led-video-light-2500k',
      'csv-ulanzi-mt-78-extendable-phone-tripod'
    ],
    icon: Headphones
  },
  {
    id: 'mobile-commuter',
    label: 'Mobile & Travel',
    headline: 'Fast GaN Power, Active Earbuds & Connected Wristwear',
    summary:
      'Designed for daily commuters and frequent flyers who need multi-device Qi2 charging, airline-ready 250W laptop power banks, ANC audio, and rugged watches.',
    idealFor: 'Travelers, Commuters & Fitness Trackers',
    partnerStores: 'Amazon Associates · Shopz BD',
    targetStore: 'all',
    targetCategory: 'Wearables & Smartwatches',
    sponsorContextKey: 'Smart Home & Power',
    productIds: [
      'amz-anker-magsafe-3in1',
      'amz-anker-prime-27650',
      'csv-qcy-ht05-melobuds-anc-true-wireless-earbuds',
      'csv-baseus-22-5w-adaman-20000mah-power-bank',
      'csv-zeblaze-btalk-3-pro',
      'csv-casio-f-91w-1-digital-watch'
    ],
    icon: Smartphone
  },
  {
    id: 'student-home',
    label: 'Student & Home Living',
    headline: 'Study Desk Lighting, Calculators & Everyday Home Utilities',
    summary:
      'Practical, budget-friendly essentials delivered nationwide through Shopz BD—from engineering calculators and rechargeable fans to reading clip lamps and grooming kits.',
    idealFor: 'University Students, Dorms & Everyday Households',
    partnerStores: 'Shopz BD Nationwide Courier',
    targetStore: 'Shopz BD',
    targetCategory: 'Shopz BD Tech Deals',
    sponsorContextKey: 'Shopz BD Tech Deals',
    productIds: [
      'csv-casio-fx-991ex-scientific-calculator',
      'csv-baseus-comfort-reading-mini-clip-lamp',
      'csv-yage-yg-t109-table-lamp-pen-holder-desk-lamp',
      'csv-xiaomi-solove-f5-5w-4000mah-rechargeable-desktop-stand-fan',
      'csv-lenovo-livepods-lp1s-tws-bluetooth-earphone',
      'csv-binge-android-tv-box-dongle'
    ],
    icon: GraduationCap
  },
  {
    id: 'web-builder',
    label: 'Web Builder & Brand',
    headline: 'NVMe Cloud Hosting, Domains & Studio Hardware to Launch Online',
    summary:
      'For independent founders and agencies launching real storefronts or web apps—pairing ExonHost LiteSpeed NVMe hosting and domains with reliable studio desk gear.',
    idealFor: 'Founders, Freelance Web Developers & Agencies',
    partnerStores: 'ExonHost Cloud · Amazon · Shopz BD',
    targetStore: 'ExonHost',
    targetCategory: 'Cloud Hosting & Domains',
    sponsorContextKey: 'Cloud Hosting & Domains',
    productIds: [
      'exonhost-turbo-nvme',
      'exonhost-managed-wp',
      'exonhost-domain-bundle',
      'amz-benq-screenbar',
      'amz-mx-master-3s',
      'shopz-ugreen-100w-cable-kit'
    ],
    icon: Globe
  }
];

interface AffiliateCategoryLink {
  label: string;
  count: number;
  store: StoreFilterOption;
  category: ProductCategory;
}

export const CustomerThemesSection: React.FC = () => {
  const {
    products,
    sponsors,
    setSelectedCategory,
    setSelectedStoreFilter,
    getAffiliateBuyUrl,
    amazonShortUrl,
    amazonStoreUrl,
    shopzStoreUrl,
    exonhostStoreUrl,
    recordAffiliateClick
  } = useProducts();
  const { formatPrice, addToCart } = useCart();

  const [activeThemeId, setActiveThemeId] = useState<string>(CUSTOMER_THEMES[0].id);
  const [modalProduct, setModalProduct] = useState<EcomProduct | null>(null);

  const activeTheme = useMemo(
    () => CUSTOMER_THEMES.find((t) => t.id === activeThemeId) || CUSTOMER_THEMES[0],
    [activeThemeId]
  );

  const themeProducts = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    const resolved: EcomProduct[] = [];
    for (const id of activeTheme.productIds) {
      const match = byId.get(id);
      if (match) resolved.push(match);
    }
    if (resolved.length < 6) {
      const fallbacks = products.filter(
        (p) =>
          (p.category === activeTheme.targetCategory || p.department === activeTheme.targetCategory) &&
          !resolved.some((r) => r.id === p.id)
      );
      resolved.push(...fallbacks.slice(0, 6 - resolved.length));
    }
    return resolved.slice(0, 6);
  }, [products, activeTheme]);

  const affiliateDirectory = useMemo(() => {
    const countFor = (store: 'Amazon' | 'Shopz BD' | 'ExonHost', category: ProductCategory) =>
      products.filter(
        (p) => p.originStore === store && (p.category === category || p.department === category)
      ).length;

    const rawAmazon: AffiliateCategoryLink[] = [
      { label: 'Computers & Peripherals', count: countFor('Amazon', 'Computers & Accessories'), store: 'Amazon', category: 'Computers & Accessories' },
      { label: 'Workspace & Ergonomics', count: countFor('Amazon', 'Office & Workspace'), store: 'Amazon', category: 'Office & Workspace' },
      { label: 'Audio & Studio Gear', count: countFor('Amazon', 'Audio & Headphones'), store: 'Amazon', category: 'Audio & Headphones' },
      { label: 'Charging & Power', count: countFor('Amazon', 'Smart Home & Power'), store: 'Amazon', category: 'Smart Home & Power' }
    ];
    const amazonCategories = rawAmazon.filter((c) => c.count > 0);

    const rawShopz: AffiliateCategoryLink[] = [
      { label: 'Wireless Earbuds & Mics', count: countFor('Shopz BD', 'Audio & Headphones'), store: 'Shopz BD', category: 'Audio & Headphones' },
      { label: 'Smartwatches & Wristwear', count: countFor('Shopz BD', 'Wearables & Smartwatches'), store: 'Shopz BD', category: 'Wearables & Smartwatches' },
      { label: 'Trimmers, Coolers & Tech', count: countFor('Shopz BD', 'Electronics & Gadgets'), store: 'Shopz BD', category: 'Electronics & Gadgets' },
      { label: 'Lamps, Tripods & Stands', count: countFor('Shopz BD', 'Office & Workspace'), store: 'Shopz BD', category: 'Office & Workspace' },
      { label: 'Fans, Bulbs & Flashlights', count: countFor('Shopz BD', 'Smart Home & Power'), store: 'Shopz BD', category: 'Smart Home & Power' },
      { label: 'Shopz BD Tech Deals', count: countFor('Shopz BD', 'Shopz BD Tech Deals'), store: 'Shopz BD', category: 'Shopz BD Tech Deals' }
    ];
    const shopzCategories = rawShopz.filter((c) => c.count > 0);

    const rawExonhost: AffiliateCategoryLink[] = [
      {
        label: 'Turbo NVMe, Managed WP & Domains',
        count: countFor('ExonHost', 'Cloud Hosting & Domains'),
        store: 'ExonHost',
        category: 'Cloud Hosting & Domains'
      }
    ];
    const exonhostCategories = rawExonhost.filter((c) => c.count > 0);

    const sponsorGroups = [
      {
        label: 'Hardware & Power Partners',
        count: sponsors.filter((s) => s.group === 'Hardware & Power').length
      },
      {
        label: 'Workspace & Audio Partners',
        count: sponsors.filter((s) => s.group === 'Workspace & Audio').length
      },
      {
        label: 'Deals & Bundle Promotions',
        count: sponsors.filter((s) => s.group === 'Deals & Bundles').length
      }
    ];

    return {
      amazonTotal: products.filter((p) => p.originStore === 'Amazon').length,
      shopzTotal: products.filter((p) => p.originStore === 'Shopz BD').length,
      exonhostTotal: products.filter((p) => p.originStore === 'ExonHost').length,
      sponsorsTotal: sponsors.length,
      amazonCategories,
      shopzCategories,
      exonhostCategories,
      sponsorGroups
    };
  }, [products, sponsors]);

  const jumpToFilteredStore = (store: StoreFilterOption, category: ProductCategory) => {
    setSelectedStoreFilter(store);
    setSelectedCategory(category);
    const el = document.getElementById('store');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jumpToSponsors = () => {
    const el = document.getElementById('sponsors');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveToCart = (product: EcomProduct) => {
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
        csvCategory: product.csvCategory,
        sourceType: product.sourceType,
        originStore: product.originStore,
        affiliateUrl: getAffiliateBuyUrl(product)
      },
      1
    );
  };

  return (
    <section
      id="customer-themes"
      className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 scroll-mt-14 sm:scroll-mt-16 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] space-y-12 sm:space-y-14">
        {/* PART 1: Customer-Based Lifestyle Collections */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div className="min-w-0 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">Customer Collections</span>
                <span aria-hidden="true">·</span>
                <span>Curated by Buyer Need</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
                {activeTheme.headline}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {activeTheme.summary}
              </p>
            </div>

            <button
              type="button"
              onClick={() => jumpToFilteredStore(activeTheme.targetStore, activeTheme.targetCategory)}
              className="self-start lg:self-end px-4 min-h-[40px] py-2.5 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Filter Full {activeTheme.targetCategory}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* Interactive Customer Profile Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Customer lifestyle themes"
            className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 sm:mb-8 scrollbar-none"
          >
            {CUSTOMER_THEMES.map((theme) => {
              const Icon = theme.icon;
              const active = theme.id === activeTheme.id;
              return (
                <button
                  key={theme.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveThemeId(theme.id)}
                  className={`px-3.5 min-h-[40px] py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>

          {/* Unboxed Customer Theme Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-semibold text-slate-900 dark:text-slate-200">Best For:</span>
              <span>{activeTheme.idealFor}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200">Retail Partners:</span>
              <span>{activeTheme.partnerStores}</span>
            </div>
            <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {themeProducts.length} Featured Picks
            </span>
          </div>

          {/* 3-Column Customer Theme Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {themeProducts.map((product) => {
              const buyUrl = getAffiliateBuyUrl(product);
              const isShopz = product.originStore === 'Shopz BD';
              const isExonHost = product.originStore === 'ExonHost';
              const hasPrice =
                product.nativePrice !== undefined ? product.nativePrice > 0 : product.price > 0;

              return (
                <article
                  key={product.id}
                  className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div
                    onClick={() => setModalProduct(product)}
                    className="relative aspect-4/3 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                  >
                    <ResilientImage
                      src={product.mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 truncate">
                        <span
                          className={`font-bold ${
                            isExonHost
                              ? 'text-sky-600 dark:text-sky-400'
                              : isShopz
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {product.originStore}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.csvCategory || product.category}</span>
                      </div>

                      <h3
                        onClick={() => setModalProduct(product)}
                        className="text-base font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 cursor-pointer hover:text-amber-700 dark:hover:text-amber-400 transition-colors mb-1.5"
                      >
                        {product.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        {hasPrice ? (
                          <div className="flex items-baseline gap-2 min-w-0">
                            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                              {formatPrice(product.price, product.nativePrice, product.nativeCurrency)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            Check Live Price
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {product.brand}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={buyUrl}
                          target="_blank"
                          rel="noreferrer noopener sponsored"
                          onClick={() => recordAffiliateClick(`theme-${activeTheme.id}-${product.id}`)}
                          className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                            isExonHost
                              ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                              : isShopz
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                              : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                          }`}
                        >
                          <span>Buy on {product.originStore}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setModalProduct(product)}
                          title="Inspect specifications"
                          aria-label={`Inspect ${product.title}`}
                          className="min-h-[40px] min-w-[40px] p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveToCart(product)}
                          title="Save to hardware list"
                          aria-label={`Save ${product.title}`}
                          className="min-h-[40px] min-w-[40px] p-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Matching Contextual Sponsor Strip */}
          {sponsors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getContextualSponsors(sponsors, activeTheme.sponsorContextKey, 2).map((sp) => (
                <a
                  key={sp.id}
                  href={sp.url}
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  onClick={() => recordAffiliateClick(`theme-sponsor-${sp.id}`)}
                  className="group bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center justify-between gap-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-amber-700 dark:text-amber-400">Sponsored Match</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{sp.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {sp.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                      {sp.subtitle}
                    </p>
                  </div>
                  <span className="px-3 min-h-[36px] py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-amber-400 group-hover:border-amber-400 text-slate-900 dark:text-slate-100 group-hover:text-slate-950 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-colors">
                    <span>{sp.ctaLabel}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* PART 2: Categorized Affiliate Sites by Real Products */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Partner Storefront Directory</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
                All Affiliate Sites Categorized by Real Product Lines
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Select any product category under a partner store below to filter the live catalog or open the official merchant portal directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* 1. Amazon Associates */}
            <div className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Amazon Associates
                    </h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                      Global Prime &amp; Tech Catalog
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {affiliateDirectory.amazonTotal} items
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {affiliateDirectory.amazonCategories.map((cat) => (
                    <li key={cat.label}>
                      <button
                        type="button"
                        onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                      >
                        <span className="truncate">{cat.label}</span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                          {cat.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={amazonStoreUrl}
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  onClick={() => recordAffiliateClick('dir-amazon-store')}
                  className="flex-1 min-h-[38px] px-3 py-2 bg-[#FF9900] hover:bg-[#e88b00] text-slate-950 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <span>Amazon Store</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
                <a
                  href={amazonShortUrl}
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  onClick={() => recordAffiliateClick('dir-amazon-deals')}
                  className="min-h-[38px] px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-lg inline-flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                >
                  <span>Deals</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* 2. Shopz BD */}
            <div className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Shopz BD
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      Bangladesh Express &amp; BDT Catalog
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {affiliateDirectory.shopzTotal} items
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {affiliateDirectory.shopzCategories.map((cat) => (
                    <li key={cat.label}>
                      <button
                        type="button"
                        onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                      >
                        <span className="truncate">{cat.label}</span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                          {cat.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <a
                  href={shopzStoreUrl}
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  onClick={() => recordAffiliateClick('dir-shopz-store')}
                  className="w-full min-h-[38px] px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <span>Visit Shopz.com.bd</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* 3. ExonHost Cloud */}
            <div className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      ExonHost Partner
                    </h4>
                    <p className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                      NVMe Hosting, WordPress &amp; Domains
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {affiliateDirectory.exonhostTotal} plans
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {affiliateDirectory.exonhostCategories.map((cat) => (
                    <li key={cat.label}>
                      <button
                        type="button"
                        onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                      >
                        <span className="truncate">{cat.label}</span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                          {cat.count}
                        </span>
                      </button>
                    </li>
                  ))}
                  <li className="px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    USA, Singapore &amp; Bangladesh NVMe server nodes with instant SSL and daily JetBackup snapshots.
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <a
                  href={exonhostStoreUrl}
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  onClick={() => recordAffiliateClick('dir-exonhost-store')}
                  className="w-full min-h-[38px] px-3 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <span>Open ExonHost Portal</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* 4. Sponsored Partners */}
            <div className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Sponsored Offers
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Curated Tech &amp; Deal Promotions
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {affiliateDirectory.sponsorsTotal} offers
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {affiliateDirectory.sponsorGroups.map((grp) => (
                    <li key={grp.label}>
                      <button
                        type="button"
                        onClick={jumpToSponsors}
                        className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                      >
                        <span className="truncate">{grp.label}</span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                          {grp.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={jumpToSponsors}
                  className="w-full min-h-[38px] px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Browse All Sponsors</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModernProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </section>
  );
};
