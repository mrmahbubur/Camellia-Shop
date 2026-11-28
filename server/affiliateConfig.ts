import {
  ALIEXPRESS_AFFILIATE_URL,
  ALIEXPRESS_BEAUTY_URL,
  ALIEXPRESS_JEWELRY_URL,
  ALIEXPRESS_TOYS_URL,
  ALIEXPRESS_WOMENS_CLOTHING_URL,
  AMAZON_ASSOCIATE_TAG,
  AMAZON_LINK_ID,
  AMAZON_LINK_SHORT,
  AMAZON_STORE_URL
} from '../src/data/catalogRecords.ts';
import {
  ALIEXPRESS_EVENT_PRIMARY_URL,
  ALIEXPRESS_EVENT_SQUARE_URL
} from '../src/utils/eventPromotionsCsv.ts';

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

export function sanitizeAliExpressAffiliateUrl(
  rawUrl: string,
  fallbackCategory?: keyof AliExpressAffiliateCategories,
  storefrontOverride?: AliExpressAffiliateOverride | null
): string {
  const config = resolveAliExpressAffiliateConfig(storefrontOverride);
  const fallback =
    (fallbackCategory && config.categories[fallbackCategory]) || config.portalUrl;

  if (isApprovedAliExpressUrl(rawUrl)) {
    return rawUrl.trim();
  }
  return fallback;
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

  if (/^https:\/\/(link\.amazon|amzn\.to)\//.test(trimmed)) {
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
