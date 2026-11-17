import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  EcomProduct,
  UNIFIED_PRODUCTS,
  AMAZON_STORE_URL,
  SHOPZ_REF_BASE,
  EXONHOST_AFFILIATE_URL
} from '../data/unifiedProductsData';
import { DEFAULT_SPONSORS, SponsorPlacement } from '../data/sponsorsData';
import {
  parseAffiliateCsv,
  UPLOADED_AFFILIATE_CSV_PATH,
  UPLOADED_AFFILIATE_CSV_FETCH_PATHS
} from '../utils/affiliateCsv';

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
  announcementText: 'Camellia Shop · Curated Amazon Prime, Shopz BD & ExonHost',
  heroTitle: 'Curated Workspace Electronics, Desk Hardware & Direct Checkout.',
  heroSubtitle:
    'Shop workspace electronics, accessories, smartwatches, home gadgets, and cloud hosting with multi-currency pricing and direct checkout on Amazon, Shopz BD, and ExonHost.',
  storeTitle: 'Shop Prime Gear, Shopz BD Deals & Hosting',
  storeSubtitle:
    'Browse electronics, personal gadgets, and workspace accessories across Amazon, Shopz BD, and ExonHost. Every purchase completes directly on the official retailer store.'
};

interface ProductsContextType {
  products: EcomProduct[];
  csvProductsCount: number;
  linkedShopCount: number;
  uploadedCsvPath: string;
  sponsors: SponsorPlacement[];
  storefrontCopy: StorefrontCopyConfig;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  highlightedProductId: string | null;
  setHighlightedProductId: (id: string | null) => void;
  getAffiliateBuyUrl: (product: EcomProduct) => string;
  getAmazonSearchAffiliateUrl: (query: string) => string;
  getShopzSearchAffiliateUrl: (query: string) => string;
  amazonStoreUrl: string;
  shopzStoreUrl: string;
  exonhostStoreUrl: string;
  affiliateTag: string;
  recordAffiliateClick: (productId?: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const FIXED_AFFILIATE_TAG = 'mrxshahin06-20';
const FIXED_LINK_ID = 'f69ce6631cea5fb5a49ce7ba4d3968b6';
const PRIMARY_AMAZON_SHORTLINK = 'https://link.amazon/B0io1BQfg';

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Departments (Mega Store)');
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [storefrontData, setStorefrontData] = useState<StorefrontResponse | null>(null);
  const [csvProducts, setCsvProducts] = useState<EcomProduct[]>([]);

  const amazonStoreUrl = AMAZON_STORE_URL;
  const shopzStoreUrl = SHOPZ_REF_BASE;
  const exonhostStoreUrl = EXONHOST_AFFILIATE_URL;
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
    if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
      return;
    }
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
    if (featured.length === 0) return combined;

    const rank = new Map(featured.map((id, idx) => [id, idx]));
    return [...combined].sort((a, b) => {
      const ra = rank.has(a.id) ? (rank.get(a.id) as number) : Number.MAX_SAFE_INTEGER;
      const rb = rank.has(b.id) ? (rank.get(b.id) as number) : Number.MAX_SAFE_INTEGER;
      return ra - rb;
    });
  }, [storefrontData, csvProducts]);

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
    if (!incoming || incoming.length === 0) return DEFAULT_SPONSORS;
    const defaultById = new Map(DEFAULT_SPONSORS.map((s) => [s.id, s]));
    const fallbackImg = DEFAULT_SPONSORS[0].image;
    return incoming
      .filter((s) => s && typeof s.url === 'string' && s.url.startsWith('https://'))
      .map((s) => ({
        ...s,
        image: s.image || defaultById.get(s.id)?.image || fallbackImg
      }));
  }, [storefrontData]);

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
    originStore: 'Amazon' | 'Shopz BD' | 'ExonHost',
    asin?: string,
    title?: string
  ): string => {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      if (originStore === 'ExonHost') return exonhostStoreUrl;
      return originStore === 'Shopz BD' ? shopzStoreUrl : amazonStoreUrl;
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
        highlightedProductId,
        setHighlightedProductId,
        getAffiliateBuyUrl,
        getAmazonSearchAffiliateUrl,
        getShopzSearchAffiliateUrl,
        amazonStoreUrl,
        shopzStoreUrl,
        exonhostStoreUrl,
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
