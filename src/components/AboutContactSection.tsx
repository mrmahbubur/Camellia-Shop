import React, { useState } from 'react';
import {
  Mail,
  CheckCircle2,
  Send,
  Globe,
  Copy,
  Check,
  Trash2,
  Clock,
  Phone,
  Calendar,
  Award,
  ExternalLink,
  Wrench
} from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface SentInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  inquiryType: string;
  message: string;
  createdAt: string;
}

const GRAVATAR_AVATAR_URL =
  'https://1.gravatar.com/avatar/79cb903b47ada0af52e9962551bab25e563cc0a515939789f348aaa0ca135946?s=256';

const FOUNDER_SPECIALTIES = [
  'Windows PC & Android troubleshooting, connectivity & software setup',
  'WordPress & Blogger site management, SEO writing & usability QA',
  'Technical documentation & step-by-step user guides (since 2018)',
  'Virtual assistance, online research & AI workflow optimization'
];

const VERIFIED_PROFILES = [
  { label: 'Gravatar', href: 'https://gravatar.com/mrxshahin' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mrmahbubur' },
  { label: 'X (@Mrshahinx)', href: 'https://x.com/Mrshahinx' },
  { label: 'WordPress', href: 'https://mrxshahin.wordpress.com' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/mrxshahin.bsky.social' }
];

export const AboutContactSection: React.FC = () => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('IT Support & Troubleshooting');
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
      `CAMELLIA SHOP DIRECT INQUIRY`,
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
    const subject = `[Camellia Shop · ${inquiryType}] Inquiry from ${senderName.trim()}`;
    const mailtoUrl = `mailto:mr216873@gmail.com?cc=${encodeURIComponent(
      'mrxshahin@proton.me,mahbubsh539@gmail.com'
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(payloadText)}`;

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
      `CAMELLIA SHOP DIRECT INQUIRY`,
      `From: ${inq.senderName} <${inq.senderEmail}>`,
      `Topic: ${inq.inquiryType}`,
      ``,
      `Message:`,
      inq.message
    ].join('\n');
    const subject = `[Camellia Shop · ${inq.inquiryType}] Inquiry from ${inq.senderName}`;
    return `mailto:mr216873@gmail.com?cc=${encodeURIComponent(
      'mrxshahin@proton.me,mahbubsh539@gmail.com'
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyInquiry = () => {
    navigator.clipboard.writeText(lastPayloadText);
    setCopiedInquiry(true);
    setTimeout(() => setCopiedInquiry(false), 2000);
  };

  return (
    <section
      id="about-contact"
      className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Platform Architecture Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-8 lg:p-10 mb-12 sm:mb-16 shadow-xl border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <span>Standalone Storefront</span>
                <span aria-hidden="true">·</span>
                <span>Self-Contained Architecture</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
                Built for Speed, Clarity &amp; Direct Commerce
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Camellia Shop delivers direct partner links to Amazon Associates and Shopz BD, persistent client-side shopping bag and downloadable HTML invoices, interactive ROI unit-economics calculations, and verified hardware guides with zero server bottlenecks.
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
                  <span>Direct access to founder M R S (@mrxshahin) with zero intermediaries</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/90 rounded-xl p-4 sm:p-5 border border-slate-700 space-y-3 text-xs min-w-0">
              <div className="font-bold text-white text-sm pb-2 border-b border-slate-700">
                Verified Platform Specifications
              </div>
              <div className="flex justify-between gap-2 py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Runtime Engine</span>
                <span className="text-emerald-400 font-mono font-semibold text-right">React 19 + Vite Static Build</span>
              </div>
              <div className="flex justify-between gap-2 py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Partner Fulfillment</span>
                <span className="text-emerald-400 font-mono font-semibold text-right">Amazon Prime &amp; Shopz BD</span>
              </div>
              <div className="flex justify-between gap-2 py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Order Workflow</span>
                <span className="text-emerald-400 font-mono font-semibold text-right">HTML Invoices &amp; Direct Email</span>
              </div>
              <div className="flex justify-between gap-2 py-1">
                <span className="text-slate-400">Device &amp; Theme Support</span>
                <span className="text-emerald-400 font-mono font-semibold text-right">Adaptive Light/Dark · All Screens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Founder & Engineer Profile + Direct Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Verified Gravatar Founder Identity */}
          <div className="lg:col-span-5 space-y-5 min-w-0">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-sm">
                <ResilientImage
                  src={GRAVATAR_AVATAR_URL}
                  alt="M R S (@mrxshahin) — Founder & Engineer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  <span>Founder &amp; Engineer</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href="https://gravatar.com/mrxshahin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1"
                  >
                    <span>@mrxshahin</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  M R S
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Remote IT Support, Technical Writer &amp; Digital Operations
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Helping businesses, entrepreneurs, and individuals simplify daily operations, resolve technical problems, manage websites, and stay productive remotely—backed by a certified 360-hour computer systems foundation and technical writing experience since 2018.
            </p>

            {/* Verified Credentials & Core Capabilities */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Verified Skills &amp; Background</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                {FOUNDER_SPECIALTIES.map((spec) => (
                  <li key={spec} className="flex items-start gap-2">
                    <Wrench className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Channels */}
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 min-w-0">
                <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                    Gravatar Primary Email
                  </span>
                  <a
                    href="mailto:mr216873@gmail.com"
                    className="font-mono font-semibold hover:text-amber-600 dark:hover:text-amber-400 break-all"
                  >
                    mr216873@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 min-w-0">
                <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                    Store Desk &amp; Order Support
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono font-semibold">
                    <a
                      href="mailto:mrxshahin@proton.me"
                      className="hover:text-amber-600 dark:hover:text-amber-400 break-all"
                    >
                      mrxshahin@proton.me
                    </a>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <a
                      href="mailto:mahbubsh539@gmail.com"
                      className="hover:text-amber-600 dark:hover:text-amber-400 break-all"
                    >
                      mahbubsh539@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="tel:+8809611056361"
                  className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 transition-colors min-w-0"
                >
                  <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Phone / WhatsApp</span>
                    <span className="font-mono font-semibold truncate block">+8809611056361</span>
                  </div>
                </a>

                <a
                  href="https://calendly.com/mrxshahin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 transition-colors min-w-0"
                >
                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">Schedule Session</span>
                    <span className="font-semibold truncate block">Calendly ↗</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Verified Public Profiles */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Verified Profiles &amp; Contact Form
              </div>
              <div className="flex flex-wrap gap-2">
                {VERIFIED_PROFILES.map((profile) => (
                  <a
                    key={profile.href}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/60 text-slate-700 dark:text-slate-200 rounded-md font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{profile.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
                <a
                  href="https://mrsadmin.blogspot.com/p/contact-us.html?m=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/60 text-slate-700 dark:text-slate-200 rounded-md font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>Contact Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {sentInquiries.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Saved Inquiry History ({sentInquiries.length})</span>
                  </span>
                </div>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {sentInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{inq.inquiryType}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{inq.message}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={buildMailtoForInquiry(inq)}
                          title="Re-open in email app"
                          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded text-[11px] font-semibold"
                        >
                          Email
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          aria-label="Delete saved inquiry"
                          className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"
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
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 min-w-0">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Compose Direct Inquiry to M R S
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Submitting opens your email client pre-addressed to <span className="font-mono">mr216873@gmail.com</span> with your formatted message ready to send. Available for ongoing freelance or project-based remote support across time zones.
            </p>

            {preparedMailto ? (
              <div className="p-5 sm:p-6 text-center bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-500/30 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="text-base font-bold text-slate-900 dark:text-white">Inquiry Draft Ready to Send</h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{senderName}</strong>. Your browser email app was opened with a pre-filled message to{' '}
                  <strong className="font-mono">mr216873@gmail.com</strong>. If it did not open automatically, copy the message below or click the button to launch your mail client.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <a
                    href={preparedMailto}
                    className="px-4 min-h-[40px] py-2 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email App</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyInquiry}
                    className="px-4 min-h-[40px] py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedInquiry ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-300">Copied Inquiry</span>
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
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    Compose Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">Inquiry Topic</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden text-slate-800 dark:text-white cursor-pointer"
                  >
                    <option value="IT Support & Troubleshooting">Remote IT Support &amp; Windows/Android Troubleshooting</option>
                    <option value="Website & Content Management">WordPress / Blogger Management &amp; SEO Content</option>
                    <option value="Virtual Assistance & Technical Writing">Virtual Assistance, Research &amp; Technical Writing</option>
                    <option value="Store & Hardware Question">Camellia Shop Hardware &amp; Custom Orders</option>
                    <option value="Online Business Guidance">Online Business &amp; AI Workflow Optimization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
                    Message / Project Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your technical issue, remote operations need, website task, or product inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 font-semibold dark:font-extrabold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
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
