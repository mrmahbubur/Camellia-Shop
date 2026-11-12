import React, { createContext, useContext, useState, useEffect } from 'react';
import { EcomProduct, UNIFIED_PRODUCTS, ProductCategory, AMAZON_STORE_URL, SHOPZ_REF_BASE } from '../data/unifiedProductsData';

export interface CustomProductInput {
  title: string;
  affiliateUrl: string;
  price: number;
  category: ProductCategory;
  originStore?: 'Amazon' | 'Shopz BD';
  brand?: string;
  description?: string;
  imageUrl?: string;
}

interface ProductsContextType {
  products: EcomProduct[];
  addCustomAffiliateItem: (input: CustomProductInput) => EcomProduct;
  removeCustomProduct: (id: string) => void;
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
  setAffiliateTag: (tag: string) => void;
  totalAffiliateClicks: number;
  recordAffiliateClick: (productId?: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80';

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customProducts, setCustomProducts] = useState<EcomProduct[]>(() => {
    try {
      const saved = localStorage.getItem('mrs_custom_affiliate_products');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All Departments (Mega Store)');
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);

  const amazonStoreUrl = AMAZON_STORE_URL;
  const shopzStoreUrl = SHOPZ_REF_BASE;

  const [affiliateTag, setAffiliateTagState] = useState<string>(() => {
    try {
      return localStorage.getItem('mrs_amazon_tag') || 'mrxshahin1-20';
    } catch {
      return 'mrxshahin1-20';
    }
  });

  const [totalAffiliateClicks, setTotalAffiliateClicks] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mrs_affiliate_click_count');
      const parsed = saved ? parseInt(saved, 10) : 0;
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const setAffiliateTag = (tag: string) => {
    setAffiliateTagState(tag);
    try {
      localStorage.setItem('mrs_amazon_tag', tag);
    } catch {
      // storage unavailable
    }
  };

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
    try {
      localStorage.setItem('mrs_custom_affiliate_products', JSON.stringify(customProducts));
    } catch {
      // Storage unavailable
    }
  }, [customProducts]);

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
        url.searchParams.set('tag', affiliateTag || 'mrxshahin1-20');
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

  const addCustomAffiliateItem = (input: CustomProductInput): EcomProduct => {
    const cleanUrl = input.affiliateUrl.trim();
    const isShopz = input.originStore === 'Shopz BD' || cleanUrl.includes('shopz.com.bd');
    const store: 'Amazon' | 'Shopz BD' = isShopz ? 'Shopz BD' : 'Amazon';
    const trackedUrl = applyPartnerTracking(cleanUrl, store);
    const id = `saved-item-${Date.now()}`;

    // Extract genuine ASIN only if present in an Amazon /dp/ URL
    const asinMatch = trackedUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    const extractedAsin = asinMatch ? asinMatch[1].toUpperCase() : undefined;

    const cleanPrice = Number.isFinite(input.price) && input.price > 0 ? Math.round(input.price * 100) / 100 : 0;
    const img = input.imageUrl?.trim() || FALLBACK_PRODUCT_IMAGE;

    const newProduct: EcomProduct = {
      id,
      title: input.title.trim(),
      asin: extractedAsin,
      brand: input.brand?.trim() || store,
      category: input.category || (isShopz ? 'Shopz BD Tech Deals' : 'Electronics & Gadgets'),
      department: 'Saved Partner Listings',
      isAccessory: true,
      price: cleanPrice,
      rating: 0,
      reviewsCount: 0,
      badge: isShopz ? 'Shopz BD Link' : 'Amazon Link',
      primeEligible: store === 'Amazon',
      deliveryEstimate: store === 'Amazon' ? 'Fulfilled via Amazon' : 'Fulfilled via Shopz BD',
      affiliateUrl: trackedUrl,
      inStock: true,
      stockCount: 1,
      mainImage: img,
      galleryImages: [img],
      description:
        input.description?.trim() ||
        `Custom saved ${store} product link with active referral tracking.`,
      highlights: [
        `Direct ${store} partner referral link verified`,
        'Check live pricing and stock on partner checkout'
      ],
      specs: [
        { label: 'Partner Platform', value: store },
        { label: 'Tracking Tag', value: store === 'Amazon' ? affiliateTag : 'mahbubur-rahman-shahin' }
      ],
      reviews: [],
      commissionRate: isShopz ? 8 : 4,
      commissionNote: isShopz ? 'Shopz BD Partner Referral' : 'Amazon Associates Referral',
      isUserAdded: true,
      originStore: store
    };

    setCustomProducts((prev) => [newProduct, ...prev]);
    setHighlightedProductId(id);
    return newProduct;
  };

  const removeCustomProduct = (id: string) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const products = [...customProducts, ...UNIFIED_PRODUCTS];

  return (
    <ProductsContext.Provider
      value={{
        products,
        addCustomAffiliateItem,
        removeCustomProduct,
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
        setAffiliateTag,
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
