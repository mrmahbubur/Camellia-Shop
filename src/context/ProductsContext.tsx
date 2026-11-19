import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  EcomProduct,
  ProductCategory,
  UNIFIED_PRODUCTS,
  AMAZON_ASSOCIATE_TAG,
  AMAZON_LINK_ID,
  AMAZON_LINK_SHORT,
  AMAZON_STORE_URL,
  SHOPZ_REF_BASE,
  EXONHOST_AFFILIATE_URL,
  ALIBABA_AFFILIATE_URL,
  BANGLASHOPPERS_AFFILIATE_URL,
  ILLIN_AFFILIATE_URL,
  SOHOJ_AFFILIATE_URL,
  RELEVA_TRACKING_PARAM
} from '../data/unifiedProductsData';
import { DEFAULT_SPONSORS, SponsorPlacement } from '../data/sponsorsData';
import {
  parseAffiliateCsv,
  UPLOADED_AFFILIATE_CSV_PATH,
  UPLOADED_AFFILIATE_CSV_FETCH_PATHS
} from '../utils/affiliateCsv';
import {
  REGION_PROFILES,
  RegionProfile,
  VisitorRegionCode,
  PartnerStoreOrigin,
  detectBrowserRegionFallback,
  getStorePriorityRank
} from '../utils/regionProfile';
import {
  computeRecommendations,
  type BuyingNeed,
  type InteractionSignals,
  type RecommendedItem
} from '../utils/recommendations';
import { isStaticHostedWithoutApi, resolveApiUrl } from '../utils/apiClient';
import { useCart } from './CartContext';

export interface StorefrontCopyConfig {
  siteName: string;
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  storeTitle: string;
  storeSubtitle: string;
}

interface StorefrontResponse extends Partial<StorefrontCopyConfig> {
  hiddenProductIds?: string[];
  featuredProductIds?: string[];
  priceOverrides?: Record<string, { price?: number; originalPrice?: number; badge?: string }>;
  customProducts?: EcomProduct[];
  sponsors?: Array<Omit<SponsorPlacement, 'image'> & { image?: string }>;
}

const DEFAULT_STOREFRONT_COPY: StorefrontCopyConfig = {
  siteName: 'Camellia Shop',
  announcementText:
    'Camellia Shop · Curated Tech, Skincare, Appliances, Watches & Cloud Hosting',
  heroTitle: 'Curated Workspace Tech, Skincare, Appliances & Partner Stores.',
  heroSubtitle:
    'Shop workspace electronics, skincare, home appliances, watches, and cloud hosting across Amazon, Shopz BD, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, Alibaba, and ExonHost.',
  storeTitle: 'Shop Workspace Gear, Skincare, Home Tech & Hosting',
  storeSubtitle:
    'Explore electronics, authentic skincare, home appliances, and hosting across Amazon, Shopz BD, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, Alibaba, and ExonHost.'
};

export type StoreFilterOption = 'all' | PartnerStoreOrigin;

const EMPTY_INTERACTIONS: InteractionSignals = {
  categoryCounts: {},
  storeCounts: {},
  recentProductIds: []
};

function getOrCreateAnonymousSessionId(): string {
  try {
    const existing = localStorage.getItem('mrs_anon_session');
    if (existing && /^[a-zA-Z0-9_-]{8,64}$/.test(existing)) return existing;
    const rand = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const created = `cam_${rand.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24)}`;
    localStorage.setItem('mrs_anon_session', created);
    return created;
  } catch {
    return 'cam_ephemeral_session';
  }
}

