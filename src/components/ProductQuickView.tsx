import React, { useState } from 'react';
import { X, Star, Check, ShoppingBag, Shield, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../data/shopData';
import { useCart } from '../context/CartContext';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const { addToCart, formatPrice } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'highlights' | 'specs'>('highlights');

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Product Image Area */}
          <div className="bg-slate-50 p-6 flex items-center justify-center relative min-h-[300px]">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[340px] w-full object-cover rounded-xl shadow-xs"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Details Area */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="uppercase tracking-wider font-semibold text-slate-400">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-semibold text-slate-700 tabular-nums">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-900 leading-snug mb-3">
                {product.title}
              </h2>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-semibold text-emerald-600">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                {product.description}
              </p>

              {/* Segmented Detail Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-4 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('highlights')}
                  className={`flex-1 py-1.5 px-3 rounded-md transition-colors ${
                    activeTab === 'highlights'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Key Highlights
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-1.5 px-3 rounded-md transition-colors ${
                    activeTab === 'specs'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Technical Specs
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'highlights' ? (
                <ul className="space-y-2 mb-6">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-1.5 mb-6 text-xs">
                  {product.specs.map((s, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">{s.label}</span>
                      <span className="font-medium text-slate-800">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase Row */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-semibold font-mono tabular-nums text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag · {formatPrice(product.price * quantity)}</span>
                </button>
              </div>

              {/* Direct Amazon Prime Option */}
              <a
                href={product.id.includes('mouse') || product.id.includes('headphones') ? 'https://link.amazon/B0ae4X6pk' : 'https://link.amazon/B0dPHChnk'}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full py-2.5 px-4 bg-[#FF9900] hover:bg-[#e88b00] text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Prefer Amazon? Buy on Amazon Prime (Fast Shipping)</span>
                <span className="text-[11px]">↗</span>
              </a>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 text-center pt-2">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Free shipping &gt;$50</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>30-Day Guarantee</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Instant or 3-Day Delivery</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
