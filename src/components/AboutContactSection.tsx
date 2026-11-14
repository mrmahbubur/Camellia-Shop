import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  Send,
  Copy,
  Check,
  Trash2,
  Clock,
  Phone,
  ExternalLink,
  AlertCircle
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

interface OwnerProfile {
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  email: string;
  phone: string;
  links: { label: string; href: string }[];
}

const INITIAL_OWNER: OwnerProfile = {
  displayName: 'M R S',
  username: 'mrxshahin',
  avatarUrl:
    'https://1.gravatar.com/avatar/79cb903b47ada0af52e9962551bab25e563cc0a515939789f348aaa0ca135946?s=256',
  bio: 'Available for remote IT support, Windows/Android troubleshooting, website content management, and technical documentation (since 2018).',
  email: 'mr216873@gmail.com',
  phone: '+8809611056361',
  links: [
    { label: 'Gravatar', href: 'https://gravatar.com/mrxshahin' },
    { label: 'WordPress', href: 'https://mrxshahin.wordpress.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mrmahbubur' },
    { label: 'X', href: 'https://x.com/Mrshahinx' },
    { label: 'Bluesky', href: 'https://bsky.app/profile/mrxshahin.bsky.social' },
    { label: 'Calendly', href: 'https://calendly.com/mrxshahin' }
  ]
};

export const AboutContactSection: React.FC = () => {
  const [owner, setOwner] = useState<OwnerProfile>(INITIAL_OWNER);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('IT Support & Troubleshooting');
  const [message, setMessage] = useState('');
  const [preparedMailto, setPreparedMailto] = useState<string | null>(null);
  const [lastPayloadText, setLastPayloadText] = useState('');
  const [copiedInquiry, setCopiedInquiry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sentInquiries, setSentInquiries] = useState<SentInquiry[]>([]);

  useEffect(() => {
    fetch('/api/owner')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.displayName && data.username) {
          setOwner(data as OwnerProfile);
        }
      })
      .catch(() => {
        // Keep verified owner fallback
      });

    fetch('/api/inquiries')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.inquiries)) {
          setSentInquiries(data.inquiries);
        }
      })
      .catch(() => {
        // Ignore if unreachable
      });
  }, []);

  const buildInquiryText = () =>
    [
      `CAMELLIA SHOP DIRECT INQUIRY`,
      `From: ${senderName.trim()} <${senderEmail.trim()}>`,
      `Topic: ${inquiryType}`,
      ``,
      `Message:`,
      message.trim()
    ].join('\n');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) return;

    const payloadText = buildInquiryText();
    const subject = `[Camellia Shop · ${inquiryType}] Inquiry from ${senderName.trim()}`;
    const mailtoUrl = `mailto:${owner.email}?cc=${encodeURIComponent(
      'mrxshahin@proton.me,mahbubsh539@gmail.com'
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(payloadText)}`;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName.trim(),
          senderEmail: senderEmail.trim(),
          inquiryType,
          message: message.trim()
        })
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || 'Unable to submit inquiry.');
      }

      const data = (await res.json()) as { inquiry: SentInquiry };
      setSentInquiries((prev) => [data.inquiry, ...prev]);
      setLastPayloadText(payloadText);
      setPreparedMailto(mailtoUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to submit inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    setSentInquiries((prev) => prev.filter((item) => item.id !== id));
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
    return `mailto:${owner.email}?cc=${encodeURIComponent(
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
        {/* Founder & Engineer Profile + Direct Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Simple Owner Credit & Contact */}
          <div className="lg:col-span-5 space-y-5 min-w-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-sm">
                <ResilientImage
                  src={owner.avatarUrl}
                  alt={`${owner.displayName} (@${owner.username}) — Store Owner`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
                  Site Owner &amp; Engineer
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {owner.displayName}{' '}
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    (@{owner.username})
                  </span>
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {owner.bio}
            </p>

            {/* Compact Contact Details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <a
                  href={`mailto:${owner.email}`}
                  className="font-mono font-semibold hover:text-amber-600 dark:hover:text-amber-400 break-all"
                >
                  {owner.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <a
                  href={`tel:${owner.phone}`}
                  className="font-mono font-semibold hover:text-amber-600 dark:hover:text-amber-400"
                >
                  {owner.phone}
                </a>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                {owner.links.map((profile) => (
                  <a
                    key={profile.href}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/60 text-slate-700 dark:text-slate-200 rounded-md font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{profile.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>

            {sentInquiries.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Submitted Inquiries ({sentInquiries.length})</span>
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
                          title="Open in email app"
                          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded text-[11px] font-semibold"
                        >
                          Email
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          aria-label="Delete inquiry"
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

          {/* Right Column: Direct Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 min-w-0">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Send Direct Inquiry to {owner.displayName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Your inquiry is saved directly on the site and can also be forwarded via <span className="font-mono">{owner.email}</span>.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {preparedMailto ? (
              <div className="p-5 sm:p-6 text-center bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-500/30 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="text-base font-bold text-slate-900 dark:text-white">Inquiry Submitted</h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{senderName}</strong>. Your message has been recorded. You can also send a copy directly via your email app to{' '}
                  <strong className="font-mono">{owner.email}</strong>.
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
                        <span className="text-emerald-700 dark:text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setPreparedMailto(null);
                      setMessage('');
                    }}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    Send Another Inquiry
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
                    <option value="Store & Hardware Question">Camellia Shop Hardware &amp; Sourcing Inquiries</option>
                    <option value="Online Business Guidance">Online Business Guidance</option>
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
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 disabled:opacity-60 text-white dark:text-slate-950 font-semibold dark:font-extrabold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Direct Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