interface ProductsContextType {
  products: EcomProduct[];
  csvProductsCount: number;
  linkedShopCount: number;
  uploadedCsvPath: string;
  sponsors: SponsorPlacement[];
  storefrontCopy: StorefrontCopyConfig;
  selectedCategory: ProductCategory | string;
  setSelectedCategory: (cat: string) => void;
  selectedStoreFilter: StoreFilterOption;
  setSelectedStoreFilter: (store: StoreFilterOption) => void;
  visitorRegion: VisitorRegionCode;
  setVisitorRegion: (region: VisitorRegionCode) => void;
  regionDetectionSource: string;
  regionProfile: RegionProfile;
  highlightedProductId: string | null;
  setHighlightedProductId: (id: string | null) => void;
  // Buying Guide & Recommendations
  buyingNeed: BuyingNeed;
  setBuyingNeed: (need: BuyingNeed) => void;
  buyingBudgetUsd: number | null;
  setBuyingBudgetUsd: (budget: number | null) => void;
  buyingPreferredStore: PartnerStoreOrigin | 'all';
  setBuyingPreferredStore: (store: PartnerStoreOrigin | 'all') => void;
  recommendations: RecommendedItem<EcomProduct>[];
  // Privacy & Anonymized Interaction Controls
  personalizationEnabled: boolean;
  setPersonalizationEnabled: (enabled: boolean) => void;
  interactions: InteractionSignals;
  trackInteraction: (params: {
    eventType: 'view_category' | 'view_store' | 'save_item' | 'outbound_click' | 'buying_guide';
    category?: string;
    store?: PartnerStoreOrigin;
    productId?: string;
  }) => void;
  resetPersonalization: () => Promise<void>;
  // Affiliate links & helpers
  getAffiliateBuyUrl: (product: EcomProduct) => string;
  getAmazonSearchAffiliateUrl: (query: string) => string;
  getShopzSearchAffiliateUrl: (query: string) => string;
  amazonShortUrl: string;
  amazonStoreUrl: string;
  shopzStoreUrl: string;
  exonhostStoreUrl: string;
  alibabaStoreUrl: string;
  banglashoppersStoreUrl: string;
  illinStoreUrl: string;
  sohojStoreUrl: string;
  affiliateTag: string;
  recordAffiliateClick: (productId?: string, store?: PartnerStoreOrigin, category?: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setCurrency, exchangeRates, showNotification } = useCart();
  const [selectedCategory, setSelectedCategoryState] = useState<string>('All Departments (Mega Store)');
  const [selectedStoreFilter, setSelectedStoreFilterState] = useState<StoreFilterOption>('all');
  const [regionDetectionSource, setRegionDetectionSource] = useState<string>('browser');
  const [visitorRegion, setVisitorRegionState] = useState<VisitorRegionCode>(() => {
    try {
      const saved = localStorage.getItem('mrs_region') as VisitorRegionCode | null;
      if (saved && REGION_PROFILES[saved]) return saved;
    } catch {
      // Storage unavailable
    }
    return detectBrowserRegionFallback();
  });
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [storefrontData, setStorefrontData] = useState<StorefrontResponse | null>(null);
  const [csvProducts, setCsvProducts] = useState<EcomProduct[]>([]);

  // Buying Guide state
  const [buyingNeed, setBuyingNeedState] = useState<BuyingNeed>('balanced');
  const [buyingBudgetUsd, setBuyingBudgetUsd] = useState<number | null>(null);
  const [buyingPreferredStore, setBuyingPreferredStore] = useState<PartnerStoreOrigin | 'all'>('all');

