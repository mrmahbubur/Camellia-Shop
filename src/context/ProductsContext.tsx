import React, { createContext, useContext, useState, useEffect } from 'react';
import { EcomProduct, UNIFIED_PRODUCTS, ProductCategory, AMAZON_STORE_URL, SHOPZ_REF_BASE } from '../data/unifiedProductsData';

interface ProductsContextType {
  products: EcomProduct[];
  addAffiliateProduct: (newProduct: Omit<EcomProduct, 'id'>) => string;
  quickAddAffiliateLink: (url: string, title?: string, category?: ProductCategory) => string;
  autoIncludeProductByVisitorChoice: (keyword: string, preferredStore?: 'Amazon' | 'Shopz BD') => EcomProduct;
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

// Realistic curated imagery banks for auto-generating visitor choices
const VISITOR_CHOICE_IMAGE_MAP: Record<string, { image: string; category: ProductCategory; dept: string; price: number; brand: string }> = {
  headphone: {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Headphones',
    dept: 'Audio & Headphones',
    price: 129.99,
    brand: 'StudioSound Pro'
  },
  keyboard: {
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    category: 'Computers & Accessories',
    dept: 'Mechanical Keyboards',
    price: 119.00,
    brand: 'TactileTech'
  },
  mouse: {
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    category: 'Computers & Accessories',
    dept: 'Ergonomic Peripherals',
    price: 79.99,
    brand: 'ProClick Series'
  },
  monitor: {
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    category: 'Computers & Accessories',
    dept: 'Monitors & Displays',
    price: 329.99,
    brand: 'UltraVision 4K'
  },
  watch: {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    category: 'Wearables & Smartwatches',
    dept: 'Smartwatches & Fitness',
    price: 54.00,
    brand: 'PulseTrack GPS'
  },
  charger: {
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    category: 'Smart Home & Power',
    dept: 'GaN Fast Chargers',
    price: 39.99,
    brand: 'VoltSpeed GaN'
  },
  powerbank: {
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    category: 'Smart Home & Power',
    dept: 'High Capacity Power',
    price: 65.00,
    brand: 'PowerVault Ultra'
  },
  speaker: {
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    category: 'Audio & Headphones',
    dept: 'Wireless Audio',
    price: 85.00,
    brand: 'AcousticWave'
  },
  camera: {
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    category: 'Electronics & Gadgets',
    dept: 'Creator Gear & 4K',
    price: 249.00,
    brand: 'OpticFocus 4K'
  },
  desk: {
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
    category: 'Office & Workspace',
    dept: 'Desk Organization & Ergonomics',
    price: 89.99,
    brand: 'ErgoWorkspace'
  }
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customProducts, setCustomProducts] = useState<EcomProduct[]>(() => {
    try {
      const saved = localStorage.getItem('mrs_custom_affiliate_products');
      return saved ? JSON.parse(saved) : [];
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
      return saved ? parseInt(saved, 10) : 48;
    } catch {
      return 48;
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

  // Clear highlighted product after 6 seconds
  useEffect(() => {
    if (highlightedProductId) {
      const timer = setTimeout(() => {
        setHighlightedProductId(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [highlightedProductId]);

  const getAffiliateBuyUrl = (product: EcomProduct): string => {
    if (product.originStore === 'Shopz BD' || (product.affiliateUrl && product.affiliateUrl.includes('shopz.com.bd'))) {
      if (product.affiliateUrl.includes('ref=')) {
        return product.affiliateUrl;
      }
      const sep = product.affiliateUrl.includes('?') ? '&' : '?';
      return `${product.affiliateUrl}${sep}ref=mahbubur-rahman-shahin`;
    }

    if (product.affiliateUrl) {
      if (product.affiliateUrl.includes('link.amazon') || product.affiliateUrl.includes('amzn.to')) {
        return product.affiliateUrl;
      }
      if (product.affiliateUrl.includes('amazon.com')) {
        try {
          const url = new URL(product.affiliateUrl);
          url.searchParams.set('tag', affiliateTag || 'mrxshahin1-20');
          url.searchParams.set('linkCode', 'll2');
          url.searchParams.set('linkId', 'b0640e715d1eb5bbcc6b9a28347ac557');
          return url.toString();
        } catch {
          const sep = product.affiliateUrl.includes('?') ? '&' : '?';
          return `${product.affiliateUrl}${sep}tag=${affiliateTag}&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;
        }
      }
      return product.affiliateUrl;
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

  const addAffiliateProduct = (newProduct: Omit<EcomProduct, 'id'>): string => {
    const id = `custom-affiliate-${Date.now()}`;
    const productWithId: EcomProduct = {
      ...newProduct,
      id,
      department: newProduct.department || 'Amazon Verified Picks',
      commissionRate: newProduct.commissionRate || 4,
      isAccessory: true,
      isUserAdded: true,
      originStore: newProduct.originStore || 'Amazon'
    };
    setCustomProducts((prev) => [productWithId, ...prev]);
    setHighlightedProductId(id);
    return id;
  };

  /**
   * AUTOMATIC SYSTEM: Includes products by visitor's choice automatically!
   * Checks if an exact match exists, else automatically derives realistic attributes,
   * connects the appropriate affiliate tracking link, injects it into catalog,
   * stores it in localStorage, and highlights it for the visitor.
   */
  const autoIncludeProductByVisitorChoice = (keyword: string, preferredStore?: 'Amazon' | 'Shopz BD'): EcomProduct => {
    const cleanKeyword = keyword.trim();
    const lower = cleanKeyword.toLowerCase();

    // Check if matching custom product already exists
    const existing = [...customProducts, ...UNIFIED_PRODUCTS].find((p) =>
      p.title.toLowerCase().includes(lower) || (p.department && p.department.toLowerCase().includes(lower))
    );
    if (existing) {
      setHighlightedProductId(existing.id);
      return existing;
    }

    // Determine appropriate category & metadata from keyword
    let matchedMeta = VISITOR_CHOICE_IMAGE_MAP.desk;
    for (const key of Object.keys(VISITOR_CHOICE_IMAGE_MAP)) {
      if (lower.includes(key)) {
        matchedMeta = VISITOR_CHOICE_IMAGE_MAP[key];
        break;
      }
    }

    const store: 'Amazon' | 'Shopz BD' =
      preferredStore || (lower.includes('shopz') || lower.includes('bd') || lower.includes('taka') ? 'Shopz BD' : 'Amazon');

    const formattedTitle = cleanKeyword
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const fullTitle = `${formattedTitle} - High Performance Edition`;
    const price = matchedMeta.price;
    const asin = `B0${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const affiliateUrl =
      store === 'Shopz BD'
        ? `https://www.shopz.com.bd/?s=${encodeURIComponent(cleanKeyword)}&post_type=product&ref=mahbubur-rahman-shahin`
        : `https://www.amazon.com/s?k=${encodeURIComponent(cleanKeyword)}&tag=${affiliateTag}&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;

    const newProd: EcomProduct = {
      id: `auto-choice-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: fullTitle,
      asin,
      brand: `${matchedMeta.brand} / ${store}`,
      category: matchedMeta.category,
      department: matchedMeta.dept,
      isAccessory: true,
      price,
      originalPrice: Math.round(price * 1.25 * 100) / 100,
      rating: 4.8 + Math.round(Math.random() * 2) / 10,
      reviewsCount: Math.floor(1200 + Math.random() * 8000),
      badge: store === 'Amazon' ? "Amazon's Choice" : 'Shopz BD Verified',
      primeEligible: store === 'Amazon',
      deliveryEstimate: store === 'Amazon' ? 'FREE One-Day Delivery with Prime' : 'Express Courier Delivery in 24-48 Hours',
      affiliateUrl,
      inStock: true,
      stockCount: 15,
      mainImage: matchedMeta.image,
      galleryImages: [matchedMeta.image],
      description: `Automatically populated based on visitor interest: "${cleanKeyword}". Verified hardware with official manufacturer warranty and full affiliate commission tracking.`,
      highlights: [
        `Curated specifically for visitor choice: "${cleanKeyword}"`,
        `100% Authentic verified stock through official ${store} logistics`,
        store === 'Amazon' ? 'Prime 1-2 Day Free Delivery and 30-Day Returns' : 'Express delivery across Bangladesh with cash on delivery'
      ],
      specs: [
        { label: 'Origin Platform', value: store },
        { label: 'Tracking Code', value: store === 'Amazon' ? affiliateTag : 'mahbubur-rahman-shahin' },
        { label: 'Visitor Query', value: cleanKeyword }
      ],
      reviews: [
        {
          author: 'Verified Buyer',
          rating: 5,
          date: 'Recently verified',
          title: `Exactly the ${cleanKeyword} I was looking for`,
          comment: `Ordered seamlessly via ${store}. Fast delivery and high quality build.`,
          verifiedAmazonPurchase: true
        }
      ],
      commissionRate: store === 'Shopz BD' ? 8 : 4,
      commissionNote: store === 'Shopz BD' ? '8% Commission via Shopz BD Referral' : '4% - 10% Commission via Amazon Associates',
      isUserAdded: true,
      originStore: store
    };

    setCustomProducts((prev) => [newProd, ...prev]);
    setHighlightedProductId(newProd.id);
    return newProd;
  };

  const quickAddAffiliateLink = (url: string, customTitle?: string, customCategory?: ProductCategory): string => {
    const cleanUrl = url.trim();
    const isShopz = cleanUrl.includes('shopz.com.bd');
    const store = isShopz ? 'Shopz BD' : 'Amazon';

    let title = customTitle || (isShopz ? 'Shopz BD Verified Product' : 'Amazon Verified Product');
    let price = 59.99;
    let category: ProductCategory = customCategory || (isShopz ? 'Shopz BD Tech Deals' : 'Electronics & Gadgets');
    let department = isShopz ? 'Shopz BD Gadgets' : 'Computers & Accessories';
    let image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
    let badge = isShopz ? 'Shopz BD Partner' : "Amazon's Choice";

    return addAffiliateProduct({
      title,
      asin: 'B0' + Date.now().toString(36).toUpperCase(),
      brand: store,
      category,
      department,
      isAccessory: true,
      price,
      originalPrice: price * 1.25,
      rating: 4.9,
      reviewsCount: 1450,
      badge,
      primeEligible: store === 'Amazon',
      deliveryEstimate: store === 'Amazon' ? 'FREE Prime 1-2 Day Delivery' : 'Express Courier Delivery in 24-48 Hours',
      affiliateUrl: cleanUrl,
      inStock: true,
      stockCount: 20,
      mainImage: image,
      galleryImages: [image],
      description: `Verified product integrated via affiliate link. Connected with official commission tracking.`,
      highlights: [
        'Directly linked with verified partner affiliate tracking',
        'Official customer protection and replacement policies'
      ],
      specs: [
        { label: 'Storefront', value: store },
        { label: 'Department', value: department }
      ],
      reviews: [
        {
          author: 'Verified Customer',
          rating: 5,
          date: 'Recently verified',
          title: 'Authentic product with fast shipping',
          comment: 'Ordered through the recommendation and arrived promptly.',
          verifiedAmazonPurchase: true
        }
      ],
      commissionRate: isShopz ? 8 : 4,
      commissionNote: isShopz ? '8% Commission via Shopz BD Referral' : '4% - 10% Commission via Amazon Associates',
      originStore: store
    });
  };

  const removeCustomProduct = (id: string) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Merge custom & visitor-chosen products at the very top so they are prominently featured
  const products = [...customProducts, ...UNIFIED_PRODUCTS];

  return (
    <ProductsContext.Provider
      value={{
        products,
        addAffiliateProduct,
        quickAddAffiliateLink,
        autoIncludeProductByVisitorChoice,
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
