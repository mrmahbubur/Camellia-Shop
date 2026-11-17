import { GoogleGenAI, Type } from '@google/genai';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface CustomStoreProduct {
  id: string;
  title: string;
  asin?: string;
  brand: string;
  category:
    | 'Electronics & Gadgets'
    | 'Computers & Accessories'
    | 'Audio & Headphones'
    | 'Smart Home & Power'
    | 'Wearables & Smartwatches'
    | 'Office & Workspace'
    | 'Shopz BD Tech Deals';
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
  originStore: 'Amazon' | 'Shopz BD' | 'ExonHost';
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
  announcementText: 'Camellia Shop · Curated Amazon Prime & Shopz BD Hardware',
  heroTitle: 'Curated Workspace Electronics, Desk Hardware & Direct Checkout.',
  heroSubtitle:
    'Shop curated computer peripherals, GaN chargers, studio audio gear, monitors, and desk accessories with live multi-currency pricing and direct Amazon and Shopz BD product links.',
  storeTitle: 'Shop Prime Gear & Shopz BD Electronics',
  storeSubtitle:
    'Curated hardware across Amazon and Shopz BD. Every purchase completes directly on the official retailer store with manufacturer warranties and buyer protection.',
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
  'blogspot.com'
];

function isBlockedUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return BLOCKED_AD_DOMAINS.some((d) => lower.includes(d));
}

function sanitizePartnerUrl(rawUrl: string, originStore: 'Amazon' | 'Shopz BD' | 'ExonHost'): string {
  const trimmed = rawUrl.trim();
  if (!trimmed || isBlockedUrl(trimmed)) {
    if (originStore === 'ExonHost') {
      return 'https://my.exonhost.com/affiliate?aff=5993';
    }
    return originStore === 'Shopz BD'
      ? 'https://www.shopz.com.bd/?ref=mahbubur-rahman-shahin'
      : 'https://www.amazon.com/gp/yourstore?shopForFallback=1&linkCode=ll2&tag=mrxshahin1-20&linkId=b0640e715d1eb5bbcc6b9a28347ac557&language=en_US&ref_=as_li_ss_tl';
  }
  if (originStore === 'ExonHost' || trimmed.includes('exonhost.com')) {
    if (trimmed.includes('aff=')) return trimmed;
    return 'https://my.exonhost.com/affiliate?aff=5993';
  }
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
      const u = new URL(trimmed);
      u.searchParams.set('tag', 'mrxshahin1-20');
      u.searchParams.set('linkCode', 'll2');
      u.searchParams.set('linkId', 'b0640e715d1eb5bbcc6b9a28347ac557');
      return u.toString();
    } catch {
      const sep = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${sep}tag=mrxshahin1-20&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;
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
  'Cloud Hosting & Domains'
]);

function normalizeStorefront(raw?: Partial<StorefrontConfig> | null): StorefrontConfig {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    siteName: typeof src.siteName === 'string' && src.siteName.trim() ? src.siteName.trim() : DEFAULT_STOREFRONT.siteName,
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
      ? Array.from(new Set(src.hiddenProductIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)))
      : [],
    featuredProductIds: Array.isArray(src.featuredProductIds)
      ? Array.from(new Set(src.featuredProductIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)))
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

