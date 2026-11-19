import {
  REGION_PROFILES,
  getStorePriorityRank,
  type CurrencyCode,
  type PartnerStoreOrigin,
  type VisitorRegionCode
} from './regionProfile.ts';
import type { CatalogRecord } from '../data/catalogRecords.ts';

export type BuyingNeed =
  | 'balanced'
  | 'workspace'
  | 'audio'
  | 'power'
  | 'watches'
  | 'everyday'
  | 'beauty'
  | 'hosting'
  | 'sourcing';

export interface BuyingGuideInput {
  need: BuyingNeed;
  budgetUsd?: number | null;
  preferredStore?: PartnerStoreOrigin | 'all';
}

export interface InteractionSignals {
  categoryCounts: Record<string, number>;
  storeCounts: Record<string, number>;
  recentProductIds: string[];
}

export type RecommendationCandidate = Pick<
  CatalogRecord,
  'id' | 'title' | 'category' | 'originStore' | 'price' | 'nativePrice' | 'nativeCurrency' | 'csvCategory'
> &
  Partial<Pick<CatalogRecord, 'priceStatus' | 'sourceType' | 'tags'>>;

export interface RecommendedItem<T extends RecommendationCandidate> {
  item: T;
  score: number;
  reasons: string[];
  whyRecommended: string;
}

export const BUYING_NEED_META: Record<
  BuyingNeed,
  {
    label: string;
    description: string;
    targetCategories: string[];
    keywords: string[];
  }
> = {
  balanced: {
    label: 'All-Around Regional Mix',
    description: 'Balances your region partner priorities with saved activity.',
    targetCategories: [],
    keywords: []
  },
  workspace: {
    label: 'Remote Desk & Ergonomics',
    description: 'Mice, laptop stands, monitor arms, docks, and desk lighting.',
    targetCategories: ['Office & Workspace', 'Computers & Accessories'],
    keywords: ['workspace', 'mouse', 'monitor', 'laptop', 'lamp', 'desk', 'dock', 'stand', 'ergonomic']
  },
  audio: {
    label: 'Audio, Earbuds & Creator Gear',
    description: 'Headphones, wireless earbuds, microphones, speakers, and tripods.',
    targetCategories: ['Audio & Headphones'],
    keywords: ['audio', 'earbud', 'earphone', 'headphone', 'microphone', 'speaker', 'tripod', 'creator']
  },
  power: {
    label: 'Charging, Power & Travel Tech',
    description: 'Qi2 chargers, USB-C power banks, fans, and smart lighting.',
    targetCategories: ['Smart Home & Power'],
    keywords: ['power', 'charger', 'charging', 'bank', 'qi2', 'flashlight', 'fan', 'bulb', 'gan']
  },
  watches: {
    label: 'Watches & Smartwatches',
    description: 'Digital, quartz, and AMOLED smartwatch models.',
    targetCategories: ['Wearables & Smartwatches'],
    keywords: ['watch', 'smartwatch', 'casio', 'skmei', 'curren', 'zeblaze', 'colmi', 'olevs']
  },
  everyday: {
    label: 'Everyday Tech & Bangladesh Retail',
    description: 'Daily utilities, calculators, Shopz BD, Releva BD, and Illin BD picks.',
    targetCategories: ['Electronics & Gadgets', 'Shopz BD Tech Deals', 'Releva BD Picks', 'Illin BD Home & Tech'],
    keywords: ['everyday', 'calculator', 'trimmer', 'releva', 'shopz', 'bangladesh', 'cooler', 'coffee', 'toaster', 'illin']
  },
  beauty: {
    label: 'Skincare, Beauty & Home Appliances',
    description: 'Korean & global skincare from BanglaShoppers plus kitchen appliances from Illin BD.',
    targetCategories: ['BanglaShoppers Beauty', 'Illin BD Home & Tech'],
    keywords: ['skincare', 'serum', 'toner', 'sunscreen', 'cream', 'banglashoppers', 'coffee', 'appliance', 'illin']
  },
  hosting: {
    label: 'Web Hosting & Domains',
    description: 'Cloud hosting, WordPress, and domain portals via ExonHost.',
    targetCategories: ['Cloud Hosting & Domains'],
    keywords: ['hosting', 'domain', 'cloud', 'wordpress', 'vps', 'exonhost']
  },
  sourcing: {
    label: 'Sourcing & Affiliate Networks',
    description: 'Wholesale portals via Alibaba plus affiliate/reseller onboarding via Sohoj Affiliates.',
    targetCategories: ['Office & Workspace', 'Computers & Accessories', 'Smart Home & Power', 'Sohoj Affiliate Network'],
    keywords: ['sourcing', 'wholesale', 'alibaba', 'sohoj', 'affiliate', 'reseller']
  }
};

export function resolveApproxUsdPrice(
  item: Pick<CatalogRecord, 'price' | 'nativePrice' | 'nativeCurrency'> &
    Partial<Pick<CatalogRecord, 'priceStatus'>>,
  rates?: Partial<Record<CurrencyCode, number>>
): number | null {
  const bdtRate = rates?.BDT && rates.BDT > 1 ? rates.BDT : 121.5;
  if (item.nativeCurrency === 'BDT' && typeof item.nativePrice === 'number') {
    return item.nativePrice > 0 ? Number((item.nativePrice / bdtRate).toFixed(2)) : null;
  }
  if (typeof item.price === 'number' && item.price > 0) {
    return item.price;
  }
  return null;
}

