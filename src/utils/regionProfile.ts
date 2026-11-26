export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BDT' | 'INR';

export type VisitorRegionCode =
  | 'BD'
  | 'US'
  | 'GB'
  | 'EU'
  | 'IN'
  | 'APAC'
  | 'MENA'
  | 'GLOBAL';

export type PartnerStoreOrigin =
  | 'Amazon'
  | 'AliExpress'
  | 'Shopz BD'
  | 'Releva BD'
  | 'Star Tech'
  | 'BanglaShoppers'
  | 'Illin BD'
  | 'Sohoj Affiliates'
  | 'ExonHost';

export interface RegionProfile {
  code: VisitorRegionCode;
  label: string;
  shortLabel: string;
  defaultCurrency: CurrencyCode;
  storePriority: PartnerStoreOrigin[];
  preferredThemeId: string;
  prioritySummary: string;
  deliverySummary: string;
  availabilityNote: string;
}

export const REGION_PROFILES: Record<VisitorRegionCode, RegionProfile> = {
  BD: {
    code: 'BD',
    label: 'Bangladesh',
    shortLabel: 'BD · BDT',
    defaultCurrency: 'BDT',
    storePriority: [
      'Shopz BD',
      'Star Tech',
      'Releva BD',
      'BanglaShoppers',
      'Illin BD',
      'Sohoj Affiliates',
      'ExonHost',
      'AliExpress',
      'Amazon'
    ],
    preferredThemeId: 'student-home',
    prioritySummary: 'Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD & Sohoj Affiliates Prioritized for Bangladesh',
    deliverySummary: 'Local Bangladesh partners first; global delivery varies by merchant',
    availabilityNote:
      'Shopz BD, Star Tech, Releva BD, BanglaShoppers, and Illin BD fulfill locally within Bangladesh; international shipping from Amazon depends on item eligibility and customs at partner checkout.'
  },
  US: {
    code: 'US',
    label: 'United States',
    shortLabel: 'US · USD',
    defaultCurrency: 'USD',
    storePriority: [
      'Amazon',
      'AliExpress',
      'ExonHost',
      'Shopz BD',
      'Star Tech',
      'Releva BD',
      'BanglaShoppers',
      'Illin BD',
      'Sohoj Affiliates'
    ],
    preferredThemeId: 'remote-desk',
    prioritySummary: 'Amazon US & ExonHost Prioritized',
    deliverySummary: 'Direct partner checkout; live US shipping verified on retailer site',
    availabilityNote:
      'Amazon US listings target US delivery addresses; Bangladesh retailers (Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD) primarily deliver inside Bangladesh.'
  },
  GB: {
    code: 'GB',
    label: 'United Kingdom',
    shortLabel: 'UK · GBP',
    defaultCurrency: 'GBP',
    storePriority: [
      'Amazon',
      'AliExpress',
      'ExonHost',
      'Shopz BD',
      'Star Tech',
      'Releva BD',
      'BanglaShoppers',
      'Illin BD',
      'Sohoj Affiliates'
    ],
    preferredThemeId: 'remote-desk',
    prioritySummary: 'Amazon, ExonHost & GBP Display Prioritized',
    deliverySummary: 'Partner-set UK shipping, VAT & import terms at destination checkout',
    availabilityNote:
      'Displayed GBP values are approximate conversions for reference only; verify UK dispatch eligibility and final GBP price on the partner checkout.'
  },
  EU: {
    code: 'EU',
    label: 'Europe',
    shortLabel: 'EU · EUR',
    defaultCurrency: 'EUR',
    storePriority: [
      'Amazon',
      'AliExpress',
      'ExonHost',
      'Shopz BD',
      'Star Tech',
      'Releva BD',
      'BanglaShoppers',
      'Illin BD',
      'Sohoj Affiliates'
    ],
    preferredThemeId: 'creator-studio',
    prioritySummary: 'Amazon, ExonHost & EUR Display Prioritized',
    deliverySummary: 'EU VAT, shipping rates & availability verified on partner store',
    availabilityNote:
      'Displayed EUR values are approximate conversions for reference only; verify EU regional availability and import terms on the retailer checkout.'
  },
  IN: {
    code: 'IN',
    label: 'India',
    shortLabel: 'IN · INR',
    defaultCurrency: 'INR',
    storePriority: [
      'Amazon',
      'AliExpress',
      'ExonHost',
      'Shopz BD',
      'Star Tech',
      'Releva BD',
      'BanglaShoppers',
      'Illin BD',
      'Sohoj Affiliates'
    ],
    preferredThemeId: 'remote-desk',
    prioritySummary: 'INR Currency Display with Global Tech & Hosting Partners',
    deliverySummary: 'Cross-border shipping & local availability checked on partner site',
    availabilityNote:
      'Displayed INR values are approximate conversions; verify India delivery support and applicable duties directly on the partner checkout.'
  },
  APAC: {
    code: 'APAC',
    label: 'Asia-Pacific',
    shortLabel: 'APAC · USD',
    defaultCurrency: 'USD',
    storePriority: [
      'Amazon',
      'AliExpress',
      'ExonHost',
      'Shopz BD',
      'Star Tech',
      'Releva BD',
      'BanglaShoppers',
      'Illin BD',
      'Sohoj Affiliates'
    ],
    preferredThemeId: 'mobile-commuter',
    prioritySummary: 'Amazon & ExonHost APAC Nodes Prioritized',
    deliverySummary: 'Regional dispatch & currency converted at partner checkout',
    availabilityNote:
      'Partner stores set regional delivery coverage and shipping fees individually; local Bangladesh stores do not typically ship internationally.'
  },
  MENA: {
    code: 'MENA',
    label: 'Middle East & North Africa',
    shortLabel: 'MENA · USD',
    defaultCurrency: 'USD',
    storePriority: [
      'Amazon',
      'AliExpress',
      'ExonHost',
      'Shopz BD',
      'Star Tech',
      'Releva BD',
      'BanglaShoppers',
      'Illin BD',
      'Sohoj Affiliates'
    ],
    preferredThemeId: 'mobile-commuter',
    prioritySummary: 'Amazon & ExonHost Global Partners Prioritized',
    deliverySummary: 'Destination shipping & customs terms confirmed at partner checkout',
    availabilityNote:
      'Cross-border delivery eligibility varies by country and product; verify shipping before ordering on the partner site.'
  },
  GLOBAL: {
    code: 'GLOBAL',
    label: 'Global / Worldwide',
    shortLabel: 'Global · USD',
    defaultCurrency: 'USD',
    storePriority: [
      'Amazon',
      'AliExpress',
      'ExonHost',
      'Shopz BD',
      'Star Tech',
      'Releva BD',
      'BanglaShoppers',
      'Illin BD',
      'Sohoj Affiliates'
    ],
    preferredThemeId: 'mobile-commuter',
    prioritySummary: 'Balanced Partner Directory Across All Curated Stores',
    deliverySummary: 'Retailer sets live price, regional shipping, stock & returns',
    availabilityNote:
      'Not every partner delivers to every country. Check shipping coverage and currency terms on the destination retailer page.'
  }
};

