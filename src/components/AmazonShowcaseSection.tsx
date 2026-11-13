import React, { useState } from 'react';
import { ExternalLink, Star, Check, Zap, ShoppingCart, ShoppingBag, ShieldCheck, Info } from 'lucide-react';
import { AMAZON_PRODUCTS } from '../data/amazonProductsData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

export const AmazonShowcaseSection: React.FC = () => {
  const { formatPrice, addToCart } = useCart();
  const { recordAffiliateClick } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showProfitExplainer, setShowProfitExplainer] = useState(false);

  const categories = [
    'All',
    'Keyboards & Mice',
    'Lighting & Ergonomics',
    'Audio & Studio',
    'Storage & Power',
    'Reading & Tablets'
  ];

  const filteredProducts = AMAZON_PRODUCTS.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  return (
    <section id="amazon-products" className="py-16 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <span className="text-amber-600 font-bold">Amazon Associates Storefront</span>
              <span aria-hidden="true">·</span>
              <span>Prime 1-2 Day Delivery</span>
              <span aria-hidden="true">·</span>
              <span>100% Commission Tracked</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Verified Tech &amp; Workspace Gear on Amazon
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfitExplainer(!showProfitExplainer)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Info className="w-3.5 h-3.5 text-amber-500" />
              <span>{showProfitExplainer ? 'Hide Prime Buyer Info' : 'Amazon Prime Buyer Guarantees'}</span>
            </button>
          </div>
        </div>

        {/* Amazon Prime Buyer Guarantees Banner (Toggleable) */}
        {showProfitExplainer && (
          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 mb-8 space-y-3 text-xs text-slate-700 animate-fade-in shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Official Amazon A-to-z Buyer Protection &amp; Guarantees</span>
              </span>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                100% Authentic Products
              </span>
            </div>

            <p className="leading-relaxed">
              Every item featured below ships directly from Amazon fulfillment centers with comprehensive buyer protection, hassle-free 30-day return policies, and authentic manufacturer warranties.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                <div className="text-[11px] text-slate-500">Fast Shipping</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">Prime 1-2 Day Delivery</div>
                <div className="text-[11px] text-emerald-600 font-medium">Free express on eligible orders</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                <div className="text-[11px] text-slate-500">Customer Security</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">30-Day Hassle-Free Returns</div>
                <div className="text-[11px] text-emerald-600 font-medium">Easy drop-off at local points</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                <div className="text-[11px] text-slate-500">Payment Security</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">256-Bit Encrypted Checkout</div>
                <div className="text-[11px] text-emerald-600 font-medium">Official Amazon guarantee</div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === c
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Amazon Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              {/* Product Visual */}
              <div className="relative aspect-4/3 bg-slate-50 overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}

                {/* Prime Indicator */}
                {product.primeEligible && (
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="text-amber-400 font-extrabold italic">prime</span>
                    <span className="text-[10px] text-slate-300">Fast 1-Day</span>
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="uppercase tracking-wider">{product.category}</span>
                    <span className="font-mono">ASIN: {product.asin}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-1 text-xs mb-3 text-slate-600">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-slate-800 ml-1 tabular-nums">{product.rating}</span>
                    </div>
                    <span className="text-slate-400 tabular-nums">({product.reviewsCount.toLocaleString()} ratings)</span>
                  </div>

                  {/* Key Features Bullet points */}
                  <ul className="space-y-1 mb-4 text-[11px] text-slate-600">
                    {product.features.slice(0, 2).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & Direct Affiliate Purchase CTA */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                      {product.commissionEstimate}
                    </span>
                  </div>

                  {/* Prime Delivery Note */}
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{product.deliveryInfo}</span>
                  </div>

                  {/* Direct Buy On Amazon + Add to Bag */}
                  <div className="flex items-center gap-2">
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noreferrer noopener sponsored"
                      onClick={() => recordAffiliateClick(product.id)}
                      className="flex-1 py-2.5 px-3 bg-[#FF9900] hover:bg-[#e88b00] text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Buy on Amazon (Prime)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart(
                          {
                            id: product.id,
                            title: product.title,
                            category: 'Workspace Gear',
                            price: product.price,
                            originalPrice: product.originalPrice,
                            rating: product.rating,
                            reviewsCount: product.reviewsCount,
                            inStock: true,
                            stockCount: 25,
                            badge: product.badge,
                            description: product.description,
                            highlights: product.features,
                            specs: [{ label: 'ASIN', value: product.asin }],
                            image: product.image
                          },
                          1
                        )
                      }
                      title="Add to Shopping Bag"
                      className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Amazon Affiliate Compliance & Guarantee Ribbon */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Official Amazon Associates Partner Store · As an Amazon Associate, MRS Digital earns from qualifying purchases.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href="https://www.amazon.com/gp/yourstore?shopForFallback=1&linkCode=ll2&tag=mrxshahin1-20&linkId=b0640e715d1eb5bbcc6b9a28347ac557&language=en_US&ref_=as_li_ss_tl"
              target="_blank"
              rel="noreferrer noopener"
              className="text-amber-800 font-extrabold hover:underline flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200"
            >
              <span>Explore Official Amazon Store</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://link.amazon/B0ae4X6pk"
              target="_blank"
              rel="noreferrer noopener"
              className="text-slate-600 font-semibold hover:underline"
            >
              Deal 1 (MX Master 3S)
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://link.amazon/B0dPHChnk"
              target="_blank"
              rel="noreferrer noopener"
              className="text-slate-600 font-semibold hover:underline"
            >
              Deal 2 (ScreenBar)
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
