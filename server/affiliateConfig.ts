import {
  ALIEXPRESS_AFFILIATE_URL,
  ALIEXPRESS_BEAUTY_URL,
  ALIEXPRESS_JEWELRY_URL,
  ALIEXPRESS_TOYS_URL,
  ALIEXPRESS_WOMENS_CLOTHING_URL
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

export function resolveAliExpressAffiliateConfig(
  env: Record<string, string | undefined> = process.env
): AliExpressAffiliateConfig {
  const jewelry = pickValidatedAliExpressUrl(env.ALIEXPRESS_JEWELRY_URL, ALIEXPRESS_JEWELRY_URL);
  const beauty = pickValidatedAliExpressUrl(env.ALIEXPRESS_BEAUTY_URL, ALIEXPRESS_BEAUTY_URL);
  const toys = pickValidatedAliExpressUrl(env.ALIEXPRESS_TOYS_URL, ALIEXPRESS_TOYS_URL);
  const womensClothing = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_WOMENS_CLOTHING_URL,
    ALIEXPRESS_WOMENS_CLOTHING_URL
  );

  const portalUrl = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_PORTAL_URL || env.ALIEXPRESS_AFFILIATE_URL,
    ALIEXPRESS_AFFILIATE_URL || jewelry
  );
  const eventUrl = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_EVENT_URL,
    ALIEXPRESS_EVENT_PRIMARY_URL
  );
  const squareEventUrl = pickValidatedAliExpressUrl(
    env.ALIEXPRESS_SQUARE_EVENT_URL,
    ALIEXPRESS_EVENT_SQUARE_URL
  );

  return {
    partner: 'AliExpress',
    enabled: true,
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

export function sanitizeAliExpressAffiliateUrl(
  rawUrl: string,
  fallbackCategory?: keyof AliExpressAffiliateCategories,
  env: Record<string, string | undefined> = process.env
): string {
  const config = resolveAliExpressAffiliateConfig(env);
  const fallback =
    (fallbackCategory && config.categories[fallbackCategory]) || config.portalUrl;

  if (isApprovedAliExpressUrl(rawUrl)) {
    return rawUrl.trim();
  }
  return fallback;
}
