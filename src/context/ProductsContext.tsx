import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  EcomProduct,
  UNIFIED_PRODUCTS,
  AMAZON_LINK_SHORT,
  AMAZON_STORE_URL,
  SHOPZ_REF_BASE,
  EXONHOST_AFFILIATE_URL,
  ALIEXPRESS_AFFILIATE_URL,
  ALIBABA_AFFILIATE_URL
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
  detectBrowserRegionFallback,
  getStorePriorityRank
} from '../utils/regionProfile';
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
  announcementText: 'Camellia Shop · Curated Amazon, Shopz BD, AliExpress, Alibaba & ExonHost',
  heroTitle: 'Curated Workspace Electronics, Desk Hardware & Direct Checkout.',
  heroSubtitle:
    'Shop workspace electronics, accessories, smartwatches, wholesale studio gear, and cloud hosting with multi-currency pricing and direct checkout on Amazon, Shopz BD, AliExpress, Alibaba, and ExonHost.',
  storeTitle: 'Shop Prime Gear, Shopz BD, AliExpress, Alibaba & Hosting',
  storeSubtitle:
    'Browse electronics, personal gadgets, factory-direct hardware, and cloud hosting across Amazon, Shopz BD, AliExpress, Alibaba, and ExonHost. Every purchase completes directly on the official partner store.'
};

export type StoreFilterOption = 'all' | 'Amazon' | 'Shopz BD' | 'ExonHost' | 'AliExpress' | 'Alibaba';

interface ProductsContextType {
  products: EcomProduct[];
  csvProductsCount: number;
  linkedShopCount: number;
  uploadedCsvPath: string;
  sponsors: SponsorPlacement[];
  storefrontCopy: StorefrontCopyConfig;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedStoreFilter: StoreFilterOption;
  setSelectedStoreFilter: (store: StoreFilterOption) => void;
  visitorRegion: VisitorRegionCode;
  setVisitorRegion: (region: VisitorRegionCode) => void;
  regionProfile: RegionProfile;
  highlightedProductId: string | null;
  setHighlightedProductId: (id: string | null) => void;
  getAffiliateBuyUrl: (product: EcomProduct) => string;
  getAmazonSearchAffiliateUrl: (query: string) => string;
  getShopzSearchAffiliateUrl: (query: string) => string;
  amazonShortUrl: string;
  amazonStoreUrl: string;
  shopzStoreUrl: string;
  exonhostStoreUrl: string;
  aliexpressStoreUrl: string;
  alibabaStoreUrl: string;
  affiliateTag: string;
  recordAffiliateClick: (productId?: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const FIXED_AFFILIATE_TAG = 'mrxshahin06-20';
const FIXED_LINK_ID = 'f69ce6631cea5fb5a49ce7ba4d3968b6';
const PRIMARY_AMAZON_SHORTLINK = 'https://link.amazon/B0io1BQfg';

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setCurrency } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Departments (Mega Store)');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<StoreFilterOption>('all');
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

  const regionProfile = REGION_PROFILES[visitorRegion] || REGION_PROFILES.GLOBAL;

