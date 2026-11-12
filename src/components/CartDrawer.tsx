import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotalUSD,
    discountUSD,
    shippingUSD,
    totalUSD,
    formatPrice,
    couponCode,
    discountPercent,
    applyCoupon,
    removeCoupon,
    freeShippingThresholdUSD,
    freeShippingProgress
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponFeedback({ type: 'success', text: res.message });
      setInputCoupon('');
    } else {
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                Your Shopping Bag
              </h2>
              <span className="text-xs font-mono text-slate-500">
                ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close bag"
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                {freeShippingProgress >= 100 ? (
                  <span className="text-emerald-700 font-semibold">You unlocked FREE Express Shipping!</span>
                ) : (
                  <span>
                    Add <strong>{formatPrice(Math.max(0, freeShippingThresholdUSD - subtotalUSD))}</strong> for FREE shipping
                  </span>
                )}
              </span>
              <span className="font-mono text-slate-500 tabular-nums">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  freeShippingProgress >= 100 ? 'bg-emerald-500' : 'bg-slate-900'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-700">Your bag is currently empty.</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore curated hardware and verified income blueprints to upgrade your daily focus.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 text-xs font-semibold text-slate-950 underline underline-offset-4"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/70 items-center justify-between"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 truncate mb-1">
                      {item.product.title}
                    </h4>
                    <div className="text-xs font-mono font-bold text-slate-800 tabular-nums mb-2">
                      {formatPrice(item.product.price)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 bg-white rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-4">
              
              {/* Promo Code Input */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between text-xs p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      Coupon: <strong>{couponCode}</strong> ({discountPercent}% off)
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (Try: MRSLAUNCH)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && !couponCode && (
                  <p className={`text-[11px] mt-1 ${couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {couponFeedback.text}
                  </p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">{formatPrice(subtotalUSD)}</span>
                </div>
                {discountUSD > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-mono tabular-nums">-{formatPrice(discountUSD)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-mono tabular-nums">
                    {shippingUSD === 0 ? 'FREE' : formatPrice(shippingUSD)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-100">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums">{formatPrice(totalUSD)}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>Proceed to Secure Checkout · {formatPrice(totalUSD)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Instant digital downloads + tracked global priority shipping
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Checkout Modal Form */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};
