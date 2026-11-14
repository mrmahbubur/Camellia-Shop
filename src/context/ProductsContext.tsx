import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { EcomProduct, UNIFIED_PRODUCTS, AMAZON_STORE_URL, SHOPZ_REF_BASE } from '../data/unifiedProductsData';

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
}

const DEFAULT_STOREFRONT_COPY: StorefrontCopyConfig = {
  siteName: 'Camellia Shop',
  announcementText: 'Camellia Shop · Curated Amazon Prime & Shopz BD Hardware',
  heroTitle: 'Curated Workspace Electronics, Desk Hardware & Direct Checkout.',
  heroSubtitle:
    'Shop curated computer peripherals, GaN chargers, studio audio gear, monitors, and desk accessories with live multi-currency pricing and direct Amazon and Shopz BD product links.',
  storeTitle: 'Shop Prime Gear & Shopz BD Electronics',
  storeSubtitle:
    'Curated hardware across Amazon and Shopz BD. Every purchase completes directly on the official retailer store with manufacturer warranties and buyer protection.'
};

interface ProductsContextType {
  products: EcomProduct[];
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
  affiliateTag: string;
  recordAffiliateClick: (productId?: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const FIXED_AFFILIATE_TAG = 'mrxshahin1-20';

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Departments (Mega Store)');
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [storefrontData, setStorefrontData] = useState<StorefrontResponse | null>(null);

  const amazonStoreUrl = AMAZON_STORE_URL;
  const shopzStoreUrl = SHOPZ_REF_BASE;
  const affiliateTag = FIXED_AFFILIATE_TAG;

  useEffect(() => {
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
    const mergedBase = UNIFIED_PRODUCTS.map((p) => customMap.get(p.id) || p);
    const extraCustom = customList.filter((p) => !UNIFIED_PRODUCTS.some((u) => u.id === p.id));

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
  }, [storefrontData]);

  const recordAffiliateClick = (productId?: string) => {
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

  const applyPartnerTracking = (rawUrl: string, originStore: 'Amazon' | 'Shopz BD'): string => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return originStore === 'Shopz BD' ? shopzStoreUrl : amazonStoreUrl;

    if (originStore === 'Shopz BD' || trimmed.includes('shopz.com.bd')) {
      if (trimmed.includes('ref=')) return trimmed;
      const sep = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${sep}ref=mahbubur-rahman-shahin`;
    }

    if (trimmed.includes('link.amazon') || trimmed.includes('amzn.to')) {
      return trimmed;
    }

    if (trimmed.includes('amazon.com')) {
      try {
        const url = new URL(trimmed);
        url.searchParams.set('tag', affiliateTag);
        url.searchParams.set('linkCode', 'll2');
        url.searchParams.set('linkId', 'b0640e715d1eb5bbcc6b9a28347ac557');
        return url.toString();
      } catch {
        const sep = trimmed.includes('?') ? '&' : '?';
        return `${trimmed}${sep}tag=${affiliateTag}&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;
      }
    }

    return trimmed;
  };

  const getAffiliateBuyUrl = (product: EcomProduct): string => {
    if (product.affiliateUrl) {
      return applyPartnerTracking(product.affiliateUrl, product.originStore);
    }

    if (product.asin) {
      return `https://www.amazon.com/dp/${product.asin}?tag=${affiliateTag}&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;
    }

    return `https://www.amazon.com/s?k=${encodeURIComponent(product.title)}&tag=${affiliateTag}&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;
  };

  const getAmazonSearchAffiliateUrl = (query: string): string => {
    const clean = query.trim() || 'trending electronics deals';
    return `https://www.amazon.com/s?k=${encodeURIComponent(clean)}&tag=${affiliateTag}&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;
  };

  const getShopzSearchAffiliateUrl = (query: string): string => {
    const clean = query.trim() || 'gadgets';
    return `https://www.shopz.com.bd/?s=${encodeURIComponent(clean)}&post_type=product&ref=mahbubur-rahman-shahin`;
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
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
