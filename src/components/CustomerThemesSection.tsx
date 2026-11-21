import React, { useEffect, useMemo, useState } from 'react';
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
  Globe,
  Compass,
  SlidersHorizontal,
  Check,
  Droplets
} from 'lucide-react';
import { EcomProduct, ProductCategory, buildRelevaProductUrl } from '../data/unifiedProductsData';
import { getContextualSponsors } from '../data/sponsorsData';
import { StoreFilterOption, useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import {
  REGION_ORDER,
  REGION_PROFILES,
  VisitorRegionCode,
  PartnerStoreOrigin,
  getStorePriorityRank
} from '../utils/regionProfile';
import { BUYING_NEED_META, type BuyingNeed } from '../utils/recommendations';
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
      'Built for remote engineers, analysts, and home office setups looking for tactile mice, task lighting, USB-C docking, and display mounting.',
    idealFor: 'Software Engineers, Analysts & Home Offices',
    partnerStores: 'Amazon · Alibaba · Shopz BD',
    targetStore: 'all',
    targetCategory: 'Office & Workspace',
    sponsorContextKey: 'Office & Workspace',
    productIds: [
      'amz-mx-master-3s',
      'amz-huanuo-monitor-arm',
      'alibaba-ergonomic-monitor-arm-bulk',
      'amz-benq-screenbar',
      'amz-caldigit-ts4-dock',
      'csv-wiwu-s600-laptop-stand'
    ],
    icon: Laptop
  },
  {
    id: 'creator-studio',
    label: 'Creator & Studio',
    headline: 'Podcast Audio, Studio Noise Isolation & Portable Editing Storage',
    summary:
      'Tailored for video creators, podcasters, and mobile streamers combining USB/XLR microphones, RGB fill lights, tripods, and 2TB portable SSDs.',
    idealFor: 'Podcasters, YouTubers & Mobile Photographers',
    partnerStores: 'Amazon · Alibaba · Shopz BD',
    targetStore: 'all',
    targetCategory: 'Audio & Headphones',
    sponsorContextKey: 'Audio & Studio',
    productIds: [
      'amz-shure-mv7-mic',
      'amz-sony-wh1000xm5',
      'alibaba-studio-creator-desk-bundle',
      'amz-samsung-t7-shield-2tb',
      'csv-ulanzi-a100-wireless-lavalier-microphone',
      'csv-ulanzi-vl120-rgb-mini-led-video-light-2500k'
    ],
    icon: Headphones
  },
  {
    id: 'mobile-commuter',
    label: 'Mobile & Travel',
    headline: 'USB-C Power Banks, Wireless Earbuds & Connected Wristwear',
    summary:
      'Designed for daily commuters and travelers who want multi-device Qi2 charging, high-capacity power banks, wireless earbuds, and everyday watches.',
    idealFor: 'Travelers, Commuters & Daily Carry',
    partnerStores: 'Amazon · Star Tech · Shopz BD · Alibaba',
    targetStore: 'all',
    targetCategory: 'Wearables & Smartwatches',
    sponsorContextKey: 'Smart Home & Power',
    productIds: [
      'startech-colmi-p71',
      'illin-poedagar-men-watch-1563',
      'startech-colmi-p81',
      'illin-poedagar-women-1727',
      'amz-anker-magsafe-3in1',
      'amz-anker-prime-250w'
    ],
    icon: Smartphone
  },
  {
    id: 'student-home',
    label: 'Student & BD Retail',
    headline: 'Study Desk Lighting, Calculators & Regional Partner Picks',
    summary:
      'Practical desk lighting, scientific calculators, earbuds, and Bangladesh partner store links from Shopz BD and Releva BD.',
    idealFor: 'University Students, Dorms & Bangladesh Shoppers',
    partnerStores: 'Shopz BD · Releva BD · Amazon',
    targetStore: 'Shopz BD',
    targetCategory: 'Shopz BD Tech Deals',
    sponsorContextKey: 'Shopz BD Tech Deals',
    productIds: [
      'csv-casio-fx-991ex-scientific-calculator',
      'releva-bd-130',
      'csv-baseus-comfort-reading-mini-clip-lamp',
      'csv-yage-yg-t109-table-lamp-pen-holder-desk-lamp',
      'releva-bd-131',
      'csv-lenovo-livepods-lp1s-tws-bluetooth-earphone'
    ],
    icon: GraduationCap
  },
  {
    id: 'web-builder',
    label: 'Web Builder & Brand',
    headline: 'Web Hosting, Domain Portals & Studio Desk Hardware',
    summary:
      'For independent founders and developers launching web storefronts—pairing ExonHost hosting portals with desk hardware and accessory sourcing links.',
    idealFor: 'Founders, Web Developers & Agencies',
    partnerStores: 'ExonHost · Alibaba · Amazon',
    targetStore: 'ExonHost',
    targetCategory: 'Cloud Hosting & Domains',
    sponsorContextKey: 'Cloud Hosting & Domains',
    productIds: [
      'exonhost-turbo-nvme',
      'exonhost-managed-wp',
      'exonhost-domain-bundle',
      'alibaba-usb-c-dock-factory-lot',
      'amz-caldigit-ts4-dock',
      'amz-mx-master-3s'
    ],
    icon: Globe
  },
  {
    id: 'beauty-home',
    label: 'Skincare & Home',
    headline: 'Korean Skincare, Espresso & Coffee Makers & BD Home Upgrades',
    summary:
      'Authentic skincare serums, sunscreens, and toners from BanglaShoppers alongside real kitchen appliances, mini air coolers, and reseller portals from Illin BD & Sohoj Affiliates.',
    idealFor: 'Daily Skincare, Coffee Lovers & Home Upgrades',
    partnerStores: 'BanglaShoppers · Illin BD · Sohoj Affiliates',
    targetStore: 'BanglaShoppers',
    targetCategory: 'BanglaShoppers Beauty',
    sponsorContextKey: 'BanglaShoppers Beauty',
    productIds: [
      'illin-royal-purple-bedsheet',
      'illin-jennie-moon-soap',
      'illin-sp6-whitening-toothpaste',
      'illin-toenailplus-relief-oil',
      'bs-some-by-mi-miracle-serum',
      'illin-miyako-coffee-maker-cm327'
    ],
    icon: Droplets
  }
];