  const setVisitorRegion = (region: VisitorRegionCode) => {
    setVisitorRegionState(region);
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

  const amazonShortUrl = AMAZON_LINK_SHORT;
  const amazonStoreUrl = AMAZON_STORE_URL;
  const shopzStoreUrl = SHOPZ_REF_BASE;
  const exonhostStoreUrl = EXONHOST_AFFILIATE_URL;
  const aliexpressStoreUrl = ALIEXPRESS_AFFILIATE_URL;
  const alibabaStoreUrl = ALIBABA_AFFILIATE_URL;
  const affiliateTag = FIXED_AFFILIATE_TAG;

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

    const applyDetectedRegion = (code: VisitorRegionCode) => {
      setVisitorRegionState(code);
      if (!hasManualCurrency) {
        setCurrency(REGION_PROFILES[code].defaultCurrency);
      }
    };

    const isStaticDocs = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
    if (isStaticDocs) {
      if (!hasManualRegion) {
        applyDetectedRegion(detectBrowserRegionFallback());
      } else if (!hasManualCurrency) {
        setCurrency(REGION_PROFILES[visitorRegion].defaultCurrency);
      }
      return;
    }

    fetch('/api/region')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { regionCode?: VisitorRegionCode; source?: string } | null) => {
        if (!hasManualRegion && data?.regionCode && REGION_PROFILES[data.regionCode]) {
          const resolved =
            data.source === 'network' || data.source === 'locale'
              ? data.regionCode
              : detectBrowserRegionFallback();
          applyDetectedRegion(resolved);
        } else if (!hasManualCurrency) {
          setCurrency(REGION_PROFILES[visitorRegion].defaultCurrency);
        }
      })
      .catch(() => {
        if (!hasManualRegion) {
          applyDetectedRegion(detectBrowserRegionFallback());
        } else if (!hasManualCurrency) {
          setCurrency(REGION_PROFILES[visitorRegion].defaultCurrency);
        }
      });

    fetch('/api/storefront')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StorefrontResponse | null) => {
        if (data && typeof data === 'object') {
          setStorefrontData(data);
        }
      })
      .catch(() => {
        // Keep static storefront defaults if unreachable
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
      .filter((p) => !hiddenSet.has(p.id))
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
              image: s.image || defaultById.get(s.id)?.image || fallbackImg
            }))
        : DEFAULT_SPONSORS;

    if (visitorRegion === 'BD') {
      const bdOrder = new Set(['sponsor-11683560', 'sponsor-9912130', 'sponsor-11242069']);
      return [...baseList].sort((a, b) => Number(bdOrder.has(b.id)) - Number(bdOrder.has(a.id)));
    }
    return baseList;
  }, [storefrontData, visitorRegion]);

  const recordAffiliateClick = (productId?: string) => {
    if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
      return;
    }
    fetch('/api/clicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId: productId || 'outbound' })
    }).catch(() => {
      // Non-blocking outbound click log
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
    originStore: 'Amazon' | 'Shopz BD' | 'ExonHost' | 'AliExpress' | 'Alibaba',
    asin?: string,
    title?: string
  ): string => {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      if (originStore === 'ExonHost') return exonhostStoreUrl;
      if (originStore === 'AliExpress') return aliexpressStoreUrl;
      if (originStore === 'Alibaba') return alibabaStoreUrl;
      return originStore === 'Shopz BD' ? shopzStoreUrl : amazonStoreUrl;
    }

    if (originStore === 'AliExpress' || trimmed.includes('1e8d114494cb5002cfdd16525dc3e8')) {
      return trimmed.includes('rzekl.com/') ? trimmed : aliexpressStoreUrl;
    }

    if (originStore === 'Alibaba' || trimmed.includes('pm1aev55clcb5002cfdd219aa26f6f')) {
      return trimmed.includes('rzekl.com/') ? trimmed : alibabaStoreUrl;
    }

    if (originStore === 'ExonHost' || trimmed.includes('exonhost.com')) {
      if (trimmed.includes('aff=')) return trimmed;
      return exonhostStoreUrl;
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
      return PRIMARY_AMAZON_SHORTLINK;
    }

    if (trimmed.includes('amazon.com')) {
      try {
        const url = new URL(trimmed);
        url.searchParams.set('tag', affiliateTag);
        url.searchParams.set('linkCode', 'll2');
        url.searchParams.set('linkId', FIXED_LINK_ID);
        return url.toString();
      } catch {
        const sep = trimmed.includes('?') ? '&' : '?';
        return `${trimmed}${sep}tag=${affiliateTag}&linkCode=ll2&linkId=${FIXED_LINK_ID}`;
      }
    }

    return trimmed;
  };

  const getAffiliateBuyUrl = (product: EcomProduct): string => {
    if (product.affiliateUrl) {
      return applyPartnerTracking(product.affiliateUrl, product.originStore, product.asin, product.title);
    }

    if (product.originStore === 'Amazon') {
      return amazonStoreUrl;
    }

    if (product.asin) {
      return `https://www.amazon.com/dp/${product.asin}?tag=${affiliateTag}&linkCode=ll2&linkId=${FIXED_LINK_ID}`;
    }

    return `https://www.amazon.com/s?k=${encodeURIComponent(product.title)}&tag=${affiliateTag}&linkCode=ll2&linkId=${FIXED_LINK_ID}`;
  };

  const getAmazonSearchAffiliateUrl = (query: string): string => {
    const clean = query.trim();
    if (!clean) return amazonStoreUrl;
    return `https://www.amazon.com/s?k=${encodeURIComponent(clean)}&tag=${affiliateTag}&linkCode=ll2&linkId=${FIXED_LINK_ID}`;
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
        regionProfile,
        highlightedProductId,
        setHighlightedProductId,
        getAffiliateBuyUrl,
        getAmazonSearchAffiliateUrl,
        getShopzSearchAffiliateUrl,
        amazonShortUrl,
        amazonStoreUrl,
        shopzStoreUrl,
        exonhostStoreUrl,
        aliexpressStoreUrl,
        alibabaStoreUrl,
        affiliateTag,
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