export function computeRecommendations<T extends RecommendationCandidate>(options: {
  catalog: T[];
  region: VisitorRegionCode;
  buyingGuide?: BuyingGuideInput;
  interactions?: InteractionSignals;
  rates?: Partial<Record<CurrencyCode, number>>;
  limit?: number;
}): RecommendedItem<T>[] {
  const {
    catalog,
    region,
    buyingGuide = { need: 'balanced', budgetUsd: null, preferredStore: 'all' },
    interactions = { categoryCounts: {}, storeCounts: {}, recentProductIds: [] },
    rates,
    limit = 8
  } = options;

  const regionProfile = REGION_PROFILES[region] || REGION_PROFILES.GLOBAL;
  const needMeta = BUYING_NEED_META[buyingGuide.need] || BUYING_NEED_META.balanced;
  const activeBudget =
    typeof buyingGuide.budgetUsd === 'number' && Number.isFinite(buyingGuide.budgetUsd) && buyingGuide.budgetUsd > 0
      ? buyingGuide.budgetUsd
      : null;

  const scored: RecommendedItem<T>[] = [];

  for (let index = 0; index < catalog.length; index++) {
    const item = catalog[index];
    const reasons: string[] = [];
    let score = 0;

    // 1. Regional store relevance (deterministic)
    const priorityIdx = getStorePriorityRank(item.originStore, region);
    const regionScore = Math.max(0, 18 - priorityIdx * 3);
    score += regionScore;
    if (priorityIdx <= 1) {
      reasons.push(`Prioritized partner (${item.originStore}) for ${regionProfile.label}`);
    }

    // 2. Explicit preferred store filter from buying guide
    if (buyingGuide.preferredStore && buyingGuide.preferredStore !== 'all') {
      if (item.originStore === buyingGuide.preferredStore) {
        score += 36;
        reasons.push(`Selected partner: ${item.originStore}`);
      } else {
        score -= 10;
      }
    }

    // 3. Explicit Buying Guide Need matching
    if (buyingGuide.need !== 'balanced') {
      const hay = `${item.title} ${item.category} ${item.csvCategory || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
      const categoryMatch = needMeta.targetCategories.includes(item.category);
      const keywordHits = needMeta.keywords.filter((kw) => hay.includes(kw));

      if (categoryMatch) {
        score += 45;
        reasons.push(`Matches ${needMeta.label}`);
      } else if (keywordHits.length > 0) {
        score += 24 + Math.min(16, keywordHits.length * 4);
        reasons.push(`Relevant to ${needMeta.label}`);
      }

      if (
        buyingGuide.need === 'sourcing' &&
        (item.originStore === 'Alibaba' || item.originStore === 'Sohoj Affiliates')
      ) {
        score += 35;
        reasons.push(`Direct partner portal on ${item.originStore}`);
      }
      if (buyingGuide.need === 'beauty' && item.originStore === 'BanglaShoppers') {
        score += 30;
      }
      if (buyingGuide.need === 'hosting' && item.originStore === 'ExonHost') {
        score += 40;
      }
    }

    // 4. Budget filter / boost — STRICTLY ensure unknown prices do NOT masquerade as affordable
    const approxUsd = resolveApproxUsdPrice(item, rates);
    if (activeBudget !== null) {
      if (approxUsd === null) {
        // Unknown price: never give budget bonus, push behind verified reference-priced items within budget
        score -= 18;
      } else if (approxUsd <= activeBudget) {
        const proximityBonus = Math.round((approxUsd / activeBudget) * 14) + 28;
        score += proximityBonus;
        if (item.nativeCurrency === 'BDT' && item.nativePrice && item.nativePrice > 0) {
          reasons.push(
            `CSV ref. ${Math.round(item.nativePrice).toLocaleString('en-US')} BDT (~$${approxUsd.toFixed(0)} within $${activeBudget} budget)`
          );
        } else {
          reasons.push(`Within ~$${activeBudget} reference budget`);
        }
      } else {
        // Over explicit budget
        score -= 32;
      }
    } else if (approxUsd !== null && item.nativeCurrency === 'BDT' && item.nativePrice && item.nativePrice > 0) {
      reasons.push(`CSV reference price: ${Math.round(item.nativePrice).toLocaleString('en-US')} BDT`);
    }

    // 5. Anonymized interaction affinity (only real category/store interaction counts)
    const catHits = interactions.categoryCounts[item.category] || 0;
    const storeHits = interactions.storeCounts[item.originStore] || 0;
    if (catHits > 0) {
      score += Math.min(20, catHits * 5);
      reasons.push(`Matches your recent browsing in ${item.category}`);
    }
    if (storeHits > 0) {
      score += Math.min(12, storeHits * 3);
      if (!reasons.some((r) => r.includes(item.originStore))) {
        reasons.push(`Matches your interest in ${item.originStore}`);
      }
    }

    // Small deterministic tie-breaker based on curated vs CSV and catalog order
    if (item.sourceType === 'linked-shop') {
      score += 2;
    }

    if (reasons.length === 0) {
      reasons.push(`Catalog listing in ${item.category} via ${item.originStore}`);
    }

    // If strict budget is active and item has unknown price or exceeds budget, keep only if needed to avoid empty list?
    // Better: compute all, sort deterministically, and if budget is active prioritize items actually within budget first.
    scored.push({
      item,
      score,
      reasons,
      whyRecommended: reasons.slice(0, 3).join(' · ')
    });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.title.localeCompare(b.item.title);
  });

  if (activeBudget !== null) {
    const withinBudget = scored.filter((entry) => {
      const usd = resolveApproxUsdPrice(entry.item, rates);
      return usd !== null && usd <= activeBudget;
    });
    if (withinBudget.length > 0) {
      return withinBudget.slice(0, limit);
    }
  }

  return scored.slice(0, limit);
}