interface AffiliateCategoryLink {
  label: string;
  count: number;
  store: StoreFilterOption;
  category: ProductCategory;
}

const BUYING_NEEDS = Object.keys(BUYING_NEED_META) as BuyingNeed[];

const BUDGET_OPTIONS: Array<{ value: number | null; label: string }> = [
  { value: null, label: 'Any price (all partners)' },
  { value: 15, label: 'Up to ~$15' },
  { value: 25, label: 'Up to ~$25' },
  { value: 50, label: 'Up to ~$50' },
  { value: 100, label: 'Up to ~$100' }
];

const PREFERRED_STORES: Array<{ value: PartnerStoreOrigin | 'all'; label: string }> = [
  { value: 'all', label: 'Regional priority (All)' },
  { value: 'Amazon', label: 'Amazon' },
  { value: 'Shopz BD', label: 'Shopz BD' },
  { value: 'Star Tech', label: 'Star Tech' },
  { value: 'BanglaShoppers', label: 'BanglaShoppers' },
  { value: 'Illin BD', label: 'Illin BD' },
  { value: 'Releva BD', label: 'Releva BD' },
  { value: 'Alibaba', label: 'Alibaba' },
  { value: 'ExonHost', label: 'ExonHost' },
  { value: 'Sohoj Affiliates', label: 'Sohoj Affiliates' }
];

