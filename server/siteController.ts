import { GoogleGenAI, Type } from '@google/genai';
import type { PartnerStoreOrigin } from '../src/utils/regionProfile.ts';
import { type ProductCategory } from '../src/data/catalogRecords.ts';
import { DEFAULT_SEO_DESCRIPTION } from '../src/utils/seoSchema.ts';
import {
  isBlockedAffiliateUrl,
  resolvePartnerProductUrl,
  resolveStorefrontAffiliateConfig,
  type StorefrontAffiliateConfig,
  type StorefrontAffiliateOverride
} from './affiliateConfig.ts';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface CustomStoreProduct {
  id: string;
  title: string;
  asin?: string;
  brand: string;
  category: Exclude<ProductCategory, 'All Departments (Mega Store)'>;
  department: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  primeEligible: boolean;
  deliveryEstimate: string;
  affiliateUrl: string;
  mainImage: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  originStore: PartnerStoreOrigin;
}

export interface PriceOverride {
  price?: number;
  originalPrice?: number;
  badge?: string;
}

export interface SponsorAdConfig {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  group: 'Hardware & Power' | 'Workspace & Audio' | 'Deals & Bundles';
  ctaLabel: string;
  url: string;
  featured?: boolean;
}

export interface StorefrontConfig {
  siteName: string;
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  storeTitle: string;
  storeSubtitle: string;
  checkoutNotice: string;
  seoDescription: string;
  affiliateConfig: StorefrontAffiliateConfig;
  hiddenProductIds: string[];
  featuredProductIds: string[];
  priceOverrides: Record<string, PriceOverride>;
  customProducts: CustomStoreProduct[];
  sponsors?: SponsorAdConfig[];
  updatedAt: string;
}

export const DEFAULT_STOREFRONT: StorefrontConfig = {
  siteName: 'Camellia Shop',
  announcementText:
    'Camellia Shop · Curated Amazon, AliExpress, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates & ExonHost',
  heroTitle: 'Curated Tech, Watches, Skincare, Fashion, Jewelry & Partner Stores.',
  heroSubtitle:
    'Explore workspace electronics, COLMI smartwatches, skincare, fashion, jewelry, toys, home essentials, cloud hosting, and partner offers across Amazon, AliExpress, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, and ExonHost.',
  storeTitle: 'Shop Workspace Gear, Smartwatches, Skincare, Fashion, Jewelry & Hosting',
  storeSubtitle:
    'Browse electronics, smartwatches, skincare, fashion, jewelry, toys, home essentials, and hosting portals across Amazon, AliExpress, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, and ExonHost. Every order completes directly on the partner store.',
  checkoutNotice:
    'All checkout, live pricing, shipping coverage, buyer protection, and returns complete directly on Amazon, AliExpress, Shopz BD, Star Tech, BanglaShoppers, Illin BD, Releva BD, ExonHost, or Sohoj Affiliates.',
  seoDescription: DEFAULT_SEO_DESCRIPTION,
  affiliateConfig: resolveStorefrontAffiliateConfig(),
  hiddenProductIds: [],
  featuredProductIds: [],
  priceOverrides: {},
  customProducts: [],
  updatedAt: new Date().toISOString()
};

function isBlockedUrl(url: string): boolean {
  return isBlockedAffiliateUrl(url);
}

function sanitizePartnerUrl(
  rawUrl: string,
  originStore: PartnerStoreOrigin,
  asin?: string,
  affiliateConfig?: StorefrontAffiliateConfig,
  productId?: string
): string {
  return resolvePartnerProductUrl({
    rawUrl,
    originStore,
    asin,
    productId,
    urlKind: 'product',
    affiliateConfig
  });
}

const VALID_CATEGORIES = new Set<CustomStoreProduct['category']>([
  'Electronics & Gadgets',
  'Computers & Accessories',
  'Audio & Headphones',
  'Smart Home & Power',
  'Wearables & Smartwatches',
  'Office & Workspace',
  'Shopz BD Tech Deals',
  'Star Tech BD Gadgets',
  'Releva BD Picks',
  'BanglaShoppers Beauty',
  'Illin BD Home & Tech',
  'Sohoj Affiliate Network',
  'Cloud Hosting & Domains',
  'AliExpress Global Picks'
]);

function ensureAliExpressIncluded(value: unknown, fallback: string): string {
  const clean = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  return clean.toLowerCase().includes('aliexpress') ? clean : fallback;
}

function ensureSeoDescriptionCoverage(value: unknown, fallback: string): string {
  const clean = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  const lower = clean.toLowerCase();
  if (lower.includes('fashion') && lower.includes('jewelry') && lower.includes('aliexpress')) {
    return clean;
  }
  return fallback;
}

