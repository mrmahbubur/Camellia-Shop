import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  EcomProduct,
  ProductCategory,
  UNIFIED_PRODUCTS,
  SHOPZ_REF_BASE,
  EXONHOST_AFFILIATE_URL,
  BANGLASHOPPERS_AFFILIATE_URL,
  ILLIN_AFFILIATE_URL,
  SOHOJ_AFFILIATE_URL,
  STARTECH_AFFILIATE_URL,
  RELEVA_HOME_URL
} from '../data/unifiedProductsData';
import {
  buildAmazonSearchUrl,
  buildRelevaSearchUrl,
  buildShopzSearchUrl,
  resolvePartnerProductUrl,
  resolveStorefrontAffiliateConfig
} from '../utils/affiliateConfig';
import { DEFAULT_SPONSORS, SponsorPlacement } from '../data/sponsorsData';
import {
  parseAffiliateCsv,
  UPLOADED_AFFILIATE_CSV_PATH,
  UPLOADED_AFFILIATE_CSV_FETCH_PATHS
} from '../utils/affiliateCsv';
import {
  DEFAULT_ALIEXPRESS_EVENT_PROMOS,
  EVENT_PROMOTION_CSV_FETCH_PATHS,
  parseEventPromotionCsv,
  type EventPromoCreative
} from '../utils/eventPromotionsCsv';
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
import {
  isStaticHostedWithoutApi,
  resolveActiveTenantId,
  resolveApiUrl,
  resolveTenantApiUrl,
  resolveTenantFetchInit
} from '../utils/apiClient';
import {
  DEFAULT_SEO_DESCRIPTION,
  applyDynamicSeoMetadata,
  readSearchQueryFromLocation,
  syncUrlSearchParam
} from '../utils/seoSchema';
import { useCart } from './CartContext';

export interface StorefrontCopyConfig {
  siteName: string;
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  storeTitle: string;
  storeSubtitle: string;
  checkoutNotice: string;
  seoDescription: string;
}

interface StorefrontResponse extends Partial<StorefrontCopyConfig> {
  tenantId?: string;
  hiddenProductIds?: string[];
  featuredProductIds?: string[];
  priceOverrides?: Record<string, { price?: number; originalPrice?: number; badge?: string }>;
  customProducts?: EcomProduct[];
  sponsors?: Array<Omit<SponsorPlacement, 'image'> & { image?: string }>;
  affiliateConfig?: {
    aliexpress?: {
      name?: string;
      enabled?: boolean;
      portalUrl?: string;
      eventUrl?: string;
      squareEventUrl?: string;
      categories?: {
        jewelry?: string;
        beauty?: string;
        toys?: string;
        womensClothing?: string;
      };
    };
    amazon?: {
      associateTag?: string;
      linkId?: string;
      storeUrl?: string;
      shortUrl?: string;
    };
  };
  partnerStores?: {
    aliexpress?: {
      name?: string;
      enabled?: boolean;
      portalUrl?: string;
      eventUrl?: string;
      squareEventUrl?: string;
    };
  };
}

