import React, { useMemo } from 'react';
import { useProducts } from '../context/ProductsContext';
import { PartnerStoreOrigin } from '../utils/regionProfile';

const STORE_FILTER_TABS = [
  { key: 'all', label: 'All Stores', activeClass: 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white' },
  { key: 'Amazon', label: 'Amazon', activeClass: 'bg-amber-400 text-slate-950' },
  { key: 'AliExpress', label: 'AliExpress', activeClass: 'bg-red-600 text-white' },
  { key: 'Shopz BD', label: 'Shopz BD', activeClass: 'bg-emerald-500 text-slate-950' },
  { key: 'Star Tech', label: 'Star Tech', activeClass: 'bg-orange-600 text-white' },
  { key: 'BanglaShoppers', label: 'BanglaShoppers', activeClass: 'bg-rose-500 text-white' },
  { key: 'Illin BD', label: 'Illin BD', activeClass: 'bg-cyan-400 text-slate-950' },
  { key: 'Releva BD', label: 'Releva BD', activeClass: 'bg-teal-400 text-slate-950' },
  { key: 'ExonHost', label: 'ExonHost', activeClass: 'bg-sky-500 text-slate-950' },
  { key: 'Sohoj Affiliates', label: 'Sohoj Affiliates', activeClass: 'bg-violet-600 text-white' }
] as const;

export const StoreFilterBar: React.FC = () => {
  const { products, selectedStoreFilter, setSelectedStoreFilter } = useProducts();

  const storeCounts = useMemo(() => {
    const counts: Record<'all' | PartnerStoreOrigin, number> = {
      all: products.length,
      Amazon: 0,
      AliExpress: 0,
      'Shopz BD': 0,
      'Releva BD': 0,
      ExonHost: 0,
      BanglaShoppers: 0,
      'Illin BD': 0,
      'Star Tech': 0,
      'Sohoj Affiliates': 0
    };
    for (const item of products) {
      if (item.originStore in counts) {
        counts[item.originStore] += 1;
      }
    }
    return counts;
  }, [products]);

  return (
    <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-4 transition-colors">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        {/* Store Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
          {STORE_FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStoreFilter(tab.key)}
              className={`px-3 min-h-[44px] py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1 ${
                selectedStoreFilter === tab.key
                  ? `${tab.activeClass} shadow-2xs`
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="font-mono text-[10px] opacity-75">
                ({storeCounts[tab.key]})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
