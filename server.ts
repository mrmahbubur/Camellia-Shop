import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import dotenv from 'dotenv';
import {
  DEFAULT_STOREFRONT,
  type StorefrontConfig,
  sanitizeStorefrontConfig,
  executeBackendSiteControl
} from './server/siteController.ts';
import {
  resolveStorefrontAffiliateConfig,
  sanitizeAmazonAffiliateUrl
} from './server/affiliateConfig.ts';
import {
  BANGLASHOPPERS_AFFILIATE_URL,
  CURATED_CATALOG_RECORDS,
  EXONHOST_AFFILIATE_URL,
  ILLIN_AFFILIATE_URL,
  RELEVA_HOME_URL,
  SHOPZ_REF_BASE,
  SOHOJ_AFFILIATE_URL,
  STARTECH_AFFILIATE_URL,
  parseShopzCsvRecords,
  type CatalogRecord
} from './src/data/catalogRecords.ts';
import {
  DEFAULT_ALIEXPRESS_EVENT_PROMOS,
  parseEventPromotionCsv,
  type EventPromoCreative
} from './src/utils/eventPromotionsCsv.ts';
import {
  REGION_ORDER,
  REGION_PROFILES,
  type CurrencyCode,
  type PartnerStoreOrigin,
  type VisitorRegionCode
} from './src/utils/regionProfile.ts';
import {
  BUYING_NEED_META,
  computeRecommendations,
  type BuyingNeed,
  type InteractionSignals
} from './src/utils/recommendations.ts';
import {
  buildRobotsTxt,
  buildSitemapXml,
  injectSeoMetadataIntoHtml,
  resolveRequestOrigin
} from './src/utils/seoSchema.ts';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const ROOT_DIR = process.cwd();
const WORKSPACE_DATA_DIR = path.join(ROOT_DIR, 'data');
const TMP_DATA_DIR = path.join(os.tmpdir(), 'camellia-shop-data');
const SHOPZ_CSV_FILE = path.join(
  ROOT_DIR,
  'public',
  'assets',
  'aistudio',
  'my-affiliate-links-mahbubur-rahman-shahin_937a8a27.csv'
);
const EVENT_PROMOS_CSV_FILE = path.join(
  ROOT_DIR,
  'public',
  'assets',
  'aistudio',
  'event_promotion_830ab32c.csv'
);

interface AnonymousProfileRecord extends InteractionSignals {
  updatedAt: string;
}

interface StoreDb {
  clicks: Record<string, number>;
  profiles: Record<string, AnonymousProfileRecord>;
  storefront: StorefrontConfig;
}

const DEFAULT_DB: StoreDb = {
  clicks: {},
  profiles: {},
  storefront: DEFAULT_STOREFRONT
};

const MAX_STORED_PROFILES = 200;
const MAX_RECENT_PRODUCTS = 25;

let activeDbFile: string | null = null;
let memoryDb: StoreDb = {
  clicks: {},
  profiles: {},
  storefront: DEFAULT_STOREFRONT
};
let dbWriteQueue: Promise<void> = Promise.resolve();

function sanitizeCounterMap(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const cleanKey = k.trim().slice(0, 64);
    if (cleanKey && typeof v === 'number' && Number.isFinite(v) && v >= 0) {
      out[cleanKey] = Math.min(10000, Math.floor(v));
    }
  }
  return out;
}

function sanitizeProfiles(raw: unknown): Record<string, AnonymousProfileRecord> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: Record<string, AnonymousProfileRecord> = {};
  const entries = Object.entries(raw as Record<string, unknown>).slice(0, MAX_STORED_PROFILES);
  for (const [sessionId, value] of entries) {
    if (!/^[a-zA-Z0-9_-]{8,64}$/.test(sessionId)) continue;
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    const obj = value as Partial<AnonymousProfileRecord>;
    out[sessionId] = {
      categoryCounts: sanitizeCounterMap(obj.categoryCounts),
      storeCounts: sanitizeCounterMap(obj.storeCounts),
      recentProductIds: Array.isArray(obj.recentProductIds)
        ? obj.recentProductIds
            .filter((id): id is string => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(id))
            .slice(0, MAX_RECENT_PRODUCTS)
        : [],
      updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : new Date().toISOString()
    };
  }
  return out;
}

async function resolveWritableDbFile(): Promise<string | null> {
  if (activeDbFile) return activeDbFile;
  for (const dir of [WORKSPACE_DATA_DIR, TMP_DATA_DIR]) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const candidate = path.join(dir, 'store.json');
      await fs.access(dir, fs.constants.W_OK);
      activeDbFile = candidate;
      return candidate;
    } catch {
      // Try next directory
    }
  }
  return null;
}

