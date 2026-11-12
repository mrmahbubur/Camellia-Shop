export interface Playbook {
  id: string;
  title: string;
  subtitle: string;
  timeToFirstDollar: string;
  startupCapital: string;
  marginRate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  monthlyPotential: string;
  overview: string;
  coreMechanism: string;
  milestones: { step: string; description: string; duration: string }[];
  toolsStack: string[];
  mrsTip: string;
}

export const PLAYBOOKS: Playbook[] = [
  {
    id: 'digital-templates-os',
    title: 'Micro-Assets & Digital Notion/Web OS Kits',
    subtitle: 'Build once, sell infinitely with zero inventory and 95%+ profit margins.',
    timeToFirstDollar: '7-14 Days',
    startupCapital: '$0 - $35',
    marginRate: '95%',
    difficulty: 'Beginner',
    monthlyPotential: '$1,500 - $8,000/mo',
    overview: 'Package your domain expertise, productivity workflows, or client onboarding frameworks into reusable templates (Notion, Figma, Airtable, or Tailwind code snippets).',
    coreMechanism: 'Create niche problem-solving templates, set up an automated Gumroad or Lemon Squeezy checkout, and drive organic traffic through Twitter/X, Reddit case studies, and YouTube tutorials.',
    milestones: [
      { step: '01. Identify Pain Points', description: 'Survey niche subreddits and professional forums for repetitive workflows people hate rebuilding.', duration: 'Days 1-3' },
      { step: '02. Build the Minimum Viable Template', description: 'Design a clean, documented template with starter data and a 3-minute video guide.', duration: 'Days 4-7' },
      { step: '03. Package & Launch Free Tier', description: 'Release a free lite version on Product Hunt and Gumroad to build an email list of 200+ leads.', duration: 'Days 8-12' },
      { step: '04. Upsell the Master Enterprise Vault', description: 'Introduce the complete bundle with automated email sequences at $39 - $99.', duration: 'Day 14+' }
    ],
    toolsStack: ['Notion / Airtable', 'Gumroad / Stripe', 'Loom (Screen demo)', 'Tailwind CSS / GitHub'],
    mrsTip: 'Never build a generic life planner. Build high-utility workflows for specific professionals, like "Freelance Video Editor Project OS" or "E-Commerce P&L Audit Kit".'
  },
  {
    id: 'tech-troubleshooting-services',
    title: 'Remote Tech Diagnostics & System Speedup Agency',
    subtitle: 'High-trust, recurring remote optimization for creators and remote executives.',
    timeToFirstDollar: '3-7 Days',
    startupCapital: '$0',
    marginRate: '88%',
    difficulty: 'Beginner',
    monthlyPotential: '$2,500 - $10,000/mo',
    overview: 'Monetize practical technical skills by offering remote tune-ups, WiFi latency diagnostics, malware clearing, and system debloating for professionals who cannot afford downtime.',
    coreMechanism: 'Offer a guaranteed 45-minute remote diagnostic session via AnyDesk or TeamViewer. Provide clear before/after benchmark reports (RAM usage, boot time, latency drops).',
    milestones: [
      { step: '01. Package 3 Fixed-Price Tiers', description: 'Standard Tune-up ($49), Creator Audio/Video Latency Fix ($99), Monthly Concierge ($149/mo).', duration: 'Day 1' },
      { step: '02. Outbound to Remote Work Communities', description: 'Provide free 5-minute audit tips in Discord server communities and local small business groups.', duration: 'Days 2-4' },
      { step: '03. Standardize Automation Scripts', description: 'Utilize MRS open-source PowerShell scripts to cut manual labor time to under 25 minutes per client.', duration: 'Days 5-7' },
      { step: '04. Retainer Conversion', description: 'Upsell monthly maintenance retainers to 20% of one-off customers for steady baseline income.', duration: 'Ongoing' }
    ],
    toolsStack: ['AnyDesk / RustDesk', 'PowerShell / Terminal', 'Stripe Billing', 'Notion Client Portal'],
    mrsTip: 'Always document the before-and-after metrics in a 1-page PDF. Clients are thrilled when they see 4.2GB of wasted RAM freed up and boot times cut in half.'
  },
  {
    id: 'curated-affiliate-authority',
    title: 'High-Intent Comparison & Solution Engine',
    subtitle: 'Transparent, zero-spam reviews that convert organic searchers into steady commissions.',
    timeToFirstDollar: '30-45 Days',
    startupCapital: '$40 - $120',
    marginRate: '92%',
    difficulty: 'Intermediate',
    monthlyPotential: '$3,000 - $15,000/mo',
    overview: 'Instead of outdated banner ads, build high-intent comparison matrices and interactive tools that solve specific buyer dilemmas (e.g. "Best Noise-Canceling Gear for Open Offices").',
    coreMechanism: 'Target long-tail comparison keywords with high commercial intent ("Alternative to X", "Product A vs Product B for Designers"). Pair honest ratings with verified discount codes.',
    milestones: [
      { step: '01. Low-Competition Niche Selection', description: 'Select high-commission software (B2B SaaS 20-30% recurring) or high-ticket desk hardware.', duration: 'Week 1' },
      { step: '02. Deploy Fast Responsive Portal', description: 'Launch a clean, fast static web app with structured schema markup and fast loading speed.', duration: 'Week 2' },
      { step: '03. Publish 10 Unbiased Deep Dives', description: 'Include genuine test data, screen captures, audio samples, and clear pros/cons tables.', duration: 'Weeks 3-4' },
      { step: '04. Rank & Monetize Recurring Ties', description: 'Secure direct affiliate manager relationships for custom bonuses and unique reader promo codes.', duration: 'Week 5+' }
    ],
    toolsStack: ['React / Vite / Next.js', 'Google Search Console', 'Ahrefs / SEMrush', 'Rewardful / Impact'],
    mrsTip: 'The secret to top affiliate earnings is mentioning true drawbacks. When you honestly tell readers who a product is NOT for, conversion rates on recommended picks skyrocket.'
  },
  {
    id: 'specialized-micro-consulting',
    title: 'High-Ticket Async Advisory & Audit Sprints',
    subtitle: 'Sell your specialized knowledge asynchronously without endless Zoom meetings.',
    timeToFirstDollar: '7-10 Days',
    startupCapital: '$0',
    marginRate: '98%',
    difficulty: 'Intermediate',
    monthlyPotential: '$4,000 - $20,000/mo',
    overview: 'Deliver recorded video audits, code reviews, or business model critiques with a guaranteed 48-hour turnaround, charging $250 - $750 per asynchronous teardown.',
    coreMechanism: 'Clients submit their URL, problem description, or codebase via a structured form. You record a 20-minute actionable Loom video with an executive action checklist.',
    milestones: [
      { step: '01. Define Singular High-Value Outcome', description: 'Example: "E-Commerce Checkout Friction Audit" or "Website Speed & Core Web Vitals Fix".', duration: 'Days 1-2' },
      { step: '02. Build Clean Booking Page', description: 'Create an unboxed, simple checkout with intake questions and calendar availability.', duration: 'Days 3-4' },
      { step: '03. Free Teardown Previews on Social', description: 'Post 2-minute public breakdowns of well-known public sites to demonstrate diagnostic acumen.', duration: 'Days 5-7' },
      { step: '04. Deliver & Collect Video Testimonials', description: 'Send high-impact Loom videos; over-deliver with bonus resources to guarantee referrals.', duration: 'Ongoing' }
    ],
    toolsStack: ['Loom / CleanShot X', 'Cal.com / Stripe', 'Figma / Markdown Checklist', 'Tally Forms'],
    mrsTip: 'Async consulting preserves your freedom. You record audits whenever you have peak focus, with zero schedule fatigue or time-zone friction.'
  }
];
