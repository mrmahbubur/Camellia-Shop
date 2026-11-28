import React, { useEffect } from 'react';
import { X, Trash2, ShoppingBag, ExternalLink, Copy, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { getContextualSponsors } from '../data/sponsorsData';
import { ResilientImage } from './ResilientImage';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotalUSD,
    pricedSavedItemsCount,
    unpricedSavedItemsCount,
    ratesDisclaimer,
    formatPrice
  } = useCart();
  const {
    sponsors,
    products,
    affiliateTag,
    aliexpressEventUrl,
    storefrontCopy,
    getAffiliateBuyUrl,
    recordAffiliateClick
  } = useProducts();
  const [copiedLinks, setCopiedLinks] = React.useState(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const resolvePartnerUrl = (itemId: string, fallbackUrl?: string) => {
    const matched = products.find((p) => p.id === itemId);
    if (matched) return getAffiliateBuyUrl(matched);
    return fallbackUrl || '#store';
  };

  const amazonAsinItems = cart
    .map((item) => {
      const matched = products.find((p) => p.id === item.product.id);
      const asin = item.product.asin || matched?.asin;
      const store = item.product.originStore || matched?.originStore;
      return store === 'Amazon' && asin ? { asin, quantity: item.quantity } : null;
    })
    .filter((entry): entry is { asin: string; quantity: number } => entry !== null);

  const amazonCartCheckoutUrl = (() => {
    if (amazonAsinItems.length === 0) return null;
    const params = new URLSearchParams();
    params.set('AssociateTag', affiliateTag);
    amazonAsinItems.forEach((entry, idx) => {
      params.set(`ASIN.${idx + 1}`, entry.asin);
      params.set(`Quantity.${idx + 1}`, String(entry.quantity));
    });
    return `https://www.amazon.com/gp/aws/cart/add.html?${params.toString()}`;
  })();

  const aliexpressSavedCount = cart.reduce(
    (sum, item) => sum + (item.product.originStore === 'AliExpress' ? item.quantity : 0),
    0
  );

  const handleCopyAllLinks = () => {
    const lines = cart.map((item, idx) => {
      const url = resolvePartnerUrl(item.product.id, item.product.affiliateUrl);
      const priceLabel = formatPrice(
        item.product.price * item.quantity,
        typeof item.product.nativePrice === 'number'
          ? item.product.nativePrice * item.quantity
          : undefined,
        item.product.nativeCurrency
      );
      return `${idx + 1}. ${item.product.title} (x${item.quantity}) — ${priceLabel}\n   ${url}`;
    });
    navigator.clipboard.writeText(lines.join('\n\n'));
    setCopiedLinks(true);
    setTimeout(() => setCopiedLinks(false), 2000);
  };

  return (
    <div
      onClick={() => setIsCartOpen(false)}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Saved shopping list"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 h-dvh shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-800 dark:text-amber-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Saved Shopping List
            </h2>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close saved items drawer"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Purchase Notice */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {storefrontCopy.checkoutNotice}
        </div>

        {/* Saved Items List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3 sm:space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-14 space-y-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Your saved list is empty.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                Save products while browsing to keep track of partner links and reference prices.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 text-xs font-semibold text-slate-950 dark:text-amber-400 underline underline-offset-4 cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const partnerUrl = resolvePartnerUrl(item.product.id, item.product.affiliateUrl);
              const isAliExpress = item.product.originStore === 'AliExpress';
              const isShopz = item.product.originStore === 'Shopz BD';
              const isReleva = item.product.originStore === 'Releva BD';
              const isExonHost = item.product.originStore === 'ExonHost';
              const isBanglaShoppers = item.product.originStore === 'BanglaShoppers';
              const isIllin = item.product.originStore === 'Illin BD';
              const isStarTech = item.product.originStore === 'Star Tech';
              const isSohoj = item.product.originStore === 'Sohoj Affiliates';

              const hasKnownPrice =
                item.product.nativeCurrency === 'BDT'
                  ? typeof item.product.nativePrice === 'number' && item.product.nativePrice > 0
                  : item.product.price > 0;

              return (
                <div
                  key={item.product.id}
                  className="flex gap-3 sm:gap-4 p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700 items-start justify-between"
                >
                  <ResilientImage
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white p-1.5 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {item.product.originStore || 'Amazon'}
                      </span>
                      <span className="truncate">
                        {item.product.asin ? `ASIN ${item.product.asin}` : item.product.csvCategory || item.product.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {item.product.title}
                    </h4>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                        {hasKnownPrice
                          ? formatPrice(
                              item.product.price * item.quantity,
                              typeof item.product.nativePrice === 'number'
                                ? item.product.nativePrice * item.quantity
                                : undefined,
                              item.product.nativeCurrency
                            )
                          : 'Live price at partner'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="min-h-[44px] min-w-[36px] px-2 text-xs text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono tabular-nums text-slate-800 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="min-h-[44px] min-w-[36px] px-2 text-xs text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                          aria-label={`Remove ${item.product.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <a
                      href={partnerUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      onClick={() =>
                        recordAffiliateClick(
                          item.product.id,
                          item.product.originStore,
                          item.product.category
                        )
                      }
                      className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-[11px] font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors ${
                        isExonHost
                          ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                          : isAliExpress
                          ? 'bg-red-600 hover:bg-red-500 text-white'
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
                          : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                      }`}
                    >
                      <span>
                        {`Open on ${item.product.originStore || 'Amazon'}`}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            {getContextualSponsors(sponsors, 'cart', 1).map((sp) => (
              <a
                key={sp.id}
                href={sp.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => recordAffiliateClick(sp.id)}
                className="min-h-[44px] flex items-center justify-between gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-xs hover:border-amber-400 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Sponsored · {sp.category}
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white truncate">{sp.title}</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300 shrink-0" />
              </a>
            ))}

            {pricedSavedItemsCount > 0 && (
              <div className="flex justify-between text-slate-900 dark:text-white font-bold text-sm">
                <span>Estimated Subtotal ({pricedSavedItemsCount} priced)</span>
                <span className="font-mono tabular-nums">{formatPrice(subtotalUSD)}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {unpricedSavedItemsCount > 0
                ? `${unpricedSavedItemsCount} saved item(s) use live partner pricing (Amazon, AliExpress, or regional partners). ${ratesDisclaimer}`
                : ratesDisclaimer}
            </p>

            {aliexpressSavedCount > 0 && (
              <a
                href={aliexpressEventUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => recordAffiliateClick('aliexpress-cart-checkout', 'AliExpress')}
                className="w-full min-h-[44px] px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs whitespace-nowrap"
              >
                <span>Open AliExpress Event &amp; Checkout ({aliexpressSavedCount})</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            )}

            {amazonCartCheckoutUrl && (
              <a
                href={amazonCartCheckoutUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => recordAffiliateClick('amazon-cart-checkout', 'Amazon')}
                className="w-full min-h-[44px] px-4 py-2.5 bg-[#FF9900] hover:bg-[#e88b00] text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs whitespace-nowrap"
              >
                <span>Open Amazon Items on Amazon ({amazonAsinItems.reduce((sum, i) => sum + i.quantity, 0)})</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyAllLinks}
                className="flex-1 min-h-[44px] px-3 py-2 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLinks ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Links Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Buy Links</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="min-h-[44px] px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear Saved
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
