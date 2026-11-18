import React, { useState } from 'react';
import { ExternalLink, Check, Zap, ShoppingCart, ShoppingBag, ShieldCheck, Info } from 'lucide-react';
import { AMAZON_PRODUCTS } from '../data/amazonProductsData';
import { getContextualSponsors } from '../data/sponsorsData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { ResilientImage } from './ResilientImage';

export const AmazonShowcaseSection: React.FC = () => {
  const { addToCart } = useCart();
  const { sponsors, recordAffiliateClick, amazonStoreUrl, amazonShortUrl } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAmazonInfo, setShowAmazonInfo] = useState(false);

  const categories = [
    'All',
    'Keyboards & Mice',
    'Lighting & Ergonomics',
    'Audio & Studio',
    'Storage & Power'
  ];

  const filteredProducts = AMAZON_PRODUCTS.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  return (
    <section
      id="amazon-products"
      className="py-12 sm:py-16 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-amber-600 dark:text-amber-400 font-bold">Amazon Associates Picks</span>
              <span aria-hidden="true">·</span>
              <span>Direct Product ASIN Links</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Featured Tech &amp; Workspace Gear on Amazon
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAmazonInfo(!showAmazonInfo)}
              className="px-3.5 min-h-[40px] py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{showAmazonInfo ? 'Hide Amazon Info' : 'Amazon Pricing & Checkout Info'}</span>
            </button>
          </div>
        </div>

        {/* Amazon Info Banner */}
        {showAmazonInfo && (
          <div className="p-4 sm:p-5 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-700/40 mb-8 space-y-2 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Direct Amazon Product Page Checkout</span>
              </span>
              <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                Live Price &amp; Stock Verified on Amazon
              </span>
            </div>

            <p className="leading-relaxed">
              Every card below links directly to its Amazon.com product detail page (`/dp/ASIN`) with tag{' '}
              <code className="font-mono">mrxshahin06-20</code>. Live pricing, Prime eligibility, stock status, shipping rates, and return policies are displayed on Amazon rather than cached here.
            </p>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3 min-h-[38px] py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mb-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Product Visual */}
              <div className="relative aspect-4/3 bg-slate-50 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                <ResilientImage
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                  {product.badge || 'Amazon Listing'}
                </span>

                <span className="absolute bottom-2.5 right-2.5 bg-slate-950/75 text-slate-200 text-[10px] px-2 py-0.5 rounded">
                  Illustrative photo
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500 mb-1">
                    <span className="uppercase tracking-wider truncate">{product.category}</span>
                    <span className="font-mono shrink-0">ASIN: {product.asin}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 leading-snug line-clamp-2">
                    {product.title}
                  </h3>

                  <ul className="space-y-1 mb-4 text-[11px] text-slate-600 dark:text-slate-400">
                    {product.features.slice(0, 2).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & Direct Purchase CTA */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                      Check live price on Amazon
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
                      Live at Amazon
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{product.deliveryInfo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      onClick={() => recordAffiliateClick(product.id, 'Amazon', product.category)}
                      className="flex-1 min-h-[40px] py-2.5 px-3 bg-[#FF9900] hover:bg-[#e88b00] text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                      <span>View on Amazon</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          {
                            id: product.id,
                            asin: product.asin,
                            title: product.title,
                            category: product.category,
                            price: 0,
                            priceStatus: 'live-at-partner',
                            imageIsIllustrative: true,
                            urlKind: 'product',
                            badge: product.badge,
                            description: product.description,
                            highlights: product.features,
                            specs: [{ label: 'ASIN', value: product.asin }],
                            image: product.image,
                            originStore: 'Amazon',
                            affiliateUrl: product.affiliateUrl
                          },
                          1
                        )
                      }
                      title="Save to List"
                      aria-label={`Save ${product.title} to List`}
                      className="min-h-[40px] min-w-[40px] p-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contextual Sponsored Partner Offers */}
        {sponsors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {getContextualSponsors(sponsors, selectedCategory, 2).map((sp) => (
              <a
                key={sp.id}
                href={sp.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() => recordAffiliateClick(sp.id)}
                className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center justify-between gap-4 hover:shadow-md transition-all duration-200"
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
                <span className="px-3 min-h-[36px] py-1.5 bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-400 text-slate-900 dark:text-slate-100 group-hover:text-slate-950 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-colors">
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
              As an Amazon Associate, Camellia Shop earns from qualifying purchases. Product photos shown are illustrative; live pricing, stock, and delivery terms appear on Amazon.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href={amazonStoreUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('amazon-ribbon-store', 'Amazon')}
              className="text-amber-800 dark:text-amber-300 font-extrabold hover:underline flex items-center gap-1 bg-amber-50 dark:bg-amber-500/15 px-2.5 py-1.5 rounded-md border border-amber-200 dark:border-amber-500/30"
            >
              <span>Explore Amazon Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={amazonShortUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick('amazon-ribbon-shortlink', 'Amazon')}
              className="text-slate-700 dark:text-slate-200 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Direct Amazon Deals</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
