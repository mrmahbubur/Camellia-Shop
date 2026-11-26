import type { ProductCategory } from '../data/catalogRecords';
import type { PartnerStoreOrigin } from './regionProfile';

export interface SearchableProduct {
  id: string;
  title: string;
  brand: string;
  category: ProductCategory;
  department?: string;
  csvCategory?: string;
  originStore: PartnerStoreOrigin;
  description: string;
  highlights: string[];
  specs: Array<{ label: string; value: string }>;
  tags?: string[];
  affiliateUrl?: string;
  asin?: string;
  urlKind?: 'product' | 'portal' | 'category';
}

export type SearchScope = 'all' | 'title-brand' | 'specs-tags' | 'category-store';
export type PriceStatusFilter = 'all' | 'priced' | 'live-at-partner';
export type CatalogSortBy =
  | 'relevance'
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'title-asc'
  | 'title-desc';

export const STORE_CATEGORIES: ProductCategory[] = [
  'All Departments (Mega Store)',
  'Electronics & Gadgets',
  'Computers & Accessories',
  'Audio & Headphones',
  'Smart Home & Power',
  'Wearables & Smartwatches',
  'Office & Workspace',
  'Shopz BD Tech Deals',
  'Star Tech BD Gadgets',
  'BanglaShoppers Beauty',
  'Illin BD Home & Tech',
  'Releva BD Picks',
  'Cloud Hosting & Domains',
  'Sohoj Affiliate Network'
];

export const PARTNER_STORE_LIST: PartnerStoreOrigin[] = [
  'Amazon',
  'Shopz BD',
  'Star Tech',
  'BanglaShoppers',
  'Illin BD',
  'Releva BD',
  'ExonHost',
  'Sohoj Affiliates'
];

export const POPULAR_SEARCH_TERMS: string[] = [
  'Smartwatch',
  'POEDAGAR Watch',
  'Wireless Earbuds',
  'COSRX',
  'Gaming Laptop',
  'Portable Fan',
  'Coffee Maker',
  'Monitor',
  'Power Station',
  'USB-C Dock'
];

const RECENT_SEARCHES_KEY = 'camellia_recent_searches';
const MAX_RECENT_SEARCHES = 6;

export function loadRecentSearches(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

export function saveRecentSearch(term: string): string[] {
  const clean = term.trim();
  if (clean.length < 2) return loadRecentSearches();
  const existing = loadRecentSearches();
  const next = [clean, ...existing.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(
    0,
    MAX_RECENT_SEARCHES
  );
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  }
  return next;
}

export function removeRecentSearch(term: string): string[] {
  const lower = term.trim().toLowerCase();
  const next = loadRecentSearches().filter((item) => item.toLowerCase() !== lower);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  }
  return next;
}

export function clearRecentSearches(): string[] {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return [];
}

