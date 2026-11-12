import React, { useState } from 'react';
import { X, Star, Check, ShoppingCart, ShoppingBag, ShieldCheck, Zap, Truck, ArrowRight, ExternalLink, Layers, Award, Clock } from 'lucide-react';
import { EcomProduct } from '../data/unifiedProductsData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

interface ModernProductModalProps {
  product: EcomProduct | null;
  onClose: () => void;
  onToggleCompare?: (product: EcomProduct) => void;
  isCompared?: boolean;
}

export const ModernProductModal: React.FC<ModernProductModalProps> = ({
  product,
  onClose,
  onToggleCompare,
  isCompared = false
}) => {
  const { addToCart, formatPrice } = useCart();
  const { getAffiliateBuyUrl, recordAffiliateClick } = useProducts();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'highlights' | 'specs' | 'reviews' | 'guarantee'>('highlights');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const currentImage = product.galleryImages[activeImageIndex] || product.mainImage;
  const savingsAmount = product.originalPrice ? product.originalPrice - product.price : 0;
  const savingsPercent = product.originalPrice
    ? Math.round((savingsAmount / product.originalPrice) * 100)
    : 0;

  const handleDirectAdd = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        category: 'Workspace Gear',
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        inStock: product.inStock,
        stockCount: product.stockCount,
        badge: product.badge,
        description: product.description,
        highlights: product.highlights,
        specs: product.specs,
        image: product.mainImage,
        isDigital: product.isDigital
      },
      quantity
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(product.affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-800 bg-white/90 hover:bg-slate-100 rounded-full transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Image Showcase (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
            <div>
              {/* Badges Bar */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {product.brand}
                </span>

                {product.asin && (
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    ASIN: {product.asin}
                  </span>
                )}
              </div>

              {/* Main Image Display */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-xs mb-4 flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                />

                {product.badge && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}

                {product.primeEligible && (
                  <span className="absolute bottom-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
                    <span className="text-amber-400 font-extrabold italic">prime</span>
                    <span className="text-[10px] text-slate-300">Fast Express</span>
                  </span>
                )}
              </div>

              {/* Multi-Angle Thumbnail Strip */}
              {product.galleryImages.length > 1 && (
                <div className="flex items-center gap-2">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-slate-900 shadow-xs scale-103'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* In-Stock & Delivery Guarantee */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>In Stock &amp; Ready to Ship ({product.stockCount} available)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{product.deliveryEstimate}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contiguous Purchase Module & Tabs (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-amber-700 uppercase tracking-wider text-[11px]">
                  {product.category}
                </span>

                {product.rating > 0 ? (
                  <div className="flex items-center gap-1 text-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold tabular-nums">{product.rating}</span>
                    <span className="text-slate-400 tabular-nums">({product.reviewsCount.toLocaleString()} verified ratings)</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Saved Custom Listing
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3 [text-wrap:balance]">
                {product.title}
              </h2>

              {/* Price & Savings Strip */}
              <div className="flex items-baseline gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
                  {product.price > 0 ? formatPrice(product.price) : 'Partner Pricing'}
                </span>
                {product.originalPrice && product.price > 0 && (
                  <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {savingsAmount > 0 && product.price > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save {formatPrice(savingsAmount)} ({savingsPercent}% OFF)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Tab Navigation (Highlights, Specs, Reviews, Affiliate Note) */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-4 text-xs font-medium overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab('highlights')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'highlights' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Key Highlights
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'specs' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Technical Specs
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Verified Reviews ({product.reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('guarantee')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'guarantee' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Amazon Buyer Policy
                </button>
              </div>

              {/* Tab 1: Highlights */}
              {activeTab === 'highlights' && (
                <ul className="space-y-2 mb-6 text-xs text-slate-600">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tab 2: Technical Specifications */}
              {activeTab === 'specs' && (
                <div className="space-y-2 mb-6 text-xs">
                  {product.specs.map((s, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">{s.label}</span>
                      <span className="font-semibold text-slate-800 text-right">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Verified Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-3 mb-6 text-xs max-h-52 overflow-y-auto pr-1">
                  {product.reviews.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-500 text-xs">
                      No local reviews recorded for this custom listing. View live customer reviews directly on {product.originStore}.
                    </div>
                  ) : (
                    product.reviews.map((r, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{r.author}</span>
                          <span className="text-slate-400 text-[11px]">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: r.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-current" />
                          ))}
                          {r.verifiedAmazonPurchase && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded ml-1 font-semibold">
                              Amazon Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-800 text-[11px]">{r.title}</div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">&quot;{r.comment}&quot;</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 4: Partner Buyer Guarantee */}
              {activeTab === 'guarantee' && (
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 mb-6 text-xs text-amber-950 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      {product.originStore === 'Shopz BD'
                        ? 'Official Shopz BD Referral Fulfillment'
                        : 'Official Amazon A-to-z Buyer Guarantee'}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700">
                    {product.originStore === 'Shopz BD'
                      ? 'Purchases routed through our Shopz BD referral link include official courier tracking and genuine product warranty across Bangladesh.'
                      : 'Purchases routed through our official link are covered by Amazon’s 30-day hassle-free return window, authentic manufacturer warranty, and official Amazon checkout.'}
                  </p>
                </div>
              )}
            </div>

            {/* DUAL PURCHASE ACTIONS (High-Converting Conversion Engine) */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              
              {/* Official Amazon Prime Buyer Protection Badge */}
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-xs flex items-center justify-between text-amber-950 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official Amazon Prime Fulfillment · 30-Day A-to-z Guarantee</span>
                </span>
                <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded text-amber-950 font-bold">Verified Prime</span>
              </div>

              {/* Primary Partner Purchase Button */}
              <a
                href={getAffiliateBuyUrl(product)}
                target="_blank"
                rel="noreferrer noopener sponsored"
                onClick={() => recordAffiliateClick(product.id)}
                className={`w-full py-3.5 px-4 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg whitespace-nowrap ${
                  product.originStore === 'Shopz BD'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {product.originStore === 'Shopz BD' ? 'Buy on Shopz BD' : 'Buy on Amazon Prime'}
                  {product.price > 0 ? ` · ${formatPrice(product.price)}` : ''}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-900 ml-1" />
              </a>

              {/* Secondary Direct Bag Action */}
              {product.price > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 rounded-l-lg transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold font-mono tabular-nums text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 rounded-r-lg transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleDirectAdd}
                    className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Store Bag</span>
                  </button>

                  {onToggleCompare && (
                    <button
                      onClick={() => onToggleCompare(product)}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        isCompared
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                      title={isCompared ? 'Remove from comparison' : 'Compare product'}
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Guarantees Strip */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 text-center pt-2">
                <div className="flex flex-col items-center">
                  <Truck className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                  <span>Prime 1-2 Day</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                  <span>Official Warranty</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
