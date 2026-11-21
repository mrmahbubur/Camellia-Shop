import React from 'react';
import {
  Search,
  Clock,
  TrendingUp,
  FolderOpen,
  Tag,
  Store,
  ExternalLink,
  X,
  ArrowUpRight
} from 'lucide-react';
import type { EcomProduct, ProductCategory } from '../data/unifiedProductsData';
import type { PartnerStoreOrigin } from '../utils/regionProfile';
import type { SearchSuggestionsResult } from '../utils/catalogSearch';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { ResilientImage } from './ResilientImage';

interface SearchSuggestionsDropdownProps {
  isOpen: boolean;
  query: string;
  suggestions: SearchSuggestionsResult<EcomProduct>;
  onSelectQuery: (term: string) => void;
  onRemoveRecent: (term: string) => void;
  onClearRecent: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  onSelectBrand: (brand: string) => void;
  onSelectStore: (store: PartnerStoreOrigin) => void;
  onSelectProduct: (product: EcomProduct) => void;
  onClose: () => void;
  highlightedActionId?: string | null;
}

export const SearchSuggestionsDropdown: React.FC<SearchSuggestionsDropdownProps> = ({
  isOpen,
  query,
  suggestions,
  onSelectQuery,
  onRemoveRecent,
  onClearRecent,
  onSelectCategory,
  onSelectBrand,
  onSelectStore,
  onSelectProduct,
  onClose,
  highlightedActionId
}) => {
  const { formatPrice } = useCart();
  const {
    getAmazonSearchAffiliateUrl,
    getShopzSearchAffiliateUrl,
    getRelevaSearchUrl,
    recordAffiliateClick
  } = useProducts();

  if (!isOpen) return null;

  const cleanQuery = query.trim();
  const recentItems = suggestions.queryTerms.filter((t) => t.kind === 'recent');
  const popularItems = suggestions.queryTerms.filter((t) => t.kind === 'popular');

  const hasAnyContent =
    suggestions.queryTerms.length > 0 ||
    suggestions.categories.length > 0 ||
    suggestions.brands.length > 0 ||
    suggestions.stores.length > 0 ||
    suggestions.products.length > 0 ||
    cleanQuery.length > 0;

  if (!hasAnyContent) return null;

  return (
    <div
      role="listbox"
      aria-label="Search suggestions"
      className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden max-h-[75dvh] overflow-y-auto overscroll-contain text-left"
    >
      {/* Query Summary Header */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-semibold flex items-center gap-1.5 min-w-0 truncate">
          <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="truncate">
            {cleanQuery
              ? `${suggestions.totalMatchingProducts} catalog matches for "${cleanQuery}"`
              : 'Search Suggestions · Categories, Brands & Popular Queries'}
          </span>
        </span>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onClose();
          }}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center rounded cursor-pointer shrink-0"
          aria-label="Close suggestions"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {/* Recent Searches */}
        {recentItems.length > 0 && (
          <div className="p-3 sm:px-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Recent Searches</span>
              </span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onClearRecent();
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-2 cursor-pointer"
              >
                Clear history
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className={`inline-flex items-center rounded-lg border text-xs transition-colors ${
                    highlightedActionId === item.id
                      ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400'
                  }`}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectQuery(item.label);
                    }}
                    className="px-3 min-h-[44px] py-2 font-medium cursor-pointer flex items-center gap-1.5"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveRecent(item.label);
                    }}
                    aria-label={`Remove ${item.label} from recent searches`}
                    className="min-h-[44px] min-w-[38px] pr-2.5 py-2 text-slate-400 hover:text-rose-500 cursor-pointer flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Search Terms */}
        {popularItems.length > 0 && (
          <div className="p-3 sm:px-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Suggested Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectQuery(item.label);
                  }}
                  className={`px-3 min-h-[44px] py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    highlightedActionId === item.id
                      ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Search className="w-3 h-3 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Matching Categories, Brands, and Stores */}
        {(suggestions.categories.length > 0 ||
          suggestions.brands.length > 0 ||
          suggestions.stores.length > 0) && (
          <div className="p-3 sm:px-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 dark:bg-slate-950/30">
            {suggestions.categories.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <FolderOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Categories</span>
                </div>
                <div className="space-y-1">
                  {suggestions.categories.map((entry) => (
                    <button
                      key={entry.category}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelectCategory(entry.category);
                      }}
                      className="w-full text-left px-3 min-h-[44px] py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <span className="truncate">{entry.category}</span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
                        {entry.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {suggestions.brands.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <Tag className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Brands</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.brands.map((entry) => (
                      <button
                        key={entry.brand}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onSelectBrand(entry.brand);
                        }}
                        className="px-3 min-h-[44px] py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>{entry.brand}</span>
                        <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                          ({entry.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.stores.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <Store className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                    <span>Partner Stores</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.stores.map((entry) => (
                      <button
                        key={entry.store}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onSelectStore(entry.store);
                        }}
                        className="px-3 min-h-[44px] py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-400 text-xs font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>{entry.store}</span>
                        <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                          ({entry.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instant Matching Product Previews */}
        {suggestions.products.length > 0 && (
          <div className="p-3 sm:px-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {cleanQuery ? 'Matching Products' : 'Featured Products'}
            </div>
            <div className="space-y-1">
              {suggestions.products.map((product) => {
                const actionId = `product-${product.id}`;
                const knownPrice =
                  product.nativeCurrency === 'BDT'
                    ? typeof product.nativePrice === 'number' && product.nativePrice > 0
                    : product.price > 0;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectProduct(product);
                    }}
                    className={`w-full text-left p-2 rounded-xl border transition-colors flex items-center gap-3 cursor-pointer ${
                      highlightedActionId === actionId
                        ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-400'
                        : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
                      <ResilientImage
                        src={product.mainImage}
                        alt={product.title}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {product.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                          {product.originStore}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.csvCategory || product.category}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="text-xs font-mono font-bold tabular-nums text-slate-800 dark:text-slate-100">
                        {knownPrice
                          ? formatPrice(product.price, product.nativePrice, product.nativeCurrency)
                          : 'See Partner'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Direct Partner Live Search Footer */}
        {cleanQuery.length > 0 && (
          <div className="p-3 sm:px-4 bg-slate-50 dark:bg-slate-950/70 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Search &quot;{cleanQuery}&quot; live on partner stores:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <a
                href={getAmazonSearchAffiliateUrl(cleanQuery)}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onMouseDown={() => recordAffiliateClick('suggest-search-amazon', 'Amazon')}
                className="px-3 min-h-[44px] py-2 rounded-lg bg-[#FF9900] hover:bg-[#e88b00] text-slate-950 font-bold text-xs inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>Amazon</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={getShopzSearchAffiliateUrl(cleanQuery)}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onMouseDown={() => recordAffiliateClick('suggest-search-shopz', 'Shopz BD')}
                className="px-3 min-h-[44px] py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>Shopz BD</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={getRelevaSearchUrl(cleanQuery)}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onMouseDown={() => recordAffiliateClick('suggest-search-releva', 'Releva BD')}
                className="px-3 min-h-[44px] py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>Releva BD</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
