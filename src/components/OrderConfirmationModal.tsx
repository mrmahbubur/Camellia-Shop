import React, { useState } from 'react';
import { CheckCircle, Printer, X, Package, Download, Mail, Copy, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const OrderConfirmationModal: React.FC = () => {
  const { placedOrder, setPlacedOrder, formatPrice } = useCart();
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!placedOrder) return null;

  const buildOrderPlainText = () => {
    const itemLines = placedOrder.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.title} x${item.quantity} — ${formatPrice(
            item.product.price * item.quantity
          )}`
      )
      .join('\n');

    return [
      `MRS DIGITAL ORDER REQUEST`,
      `Order Reference: ${placedOrder.orderId}`,
      `Date: ${placedOrder.date}`,
      `Customer Name: ${placedOrder.customerName}`,
      `Email: ${placedOrder.email}`,
      placedOrder.phone ? `Phone: ${placedOrder.phone}` : null,
      `Delivery Address: ${placedOrder.address}`,
      `Settlement Preference: ${placedOrder.paymentMethod}`,
      placedOrder.notes ? `Notes: ${placedOrder.notes}` : null,
      ``,
      `ITEMS:`,
      itemLines,
      ``,
      `Subtotal: ${formatPrice(placedOrder.subtotal)}`,
      placedOrder.discount > 0 ? `Discount: -${formatPrice(placedOrder.discount)}` : null,
      `Shipping: ${placedOrder.shipping === 0 ? 'FREE' : formatPrice(placedOrder.shipping)}`,
      `Total (${placedOrder.currency}): ${formatPrice(placedOrder.total)}`
    ]
      .filter((line): line is string => line !== null)
      .join('\n');
  };

  const mailtoOrderHref = `mailto:mahbubsh539@gmail.com?cc=mrxshahin@proton.me&subject=${encodeURIComponent(
    `[Order ${placedOrder.orderId}] ${placedOrder.customerName} - ${formatPrice(placedOrder.total)}`
  )}&body=${encodeURIComponent(buildOrderPlainText())}`;

  const handleDownloadInvoice = () => {
    const rowsHtml = placedOrder.items
      .map(
        (item) => `
          <tr>
            <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${item.product.title}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.quantity}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;">${formatPrice(
              item.product.price
            )}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;">${formatPrice(
              item.product.price * item.quantity
            )}</td>
          </tr>`
      )
      .join('');

    const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${placedOrder.orderId} - MRS Digital</title>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;color:#0f172a;max-width:720px;margin:40px auto;padding:24px;line-height:1.5;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:24px;">
    <div>
      <h1 style="margin:0;font-size:22px;">MRS DIGITAL</h1>
      <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Official Order Summary &amp; Invoice</p>
    </div>
    <div style="text-align:right;font-size:13px;">
      <div><strong>Order ID:</strong> ${placedOrder.orderId}</div>
      <div><strong>Date:</strong> ${placedOrder.date}</div>
    </div>
  </div>
  <div style="background:#f8fafc;padding:16px;border-radius:8px;margin-bottom:24px;font-size:13px;">
    <div><strong>Customer:</strong> ${placedOrder.customerName} (${placedOrder.email})</div>
    ${placedOrder.phone ? `<div><strong>Phone:</strong> ${placedOrder.phone}</div>` : ''}
    <div><strong>Delivery Address:</strong> ${placedOrder.address}</div>
    <div><strong>Settlement:</strong> ${placedOrder.paymentMethod}</div>
    ${placedOrder.notes ? `<div><strong>Notes:</strong> ${placedOrder.notes}</div>` : ''}
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
    <thead>
      <tr style="background:#f1f5f9;">
        <th style="padding:10px 8px;text-align:left;">Item</th>
        <th style="padding:10px 8px;text-align:center;">Qty</th>
        <th style="padding:10px 8px;text-align:right;">Unit Price</th>
        <th style="padding:10px 8px;text-align:right;">Line Total</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div style="text-align:right;font-size:14px;">
    <div>Subtotal: <strong>${formatPrice(placedOrder.subtotal)}</strong></div>
    ${
      placedOrder.discount > 0
        ? `<div style="color:#059669;">Discount: <strong>-${formatPrice(placedOrder.discount)}</strong></div>`
        : ''
    }
    <div>Shipping: <strong>${placedOrder.shipping === 0 ? 'FREE' : formatPrice(placedOrder.shipping)}</strong></div>
    <div style="font-size:18px;margin-top:8px;">Total (${placedOrder.currency}): <strong>${formatPrice(
      placedOrder.total
    )}</strong></div>
  </div>
  <p style="margin-top:32px;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:12px;">
    Questions? Contact mrxshahin@proton.me or mahbubsh539@gmail.com with reference ${placedOrder.orderId}.
  </p>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${placedOrder.orderId}-invoice.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(buildOrderPlainText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-6 text-center relative">
          <button
            onClick={() => setPlacedOrder(null)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">Order Summary Ready</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Reference <strong className="font-mono text-amber-300">{placedOrder.orderId}</strong> is saved to your browser order history. Send it directly via email or save your printable invoice below.
          </p>
        </div>

        {/* Receipt Details */}
        <div className="p-6 space-y-5">
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
              <span className="text-slate-400 block mb-0.5">Settlement Method</span>
              <span className="font-semibold text-slate-800">{placedOrder.paymentMethod}</span>
            </div>
          </div>

          {/* Itemized Order List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>Order Items</span>
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
              <span>Estimated Total</span>
              <span className="font-mono tabular-nums">{formatPrice(placedOrder.total)}</span>
            </div>
          </div>

          {/* Real Standalone Fulfillment & Receipt Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={mailtoOrderHref}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Order via Email App</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Invoice (.html)</span>
            </button>
          </div>

          {/* Bottom Utility Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPlacedOrder(null)}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
