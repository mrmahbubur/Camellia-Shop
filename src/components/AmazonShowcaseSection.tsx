import React, { useMemo, useState } from 'react';
import { ExternalLink, Check, Zap, ShoppingCart, ShoppingBag, ShieldCheck, Eye } from 'lucide-react';
import { AMAZON_PRODUCTS } from '../data/amazonProductsData';
import { EcomProduct } from '../data/unifiedProductsData';
import { getContextualSponsors } from '../data/sponsorsData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { ModernProductModal } from './ModernProductModal';
import { ResilientImage } from './ResilientImage';

export const AmazonShowcaseSection: React.FC = () => {
  const { addToCart, cart } = useCart();
  const { products, sponsors, recordAffiliateClick, amazonStoreUrl, amazonShortUrl } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalProduct, setModalProduct] = useState<EcomProduct | null>(null);

  const categories = [
    'All',
    'Keyboards & Mice',
    'Lighting & Ergonomics',
    'Audio & Studio',
    'Storage & Power'
  ];

  const catalogById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const savedIds = useMemo(() => new Set(cart.map((c) => c.product.id)), [cart]);

  const filteredProducts = AMAZON_PRODUCTS.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const resolveModalProduct = (item: (typeof AMAZON_PRODUCTS)[number]): EcomProduct => {
    const matched = catalogById.get(item.id);
    if (matched) return matched;
    return {
      id: item.id,
      asin: item.asin,
      title: item.title,
      brand: item.title.split(' ')[0] || 'Amazon Partner',
      category: 'Electronics & Gadgets',
      department: 'Amazon Associates Picks',
      sourceType: 'linked-shop',
      price: 0,
      priceStatus: 'live-at-partner',
      badge: item.badge,
      primeEligible: false,
      deliveryEstimate: item.deliveryInfo,
      affiliateUrl: item.affiliateUrl,
      urlKind: 'product',
      imageIsIllustrative: item.imageIsIllustrative,
      mainImage: item.image,
      galleryImages: [item.image],
      description: item.description,
      highlights: item.features,
      specs: [{ label: 'ASIN', value: item.asin }],
      originStore: 'Amazon'
    };
  };

  return (
    <section
      id="amazon-products"
      className="py-12 sm:py-16 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-amber-600 dark:text-amber-400 font-bold">Amazon Picks</span>
              <span aria-hidden="true">·</span>
              <span>{AMAZON_PRODUCTS.length} Featured Products</span>
            </div>
            <h2 className="text-[clamp(1.375rem,2.4vw,1.875rem)] font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Featured Tech &amp; Workspace Gear on Amazon
            </h2>
          </div>

          <a
            href={amazonStoreUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={() => recordAffiliateClick('amazon-header-store', 'Amazon')}
            className="px-4 min-h-[44px] py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
          >
            <span>Explore Amazon Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 sm:mb-8 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 min-h-[44px] py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === c
                  ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-xs font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Amazon Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 min-[1025px]:grid-cols-4 min-[1441px]:grid-cols-5 gap-2.5 sm:gap-4 min-[1025px]:gap-5 xl:gap-6 items-stretch mb-8">
          {filteredProducts.map((product) => {
            const fullProduct = resolveModalProduct(product);
            const isSaved = savedIds.has(product.id);

            return (
              <article
                key={product.id}
                onClick={() => setModalProduct(fullProduct)}
                className="h-full min-w-0 responsive-card group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Product Visual */}
                <div className="relative w-full aspect-[4/3] bg-white p-2 sm:p-3 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <ResilientImage
                    src={product.image}
                    alt={product.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain responsive-card-media"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Product Info */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between gap-2 sm:gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2 min-w-0">
                      <span className="bg-amber-500 text-slate-950 font-bold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider truncate max-w-[60%]">
                        {product.badge || 'Amazon'}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate min-w-0">
                        {product.asin}
                      </span>
                    </div>

                    <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate mb-0.5 sm:mb-1">
                      {product.category}
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2.5 leading-snug line-clamp-2 min-h-[2.125rem] sm:min-h-[2.5rem] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>

                    <ul className="space-y-1 text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400">
                      {product.features.slice(0, 2).map((f, i) => (
                        <li key={i} className="flex items-start gap-1 sm:gap-1.5 min-w-0">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & Direct Purchase CTA */}
                  <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 sm:space-y-2.5 min-w-0">
                    <div className="flex items-baseline justify-between gap-1.5 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 truncate">
                        Check live price
                      </span>
                      <span className="hidden sm:inline text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                        Direct Checkout
                      </span>
                    </div>

                    <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 min-w-0">
                      <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{product.deliveryInfo}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 min-w-0">
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          recordAffiliateClick(product.id, 'Amazon', product.category);
                        }}
                        className="w-full min-w-0 min-h-[38px] sm:min-h-[42px] py-1.5 sm:py-2 px-2 sm:px-2.5 bg-[#FF9900] hover:bg-[#e88b00] text-slate-950 font-bold rounded-lg text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span className="truncate">View on Amazon</span>
                        <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                      </a>

                      <div className="grid grid-cols-2 gap-1 sm:gap-1.5 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalProduct(fullProduct);
                          }}
                          aria-label={`Inspect ${product.title} specs`}
                          title={`Inspect ${product.title} specs`}
                          className="min-h-[36px] sm:min-h-[40px] p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(
                              {
                                id: fullProduct.id,
                                asin: fullProduct.asin,
                                title: fullProduct.title,
                                category: fullProduct.category,
                                price: 0,
                                priceStatus: 'live-at-partner',
                                imageIsIllustrative: fullProduct.imageIsIllustrative ?? false,
                                urlKind: 'product',
                                badge: fullProduct.badge,
                                description: fullProduct.description,
                                highlights: fullProduct.highlights,
                                specs: fullProduct.specs,
                                image: fullProduct.mainImage,
                                originStore: 'Amazon',
                                affiliateUrl: fullProduct.affiliateUrl
                              },
                              1
                            );
                          }}
                          title={isSaved ? 'Saved in list (click to add another)' : 'Save to List'}
                          aria-label={`Save ${product.title} to List`}
                          className={`min-h-[36px] sm:min-h-[40px] p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                            isSaved
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                          }`}
                        >
                          {isSaved ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Contextual Sponsored Partner Offers */}
        {sponsors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {getContextualSponsors(sponsors, selectedCategory, 2).map((sp) => (
              <a
                key={sp.id}
                href={sp.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => recordAffiliateClick(sp.id)}
                className="responsive-card group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center justify-between gap-4 transition-all duration-200"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className="text-amber-700 dark:text-amber-400">Sponsored</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{sp.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {sp.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    {sp.subtitle}
                  </p>
                </div>
                <span className="px-3 min-h-[44px] py-2 bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-400 text-slate-900 dark:text-slate-100 group-hover:text-slate-950 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-colors">
                  <span>{sp.ctaLabel}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Amazon Affiliate Disclosure Ribbon */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-start sm:items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              As an Amazon Associate, Camellia Shop earns from qualifying purchases. All prices and stock update live on Amazon.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href={amazonStoreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('amazon-ribbon-store', 'Amazon')}
              className="text-amber-800 dark:text-amber-300 font-extrabold hover:underline inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-500/15 px-3 min-h-[44px] py-2 rounded-md border border-amber-200 dark:border-amber-500/30"
            >
              <span>Explore Amazon Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={amazonShortUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('amazon-ribbon-shortlink', 'Amazon')}
              className="text-slate-700 dark:text-slate-200 font-semibold hover:underline inline-flex items-center gap-1 min-h-[44px] px-1"
            >
              <span>Direct Amazon Deals</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <ModernProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </section>
  );
};
