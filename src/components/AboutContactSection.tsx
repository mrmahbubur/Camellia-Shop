import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, Globe, Copy, Check, Trash2, Clock } from 'lucide-react';

interface SentInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  inquiryType: string;
  message: string;
  createdAt: string;
}

export const AboutContactSection: React.FC = () => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Online Business Guidance');
  const [message, setMessage] = useState('');
  const [preparedMailto, setPreparedMailto] = useState<string | null>(null);
  const [lastPayloadText, setLastPayloadText] = useState('');
  const [copiedInquiry, setCopiedInquiry] = useState(false);
  const [sentInquiries, setSentInquiries] = useState<SentInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('mrs_sent_inquiries');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const buildInquiryText = () =>
    [
      `MRS DIGITAL DIRECT INQUIRY`,
      `From: ${senderName.trim()} <${senderEmail.trim()}>`,
      `Topic: ${inquiryType}`,
      ``,
      `Message:`,
      message.trim()
    ].join('\n');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) return;

    const payloadText = buildInquiryText();
    const subject = `[MRS Digital · ${inquiryType}] Inquiry from ${senderName.trim()}`;
    const mailtoUrl = `mailto:mrxshahin@proton.me?cc=mahbubsh539@gmail.com&subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(payloadText)}`;

    const newEntry: SentInquiry = {
      id: `INQ-${Date.now()}`,
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      inquiryType,
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    const next = [newEntry, ...sentInquiries].slice(0, 10);
    setSentInquiries(next);
    try {
      localStorage.setItem('mrs_sent_inquiries', JSON.stringify(next));
    } catch {
      // storage unavailable
    }

    setLastPayloadText(payloadText);
    setPreparedMailto(mailtoUrl);
    window.location.href = mailtoUrl;
  };

  const handleDeleteInquiry = (id: string) => {
    const next = sentInquiries.filter((item) => item.id !== id);
    setSentInquiries(next);
    try {
      localStorage.setItem('mrs_sent_inquiries', JSON.stringify(next));
    } catch {
      // storage unavailable
    }
  };

  const buildMailtoForInquiry = (inq: SentInquiry) => {
    const body = [
      `MRS DIGITAL DIRECT INQUIRY`,
      `From: ${inq.senderName} <${inq.senderEmail}>`,
      `Topic: ${inq.inquiryType}`,
      ``,
      `Message:`,
      inq.message
    ].join('\n');
    const subject = `[MRS Digital · ${inq.inquiryType}] Inquiry from ${inq.senderName}`;
    return `mailto:mrxshahin@proton.me?cc=mahbubsh539@gmail.com&subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyInquiry = () => {
    navigator.clipboard.writeText(lastPayloadText);
    setCopiedInquiry(true);
    setTimeout(() => setCopiedInquiry(false), 2000);
  };

  return (
    <section id="about-contact" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Platform Architecture Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 sm:p-10 mb-16 shadow-xl border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <span>Standalone Storefront</span>
                <span aria-hidden="true">·</span>
                <span>Self-Contained Architecture</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
                Built for Speed, Clarity &amp; Direct Commerce
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                MRS Digital delivers direct partner links to Amazon Associates and Shopz BD, persistent client-side shopping bag and downloadable HTML invoices, interactive ROI unit-economics calculations, and verified hardware guides with zero server bottlenecks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Zero-backend static React &amp; Vite build that runs anywhere independently</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Interactive unit-economics ROI calculator with real mathematical formulas</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Persistent local bag, multi-currency conversion &amp; downloadable invoices</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Direct founder email access with zero intermediaries</span>
                </div>
              </div>
            </div>

            {/* Side Architecture Box */}
            <div className="lg:col-span-5 bg-slate-800/90 rounded-xl p-5 border border-slate-700 space-y-3 text-xs">
              <div className="font-bold text-white text-sm pb-2 border-b border-slate-700">
                Verified Platform Specifications
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Runtime Engine</span>
                <span className="text-emerald-400 font-mono font-semibold">React 19 + Vite Static Build</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Partner Fulfillment</span>
                <span className="text-emerald-400 font-mono font-semibold">Amazon Prime &amp; Shopz BD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Order Workflow</span>
                <span className="text-emerald-400 font-mono font-semibold">HTML Invoices &amp; Direct Email</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Device Support</span>
                <span className="text-emerald-400 font-mono font-semibold">100% Responsive Mobile &amp; Desktop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Founder & Direct Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Creator Identity */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                <span>Direct Access</span>
                <span aria-hidden="true">·</span>
                <span>Founder &amp; Engineer</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Connect Directly with Shahin
              </h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you are planning a digital product, needing an asynchronous technical diagnostic on your workstation, or inquiring about bulk hardware sourcing, you communicate directly with the creator.
            </p>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Primary Correspondence</span>
                  <a href="mailto:mrxshahin@proton.me" className="font-mono font-semibold hover:text-amber-600">
                    mrxshahin@proton.me
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Direct Inquiries &amp; Orders</span>
                  <a href="mailto:mahbubsh539@gmail.com" className="font-mono font-semibold hover:text-amber-600">
                    mahbubsh539@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              <strong className="text-slate-800 block mb-1">Response Commitment:</strong>
              All direct inquiries, hardware order support, and consulting requests receive a personal reply within 24 business hours.
            </div>

            {sentInquiries.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Saved Inquiry History ({sentInquiries.length})</span>
                  </span>
                </div>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {sentInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{inq.inquiryType}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{inq.message}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={buildMailtoForInquiry(inq)}
                          title="Re-open in email app"
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold"
                        >
                          Email
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          aria-label="Delete saved inquiry"
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Direct Email Inquiry Composer */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Compose Direct Email Inquiry
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Submitting opens your email client pre-addressed to Shahin with your formatted message ready to send.
            </p>

            {preparedMailto ? (
              <div className="p-6 text-center bg-white rounded-xl border border-emerald-200 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="text-base font-bold text-slate-900">Inquiry Draft Ready to Send</h5>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{senderName}</strong>. Your browser email app was opened with a pre-filled message to{' '}
                  <strong className="font-mono">mrxshahin@proton.me</strong>. If it did not open automatically, copy the message below or click the button to launch your mail client.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <a
                    href={preparedMailto}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email App</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyInquiry}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedInquiry ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied Inquiry</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message Summary</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setPreparedMailto(null)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
                  >
                    Compose Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Inquiry Topic</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden text-slate-800 cursor-pointer"
                  >
                    <option value="Online Business Guidance">Online Business &amp; Playbook Guidance</option>
                    <option value="Store & Hardware Question">Store Hardware &amp; Custom Orders</option>
                    <option value="Remote Tech Troubleshooting">Remote Tech Diagnostic Consultation</option>
                    <option value="Partnership & Sponsorship">Partnership &amp; Distribution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Message / Project Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your current situation, business model goals, or product inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Email Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
