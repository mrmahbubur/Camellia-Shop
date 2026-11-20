import { GoogleGenAI, Type } from '@google/genai';
import type { PartnerStoreOrigin } from '../src/utils/regionProfile.ts';
import {
  normalizeRelevaAffiliateUrl,
  type ProductCategory
} from '../src/data/catalogRecords.ts';

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
    'Camellia Shop · Curated Amazon, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, Alibaba & ExonHost',
  heroTitle: 'Curated Workspace Tech, Smartwatches, Skincare, Appliances & Partner Stores.',
  heroSubtitle:
    'Explore workspace electronics, COLMI smartwatches, skincare, home essentials, appliances, cloud hosting, and partner offers across Amazon, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, Alibaba, and ExonHost.',
  storeTitle: 'Shop Workspace Gear, Smartwatches, Skincare, Home & Hosting',
  storeSubtitle:
    'Browse electronics, smartwatches, skincare, home essentials, and hosting portals across Amazon, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, Alibaba, and ExonHost. Every order completes directly on the partner store.',
  hiddenProductIds: [],
  featuredProductIds: [],
  priceOverrides: {},
  customProducts: [],
  updatedAt: new Date().toISOString()
};

const BLOCKED_AD_DOMAINS = [
  'profitableratecpmnetwork',
  'adsterra',
  'quge5',
  'blogspot.com',
  'fabrilife.com'
];

function isBlockedUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return BLOCKED_AD_DOMAINS.some((d) => lower.includes(d));
}

function sanitizePartnerUrl(
  rawUrl: string,
  originStore: PartnerStoreOrigin,
  asin?: string
): string {
  const AMAZON_NODE_URL =
    'https://www.amazon.com/b?node=53629917011&linkCode=ll2&tag=mrxshahin06-20&linkId=f69ce6631cea5fb5a49ce7ba4d3968b6&language=en_US&ref_=as_li_ss_tl';
  const AMAZON_SHORT_URL = 'https://link.amazon/B0io1BQfg';
  const ALIBABA_URL = 'https://rzekl.com/g/pm1aev55clcb5002cfdd219aa26f6f/';
  const BANGLASHOPPERS_URL = 'https://www.banglashoppers.com/r/4ehxtB1p/';
  const ILLIN_URL = 'https://www.illin.com.bd/40989';
  const SOHOJ_URL = 'https://sohojaffiliates.com/reffer/40989';
  const STARTECH_TRACKING = '6ad935b5df200';
  const STARTECH_URL = `https://www.startech.com.bd/?tracking=${STARTECH_TRACKING}`;

  const trimmed = rawUrl.trim();
  if (!trimmed || isBlockedUrl(trimmed)) {
    if (originStore === 'ExonHost') return 'https://my.exonhost.com/affiliate?aff=5993';
    if (originStore === 'Alibaba') return ALIBABA_URL;
    if (originStore === 'BanglaShoppers') return BANGLASHOPPERS_URL;
    if (originStore === 'Illin BD') return ILLIN_URL;
    if (originStore === 'Sohoj Affiliates') return SOHOJ_URL;
    if (originStore === 'Star Tech') return STARTECH_URL;
    if (originStore === 'Releva BD') {
      return normalizeRelevaAffiliateUrl('', 'product');
    }
    if (originStore === 'Shopz BD') {
      return 'https://www.shopz.com.bd/?ref=mahbubur-rahman-shahin';
    }
    if (asin && /^[A-Z0-9]{10}$/.test(asin.trim())) {
      return `https://www.amazon.com/dp/${asin.trim()}?tag=mrxshahin06-20&linkCode=ll2&linkId=f69ce6631cea5fb5a49ce7ba4d3968b6`;
    }
    return AMAZON_NODE_URL;
  }

  if (originStore === 'Star Tech' || trimmed.includes('startech.com.bd')) {
    if (trimmed.includes('tracking=')) return trimmed;
    const sep = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${sep}tracking=${STARTECH_TRACKING}`;
  }
  if (originStore === 'BanglaShoppers' || trimmed.includes('banglashoppers.com')) {
    return trimmed.includes('/r/4ehxtB1p') ? trimmed : BANGLASHOPPERS_URL;
  }
  if (originStore === 'Illin BD' || trimmed.includes('illin.com.bd')) {
    return trimmed.includes('/40989') ? trimmed : ILLIN_URL;
  }
  if (originStore === 'Sohoj Affiliates' || trimmed.includes('sohojaffiliates.com')) {
    return trimmed.includes('/reffer/40989') ? trimmed : SOHOJ_URL;
  }
  if (originStore === 'Alibaba' || trimmed.includes('pm1aev55clcb5002cfdd219aa26f6f')) {
    return trimmed.includes('rzekl.com/') ? trimmed : ALIBABA_URL;
  }
  if (originStore === 'Releva BD' || trimmed.includes('releva.com.bd')) {
    return normalizeRelevaAffiliateUrl(trimmed);
  }
  if (originStore === 'ExonHost' || trimmed.includes('exonhost.com')) {
    return trimmed.includes('aff=') ? trimmed : 'https://my.exonhost.com/affiliate?aff=5993';
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
    return AMAZON_SHORT_URL;
  }
  if (trimmed.includes('amazon.com')) {
    try {
      const u = new URL(trimmed);
      u.searchParams.set('tag', 'mrxshahin06-20');
      u.searchParams.set('linkCode', 'll2');
      u.searchParams.set('linkId', 'f69ce6631cea5fb5a49ce7ba4d3968b6');
      return u.toString();
    } catch {
      const sep = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${sep}tag=mrxshahin06-20&linkCode=ll2&linkId=f69ce6631cea5fb5a49ce7ba4d3968b6`;
    }
  }
  return trimmed;
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
  'Cloud Hosting & Domains'
]);

function normalizeStorefront(raw?: Partial<StorefrontConfig> | null): StorefrontConfig {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    siteName:
      typeof src.siteName === 'string' && src.siteName.trim()
        ? src.siteName.trim()
        : DEFAULT_STOREFRONT.siteName,
    announcementText:
      typeof src.announcementText === 'string' && src.announcementText.trim()
        ? src.announcementText.trim()
        : DEFAULT_STOREFRONT.announcementText,
    heroTitle:
      typeof src.heroTitle === 'string' && src.heroTitle.trim()
        ? src.heroTitle.trim()
        : DEFAULT_STOREFRONT.heroTitle,
    heroSubtitle:
      typeof src.heroSubtitle === 'string' && src.heroSubtitle.trim()
        ? src.heroSubtitle.trim()
        : DEFAULT_STOREFRONT.heroSubtitle,
    storeTitle:
      typeof src.storeTitle === 'string' && src.storeTitle.trim()
        ? src.storeTitle.trim()
        : DEFAULT_STOREFRONT.storeTitle,
    storeSubtitle:
      typeof src.storeSubtitle === 'string' && src.storeSubtitle.trim()
        ? src.storeSubtitle.trim()
        : DEFAULT_STOREFRONT.storeSubtitle,
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
          : rawProd.originStore === 'Alibaba'
          ? 'Alibaba'
          : 'Amazon';
      const category = VALID_CATEGORIES.has(rawProd.category as CustomStoreProduct['category'])
        ? (rawProd.category as CustomStoreProduct['category'])
        : originStore === 'ExonHost'
        ? 'Cloud Hosting & Domains'
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
        affiliateUrl: sanitizePartnerUrl(rawProd.affiliateUrl || '', originStore, rawProd.asin),
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
