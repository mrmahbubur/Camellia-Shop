import React, { useState, useEffect } from 'react';
import { Layers, X, ExternalLink } from 'lucide-react';
import { EcomProduct } from '../data/unifiedProductsData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { ResilientImage } from './ResilientImage';

interface ProductCompareDockProps {
  comparedProducts: EcomProduct[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export const ProductCompareDock: React.FC<ProductCompareDockProps> = ({
  comparedProducts,
  onRemove,
  onClear
}) => {
  const { formatPrice } = useCart();
  const { getAffiliateBuyUrl, recordAffiliateClick } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  if (comparedProducts.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Dock */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 bg-slate-900 dark:bg-slate-800 text-white px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-2.5 sm:gap-4 sm:max-w-xl sm:w-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Layers className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-white hidden xs:inline">Compare</span>
          <span className="text-[11px] font-mono text-slate-400">({comparedProducts.length}/3)</span>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
          {comparedProducts.map((p) => (
            <div key={p.id} className="relative group shrink-0">
              <ResilientImage
                src={p.mainImage}
                alt={p.title}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain bg-white p-0.5 rounded-lg border border-slate-700"
              />
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                className="absolute -top-1 -right-1 bg-slate-800 text-slate-200 hover:text-white rounded-full p-0.5 cursor-pointer border border-slate-600"
                title="Remove"
                aria-label={`Remove ${p.title} from compare`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 sm:px-3.5 min-h-[36px] py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Compare
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer px-1 py-1"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Compare products side by side"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90dvh] overflow-y-auto overscroll-contain shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  Side-by-Side Product Comparison
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Compare Products Side by Side
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close comparison"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 bg-slate-50 dark:bg-slate-800/70 font-bold text-slate-700 dark:text-slate-200 w-1/4">
                      Attribute
                    </th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="p-3 font-bold text-slate-900 dark:text-white text-center">
                        <ResilientImage
                          src={p.mainImage}
                          alt={p.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain bg-white p-1.5 rounded-lg mx-auto mb-2 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="line-clamp-2 text-xs font-semibold">{p.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40">
                      Partner &amp; Brand
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-slate-800 dark:text-slate-200 font-semibold">
                        {p.originStore} · {p.brand}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40">
                      Pricing Status
                    </td>
                    {comparedProducts.map((p) => {
                      const hasPrice =
                        p.nativeCurrency === 'BDT'
                          ? typeof p.nativePrice === 'number' && p.nativePrice > 0
                          : p.price > 0;
                      return (
                        <td
                          key={p.id}
                          className="p-3 text-center font-mono font-bold text-sm text-slate-900 dark:text-white"
                        >
                          {hasPrice
                            ? formatPrice(p.price, p.nativePrice, p.nativeCurrency)
                            : 'See price on partner'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40">
                      Category
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-slate-700 dark:text-slate-300 font-medium">
                        {p.csvCategory ? `${p.category} · ${p.csvCategory}` : p.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40">
                      Key Details / Specs
                    </td>
                    {comparedProducts.map((p) => {
                      const detailSpecs = p.specs.filter((s) => s.label !== 'Price').slice(0, 3);
                      return (
                        <td key={p.id} className="p-3 text-left text-[11px] text-slate-600 dark:text-slate-300 align-top">
                          <ul className="space-y-1">
                            {detailSpecs.map((s, idx) => (
                              <li key={idx}>
                                <span className="font-semibold text-slate-800 dark:text-slate-100">{s.label}:</span>{' '}
                                {s.value}
                              </li>
                            ))}
                          </ul>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40">
                      Shipping &amp; Terms
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-slate-600 dark:text-slate-300 font-medium">
                        {p.deliveryEstimate || `Verified on ${p.originStore}`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40">
                      Partner Checkout
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center">
                        <a
                          href={getAffiliateBuyUrl(p)}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          onClick={() => recordAffiliateClick(p.id, p.originStore, p.category)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 font-bold rounded-lg text-xs shadow-xs whitespace-nowrap ${
                            p.originStore === 'ExonHost'
                              ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                              : p.originStore === 'Shopz BD'
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                              : p.originStore === 'BanglaShoppers'
                              ? 'bg-rose-500 hover:bg-rose-400 text-white'
                              : p.originStore === 'Illin BD'
                              ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                              : p.originStore === 'Star Tech'
                              ? 'bg-orange-600 hover:bg-orange-500 text-white'
                              : p.originStore === 'Sohoj Affiliates'
                              ? 'bg-violet-600 hover:bg-violet-500 text-white'
                              : p.originStore === 'Releva BD'
                              ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                              : p.originStore === 'Alibaba'
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                          }`}
                        >
                          <span>{`Open on ${p.originStore}`}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end pb-[env(safe-area-inset-bottom)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 min-h-[42px] py-2 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-amber-300 cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
