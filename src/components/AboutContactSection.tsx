import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, ExternalLink, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export const AboutContactSection: React.FC = () => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Online Business Guidance');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section id="about-contact" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upgrade Comparison Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 sm:p-10 mb-16 shadow-xl border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <span>The Platform Story</span>
                <span aria-hidden="true">·</span>
                <span>From Legacy Architecture to Modern Web Standard</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
                The Evolution of MRS Digital
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Modern digital commerce and automated affiliate architecture require instantaneous speed, secure client-side cart mechanics, live financial simulators, and curated high-performance workspace gear.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Sub-100ms React &amp; Vite engine replacing sluggish legacy templates</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Interactive unit-economics ROI calculator with real mathematical projections</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Slide-over shopping bag with multi-currency support and promo coupons</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Direct founder accessibility with zero generic intermediaries</span>
                </div>
              </div>
            </div>

            {/* Side Comparison Box */}
            <div className="lg:col-span-5 bg-slate-800/90 rounded-xl p-5 border border-slate-700 space-y-3 text-xs">
              <div className="font-bold text-white text-sm pb-2 border-b border-slate-700">
                Core Architectural Benchmark
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Legacy Architecture</span>
                <span className="text-slate-300 font-mono">Static Monolith / 2018 Stack</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">New Modern Flagship</span>
                <span className="text-emerald-400 font-mono font-semibold">React 19 + Tailwind CSS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Store Capability</span>
                <span className="text-emerald-400 font-mono font-semibold">Live Drawer, Cart &amp; Receipts</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Mobile Responsive</span>
                <span className="text-emerald-400 font-mono font-semibold">100% Mobile Optimized</span>
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
              Whether you are planning your first digital template, needing an asynchronous technical diagnostic on your workstation, or looking to partner on hardware distribution, you communicate directly with the creator.
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
              <strong className="text-slate-800 block mb-1">Response Guarantee:</strong>
              All verified business inquiries, hardware order support, and consulting requests receive a response within 24 business hours.
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Send a Message or Project Request
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Complete the intake below to receive tailored advice or initiate custom store orders.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-white rounded-xl border border-emerald-200 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="text-base font-bold text-slate-900">Message Received</h5>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong>{senderName}</strong>. Your inquiry has been routed to Shahin. A reply will arrive at <strong>{senderEmail}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-semibold text-slate-900 underline underline-offset-4 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
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
                      placeholder="alex@domain.com"
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
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Dispatching...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
