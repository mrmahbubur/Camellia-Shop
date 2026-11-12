import deskMatImg from '../assets/images/product_desk_mat_1792262853724.jpg';
import ancHeadphonesImg from '../assets/images/product_anc_headphones_1792262854275.jpg';
import growthBundleImg from '../assets/images/product_growth_bundle_1792262856034.jpg';
import heroWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';

export interface Product {
  id: string;
  title: string;
  category: 'Workspace Gear' | 'Audio & Tech' | 'Digital Blueprints' | 'Productivity Kits';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  image: string;
  isDigital?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'mrs-desk-mat',
    title: 'MRS Dual-Surface Executive Desk Mat',
    category: 'Workspace Gear',
    price: 49,
    originalPrice: 65,
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    stockCount: 28,
    badge: 'Bestseller',
    description: 'Precision engineered felt and vegan leather workspace mat equipped with magnetic cable routing channel, anti-fray edging, and waterproof coating for high-focus work environments.',
    highlights: [
      'Dual reversible finish: Italian vegan leather and merino wool blend felt',
      'Integrated magnetic cable routing anchor with quick snap clip',
      'Water-repellent barrier protects against coffee and spills',
      'Non-slip textured silicone micro-base stays firmly anchored'
    ],
    specs: [
      { label: 'Dimensions', value: '900 x 420 x 4 mm' },
      { label: 'Material', value: 'High-density Merino Felt + Vegan PU' },
      { label: 'Cable Channel', value: 'Embedded Neodymium N52 Magnet' },
      { label: 'Weight', value: '620 grams' }
    ],
    image: deskMatImg
  },
  {
    id: 'mrs-anc-headphones',
    title: 'MRS Studio Hybrid ANC Wireless Headphones',
    category: 'Audio & Tech',
    price: 139,
    originalPrice: 179,
    rating: 4.8,
    reviewsCount: 98,
    inStock: true,
    stockCount: 15,
    badge: 'Staff Pick',
    description: 'Acoustically tuned for deep productivity sessions and studio monitoring. Features 40mm beryllium drivers, active hybrid noise cancellation up to -38dB, and 45-hour ultra-low latency playback.',
    highlights: [
      'Hybrid active noise cancellation with natural ambient transparency mode',
      'Ultra-soft memory foam protein ear cups for 12+ hour fatigue-free wear',
      'Multipoint Bluetooth 5.3 + lossless 3.5mm low-latency wired option',
      'Fast charge: 10 minutes plug provides 5 hours of listening time'
    ],
    specs: [
      { label: 'Battery Life', value: '45 hours (ANC on) / 60 hours (ANC off)' },
      { label: 'Driver Unit', value: '40mm Custom Tuned Beryllium Diaphragm' },
      { label: 'Noise Reduction', value: 'Quad-mic array up to -38dB' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 + USB-C DAC + 3.5mm' }
    ],
    image: ancHeadphonesImg
  },
  {
    id: 'mrs-growth-bundle',
    title: 'MRS Online Business & Passive Income Master Vault',
    category: 'Digital Blueprints',
    price: 67,
    originalPrice: 99,
    rating: 5.0,
    reviewsCount: 310,
    inStock: true,
    stockCount: 999,
    badge: 'Instant Delivery',
    isDigital: true,
    description: 'The complete physical-style hardcover playbook + Notion enterprise workspace containing 12 verified income models, legal contract templates, SEO scripts, and automated funnels tested by MRS.',
    highlights: [
      '12 step-by-step online monetization playbooks with zero fluff',
      'Complete Notion Business OS: CRM, Content Engine, and P&L tracker',
      'Plug-and-play email marketing automation flows (42+ templates)',
      'Lifetime updates with quarterly strategy video breakdowns'
    ],
    specs: [
      { label: 'Format', value: 'Interactive Notion OS + 240-Page PDF' },
      { label: 'Access', value: 'Instant Download & Cloud Sync' },
      { label: 'Templates', value: '42 Email Scripts + 15 Contract Templates' },
      { label: 'License', value: 'Personal & Commercial Project Usage' }
    ],
    image: growthBundleImg
  },
  {
    id: 'mrs-vertical-mouse',
    title: 'MRS Contour Ergonomic Wireless Mouse',
    category: 'Workspace Gear',
    price: 54,
    originalPrice: 69,
    rating: 4.7,
    reviewsCount: 86,
    inStock: true,
    stockCount: 22,
    badge: 'Ergonomic',
    description: 'Designed at a 57-degree natural handshake angle to eliminate carpal strain during marathon computer sessions. Features whisper-quiet optical switches and seamless multi-device toggling.',
    highlights: [
      '57-degree ergonomic angle relieves wrist pressure and forearm tension',
      'Precision optical sensor adjustable up to 4000 DPI for dual 4K monitors',
      'Tri-mode connection: 2.4GHz USB wireless dongle + 2 Bluetooth profiles',
      'Silent switches with tactile mechanical scroll wheel'
    ],
    specs: [
      { label: 'Sensor', value: 'PAW3212 Optical (800-4000 DPI)' },
      { label: 'Battery', value: 'Rechargeable 800mAh USB-C (90 days use)' },
      { label: 'Hand Orientation', value: 'Right-handed anatomical curve' },
      { label: 'Switch Durability', value: '20 Million Silent Clicks' }
    ],
    image: deskMatImg
  },
  {
    id: 'mrs-usb-dock-stand',
    title: 'MRS Precision Aluminum Laptop Riser & 7-in-1 Hub',
    category: 'Workspace Gear',
    price: 79,
    originalPrice: 99,
    rating: 4.9,
    reviewsCount: 64,
    inStock: true,
    stockCount: 18,
    badge: 'Popular',
    description: 'CNC-machined space gray aluminum stand that elevates your laptop to eye level while cleanly housing a 7-port 10Gbps USB-C dock, 100W Power Delivery pass-through, and 4K@60Hz HDMI.',
    highlights: [
      'Solid anodized aerospace-grade aluminum dissipation structure',
      'Built-in 7-in-1 hub: 4K HDMI, 3x USB 3.2, 100W PD, SD/TF readers',
      'Airflow ventilated base lowers laptop throttling by up to 14°C',
      'Foldable dual-hinge design supports all 11-17 inch laptops'
    ],
    specs: [
      { label: 'Material', value: 'Sandblasted 6063 Aluminum Alloy' },
      { label: 'Video Output', value: 'HDMI 2.0 (4K @ 60Hz HDR)' },
      { label: 'Power Delivery', value: 'USB-C PD 3.0 up to 100W input' },
      { label: 'Load Capacity', value: 'Tested up to 8.5 kg static weight' }
    ],
    image: heroWorkspaceImg
  },
  {
    id: 'mrs-troubleshoot-toolkit',
    title: 'MRS Tech Troubleshooting & System Optimization Suite',
    category: 'Productivity Kits',
    price: 39,
    originalPrice: 59,
    rating: 4.8,
    reviewsCount: 115,
    inStock: true,
    stockCount: 999,
    badge: 'Instant Delivery',
    isDigital: true,
    description: 'Curated technical automation toolkit from mrxshahin: one-click verified PowerShell & Bash scripts for Windows debloating, WiFi latency tuning, privacy hardening, and DNS optimization.',
    highlights: [
      'Verified zero-malware open-source scripts with source code access',
      'Network booster script cuts packet jitter and optimizes MTU buffers',
      'Automated background process manager to free 3.5GB+ RAM instantly',
      'Step-by-step video diagnostic walkthroughs for common PC faults'
    ],
    specs: [
      { label: 'Compatibility', value: 'Windows 10/11, macOS, Android 11+' },
      { label: 'Format', value: 'Script Vault + CLI Tool + 1-on-1 Help Forum' },
      { label: 'Updates', value: 'Weekly patches for new OS updates' },
      { label: 'Skill Level', value: 'Beginner to Intermediate (Clean GUI)' }
    ],
    image: growthBundleImg
  }
];