function tokenizeQuery(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

export function scoreProductSearchMatch(
  product: SearchableProduct,
  rawQuery: string,
  scope: SearchScope = 'all'
): { matched: boolean; score: number } {
  const cleanQuery = rawQuery.trim().toLowerCase();
  if (!cleanQuery) {
    return { matched: true, score: 0 };
  }

  const tokens = tokenizeQuery(cleanQuery);
  const title = product.title.toLowerCase();
  const brand = product.brand.toLowerCase();
  const asin = (product.asin || '').toLowerCase();
  const category = product.category.toLowerCase();
  const department = (product.department || '').toLowerCase();
  const csvCat = (product.csvCategory || '').toLowerCase();
  const store = product.originStore.toLowerCase();
  const description = product.description.toLowerCase();
  const specsText = product.specs
    .map((s) => `${s.label} ${s.value}`.toLowerCase())
    .join(' ');
  const highlightsText = product.highlights.join(' ').toLowerCase();
  const tagsText = (product.tags || []).join(' ').toLowerCase();
  const slugText = product.affiliateUrl ? product.affiliateUrl.toLowerCase() : '';

  let searchableHaystack = '';
  if (scope === 'title-brand') {
    searchableHaystack = `${title} ${brand} ${asin}`;
  } else if (scope === 'specs-tags') {
    searchableHaystack = `${specsText} ${highlightsText} ${tagsText} ${description} ${title}`;
  } else if (scope === 'category-store') {
    searchableHaystack = `${category} ${department} ${csvCat} ${store} ${brand}`;
  } else {
    searchableHaystack = `${title} ${brand} ${asin} ${category} ${department} ${csvCat} ${store} ${specsText} ${highlightsText} ${tagsText} ${description} ${slugText}`;
  }

  // Require every query token to appear in the chosen scope
  const allTokensMatch = tokens.every((tok) => searchableHaystack.includes(tok));
  if (!allTokensMatch) {
    return { matched: false, score: 0 };
  }

  let score = 0;

  if (title === cleanQuery) score += 140;
  else if (title.startsWith(cleanQuery)) score += 110;
  else if (title.includes(cleanQuery)) score += 85;

  if (brand === cleanQuery) score += 80;
  else if (brand.includes(cleanQuery)) score += 55;

  if (asin && asin === cleanQuery) score += 100;
  if (store.includes(cleanQuery)) score += 40;
  if (category.includes(cleanQuery) || department.includes(cleanQuery) || csvCat.includes(cleanQuery)) {
    score += 36;
  }

  for (const tok of tokens) {
    if (title.includes(tok)) score += 20;
    if (brand.includes(tok)) score += 14;
    if (category.includes(tok) || csvCat.includes(tok) || department.includes(tok)) score += 10;
    if (specsText.includes(tok) || highlightsText.includes(tok)) score += 8;
    if (description.includes(tok)) score += 4;
  }

  if (product.urlKind !== 'portal') score += 4;

  return { matched: true, score };
}

export interface SearchSuggestionItem {
  id: string;
  label: string;
  kind: 'recent' | 'popular' | 'category' | 'brand' | 'store';
  meta?: string;
  count?: number;
}

export interface SearchSuggestionsResult<T extends SearchableProduct = SearchableProduct> {
  queryTerms: SearchSuggestionItem[];
  categories: Array<{ category: ProductCategory; count: number }>;
  brands: Array<{ brand: string; count: number }>;
  stores: Array<{ store: PartnerStoreOrigin; count: number }>;
  products: T[];
  totalMatchingProducts: number;
}

export function buildSearchSuggestions<T extends SearchableProduct>({
  query,
  products,
  recentSearches,
  scope = 'all',
  limitProducts = 6
}: {
  query: string;
  products: T[];
  recentSearches: string[];
  scope?: SearchScope;
  limitProducts?: number;
}): SearchSuggestionsResult<T> {
  const cleanQuery = query.trim().toLowerCase();

  // Query terms (recent + popular)
  const queryTerms: SearchSuggestionItem[] = [];
  const seenTerms = new Set<string>();

  for (const term of recentSearches) {
    const lower = term.toLowerCase();
    if (cleanQuery && !lower.includes(cleanQuery)) continue;
    if (seenTerms.has(lower)) continue;
    seenTerms.add(lower);
    queryTerms.push({ id: `recent-${lower}`, label: term, kind: 'recent', meta: 'Recent' });
    if (queryTerms.length >= 4) break;
  }

  for (const term of POPULAR_SEARCH_TERMS) {
    const lower = term.toLowerCase();
    if (cleanQuery && !lower.includes(cleanQuery)) continue;
    if (seenTerms.has(lower)) continue;
    seenTerms.add(lower);
    queryTerms.push({ id: `popular-${lower}`, label: term, kind: 'popular', meta: 'Popular' });
    if (queryTerms.length >= 7) break;
  }

  // Category counts & suggestions
  const categoryCountMap = new Map<ProductCategory, number>();
  const brandCountMap = new Map<string, number>();
  const storeCountMap = new Map<PartnerStoreOrigin, number>();

  for (const p of products) {
    categoryCountMap.set(p.category, (categoryCountMap.get(p.category) || 0) + 1);
    if (p.department && p.department !== p.category) {
      const dept = p.department as ProductCategory;
      categoryCountMap.set(dept, (categoryCountMap.get(dept) || 0) + 1);
    }
    if (p.brand && p.brand.trim()) {
      const b = p.brand.trim();
      brandCountMap.set(b, (brandCountMap.get(b) || 0) + 1);
    }
    storeCountMap.set(p.originStore, (storeCountMap.get(p.originStore) || 0) + 1);
  }

  const categories = STORE_CATEGORIES.filter((cat) => cat !== 'All Departments (Mega Store)')
    .map((cat) => ({ category: cat, count: categoryCountMap.get(cat) || 0 }))
    .filter((entry) => {
      if (entry.count <= 0) return false;
      if (!cleanQuery) return true;
      return entry.category.toLowerCase().includes(cleanQuery);
    })
    .slice(0, cleanQuery ? 4 : 5);

  const brands = Array.from(brandCountMap.entries())
    .map(([brand, count]) => ({ brand, count }))
    .filter((entry) => {
      if (!cleanQuery) return entry.count >= 2;
      return entry.brand.toLowerCase().includes(cleanQuery);
    })
    .sort((a, b) => {
      if (cleanQuery) {
        const aStarts = a.brand.toLowerCase().startsWith(cleanQuery) ? 1 : 0;
        const bStarts = b.brand.toLowerCase().startsWith(cleanQuery) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
      }
      return b.count - a.count;
    })
    .slice(0, 5);

  const stores = PARTNER_STORE_LIST.map((store) => ({
    store,
    count: storeCountMap.get(store) || 0
  }))
    .filter((entry) => {
      if (entry.count <= 0) return false;
      if (!cleanQuery) return false;
      return entry.store.toLowerCase().includes(cleanQuery);
    })
    .slice(0, 4);

  if (!cleanQuery) {
    return {
      queryTerms,
      categories,
      brands,
      stores: [],
      products: products.slice(0, Math.min(4, limitProducts)),
      totalMatchingProducts: products.length
    };
  }

  const scored = products
    .map((product) => ({
      product,
      ...scoreProductSearchMatch(product, cleanQuery, scope)
    }))
    .filter((entry) => entry.matched)
    .sort((a, b) => b.score - a.score);

  return {
    queryTerms,
    categories,
    brands,
    stores,
    products: scored.slice(0, limitProducts).map((entry) => entry.product),
    totalMatchingProducts: scored.length
  };
}