  // Privacy & consent state
  const [personalizationEnabled, setPersonalizationEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mrs_personalization_consent');
      if (saved === 'false') return false;
    } catch {
      // Storage unavailable
    }
    return true;
  });

  const [interactions, setInteractions] = useState<InteractionSignals>(() => {
    try {
      const saved = localStorage.getItem('mrs_interactions');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<InteractionSignals>;
        return {
          categoryCounts: parsed.categoryCounts || {},
          storeCounts: parsed.storeCounts || {},
          recentProductIds: Array.isArray(parsed.recentProductIds) ? parsed.recentProductIds : []
        };
      }
    } catch {
      // Ignore parse failures
    }
    return EMPTY_INTERACTIONS;
  });

  const regionProfile = REGION_PROFILES[visitorRegion] || REGION_PROFILES.GLOBAL;

  const setVisitorRegion = (region: VisitorRegionCode) => {
    setVisitorRegionState(region);
    setRegionDetectionSource('manual');
    const nextProfile = REGION_PROFILES[region];
    if (nextProfile) {
      setCurrency(nextProfile.defaultCurrency);
    }
    try {
      localStorage.setItem('mrs_region', region);
    } catch {
      // Storage unavailable
    }
  };

  const trackInteraction = useCallback(
    (params: {
      eventType: 'view_category' | 'view_store' | 'save_item' | 'outbound_click' | 'buying_guide';
      category?: string;
      store?: PartnerStoreOrigin;
      productId?: string;
    }) => {
      if (!personalizationEnabled) return;

      setInteractions((prev) => {
        const next: InteractionSignals = {
          categoryCounts: { ...prev.categoryCounts },
          storeCounts: { ...prev.storeCounts },
          recentProductIds: [...prev.recentProductIds]
        };

        if (params.category && params.category !== 'All Departments (Mega Store)') {
          next.categoryCounts[params.category] = (next.categoryCounts[params.category] || 0) + 1;
        }
        if (params.store) {
          next.storeCounts[params.store] = (next.storeCounts[params.store] || 0) + 1;
        }
        if (params.productId) {
          next.recentProductIds = [
            params.productId,
            ...next.recentProductIds.filter((id) => id !== params.productId)
          ].slice(0, 20);
        }

        try {
          localStorage.setItem('mrs_interactions', JSON.stringify(next));
        } catch {
          // Storage unavailable
        }
        return next;
      });

      if (!isStaticHostedWithoutApi()) {
        const sessionId = getOrCreateAnonymousSessionId();
        fetch(resolveApiUrl('/api/events'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            eventType: params.eventType,
            category: params.category,
            store: params.store,
            productId: params.productId
          })
        }).catch(() => {
          // Non-blocking anonymous telemetry
        });
      }
    },
    [personalizationEnabled]
  );

  const setPersonalizationEnabled = (enabled: boolean) => {
    setPersonalizationEnabledState(enabled);
    try {
      localStorage.setItem('mrs_personalization_consent', enabled ? 'true' : 'false');
    } catch {
      // Storage unavailable
    }
    showNotification(
      enabled ? 'Anonymous personalization enabled' : 'Anonymous personalization paused'
    );
  };

  const resetPersonalization = async () => {
    setInteractions(EMPTY_INTERACTIONS);
    setBuyingNeedState('balanced');
    setBuyingBudgetUsd(null);
    setBuyingPreferredStore('all');
    try {
      localStorage.removeItem('mrs_interactions');
    } catch {
      // Storage unavailable
    }

    if (!isStaticHostedWithoutApi()) {
      try {
        const sessionId = localStorage.getItem('mrs_anon_session') || '';
        if (sessionId) {
          await fetch(
            resolveApiUrl(`/api/profile?sessionId=${encodeURIComponent(sessionId)}`),
            { method: 'DELETE' }
          );
        }
      } catch {
        // Non-blocking server reset
      }
    }

    showNotification('Personalization profile cleared (saved items unchanged)');
  };

  const setSelectedCategory = (cat: string) => {
    setSelectedCategoryState(cat);
    if (cat && cat !== 'All Departments (Mega Store)') {
      trackInteraction({ eventType: 'view_category', category: cat });
    }
  };

  const setSelectedStoreFilter = (store: StoreFilterOption) => {
    setSelectedStoreFilterState(store);
    if (store !== 'all') {
      trackInteraction({ eventType: 'view_store', store });
    }
  };

  const setBuyingNeed = (need: BuyingNeed) => {
    setBuyingNeedState(need);
    if (need !== 'balanced') {
      trackInteraction({ eventType: 'buying_guide' });
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadUploadedCsv = async () => {
      for (const candidatePath of UPLOADED_AFFILIATE_CSV_FETCH_PATHS) {
        try {
          const res = await fetch(candidatePath);
          if (!res.ok) continue;
          const text = await res.text();
          if (!text || !text.toLowerCase().includes('http')) continue;
          const parsed = parseAffiliateCsv(text);
          if (!cancelled && parsed.length > 0) {
            setCsvProducts(parsed);
            return;
          }
        } catch {
          // Try next relative/absolute asset path
        }
      }
    };

    loadUploadedCsv();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const hasManualRegion = (() => {
      try {
        const saved = localStorage.getItem('mrs_region') as VisitorRegionCode | null;
        return Boolean(saved && REGION_PROFILES[saved]);
      } catch {
        return false;
      }
    })();

    const hasManualCurrency = (() => {
      try {
        return Boolean(localStorage.getItem('mrs_currency'));
      } catch {
        return false;
      }
    })();

    const applyDetectedRegion = (code: VisitorRegionCode, sourceLabel: string) => {
      setVisitorRegionState(code);
      setRegionDetectionSource(sourceLabel);
      if (!hasManualCurrency) {
        setCurrency(REGION_PROFILES[code].defaultCurrency);
      }
    };

    if (hasManualRegion) {
      setRegionDetectionSource('manual');
    }

    if (isStaticHostedWithoutApi()) {
      if (!hasManualRegion) {
        applyDetectedRegion(detectBrowserRegionFallback(), 'browser-locale');
      } else if (!hasManualCurrency) {
        setCurrency(REGION_PROFILES[visitorRegion].defaultCurrency);
      }
      return;
    }

    fetch(resolveApiUrl('/api/region'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { regionCode?: VisitorRegionCode; source?: string } | null) => {
        if (!hasManualRegion && data?.regionCode && REGION_PROFILES[data.regionCode]) {
          const resolved =
            data.source === 'network' || data.source === 'geoip' || data.source === 'locale'
              ? data.regionCode
              : detectBrowserRegionFallback();
          applyDetectedRegion(resolved, data.source || 'network');
        } else if (!hasManualCurrency) {
          setCurrency(REGION_PROFILES[visitorRegion].defaultCurrency);
        }
      })
      .catch(() => {
        if (!hasManualRegion) {
          applyDetectedRegion(detectBrowserRegionFallback(), 'browser-locale');
        } else if (!hasManualCurrency) {
          setCurrency(REGION_PROFILES[visitorRegion].defaultCurrency);
        }
      });

    fetch(resolveApiUrl('/api/storefront'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StorefrontResponse | null) => {
        if (data && typeof data === 'object') {
          setStorefrontData(data);
        }
      })
      .catch(() => {
        // Keep static defaults
      });
  }, []);

  const storefrontCopy = useMemo<StorefrontCopyConfig>(
    () => ({
      siteName: storefrontData?.siteName || DEFAULT_STOREFRONT_COPY.siteName,
      announcementText: storefrontData?.announcementText || DEFAULT_STOREFRONT_COPY.announcementText,
      heroTitle: storefrontData?.heroTitle || DEFAULT_STOREFRONT_COPY.heroTitle,
      heroSubtitle: storefrontData?.heroSubtitle || DEFAULT_STOREFRONT_COPY.heroSubtitle,
      storeTitle: storefrontData?.storeTitle || DEFAULT_STOREFRONT_COPY.storeTitle,
      storeSubtitle: storefrontData?.storeSubtitle || DEFAULT_STOREFRONT_COPY.storeSubtitle
    }),
    [storefrontData]
  );

  const products = useMemo<EcomProduct[]>(() => {
    const customList = Array.isArray(storefrontData?.customProducts) ? storefrontData.customProducts : [];
    const customMap = new Map(customList.map((p) => [p.id, p]));

    const baseCatalog: EcomProduct[] = UNIFIED_PRODUCTS.map((p) => ({
      ...p,
      sourceType: p.sourceType || 'linked-shop'
    }));

    const existingLinks = new Set(baseCatalog.map((p) => p.affiliateUrl.toLowerCase()));
    const dedupedCsv = csvProducts.filter((p) => !existingLinks.has(p.affiliateUrl.toLowerCase()));

    const allKnown = [...baseCatalog, ...dedupedCsv];
    const knownIds = new Set(allKnown.map((p) => p.id));

    const mergedBase = allKnown.map((p) => customMap.get(p.id) || p);
    const extraCustom = customList
      .filter((p) => !knownIds.has(p.id))
      .map((p) => ({ ...p, sourceType: p.sourceType || ('linked-shop' as const) }));

    const hiddenSet = new Set(Array.isArray(storefrontData?.hiddenProductIds) ? storefrontData.hiddenProductIds : []);
    const overrides = storefrontData?.priceOverrides || {};

    const combined = [...extraCustom, ...mergedBase]
      .filter((p) => !hiddenSet.has(p.id) && !p.affiliateUrl.toLowerCase().includes('fabrilife.com'))
      .map((p) => {
        const ov = overrides[p.id];
        if (!ov) return p;
        return {
          ...p,
          price: typeof ov.price === 'number' ? ov.price : p.price,
          originalPrice: typeof ov.originalPrice === 'number' ? ov.originalPrice : p.originalPrice,
          badge: typeof ov.badge === 'string' && ov.badge.trim() ? ov.badge : p.badge
        };
      });

    const featured = Array.isArray(storefrontData?.featuredProductIds) ? storefrontData.featuredProductIds : [];
    const rank = new Map(featured.map((id, idx) => [id, idx]));

    return [...combined].sort((a, b) => {
      const ra = rank.has(a.id) ? (rank.get(a.id) as number) : Number.MAX_SAFE_INTEGER;
      const rb = rank.has(b.id) ? (rank.get(b.id) as number) : Number.MAX_SAFE_INTEGER;
      if (ra !== rb) return ra - rb;

      const storeRankA = getStorePriorityRank(a.originStore, visitorRegion);
      const storeRankB = getStorePriorityRank(b.originStore, visitorRegion);
      return storeRankA - storeRankB;
    });
  }, [storefrontData, csvProducts, visitorRegion]);

  const recommendations = useMemo<RecommendedItem<EcomProduct>[]>(() => {
    return computeRecommendations({
      catalog: products,
      region: visitorRegion,
      buyingGuide: {
        need: buyingNeed,
        budgetUsd: buyingBudgetUsd,
        preferredStore: buyingPreferredStore
      },
      interactions: personalizationEnabled ? interactions : EMPTY_INTERACTIONS,
      rates: exchangeRates,
      limit: 6
    });
  }, [
    products,
    visitorRegion,
    buyingNeed,
    buyingBudgetUsd,
    buyingPreferredStore,
    personalizationEnabled,
    interactions,
    exchangeRates
  ]);

  const csvProductsCount = useMemo(
    () => products.filter((p) => p.sourceType === 'uploaded-csv').length,
    [products]
  );

  const linkedShopCount = useMemo(
    () => products.filter((p) => p.sourceType !== 'uploaded-csv').length,
    [products]
  );

  const sponsors = useMemo<SponsorPlacement[]>(() => {
    const incoming = Array.isArray(storefrontData?.sponsors) ? storefrontData.sponsors : null;
    const defaultById = new Map(DEFAULT_SPONSORS.map((s) => [s.id, s]));
    const fallbackImg = DEFAULT_SPONSORS[0].image;
    const baseList: SponsorPlacement[] =
      incoming && incoming.length > 0
        ? incoming
            .filter((s) => s && typeof s.url === 'string' && s.url.startsWith('https://'))
            .map((s) => ({
              ...s,
              disclosure: s.disclosure || 'Sponsored external partner redirect',
              image: s.image || defaultById.get(s.id)?.image || fallbackImg
            }))
        : DEFAULT_SPONSORS;

    return baseList;
  }, [storefrontData]);

  const recordAffiliateClick = (
    productId?: string,
    store?: PartnerStoreOrigin,
    category?: string
  ) => {
    if (productId || store || category) {
      trackInteraction({
        eventType: 'outbound_click',
        productId,
        store,
        category
      });
    }
    if (isStaticHostedWithoutApi()) return;

    fetch(resolveApiUrl('/api/clicks'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId: productId || 'outbound' })
    }).catch(() => {
      // Non-blocking
    });
  };

  useEffect(() => {
    if (highlightedProductId) {
      const timer = setTimeout(() => {
        setHighlightedProductId(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [highlightedProductId]);

  const applyPartnerTracking = (
    rawUrl: string,
    originStore: PartnerStoreOrigin,
    asin?: string
  ): string => {
    const trimmed = rawUrl.trim();
    if (!trimmed || trimmed.toLowerCase().includes('fabrilife.com')) {
      if (originStore === 'ExonHost') return EXONHOST_AFFILIATE_URL;
      if (originStore === 'Alibaba') return ALIBABA_AFFILIATE_URL;
      if (originStore === 'BanglaShoppers') return BANGLASHOPPERS_AFFILIATE_URL;
      if (originStore === 'Illin BD') return ILLIN_AFFILIATE_URL;
      if (originStore === 'Sohoj Affiliates') return SOHOJ_AFFILIATE_URL;
      if (originStore === 'Releva BD') {
        return `https://releva.com.bd/index.php?route=product/product&product_id=130&tracking=${RELEVA_TRACKING_PARAM}`;
      }
      if (originStore === 'Shopz BD') return SHOPZ_REF_BASE;
      if (asin) {
        return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll2&linkId=${AMAZON_LINK_ID}`;
      }
      return AMAZON_STORE_URL;
    }

    if (originStore === 'BanglaShoppers' || trimmed.includes('banglashoppers.com')) {
      return trimmed.includes('/r/4ehxtB1p') ? trimmed : BANGLASHOPPERS_AFFILIATE_URL;
    }
    if (originStore === 'Illin BD' || trimmed.includes('illin.com.bd')) {
      return trimmed.includes('/40989') ? trimmed : ILLIN_AFFILIATE_URL;
    }
    if (originStore === 'Sohoj Affiliates' || trimmed.includes('sohojaffiliates.com')) {
      return trimmed.includes('/reffer/40989') ? trimmed : SOHOJ_AFFILIATE_URL;
    }
    if (originStore === 'Alibaba' || trimmed.includes('pm1aev55clcb5002cfdd219aa26f6f')) {
      return trimmed.includes('rzekl.com/') ? trimmed : ALIBABA_AFFILIATE_URL;
    }
    if (originStore === 'Releva BD' || trimmed.includes('releva.com.bd')) {
      if (trimmed.includes('tracking=')) return trimmed;
      const sep = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${sep}tracking=${RELEVA_TRACKING_PARAM}`;
    }
    if (originStore === 'ExonHost' || trimmed.includes('exonhost.com')) {
      return trimmed.includes('aff=') ? trimmed : EXONHOST_AFFILIATE_URL;
    }
    if (originStore === 'Shopz BD' || trimmed.includes('shopz.com.bd')) {
      if (trimmed.includes('ref=')) return trimmed;
      const sep = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${sep}ref=mahbubur-rahman-shahin`;
    }
    if (trimmed.includes('link.amazon/B0io1BQfg') || trimmed.includes('amzn.to')) {
      return trimmed;
    }
    if (trimmed.includes('link.amazon')) {
      return AMAZON_LINK_SHORT;
    }
    if (trimmed.includes('amazon.com')) {
      try {
        const url = new URL(trimmed);
        url.searchParams.set('tag', AMAZON_ASSOCIATE_TAG);
        url.searchParams.set('linkCode', 'll2');
        url.searchParams.set('linkId', AMAZON_LINK_ID);
        return url.toString();
      } catch {
        const sep = trimmed.includes('?') ? '&' : '?';
        return `${trimmed}${sep}tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll2&linkId=${AMAZON_LINK_ID}`;
      }
    }

    return trimmed;
  };

  const getAffiliateBuyUrl = (product: EcomProduct): string => {
    if (product.affiliateUrl) {
      return applyPartnerTracking(product.affiliateUrl, product.originStore, product.asin);
    }

    if (product.asin) {
      return `https://www.amazon.com/dp/${product.asin}?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll2&linkId=${AMAZON_LINK_ID}`;
    }

    if (product.originStore === 'Amazon') {
      return AMAZON_STORE_URL;
    }

    return `https://www.amazon.com/s?k=${encodeURIComponent(product.title)}&tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll2&linkId=${AMAZON_LINK_ID}`;
  };

  const getAmazonSearchAffiliateUrl = (query: string): string => {
    const clean = query.trim();
    if (!clean) return AMAZON_STORE_URL;
    return `https://www.amazon.com/s?k=${encodeURIComponent(clean)}&tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll2&linkId=${AMAZON_LINK_ID}`;
  };

  const getShopzSearchAffiliateUrl = (query: string): string => {
    const clean = query.trim() || 'gadgets';
    return `https://www.shopz.com.bd/?s=${encodeURIComponent(clean)}&post_type=product&ref=mahbubur-rahman-shahin`;
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        csvProductsCount,
        linkedShopCount,
        uploadedCsvPath: UPLOADED_AFFILIATE_CSV_PATH,
        sponsors,
        storefrontCopy,
        selectedCategory,
        setSelectedCategory,
        selectedStoreFilter,
        setSelectedStoreFilter,
        visitorRegion,
        setVisitorRegion,
        regionDetectionSource,
        regionProfile,
        highlightedProductId,
        setHighlightedProductId,
        buyingNeed,
        setBuyingNeed,
        buyingBudgetUsd,
        setBuyingBudgetUsd,
        buyingPreferredStore,
        setBuyingPreferredStore,
        recommendations,
        personalizationEnabled,
        setPersonalizationEnabled,
        interactions,
        trackInteraction,
        resetPersonalization,
        getAffiliateBuyUrl,
        getAmazonSearchAffiliateUrl,
        getShopzSearchAffiliateUrl,
        amazonShortUrl: AMAZON_LINK_SHORT,
        amazonStoreUrl: AMAZON_STORE_URL,
        shopzStoreUrl: SHOPZ_REF_BASE,
        exonhostStoreUrl: EXONHOST_AFFILIATE_URL,
        alibabaStoreUrl: ALIBABA_AFFILIATE_URL,
        banglashoppersStoreUrl: BANGLASHOPPERS_AFFILIATE_URL,
        illinStoreUrl: ILLIN_AFFILIATE_URL,
        sohojStoreUrl: SOHOJ_AFFILIATE_URL,
        affiliateTag: AMAZON_ASSOCIATE_TAG,
        recordAffiliateClick
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
