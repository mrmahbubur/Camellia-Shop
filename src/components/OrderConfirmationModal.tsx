import React from 'react';
import { CheckCircle, Printer, X, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const OrderConfirmationModal: React.FC = () => {
  const { placedOrder, setPlacedOrder, formatPrice } = useCart();

  if (!placedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-6 text-center relative">
          <button
            onClick={() => setPlacedOrder(null)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">Order Confirmed!</h3>
          <p className="text-xs text-slate-300 mt-1">
            Order <strong className="font-mono text-amber-300">{placedOrder.orderId}</strong> is confirmed. A receipt and tracking guide were sent to <strong>{placedOrder.email}</strong>.
          </p>
        </div>

        {/* Receipt Details */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block mb-0.5">Customer Name</span>
              <span className="font-semibold text-slate-800">{placedOrder.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Order Date</span>
              <span className="font-semibold text-slate-800">{placedOrder.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Delivery Address</span>
              <span className="font-semibold text-slate-800">{placedOrder.address}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Payment Method</span>
              <span className="font-semibold text-slate-800">{placedOrder.paymentMethod}</span>
            </div>
          </div>

          {/* Itemized Order List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>Purchased Items</span>
            </h4>
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-10 h-10 object-cover rounded border border-slate-200"
                    />
                    <div>
                      <div className="font-medium text-slate-900">{item.product.title}</div>
                      <div className="text-[11px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatPrice(placedOrder.subtotal)}</span>
            </div>
            {placedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Promotional Discount</span>
                <span className="font-mono tabular-nums">-{formatPrice(placedOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Shipping Fee</span>
              <span className="font-mono tabular-nums">
                {placedOrder.shipping === 0 ? 'FREE' : formatPrice(placedOrder.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums">{formatPrice(placedOrder.total)}</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={() => setPlacedOrder(null)}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Store
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
