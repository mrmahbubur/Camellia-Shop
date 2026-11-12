export interface AffiliateDeal {
  id: string;
  title: string;
  brand: string;
  category: 'Cloud & Hosting' | 'Ergonomic Hardware' | 'SaaS & Creator Tools' | 'Cyber Security & VPN';
  payoutDescription: string;
  commissionType: 'One-Time CPA' | 'Recurring Lifetime' | 'Per-Sale %';
  discountText: string;
  promoCode?: string;
  badge: string;
  description: string;
  keyBenefits: string[];
  defaultUrl: string;
  trackingType: 'amazon' | 'hostinger' | 'impact' | 'vpn' | 'saas';
  rating: number;
  featured?: boolean;
}

export const AFFILIATE_DEALS: AffiliateDeal[] = [
  {
    id: 'hostinger-cloud',
    title: 'Hostinger Business Cloud & Free Domain',
    brand: 'Hostinger',
    category: 'Cloud & Hosting',
    payoutDescription: '$65 - $120 CPA per referral',
    commissionType: 'One-Time CPA',
    discountText: '78% Off + 3 Months Free',
    promoCode: 'MRXSHAHIN',
    badge: 'Top Hosting Deal',
    description: 'High-speed cloud SSD infrastructure with free daily backups, unlimited SSL, and 1-click migration for converting WordPress and static blogs.',
    keyBenefits: [
      'LiteSpeed Web Server with NVMe SSD storage',
      'Free domain name for 1 full year included',
      'Free automatic migration from WordPress & legacy platforms'
    ],
    defaultUrl: 'https://www.hostinger.com/web-hosting',
    trackingType: 'hostinger',
    rating: 4.9,
    featured: true
  },
  {
    id: 'nordvpn-security',
    title: 'NordVPN Ultimate Threat Protection & Meshnet',
    brand: 'NordVPN',
    category: 'Cyber Security & VPN',
    payoutDescription: '40% - 100% CPA + 30% Lifetime Recurring',
    commissionType: 'Recurring Lifetime',
    discountText: '72% Off + 3 Extra Months',
    promoCode: 'NORDSAVE',
    badge: 'Security Pick',
    description: 'Ultra-fast NordLynx protocol with zero logs, built-in DNS leak protection, malware scanner, and dedicated IP options for remote creators.',
    keyBenefits: [
      'Next-gen NordLynx protocol with minimal latency drops',
      'Kill switch & DNS leak protection audited independently',
      'Connect up to 10 devices simultaneously'
    ],
    defaultUrl: 'https://nordvpn.com/pricing/',
    trackingType: 'vpn',
    rating: 4.8,
    featured: true
  },
  {
    id: 'amazon-deal-b0ae4x6pk',
    title: 'Amazon Prime Verified Tech Gear Deal',
    brand: 'Amazon Associates',
    category: 'Ergonomic Hardware',
    payoutDescription: '4% - 10% per sale ($15 - $35/order)',
    commissionType: 'Per-Sale %',
    discountText: 'Prime Free 2-Day Shipping',
    promoCode: 'AMZ-B0AE4',
    badge: 'Amazon Official Link',
    description: 'High-performance workspace gear curated by Shahin. Verified for deep productivity, low latency, and marathon digital creation.',
    keyBenefits: [
      'Direct official Amazon Prime 1-2 day express fulfillment',
      '30-Day A-to-z buyer protection and hassle-free returns',
      'Lowest 30-day verified Amazon price guarantee'
    ],
    defaultUrl: 'https://link.amazon/B0ae4X6pk',
    trackingType: 'amazon',
    rating: 4.9,
    featured: true
  },
  {
    id: 'amazon-deal-b0dphchnk',
    title: 'Amazon Ergonomic Workspace & Hardware Pick',
    brand: 'Amazon Associates',
    category: 'Ergonomic Hardware',
    payoutDescription: '4% - 10% per sale ($20 - $45/order)',
    commissionType: 'Per-Sale %',
    discountText: 'Limited-Time Amazon Deal',
    promoCode: 'AMZ-B0DPH',
    badge: 'Amazon Top Pick',
    description: 'Precision-crafted digital workstation peripheral. Backed by hundreds of verified reviews for durability, comfort, and seamless device compatibility.',
    keyBenefits: [
      'Eligible for Free Amazon Prime Delivery & Returns',
      'Tested for daily heavy workflow and ergonomic support',
      'Official manufacturer warranty included'
    ],
    defaultUrl: 'https://link.amazon/B0dPHChnk',
    trackingType: 'amazon',
    rating: 4.9,
    featured: true
  },
  {
    id: 'flexispot-standing-desk',
    title: 'FlexiSpot E7 Pro Dual-Motor Adjustable Standing Desk',
    brand: 'FlexiSpot / ShareASale',
    category: 'Ergonomic Hardware',
    payoutDescription: '8% - 12% per sale ($45 - $70/order)',
    commissionType: 'Per-Sale %',
    discountText: '$120 Off Instant Rebate',
    promoCode: 'FLEXIPRO',
    badge: 'Ergonomic Choice',
    description: 'Commercial-grade dual-motor lift system with 355 lbs weight capacity, solid bamboo worktop, and anti-collision sensor to prevent repetitive strain.',
    keyBenefits: [
      'Whisper-quiet dual motors (< 45dB) with 4 memory presets',
      'Heavy-duty carbon steel frame with 15-year warranty',
      'Built-in cable management tray and wireless charging port'
    ],
    defaultUrl: 'https://www.flexispot.com/standing-desk-e7-pro',
    trackingType: 'impact',
    rating: 4.9
  },
  {
    id: 'beehiiv-newsletter-os',
    title: 'Beehiiv Newsletter & Audience Growth Platform',
    brand: 'Beehiiv',
    category: 'SaaS & Creator Tools',
    payoutDescription: '40% Recurring Monthly for 12 Months',
    commissionType: 'Recurring Lifetime',
    discountText: '30-Day Free Trial + 20% Off 3 Months',
    promoCode: 'BEEHIIVGROW',
    badge: 'Highest Recurring',
    description: 'The newsletter platform built by former Morning Brew creators. Features referral engines, native sponsor ad networks, and automated paywalls.',
    keyBenefits: [
      'Native recommendation network drives free subscriber referrals',
      'Built-in newsletter ad network with automatic monetization',
      'Zero take rates on your paid subscriptions'
    ],
    defaultUrl: 'https://www.beehiiv.com/',
    trackingType: 'saas',
    rating: 4.9,
    featured: true
  },
  {
    id: 'cleanshot-x',
    title: 'CleanShot X for Mac: Ultimate Screen Capture & Video Annotator',
    brand: 'CleanShot / Gumroad',
    category: 'SaaS & Creator Tools',
    payoutDescription: '25% - 35% commission per license',
    commissionType: 'Per-Sale %',
    discountText: 'Lifetime License or Cloud Pro',
    promoCode: 'CLEANSHOT10',
    badge: 'Creator Utility',
    description: 'Over 50 screen capture features in one lightweight app: scrolling capture, quick OCR text extraction, instant video GIF recording, and cloud hosting.',
    keyBenefits: [
      'Quick OCR: copy text from unselectable images or video frames',
      'Built-in cloud sharing with custom branded domain links',
      'Background window hiding & clean desktop generator'
    ],
    defaultUrl: 'https://cleanshot.com/',
    trackingType: 'saas',
    rating: 5.0
  }
];