async function callGeminiWithRetry(instruction: string, current: StorefrontConfig): Promise<ControlPatch> {
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
            'You are the silent backend storefront operations engine for Camellia Shop, a pure e-commerce electronics and workspace hardware store.',
            'Given an operator instruction and the currentStorefront JSON state, return a minimal JSON patch object describing the exact updates to apply.',
            'Rules:',
            '1. Never mention AI, models, automation, prompts, or system internals in any storefront copy (siteName, announcementText, heroTitle, heroSubtitle, storeTitle, storeSubtitle, product descriptions, or badges).',
            '2. Keep everything strictly e-commerce focused.',
            '3. Preserve approved sponsor links (https://uplcm.com/4/...) and partner store checkout URLs; never add unrelated ad network links.',
            '4. Preserve existing fields unless the instruction requests modifying them; omit unchanged optional fields.',
            '5. Keep copy crisp, natural, and concise.'
          ].join(' '),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Short operator-facing summary of changes applied.'
              },
              siteName: { type: Type.STRING },
              announcementText: { type: Type.STRING },
              heroTitle: { type: Type.STRING },
              heroSubtitle: { type: Type.STRING },
              storeTitle: { type: Type.STRING },
              storeSubtitle: { type: Type.STRING },
              hideProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              unhideProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              featuredProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              removeCustomProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              removeSponsorIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
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
                    highlights: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
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
      new Set(patch.featuredProductIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0))
    );
  }

  if (Array.isArray(patch.priceOverrides)) {
    for (const ov of patch.priceOverrides) {
      if (!ov?.productId) continue;
      const cleanOv: PriceOverride = {};
      if (typeof ov.price === 'number' && Number.isFinite(ov.price) && ov.price >= 0) {
        cleanOv.price = Number(ov.price.toFixed(2));
      }
      if (typeof ov.originalPrice === 'number' && Number.isFinite(ov.originalPrice) && ov.originalPrice > 0) {
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
      const originStore: 'Amazon' | 'Shopz BD' | 'ExonHost' =
        rawProd.originStore === 'Shopz BD'
          ? 'Shopz BD'
          : rawProd.originStore === 'ExonHost'
          ? 'ExonHost'
          : 'Amazon';
      const category = VALID_CATEGORIES.has(rawProd.category as CustomStoreProduct['category'])
        ? (rawProd.category as CustomStoreProduct['category'])
        : originStore === 'ExonHost'
        ? 'Cloud Hosting & Domains'
        : originStore === 'Shopz BD'
        ? 'Shopz BD Tech Deals'
        : 'Electronics & Gadgets';
      const safeImage =
        typeof rawProd.mainImage === 'string' && rawProd.mainImage.trim() && !isBlockedUrl(rawProd.mainImage)
          ? rawProd.mainImage.trim()
          : '';
      const safeProd: CustomStoreProduct = {
        id: rawProd.id.trim(),
        title: rawProd.title.trim(),
        asin: typeof rawProd.asin === 'string' && rawProd.asin.trim() ? rawProd.asin.trim() : undefined,
        brand: (rawProd.brand || 'Camellia Pick').trim(),
        category,
        department: (rawProd.department || category).trim(),
        price: typeof rawProd.price === 'number' && Number.isFinite(rawProd.price) && rawProd.price >= 0 ? Number(rawProd.price.toFixed(2)) : 0,
        originalPrice:
          typeof rawProd.originalPrice === 'number' && Number.isFinite(rawProd.originalPrice) && rawProd.originalPrice > 0
            ? Number(rawProd.originalPrice.toFixed(2))
            : undefined,
        badge: typeof rawProd.badge === 'string' && rawProd.badge.trim() ? rawProd.badge.trim() : undefined,
        primeEligible: Boolean(rawProd.primeEligible),
        deliveryEstimate:
          (
            rawProd.deliveryEstimate ||
            (originStore === 'ExonHost'
              ? 'Instant Cloud Provisioning'
              : originStore === 'Shopz BD'
              ? 'Fulfilled by Shopz BD Courier'
              : 'Fulfilled by Amazon')
          ).trim(),
        affiliateUrl: sanitizePartnerUrl(rawProd.affiliateUrl || '', originStore),
        mainImage: safeImage,
        galleryImages: safeImage ? [safeImage] : [],
        description: (rawProd.description || rawProd.title).trim(),
        highlights: Array.isArray(rawProd.highlights)
          ? rawProd.highlights.filter((h): h is string => typeof h === 'string' && h.trim().length > 0)
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
        category: (rawSp.category || 'Partner Offer').trim(),
        group,
        ctaLabel: (rawSp.ctaLabel || 'Explore Offer').trim(),
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
    summary: typeof patch.summary === 'string' && patch.summary.trim() ? patch.summary.trim() : 'Storefront updated.'
  };
}