function normalizeStorefront(raw?: Partial<StorefrontConfig> | null): StorefrontConfig {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    siteName:
      typeof src.siteName === 'string' && src.siteName.trim()
        ? src.siteName.trim()
        : DEFAULT_STOREFRONT.siteName,
    announcementText: ensureAliExpressIncluded(
      src.announcementText,
      DEFAULT_STOREFRONT.announcementText
    ),
    heroTitle:
      typeof src.heroTitle === 'string' && src.heroTitle.trim()
        ? src.heroTitle.trim()
        : DEFAULT_STOREFRONT.heroTitle,
    heroSubtitle: ensureAliExpressIncluded(
      src.heroSubtitle,
      DEFAULT_STOREFRONT.heroSubtitle
    ),
    storeTitle:
      typeof src.storeTitle === 'string' && src.storeTitle.trim()
        ? src.storeTitle.trim()
        : DEFAULT_STOREFRONT.storeTitle,
    storeSubtitle: ensureAliExpressIncluded(
      src.storeSubtitle,
      DEFAULT_STOREFRONT.storeSubtitle
    ),
    checkoutNotice: ensureAliExpressIncluded(
      src.checkoutNotice,
      DEFAULT_STOREFRONT.checkoutNotice
    ),
    seoDescription: ensureSeoDescriptionCoverage(
      src.seoDescription,
      DEFAULT_STOREFRONT.seoDescription
    ),
    affiliateConfig: resolveStorefrontAffiliateConfig(
      src.affiliateConfig as StorefrontAffiliateOverride | undefined
    ),
    hiddenProductIds: Array.isArray(src.hiddenProductIds)
      ? Array.from(
          new Set(
            src.hiddenProductIds.filter(
              (id): id is string => typeof id === 'string' && id.trim().length > 0
            )
          )
        )
      : [],
    featuredProductIds: Array.isArray(src.featuredProductIds)
      ? Array.from(
          new Set(
            src.featuredProductIds.filter(
              (id): id is string => typeof id === 'string' && id.trim().length > 0
            )
          )
        )
      : [],
    priceOverrides:
      src.priceOverrides && typeof src.priceOverrides === 'object' && !Array.isArray(src.priceOverrides)
        ? src.priceOverrides
        : {},
    customProducts: Array.isArray(src.customProducts) ? src.customProducts : [],
    sponsors: Array.isArray(src.sponsors) ? src.sponsors : undefined,
    updatedAt: typeof src.updatedAt === 'string' ? src.updatedAt : new Date().toISOString()
  };
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Server-side GEMINI_API_KEY is not configured in environment secrets.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

interface ControlPatch {
  summary: string;
  siteName?: string;
  announcementText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  storeTitle?: string;
  storeSubtitle?: string;
  checkoutNotice?: string;
  seoDescription?: string;
  affiliateConfig?: StorefrontAffiliateOverride;
  hideProductIds?: string[];
  unhideProductIds?: string[];
  featuredProductIds?: string[];
  priceOverrides?: Array<{
    productId: string;
    price?: number;
    originalPrice?: number;
    badge?: string;
  }>;
  removeCustomProductIds?: string[];
  removeSponsorIds?: string[];
  upsertSponsors?: Array<{
    id: string;
    title: string;
    subtitle: string;
    category: string;
    group: string;
    ctaLabel: string;
    url: string;
    featured?: boolean;
  }>;
  upsertProducts?: Array<{
    id: string;
    title: string;
    asin?: string;
    brand: string;
    category: string;
    department: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    primeEligible: boolean;
    deliveryEstimate: string;
    affiliateUrl: string;
    mainImage: string;
    description: string;
    highlights: string[];
    originStore: string;
  }>;
}