export const REGION_ORDER: VisitorRegionCode[] = [
  'BD',
  'US',
  'GB',
  'EU',
  'IN',
  'APAC',
  'MENA',
  'GLOBAL'
];

const APAC_TIMEZONES = new Set([
  'Asia/Tokyo',
  'Asia/Singapore',
  'Asia/Seoul',
  'Asia/Bangkok',
  'Asia/Jakarta',
  'Asia/Kuala_Lumpur',
  'Asia/Manila',
  'Asia/Ho_Chi_Minh',
  'Asia/Hong_Kong',
  'Asia/Taipei',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland'
]);

const MENA_TIMEZONES = new Set([
  'Asia/Dubai',
  'Asia/Riyadh',
  'Asia/Qatar',
  'Asia/Kuwait',
  'Asia/Muscat',
  'Asia/Bahrain',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Asia/Amman'
]);

export function detectBrowserRegionFallback(): VisitorRegionCode {
  if (typeof window === 'undefined') return 'GLOBAL';

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Asia/Dhaka' || tz === 'Asia/Dacca') return 'BD';
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'IN';
    if (tz === 'Europe/London') return 'GB';
    if (tz.startsWith('Europe/')) return 'EU';
    if (APAC_TIMEZONES.has(tz) || tz.startsWith('Australia/')) return 'APAC';
    if (MENA_TIMEZONES.has(tz)) return 'MENA';
    if (tz.startsWith('America/')) return 'US';

    const langs = (
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language || '']
    ).map((l) => l.toLowerCase());

    if (langs.some((l) => l === 'bn-bd' || l.endsWith('-bd'))) return 'BD';
    if (langs.some((l) => l.endsWith('-in') || /^(hi|ta|te|kn|ml|mr|gu)\b/.test(l))) return 'IN';
    if (langs.some((l) => l === 'en-gb')) return 'GB';
    if (langs.some((l) => /^(de|fr|it|es|nl|pt|pl|sv|da|fi)/.test(l))) return 'EU';
    if (langs.some((l) => /-(au|sg|jp|kr|my|id|ph|th|vn|nz)$/.test(l))) return 'APAC';
    if (langs.some((l) => /-(ae|sa|eg|qa|kw|om|bh|ma|jo)$/.test(l) || /^ar\b/.test(l))) return 'MENA';
    if (langs.some((l) => l === 'en-us' || l === 'en-ca')) return 'US';
  } catch {
    // Default cleanly to GLOBAL
  }

  return 'GLOBAL';
}

export function getStorePriorityRank(
  store: PartnerStoreOrigin,
  regionCode: VisitorRegionCode
): number {
  const order =
    REGION_PROFILES[regionCode]?.storePriority || REGION_PROFILES.GLOBAL.storePriority;
  const idx = order.indexOf(store);
  return idx >= 0 ? idx : order.length;
}
