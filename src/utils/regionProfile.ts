import type { Currency } from '../context/CartContext';

export type VisitorRegionCode = 'BD' | 'US' | 'EU' | 'GB' | 'GLOBAL';
export type PartnerStoreOrigin = 'Amazon' | 'Shopz BD' | 'ExonHost' | 'AliExpress' | 'Alibaba';

export interface RegionProfile {
  code: VisitorRegionCode;
  label: string;
  shortLabel: string;
  defaultCurrency: Currency;
  storePriority: PartnerStoreOrigin[];
  preferredThemeId: string;
  prioritySummary: string;
  deliverySummary: string;
}

export const REGION_PROFILES: Record<VisitorRegionCode, RegionProfile> = {
  BD: {
    code: 'BD',
    label: 'Bangladesh',
    shortLabel: 'BD · BDT',
    defaultCurrency: 'BDT',
    storePriority: ['Shopz BD', 'ExonHost', 'AliExpress', 'Alibaba', 'Amazon'],
    preferredThemeId: 'student-home',
    prioritySummary: 'Shopz BD Express, ExonHost BD Nodes & AliExpress Choice First',
    deliverySummary: 'Dhaka Same-Day & Nationwide Courier (COD) + Global Direct Dispatch'
  },
  US: {
    code: 'US',
    label: 'United States & North America',
    shortLabel: 'US · USD',
    defaultCurrency: 'USD',
    storePriority: ['Amazon', 'ExonHost', 'AliExpress', 'Alibaba', 'Shopz BD'],
    preferredThemeId: 'remote-desk',
    prioritySummary: 'Amazon Prime Fulfillment, ExonHost & AliExpress Choice First',
    deliverySummary: 'Prime 1–2 Day US Delivery + Choice Global Dispatch & Instant Cloud'
  },
  EU: {
    code: 'EU',
    label: 'Europe',
    shortLabel: 'EU · EUR',
    defaultCurrency: 'EUR',
    storePriority: ['Amazon', 'AliExpress', 'ExonHost', 'Alibaba', 'Shopz BD'],
    preferredThemeId: 'creator-studio',
    prioritySummary: 'Amazon EU, AliExpress Choice & Alibaba Direct First',
    deliverySummary: 'Tracked European Dispatch + Multi-Region Cloud & Wholesale Sourcing'
  },
  GB: {
    code: 'GB',
    label: 'United Kingdom',
    shortLabel: 'UK · GBP',
    defaultCurrency: 'GBP',
    storePriority: ['Amazon', 'AliExpress', 'ExonHost', 'Alibaba', 'Shopz BD'],
    preferredThemeId: 'remote-desk',
    prioritySummary: 'Amazon UK, AliExpress Choice & British Pound Pricing First',
    deliverySummary: 'Tracked UK & Choice Global Delivery + Instant Anycast DNS & Hosting'
  },
  GLOBAL: {
    code: 'GLOBAL',
    label: 'Global / Worldwide',
    shortLabel: 'Global · USD',
    defaultCurrency: 'USD',
    storePriority: ['Amazon', 'AliExpress', 'Alibaba', 'Shopz BD', 'ExonHost'],
    preferredThemeId: 'mobile-commuter',
    prioritySummary: 'Balanced Global Amazon, AliExpress, Alibaba, Shopz BD & ExonHost Catalog',
    deliverySummary: 'Worldwide Partner Checkouts Across Hardware, Audio, Wholesale & Cloud Hosting'
  }
};

export const REGION_ORDER: VisitorRegionCode[] = ['BD', 'US', 'GB', 'EU', 'GLOBAL'];

export function detectBrowserRegionFallback(): VisitorRegionCode {
  if (typeof window === 'undefined') return 'GLOBAL';

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Asia/Dhaka' || tz === 'Asia/Dacca') return 'BD';
    if (tz === 'Europe/London') return 'GB';
    if (tz.startsWith('Europe/')) return 'EU';
    if (tz.startsWith('America/')) return 'US';

    const langs = (navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language || '']
    ).map((l) => l.toLowerCase());

    if (langs.some((l) => l.startsWith('bn') || l.includes('-bd'))) return 'BD';
    if (langs.some((l) => l === 'en-gb')) return 'GB';
    if (langs.some((l) => /^(de|fr|it|es|nl|pt|pl|sv|da|fi)/.test(l))) return 'EU';
    if (langs.some((l) => l === 'en-us')) return 'US';
  } catch {
    // Default cleanly to GLOBAL
  }

  return 'GLOBAL';
}

export function getStorePriorityRank(store: PartnerStoreOrigin, regionCode: VisitorRegionCode): number {
  const order = REGION_PROFILES[regionCode]?.storePriority || REGION_PROFILES.GLOBAL.storePriority;
  const idx = order.indexOf(store);
  return idx >= 0 ? idx : order.length;
}