export const CustomerThemesSection: React.FC = () => {
  const {
    products,
    sponsors,
    setSelectedCategory,
    setSelectedStoreFilter,
    visitorRegion,
    setVisitorRegion,
    regionProfile,
    buyingNeed,
    setBuyingNeed,
    buyingBudgetUsd,
    setBuyingBudgetUsd,
    buyingPreferredStore,
    setBuyingPreferredStore,
    recommendations,
    getAffiliateBuyUrl,
    amazonShortUrl,
    amazonStoreUrl,
    shopzStoreUrl,
    relevaStoreUrl,
    exonhostStoreUrl,
    alibabaStoreUrl,
    banglashoppersStoreUrl,
    illinStoreUrl,
    startechStoreUrl,
    sohojStoreUrl,
    recordAffiliateClick
  } = useProducts();
  const { formatPrice, addToCart, cart } = useCart();

  const [activeThemeId, setActiveThemeId] = useState<string>(
    regionProfile.preferredThemeId || CUSTOMER_THEMES[0].id
  );
  const [hasPickedTheme, setHasPickedTheme] = useState(false);
  const [modalProduct, setModalProduct] = useState<EcomProduct | null>(null);

  useEffect(() => {
    if (!hasPickedTheme && regionProfile.preferredThemeId) {
      setActiveThemeId(regionProfile.preferredThemeId);
    }
  }, [hasPickedTheme, regionProfile.preferredThemeId]);

  const savedIds = useMemo(() => new Set(cart.map((item) => item.product.id)), [cart]);

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
          (p.category === activeTheme.targetCategory ||
            p.department === activeTheme.targetCategory) &&
          !resolved.some((r) => r.id === p.id)
      );
      resolved.push(...fallbacks.slice(0, 6 - resolved.length));
    }
    return [...resolved.slice(0, 6)].sort(
      (a, b) =>
        getStorePriorityRank(a.originStore, visitorRegion) -
        getStorePriorityRank(b.originStore, visitorRegion)
    );
  }, [products, activeTheme, visitorRegion]);

  const affiliateDirectory = useMemo(() => {
    const countFor = (store: PartnerStoreOrigin, category: ProductCategory) =>
      products.filter(
        (p) =>
          p.originStore === store &&
          (p.category === category || p.department === category)
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

    const rawReleva: AffiliateCategoryLink[] = [
      { label: 'Releva BD Featured Products', count: countFor('Releva BD', 'Releva BD Picks'), store: 'Releva BD', category: 'Releva BD Picks' }
    ];
    const relevaCategories = rawReleva.filter((c) => c.count > 0);

    const rawAlibaba: AffiliateCategoryLink[] = [
      { label: 'Monitor Arms & Desk Mounts', count: countFor('Alibaba', 'Office & Workspace'), store: 'Alibaba', category: 'Office & Workspace' },
      { label: 'USB-C Hubs & Peripherals', count: countFor('Alibaba', 'Computers & Accessories'), store: 'Alibaba', category: 'Computers & Accessories' },
      { label: 'Studio Lighting & Audio', count: countFor('Alibaba', 'Audio & Headphones'), store: 'Alibaba', category: 'Audio & Headphones' },
      { label: 'Wireless Chargers & Power', count: countFor('Alibaba', 'Smart Home & Power'), store: 'Alibaba', category: 'Smart Home & Power' }
    ];
    const alibabaCategories = rawAlibaba.filter((c) => c.count > 0);

    const rawExonhost: AffiliateCategoryLink[] = [
      { label: 'Hosting, WordPress & Domains', count: countFor('ExonHost', 'Cloud Hosting & Domains'), store: 'ExonHost', category: 'Cloud Hosting & Domains' }
    ];
    const exonhostCategories = rawExonhost.filter((c) => c.count > 0);

    const rawBanglaShoppers: AffiliateCategoryLink[] = [
      { label: 'Serums, Toners & Sunscreens', count: countFor('BanglaShoppers', 'BanglaShoppers Beauty'), store: 'BanglaShoppers', category: 'BanglaShoppers Beauty' }
    ];
    const banglaShoppersCategories = rawBanglaShoppers.filter((c) => c.count > 0);

    const rawIllin: AffiliateCategoryLink[] = [
      { label: 'Bedsheets, Cooling Fans & Appliances', count: countFor('Illin BD', 'Illin BD Home & Tech'), store: 'Illin BD', category: 'Illin BD Home & Tech' },
      { label: 'POEDAGAR Luxury & Fashion Watches', count: countFor('Illin BD', 'Wearables & Smartwatches'), store: 'Illin BD', category: 'Wearables & Smartwatches' }
    ];
    const illinCategories = rawIllin.filter((c) => c.count > 0);

    const rawStartech: AffiliateCategoryLink[] = [
      { label: 'Desktop PCs, Laptops & Monitors', count: countFor('Star Tech', 'Computers & Accessories'), store: 'Star Tech', category: 'Computers & Accessories' },
      { label: 'Earbuds, Speakers & Headsets', count: countFor('Star Tech', 'Audio & Headphones'), store: 'Star Tech', category: 'Audio & Headphones' },
      { label: 'Power Stations, Air Fryers & Smart Home', count: countFor('Star Tech', 'Smart Home & Power'), store: 'Star Tech', category: 'Smart Home & Power' },
      { label: 'Drones, Trimmers, Gadgets & Parts', count: countFor('Star Tech', 'Electronics & Gadgets'), store: 'Star Tech', category: 'Electronics & Gadgets' },
      { label: 'Smartwatches & Fitness Wearables', count: countFor('Star Tech', 'Wearables & Smartwatches'), store: 'Star Tech', category: 'Wearables & Smartwatches' }
    ];
    const startechCategories = rawStartech.filter((c) => c.count > 0);

    const rawSohoj: AffiliateCategoryLink[] = [
      { label: 'Affiliate & Reseller Portals', count: countFor('Sohoj Affiliates', 'Sohoj Affiliate Network'), store: 'Sohoj Affiliates', category: 'Sohoj Affiliate Network' }
    ];
    const sohojCategories = rawSohoj.filter((c) => c.count > 0);

    const sponsorGroups = [
      { label: 'Hardware & Power Partners', count: sponsors.filter((s) => s.group === 'Hardware & Power').length },
      { label: 'Workspace & Audio Partners', count: sponsors.filter((s) => s.group === 'Workspace & Audio').length },
      { label: 'Deals & Bundle Promotions', count: sponsors.filter((s) => s.group === 'Deals & Bundles').length }
    ];

    return {
      amazonTotal: products.filter((p) => p.originStore === 'Amazon').length,
      shopzTotal: products.filter((p) => p.originStore === 'Shopz BD').length,
      relevaTotal: products.filter((p) => p.originStore === 'Releva BD').length,
      alibabaTotal: products.filter((p) => p.originStore === 'Alibaba').length,
      exonhostTotal: products.filter((p) => p.originStore === 'ExonHost').length,
      banglaShoppersTotal: products.filter((p) => p.originStore === 'BanglaShoppers').length,
      illinTotal: products.filter((p) => p.originStore === 'Illin BD').length,
      startechTotal: products.filter((p) => p.originStore === 'Star Tech').length,
      sohojTotal: products.filter((p) => p.originStore === 'Sohoj Affiliates').length,
      sponsorsTotal: sponsors.length,
      amazonCategories,
      shopzCategories,
      relevaCategories,
      alibabaCategories,
      exonhostCategories,
      banglaShoppersCategories,
      illinCategories,
      startechCategories,
      sohojCategories,
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

  const getStoreColorText = (store: PartnerStoreOrigin) => {
    if (store === 'ExonHost') return 'text-sky-600 dark:text-sky-400';
    if (store === 'Shopz BD') return 'text-emerald-600 dark:text-emerald-400';
    if (store === 'Releva BD') return 'text-teal-600 dark:text-teal-400';
    if (store === 'Alibaba') return 'text-indigo-600 dark:text-indigo-400';
    if (store === 'BanglaShoppers') return 'text-rose-600 dark:text-rose-400';
    if (store === 'Illin BD') return 'text-cyan-700 dark:text-cyan-400';
    if (store === 'Star Tech') return 'text-orange-600 dark:text-orange-400';
    if (store === 'Sohoj Affiliates') return 'text-violet-600 dark:text-violet-400';
    return 'text-amber-700 dark:text-amber-400';
  };

  const getStoreButtonClass = (store: PartnerStoreOrigin) => {
    if (store === 'ExonHost') return 'bg-sky-500 hover:bg-sky-400 text-slate-950';
    if (store === 'Shopz BD') return 'bg-emerald-500 hover:bg-emerald-400 text-slate-950';
    if (store === 'Releva BD') return 'bg-teal-500 hover:bg-teal-400 text-slate-950';
    if (store === 'Alibaba') return 'bg-indigo-600 hover:bg-indigo-500 text-white';
    if (store === 'BanglaShoppers') return 'bg-rose-500 hover:bg-rose-400 text-white';
    if (store === 'Illin BD') return 'bg-cyan-400 hover:bg-cyan-300 text-slate-950';
    if (store === 'Star Tech') return 'bg-orange-600 hover:bg-orange-500 text-white';
    if (store === 'Sohoj Affiliates') return 'bg-violet-600 hover:bg-violet-500 text-white';
    return 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950';
  };

  return (
    <section
      id="customer-themes"
      className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 scroll-mt-14 sm:scroll-mt-16 transition-colors"
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] space-y-12 sm:space-y-14">
        {/* PART 0: INTERACTIVE BUYING GUIDE & TRANSPARENT RECOMMENDATIONS */}
        <div
          id="buying-guide"
          className="scroll-mt-20 bg-slate-50/80 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-7 space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Interactive Buying Guide</span>
                <span aria-hidden="true">·</span>
                <span>{regionProfile.label}</span>
              </div>
              <h2 className="text-[clamp(1.25rem,2.4vw,1.625rem)] font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
                Match Partner Listings to Your Goal &amp; Budget
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {BUYING_NEED_META[buyingNeed].description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end w-full lg:w-auto">
              <select
                value={buyingBudgetUsd === null ? '' : String(buyingBudgetUsd)}
                onChange={(e) =>
                  setBuyingBudgetUsd(e.target.value ? Number(e.target.value) : null)
                }
                aria-label="Filter recommendations by approximate budget"
                className="min-h-[44px] flex-1 sm:flex-initial bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value === null ? '' : String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={buyingPreferredStore}
                onChange={(e) =>
                  setBuyingPreferredStore(e.target.value as PartnerStoreOrigin | 'all')
                }
                aria-label="Preferred partner store for buying guide"
                className="min-h-[44px] flex-1 sm:flex-initial bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
              >
                {PREFERRED_STORES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Goal Switcher Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {BUYING_NEEDS.map((needKey) => {
              const active = buyingNeed === needKey;
              return (
                <button
                  key={needKey}
                  type="button"
                  onClick={() => setBuyingNeed(needKey)}
                  aria-pressed={active}
                  className={`px-3.5 min-h-[44px] py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {BUYING_NEED_META[needKey].label}
                </button>
              );
            })}
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 min-[481px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {recommendations.map((rec) => {
              const product = rec.item;
              const buyUrl = getAffiliateBuyUrl(product);
              const hasPrice =
                product.nativePrice !== undefined ? product.nativePrice > 0 : product.price > 0;

              return (
                <article
                  key={`rec-${product.id}`}
                  className="responsive-card h-full bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between gap-3.5"
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => setModalProduct(product)}
                      aria-label={`Inspect ${product.title}`}
                      className="w-24 sm:w-28 aspect-[4/3] rounded-lg overflow-hidden bg-white p-1.5 sm:p-2 border border-slate-200/80 dark:border-slate-700 shrink-0 cursor-pointer relative flex items-center justify-center"
                    >
                      <ResilientImage
                        src={product.mainImage}
                        alt={product.title}
                        className="responsive-card-media max-w-full max-h-full w-auto h-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className={`font-bold uppercase tracking-wider ${getStoreColorText(product.originStore)}`}>
                          {product.originStore}
                        </span>
                      </div>
                      <h3
                        onClick={() => setModalProduct(product)}
                        className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 cursor-pointer hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                      >
                        {product.title}
                      </h3>
                      <div className="text-xs font-mono font-bold tabular-nums text-slate-800 dark:text-slate-100">
                        {hasPrice ? (
                          <span>
                            {formatPrice(product.price, product.nativePrice, product.nativeCurrency)}
                          </span>
                        ) : (
                          <span className="font-sans text-emerald-700 dark:text-emerald-400">
                            Check Price on {product.originStore}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 rounded-lg px-2.5 py-2 border border-slate-200/70 dark:border-slate-800 leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Why recommended:{' '}
                    </span>
                    {rec.whyRecommended}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={buyUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      onClick={() =>
                        recordAffiliateClick(product.id, product.originStore, product.category)
                      }
                      className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${getStoreButtonClass(
                        product.originStore
                      )}`}
                    >
                      <span>
                        {product.urlKind === 'portal'
                          ? `Open ${product.originStore}`
                          : `View on ${product.originStore}`}
                      </span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setModalProduct(product)}
                      aria-label={`Inspect ${product.title}`}
                      className="min-h-[44px] min-w-[44px] p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveToCart(product)}
                      aria-label={`Save ${product.title}`}
                      className={`min-h-[44px] min-w-[44px] p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                        savedIds.has(product.id)
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                      }`}
                    >
                      {savedIds.has(product.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

        </div>

        {/* PART 1: Customer-Based Lifestyle Collections */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div className="min-w-0 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">Customer Collections</span>
                <span aria-hidden="true">·</span>
                <span>{regionProfile.label}</span>
              </div>
              <h2 className="text-[clamp(1.375rem,3vw,1.875rem)] font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
                {activeTheme.headline}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {activeTheme.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end w-full lg:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 flex-1 sm:flex-initial">
                <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <select
                  value={visitorRegion}
                  onChange={(e) => {
                    setHasPickedTheme(false);
                    setVisitorRegion(e.target.value as VisitorRegionCode);
                  }}
                  aria-label="Choose shopping region"
                  className="min-h-[44px] w-full sm:w-auto bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400 focus:outline-hidden cursor-pointer"
                >
                  {REGION_ORDER.map((code) => (
                    <option key={code} value={code}>
                      {REGION_PROFILES[code].label} ({REGION_PROFILES[code].defaultCurrency})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => jumpToFilteredStore(activeTheme.targetStore, activeTheme.targetCategory)}
                className="px-4 min-h-[44px] py-2.5 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-bold text-xs rounded-xl transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Filter {activeTheme.targetCategory}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
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
                  onClick={() => {
                    setHasPickedTheme(true);
                    setActiveThemeId(theme.id);
                  }}
                  className={`px-3.5 min-h-[44px] py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
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

          {/* Responsive Customer Theme Product Grid */}
          <div className="grid grid-cols-1 min-[481px]:grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-4 min-[1441px]:grid-cols-5 gap-4 sm:gap-5 mb-8">
            {themeProducts.map((product) => {
              const buyUrl = getAffiliateBuyUrl(product);
              const isAlibaba = product.originStore === 'Alibaba';
              const hasPrice =
                product.nativePrice !== undefined ? product.nativePrice > 0 : product.price > 0;

              return (
                <article
                  key={product.id}
                  className="responsive-card h-full bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setModalProduct(product)}
                    aria-label={`View details for ${product.title}`}
                    className="relative w-full aspect-[4/3] bg-white p-2 sm:p-3 overflow-hidden cursor-pointer flex items-center justify-center border-b border-slate-100 dark:border-slate-800"
                  >
                    <ResilientImage
                      src={product.mainImage}
                      alt={product.title}
                      className="responsive-card-media max-w-full max-h-full w-auto h-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 truncate">
                        <span className={`font-bold ${getStoreColorText(product.originStore)}`}>
                          {product.originStore}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.csvCategory || product.category}</span>
                      </div>

                      <h3
                        onClick={() => setModalProduct(product)}
                        className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 cursor-pointer hover:text-amber-700 dark:hover:text-amber-400 transition-colors mb-1.5"
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
                            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                              {formatPrice(product.price, product.nativePrice, product.nativeCurrency)}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Listed Price
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            See Price on Partner
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
                          rel="nofollow sponsored noopener noreferrer"
                          onClick={() =>
                            recordAffiliateClick(product.id, product.originStore, product.category)
                          }
                          className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${getStoreButtonClass(
                            product.originStore
                          )}`}
                        >
                          <span>
                            {isAlibaba
                              ? 'Open Alibaba'
                              : product.urlKind === 'portal'
                              ? `Open ${product.originStore}`
                              : `View on ${product.originStore}`}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setModalProduct(product)}
                          title="Inspect specifications"
                          aria-label={`Inspect ${product.title}`}
                          className="min-h-[44px] min-w-[44px] p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveToCart(product)}
                          title={savedIds.has(product.id) ? 'Saved in list' : 'Save to list'}
                          aria-label={`Save ${product.title}`}
                          className={`min-h-[44px] min-w-[44px] p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                            savedIds.has(product.id)
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                          }`}
                        >
                          {savedIds.has(product.id) ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
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
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={() => recordAffiliateClick(`theme-sponsor-${sp.id}`)}
                  className="responsive-card group bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-amber-700 dark:text-amber-400">Sponsored</span>
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
                  <span className="px-3 min-h-[44px] py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-amber-400 group-hover:border-amber-400 text-slate-900 dark:text-slate-100 group-hover:text-slate-950 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-colors">
                    <span>{sp.ctaLabel}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* PART 2: Categorized Affiliate Sites by Partner Store */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Partner Storefront Directory · {regionProfile.label} Order</span>
              </div>
              <h3 className="text-[clamp(1.25rem,2.4vw,1.5rem)] font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
                All Partner Sites Categorized by Product Lines
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Prioritized for {regionProfile.label}: filter a category below or open the external partner store directly.
            </p>
          </div>

          <div className="grid grid-cols-1 min-[481px]:grid-cols-2 lg:grid-cols-3 gap-5">
            {regionProfile.storePriority.map((storeName) => {
              if (storeName === 'Amazon') {
                return (
                  <div
                    key="dir-amazon"
                    className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Amazon
                          </h4>
                          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                            Tech, Workspace &amp; Creator Gear
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
                              className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
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
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-amazon-store', 'Amazon')}
                        className="flex-1 min-h-[44px] px-3 py-2 bg-[#FF9900] hover:bg-[#e88b00] text-slate-950 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Amazon Store</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <a
                        href={amazonShortUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-amazon-deals', 'Amazon')}
                        className="min-h-[44px] px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-lg inline-flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                      >
                        <span>Shortlink</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              }

              if (storeName === 'Shopz BD') {
                return (
                  <div
                    key="dir-shopz"
                    className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Shopz BD
                          </h4>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            Electronics, Watches, Audio &amp; Accessories
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
                              className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
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
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-shopz-store', 'Shopz BD')}
                        className="w-full min-h-[44px] px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Visit Shopz.com.bd</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              }

              if (storeName === 'Releva BD') {
                return (
                  <div
                    key="dir-releva"
                    className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Releva BD
                          </h4>
                          <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                            Featured Bangladesh Partner Store
                          </p>
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {affiliateDirectory.relevaTotal} items
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {affiliateDirectory.relevaCategories.map((cat) => (
                          <li key={cat.label}>
                            <button
                              type="button"
                              onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                              className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                            >
                              <span className="truncate">{cat.label}</span>
                              <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                                {cat.count}
                              </span>
                            </button>
                          </li>
                        ))}
                        <li className="px-2.5 py-2 space-y-2">
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Quick Releva BD Product Links ({affiliateDirectory.relevaTotal} total in catalog):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[129, 130, 131, 133, 134, 135, 106, 107, 108, 128].map((pid) => (
                              <a
                                key={pid}
                                href={buildRelevaProductUrl(pid)}
                                target="_blank"
                                rel="nofollow sponsored noopener noreferrer"
                                onClick={() => recordAffiliateClick(`dir-releva-${pid}`, 'Releva BD')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-slate-200 dark:border-slate-700 hover:border-teal-400 text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                              >
                                <span>#{pid}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-teal-600 dark:text-teal-400" />
                              </a>
                            ))}
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <a
                        href={relevaStoreUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-releva-store', 'Releva BD')}
                        className="w-full min-h-[44px] px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Visit Releva BD</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              }

              if (storeName === 'Alibaba') {
                return (
                  <div
                    key="dir-alibaba"
                    className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Alibaba.com Offer Portal
                          </h4>
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                            Sourcing &amp; Offer Portal
                          </p>
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {affiliateDirectory.alibabaTotal} portals
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {affiliateDirectory.alibabaCategories.map((cat) => (
                          <li key={cat.label}>
                            <button
                              type="button"
                              onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                              className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
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
                        href={alibabaStoreUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-alibaba-store', 'Alibaba')}
                        className="w-full min-h-[44px] px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Open Alibaba Portal</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              }

              if (storeName === 'BanglaShoppers') {
                return (
                  <div
                    key="dir-banglashoppers"
                    className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            BanglaShoppers
                          </h4>
                          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                            K-Beauty, Serums &amp; Authentic Skincare
                          </p>
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {affiliateDirectory.banglaShoppersTotal} items
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {affiliateDirectory.banglaShoppersCategories.map((cat) => (
                          <li key={cat.label}>
                            <button
                              type="button"
                              onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                              className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                            >
                              <span className="truncate">{cat.label}</span>
                              <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                                {cat.count}
                              </span>
                            </button>
                          </li>
                        ))}
                        <li className="px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Some By Mi, COSRX, Missha, Neutrogena &amp; The Body Shop authentic skincare shipped nationwide.
                        </li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <a
                        href={banglashoppersStoreUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-banglashoppers-store', 'BanglaShoppers')}
                        className="w-full min-h-[44px] px-3 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Visit BanglaShoppers</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              }

              if (storeName === 'Illin BD') {
                return (
                  <div
                    key="dir-illin"
                    className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Illin BD
                          </h4>
                          <p className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">
                            Home Appliances, Coffee Makers &amp; Gadgets
                          </p>
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {affiliateDirectory.illinTotal} items
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {affiliateDirectory.illinCategories.map((cat) => (
                          <li key={cat.label}>
                            <button
                              type="button"
                              onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                              className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                            >
                              <span className="truncate">{cat.label}</span>
                              <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                                {cat.count}
                              </span>
                            </button>
                          </li>
                        ))}
                        <li className="px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          POEDAGAR quartz watches, 3-in-1 mist &amp; folding fans, cotton bedsheets, SP-6 toothpaste, Jennie Moon soap &amp; Miyako appliances.
                        </li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <a
                        href={illinStoreUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-illin-store', 'Illin BD')}
                        className="w-full min-h-[44px] px-3 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Visit Illin BD</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              }

              if (storeName === 'Star Tech') {
                return (
                  <div
                    key="dir-startech"
                    className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Star Tech BD
                          </h4>
                          <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
                            Laptops, PCs, Drones &amp; Smartwatches
                          </p>
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {affiliateDirectory.startechTotal} items
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {affiliateDirectory.startechCategories.map((cat) => (
                          <li key={cat.label}>
                            <button
                              type="button"
                              onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                              className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                            >
                              <span className="truncate">{cat.label}</span>
                              <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                                {cat.count}
                              </span>
                            </button>
                          </li>
                        ))}
                        <li className="px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Ryzen &amp; Core desktop PCs, DJI drones, Anker SOLIX power stations, Lenovo/MSI gear, audio earbuds, air fryers &amp; smartwatches.
                        </li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <a
                        href={startechStoreUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-startech-store', 'Star Tech')}
                        className="w-full min-h-[44px] px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Visit Star Tech BD</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              }

              if (storeName === 'Sohoj Affiliates') {
                return (
                  <div
                    key="dir-sohoj"
                    className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            Sohoj Affiliates
                          </h4>
                          <p className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">
                            BD Reseller &amp; Affiliate Hub
                          </p>
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {affiliateDirectory.sohojTotal} portals
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {affiliateDirectory.sohojCategories.map((cat) => (
                          <li key={cat.label}>
                            <button
                              type="button"
                              onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                              className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                            >
                              <span className="truncate">{cat.label}</span>
                              <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                                {cat.count}
                              </span>
                            </button>
                          </li>
                        ))}
                        <li className="px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Access 3,930+ Illin BD products, 100 Tk onboarding credit &amp; bKash/Nagad/Rocket payouts.
                        </li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <a
                        href={sohojStoreUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => recordAffiliateClick('dir-sohoj-store', 'Sohoj Affiliates')}
                        className="w-full min-h-[44px] px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Open Sohoj Affiliates</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key="dir-exonhost"
                  className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          ExonHost Partner
                        </h4>
                        <p className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                          Web Hosting, WordPress &amp; Domains
                        </p>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        {affiliateDirectory.exonhostTotal} portals
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {affiliateDirectory.exonhostCategories.map((cat) => (
                        <li key={cat.label}>
                          <button
                            type="button"
                            onClick={() => jumpToFilteredStore(cat.store, cat.category)}
                            className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
                          >
                            <span className="truncate">{cat.label}</span>
                            <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                              {cat.count}
                            </span>
                          </button>
                        </li>
                      ))}
                      <li className="px-2.5 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Browse live hosting plans, SSL options, and domain availability on the ExonHost partner portal.
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                    <a
                      href={exonhostStoreUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      onClick={() => recordAffiliateClick('dir-exonhost-store', 'ExonHost')}
                      className="w-full min-h-[44px] px-3 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <span>Open ExonHost Portal</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Sponsored Partners Card */}
            <div className="bg-slate-50/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Sponsored Links
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      External Partner Promotions
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {affiliateDirectory.sponsorsTotal} links
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {affiliateDirectory.sponsorGroups.map((grp) => (
                    <li key={grp.label}>
                      <button
                        type="button"
                        onClick={jumpToSponsors}
                        className="w-full flex items-center justify-between gap-2 px-2.5 min-h-[44px] py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-left"
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
                  className="w-full min-h-[44px] px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
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
