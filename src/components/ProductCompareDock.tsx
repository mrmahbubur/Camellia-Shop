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
      <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 bg-slate-900 dark:bg-slate-800 text-white px-3 sm:px-5 py-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-2 sm:gap-4 sm:max-w-xl sm:w-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Layers className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-white hidden sm:inline">Compare</span>
          <span className="text-[11px] font-mono text-slate-300">({comparedProducts.length}/3)</span>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
          {comparedProducts.map((p) => (
            <div key={p.id} className="relative group shrink-0">
              <ResilientImage
                src={p.mainImage}
                alt={p.title}
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain bg-white p-0.5 rounded-lg border border-slate-700"
              />
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                className="absolute -top-1.5 -right-1.5 bg-slate-800 text-slate-200 hover:text-white rounded-full p-1 cursor-pointer border border-slate-600 min-w-[22px] min-h-[22px] flex items-center justify-center"
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
            className="px-3.5 min-h-[44px] py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Compare
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-slate-300 hover:text-white underline cursor-pointer min-h-[44px] px-2"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Compare products side by side"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  Side-by-Side Product Comparison
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white [text-wrap:balance]">
                  Compare Products Side by Side
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close comparison"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stacked Cards View for Small Screens (320px–767px) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {comparedProducts.map((p) => {
                const hasPrice =
                  p.nativeCurrency === 'BDT'
                    ? typeof p.nativePrice === 'number' && p.nativePrice > 0
                    : p.price > 0;
                const detailSpecs = p.specs.filter((s) => s.label !== 'Price').slice(0, 3);
                return (
                  <article
                    key={`stack-${p.id}`}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <ResilientImage
                        src={p.mainImage}
                        alt={p.title}
                        className="w-16 h-16 object-contain bg-white p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          {p.originStore} · {p.brand}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                          {p.title}
                        </h4>
                        <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                          {hasPrice
                            ? formatPrice(p.price, p.nativePrice, p.nativeCurrency)
                            : 'See price on partner'}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-2 border-t border-slate-200/70 dark:border-slate-800">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">Category:</span>{' '}
                        {p.csvCategory ? `${p.category} · ${p.csvCategory}` : p.category}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">Shipping:</span>{' '}
                        {p.deliveryEstimate || `Verified on ${p.originStore}`}
                      </div>
                      {detailSpecs.map((s, idx) => (
                        <div key={idx}>
                          <span className="font-semibold text-slate-800 dark:text-slate-100">{s.label}:</span>{' '}
                          {s.value}
                        </div>
                      ))}
                    </div>

                    <a
                      href={getAffiliateBuyUrl(p)}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      onClick={() => recordAffiliateClick(p.id, p.originStore, p.category)}
                      className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs"
                    >
                      <span>{`View Deal on ${p.originStore}`}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </article>
                );
              })}
            </div>

            {/* Side-by-Side Comparison Table (Tablet Landscape & Desktop >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[600px] text-xs text-left">
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
                          className="w-20 h-20 object-contain bg-white p-1.5 rounded-lg mx-auto mb-2 border border-slate-200 dark:border-slate-700"
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
                          rel="nofollow sponsored noopener noreferrer"
                          onClick={() => recordAffiliateClick(p.id, p.originStore, p.category)}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 min-h-[44px] py-2 font-bold rounded-lg text-xs shadow-xs whitespace-nowrap ${
                            p.originStore === 'ExonHost'
                              ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                              : p.originStore === 'AliExpress'
                              ? 'bg-red-600 hover:bg-red-500 text-white'
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
                              : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                          }`}
                        >
                          <span>{`View Deal on ${p.originStore}`}</span>
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
                className="px-5 min-h-[44px] py-2.5 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-amber-300 cursor-pointer"
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