const DEFAULT_STOREFRONT_COPY: StorefrontCopyConfig = {
  siteName: 'Camellia Shop',
  announcementText:
    'Camellia Shop · Curated Tech, Watches, Skincare, Jewelry, Fashion & Partner Stores incl. Amazon & AliExpress',
  heroTitle: 'Curated Tech, Watches, Skincare, Fashion, Jewelry & Partner Stores.',
  heroSubtitle:
    'Shop workspace electronics, COLMI smartwatches, skincare, home essentials, fashion, jewelry, toys, and cloud hosting across Amazon, AliExpress, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, and ExonHost.',
  storeTitle: 'Shop Workspace Gear, Smartwatches, Skincare, Fashion, Jewelry & Hosting',
  storeSubtitle:
    'Explore electronics, Bluetooth calling smartwatches, authentic skincare, fashion, jewelry, toys, home appliances, and hosting across Amazon, AliExpress, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, and ExonHost.',
  checkoutNotice:
    'All checkout, live pricing, shipping coverage, buyer protection, and returns complete directly on Amazon, AliExpress, Shopz BD, Star Tech, BanglaShoppers, Illin BD, Releva BD, ExonHost, or Sohoj Affiliates.',
  seoDescription: DEFAULT_SEO_DESCRIPTION
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  getRelevaSearchUrl: (query: string) => string;
  amazonShortUrl: string;
  amazonStoreUrl: string;
  aliexpressEnabled: boolean;
  aliexpressStoreUrl: string;
  aliexpressEventUrl: string;
  tenantId: string;
  eventPromos: EventPromoCreative[];
  shopzStoreUrl: string;
  relevaStoreUrl: string;
  exonhostStoreUrl: string;
  banglashoppersStoreUrl: string;
  illinStoreUrl: string;
  sohojStoreUrl: string;
  startechStoreUrl: string;
  affiliateTag: string;
  recordAffiliateClick: (productId?: string, store?: PartnerStoreOrigin, category?: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setCurrency, exchangeRates, showNotification } = useCart();
  const [selectedCategory, setSelectedCategoryState] = useState<string>('All Departments (Mega Store)');
  const [selectedStoreFilter, setSelectedStoreFilterState] = useState<StoreFilterOption>('all');
  const [searchQuery, setSearchQuery] = useState<string>(() =>
    typeof window !== 'undefined' ? readSearchQueryFromLocation(window.location.search) : ''
  );
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
  const [clientTenantId, setClientTenantId] = useState<string>(() => resolveActiveTenantId());
  const [storefrontData, setStorefrontData] = useState<StorefrontResponse | null>(null);
  const [csvProducts, setCsvProducts] = useState<EcomProduct[]>([]);
  const [eventPromos, setEventPromos] = useState<EventPromoCreative[]>(DEFAULT_ALIEXPRESS_EVENT_PROMOS);

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
        fetch(
          resolveTenantApiUrl('/api/events', clientTenantId),
          resolveTenantFetchInit(clientTenantId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              eventType: params.eventType,
              category: params.category,
              store: params.store,
              productId: params.productId
            })
          })
        ).catch(() => {
          // Non-blocking anonymous telemetry
        });
      }
    },
    [personalizationEnabled, clientTenantId]
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
            resolveTenantApiUrl(
              `/api/profile?sessionId=${encodeURIComponent(sessionId)}`,
              clientTenantId
            ),
            resolveTenantFetchInit(clientTenantId, { method: 'DELETE' })
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
    let cancelled = false;

    const loadEventPromosCsv = async () => {
      for (const candidatePath of EVENT_PROMOTION_CSV_FETCH_PATHS) {
        try {
          const res = await fetch(candidatePath);
          if (!res.ok) continue;
          const text = await res.text();
          if (!text || !text.toLowerCase().includes('s.click.aliexpress.com')) continue;
          const parsed = parseEventPromotionCsv(text);
          if (!cancelled && parsed.length > 0) {
            setEventPromos(parsed);
            return;
          }
        } catch {
          // Try next local path
        }
      }
    };

    if (!isStaticHostedWithoutApi()) {
      fetch(
        resolveTenantApiUrl('/api/promotions', clientTenantId),
        resolveTenantFetchInit(clientTenantId)
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { items?: EventPromoCreative[] } | null) => {
          if (!cancelled && Array.isArray(data?.items) && data.items.length > 0) {
            setEventPromos(data.items);
          } else {
            void loadEventPromosCsv();
          }
        })
        .catch(() => {
          void loadEventPromosCsv();
        });
    } else {
      void loadEventPromosCsv();
    }

    return () => {
      cancelled = true;
    };
  }, [clientTenantId]);

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

  }, []);

  useEffect(() => {
    if (isStaticHostedWithoutApi()) return;
    let cancelled = false;
    fetch(
      resolveTenantApiUrl('/api/storefront', clientTenantId),
      resolveTenantFetchInit(clientTenantId)
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StorefrontResponse | null) => {
        if (!cancelled && data && typeof data === 'object') {
          setStorefrontData(data);
        }
      })
      .catch(() => {
        // Keep static defaults
      });
    return () => {
      cancelled = true;
    };
  }, [clientTenantId]);

  const activeStorefrontData = useMemo(() => {
    if (!storefrontData) return null;
    if (storefrontData.tenantId && storefrontData.tenantId !== clientTenantId) {
      return null;
    }
    return storefrontData;
  }, [storefrontData, clientTenantId]);

  const storefrontCopy = useMemo<StorefrontCopyConfig>(
    () => ({
      siteName: activeStorefrontData?.siteName || DEFAULT_STOREFRONT_COPY.siteName,
      announcementText: activeStorefrontData?.announcementText || DEFAULT_STOREFRONT_COPY.announcementText,
      heroTitle: activeStorefrontData?.heroTitle || DEFAULT_STOREFRONT_COPY.heroTitle,
      heroSubtitle: activeStorefrontData?.heroSubtitle || DEFAULT_STOREFRONT_COPY.heroSubtitle,
      storeTitle: activeStorefrontData?.storeTitle || DEFAULT_STOREFRONT_COPY.storeTitle,
      storeSubtitle: activeStorefrontData?.storeSubtitle || DEFAULT_STOREFRONT_COPY.storeSubtitle,
      checkoutNotice: activeStorefrontData?.checkoutNotice || DEFAULT_STOREFRONT_COPY.checkoutNotice,
      seoDescription: activeStorefrontData?.seoDescription || DEFAULT_STOREFRONT_COPY.seoDescription
    }),
    [activeStorefrontData]
  );

  const products = useMemo<EcomProduct[]>(() => {
    const customList = Array.isArray(activeStorefrontData?.customProducts) ? activeStorefrontData.customProducts : [];
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

    const hiddenSet = new Set(Array.isArray(activeStorefrontData?.hiddenProductIds) ? activeStorefrontData.hiddenProductIds : []);
    const overrides = activeStorefrontData?.priceOverrides || {};

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

    const featured = Array.isArray(activeStorefrontData?.featuredProductIds) ? activeStorefrontData.featuredProductIds : [];
    const rank = new Map(featured.map((id, idx) => [id, idx]));

    return [...combined].sort((a, b) => {
      const ra = rank.has(a.id) ? (rank.get(a.id) as number) : Number.MAX_SAFE_INTEGER;
      const rb = rank.has(b.id) ? (rank.get(b.id) as number) : Number.MAX_SAFE_INTEGER;
      if (ra !== rb) return ra - rb;

      const storeRankA = getStorePriorityRank(a.originStore, visitorRegion);
      const storeRankB = getStorePriorityRank(b.originStore, visitorRegion);
      return storeRankA - storeRankB;
    });
  }, [activeStorefrontData, csvProducts, visitorRegion]);

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
    const incoming = Array.isArray(activeStorefrontData?.sponsors) ? activeStorefrontData.sponsors : null;
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
  }, [activeStorefrontData]);

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

    fetch(
      resolveTenantApiUrl('/api/clicks', clientTenantId),
      resolveTenantFetchInit(clientTenantId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: productId || 'outbound' })
      })
    ).catch(() => {
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

  useEffect(() => {
    const syncFromLocation = () => {
      setSearchQuery(readSearchQueryFromLocation(window.location.search));
      setClientTenantId(resolveActiveTenantId(window.location.href));
    };
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

  useEffect(() => {
    syncUrlSearchParam(searchQuery);
    applyDynamicSeoMetadata({
      siteName: activeStorefrontData?.siteName || 'Camellia Shop',
      description: storefrontCopy.seoDescription,
      searchQuery
    });
  }, [searchQuery, activeStorefrontData?.siteName, storefrontCopy.seoDescription]);

  const resolvedAffiliateConfig = useMemo(
    () =>
      resolveStorefrontAffiliateConfig({
        aliexpress:
          activeStorefrontData?.affiliateConfig?.aliexpress ||
          activeStorefrontData?.partnerStores?.aliexpress,
        amazon: activeStorefrontData?.affiliateConfig?.amazon
      }),
    [activeStorefrontData]
  );

  const activeAmazonTag = resolvedAffiliateConfig.amazon.associateTag;
  const activeAmazonStoreUrl = resolvedAffiliateConfig.amazon.storeUrl;
  const activeAmazonShortUrl = resolvedAffiliateConfig.amazon.shortUrl;
  const activeAliExpressPortalUrl = resolvedAffiliateConfig.aliexpress.portalUrl;
  const activeAliExpressEventUrl = resolvedAffiliateConfig.aliexpress.eventUrl;

  const getAffiliateBuyUrl = (product: EcomProduct): string => {
    return resolvePartnerProductUrl({
      rawUrl: product.affiliateUrl || '',
      originStore: product.originStore,
      asin: product.asin,
      productId: product.id,
      urlKind: product.urlKind,
      affiliateConfig: resolvedAffiliateConfig
    });
  };

  const activeTenantId = activeStorefrontData?.tenantId || clientTenantId;

  const getAmazonSearchAffiliateUrl = (query: string): string => {
    return buildAmazonSearchUrl(query, resolvedAffiliateConfig.amazon);
  };

  const getShopzSearchAffiliateUrl = (query: string): string => {
    return buildShopzSearchUrl(query);
  };

  const getRelevaSearchUrl = (query: string): string => {
    return buildRelevaSearchUrl(query);
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
        searchQuery,
        setSearchQuery,
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
        getRelevaSearchUrl,
        amazonShortUrl: activeAmazonShortUrl,
        amazonStoreUrl: activeAmazonStoreUrl,
        aliexpressEnabled: resolvedAffiliateConfig.aliexpress.enabled,
        aliexpressStoreUrl: activeAliExpressPortalUrl,
        aliexpressEventUrl: activeAliExpressEventUrl,
        tenantId: activeTenantId,
        eventPromos,
        shopzStoreUrl: SHOPZ_REF_BASE,
        relevaStoreUrl: RELEVA_HOME_URL,
        exonhostStoreUrl: EXONHOST_AFFILIATE_URL,
        banglashoppersStoreUrl: BANGLASHOPPERS_AFFILIATE_URL,
        illinStoreUrl: ILLIN_AFFILIATE_URL,
        sohojStoreUrl: SOHOJ_AFFILIATE_URL,
        startechStoreUrl: STARTECH_AFFILIATE_URL,
        affiliateTag: activeAmazonTag,
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
