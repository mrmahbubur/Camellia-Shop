import React, { useState } from 'react';
import { X, CheckCircle, Shield, CreditCard, Truck, AlertCircle } from 'lucide-react';
import { useCart, PlacedOrder } from '../context/CartContext';

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
    setPlacedOrder
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim()) {
      setErrorMsg('Please complete all required shipping fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address for order confirmation.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedOrderId = `MRS-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: PlacedOrder = {
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        customerName: fullName,
        email,
        address: `${address}, ${city} ${postalCode}`,
        city,
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : paymentMethod === 'cod'
            ? 'Cash on Delivery (Verified)'
            : 'Crypto (USDC / BTC)',
        items: [...cart],
        subtotal: subtotalUSD,
        discount: discountUSD,
        shipping: shippingUSD,
        total: totalUSD,
        currency
      };

      setPlacedOrder(order);
      clearCart();
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Encrypted 256-Bit SSL Checkout
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Complete Your Order
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full transition-colors"
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Contact & Shipping */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Shipping &amp; Delivery Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahbub Shahin"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Email Address (For Instant Receipts) *</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-medium">Delivery Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Suite, apartment, street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">City / State *</label>
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Payment Gateway
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Card Payment
              </button>
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
                onClick={() => setPaymentMethod('crypto')}
                className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                  paymentMethod === 'crypto'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Crypto / Web3
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div>
                  <label className="block text-slate-500 mb-1">Card Number (Demo Sandbox)</label>
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-500">
                  <div>
                    <label className="block mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal ({cart.length} items)</span>
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
              <span>Total Payable</span>
              <span className="font-mono tabular-nums">{formatPrice(totalUSD)}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Back to Bag
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              {isSubmitting ? 'Verifying & Processing...' : `Place Order · ${formatPrice(totalUSD)}`}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
