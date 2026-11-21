import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingCart, ShoppingBag, ShieldCheck, Truck, ExternalLink, Layers, Award, Copy, ZoomIn, ZoomOut } from 'lucide-react';
import { EcomProduct } from '../data/unifiedProductsData';
import { getContextualSponsors } from '../data/sponsorsData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { ResilientImage } from './ResilientImage';

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
  const { addToCart, formatPrice, ratesDisclaimer, cart } = useCart();
  const { sponsors, getAffiliateBuyUrl, recordAffiliateClick } = useProducts();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'highlights' | 'specs' | 'guarantee'>('highlights');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab('highlights');
    setQuantity(1);
    setCopiedLink(false);
    setIsZoomed(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const currentImage = product.galleryImages[activeImageIndex] || product.mainImage;
  const hasKnownPrice =
    product.nativeCurrency === 'BDT'
      ? typeof product.nativePrice === 'number' && product.nativePrice > 0
      : product.price > 0;

  const savedCount = cart.find((item) => item.product.id === product.id)?.quantity || 0;
  const buyUrl = getAffiliateBuyUrl(product);

  const handleDirectAdd = () => {
    addToCart(
      {
        id: product.id,
        asin: product.asin,
        title: product.title,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        badge: product.badge,
        description: product.description,
        highlights: product.highlights,
        specs: product.specs,
        image: product.mainImage,
        nativePrice: product.nativePrice,
        nativeCurrency: product.nativeCurrency,
        priceStatus: product.priceStatus,
        imageIsIllustrative: product.imageIsIllustrative,
        urlKind: product.urlKind,
        csvCategory: product.csvCategory,
        sourceType: product.sourceType,
        originStore: product.originStore,
        affiliateUrl: buyUrl
      },
      quantity
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(buyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isShopz = product.originStore === 'Shopz BD';
  const isReleva = product.originStore === 'Releva BD';
  const isExonHost = product.originStore === 'ExonHost';
  const isAlibaba = product.originStore === 'Alibaba';
  const isBanglaShoppers = product.originStore === 'BanglaShoppers';
  const isIllin = product.originStore === 'Illin BD';
  const isStarTech = product.originStore === 'Star Tech';
  const isSohoj = product.originStore === 'Sohoj Affiliates';
  const isDarkCta = isAlibaba || isBanglaShoppers || isStarTech || isSohoj;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl border border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product view"
          className="sticky sm:absolute top-3 right-3 sm:top-4 sm:right-4 float-right sm:float-none z-20 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/95 dark:bg-slate-800/95 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors shadow-sm cursor-pointer m-2 sm:m-0"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 clear-both sm:clear-none">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/50 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {product.brand}
                </span>

                {product.asin && (
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    ASIN: {product.asin}
                  </span>
                )}
              </div>

              <div
                onClick={() => setIsZoomed((prev) => !prev)}
                onTouchStart={(e) => setTouchStartX(e.changedTouches[0]?.clientX ?? null)}
                onTouchEnd={(e) => {
                  if (touchStartX === null || product.galleryImages.length <= 1) return;
                  const delta = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
                  if (Math.abs(delta) > 40) {
                    setActiveImageIndex((prev) =>
                      delta < 0
                        ? (prev + 1) % product.galleryImages.length
                        : (prev - 1 + product.galleryImages.length) % product.galleryImages.length
                    );
                  }
                  setTouchStartX(null);
                }}
                title={isZoomed ? 'Click to reset zoom' : 'Click to inspect closer'}
                className={`relative w-full aspect-[4/3] max-h-[46dvh] sm:max-h-[50dvh] lg:max-h-none rounded-xl bg-white p-2 sm:p-3 border border-slate-200/80 dark:border-slate-700 shadow-xs mb-4 flex items-center justify-center ${
                  isZoomed ? 'overflow-auto cursor-zoom-out' : 'overflow-hidden cursor-zoom-in'
                }`}
              >
                <ResilientImage
                  src={currentImage}
                  alt={product.title}
                  priority
                  className={`transition-transform duration-300 object-contain ${
                    isZoomed ? 'scale-150 sm:scale-165 cursor-zoom-out' : 'max-w-full max-h-full w-auto h-auto'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {product.badge && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider pointer-events-none">
                    {product.badge}
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed((prev) => !prev);
                  }}
                  aria-label={isZoomed ? 'Zoom out product image' : 'Zoom in product image'}
                  className="absolute bottom-2.5 right-2.5 min-h-[44px] min-w-[44px] px-2.5 py-2 rounded-lg bg-slate-900/85 hover:bg-slate-900 text-white shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1 text-[11px] font-semibold"
                >
                  {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isZoomed ? 'Reset' : 'Zoom'}</span>
                </button>
              </div>

              {product.galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsZoomed(false);
                      }}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white p-1 border-2 transition-all cursor-pointer shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-slate-900 dark:border-amber-400 shadow-xs scale-103'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <ResilientImage src={img} alt="Thumbnail view" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{product.deliveryEstimate}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Stock, full specifications, shipping, and return options are finalized directly on {product.originStore}.
              </p>
            </div>
          </div>

          {/* Right Column: Purchase Module & Tabs */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 lg:pr-10">
                <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                  {product.csvCategory ? `${product.category} · ${product.csvCategory}` : product.category}
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Partner: {product.originStore}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-3 [text-wrap:balance]">
                {product.title}
              </h2>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700 mb-4 space-y-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
                    {hasKnownPrice
                      ? formatPrice(product.price, product.nativePrice, product.nativeCurrency)
                      : `Check live price on ${product.originStore}`}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {hasKnownPrice ? 'Listed Price' : 'Live Partner Pricing'}
                  </span>
                </div>
                {hasKnownPrice && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{ratesDisclaimer}</p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                {product.description}
              </p>

              {/* Tab Navigation */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 text-xs font-medium overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('highlights')}
                  className={`px-3.5 min-h-[44px] py-2 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'highlights'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Key Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`px-3.5 min-h-[44px] py-2 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'specs'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('guarantee')}
                  className={`px-3.5 min-h-[44px] py-2 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'guarantee'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Shipping &amp; Checkout
                </button>
              </div>

              {activeTab === 'highlights' && (
                <ul className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-2 mb-6 text-xs">
                  {product.specs.map((s, i) => (
                    <div key={i} className="flex justify-between gap-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 text-right">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'guarantee' && (
                <div className="p-4 bg-amber-50/70 dark:bg-amber-500/15 rounded-xl border border-amber-200/80 dark:border-amber-500/30 mb-6 text-xs text-amber-950 dark:text-amber-200 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Direct {product.originStore} Checkout</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                    Camellia Shop is a curated affiliate storefront. All checkout, payment, live pricing, stock availability, shipping speed, returns, and customer support occur directly on {product.originStore}.
                  </p>
                </div>
              )}
            </div>

            {/* DUAL PURCHASE ACTIONS */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={() => recordAffiliateClick(product.id, product.originStore, product.category)}
                  className={`flex-1 min-h-[46px] py-3 px-4 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg whitespace-nowrap ${
                    isExonHost
                      ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                      : isShopz
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : isBanglaShoppers
                      ? 'bg-rose-500 hover:bg-rose-400 text-white'
                      : isIllin
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                      : isStarTech
                      ? 'bg-orange-600 hover:bg-orange-500 text-white'
                      : isSohoj
                      ? 'bg-violet-600 hover:bg-violet-500 text-white'
                      : isReleva
                      ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                      : isAlibaba
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {product.urlKind === 'portal'
                      ? `Open ${product.originStore}`
                      : `View on ${product.originStore}`}
                  </span>
                  <ExternalLink className={`w-4 h-4 shrink-0 ${isDarkCta ? 'text-white' : 'text-slate-900'}`} />
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Copy affiliate link"
                  className="min-h-[46px] py-3 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="min-h-[42px] px-3 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold font-mono tabular-nums text-slate-800 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="min-h-[42px] px-3 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDirectAdd}
                  className={`flex-1 min-h-[42px] py-2.5 px-4 rounded-lg text-xs font-semibold dark:font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap ${
                    savedCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950'
                  }`}
                >
                  {savedCount > 0 ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                  <span>{savedCount > 0 ? `Saved in List (${savedCount}) · +Add` : 'Save to List'}</span>
                </button>

                {onToggleCompare && (
                  <button
                    type="button"
                    onClick={() => onToggleCompare(product)}
                    className={`min-h-[42px] min-w-[42px] p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center justify-center ${
                      isCompared
                        ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={isCompared ? 'Remove from comparison' : 'Compare product'}
                    aria-label={isCompared ? 'Remove from comparison' : 'Compare product'}
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400 text-center pt-2">
                <div className="flex flex-col items-center">
                  <Truck className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                  <span>Shipping on Partner</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                  <span>Partner Checkout</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                  <span>Partner Terms</span>
                </div>
              </div>

              {getContextualSponsors(sponsors, product.category, 1).map((sp) => (
                <a
                  key={sp.id}
                  href={sp.url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={() => recordAffiliateClick(sp.id)}
                  className="mt-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <span className="truncate">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Sponsored</span>
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    <span className="font-medium">{sp.title}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold shrink-0 whitespace-nowrap">
                    <span>{sp.ctaLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