async function ensureDb(): Promise<StoreDb> {
  const dbFile = await resolveWritableDbFile();
  if (!dbFile) return memoryDb;

  try {
    const raw = await fs.readFile(dbFile, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreDb>;
    const loaded: StoreDb = {
      clicks: sanitizeCounterMap(parsed.clicks),
      profiles: sanitizeProfiles(parsed.profiles),
      storefront: sanitizeStorefrontConfig(parsed.storefront)
    };
    memoryDb = loaded;
    return loaded;
  } catch {
    try {
      await fs.writeFile(dbFile, JSON.stringify(memoryDb, null, 2), 'utf-8');
    } catch {
      // Keep in-memory state if write fails
    }
    return memoryDb;
  }
}

function withDbLock<T>(fn: (db: StoreDb) => Promise<{ db: StoreDb; result: T }>): Promise<T> {
  const next = dbWriteQueue.then(async () => {
    const current = await ensureDb();
    const { db: updated, result } = await fn(current);
    memoryDb = updated;
    const dbFile = await resolveWritableDbFile();
    if (dbFile) {
      try {
        await fs.writeFile(dbFile, JSON.stringify(updated, null, 2), 'utf-8');
      } catch {
        // Keep in-memory state updated even if disk write fails
      }
    }
    return result;
  });
  dbWriteQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function isAuthorizedInternalRequest(req: Request): boolean {
  const configuredSecret = process.env.SITE_CONTROL_SECRET?.trim();
  if (configuredSecret) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    return token.length > 0 && token === configuredSecret;
  }

  const remote = req.ip || req.socket.remoteAddress || '';
  return (
    remote === '127.0.0.1' ||
    remote === '::1' ||
    remote === '::ffff:127.0.0.1'
  );
}

// Ephemeral in-memory rate limiting (hashed requester key, never stored on disk or returned)
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX_REQUESTS = Number(process.env.API_RATE_LIMIT_MAX || 120);
const rateSalt = crypto.randomBytes(16).toString('hex');
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimitApi(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();
  const rawAddr = req.ip || req.socket.remoteAddress || 'anon';
  const bucketKey = crypto
    .createHmac('sha256', rateSalt)
    .update(rawAddr)
    .digest('hex')
    .slice(0, 16);

  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets.entries()) {
      if (v.resetAt <= now) rateBuckets.delete(k);
    }
  }

  const existing = rateBuckets.get(bucketKey);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(bucketKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
    next();
    return;
  }

  existing.count += 1;
  if (existing.count > RATE_MAX_REQUESTS) {
    res.setHeader('Retry-After', String(Math.ceil((existing.resetAt - now) / 1000)));
    res.status(429).json({
      error: 'Too many requests. Please retry shortly.'
    });
    return;
  }

  next();
}

// Live FX rates cache (1 hour TTL)
interface RatesCache {
  rates: Record<CurrencyCode, number>;
  updatedAt: string;
  fetchedAtMs: number;
}

const DEFAULT_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  BDT: 121.5,
  INR: 84.5
};

let ratesCache: RatesCache | null = null;
const RATES_TTL_MS = 60 * 60 * 1000;

async function getLiveUsdRates(): Promise<{
  rates: Record<CurrencyCode, number>;
  updatedAt: string;
  live: boolean;
  disclaimer: string;
}> {
  const disclaimer =
    'Converted amounts are approximate estimates. Partners set final live prices, currencies, shipping fees, and taxes.';
  const now = Date.now();
  if (ratesCache && now - ratesCache.fetchedAtMs < RATES_TTL_MS) {
    return {
      rates: ratesCache.rates,
      updatedAt: ratesCache.updatedAt,
      live: true,
      disclaimer
    };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timer);

    if (res.ok) {
      const payload = (await res.json()) as {
        result?: string;
        time_last_update_utc?: string;
        rates?: Record<string, number>;
      };
      if (payload.result === 'success' && payload.rates) {
        const filtered: Record<CurrencyCode, number> = {
          USD: 1,
          EUR: Number(payload.rates.EUR) || DEFAULT_RATES.EUR,
          GBP: Number(payload.rates.GBP) || DEFAULT_RATES.GBP,
          BDT: Number(payload.rates.BDT) || DEFAULT_RATES.BDT,
          INR: Number(payload.rates.INR) || DEFAULT_RATES.INR
        };
        const updatedAt = payload.time_last_update_utc || new Date().toISOString();
        ratesCache = { rates: filtered, updatedAt, fetchedAtMs: now };
        return { rates: filtered, updatedAt, live: true, disclaimer };
      }
    }
  } catch {
    // Fall back cleanly if upstream FX endpoint is unreachable
  }

  if (ratesCache) {
    return {
      rates: ratesCache.rates,
      updatedAt: ratesCache.updatedAt,
      live: true,
      disclaimer
    };
  }

  return {
    rates: DEFAULT_RATES,
    updatedAt: new Date().toISOString(),
    live: false,
    disclaimer
  };
}

