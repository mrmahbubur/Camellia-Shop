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

function pickValidatedAliExpressUrl(candidate: unknown, fallback: string): string {
  return isApprovedAliExpressUrl(candidate) ? candidate.trim() : fallback;
}

function parseBooleanFlag(raw: unknown, fallback: boolean): boolean {
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase();
    if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
  }
  return fallback;
}

export function resolveAliExpressAffiliateConfig(
  env: Record<string, string | undefined> = process.env,
  dynamicOverride?: AliExpressAffiliateOverride | null
): AliExpressAffiliateConfig {
  const overrideCats = dynamicOverride?.categories;

  const baseJewelry = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_JEWELRY_URL,
    ALIEXPRESS_JEWELRY_URL
  );
  const baseBeauty = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_BEAUTY_URL,
    ALIEXPRESS_BEAUTY_URL
  );
  const baseToys = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_TOYS_URL,
    ALIEXPRESS_TOYS_URL
  );
  const baseWomensClothing = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_WOMENS_CLOTHING_URL,
    ALIEXPRESS_WOMENS_CLOTHING_URL
  );

  const basePortalUrl = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_PORTAL_URL || env.ALIEXPRESS_AFFILIATE_URL,
    ALIEXPRESS_AFFILIATE_URL || baseJewelry
  );
  const baseEventUrl = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_EVENT_URL,
    ALIEXPRESS_EVENT_PRIMARY_URL
  );
  const baseSquareEventUrl = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_SQUARE_EVENT_URL,
    ALIEXPRESS_EVENT_SQUARE_URL
  );

  const enabledFromEnv = parseBooleanFlag(env.ALIEXPRESS_ENABLED, true);
  const enabled =
    typeof dynamicOverride?.enabled === 'boolean' ? dynamicOverride.enabled : enabledFromEnv;

  const jewelry = pickValidatedAliExpressUrl(overrideCats?.jewelry, baseJewelry);
  const beauty = pickValidatedAliExpressUrl(overrideCats?.beauty, baseBeauty);
  const toys = pickValidatedAliExpressUrl(overrideCats?.toys, baseToys);
  const womensClothing = pickValidatedAliExpressUrl(
    overrideCats?.womensClothing,
    baseWomensClothing
  );

  const portalUrl = pickValidatedAliExpressUrl(dynamicOverride?.portalUrl, basePortalUrl);
  const eventUrl = pickValidatedAliExpressUrl(dynamicOverride?.eventUrl, baseEventUrl);
  const squareEventUrl = pickValidatedAliExpressUrl(
    dynamicOverride?.squareEventUrl,
    baseSquareEventUrl
  );

  return {
    partner: 'AliExpress',
    enabled,
    portalUrl,
    eventUrl,
    squareEventUrl,
    allowedHosts: [...ALLOWED_ALIEXPRESS_HOSTS],
    categories: {
      jewelry,
      beauty,
      toys,
      womensClothing
    }
  };
}

export function resolveStorefrontAffiliateConfig(
  dynamicOverride?: StorefrontAffiliateOverride | null,
  env: Record<string, string | undefined> = process.env
): StorefrontAffiliateConfig {
  const aliexpress = resolveAliExpressAffiliateConfig(env, dynamicOverride?.aliexpress);
  const rawAmazon = dynamicOverride?.amazon;

  const associateTag =
    typeof rawAmazon?.associateTag === 'string' && /^[a-zA-Z0-9_-]{3,40}$/.test(rawAmazon.associateTag.trim())
      ? rawAmazon.associateTag.trim()
      : AMAZON_ASSOCIATE_TAG;
  const linkId =
    typeof rawAmazon?.linkId === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(rawAmazon.linkId.trim())
      ? rawAmazon.linkId.trim()
      : AMAZON_LINK_ID;
  const storeUrl =
    typeof rawAmazon?.storeUrl === 'string' &&
    rawAmazon.storeUrl.trim().startsWith('https://www.amazon.') &&
    !isBlockedAffiliateUrl(rawAmazon.storeUrl)
      ? rawAmazon.storeUrl.trim()
      : AMAZON_STORE_URL;
  const shortUrl =
    typeof rawAmazon?.shortUrl === 'string' &&
    /^https:\/\/(link\.amazon|amzn\.to)\//.test(rawAmazon.shortUrl.trim()) &&
    !isBlockedAffiliateUrl(rawAmazon.shortUrl)
      ? rawAmazon.shortUrl.trim()
      : AMAZON_LINK_SHORT;

  return {
    aliexpress,
    amazon: {
      associateTag,
      linkId,
      storeUrl,
      shortUrl
    }
  };
}

export function sanitizeAliExpressAffiliateUrl(
  rawUrl: string,
  fallbackCategory?: keyof AliExpressAffiliateCategories,
  env: Record<string, string | undefined> = process.env,
  dynamicOverride?: AliExpressAffiliateOverride | null
): string {
  const config = resolveAliExpressAffiliateConfig(env, dynamicOverride);
  const fallback =
    (fallbackCategory && config.categories[fallbackCategory]) || config.portalUrl;

  if (isApprovedAliExpressUrl(rawUrl)) {
    return rawUrl.trim();
  }
  return fallback;
}