async function callGeminiWithRetry(
  instruction: string,
  current: StorefrontConfig
): Promise<ControlPatch> {
  const ai = getAiClient();
  const maxAttempts = 3;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: JSON.stringify({
          instruction,
          currentStorefront: current
        }),
        config: {
          systemInstruction: [
            'You are the silent backend storefront operations engine for Camellia Shop, a curated e-commerce affiliate catalog.',
            'Given an operator instruction and the currentStorefront JSON state, return a minimal JSON patch object describing the exact updates to apply.',
            'Rules:',
            '1. Never mention AI, models, automation, prompts, or system internals in any storefront copy.',
            '2. Keep everything strictly e-commerce focused and never fabricate live prices, discounts, reviews, or delivery guarantees.',
            '3. Preserve approved sponsor links (https://uplcm.com/4/...) and partner store checkout URLs; never add Fabrilife or blocked ad network links.',
            '4. Preserve existing fields unless the instruction requests modifying them.'
          ].join(' '),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              siteName: { type: Type.STRING },
              announcementText: { type: Type.STRING },
              heroTitle: { type: Type.STRING },
              heroSubtitle: { type: Type.STRING },
              storeTitle: { type: Type.STRING },
              storeSubtitle: { type: Type.STRING },
              checkoutNotice: { type: Type.STRING },
              seoDescription: { type: Type.STRING },
              affiliateConfig: {
                type: Type.OBJECT,
                properties: {
                  aliexpress: {
                    type: Type.OBJECT,
                    properties: {
                      enabled: { type: Type.BOOLEAN },
                      portalUrl: { type: Type.STRING },
                      eventUrl: { type: Type.STRING },
                      squareEventUrl: { type: Type.STRING },
                      categories: {
                        type: Type.OBJECT,
                        properties: {
                          jewelry: { type: Type.STRING },
                          beauty: { type: Type.STRING },
                          toys: { type: Type.STRING },
                          womensClothing: { type: Type.STRING }
                        }
                      }
                    }
                  },
                  amazon: {
                    type: Type.OBJECT,
                    properties: {
                      associateTag: { type: Type.STRING },
                      linkId: { type: Type.STRING },
                      storeUrl: { type: Type.STRING },
                      shortUrl: { type: Type.STRING }
                    }
                  }
                }
              },
              hideProductIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              unhideProductIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              featuredProductIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              removeCustomProductIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              removeSponsorIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              upsertSponsors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    category: { type: Type.STRING },
                    group: { type: Type.STRING },
                    ctaLabel: { type: Type.STRING },
                    url: { type: Type.STRING },
                    featured: { type: Type.BOOLEAN }
                  },
                  required: ['id', 'title', 'url']
                }
              },
              priceOverrides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productId: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    originalPrice: { type: Type.NUMBER },
                    badge: { type: Type.STRING }
                  },
                  required: ['productId']
                }
              },
              upsertProducts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    asin: { type: Type.STRING },
                    brand: { type: Type.STRING },
                    category: { type: Type.STRING },
                    department: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    originalPrice: { type: Type.NUMBER },
                    badge: { type: Type.STRING },
                    primeEligible: { type: Type.BOOLEAN },
                    deliveryEstimate: { type: Type.STRING },
                    affiliateUrl: { type: Type.STRING },
                    mainImage: { type: Type.STRING },
                    description: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    originStore: { type: Type.STRING }
                  },
                  required: ['id', 'title', 'brand', 'category', 'price', 'affiliateUrl', 'originStore']
                }
              }
            },
            required: ['summary']
          }
        }
      });

      const rawText = (response.text ?? '{}').trim();
      return JSON.parse(rawText) as ControlPatch;
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt - 1)));
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error('Backend site controller request failed.');
}

export function sanitizeStorefrontConfig(raw?: Partial<StorefrontConfig> | null): StorefrontConfig {
  return normalizeStorefront(raw);
}