// Live Gravatar owner credit cache (1 hour TTL)
interface OwnerCredit {
  displayName: string;
  email: string;
  gravatarUrl: string;
}

let ownerCache: { profile: OwnerCredit; fetchedAtMs: number } | null = null;

const DEFAULT_OWNER_CREDIT: OwnerCredit = {
  displayName: 'M R S',
  email: 'mr216873@gmail.com',
  gravatarUrl: 'https://gravatar.com/mrxshahin'
};

async function getLiveOwnerCredit(): Promise<OwnerCredit> {
  const now = Date.now();
  if (ownerCache && now - ownerCache.fetchedAtMs < RATES_TTL_MS) {
    return ownerCache.profile;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://gravatar.com/mrxshahin.json', {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timer);

    if (res.ok) {
      const json = (await res.json()) as {
        entry?: Array<{
          displayName?: string;
          profileUrl?: string;
          emails?: Array<{ value?: string; primary?: string }>;
        }>;
      };
      const entry = json.entry?.[0];
      if (entry) {
        const primaryEmail =
          entry.emails?.find((e) => e.primary === 'true')?.value ||
          entry.emails?.[0]?.value ||
          DEFAULT_OWNER_CREDIT.email;

        const profile: OwnerCredit = {
          displayName: entry.displayName || DEFAULT_OWNER_CREDIT.displayName,
          email: primaryEmail,
          gravatarUrl: entry.profileUrl || DEFAULT_OWNER_CREDIT.gravatarUrl
        };

        ownerCache = { profile, fetchedAtMs: now };
        return profile;
      }
    }
  } catch {
    // Fallback to verified owner snapshot
  }

  return DEFAULT_OWNER_CREDIT;
}

let cachedCsvRecords: CatalogRecord[] | null = null;
let cachedEventPromos: EventPromoCreative[] | null = null;

async function getFullCatalogRecords(bdtRate = 121.5): Promise<CatalogRecord[]> {
  if (!cachedCsvRecords) {
    try {
      const csvText = await fs.readFile(SHOPZ_CSV_FILE, 'utf-8');
      cachedCsvRecords = parseShopzCsvRecords(csvText, bdtRate);
    } catch {
      cachedCsvRecords = [];
    }
  }

  const existingUrls = new Set(CURATED_CATALOG_RECORDS.map((r) => r.affiliateUrl.toLowerCase()));
  const dedupedCsv = cachedCsvRecords.filter(
    (r) => !existingUrls.has(r.affiliateUrl.toLowerCase())
  );
  return [...CURATED_CATALOG_RECORDS, ...dedupedCsv];
}

async function getEventPromotions(): Promise<EventPromoCreative[]> {
  if (!cachedEventPromos) {
    try {
      const csvText = await fs.readFile(EVENT_PROMOS_CSV_FILE, 'utf-8');
      const parsed = parseEventPromotionCsv(csvText);
      cachedEventPromos = parsed.length > 0 ? parsed : DEFAULT_ALIEXPRESS_EVENT_PROMOS;
    } catch {
      cachedEventPromos = DEFAULT_ALIEXPRESS_EVENT_PROMOS;
    }
  }
  return cachedEventPromos;
}

const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'CH', 'NO', 'IS'
]);

const APAC_COUNTRIES = new Set([
  'SG', 'MY', 'ID', 'TH', 'PH', 'VN', 'JP', 'KR', 'AU', 'NZ', 'TW', 'HK',
  'LK', 'NP', 'PK', 'MV'
]);

const MENA_COUNTRIES = new Set([
  'AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'EG', 'MA', 'JO', 'TN', 'DZ', 'LB', 'TR'
]);

function mapCountryToRegion(cc: string): {
  regionCode: VisitorRegionCode;
  recommendedCurrency: CurrencyCode;
} {
  if (cc === 'BD') return { regionCode: 'BD', recommendedCurrency: 'BDT' };
  if (cc === 'IN') return { regionCode: 'IN', recommendedCurrency: 'INR' };
  if (cc === 'GB' || cc === 'UK') return { regionCode: 'GB', recommendedCurrency: 'GBP' };
  if (EU_COUNTRIES.has(cc)) return { regionCode: 'EU', recommendedCurrency: 'EUR' };
  if (APAC_COUNTRIES.has(cc)) return { regionCode: 'APAC', recommendedCurrency: 'USD' };
  if (MENA_COUNTRIES.has(cc)) return { regionCode: 'MENA', recommendedCurrency: 'USD' };
  if (cc === 'US' || cc === 'CA') return { regionCode: 'US', recommendedCurrency: 'USD' };
  return { regionCode: 'GLOBAL', recommendedCurrency: 'USD' };
}

