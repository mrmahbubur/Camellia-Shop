import React, { createContext, useContext, useState, useEffect } from 'react';
import { EcomProduct, UNIFIED_PRODUCTS, AMAZON_STORE_URL, SHOPZ_REF_BASE } from '../data/unifiedProductsData';

interface ProductsContextType {
  products: EcomProduct[];
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
  totalAffiliateClicks: number;
  recordAffiliateClick: (productId?: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const FIXED_AFFILIATE_TAG = 'mrxshahin1-20';

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Departments (Mega Store)');
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);

  const amazonStoreUrl = AMAZON_STORE_URL;
  const shopzStoreUrl = SHOPZ_REF_BASE;
  const affiliateTag = FIXED_AFFILIATE_TAG;

  const [totalAffiliateClicks, setTotalAffiliateClicks] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mrs_affiliate_click_count');
      const parsed = saved ? parseInt(saved, 10) : 0;
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const recordAffiliateClick = () => {
    setTotalAffiliateClicks((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('mrs_affiliate_click_count', next.toString());
      } catch {
        // storage unavailable
      }
      return next;
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
        products: UNIFIED_PRODUCTS,
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
        totalAffiliateClicks,
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