export async function executeBackendSiteControl(
  instruction: string,
  currentConfig: StorefrontConfig
): Promise<{ storefront: StorefrontConfig; summary: string }> {
  const cleanInstruction = instruction.trim();
  if (!cleanInstruction) {
    throw new Error('Instruction text is required.');
  }

  const current = normalizeStorefront(currentConfig);
  const patch = await callGeminiWithRetry(cleanInstruction, current);

  const next: StorefrontConfig = {
    ...current,
    hiddenProductIds: [...current.hiddenProductIds],
    featuredProductIds: [...current.featuredProductIds],
    priceOverrides: { ...current.priceOverrides },
    customProducts: [...current.customProducts],
    updatedAt: new Date().toISOString()
  };

  if (typeof patch.siteName === 'string' && patch.siteName.trim()) {
    next.siteName = patch.siteName.trim();
  }
  if (typeof patch.announcementText === 'string' && patch.announcementText.trim()) {
    next.announcementText = patch.announcementText.trim();
  }
  if (typeof patch.heroTitle === 'string' && patch.heroTitle.trim()) {
    next.heroTitle = patch.heroTitle.trim();
  }
  if (typeof patch.heroSubtitle === 'string' && patch.heroSubtitle.trim()) {
    next.heroSubtitle = patch.heroSubtitle.trim();
  }
  if (typeof patch.storeTitle === 'string' && patch.storeTitle.trim()) {
    next.storeTitle = patch.storeTitle.trim();
  }
  if (typeof patch.storeSubtitle === 'string' && patch.storeSubtitle.trim()) {
    next.storeSubtitle = patch.storeSubtitle.trim();
  }
  if (typeof patch.checkoutNotice === 'string' && patch.checkoutNotice.trim()) {
    next.checkoutNotice = patch.checkoutNotice.trim();
  }
  if (typeof patch.seoDescription === 'string' && patch.seoDescription.trim()) {
    next.seoDescription = ensureSeoDescriptionCoverage(
      patch.seoDescription,
      DEFAULT_STOREFRONT.seoDescription
    );
  }
  if (patch.affiliateConfig && typeof patch.affiliateConfig === 'object') {
    next.affiliateConfig = resolveStorefrontAffiliateConfig({
      aliexpress: {
        ...next.affiliateConfig.aliexpress,
        ...patch.affiliateConfig.aliexpress,
        categories: {
          ...next.affiliateConfig.aliexpress.categories,
          ...(patch.affiliateConfig.aliexpress?.categories || {})
        }
      },
      amazon: {
        ...next.affiliateConfig.amazon,
        ...(patch.affiliateConfig.amazon || {})
      }
    });
  }

  if (Array.isArray(patch.hideProductIds)) {
    const hiddenSet = new Set(next.hiddenProductIds);
    for (const id of patch.hideProductIds) {
      if (typeof id === 'string' && id.trim()) hiddenSet.add(id.trim());
    }
    next.hiddenProductIds = Array.from(hiddenSet);
  }

  if (Array.isArray(patch.unhideProductIds)) {
    const removeSet = new Set(patch.unhideProductIds.map((id) => id.trim()));
    next.hiddenProductIds = next.hiddenProductIds.filter((id) => !removeSet.has(id));
  }

  if (Array.isArray(patch.featuredProductIds)) {
    next.featuredProductIds = Array.from(
      new Set(
        patch.featuredProductIds.filter(
          (id): id is string => typeof id === 'string' && id.trim().length > 0
        )
      )
    );
  }

  if (Array.isArray(patch.priceOverrides)) {
    for (const ov of patch.priceOverrides) {
      if (!ov?.productId) continue;
      const cleanOv: PriceOverride = {};
      if (typeof ov.price === 'number' && Number.isFinite(ov.price) && ov.price >= 0) {
        cleanOv.price = Number(ov.price.toFixed(2));
      }
      if (
        typeof ov.originalPrice === 'number' &&
        Number.isFinite(ov.originalPrice) &&
        ov.originalPrice > 0
      ) {
        cleanOv.originalPrice = Number(ov.originalPrice.toFixed(2));
      }
      if (typeof ov.badge === 'string' && ov.badge.trim()) {
        cleanOv.badge = ov.badge.trim();
      }
      next.priceOverrides[ov.productId.trim()] = {
        ...next.priceOverrides[ov.productId.trim()],
        ...cleanOv
      };
    }
  }

  if (Array.isArray(patch.removeCustomProductIds)) {
    const delSet = new Set(patch.removeCustomProductIds.map((id) => id.trim()));
    next.customProducts = next.customProducts.filter((p) => !delSet.has(p.id));
  }

  if (Array.isArray(patch.upsertProducts)) {
    for (const rawProd of patch.upsertProducts) {
      if (!rawProd?.id || !rawProd?.title) continue;
      const originStore: PartnerStoreOrigin =
        rawProd.originStore === 'Shopz BD'
          ? 'Shopz BD'
          : rawProd.originStore === 'AliExpress'
          ? 'AliExpress'
          : rawProd.originStore === 'Star Tech'
          ? 'Star Tech'
          : rawProd.originStore === 'Releva BD'
          ? 'Releva BD'
          : rawProd.originStore === 'BanglaShoppers'
          ? 'BanglaShoppers'
          : rawProd.originStore === 'Illin BD'
          ? 'Illin BD'
          : rawProd.originStore === 'Sohoj Affiliates'
          ? 'Sohoj Affiliates'
          : rawProd.originStore === 'ExonHost'
          ? 'ExonHost'
          : 'Amazon';
      const category = VALID_CATEGORIES.has(rawProd.category as CustomStoreProduct['category'])
        ? (rawProd.category as CustomStoreProduct['category'])
        : originStore === 'ExonHost'
        ? 'Cloud Hosting & Domains'
        : originStore === 'AliExpress'
        ? 'AliExpress Global Picks'
        : originStore === 'Shopz BD'
        ? 'Shopz BD Tech Deals'
        : originStore === 'Star Tech'
        ? 'Star Tech BD Gadgets'
        : originStore === 'Releva BD'
        ? 'Releva BD Picks'
        : originStore === 'BanglaShoppers'
        ? 'BanglaShoppers Beauty'
        : originStore === 'Illin BD'
        ? 'Illin BD Home & Tech'
        : originStore === 'Sohoj Affiliates'
        ? 'Sohoj Affiliate Network'
        : 'Electronics & Gadgets';
      const safeImage =
        typeof rawProd.mainImage === 'string' &&
        rawProd.mainImage.trim() &&
        !isBlockedUrl(rawProd.mainImage)
          ? rawProd.mainImage.trim()
          : '';
      const safeProd: CustomStoreProduct = {
        id: rawProd.id.trim(),
        title: rawProd.title.trim(),
        asin:
          typeof rawProd.asin === 'string' && rawProd.asin.trim()
            ? rawProd.asin.trim()
            : undefined,
        brand: (rawProd.brand || 'Camellia Pick').trim(),
        category,
        department: (rawProd.department || category).trim(),
        price:
          typeof rawProd.price === 'number' && Number.isFinite(rawProd.price) && rawProd.price >= 0
            ? Number(rawProd.price.toFixed(2))
            : 0,
        originalPrice:
          typeof rawProd.originalPrice === 'number' &&
          Number.isFinite(rawProd.originalPrice) &&
          rawProd.originalPrice > 0
            ? Number(rawProd.originalPrice.toFixed(2))
            : undefined,
        badge:
          typeof rawProd.badge === 'string' && rawProd.badge.trim()
            ? rawProd.badge.trim()
            : undefined,
        primeEligible: false,
        deliveryEstimate: (
          rawProd.deliveryEstimate || `Check live shipping & terms on ${originStore}`
        ).trim(),
        affiliateUrl: sanitizePartnerUrl(
          rawProd.affiliateUrl || '',
          originStore,
          rawProd.asin,
          next.affiliateConfig
        ),
        mainImage: safeImage,
        galleryImages: safeImage ? [safeImage] : [],
        description: (rawProd.description || rawProd.title).trim(),
        highlights: Array.isArray(rawProd.highlights)
          ? rawProd.highlights.filter(
              (h): h is string => typeof h === 'string' && h.trim().length > 0
            )
          : [],
        specs: [{ label: 'Retailer', value: originStore }],
        originStore
      };

      const existingIdx = next.customProducts.findIndex((p) => p.id === safeProd.id);
      if (existingIdx >= 0) {
        next.customProducts[existingIdx] = safeProd;
      } else {
        next.customProducts.unshift(safeProd);
      }
    }
  }

  if (Array.isArray(patch.removeSponsorIds) && Array.isArray(next.sponsors)) {
    const delSponsors = new Set(patch.removeSponsorIds.map((id) => id.trim()));
    next.sponsors = next.sponsors.filter((s) => !delSponsors.has(s.id));
  }

  if (Array.isArray(patch.upsertSponsors)) {
    const existingSponsors = Array.isArray(next.sponsors) ? [...next.sponsors] : [];
    const validGroups = new Set<SponsorAdConfig['group']>([
      'Hardware & Power',
      'Workspace & Audio',
      'Deals & Bundles'
    ]);
    for (const rawSp of patch.upsertSponsors) {
      if (!rawSp?.id || !rawSp?.title || !rawSp?.url) continue;
      const cleanUrl = rawSp.url.trim();
      if (!cleanUrl.startsWith('https://') || isBlockedUrl(cleanUrl)) continue;
      const group = validGroups.has(rawSp.group as SponsorAdConfig['group'])
        ? (rawSp.group as SponsorAdConfig['group'])
        : 'Deals & Bundles';
      const safeSponsor: SponsorAdConfig = {
        id: rawSp.id.trim(),
        title: rawSp.title.trim(),
        subtitle: (rawSp.subtitle || rawSp.title).trim(),
        category: (rawSp.category || 'Sponsored Partner Offer').trim(),
        group,
        ctaLabel: (rawSp.ctaLabel || 'Open Offer').trim(),
        url: cleanUrl,
        featured: Boolean(rawSp.featured)
      };
      const idx = existingSponsors.findIndex((s) => s.id === safeSponsor.id);
      if (idx >= 0) {
        existingSponsors[idx] = safeSponsor;
      } else {
        existingSponsors.push(safeSponsor);
      }
    }
    next.sponsors = existingSponsors;
  }

  return {
    storefront: next,
    summary:
      typeof patch.summary === 'string' && patch.summary.trim()
        ? patch.summary.trim()
        : 'Storefront updated.'
  };
}