async function lookupGeoIpCountryIfConfigured(req: Request): Promise<string> {
  const template = process.env.GEOIP_PROVIDER_URL?.trim();
  if (!template) return '';

  const forwardedFor = req.headers['x-forwarded-for'];
  const firstForwarded = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === 'string'
    ? forwardedFor.split(',')[0]?.trim()
    : '';
  const clientIp = firstForwarded || req.ip || req.socket.remoteAddress || '';
  if (
    !clientIp ||
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    clientIp.startsWith('::ffff:127.') ||
    clientIp.startsWith('10.') ||
    clientIp.startsWith('192.168.')
  ) {
    return '';
  }

  try {
    const endpoint = template.includes('{ip}')
      ? template.replace('{ip}', encodeURIComponent(clientIp))
      : `${template}${template.includes('?') ? '&' : '?'}ip=${encodeURIComponent(clientIp)}`;

    const headers: Record<string, string> = { Accept: 'application/json' };
    const apiKey = process.env.GEOIP_API_KEY?.trim();
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(endpoint, { signal: controller.signal, headers });
    clearTimeout(timer);
    if (!res.ok) return '';

    const payload = (await res.json()) as Record<string, unknown>;
    const raw =
      payload.country_code || payload.countryCode || payload.country || payload.isoCode;
    if (typeof raw === 'string') {
      const clean = raw.trim().toUpperCase();
      if (/^[A-Z]{2}$/.test(clean) && clean !== 'XX' && clean !== 'ZZ') {
        return clean;
      }
    }
  } catch {
    // Non-blocking fallback to headers/locale
  }

  return '';
}

async function detectNetworkRegion(req: Request): Promise<{
  regionCode: VisitorRegionCode;
  countryCode: string;
  recommendedCurrency: CurrencyCode;
  source: 'network' | 'geoip' | 'locale' | 'default';
  note: string;
}> {
  const headerCandidates = [
    req.headers['x-appengine-country'],
    req.headers['cf-ipcountry'],
    req.headers['x-vercel-ip-country'],
    req.headers['cloudfront-viewer-country'],
    req.headers['x-geo-country'],
    req.headers['fastly-geo-country']
  ];

  let countryCode = '';
  for (const raw of headerCandidates) {
    const val = Array.isArray(raw) ? raw[0] : raw;
    if (typeof val === 'string') {
      const clean = val.trim().toUpperCase();
      if (/^[A-Z]{2}$/.test(clean) && clean !== 'XX' && clean !== 'T1' && clean !== 'ZZ') {
        countryCode = clean;
        break;
      }
    }
  }

  if (countryCode) {
    return {
      ...mapCountryToRegion(countryCode),
      countryCode,
      source: 'network',
      note: 'Estimated from trusted CDN/hosting country header. Never used for authorization.'
    };
  }

  const geoCountry = await lookupGeoIpCountryIfConfigured(req);
  if (geoCountry) {
    return {
      ...mapCountryToRegion(geoCountry),
      countryCode: geoCountry,
      source: 'geoip',
      note: 'Estimated via configured server-side GeoIP lookup without storing raw IP addresses.'
    };
  }

  const acceptLang = String(req.headers['accept-language'] || '').toLowerCase();
  if (acceptLang.includes('bn-bd') || acceptLang.includes('en-bd') || /^bn\b/.test(acceptLang)) {
    return {
      regionCode: 'BD',
      countryCode: 'BD',
      recommendedCurrency: 'BDT',
      source: 'locale',
      note: 'Estimated from browser Accept-Language preference.'
    };
  }
  if (acceptLang.includes('-in') || /^(hi|ta|te|kn|ml|mr|gu)\b/.test(acceptLang)) {
    return {
      regionCode: 'IN',
      countryCode: 'IN',
      recommendedCurrency: 'INR',
      source: 'locale',
      note: 'Estimated from browser Accept-Language preference.'
    };
  }
  if (acceptLang.includes('en-gb')) {
    return {
      regionCode: 'GB',
      countryCode: 'GB',
      recommendedCurrency: 'GBP',
      source: 'locale',
      note: 'Estimated from browser Accept-Language preference.'
    };
  }
  const euroLangMatch = acceptLang.match(
    /\b(de|fr|it|es|nl|pt|pl|sv|da|fi)-(de|fr|it|es|nl|pt|pl|se|dk|fi|at|be|ch)\b/
  );
  if (euroLangMatch) {
    return {
      regionCode: 'EU',
      countryCode: euroLangMatch[2].toUpperCase(),
      recommendedCurrency: 'EUR',
      source: 'locale',
      note: 'Estimated from browser Accept-Language preference.'
    };
  }
  if (/-(au|sg|jp|kr|my|id|ph|th|vn|nz)\b/.test(acceptLang)) {
    return {
      regionCode: 'APAC',
      countryCode: '',
      recommendedCurrency: 'USD',
      source: 'locale',
      note: 'Estimated from browser Accept-Language preference.'
    };
  }
  if (/-(ae|sa|eg|qa|kw|om|bh|ma|jo)\b/.test(acceptLang) || /^ar\b/.test(acceptLang)) {
    return {
      regionCode: 'MENA',
      countryCode: '',
      recommendedCurrency: 'USD',
      source: 'locale',
      note: 'Estimated from browser Accept-Language preference.'
    };
  }
  if (acceptLang.includes('en-us') || acceptLang.includes('en-ca')) {
    return {
      regionCode: 'US',
      countryCode: 'US',
      recommendedCurrency: 'USD',
      source: 'locale',
      note: 'Estimated from browser Accept-Language preference.'
    };
  }

  return {
    regionCode: 'GLOBAL',
    countryCode: '',
    recommendedCurrency: 'USD',
    source: 'default',
    note: 'Default Global view; select your shopping region manually anytime.'
  };
}

