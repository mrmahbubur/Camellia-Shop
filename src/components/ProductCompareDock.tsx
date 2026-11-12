import React, { useState } from 'react';
import { Layers, X, ExternalLink, Star } from 'lucide-react';
import { EcomProduct } from '../data/unifiedProductsData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

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

  if (comparedProducts.length === 0) return null;

  return (
    <>
      {/* Sticky Bottom Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-fade-in max-w-xl w-[92%] sm:w-auto">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white">Compare</span>
          <span className="text-[11px] font-mono text-slate-400">({comparedProducts.length}/3)</span>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2">
          {comparedProducts.map((p) => (
            <div key={p.id} className="relative group">
              <img
                src={p.mainImage}
                alt={p.title}
                className="w-9 h-9 object-cover rounded-lg border border-slate-700 bg-white"
              />
              <button
                onClick={() => onRemove(p.id)}
                className="absolute -top-1.5 -right-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-full p-0.5 cursor-pointer"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Compare Specs
          </button>
          <button
            onClick={onClear}
            className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                  Side-by-Side Product Comparison
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Compare Specs &amp; Partner Pricing
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 bg-slate-50 font-bold text-slate-700 w-1/4">Feature</th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="p-3 font-bold text-slate-900 text-center">
                        <img
                          src={p.mainImage}
                          alt={p.title}
                          className="w-16 h-16 object-cover rounded-lg mx-auto mb-2 border border-slate-200"
                        />
                        <div className="line-clamp-2 text-xs font-semibold">{p.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 bg-slate-50">Price</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center font-mono font-bold text-sm text-slate-900">
                        {p.price > 0 ? formatPrice(p.price) : 'Partner Pricing'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 bg-slate-50">Customer Rating</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center">
                        {p.rating > 0 ? (
                          <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{p.rating}</span>
                            <span className="text-slate-400 font-normal">({p.reviewsCount.toLocaleString()})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Saved Listing</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 bg-slate-50">Category</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-slate-700 font-medium">
                        {p.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 bg-slate-50">Fulfillment</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-emerald-700 font-semibold">
                        {p.originStore === 'Shopz BD'
                          ? 'Shopz BD Courier'
                          : p.primeEligible
                          ? 'Free Prime 1-2 Day'
                          : 'Standard Shipping'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 bg-slate-50">Direct Purchase Outlet</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center">
                        <a
                          href={getAffiliateBuyUrl(p)}
                          target="_blank"
                          rel="noreferrer noopener sponsored"
                          onClick={() => recordAffiliateClick(p.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 text-slate-950 font-bold rounded-lg text-xs shadow-xs ${
                            p.originStore === 'Shopz BD'
                              ? 'bg-emerald-500 hover:bg-emerald-400'
                              : 'bg-[#FF9900] hover:bg-[#e88b00]'
                          }`}
                        >
                          <span>Buy on {p.originStore}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
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
