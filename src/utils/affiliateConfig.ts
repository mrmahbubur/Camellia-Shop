import {
  ALIEXPRESS_AFFILIATE_URL,
  ALIEXPRESS_BEAUTY_URL,
  ALIEXPRESS_JEWELRY_URL,
  ALIEXPRESS_TOYS_URL,
  ALIEXPRESS_WOMENS_CLOTHING_URL,
  AMAZON_ASSOCIATE_TAG,
  AMAZON_LINK_ID,
  AMAZON_LINK_SHORT,
  AMAZON_STORE_URL,
  BANGLASHOPPERS_AFFILIATE_URL,
  EXONHOST_AFFILIATE_URL,
  ILLIN_AFFILIATE_URL,
  RELEVA_HOME_URL,
  SHOPZ_REF_BASE,
  SOHOJ_AFFILIATE_URL,
  STARTECH_AFFILIATE_URL,
  STARTECH_TRACKING_PARAM,
  normalizeRelevaAffiliateUrl
} from '../data/catalogRecords.ts';
import {
  ALIEXPRESS_EVENT_PRIMARY_URL,
  ALIEXPRESS_EVENT_SQUARE_URL
} from './eventPromotionsCsv.ts';
import type { PartnerStoreOrigin } from './regionProfile.ts';

export interface AliExpressAffiliateCategories {
  jewelry: string;
  beauty: string;
  toys: string;
  womensClothing: string;
}

export interface AliExpressAffiliateConfig {
  partner: 'AliExpress';
  enabled: boolean;
  portalUrl: string;
  eventUrl: string;
  squareEventUrl: string;
  allowedHosts: string[];
  categories: AliExpressAffiliateCategories;
}

export interface AmazonAffiliateConfig {
  associateTag: string;
  linkId: string;
  storeUrl: string;
  shortUrl: string;
}

export interface StorefrontAffiliateConfig {
  aliexpress: AliExpressAffiliateConfig;
  amazon: AmazonAffiliateConfig;
}

export interface AliExpressAffiliateOverride {
  enabled?: boolean;
  portalUrl?: string;
  eventUrl?: string;
  squareEventUrl?: string;
  categories?: Partial<AliExpressAffiliateCategories>;
}

export interface StorefrontAffiliateOverride {
  aliexpress?: AliExpressAffiliateOverride;
  amazon?: Partial<AmazonAffiliateConfig>;
}

const ALLOWED_ALIEXPRESS_HOSTS = [
  's.click.aliexpress.com',
  'www.aliexpress.com',
  'aliexpress.com',
  'm.aliexpress.com',
  'www.aliexpress.us',
  'aliexpress.us'
];

const BLOCKED_AFFILIATE_FRAGMENTS = [
  'fabrilife.com',
  'rzekl.com',
  'admitad.com',
  'alitems.com',
  'wextap.com',
  'profitableratecpmnetwork',
  'adsterra',
  'quge5',
  'blogspot.com'
];

export const DEFAULT_STOREFRONT_AFFILIATE_CONFIG: StorefrontAffiliateConfig = {
  aliexpress: {
    partner: 'AliExpress',
    enabled: true,
    portalUrl: ALIEXPRESS_AFFILIATE_URL || ALIEXPRESS_JEWELRY_URL,
    eventUrl: ALIEXPRESS_EVENT_PRIMARY_URL,
    squareEventUrl: ALIEXPRESS_EVENT_SQUARE_URL,
    allowedHosts: [...ALLOWED_ALIEXPRESS_HOSTS],
    categories: {
      jewelry: ALIEXPRESS_JEWELRY_URL,
      beauty: ALIEXPRESS_BEAUTY_URL,
      toys: ALIEXPRESS_TOYS_URL,
      womensClothing: ALIEXPRESS_WOMENS_CLOTHING_URL
    }
  },
  amazon: {
    associateTag: AMAZON_ASSOCIATE_TAG,
    linkId: AMAZON_LINK_ID,
    storeUrl: AMAZON_STORE_URL,
    shortUrl: AMAZON_LINK_SHORT
  }
};

