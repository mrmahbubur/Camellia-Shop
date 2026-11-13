import React, { useState, useEffect } from 'react';
import { X, Truck, AlertCircle, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { useCart, PlacedOrder } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    clearCart,
    subtotalUSD,
    discountUSD,
    shippingUSD,
    totalUSD,
    currency,
    formatPrice,
    recordPlacedOrder
  } = useCart();
  const { products, getAffiliateBuyUrl, recordAffiliateClick } = useProducts();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'invoice' | 'partner'>('cod');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const partnerMatches = cart
    .map((item) => {
      const matched = products.find((p) => p.id === item.product.id);
      return matched
        ? {
            title: item.product.title,
            quantity: item.quantity,
            store: matched.originStore,
            url: getAffiliateBuyUrl(matched)
          }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim()) {
      setErrorMsg('Please complete all required shipping fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const now = new Date();
    const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderId = `MRS-${dateStamp}-${randomSuffix}`;

    const paymentLabel =
      paymentMethod === 'cod'
        ? 'Cash on Delivery (COD)'
        : paymentMethod === 'invoice'
        ? 'Bank / Mobile Transfer Upon Invoice'
        : 'Direct Partner Store Fulfillment';

    const order: PlacedOrder = {
      orderId: generatedOrderId,
      date: now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      customerName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      address: `${address.trim()}, ${city.trim()}${postalCode.trim() ? ` ${postalCode.trim()}` : ''}`,
      city: city.trim(),
      notes: notes.trim() || undefined,
      paymentMethod: paymentLabel,
      items: [...cart],
      subtotal: subtotalUSD,
      discount: discountUSD,
      shipping: shippingUSD,
      total: totalUSD,
      currency
    };

    recordPlacedOrder(order);
    clearCart();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Order Invoice &amp; Direct Fulfillment
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Complete Your Order Request
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Direct Partner Express Checkout Links (if bag contains Amazon/Shopz items) */}
          {partnerMatches.length > 0 && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant Official Storefront Checkout ({partnerMatches.length} items)</span>
                </span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                  Direct Partner Links
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                You can purchase any item directly on Amazon Prime or Shopz BD right now with referral tracking applied, or submit the concierge order form below to generate a downloadable invoice and email order request.
              </p>
              <div className="space-y-1.5 pt-1">
                {partnerMatches.map((match, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-amber-200/70"
                  >
                    <span className="font-medium text-slate-800 truncate">
                      {match.quantity}× {match.title}
                    </span>
                    <a
                      href={match.url}
                      target="_blank"
                      rel="noreferrer noopener sponsored"
                      onClick={() => recordAffiliateClick()}
                      className={`px-2.5 py-1 rounded-md font-bold text-[11px] whitespace-nowrap shrink-0 flex items-center gap-1 transition-colors ${
                        match.store === 'Shopz BD'
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                          : 'bg-[#FF9900] hover:bg-[#e88b00] text-slate-950'
                      }`}
                    >
                      <span>Buy on {match.store}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Contact & Shipping */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                <span>Customer &amp; Delivery Details</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Phone / WhatsApp (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+880 / +1 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Postal / ZIP Code</label>
                  <input
                    type="text"
                    placeholder="1200"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1 font-medium">Delivery Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House, road, apartment, area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1 font-medium">City / Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="City / State / Country"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Settlement Method */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Settlement Preference
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('invoice')}
                  className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                    paymentMethod === 'invoice'
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Invoice / Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('partner')}
                  className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                    paymentMethod === 'partner'
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Partner Store Link
                </button>
              </div>
            </div>

            {/* Optional Order Notes */}
            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">
                Delivery Instructions or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Preferred courier timing, color preference, or questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            {/* Order Summary Recap */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} units)</span>
                <span className="font-mono tabular-nums">{formatPrice(subtotalUSD)}</span>
              </div>
              {discountUSD > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promotional Discount</span>
                  <span className="font-mono tabular-nums">-{formatPrice(discountUSD)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Standard Express Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingUSD === 0 ? 'FREE' : formatPrice(shippingUSD)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums">{formatPrice(totalUSD)}</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Back to Bag
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Order &amp; Invoice · {formatPrice(totalUSD)}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