function isValidRegionCode(value: unknown): value is VisitorRegionCode {
  return typeof value === 'string' && value in REGION_PROFILES;
}

function isValidNeed(value: unknown): value is BuyingNeed {
  return typeof value === 'string' && value in BUYING_NEED_META;
}

const VALID_STORES = new Set<PartnerStoreOrigin>([
  'Amazon',
  'AliExpress',
  'Shopz BD',
  'Star Tech',
  'Releva BD',
  'BanglaShoppers',
  'Illin BD',
  'Sohoj Affiliates',
  'ExonHost'
]);

async function startServer() {
  await ensureDb();

  const app = express();
  app.set('trust proxy', 1);

  // Explicit CORS support for GitHub Pages + optional VITE_API_BASE_URL
  app.use((req, res, next) => {
    const allowed = process.env.ALLOWED_ORIGINS?.trim();
    const origin = req.headers.origin;
    if (origin) {
      if (!allowed || allowed === '*') {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else {
        const allowList = allowed.split(',').map((s) => s.trim());
        if (allowList.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
      }
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.use('/api', rateLimitApi);
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', async (_req, res) => {
    const [db, catalog, promos] = await Promise.all([
      ensureDb(),
      getFullCatalogRecords(),
      getEventPromotions()
    ]);
    const affiliateConfig = resolveStorefrontAffiliateConfig(db.storefront.affiliateConfig);
    res.json({
      status: 'ok',
      service: 'camellia-shop',
      catalogCount: catalog.length,
      promotionsCount: promos.length,
      aliexpressConfigured: affiliateConfig.aliexpress.enabled,
      storesSupported: Array.from(VALID_STORES),
      regionsSupported: REGION_ORDER,
      persistence: {
        mode: 'local-json-ephemeral',
        durableAcrossRestarts: false,
        firestoreConfigured: false,
        note: 'Local JSON storage is non-durable across Cloud Run / container restarts; configure Firestore for durable multi-instance persistence.'
      },
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/region', async (req, res) => {
    const detected = await detectNetworkRegion(req);
    res.json(detected);
  });

  app.get('/api/rates', async (_req, res) => {
    const data = await getLiveUsdRates();
    res.json(data);
  });

  app.get('/api/owner', async (_req, res) => {
    const profile = await getLiveOwnerCredit();
    res.json(profile);
  });

  app.get('/api/affiliate/config', async (_req, res) => {
    const [db, promos] = await Promise.all([ensureDb(), getEventPromotions()]);
    const resolved = resolveStorefrontAffiliateConfig(db.storefront.affiliateConfig);
    res.json({
      aliexpress: resolved.aliexpress,
      promotionsCount: promos.length,
      partnerStores: {
        aliexpress: resolved.aliexpress,
        amazon: resolved.amazon,
        shopzBd: { portalUrl: SHOPZ_REF_BASE },
        starTech: { portalUrl: STARTECH_AFFILIATE_URL },
        relevaBd: { portalUrl: RELEVA_HOME_URL },
        banglaShoppers: { portalUrl: BANGLASHOPPERS_AFFILIATE_URL },
        illinBd: { portalUrl: ILLIN_AFFILIATE_URL },
        sohojAffiliates: { portalUrl: SOHOJ_AFFILIATE_URL },
        exonHost: { portalUrl: EXONHOST_AFFILIATE_URL }
      }
    });
  });

  app.get('/api/storefront', async (_req, res) => {
    const db = await ensureDb();
    const resolved = resolveStorefrontAffiliateConfig(db.storefront.affiliateConfig);
    res.json({
      ...db.storefront,
      affiliateConfig: resolved,
      partnerStores: {
        aliexpress: {
          name: resolved.aliexpress.partner,
          enabled: resolved.aliexpress.enabled,
          portalUrl: resolved.aliexpress.portalUrl,
          eventUrl: resolved.aliexpress.eventUrl,
          squareEventUrl: resolved.aliexpress.squareEventUrl,
          categories: resolved.aliexpress.categories
        }
      }
    });
  });

  app.get('/api/promotions', async (_req, res) => {
    const [db, promos] = await Promise.all([ensureDb(), getEventPromotions()]);
    const aliexpress = resolveStorefrontAffiliateConfig(db.storefront.affiliateConfig).aliexpress;
    res.json({
      partner: aliexpress.partner,
      enabled: aliexpress.enabled,
      primaryEventUrl: aliexpress.eventUrl,
      squareEventUrl: aliexpress.squareEventUrl,
      count: promos.length,
      items: promos
    });
  });

  app.get('/api/catalog', async (req, res) => {
    const [db, ratesData] = await Promise.all([ensureDb(), getLiveUsdRates()]);
    const resolvedAffiliate = resolveStorefrontAffiliateConfig(db.storefront.affiliateConfig);
    const aliexpress = resolvedAffiliate.aliexpress;
    const records = (await getFullCatalogRecords(ratesData.rates.BDT)).map((item) => {
      if (item.originStore === 'AliExpress') {
        if (item.id === 'aliexpress-jewelry-accessories') {
          return { ...item, affiliateUrl: aliexpress.categories.jewelry };
        }
        if (item.id === 'aliexpress-beauty-health') {
          return { ...item, affiliateUrl: aliexpress.categories.beauty };
        }
        if (item.id === 'aliexpress-toys-games') {
          return { ...item, affiliateUrl: aliexpress.categories.toys };
        }
        if (item.id === 'aliexpress-womens-clothing') {
          return { ...item, affiliateUrl: aliexpress.categories.womensClothing };
        }
        return item;
      }
      if (item.originStore === 'Amazon') {
        return {
          ...item,
          affiliateUrl: sanitizeAmazonAffiliateUrl(
            item.affiliateUrl,
            item.asin,
            resolvedAffiliate.amazon
          )
        };
      }
      return item;
    });
    const store = typeof req.query.store === 'string' ? req.query.store.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

    const filtered = records.filter((item) => {
      if (store && store !== 'all' && item.originStore !== store) return false;
      if (
        category &&
        category !== 'All Departments (Mega Store)' &&
        item.category !== category &&
        item.department !== category
      ) {
        return false;
      }
      if (q) {
        const hay = `${item.title} ${item.brand} ${item.category} ${item.csvCategory || ''} ${item.asin || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    res.json({
      count: filtered.length,
      totalCount: records.length,
      priceDisclaimer:
        'Historical CSV prices are reference snapshots only; live pricing, stock, shipping, and returns are determined on the partner store.',
      items: filtered
    });
  });

  const handleRecommendations = async (req: Request, res: Response) => {
    const source = req.method === 'POST' ? (req.body as Record<string, unknown>) : req.query;

    const detected = await detectNetworkRegion(req);
    const region: VisitorRegionCode = isValidRegionCode(source?.region)
      ? source.region
      : detected.regionCode;

    const need: BuyingNeed = isValidNeed(source?.need) ? source.need : 'balanced';

    const rawBudget =
      typeof source?.budgetUsd === 'number'
        ? source.budgetUsd
        : typeof source?.budgetUsd === 'string' && source.budgetUsd.trim() !== ''
        ? Number(source.budgetUsd)
        : null;
    if (rawBudget !== null && (!Number.isFinite(rawBudget) || rawBudget < 0 || rawBudget > 50000)) {
      res.status(400).json({ error: 'budgetUsd must be a finite number between 0 and 50000.' });
      return;
    }

    const rawPreferredStore =
      typeof source?.preferredStore === 'string' ? source.preferredStore.trim() : 'all';
    const preferredStore: PartnerStoreOrigin | 'all' = VALID_STORES.has(
      rawPreferredStore as PartnerStoreOrigin
    )
      ? (rawPreferredStore as PartnerStoreOrigin)
      : 'all';

    const rawLimit =
      typeof source?.limit === 'number'
        ? source.limit
        : typeof source?.limit === 'string'
        ? Number(source.limit)
        : 8;
    const limit =
      Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(24, Math.floor(rawLimit)) : 8;

    const sessionId =
      typeof source?.sessionId === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(source.sessionId)
        ? source.sessionId
        : '';

    const db = await ensureDb();
    const interactions: InteractionSignals =
      sessionId && db.profiles[sessionId]
        ? db.profiles[sessionId]
        : { categoryCounts: {}, storeCounts: {}, recentProductIds: [] };

    const ratesData = await getLiveUsdRates();
    const catalog = await getFullCatalogRecords(ratesData.rates.BDT);

    const results = computeRecommendations({
      catalog,
      region,
      buyingGuide: {
        need,
        budgetUsd: rawBudget && rawBudget > 0 ? rawBudget : null,
        preferredStore
      },
      interactions,
      rates: ratesData.rates,
      limit
    });

    res.json({
      region,
      regionProfile: REGION_PROFILES[region],
      buyingGuide: {
        need,
        budgetUsd: rawBudget && rawBudget > 0 ? rawBudget : null,
        preferredStore
      },
      personalizedWithProfile: Boolean(sessionId && db.profiles[sessionId]),
      recommendations: results.map((r) => ({
        id: r.item.id,
        title: r.item.title,
        originStore: r.item.originStore,
        category: r.item.category,
        price: r.item.price,
        nativePrice: r.item.nativePrice,
        nativeCurrency: r.item.nativeCurrency,
        priceStatus: r.item.priceStatus,
        affiliateUrl: r.item.affiliateUrl,
        score: r.score,
        reasons: r.reasons,
        whyRecommended: r.whyRecommended
      }))
    });
  };

  app.get('/api/recommendations', handleRecommendations);
  app.post('/api/recommendations', handleRecommendations);
  app.get('/api/buying-guide', handleRecommendations);
  app.post('/api/buying-guide', handleRecommendations);

  const VALID_EVENT_TYPES = new Set([
    'view_category',
    'view_store',
    'save_item',
    'outbound_click',
    'buying_guide'
  ]);

  app.post('/api/events', async (req, res) => {
    const body = req.body as Record<string, unknown>;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'JSON object body required' });
      return;
    }

    const eventType = typeof body.eventType === 'string' ? body.eventType.trim() : '';
    if (!VALID_EVENT_TYPES.has(eventType)) {
      res.status(400).json({
        error: 'Invalid eventType. Allowed: view_category, view_store, save_item, outbound_click, buying_guide'
      });
      return;
    }

    const sessionId =
      typeof body.sessionId === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(body.sessionId)
        ? body.sessionId
        : '';

    const category =
      typeof body.category === 'string' ? body.category.trim().slice(0, 64) : '';
    const store =
      typeof body.store === 'string' && VALID_STORES.has(body.store.trim() as PartnerStoreOrigin)
        ? body.store.trim()
        : '';
    const productId =
      typeof body.productId === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(body.productId.trim())
        ? body.productId.trim()
        : '';

    // Never accept or store raw search queries or raw IP addresses
    await withDbLock(async (db) => {
      if (eventType === 'outbound_click') {
        const key = productId || store || 'outbound';
        db.clicks[key] = (db.clicks[key] || 0) + 1;
      }

      if (sessionId) {
        const existing = db.profiles[sessionId] || {
          categoryCounts: {},
          storeCounts: {},
          recentProductIds: [],
          updatedAt: new Date().toISOString()
        };
        if (category && category !== 'All Departments (Mega Store)') {
          existing.categoryCounts[category] = Math.min(
            500,
            (existing.categoryCounts[category] || 0) + 1
          );
        }
        if (store) {
          existing.storeCounts[store] = Math.min(500, (existing.storeCounts[store] || 0) + 1);
        }
        if (productId) {
          existing.recentProductIds = [
            productId,
            ...existing.recentProductIds.filter((id) => id !== productId)
          ].slice(0, MAX_RECENT_PRODUCTS);
        }
        existing.updatedAt = new Date().toISOString();

        // Bound total profiles in local JSON fallback
        const keys = Object.keys(db.profiles);
        if (!db.profiles[sessionId] && keys.length >= MAX_STORED_PROFILES) {
          const oldest = keys.sort(
            (a, b) =>
              new Date(db.profiles[a].updatedAt).getTime() -
              new Date(db.profiles[b].updatedAt).getTime()
          )[0];
          if (oldest) delete db.profiles[oldest];
        }
        db.profiles[sessionId] = existing;
      }

      return { db, result: undefined };
    });

    res.status(202).json({ accepted: true, storedAnonymized: Boolean(sessionId) });
  });

  app.delete('/api/profile', async (req, res) => {
    const querySession = typeof req.query.sessionId === 'string' ? req.query.sessionId : '';
    const bodySession =
      req.body && typeof (req.body as { sessionId?: unknown }).sessionId === 'string'
        ? ((req.body as { sessionId: string }).sessionId)
        : '';
    const sessionId = (querySession || bodySession).trim();

    if (!/^[a-zA-Z0-9_-]{8,64}$/.test(sessionId)) {
      res.status(400).json({ error: 'Valid anonymous sessionId is required to clear profile.' });
      return;
    }

    const removed = await withDbLock(async (db) => {
      const existed = Boolean(db.profiles[sessionId]);
      delete db.profiles[sessionId];
      return { db, result: existed };
    });

    res.json({ cleared: true, existed: removed });
  });

  app.post('/api/clicks', async (req, res) => {
    const body = req.body as { targetId?: unknown };
    const rawKey = typeof body?.targetId === 'string' ? body.targetId.trim() : '';
    const key = /^[a-zA-Z0-9_-]{1,80}$/.test(rawKey) ? rawKey : 'outbound';
    const count = await withDbLock(async (db) => {
      db.clicks[key] = (db.clicks[key] || 0) + 1;
      return { db, result: db.clicks[key] };
    });
    res.json({ count });
  });

  // Internal server-only site control endpoint (authenticated, never exposed in UI)
  app.post('/api/internal/control', async (req, res) => {
    if (!isAuthorizedInternalRequest(req)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const body = req.body as { instruction?: unknown; command?: unknown };
    const instruction =
      typeof body?.instruction === 'string'
        ? body.instruction
        : typeof body?.command === 'string'
        ? body.command
        : '';

    if (!instruction.trim() || instruction.length > 2000) {
      res.status(400).json({ error: 'instruction string (1-2000 chars) is required' });
      return;
    }

    try {
      const result = await withDbLock(async (db) => {
        const updated = await executeBackendSiteControl(instruction, db.storefront);
        db.storefront = updated.storefront;
        return { db, result: updated };
      });
      res.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to apply storefront update';
      res.status(500).json({ error: msg });
    }
  });

  app.get('/robots.txt', (req, res) => {
    const canonicalOrigin = resolveRequestOrigin(req.headers, {
      encrypted: Boolean((req.socket as { encrypted?: boolean } | undefined)?.encrypted),
      expressProtocol: req.protocol,
      appUrl: process.env.APP_URL
    });
    res.type('text/plain').send(buildRobotsTxt(canonicalOrigin));
  });

  app.get('/sitemap.xml', (req, res) => {
    const canonicalOrigin = resolveRequestOrigin(req.headers, {
      encrypted: Boolean((req.socket as { encrypted?: boolean } | undefined)?.encrypted),
      expressProtocol: req.protocol,
      appUrl: process.env.APP_URL
    });
    res.type('application/xml').send(buildSitemapXml(canonicalOrigin));
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, 'dist');
    const mitgoTag =
      '<meta name="mitgo-verification" content="370191ce-4227-4e0f-b2b1-7234b5a333b2" />';
    const oldMitgoPattern =
      /\s*<meta\b[^>]*name=["']mitgo-verification["'][^>]*892bc51b-d387-45a2-baab-fa37e8d8e069[^>]*>\s*/gi;

    const sendVerifiedIndex = async (_req: Request, res: Response) => {
      try {
        let html = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
        html = html.replace(oldMitgoPattern, '\n');
        if (!html.includes('370191ce-4227-4e0f-b2b1-7234b5a333b2')) {
          html = html.replace('</head>', `    ${mitgoTag}\n  </head>`);
        }
        const canonicalOrigin = resolveRequestOrigin(_req.headers, {
          encrypted: Boolean((_req.socket as { encrypted?: boolean } | undefined)?.encrypted),
          expressProtocol: _req.protocol,
          appUrl: process.env.APP_URL
        });
        const db = await ensureDb();
        if (canonicalOrigin) {
          html = injectSeoMetadataIntoHtml(html, canonicalOrigin, {
            name: db.storefront.siteName,
            description: db.storefront.seoDescription
          });
        }
        res.type('html').send(html);
      } catch {
        res.sendFile(path.join(distDir, 'index.html'));
      }
    };

    app.get('/', sendVerifiedIndex);
    app.use(express.static(distDir));
    app.get('*', sendVerifiedIndex);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Camellia Shop server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