export function isBlockedAffiliateUrl(rawUrl: string): boolean {
  const lower = rawUrl.trim().toLowerCase();
  return BLOCKED_AFFILIATE_FRAGMENTS.some((fragment) => lower.includes(fragment));
}

export function isApprovedAliExpressUrl(rawUrl: unknown): rawUrl is string {
  if (typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed || !trimmed.startsWith('https://') || isBlockedAffiliateUrl(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_ALIEXPRESS_HOSTS.includes(host);
  } catch {
    return false;
  }
}

export function isApprovedAmazonUrl(rawUrl: unknown): rawUrl is string {
  if (typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed || !trimmed.startsWith('https://') || isBlockedAffiliateUrl(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'amazon.com' ||
      host.endsWith('.amazon.com') ||
      host === 'link.amazon' ||
      host === 'amzn.to'
    );
  } catch {
    return false;
  }
}

function pickValidatedAliExpressUrl(candidate: unknown, fallback: string): string {
  return isApprovedAliExpressUrl(candidate) ? candidate.trim() : fallback;
}

export function resolveAliExpressAffiliateConfig(
  storefrontOverride?: AliExpressAffiliateOverride | null
): AliExpressAffiliateConfig {
  const defaults = DEFAULT_STOREFRONT_AFFILIATE_CONFIG.aliexpress;
  const overrideCats = storefrontOverride?.categories;

  return {
    partner: 'AliExpress',
    enabled:
      typeof storefrontOverride?.enabled === 'boolean'
        ? storefrontOverride.enabled
        : defaults.enabled,
    portalUrl: pickValidatedAliExpressUrl(storefrontOverride?.portalUrl, defaults.portalUrl),
    eventUrl: pickValidatedAliExpressUrl(storefrontOverride?.eventUrl, defaults.eventUrl),
    squareEventUrl: pickValidatedAliExpressUrl(
      storefrontOverride?.squareEventUrl,
      defaults.squareEventUrl
    ),
    allowedHosts: [...ALLOWED_ALIEXPRESS_HOSTS],
    categories: {
      jewelry: pickValidatedAliExpressUrl(overrideCats?.jewelry, defaults.categories.jewelry),
      beauty: pickValidatedAliExpressUrl(overrideCats?.beauty, defaults.categories.beauty),
      toys: pickValidatedAliExpressUrl(overrideCats?.toys, defaults.categories.toys),
      womensClothing: pickValidatedAliExpressUrl(
        overrideCats?.womensClothing,
        defaults.categories.womensClothing
      )
    }
  };
}

export function resolveAmazonAffiliateConfig(
  storefrontOverride?: Partial<AmazonAffiliateConfig> | null
): AmazonAffiliateConfig {
  const defaults = DEFAULT_STOREFRONT_AFFILIATE_CONFIG.amazon;
  const associateTag =
    typeof storefrontOverride?.associateTag === 'string' &&
    /^[a-zA-Z0-9_-]{3,40}$/.test(storefrontOverride.associateTag.trim())
      ? storefrontOverride.associateTag.trim()
      : defaults.associateTag;
  const linkId =
    typeof storefrontOverride?.linkId === 'string' &&
    /^[a-zA-Z0-9_-]{8,64}$/.test(storefrontOverride.linkId.trim())
      ? storefrontOverride.linkId.trim()
      : defaults.linkId;
  const storeUrl = isApprovedAmazonUrl(storefrontOverride?.storeUrl)
    ? storefrontOverride.storeUrl.trim()
    : defaults.storeUrl;
  const shortUrl =
    typeof storefrontOverride?.shortUrl === 'string' &&
    /^https:\/\/(link\.amazon|amzn\.to)\//.test(storefrontOverride.shortUrl.trim()) &&
    !isBlockedAffiliateUrl(storefrontOverride.shortUrl)
      ? storefrontOverride.shortUrl.trim()
      : defaults.shortUrl;

  return {
    associateTag,
    linkId,
    storeUrl,
    shortUrl
  };
}

export function resolveStorefrontAffiliateConfig(
  storefrontOverride?: StorefrontAffiliateOverride | null
): StorefrontAffiliateConfig {
  return {
    aliexpress: resolveAliExpressAffiliateConfig(storefrontOverride?.aliexpress),
    amazon: resolveAmazonAffiliateConfig(storefrontOverride?.amazon)
  };
}

export function resolveAliExpressCategoryKeyForId(
  productId?: string
): keyof AliExpressAffiliateCategories | undefined {
  switch (productId) {
    case 'aliexpress-jewelry-accessories':
      return 'jewelry';
    case 'aliexpress-beauty-health':
      return 'beauty';
    case 'aliexpress-toys-games':
      return 'toys';
    case 'aliexpress-womens-clothing':
      return 'womensClothing';
    default:
      return undefined;
  }
}

export function sanitizeAliExpressAffiliateUrl(
  rawUrl: string,
  fallbackCategory?: keyof AliExpressAffiliateCategories,
  storefrontOverride?: AliExpressAffiliateOverride | null
): string {
  const config = resolveAliExpressAffiliateConfig(storefrontOverride);
  const categoryFallback = fallbackCategory ? config.categories[fallbackCategory] : undefined;

  if (categoryFallback && fallbackCategory) {
    const defaultCategoryUrl = DEFAULT_STOREFRONT_AFFILIATE_CONFIG.aliexpress.categories[fallbackCategory];
    if (!rawUrl.trim() || rawUrl.trim() === defaultCategoryUrl || isBlockedAffiliateUrl(rawUrl)) {
      return categoryFallback;
    }
  }

  if (isApprovedAliExpressUrl(rawUrl)) {
    return rawUrl.trim();
  }
  return categoryFallback || config.portalUrl;
}

export function sanitizeAmazonAffiliateUrl(
  rawUrl: string,
  asin?: string,
  amazonOverride?: Partial<AmazonAffiliateConfig> | null
): string {
  const amazon = resolveAmazonAffiliateConfig(amazonOverride);
  const trimmed = rawUrl.trim();

  if (!trimmed || isBlockedAffiliateUrl(trimmed)) {
    if (asin && /^[A-Z0-9]{10}$/.test(asin.trim())) {
      return `https://www.amazon.com/dp/${asin.trim()}?tag=${encodeURIComponent(amazon.associateTag)}&linkCode=ll2&linkId=${encodeURIComponent(amazon.linkId)}`;
    }
    return amazon.storeUrl;
  }

  if (trimmed.includes('link.amazon/B0io1BQfg') || /^https:\/\/amzn\.to\//.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.includes('link.amazon')) {
    return amazon.shortUrl;
  }
  if (isApprovedAmazonUrl(trimmed)) {
    try {
      const url = new URL(trimmed);
      url.searchParams.set('tag', amazon.associateTag);
      url.searchParams.set('linkCode', 'll2');
      url.searchParams.set('linkId', amazon.linkId);
      return url.toString();
    } catch {
      const sep = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${sep}tag=${encodeURIComponent(amazon.associateTag)}&linkCode=ll2&linkId=${encodeURIComponent(amazon.linkId)}`;
    }
  }
  if (asin && /^[A-Z0-9]{10}$/.test(asin.trim())) {
    return `https://www.amazon.com/dp/${asin.trim()}?tag=${encodeURIComponent(amazon.associateTag)}&linkCode=ll2&linkId=${encodeURIComponent(amazon.linkId)}`;
  }
  return amazon.storeUrl;
}

export function buildAmazonSearchUrl(
  query: string,
  amazonOverride?: Partial<AmazonAffiliateConfig> | null
): string {
  const amazon = resolveAmazonAffiliateConfig(amazonOverride);
  const clean = query.trim();
  if (!clean) return amazon.storeUrl;
  return `https://www.amazon.com/s?k=${encodeURIComponent(clean)}&tag=${encodeURIComponent(amazon.associateTag)}&linkCode=ll2&linkId=${encodeURIComponent(amazon.linkId)}`;
}

export function buildShopzSearchUrl(query: string): string {
  const clean = query.trim();
  if (!clean) return SHOPZ_REF_BASE;
  return `https://www.shopz.com.bd/?s=${encodeURIComponent(clean)}&post_type=product&ref=mahbubur-rahman-shahin`;
}

export function buildRelevaSearchUrl(query: string): string {
  const clean = query.trim();
  if (!clean) return RELEVA_HOME_URL;
  return `https://releva.com.bd/index.php?route=product/search&search=${encodeURIComponent(clean)}`;
}

export interface ResolvePartnerProductUrlParams {
  rawUrl: string;
  originStore: PartnerStoreOrigin;
  asin?: string;
  productId?: string;
  urlKind?: 'product' | 'portal' | 'category';
  affiliateConfig?: StorefrontAffiliateOverride | null;
}

export function resolvePartnerProductUrl({
  rawUrl,
  originStore,
  asin,
  productId,
  urlKind,
  affiliateConfig
}: ResolvePartnerProductUrlParams): string {
  const resolvedAffiliate = resolveStorefrontAffiliateConfig(affiliateConfig);
  const trimmed = rawUrl.trim();
  const aliCategoryKey = resolveAliExpressCategoryKeyForId(productId);

  if (!trimmed || isBlockedAffiliateUrl(trimmed)) {
    if (originStore === 'ExonHost') return EXONHOST_AFFILIATE_URL;
    if (originStore === 'AliExpress') {
      return (
        (aliCategoryKey && resolvedAffiliate.aliexpress.categories[aliCategoryKey]) ||
        resolvedAffiliate.aliexpress.portalUrl
      );
    }
    if (originStore === 'BanglaShoppers') return BANGLASHOPPERS_AFFILIATE_URL;
    if (originStore === 'Illin BD') return ILLIN_AFFILIATE_URL;
    if (originStore === 'Sohoj Affiliates') return SOHOJ_AFFILIATE_URL;
    if (originStore === 'Star Tech') return STARTECH_AFFILIATE_URL;
    if (originStore === 'Releva BD') {
      return normalizeRelevaAffiliateUrl('', urlKind);
    }
    if (originStore === 'Shopz BD') return SHOPZ_REF_BASE;
    return sanitizeAmazonAffiliateUrl('', asin, resolvedAffiliate.amazon);
  }

  if (
    originStore === 'AliExpress' ||
    trimmed.includes('s.click.aliexpress.com') ||
    trimmed.includes('aliexpress.com')
  ) {
    return sanitizeAliExpressAffiliateUrl(trimmed, aliCategoryKey, resolvedAffiliate.aliexpress);
  }
  if (originStore === 'Star Tech' || trimmed.includes('startech.com.bd')) {
    if (trimmed.includes('tracking=')) return trimmed;
    const sep = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${sep}tracking=${STARTECH_TRACKING_PARAM}`;
  }
  if (originStore === 'BanglaShoppers' || trimmed.includes('banglashoppers.com')) {
    return trimmed.includes('/r/4ehxtB1p') ? trimmed : BANGLASHOPPERS_AFFILIATE_URL;
  }
  if (originStore === 'Illin BD' || trimmed.includes('illin.com.bd')) {
    return trimmed.includes('/40989') ? trimmed : ILLIN_AFFILIATE_URL;
  }
  if (originStore === 'Sohoj Affiliates' || trimmed.includes('sohojaffiliates.com')) {
    if (trimmed.includes('sohojaffiliates.com')) return SOHOJ_AFFILIATE_URL;
    return trimmed.includes('/40989') ? trimmed : SOHOJ_AFFILIATE_URL;
  }
  if (originStore === 'Releva BD' || trimmed.includes('releva.com.bd')) {
    return normalizeRelevaAffiliateUrl(trimmed, urlKind);
  }
  if (originStore === 'ExonHost' || trimmed.includes('exonhost.com')) {
    return trimmed.includes('aff=') ? trimmed : EXONHOST_AFFILIATE_URL;
  }
  if (originStore === 'Shopz BD' || trimmed.includes('shopz.com.bd')) {
    if (trimmed.includes('ref=')) return trimmed;
    const sep = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${sep}ref=mahbubur-rahman-shahin`;
  }
  if (
    originStore === 'Amazon' ||
    trimmed.includes('amazon.') ||
    trimmed.includes('amzn.to')
  ) {
    return sanitizeAmazonAffiliateUrl(trimmed, asin, resolvedAffiliate.amazon);
  }

  return trimmed;
}
