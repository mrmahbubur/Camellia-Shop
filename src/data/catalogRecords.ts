import type { PartnerStoreOrigin } from '../utils/regionProfile.ts';
import startechBulkCatalogRaw from './startechBulkCatalog.json' with { type: 'json' };

export type ProductCategory =
  | 'All Departments (Mega Store)'
  | 'Electronics & Gadgets'
  | 'Computers & Accessories'
  | 'Audio & Headphones'
  | 'Smart Home & Power'
  | 'Wearables & Smartwatches'
  | 'Office & Workspace'
  | 'Shopz BD Tech Deals'
  | 'Releva BD Picks'
  | 'BanglaShoppers Beauty'
  | 'Illin BD Home & Tech'
  | 'Star Tech BD Gadgets'
  | 'Sohoj Affiliate Network'
  | 'Cloud Hosting & Domains';

export type ImageKey =
  | 'mouse'
  | 'screenbar'
  | 'headphones'
  | 'magsafe'
  | 'monitorArm'
  | 'deskMat'
  | 'headphoneStand'
  | 'heroWorkspace'
  | 'growthBundle'
  | 'cloudServer';

export interface CatalogRecord {
  id: string;
  asin?: string;
  title: string;
  brand: string;
  category: Exclude<ProductCategory, 'All Departments (Mega Store)'>;
  department: string;
  csvCategory?: string;
  sourceType: 'linked-shop' | 'uploaded-csv';
  nativePrice?: number;
  nativeCurrency?: 'USD' | 'BDT';
  price: number;
  priceStatus: 'reference' | 'live-at-partner';
  originalPrice?: number;
  badge?: string;
  primeEligible: boolean;
  deliveryEstimate: string;
  affiliateUrl: string;
  urlKind: 'product' | 'portal' | 'category';
  imageKey: ImageKey;
  secondaryImageKey: ImageKey;
  imageIsIllustrative: boolean;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  originStore: PartnerStoreOrigin;
  tags: string[];
}

export const AMAZON_ASSOCIATE_TAG = 'mrxshahin06-20';
export const AMAZON_LINK_ID = 'f69ce6631cea5fb5a49ce7ba4d3968b6';
export const AMAZON_STORE_URL =
  'https://www.amazon.com/b?node=53629917011&linkCode=ll2&tag=mrxshahin06-20&linkId=f69ce6631cea5fb5a49ce7ba4d3968b6&language=en_US&ref_=as_li_ss_tl';
export const AMAZON_LINK_SHORT = 'https://link.amazon/B0io1BQfg';
export const SHOPZ_REF_BASE = 'https://www.shopz.com.bd/?ref=mahbubur-rahman-shahin';
export const EXONHOST_AFFILIATE_URL = 'https://my.exonhost.com/affiliate?aff=5993';
export const ALIBABA_AFFILIATE_URL = 'https://rzekl.com/g/pm1aev55clcb5002cfdd219aa26f6f/';
export const BANGLASHOPPERS_AFFILIATE_URL = 'https://www.banglashoppers.com/r/4ehxtB1p/';
export const ILLIN_AFFILIATE_URL = 'https://www.illin.com.bd/40989';
export const STARTECH_TRACKING_PARAM = '6ad935b5df200';
export const STARTECH_AFFILIATE_URL = `https://www.startech.com.bd/?tracking=${STARTECH_TRACKING_PARAM}`;
export const SOHOJ_AFFILIATE_URL = 'https://www.illin.com.bd/40989';
export const RELEVA_HOME_URL = 'https://releva.com.bd/';
export const RELEVA_TRACKING_PARAM = 'J64O1CC92FJNsi3ogTGcx7H9139T4GCUmIqKFO6igVEE9EOWpPe6bYY053BwALrR';

export function buildAmazonAsinUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll2&linkId=${AMAZON_LINK_ID}`;
}

export function buildRelevaProductUrl(productId: number): string {
  return `https://releva.com.bd/index.php?route=product/product&product_id=${productId}&tracking=${RELEVA_TRACKING_PARAM}`;
}

export function isRelevaSpecificProductUrl(
  rawUrl: string,
  urlKind?: 'product' | 'portal' | 'category'
): boolean {
  if (urlKind === 'portal' || urlKind === 'category') return false;
  try {
    const parsed = new URL(rawUrl.trim());
    if (!parsed.hostname.toLowerCase().includes('releva.com.bd')) return false;
    const route = (parsed.searchParams.get('route') || '').toLowerCase();
    if (route === 'product/product' || parsed.searchParams.has('product_id')) {
      return true;
    }
    if (
      route.startsWith('product/category') ||
      route.startsWith('product/search') ||
      route.startsWith('product/manufacturer') ||
      route.startsWith('common/home') ||
      parsed.searchParams.has('path') ||
      parsed.searchParams.has('search')
    ) {
      return false;
    }
    const cleanPath = parsed.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (!cleanPath || cleanPath === 'index.php') {
      return false;
    }
    if (
      cleanPath === 'shop' ||
      cleanPath === 'categories' ||
      cleanPath === 'category' ||
      cleanPath.startsWith('category/') ||
      cleanPath.startsWith('collection/') ||
      cleanPath.startsWith('collections/') ||
      cleanPath.startsWith('search')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function normalizeRelevaAffiliateUrl(
  rawUrl: string,
  urlKind?: 'product' | 'portal' | 'category'
): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return urlKind === 'portal' || urlKind === 'category'
      ? RELEVA_HOME_URL
      : buildRelevaProductUrl(130);
  }
  try {
    const parsed = new URL(trimmed);
    parsed.searchParams.delete('tracking');
    if (!isRelevaSpecificProductUrl(parsed.toString(), urlKind)) {
      return parsed.toString();
    }
    const base = parsed.toString();
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}tracking=${RELEVA_TRACKING_PARAM}`;
  } catch {
    const withoutTracking = trimmed.replace(/([?&])tracking=[^&]*(&?)/gi, (_m, sep, tail) =>
      sep === '?' && tail ? '?' : tail ? '&' : ''
    );
    if (urlKind === 'portal' || urlKind === 'category') {
      return withoutTracking;
    }
    const looksLikeProduct =
      withoutTracking.includes('route=product/product') ||
      withoutTracking.includes('product_id=');
    if (!looksLikeProduct) {
      return withoutTracking;
    }
    const sep = withoutTracking.includes('?') ? '&' : '?';
    return `${withoutTracking}${sep}tracking=${RELEVA_TRACKING_PARAM}`;
  }
}

export const CURATED_CATALOG_RECORDS: CatalogRecord[] = [
  // --- 10 VERIFIED AMAZON ASIN PRODUCT PAGES ---
  {
    id: 'amz-mx-master-3s',
    asin: 'B09HM94VDS',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    brand: 'Logitech',
    category: 'Computers & Accessories',
    department: 'Computers & Accessories',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B09HM94VDS'),
    urlKind: 'product',
    imageKey: 'mouse',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: true,
    description:
      'Ergonomic wireless mouse featuring an 8,000 DPI Darkfield sensor, Quiet Clicks switches, MagSpeed electromagnetic scrolling, and dual Bluetooth LE + Logi Bolt wireless.',
    highlights: [
      '200–8,000 DPI Darkfield sensor (tracks on glass) + MagSpeed scroll',
      'Up to 70-day rechargeable 500mAh Li-Po battery; Quiet Clicks tactile switches',
      'Connects up to 3 devices via Bluetooth Low Energy or Logi Bolt USB'
    ],
    specs: [
      { label: 'ASIN', value: 'B09HM94VDS' },
      { label: 'Sensor', value: '200–8,000 DPI Darkfield' },
      { label: 'Connectivity', value: 'Bluetooth LE & Logi Bolt USB' },
      { label: 'Battery', value: '500mAh Li-Po (up to 70 days)' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['workspace', 'mouse', 'ergonomic', 'productivity', 'computers']
  },
  {
    id: 'amz-benq-screenbar',
    asin: 'B08WT889V3',
    title: 'BenQ ScreenBar Halo LED Monitor Light Bar',
    brand: 'BenQ',
    category: 'Office & Workspace',
    department: 'Office & Workspace',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B08WT889V3'),
    urlKind: 'product',
    imageKey: 'screenbar',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'Asymmetrical monitor light bar with front task illumination, rear ambient bias backlight, and a wireless desktop rotary controller (2700K–6500K).',
    highlights: [
      'Asymmetrical zero-glare optics + Front / Back / Dual lighting modes',
      'Wireless rotary dial (2700K–6500K); USB 5V/1.7A powered',
      'Fits flat and curved monitors cleanly with weighted clamp mount'
    ],
    specs: [
      { label: 'ASIN', value: 'B08WT889V3' },
      { label: 'Color Temp', value: '2700K–6500K Stepless Dial' },
      { label: 'Controller', value: 'Wireless RF Desktop Dial' },
      { label: 'Power', value: 'USB 5V / 1.7A' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['workspace', 'lighting', 'monitor', 'desk', 'ergonomic']
  },
  {
    id: 'amz-sony-wh1000xm5',
    asin: 'B09XS7JWHH',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    brand: 'Sony',
    category: 'Audio & Headphones',
    department: 'Audio & Headphones',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B09XS7JWHH'),
    urlKind: 'product',
    imageKey: 'headphones',
    secondaryImageKey: 'headphoneStand',
    imageIsIllustrative: true,
    description:
      'Over-ear ANC headphones powered by Integrated Processor V1 and HD QN1 with 8 microphones, 30mm drivers, Bluetooth 5.2 multipoint, and up to 30-hour battery.',
    highlights: [
      'Dual V1 + QN1 ANC processors managing 8 microphones + Auto NC Optimizer',
      '30mm custom drivers, Bluetooth 5.2 multipoint (SBC/AAC/LDAC), up to 30h ANC',
      'Crystal clear hands-free calling with Speak-to-Chat and collapsible case'
    ],
    specs: [
      { label: 'ASIN', value: 'B09XS7JWHH' },
      { label: 'Drivers & ANC', value: '30mm Drivers · 8-Mic V1 + QN1' },
      { label: 'Bluetooth', value: '5.2 Multipoint (SBC/AAC/LDAC)' },
      { label: 'Battery', value: 'Up to 30 hours with ANC' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['audio', 'headphones', 'anc', 'creator', 'commuter']
  },
  {
    id: 'amz-anker-magsafe-3in1',
    asin: 'B0CFPHZZYT',
    title: 'Anker MagGo Wireless Charging Station (3-in-1 Qi2)',
    brand: 'Anker',
    category: 'Smart Home & Power',
    department: 'Smart Home & Power',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B0CFPHZZYT'),
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'Foldable Qi2-certified 15W magnetic 3-in-1 wireless charging station for iPhone, Apple Watch, and wireless earbuds, bundled with a 40W USB-C power adapter.',
    highlights: [
      'Qi2 certified 15W MagSafe-compatible fast wireless charging',
      'Foldable 3-in-1 desktop & travel form factor + 40W USB-C wall adapter',
      'Simultaneously powers iPhone, Apple Watch, and wireless earbuds'
    ],
    specs: [
      { label: 'ASIN', value: 'B0CFPHZZYT' },
      { label: 'Wireless Spec', value: 'Qi2 Certified 15W Max' },
      { label: 'Outputs', value: '3-in-1 (Phone + Watch + Earbuds)' },
      { label: 'Adapter', value: '40W USB-C PSU Included' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['power', 'charging', 'qi2', 'travel', 'wireless']
  },
  {
    id: 'amz-caldigit-ts4-dock',
    asin: 'B088F7SY6S',
    title: 'Anker 575 USB-C Docking Station (13-in-1)',
    brand: 'Anker',
    category: 'Computers & Accessories',
    department: 'Computers & Accessories',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B088F7SY6S'),
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      '13-in-1 powered USB-C docking station with 85W upstream laptop charging, 2x HDMI, 1x DisplayPort, 10Gbps USB-C, Gigabit Ethernet, SD/microSD, and 135W PSU.',
    highlights: [
      '13 ports: 2x HDMI, 1x DisplayPort, 10Gbps USB-C, 3x USB-A, GbE & SD/microSD',
      '85W upstream host Power Delivery + 18W front USB-C PD + 135W power supply',
      'Supports triple-display workstation expansion over a single USB-C cable'
    ],
    specs: [
      { label: 'ASIN', value: 'B088F7SY6S' },
      { label: 'Video Out', value: '2x HDMI + 1x DisplayPort' },
      { label: 'Power Delivery', value: '85W Host PD (135W Adapter)' },
      { label: 'Network & IO', value: 'GbE, SD/microSD, 10Gbps USB-C' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['workspace', 'computers', 'dock', 'usb-c', 'laptop']
  },
  {
    id: 'amz-huanuo-monitor-arm',
    asin: 'B08FB7WFCT',
    title: 'HUANUO Single Monitor Arm Gas Spring Desk Mount',
    brand: 'HUANUO',
    category: 'Office & Workspace',
    department: 'Office & Workspace',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B08FB7WFCT'),
    urlKind: 'product',
    imageKey: 'monitorArm',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'Aluminum gas-spring VESA desk mount supporting 13" to 34" displays (4.4 to 19.8 lbs) with C-clamp/grommet installation, tilt, swivel, and 360-degree rotation.',
    highlights: [
      'Fits 13"–34" monitors (4.4–19.8 lbs) with 75x75 or 100x100mm VESA',
      '+85°/-30° tilt, 180° swivel, 360° rotation; C-clamp or grommet mount',
      'Integrated cable management channels for a clutter-free desk'
    ],
    specs: [
      { label: 'ASIN', value: 'B08FB7WFCT' },
      { label: 'Display Size', value: '13" to 34" (4.4–19.8 lbs)' },
      { label: 'VESA Mount', value: '75x75mm & 100x100mm' },
      { label: 'Mounting', value: 'C-Clamp (0.39"–3.54") / Grommet' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['workspace', 'monitor', 'ergonomic', 'office']
  },
  {
    id: 'amz-samsung-t7-shield-2tb',
    asin: 'B09VLHR4JC',
    title: 'Samsung T7 Shield 2TB Portable Solid State Drive',
    brand: 'Samsung',
    category: 'Computers & Accessories',
    department: 'Computers & Accessories',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B09VLHR4JC'),
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'mouse',
    imageIsIllustrative: true,
    description:
      'Rugged 2TB portable NVMe SSD with IP65 water/dust resistance, 3-meter drop rating, AES 256-bit hardware encryption, and USB 3.2 Gen 2 (up to 1,050 MB/s read).',
    highlights: [
      'USB 3.2 Gen 2 (10Gbps): up to 1,050 MB/s read / 1,000 MB/s write',
      'IP65 dust/water resistance, up to 3m drop protection, AES 256-bit encryption',
      'Rubberized grip enclosure for reliable outdoor and studio workflows'
    ],
    specs: [
      { label: 'ASIN', value: 'B09VLHR4JC' },
      { label: 'Capacity & Bus', value: '2TB · USB 3.2 Gen 2 (10Gbps)' },
      { label: 'Speed', value: 'Up to 1,050 MB/s Read / 1,000 Write' },
      { label: 'Protection', value: 'IP65 & 3m Drop · 98g' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['computers', 'storage', 'creator', 'ssd', 'backup']
  },
  {
    id: 'amz-logitech-desk-mat',
    asin: 'B09DV85M6Y',
    title: 'Logitech Desk Mat Studio Series',
    brand: 'Logitech',
    category: 'Office & Workspace',
    department: 'Office & Workspace',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B09DV85M6Y'),
    urlKind: 'product',
    imageKey: 'deskMat',
    secondaryImageKey: 'mouse',
    imageIsIllustrative: true,
    description:
      'Extended spill-repellent desk pad (27.6 x 11.8 in, 2mm thick) with recycled polyester cloth weave, flat anti-fray edges, and natural rubber anti-slip base.',
    highlights: [
      'Large 27.6" × 11.8" (70 × 30 cm) × 2mm surface with anti-fray stitching',
      'Spill-repellent recycled polyester fabric & natural rubber anti-slip base',
      'Smooth fine-weave surface engineered for effortless mouse glide'
    ],
    specs: [
      { label: 'ASIN', value: 'B09DV85M6Y' },
      { label: 'Dimensions', value: '70 × 30 cm (27.6" × 11.8" × 2mm)' },
      { label: 'Materials', value: 'Spill-Repellent Polyester & Rubber' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['workspace', 'desk', 'office', 'accessories']
  },
  {
    id: 'amz-anker-prime-250w',
    asin: 'B0BYP2F3SG',
    title: 'Anker Prime 27,650mAh Power Bank (250W)',
    brand: 'Anker',
    category: 'Smart Home & Power',
    department: 'Smart Home & Power',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B0BYP2F3SG'),
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Airline-compliant 99.54Wh (27,650mAh) 3-port USB-C power bank delivering up to 250W total output with smart digital wattage display and app monitoring.',
    highlights: [
      '27,650mAh (99.54Wh) capacity · 250W total across 2x USB-C + 1x USB-A',
      'Rapid dual USB-C recharge + smart display & companion app monitoring',
      'Airline-safe capacity with high-speed laptop & phone delivery'
    ],
    specs: [
      { label: 'ASIN', value: 'B0BYP2F3SG' },
      { label: 'Capacity', value: '27,650mAh (99.54Wh)' },
      { label: 'Output & Ports', value: '250W Max (2x USB-C + 1x USB-A)' },
      { label: 'Display', value: 'Digital Wattage Display' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['power', 'travel', 'commuter', 'usb-c', 'laptop']
  },
  {
    id: 'amz-shure-mv7-mic',
    asin: 'B08G7RG9ML',
    title: 'Shure MV7 USB/XLR Podcast Microphone',
    brand: 'Shure',
    category: 'Audio & Headphones',
    department: 'Audio & Headphones',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B08G7RG9ML'),
    urlKind: 'product',
    imageKey: 'headphoneStand',
    secondaryImageKey: 'headphones',
    imageIsIllustrative: true,
    description:
      'Dynamic broadcast microphone with dual USB and XLR outputs, Voice Isolation directional capsule, built-in touch panel controls, and 3.5mm zero-latency monitoring.',
    highlights: [
      'Hybrid USB + XLR connectivity for laptops or studio audio interfaces',
      'Voice Isolation capsule, integrated touch controls & 3.5mm headphone jack',
      'All-metal yoke mount ideal for podcasting, streaming, and vocals'
    ],
    specs: [
      { label: 'ASIN', value: 'B08G7RG9ML' },
      { label: 'Transducer', value: 'Dynamic (Voice Isolation)' },
      { label: 'Outputs', value: 'USB + XLR + 3.5mm Monitor' },
      { label: 'Software', value: 'ShurePlus MOTIV Auto-Level & EQ' },
      { label: 'Price', value: 'Check live price on Amazon' }
    ],
    originStore: 'Amazon',
    tags: ['audio', 'creator', 'microphone', 'studio', 'podcast']
  },

  // --- 5 RELEVA BD AFFILIATE PRODUCT LINKS (USER REQUESTED) ---
  {
    id: 'releva-bd-130',
    title: 'Releva BD Featured Product #130',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD',
    primeEligible: false,
    deliveryEstimate: 'Check delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(130),
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'Featured product (#130) on Releva BD. Visit Releva BD to view full product details, current BDT pricing, stock availability, and local delivery options.',
    highlights: [
      'Official product listing on Releva BD',
      'Live BDT pricing & stock availability on checkout page',
      'Local Bangladesh delivery options via Releva BD'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Catalog Item', value: '#130' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  {
    id: 'releva-bd-131',
    title: 'Releva BD Featured Product #131',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD',
    primeEligible: false,
    deliveryEstimate: 'Check delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(131),
    urlKind: 'product',
    imageKey: 'deskMat',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Featured product (#131) on Releva BD. Open Releva BD directly to inspect item details, live pricing, and local delivery.',
    highlights: [
      'Official product listing on Releva BD',
      'Live BDT pricing & stock availability on checkout page',
      'Local Bangladesh delivery options via Releva BD'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Catalog Item', value: '#131' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  {
    id: 'releva-bd-129',
    title: 'Releva BD Featured Product #129',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD',
    primeEligible: false,
    deliveryEstimate: 'Check delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(129),
    urlKind: 'product',
    imageKey: 'heroWorkspace',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Featured product (#129) on Releva BD. View full item specifications, stock status, and BDT pricing directly on Releva BD.',
    highlights: [
      'Official product listing on Releva BD',
      'Live BDT pricing & stock availability on checkout page',
      'Local Bangladesh delivery options via Releva BD'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Catalog Item', value: '#129' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  {
    id: 'releva-bd-133',
    title: 'Releva BD Featured Product #133',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD',
    primeEligible: false,
    deliveryEstimate: 'Check delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(133),
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: true,
    description:
      'Featured product (#133) on Releva BD. Open the product page on Releva BD for live price, description, and delivery.',
    highlights: [
      'Official product listing on Releva BD',
      'Live BDT pricing & stock availability on checkout page',
      'Local Bangladesh delivery options via Releva BD'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Catalog Item', value: '#133' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  {
    id: 'releva-bd-135',
    title: 'Releva BD Featured Product #135',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD',
    primeEligible: false,
    deliveryEstimate: 'Check delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(135),
    urlKind: 'product',
    imageKey: 'headphoneStand',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Featured product (#135) on Releva BD. Open the product page on Releva BD for live price, availability, and order options.',
    highlights: [
      'Official product listing on Releva BD',
      'Live BDT pricing & stock availability on checkout page',
      'Local Bangladesh delivery options via Releva BD'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Catalog Item', value: '#135' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  ...([
    134, 106, 107, 108, 85, 109, 86, 87, 110, 112, 88, 111, 89, 90, 114,
    91, 115, 93, 120, 117, 94, 95, 118, 96, 119, 97, 121, 98, 99, 122,
    100, 113, 123, 101, 124, 125, 102, 126, 103, 127, 92, 128, 116
  ] as const).map((pid, idx): CatalogRecord => {
    const keys: ImageKey[] = [
      'growthBundle',
      'deskMat',
      'heroWorkspace',
      'magsafe',
      'headphoneStand',
      'screenbar',
      'headphones',
      'monitorArm',
      'mouse'
    ];
    const imageKey = keys[idx % keys.length];
    const secondaryImageKey = keys[(idx + 1) % keys.length];
    return {
      id: `releva-bd-${pid}`,
      title: `Releva BD Featured Product #${pid}`,
      brand: 'Releva BD',
      category: 'Releva BD Picks',
      department: 'Releva BD Picks',
      sourceType: 'linked-shop',
      price: 0,
      priceStatus: 'live-at-partner',
      badge: 'Releva BD',
      primeEligible: false,
      deliveryEstimate: 'Check delivery & BDT price on Releva BD',
      affiliateUrl: `https://releva.com.bd/index.php?route=product/product&path=&product_id=${pid}&tracking=${RELEVA_TRACKING_PARAM}`,
      urlKind: 'product',
      imageKey,
      secondaryImageKey,
      imageIsIllustrative: true,
      description: `Featured product (#${pid}) on Releva BD. Open the product page on Releva BD to inspect full product details, current BDT pricing, stock availability, and local delivery options.`,
      highlights: [
        'Official product listing on Releva BD',
        'Live BDT pricing & stock availability on checkout page',
        'Local Bangladesh delivery options via Releva BD'
      ],
      specs: [
        { label: 'Partner', value: 'Releva BD' },
        { label: 'Catalog Item', value: `#${pid}` },
        { label: 'Price', value: 'Check live price on Releva BD' }
      ],
      originStore: 'Releva BD',
      tags: ['everyday', 'bangladesh', 'releva', String(pid)]
    };
  }),

  // --- 3 EXONHOST CLOUD HOSTING & DOMAIN PLANS ---
  {
    id: 'exonhost-turbo-nvme',
    title: 'ExonHost Shared & Turbo NVMe Web Hosting',
    brand: 'ExonHost',
    category: 'Cloud Hosting & Domains',
    department: 'Cloud Hosting & Domains',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'ExonHost',
    primeEligible: false,
    deliveryEstimate: 'Instant setup via ExonHost',
    affiliateUrl: EXONHOST_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'cloudServer',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'LiteSpeed + LSCache web hosting with unlimited Let’s Encrypt SSL, JetBackup daily backups, CloudLinux CageFS security, and BDIX or international servers.',
    highlights: [
      'LiteSpeed Web Server + LSCache & unlimited Let’s Encrypt SSL',
      'JetBackup daily automated backups & CloudLinux CageFS security',
      'BDIX (Dhaka) & international data center options available'
    ],
    specs: [
      { label: 'Partner', value: 'ExonHost' },
      { label: 'Stack', value: 'LiteSpeed + LSCache · CloudLinux' },
      { label: 'Backups & SSL', value: 'JetBackup Daily · Free SSL' },
      { label: 'Price', value: 'Check live plan rates on ExonHost' }
    ],
    originStore: 'ExonHost',
    tags: ['hosting', 'web', 'cloud', 'domains', 'bangladesh']
  },
  {
    id: 'exonhost-managed-wp',
    title: 'ExonHost WordPress Hosting & LSCache Plans',
    brand: 'ExonHost',
    category: 'Cloud Hosting & Domains',
    department: 'Cloud Hosting & Domains',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'ExonHost',
    primeEligible: false,
    deliveryEstimate: 'Instant setup via ExonHost',
    affiliateUrl: EXONHOST_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'cloudServer',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'WordPress-optimized hosting featuring Softaculous 1-click installer, WP Manager, LSCache acceleration, PHP selector (5.6–8.x), and free site migration.',
    highlights: [
      'Softaculous 1-click WordPress setup & WP Manager tools',
      'LSCache acceleration & complimentary website migration',
      'Flexible PHP versions & CageFS + DDoS filtering'
    ],
    specs: [
      { label: 'Partner', value: 'ExonHost' },
      { label: 'Tools', value: 'Softaculous · WordPress Manager' },
      { label: 'Protection', value: 'CageFS + 20 Gbps+ DDoS Filtering' },
      { label: 'Price', value: 'Check live plan rates on ExonHost' }
    ],
    originStore: 'ExonHost',
    tags: ['hosting', 'wordpress', 'web', 'cloud']
  },
  {
    id: 'exonhost-domain-bundle',
    title: 'ExonHost KVM NVMe VPS & Domain Registration',
    brand: 'ExonHost',
    category: 'Cloud Hosting & Domains',
    department: 'Cloud Hosting & Domains',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'ExonHost',
    primeEligible: false,
    deliveryEstimate: 'Instant setup via ExonHost',
    affiliateUrl: EXONHOST_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'cloudServer',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: true,
    description:
      'Linux KVM NVMe VPS (BDIX & global nodes) with full root SSH access, dedicated static IPv4, weekly snapshots, and domain registration via ExonHost.',
    highlights: [
      'Dedicated NVMe storage, full root SSH access & static IPv4',
      'BDIX low-latency routing and global data center nodes',
      'Top-level domain registration & weekly server snapshots'
    ],
    specs: [
      { label: 'Partner', value: 'ExonHost' },
      { label: 'Virtualization', value: 'Linux KVM · NVMe SSD · Root SSH' },
      { label: 'Nodes', value: 'BDIX (Dhaka) & International' },
      { label: 'Price', value: 'Check live rates on ExonHost' }
    ],
    originStore: 'ExonHost',
    tags: ['hosting', 'domains', 'vps', 'web']
  },

  // --- 4 ALIBABA SOURCING PORTAL PICKS ---
  {
    id: 'alibaba-ergonomic-monitor-arm-bulk',
    title: 'Alibaba — Monitor Arms & Desk Mount Sourcing',
    brand: 'Alibaba',
    category: 'Office & Workspace',
    department: 'Office & Workspace',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Alibaba',
    primeEligible: false,
    deliveryEstimate: 'MOQ, freight & protection terms on Alibaba',
    affiliateUrl: ALIBABA_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'monitorArm',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'Source gas-spring monitor arms, aluminum laptop stands, and office mounts directly from verified Alibaba suppliers.',
    highlights: [
      'Compare sample orders, bulk unit tiers & custom office mounts',
      'Review MOQ and Trade Assurance freight quotes on Alibaba'
    ],
    specs: [
      { label: 'Partner', value: 'Alibaba' },
      { label: 'Storefront', value: 'Alibaba Verified Suppliers' },
      { label: 'Price', value: 'Check live supplier quotes on Alibaba' }
    ],
    originStore: 'Alibaba',
    tags: ['sourcing', 'workspace', 'ergonomic', 'alibaba']
  },
  {
    id: 'alibaba-usb-c-dock-factory-lot',
    title: 'Alibaba — USB-C Hubs & Peripherals Sourcing',
    brand: 'Alibaba',
    category: 'Computers & Accessories',
    department: 'Computers & Accessories',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Alibaba',
    primeEligible: false,
    deliveryEstimate: 'MOQ, freight & protection terms on Alibaba',
    affiliateUrl: ALIBABA_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'mouse',
    imageIsIllustrative: true,
    description:
      'Browse sample and wholesale computer accessory suppliers on Alibaba including USB-C docks, adapters, and desk gear.',
    highlights: [
      'Compare sample pricing, MOQ & shipping options on Alibaba',
      'Verified Trade Assurance checkout protection available'
    ],
    specs: [
      { label: 'Partner', value: 'Alibaba' },
      { label: 'Storefront', value: 'Alibaba Verified Suppliers' },
      { label: 'Price', value: 'Check live supplier quotes on Alibaba' }
    ],
    originStore: 'Alibaba',
    tags: ['sourcing', 'computers', 'wholesale', 'alibaba']
  },
  {
    id: 'alibaba-studio-creator-desk-bundle',
    title: 'Alibaba — Studio Lighting & Audio Gear Sourcing',
    brand: 'Alibaba',
    category: 'Audio & Headphones',
    department: 'Audio & Headphones',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Alibaba',
    primeEligible: false,
    deliveryEstimate: 'MOQ, freight & protection terms on Alibaba',
    affiliateUrl: ALIBABA_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'screenbar',
    secondaryImageKey: 'headphoneStand',
    imageIsIllustrative: true,
    description:
      'Discover studio key lights, microphone boom arms, and audio production accessories from Alibaba manufacturers.',
    highlights: [
      'Check sample availability & wholesale unit tiers on Alibaba',
      'Direct manufacturer quotes & creator studio equipment'
    ],
    specs: [
      { label: 'Partner', value: 'Alibaba' },
      { label: 'Storefront', value: 'Alibaba Verified Suppliers' },
      { label: 'Price', value: 'Check live supplier quotes on Alibaba' }
    ],
    originStore: 'Alibaba',
    tags: ['sourcing', 'audio', 'creator', 'lighting', 'alibaba']
  },
  {
    id: 'alibaba-smart-qi2-charging-pad-pro',
    title: 'Alibaba — Wireless Chargers & Power Hardware',
    brand: 'Alibaba',
    category: 'Smart Home & Power',
    department: 'Smart Home & Power',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Alibaba',
    primeEligible: false,
    deliveryEstimate: 'MOQ, freight & protection terms on Alibaba',
    affiliateUrl: ALIBABA_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: true,
    description:
      'Source 3-in-1 magnetic wireless charging stands, GaN power bricks, and desk power accessories on Alibaba.',
    highlights: [
      'Compare Qi2 wireless stands & GaN fast-charging hardware',
      'Confirm electrical certifications & live quotes on Alibaba'
    ],
    specs: [
      { label: 'Partner', value: 'Alibaba' },
      { label: 'Storefront', value: 'Alibaba Verified Suppliers' },
      { label: 'Price', value: 'Check live supplier quotes on Alibaba' }
    ],
    originStore: 'Alibaba',
    tags: ['sourcing', 'power', 'charging', 'alibaba']
  },

  // --- 5 BANGLASHOPPERS REAL SKINCARE & BEAUTY PRODUCTS ---
  {
    id: 'bs-some-by-mi-miracle-serum',
    title: 'Some By Mi AHA.BHA.PHA 30 Days Miracle Serum (50ml)',
    brand: 'Some By Mi',
    category: 'BanglaShoppers Beauty',
    department: 'BanglaShoppers Beauty',
    sourceType: 'linked-shop',
    price: 0,
    nativeCurrency: 'BDT',
    priceStatus: 'live-at-partner',
    badge: 'BanglaShoppers',
    primeEligible: false,
    deliveryEstimate: 'Authentic skincare delivery in Bangladesh via BanglaShoppers',
    affiliateUrl: BANGLASHOPPERS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Dual-layer AHA, BHA, and PHA soothing serum with tea tree leaf water and Centella Asiatica extract, available on BanglaShoppers.',
    highlights: [
      'Authentic Korean skincare distributed via BanglaShoppers',
      '50ml bottle with gentle exfoliating AHA/BHA/PHA blend & tea tree calm care',
      'Check live pricing, discount campaigns & Bangladesh delivery on BanglaShoppers'
    ],
    specs: [
      { label: 'Brand', value: 'Some By Mi' },
      { label: 'Volume', value: '50 ml' },
      { label: 'Origin', value: 'South Korea' },
      { label: 'Retailer', value: 'BanglaShoppers' }
    ],
    originStore: 'BanglaShoppers',
    tags: ['skincare', 'serum', 'some by mi', 'banglashoppers', 'beauty', 'bangladesh']
  },
  {
    id: 'bs-cosrx-propolis-toner',
    title: 'COSRX Full Fit Propolis Synergy Toner (150ml)',
    brand: 'COSRX',
    category: 'BanglaShoppers Beauty',
    department: 'BanglaShoppers Beauty',
    sourceType: 'linked-shop',
    price: 0,
    nativeCurrency: 'BDT',
    priceStatus: 'live-at-partner',
    badge: 'BanglaShoppers',
    primeEligible: false,
    deliveryEstimate: 'Authentic skincare delivery in Bangladesh via BanglaShoppers',
    affiliateUrl: BANGLASHOPPERS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Hydrating daily toner formulated with 72.6% black bee propolis extract and 10% honey extract for smooth skin barrier support.',
    highlights: [
      '150ml alcohol-free nourishing K-beauty toner available at BanglaShoppers',
      'Formulated with propolis and honey extracts for lightweight hydration',
      'Live price, stock & nationwide shipping confirmed on BanglaShoppers'
    ],
    specs: [
      { label: 'Brand', value: 'COSRX' },
      { label: 'Volume', value: '150 ml' },
      { label: 'Key Ingredient', value: 'Black Bee Propolis & Honey Extract' },
      { label: 'Retailer', value: 'BanglaShoppers' }
    ],
    originStore: 'BanglaShoppers',
    tags: ['skincare', 'toner', 'cosrx', 'banglashoppers', 'beauty', 'bangladesh']
  },
  {
    id: 'bs-missha-aqua-sun-gel',
    title: 'Missha All Around Safe Block Aqua Sun Gel SPF50+ / PA++++ (50ml)',
    brand: 'Missha',
    category: 'BanglaShoppers Beauty',
    department: 'BanglaShoppers Beauty',
    sourceType: 'linked-shop',
    price: 0,
    nativeCurrency: 'BDT',
    priceStatus: 'live-at-partner',
    badge: 'BanglaShoppers',
    primeEligible: false,
    deliveryEstimate: 'Authentic skincare delivery in Bangladesh via BanglaShoppers',
    affiliateUrl: BANGLASHOPPERS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Lightweight cooling water-gel sunscreen offering SPF50+ PA++++ broad-spectrum protection with zero white cast.',
    highlights: [
      'Fast-absorbing gel finish suitable for humid weather & daily wear',
      'Glacier water & ice plant extracts refresh skin without stickiness',
      'Verify live availability and promotional offers on BanglaShoppers'
    ],
    specs: [
      { label: 'Brand', value: 'Missha' },
      { label: 'Protection', value: 'SPF50+ / PA++++' },
      { label: 'Volume', value: '50 ml' },
      { label: 'Retailer', value: 'BanglaShoppers' }
    ],
    originStore: 'BanglaShoppers',
    tags: ['sunscreen', 'sunblock', 'missha', 'banglashoppers', 'skincare', 'beauty']
  },
  {
    id: 'bs-neutrogena-ultra-sheer',
    title: 'Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 55 (88ml)',
    brand: 'Neutrogena',
    category: 'BanglaShoppers Beauty',
    department: 'BanglaShoppers Beauty',
    sourceType: 'linked-shop',
    price: 0,
    nativeCurrency: 'BDT',
    priceStatus: 'live-at-partner',
    badge: 'BanglaShoppers',
    primeEligible: false,
    deliveryEstimate: 'Authentic skincare delivery in Bangladesh via BanglaShoppers',
    affiliateUrl: BANGLASHOPPERS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Non-greasy, water-resistant SPF 55 broad-spectrum UVA/UVB sunscreen with Dry-Touch matte finish, stocked at BanglaShoppers.',
    highlights: [
      'Helioplex broad-spectrum UVA/UVB protection; water-resistant up to 80 minutes',
      'Oil-free, non-comedogenic dry-touch matte formula for face and body',
      'Check live BanglaShoppers price & showroom/home delivery options'
    ],
    specs: [
      { label: 'Brand', value: 'Neutrogena' },
      { label: 'Protection', value: 'Broad Spectrum SPF 55' },
      { label: 'Volume', value: '88 ml (3 fl oz)' },
      { label: 'Retailer', value: 'BanglaShoppers' }
    ],
    originStore: 'BanglaShoppers',
    tags: ['sunscreen', 'neutrogena', 'banglashoppers', 'skincare', 'beauty']
  },
  {
    id: 'bs-body-shop-vitamin-e',
    title: 'The Body Shop Vitamin E Moisture Day Cream (50ml)',
    brand: 'The Body Shop',
    category: 'BanglaShoppers Beauty',
    department: 'BanglaShoppers Beauty',
    sourceType: 'linked-shop',
    price: 0,
    nativeCurrency: 'BDT',
    priceStatus: 'live-at-partner',
    badge: 'BanglaShoppers',
    primeEligible: false,
    deliveryEstimate: 'Authentic skincare delivery in Bangladesh via BanglaShoppers',
    affiliateUrl: BANGLASHOPPERS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Everyday hydrating day cream enriched with natural-origin Vitamin E and hyaluronic acid for 48-hour moisture lock.',
    highlights: [
      'Lightweight fast-absorbing day moisturizer suitable for all skin types',
      'Official The Body Shop skincare curated through BanglaShoppers',
      'Verify latest price & nationwide BD courier delivery on BanglaShoppers'
    ],
    specs: [
      { label: 'Brand', value: 'The Body Shop' },
      { label: 'Volume', value: '50 ml' },
      { label: 'Formula', value: 'Vitamin E & Bio-Fermented Hyaluronic Acid' },
      { label: 'Retailer', value: 'BanglaShoppers' }
    ],
    originStore: 'BanglaShoppers',
    tags: ['moisturizer', 'cream', 'the body shop', 'banglashoppers', 'skincare', 'beauty']
  },

  // --- 5 ILLIN BD REAL LIVE HOME & GADGET PRODUCTS ---
  {
    id: 'illin-miyako-coffee-maker-cm327',
    title: 'Miyako Electric Coffee Maker CM-327 (1000W)',
    brand: 'Miyako',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 2950,
    nativeCurrency: 'BDT',
    price: 24.28,
    originalPrice: 32.51,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: ILLIN_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      '1000W electric drip coffee maker brewing 12–15 cups with Auto Keep Warm warming plate, permanent filter, and overheat protection.',
    highlights: [
      '1000W rapid brewing system with 12–15 cup glass carafe capacity',
      'Reusable permanent mesh filter, Auto Keep Warm & overheat cutoff',
      'Ref. 2,950 BDT (regular 3,950 BDT) via Illin BD partner storefront'
    ],
    specs: [
      { label: 'Brand / Model', value: 'Miyako CM-327' },
      { label: 'Power', value: '1000W · Auto Keep Warm' },
      { label: 'Capacity', value: '12–15 Cups' },
      { label: 'Price', value: '2,950 BDT (Ref.)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['coffee maker', 'miyako', 'kitchen', 'appliance', 'illin', 'bangladesh']
  },
  {
    id: 'illin-bread-toaster-kt420fs',
    title: 'Electric Bread Toaster KT-420 FS Stainless Finish',
    brand: 'Illin Appliance',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 3650,
    nativeCurrency: 'BDT',
    price: 30.04,
    originalPrice: 39.92,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: ILLIN_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Dual-slot electric bread toaster with variable browning control, quick-cancel button, and removable crumb tray for daily breakfast prep.',
    highlights: [
      'Wide dual slots with multi-level toast shade dial & auto pop-up',
      'Compact stainless-accent body with slide-out crumb tray',
      'Ref. 3,650 BDT (regular 4,850 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Model', value: 'KT-420 FS' },
      { label: 'Slots', value: '2-Slice Auto Pop-Up' },
      { label: 'Price', value: '3,650 BDT (Ref.)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['toaster', 'kitchen', 'appliance', 'illin', 'bangladesh']
  },
  {
    id: 'illin-mini-air-cooler',
    title: 'Original Mini Air Cooler — Portable USB Desk AC',
    brand: 'Illin Tech',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 1099,
    nativeCurrency: 'BDT',
    price: 9.05,
    originalPrice: 16.05,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: ILLIN_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Compact USB evaporative mini air cooler designed for study desks, workspaces, and bedside cooling with 3-speed fan control.',
    highlights: [
      'Portable USB-powered personal evaporative air cooler for desk use',
      'Three fan speed levels with compact water reservoir & mist cooling',
      'Ref. 1,099 BDT (regular 1,950 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Type', value: 'Portable USB Evaporative Mini Air Cooler' },
      { label: 'Speed Modes', value: '3-Speed Adjustable Fan' },
      { label: 'Price', value: '1,099 BDT (Ref.)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['air cooler', 'fan', 'desk', 'cooling', 'illin', 'bangladesh']
  },
  {
    id: 'illin-miyako-espresso-cm2038',
    title: 'Miyako CM-2038 BT Espresso & Cappuccino Maker',
    brand: 'Miyako',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 8499,
    nativeCurrency: 'BDT',
    price: 69.95,
    originalPrice: 119.34,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: ILLIN_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Countertop pressure espresso machine with integrated steam milk frother wand for espresso shots, cappuccino, and latte drinks.',
    highlights: [
      'High-pressure espresso extraction + adjustable stainless steam wand',
      'Removable drip tray and cup warmer top plate for office or home bars',
      'Ref. 8,499 BDT (regular 14,500 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Brand / Model', value: 'Miyako CM-2038 BT' },
      { label: 'Features', value: 'Espresso Extraction + Milk Frother Wand' },
      { label: 'Price', value: '8,499 BDT (Ref.)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['espresso', 'coffee', 'miyako', 'appliance', 'illin', 'bangladesh']
  },
  {
    id: 'illin-miyako-food-chopper',
    title: 'Miyako Food Chopper MC-065 Multi-Speed Grinder',
    brand: 'Miyako',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 2850,
    nativeCurrency: 'BDT',
    price: 23.46,
    originalPrice: 31.69,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: ILLIN_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Heavy-duty kitchen food chopper with multi-blade stainless steel cutter and large-capacity bowl for vegetables, meats, and spices.',
    highlights: [
      'Dual-speed pulse motor & sharp stainless multi-blade assembly',
      'Easy-clean bowl and non-slip base for everyday home cooking',
      'Ref. 2,850 BDT (regular 3,850 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Brand / Model', value: 'Miyako MC-065' },
      { label: 'Blades', value: 'Stainless Steel Multi-Blade' },
      { label: 'Price', value: '2,850 BDT (Ref.)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['food chopper', 'kitchen', 'miyako', 'appliance', 'illin', 'bangladesh']
  },
  {
    id: 'illin-royal-purple-bedsheet',
    title: 'Royal Purple Floral Cotton Bedsheet Set',
    brand: 'Illin BD',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 949,
    nativeCurrency: 'BDT',
    price: 7.81,
    originalPrice: 9.87,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/royal-purple-floral-cotton-bedsheet-set/40989',
    urlKind: 'product',
    imageKey: 'deskMat',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: false,
    description:
      'Breathable cotton double-size bedsheet set in a rich royal purple floral print with matching pillow covers for everyday bedroom comfort.',
    highlights: [
      'Soft breathable cotton weave with fade-resistant royal purple floral pattern',
      'Direct affiliate product listing on Illin BD with matching pillowcase set',
      'Ref. 949 BDT (regular 1,199 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Material', value: 'Soft Breathable Cotton' },
      { label: 'Colorway', value: 'Royal Purple Floral' },
      { label: 'Price', value: '949 BDT (Ref. · orig. 1,199 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['bedsheet', 'cotton', 'purple', 'floral', 'home', 'bedding', 'illin', 'bangladesh']
  },
  {
    id: 'illin-jennie-moon-soap',
    title: 'Jennie Moon 90X Power of Moonlight Brightening Soap (160g)',
    brand: 'Jennie Moon',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 499,
    nativeCurrency: 'BDT',
    price: 4.11,
    originalPrice: 7.4,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/jennie-moon-90x-power-of-moonlight-brightening-soap/40989',
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      '160g daily cleansing bar formulated to gently wash away dull surface buildup and leave skin feeling smooth, clean, and refreshed.',
    highlights: [
      '160g rich-lather brightening soap bar for face and body skincare routines',
      'Direct Illin BD affiliate link with nationwide cash-on-delivery checkout',
      'Ref. 499 BDT (regular 899 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Brand', value: 'Jennie Moon' },
      { label: 'Net Weight', value: '160g' },
      { label: 'Price', value: '499 BDT (Ref. · orig. 899 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['soap', 'jennie moon', 'brightening', 'skincare', 'beauty', 'illin', 'bangladesh']
  },
  {
    id: 'illin-sp6-whitening-toothpaste',
    title: 'SP-6 Probiotic Bright Whitening Toothpaste',
    brand: 'SP-6',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 449,
    nativeCurrency: 'BDT',
    price: 3.7,
    originalPrice: 6.17,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/sp-6-probiotic-bright-whitening-toothpaste/40989',
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Probiotic whitening toothpaste crafted to polish daily coffee and tea surface stains while supporting fresh breath and balanced oral care.',
    highlights: [
      'Probiotic oral-care formula for gentle everyday enamel brightening & fresh breath',
      'Direct Illin BD affiliate product page with verified partner pricing',
      'Ref. 449 BDT (regular 750 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Formula', value: 'SP-6 Probiotic Bright Whitening' },
      { label: 'Use', value: 'Daily Enamel Polish & Fresh Breath' },
      { label: 'Price', value: '449 BDT (Ref. · orig. 750 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['toothpaste', 'sp-6', 'probiotic', 'whitening', 'oral care', 'illin', 'bangladesh']
  },
  {
    id: 'illin-toenailplus-relief-oil',
    title: 'German ToenailPlus Anti Paronychia Relief Oil',
    brand: 'ToenailPlus',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 299,
    nativeCurrency: 'BDT',
    price: 2.46,
    originalPrice: 4.11,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/german-toenailplus-anti-paronychia-relief-oil/40989',
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Targeted dropper oil designed to soothe discomfort around the nail fold, soften thick edges, and support clean daily foot and nail care.',
    highlights: [
      'Precision dropper serum for soothing cuticles & supporting healthy nail beds',
      'Direct affiliate URL on Illin BD with doorstep delivery across Bangladesh',
      'Ref. 299 BDT (regular 499 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Type', value: 'Anti-Paronychia Nail Relief Oil' },
      { label: 'Application', value: 'Dropper Bottle for Nails & Cuticles' },
      { label: 'Price', value: '299 BDT (Ref. · orig. 499 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['oil', 'nail care', 'toenail', 'relief', 'personal care', 'illin', 'bangladesh']
  },
  {
    id: 'illin-poedagar-men-watch-1563',
    title: 'POEDAGAR Luxury Business Quartz Men’s Watch (Luminous Week Date)',
    brand: 'POEDAGAR',
    category: 'Wearables & Smartwatches',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 1499,
    nativeCurrency: 'BDT',
    price: 12.34,
    originalPrice: 20.99,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/poedagar-men-watch-1563/40989',
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Luxury stainless-steel men’s quartz business wristwatch featuring luminous hands, day/week & date calendar window, and daily water resistance.',
    highlights: [
      'Stainless steel bracelet, luminous dial hands & week/date calendar window',
      'Direct Illin BD affiliate product link with cash-on-delivery across Bangladesh',
      'Ref. 1,499 BDT (regular 2,550 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Brand', value: 'POEDAGAR' },
      { label: 'Movement', value: 'Business Quartz · Luminous Week/Date' },
      { label: 'Case & Strap', value: 'Stainless Steel · Waterproof' },
      { label: 'Price', value: '1,499 BDT (Ref. · orig. 2,550 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['watch', 'poedagar', 'mens watch', 'quartz', 'stainless steel', 'illin', 'bangladesh']
  },
  {
    id: 'illin-poedagar-watch-1565',
    title: 'POEDAGAR Waterproof Casual Fashion Watch (Stainless Steel)',
    brand: 'POEDAGAR',
    category: 'Wearables & Smartwatches',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 1599,
    nativeCurrency: 'BDT',
    price: 13.16,
    originalPrice: 20.99,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/poedagar-watch-1565/40989',
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Everyday casual and fashion wristwatch by POEDAGAR with water-resistant construction, stainless finish, and clean formal-casual dial.',
    highlights: [
      'Casual & business-ready waterproof wristwatch with durable clasp strap',
      'Direct Illin BD affiliate link with nationwide doorstep delivery',
      'Ref. 1,599 BDT (regular 2,550 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Brand', value: 'POEDAGAR' },
      { label: 'Style', value: 'Casual & Fashion Dress Watch' },
      { label: 'Resistance', value: 'Waterproof Daily Wear' },
      { label: 'Price', value: '1,599 BDT (Ref. · orig. 2,550 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['watch', 'poedagar', 'fashion watch', 'waterproof', 'illin', 'bangladesh']
  },
  {
    id: 'illin-poedagar-green-1645',
    title: 'POEDAGAR Emerald Green Luxury Men’s Calendar Watch (Luminous Steel)',
    brand: 'POEDAGAR',
    category: 'Wearables & Smartwatches',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 1499,
    nativeCurrency: 'BDT',
    price: 12.34,
    originalPrice: 26.75,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/poedagar-mens-watch-green-1645/40989',
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Emerald green dial POEDAGAR men’s business wristwatch built with a brushed steel band, luminous markers, calendar display, and waterproof seal.',
    highlights: [
      'Signature green textured dial with luminous hands & date calendar display',
      'Brushed stainless steel strap suited for office and evening wear',
      'Ref. 1,499 BDT (regular 3,250 BDT) via direct Illin BD link'
    ],
    specs: [
      { label: 'Brand', value: 'POEDAGAR' },
      { label: 'Dial', value: 'Emerald Green · Luminous Hands & Calendar' },
      { label: 'Band', value: 'Stainless Steel Waterproof' },
      { label: 'Price', value: '1,499 BDT (Ref. · orig. 3,250 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['watch', 'poedagar', 'green watch', 'mens watch', 'steel', 'illin', 'bangladesh']
  },
  {
    id: 'illin-poedagar-women-1727',
    title: 'POEDAGAR Rose Gold Women’s Fashion Business Quartz Watch (Week Date)',
    brand: 'POEDAGAR',
    category: 'Wearables & Smartwatches',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 1550,
    nativeCurrency: 'BDT',
    price: 12.76,
    originalPrice: 20.58,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/poedagar-womens-watch-1727/40989',
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Slim rose-gold stainless steel ladies quartz wristwatch featuring luminous week/date indicators, waterproof casing, and refined bracelet links.',
    highlights: [
      'Rose-gold stainless steel bracelet watch with luminous week/date dial',
      'Water-resistant business & gift-ready timepiece on Illin BD',
      'Ref. 1,550 BDT (regular 2,500 BDT) on Illin BD'
    ],
    specs: [
      { label: 'Brand', value: 'POEDAGAR' },
      { label: 'Finish', value: 'Rose Gold Stainless Steel' },
      { label: 'Features', value: 'Quartz · Luminous Week/Date · Waterproof' },
      { label: 'Price', value: '1,550 BDT (Ref. · orig. 2,500 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['watch', 'poedagar', 'womens watch', 'rose gold', 'ladies watch', 'illin', 'bangladesh']
  },
  {
    id: 'illin-air-cooler-3in1-fan',
    title: 'Air Cooling 3-in-1 USB Mini Portable Fan, Humidifier & LED Mist Cooler',
    brand: 'Illin Tech',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 1399,
    nativeCurrency: 'BDT',
    price: 11.51,
    originalPrice: 16.45,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/-air-cooling-3-in-1-usb-mini-portable-fan-aircond-humidifier-purifier-mist-cooler-with-led-light/40989',
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Compact 3-in-1 desktop air cooler combining cooling fan airflow, fine ultrasonic mist humidification, and ambient LED night light over USB power.',
    highlights: [
      '3-in-1 portable desk fan, mist humidifier & soothing LED ambient lamp',
      'USB-powered for study desks, laptops, power banks, or bedside cooling',
      'Ref. 1,399 BDT (regular 1,999 BDT) via direct Illin BD link'
    ],
    specs: [
      { label: 'Functions', value: 'Cooling Fan + Mist Humidifier + LED Light' },
      { label: 'Power', value: 'USB Portable Desktop Cooler' },
      { label: 'Price', value: '1,399 BDT (Ref. · orig. 1,999 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['fan', 'air cooler', 'mist cooler', 'humidifier', 'usb', 'led', 'illin', 'bangladesh']
  },
  {
    id: 'illin-folding-fan-lr2018',
    title: 'Rechargeable Folding Table Fan with LED Light (LR-2018)',
    brand: 'Illin Tech',
    category: 'Illin BD Home & Tech',
    department: 'Illin BD Home & Tech',
    sourceType: 'linked-shop',
    nativePrice: 999,
    nativeCurrency: 'BDT',
    price: 8.22,
    originalPrice: 15.23,
    priceStatus: 'reference',
    badge: 'Illin BD',
    primeEligible: false,
    deliveryEstimate: 'Home delivery across Bangladesh via Illin BD',
    affiliateUrl: 'https://illin.com.bd/folding-fan-with-led-light-lr-2018/40989',
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Space-saving rechargeable folding desk and emergency table fan featuring an integrated bright LED lamp for study tables, power outages, and travel.',
    highlights: [
      'Compact foldable body doubles as a portable desk fan & emergency LED light',
      'Built-in rechargeable battery convenient for load-shedding backup in BD',
      'Ref. 999 BDT (regular 1,850 BDT) via direct Illin BD affiliate link'
    ],
    specs: [
      { label: 'Model', value: 'LR-2018 Foldable Fan' },
      { label: 'Lighting', value: 'Integrated LED Lamp' },
      { label: 'Power', value: 'Rechargeable Cordless Battery' },
      { label: 'Price', value: '999 BDT (Ref. · orig. 1,850 BDT)' },
      { label: 'Retailer', value: 'Illin BD' }
    ],
    originStore: 'Illin BD',
    tags: ['folding fan', 'rechargeable fan', 'led light', 'lr-2018', 'emergency', 'illin', 'bangladesh']
  },

  // --- 2 STAR TECH BANGLADESH SMARTWATCH LISTINGS ---
  {
    id: 'startech-colmi-p71',
    title: 'COLMI P71 Bluetooth Calling Smart Watch',
    brand: 'COLMI',
    category: 'Wearables & Smartwatches',
    department: 'Star Tech BD Gadgets',
    sourceType: 'linked-shop',
    nativePrice: 1450,
    nativeCurrency: 'BDT',
    price: 11.93,
    originalPrice: 12.95,
    priceStatus: 'reference',
    badge: 'Star Tech',
    primeEligible: false,
    deliveryEstimate: 'Official Star Tech Bangladesh delivery & branch pickup',
    affiliateUrl: 'https://www.startech.com.bd/colmi-p71-bluetooth-calling-smart-watch?tracking=6ad935b5df200',
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: false,
    description:
      'Feature-packed Bluetooth calling smartwatch with a crisp 1.9-inch IPS HD display, SpO2 and heart-rate tracking, 104 sports modes, and IP68 water resistance.',
    highlights: [
      '1.9-inch IPS HD touch display with built-in Bluetooth calling mic & speaker',
      'SpO2 blood oxygen, 24/7 heart-rate monitoring & 104 workout sport modes',
      'IP68 waterproof rating · Ref. 1,450 BDT Cash Discount (1,550 BDT Online / 1,573 BDT Reg.)'
    ],
    specs: [
      { label: 'Display', value: '1.9" IPS HD (240x284)' },
      { label: 'Calling', value: 'Bluetooth Calling (Mic & Speaker)' },
      { label: 'Health & Fitness', value: 'SpO2, Heart Rate, 104 Sport Modes' },
      { label: 'Protection & Battery', value: 'IP68 Waterproof · 230mAh' },
      { label: 'Price', value: '1,450 BDT Cash Discount (Ref.)' },
      { label: 'Retailer', value: 'Star Tech BD' }
    ],
    originStore: 'Star Tech',
    tags: ['colmi', 'p71', 'smartwatch', 'bluetooth calling', 'startech', 'watch', 'bangladesh']
  },
  {
    id: 'startech-colmi-p81',
    title: 'COLMI P81 Bluetooth Calling Smart Watch',
    brand: 'COLMI',
    category: 'Wearables & Smartwatches',
    department: 'Star Tech BD Gadgets',
    sourceType: 'linked-shop',
    nativePrice: 1400,
    nativeCurrency: 'BDT',
    price: 11.52,
    originalPrice: 12.5,
    priceStatus: 'reference',
    badge: 'Star Tech',
    primeEligible: false,
    deliveryEstimate: 'Official Star Tech Bangladesh delivery & branch pickup',
    affiliateUrl: 'https://www.startech.com.bd/colmi-p81-bluetooth-calling-smart-watch?tracking=6ad935b5df200',
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: false,
    description:
      'Slim everyday Bluetooth calling smartwatch sporting a 1.9-inch HD display, 300mAh long-lasting battery, 100+ sports modes, and IP68 water resistance.',
    highlights: [
      '1.9-inch HD display with hands-free Bluetooth calling & voice assistant support',
      'Large 300mAh battery, 100+ fitness modes & IP68 dust/water protection',
      'Ref. 1,400 BDT Cash Discount (1,499 BDT Online / 1,519 BDT Reg.) on Star Tech'
    ],
    specs: [
      { label: 'Display', value: '1.9" HD Touch Display' },
      { label: 'Calling', value: 'Bluetooth Calling (Built-in Mic/Speaker)' },
      { label: 'Sports & Health', value: '100+ Sport Modes · Heart Rate & SpO2' },
      { label: 'Battery & Rating', value: '300mAh · IP68 Waterproof' },
      { label: 'Price', value: '1,400 BDT Cash Discount (Ref.)' },
      { label: 'Retailer', value: 'Star Tech BD' }
    ],
    originStore: 'Star Tech',
    tags: ['colmi', 'p81', 'smartwatch', 'bluetooth calling', 'startech', 'watch', 'bangladesh']
  },
  {
    id: 'startech-bnc-jack',
    title: 'BNC JACK Connector (50 Ohm Coaxial Plug)',
    brand: 'Star Tech',
    category: 'Electronics & Gadgets',
    department: 'Star Tech BD Gadgets',
    sourceType: 'linked-shop',
    nativePrice: 70,
    nativeCurrency: 'BDT',
    price: 0.58,
    originalPrice: 0.61,
    priceStatus: 'reference',
    badge: 'Star Tech',
    primeEligible: false,
    deliveryEstimate: 'Official Star Tech Bangladesh delivery & branch pickup',
    affiliateUrl: 'https://www.startech.com.bd/bnc-jack?tracking=6ad935b5df200',
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      '50 Ohm coaxial BNC plug connector with nickel-plated body, gold-plated center contact, bayonet locking collar, and cable clamp termination for CCTV and lab setups.',
    highlights: [
      '50 Ohm BNC coaxial connector with bayonet coupling & cable clamp',
      'Nickel-plated housing with gold-plated center pin for low-loss signal',
      'Ref. 70 BDT Cash Discount (74 BDT Reg.) on Star Tech BD'
    ],
    specs: [
      { label: 'Model', value: 'BNC JACK (50 Ohm)' },
      { label: 'Plating', value: 'Nickel Body · Gold Center Contact' },
      { label: 'Termination', value: 'Bayonet Coupling + Cable Clamp' },
      { label: 'Price', value: '70 BDT (Ref. · orig. 74 BDT)' },
      { label: 'Retailer', value: 'Star Tech BD' }
    ],
    originStore: 'Star Tech',
    tags: ['bnc', 'connector', 'cctv', 'cable', 'startech', 'electronics', 'bangladesh']
  },
  {
    id: 'startech-valuetop-aio',
    title: 'Value-Top L40B-AMD V2748 23.8" FHD All-in-One PC With Webcam',
    brand: 'Value-Top',
    category: 'Computers & Accessories',
    department: 'Star Tech BD Gadgets',
    sourceType: 'linked-shop',
    nativePrice: 84900,
    nativeCurrency: 'BDT',
    price: 698.77,
    originalPrice: 768.64,
    priceStatus: 'reference',
    badge: 'Star Tech',
    primeEligible: false,
    deliveryEstimate: 'Official Star Tech Bangladesh delivery & branch pickup',
    affiliateUrl: 'https://www.startech.com.bd/value-top-l40b-amd-v2748-all-in-one-pc?tracking=6ad935b5df200',
    urlKind: 'product',
    imageKey: 'heroWorkspace',
    secondaryImageKey: 'monitorArm',
    imageIsIllustrative: false,
    description:
      '23.8-inch IPS Full HD All-in-One desktop PC powered by AMD V2748 processor with Radeon RX Vega 7 graphics, 16GB DDR4-3200 RAM, 512GB NVMe SSD, 5MP webcam, and wireless keyboard/mouse kit.',
    highlights: [
      '23.8" IPS Full HD display · AMD V2748 + Radeon RX Vega 7 graphics',
      '16GB DDR4 3200MHz RAM + 512GB M.2 NVMe SSD + 5MP webcam + wireless KB/mouse',
      'Ref. 84,900 BDT Cash Discount (93,390 BDT Reg.) at Star Tech BD'
    ],
    specs: [
      { label: 'Processor & GPU', value: 'AMD V2748 · Radeon RX Vega 7' },
      { label: 'Memory & SSD', value: '16GB DDR4 3200MHz · 512GB M.2 NVMe' },
      { label: 'Display & Cam', value: '23.8" IPS FHD · Built-in 5MP Webcam' },
      { label: 'Accessories', value: 'Value-Top Wireless Keyboard & Mouse Kit' },
      { label: 'Price', value: '84,900 BDT (Ref. · reg. 93,390 BDT)' },
      { label: 'Retailer', value: 'Star Tech BD' }
    ],
    originStore: 'Star Tech',
    tags: ['all in one pc', 'desktop', 'valuetop', 'amd', 'startech', 'computers', 'bangladesh']
  },
  {
    id: 'startech-chuwi-herobook-pro',
    title: 'Chuwi HeroBook Pro Intel Celeron N4020 14.1" Full HD Laptop (Windows 11)',
    brand: 'Chuwi',
    category: 'Computers & Accessories',
    department: 'Star Tech BD Gadgets',
    sourceType: 'linked-shop',
    nativePrice: 38000,
    nativeCurrency: 'BDT',
    price: 312.76,
    originalPrice: 330.45,
    priceStatus: 'reference',
    badge: 'Star Tech',
    primeEligible: false,
    deliveryEstimate: 'Official Star Tech Bangladesh delivery & branch pickup',
    affiliateUrl: 'https://www.startech.com.bd/chuwi-herobook-pro-intel-celeron-laptop?tracking=6ad935b5df200',
    urlKind: 'product',
    imageKey: 'heroWorkspace',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Slim 14.1-inch Full HD IPS anti-glare Windows 11 notebook powered by Intel Celeron N4020 (up to 2.80 GHz), 8GB LPDDR4 RAM, and 256GB SSD for study and everyday productivity.',
    highlights: [
      '14.1" 1920x1080 IPS anti-glare display with genuine Windows 11',
      'Intel Celeron N4020 · 8GB LPDDR4 RAM · 256GB SSD storage',
      'Ref. 38,000 BDT Cash Discount (40,150 BDT Reg.) on Star Tech BD'
    ],
    specs: [
      { label: 'Processor', value: 'Intel Celeron N4020 (up to 2.80 GHz)' },
      { label: 'Memory & SSD', value: '8GB LPDDR4 RAM · 256GB SSD' },
      { label: 'Display & OS', value: '14.1" FHD (1920x1080) IPS · Windows 11' },
      { label: 'Price', value: '38,000 BDT (Ref. · reg. 40,150 BDT)' },
      { label: 'Retailer', value: 'Star Tech BD' }
    ],
    originStore: 'Star Tech',
    tags: ['laptop', 'chuwi', 'herobook pro', 'windows 11', 'startech', 'computers', 'bangladesh']
  },
  {
    id: 'startech-acer-aspire-3',
    title: 'Acer Aspire 3 A325-45 Celeron N4500 15.6" HD Laptop (12GB / 512GB)',
    brand: 'Acer',
    category: 'Computers & Accessories',
    department: 'Star Tech BD Gadgets',
    sourceType: 'linked-shop',
    nativePrice: 52000,
    nativeCurrency: 'BDT',
    price: 427.98,
    originalPrice: 452.67,
    priceStatus: 'reference',
    badge: 'Star Tech',
    primeEligible: false,
    deliveryEstimate: 'Official Star Tech Bangladesh delivery & branch pickup',
    affiliateUrl: 'https://www.startech.com.bd/acer-aspire-3-a325-45-n4500-laptop?tracking=6ad935b5df200',
    urlKind: 'product',
    imageKey: 'heroWorkspace',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      '15.6-inch Acer Aspire 3 notebook equipped with Intel Celeron N4500, 12GB DDR4 3200MHz memory, 512GB NVMe SSD, USB Type-C port, and dual stereo speakers.',
    highlights: [
      'Intel Celeron N4500 with 12GB DDR4 3200MHz RAM + 512GB SSD',
      '15.6" HD display (1366x768), USB Type-C port & dual stereo speakers',
      'Ref. 52,000 BDT Cash Discount (55,000 BDT Reg.) on Star Tech BD'
    ],
    specs: [
      { label: 'MPN / Model', value: 'Aspire 3 A325-45 (UN.344SI.01B)' },
      { label: 'Processor', value: 'Intel Celeron N4500 (up to 2.80 GHz)' },
      { label: 'Memory & SSD', value: '12GB DDR4 3200MHz · 512GB SSD' },
      { label: 'Display & I/O', value: '15.6" HD · USB Type-C · Stereo Speakers' },
      { label: 'Price', value: '52,000 BDT (Ref. · reg. 55,000 BDT)' },
      { label: 'Retailer', value: 'Star Tech BD' }
    ],
    originStore: 'Star Tech',
    tags: ['laptop', 'acer', 'aspire 3', 'n4500', '12gb', 'startech', 'computers', 'bangladesh']
  },
  {
    id: 'startech-flyx-ae8-pro-drone',
    title: 'FlyX AE8 Pro Dual Camera Foldable Drone (1080P)',
    brand: 'FlyX',
    category: 'Electronics & Gadgets',
    department: 'Star Tech BD Gadgets',
    sourceType: 'linked-shop',
    nativePrice: 3300,
    nativeCurrency: 'BDT',
    price: 27.16,
    originalPrice: 32.92,
    priceStatus: 'reference',
    badge: 'Star Tech',
    primeEligible: false,
    deliveryEstimate: 'Official Star Tech Bangladesh delivery & branch pickup',
    affiliateUrl: 'https://www.startech.com.bd/flyx-ae8-pro-foldable-drone?tracking=6ad935b5df200',
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: false,
    description:
      'Compact foldable quadcopter featuring a 1080P dual camera system, dual batteries for up to 20 minutes combined flight time, 200m forward range, and 100m altitude reach.',
    highlights: [
      '1080P dual-camera foldable quadcopter with up to 20 min dual-battery flight',
      'Up to 200m forward range & 100m vertical reach via Star Tech BD',
      'Ref. 3,300 BDT Cash Discount (4,000 BDT Reg.) at Star Tech BD'
    ],
    specs: [
      { label: 'Model', value: 'FlyX AE8 Pro' },
      { label: 'Camera', value: '1080P Dual Camera' },
      { label: 'Flight & Range', value: 'Up to 20 min (Dual Battery) · 200m / 100m' },
      { label: 'Price', value: '3,300 BDT (Ref. · reg. 4,000 BDT)' },
      { label: 'Retailer', value: 'Star Tech BD' }
    ],
    originStore: 'Star Tech',
    tags: ['drone', 'flyx', 'ae8 pro', 'foldable drone', 'camera drone', 'startech', 'bangladesh']
  },

  // --- 2 SOHOJ AFFILIATES PARTNER NETWORK PORTALS ---
  {
    id: 'sohoj-affiliate-program',
    title: 'Sohoj Affiliates — Bangladesh Reseller & Affiliate Network',
    brand: 'Sohoj Affiliates',
    category: 'Sohoj Affiliate Network',
    department: 'Sohoj Affiliate Network',
    sourceType: 'linked-shop',
    price: 0,
    nativeCurrency: 'BDT',
    priceStatus: 'live-at-partner',
    badge: 'Sohoj Affiliates',
    primeEligible: false,
    deliveryEstimate: 'Free Bangladesh creator & reseller onboarding on Sohoj Affiliates',
    affiliateUrl: SOHOJ_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'cloudServer',
    imageIsIllustrative: false,
    description:
      'Bangladesh affiliate and reseller platform connected to 3,900+ Illin BD consumer products with bKash, Nagad, Rocket & bank payouts and a 100 Tk onboarding credit.',
    highlights: [
      'Free sign-up with 100 Tk shopping credit bonus via referral link 40989',
      'Promote 3,930+ local e-commerce products with bKash/Nagad/Rocket payouts',
      '10% lifetime referral tier & live dashboard analytics on Sohoj Affiliates'
    ],
    specs: [
      { label: 'Partner', value: 'Sohoj Affiliates' },
      { label: 'Catalog', value: '3,930+ Illin BD Products' },
      { label: 'Payouts', value: 'bKash · Nagad · Rocket · Bank (min 500 Tk)' },
      { label: 'Program', value: 'Open via Referral Portal' }
    ],
    originStore: 'Sohoj Affiliates',
    tags: ['sohoj', 'affiliate', 'reseller', 'bangladesh', 'earning', 'partner']
  },
  {
    id: 'sohoj-affiliate-mobile',
    title: 'Sohoj Affiliates — Mobile Dashboard & Link Builder',
    brand: 'Sohoj Affiliates',
    category: 'Sohoj Affiliate Network',
    department: 'Sohoj Affiliate Network',
    sourceType: 'linked-shop',
    price: 0,
    nativeCurrency: 'BDT',
    priceStatus: 'live-at-partner',
    badge: 'Sohoj Affiliates',
    primeEligible: false,
    deliveryEstimate: 'Instant registration & tracking dashboard via Sohoj Affiliates',
    affiliateUrl: SOHOJ_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'cloudServer',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: false,
    description:
      'Mobile-ready link tracking, real-time sales performance analytics, and guided affiliate onboarding connected with Jibonpata IT Limited (Dhaka).',
    highlights: [
      'Track clicks, conversions & bonus milestones in real time from mobile',
      'Invite creators to earn extra lifetime referral commission tiers',
      'Direct registration through referral ID 40989 on Sohoj Affiliates'
    ],
    specs: [
      { label: 'Partner', value: 'Sohoj Affiliates' },
      { label: 'Access', value: 'Web & Mobile Partner Dashboard' },
      { label: 'Support', value: 'Mirpur 10, Dhaka · Step-by-Step Guides' },
      { label: 'Registration', value: 'Free Creator & Marketer Sign-Up' }
    ],
    originStore: 'Sohoj Affiliates',
    tags: ['sohoj', 'affiliate', 'mobile', 'dashboard', 'bangladesh', 'partner']
  },
  ...(startechBulkCatalogRaw as CatalogRecord[])
];

function parseCsvMatrix(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const next = clean[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field.trim());
      field = '';
    } else if (ch === '\r' && next === '\n') {
      row.push(field.trim());
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      field = '';
      i++;
    } else if (ch === '\n' || ch === '\r') {
      row.push(field.trim());
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((c) => c.length > 0)) rows.push(row);
  }

  return rows;
}

function mapCsvCategory(
  csvCategory: string,
  title: string
): Exclude<ProductCategory, 'All Departments (Mega Store)'> {
  const cat = csvCategory.toLowerCase();
  const name = title.toLowerCase();

  if (
    cat.includes('earbud') ||
    cat.includes('headset') ||
    cat.includes('headphone') ||
    cat.includes('speaker') ||
    cat.includes('microphone') ||
    name.includes('earbud') ||
    name.includes('earphone') ||
    name.includes('headphone') ||
    name.includes('microphone') ||
    name.includes('speaker')
  ) {
    return 'Audio & Headphones';
  }

  if (
    cat.includes('watch') ||
    name.includes('smartwatch') ||
    name.includes('smart watch') ||
    name.includes('casio f-91') ||
    name.includes('casio a') ||
    name.includes('skmei') ||
    name.includes('curren') ||
    name.includes('naviforce') ||
    name.includes('olevs') ||
    name.includes('zeblaze') ||
    name.includes('colmi')
  ) {
    return 'Wearables & Smartwatches';
  }

  if (
    cat.includes('laptop stand') ||
    cat.includes('calculator') ||
    cat.includes('table lamp') ||
    cat.includes('tripod') ||
    cat.includes('photographic lighting') ||
    cat.includes('stand mixer') ||
    name.includes('tripod') ||
    name.includes('laptop stand') ||
    name.includes('desk lamp') ||
    name.includes('clip lamp')
  ) {
    return 'Office & Workspace';
  }

  if (
    cat.includes('light bulb') ||
    cat.includes('flashlight') ||
    cat.includes('fan') ||
    cat.includes('insect') ||
    name.includes('power bank') ||
    name.includes('flashlight') ||
    name.includes('fan') ||
    name.includes('bulb')
  ) {
    return 'Smart Home & Power';
  }

  if (
    cat.includes('shaver') ||
    cat.includes('trimmer') ||
    cat.includes('cooler') ||
    cat.includes('lens') ||
    cat.includes('tv box') ||
    cat.includes('mobiles') ||
    cat.includes('hand tool')
  ) {
    return 'Electronics & Gadgets';
  }

  return 'Shopz BD Tech Deals';
}

function pickImageKeys(csvCategory: string, title: string): { main: ImageKey; secondary: ImageKey } {
  const cat = csvCategory.toLowerCase();
  const name = title.toLowerCase();

  if (cat.includes('microphone') || name.includes('microphone')) {
    return { main: 'headphoneStand', secondary: 'headphones' };
  }
  if (
    cat.includes('earbud') ||
    cat.includes('headphone') ||
    cat.includes('headset') ||
    cat.includes('speaker') ||
    name.includes('earbud') ||
    name.includes('earphone') ||
    name.includes('speaker')
  ) {
    return { main: 'headphones', secondary: 'headphoneStand' };
  }
  if (cat.includes('laptop stand') || cat.includes('tripod') || name.includes('tripod')) {
    return { main: 'monitorArm', secondary: 'heroWorkspace' };
  }
  if (
    cat.includes('table lamp') ||
    cat.includes('photographic lighting') ||
    name.includes('lamp') ||
    name.includes('rgb')
  ) {
    return { main: 'screenbar', secondary: 'heroWorkspace' };
  }
  if (
    name.includes('power bank') ||
    cat.includes('flashlight') ||
    cat.includes('fan') ||
    cat.includes('light bulb') ||
    cat.includes('cooler')
  ) {
    return { main: 'magsafe', secondary: 'growthBundle' };
  }
  if (cat.includes('watch') || name.includes('watch')) {
    return { main: 'heroWorkspace', secondary: 'deskMat' };
  }
  if (
    cat.includes('trimmer') ||
    cat.includes('calculator') ||
    name.includes('mobile') ||
    name.includes('tv box')
  ) {
    return { main: 'mouse', secondary: 'growthBundle' };
  }
  return { main: 'growthBundle', secondary: 'deskMat' };
}

function extractBrand(title: string): string {
  const knownBrands = [
    'WIWU',
    'Casio',
    'Xiaomi',
    'Kemei',
    'COLMI',
    'Curren',
    'Ulex',
    'SKMEI',
    'QCY',
    'Wavefun',
    'OnePlus',
    'Hoco',
    'ULANZI',
    'VGR',
    'Binge',
    'UiiSii',
    'KZ',
    'Baseus',
    'NAVIFORCE',
    'Lenovo',
    'Zeblaze',
    'YAGE',
    'Awei',
    'QKZ',
    'BIOAQUA',
    'PLEXTONE',
    'Apexel',
    'OLEVS'
  ];

  const lower = title.toLowerCase();
  const matched = knownBrands.find((b) => lower.startsWith(b.toLowerCase()));
  if (matched) return matched;
  const firstWord = title.split(/\s+/)[0] || 'Shopz BD';
  return firstWord.replace(/[^a-zA-Z0-9-]/g, '') || 'Shopz BD';
}

function buildCsvProductId(link: string, title: string, idx: number): string {
  try {
    const u = new URL(link);
    const seg = u.pathname.split('/').filter(Boolean).pop();
    if (seg) return `csv-${seg.toLowerCase().replace(/[^a-z0-9-]+/g, '-')}`;
  } catch {
    // Fallback to title slug
  }
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `csv-${slug || 'item'}-${idx}`;
}

export function ensureShopzReferralUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return SHOPZ_REF_BASE;
  try {
    const u = new URL(trimmed);
    if (!u.searchParams.has('ref')) {
      u.searchParams.set('ref', 'mahbubur-rahman-shahin');
    }
    return u.toString();
  } catch {
    if (trimmed.includes('ref=')) return trimmed;
    const sep = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${sep}ref=mahbubur-rahman-shahin`;
  }
}

export function parseShopzCsvRecords(csvText: string, defaultBdtRate = 121.5): CatalogRecord[] {
  const matrix = parseCsvMatrix(csvText);
  if (matrix.length < 2) return [];

  const header = matrix[0].map((h) => h.toLowerCase());
  const prodIdx = header.findIndex((h) => h.includes('product'));
  const catIdx = header.findIndex((h) => h.includes('category'));
  const priceIdx = header.findIndex((h) => h.includes('price'));
  const linkIdx = header.findIndex((h) => h.includes('link'));

  if (prodIdx < 0 || linkIdx < 0) return [];

  const seenIds = new Set<string>();
  const safeRate = defaultBdtRate > 1 ? defaultBdtRate : 121.5;

  const records: CatalogRecord[] = [];
  for (let idx = 0; idx < matrix.length - 1; idx++) {
    const cols = matrix[idx + 1];
    const product = cols[prodIdx] || '';
    const csvCategory = catIdx >= 0 ? cols[catIdx] || 'Tech & Lifestyle' : 'Tech & Lifestyle';
    const rawPriceStr = priceIdx >= 0 ? cols[priceIdx] || '0' : '0';
    const rawLink = cols[linkIdx] || '';

    if (!product || !rawLink.startsWith('https://')) continue;
    // Enforce explicit instruction to skip any fabrilife links if encountered
    if (rawLink.toLowerCase().includes('fabrilife.com')) continue;

    let id = buildCsvProductId(rawLink, product, idx);
    while (seenIds.has(id)) {
      id = `${id}-${idx}`;
    }
    seenIds.add(id);

    const rawBdt = Number.parseFloat(rawPriceStr.replace(/[^0-9.]/g, '')) || 0;
    const usdPrice = rawBdt > 0 ? Number((rawBdt / safeRate).toFixed(2)) : 0;
    const category = mapCsvCategory(csvCategory, product);
    const brand = extractBrand(product);
    const images = pickImageKeys(csvCategory, product);
    const affiliateUrl = ensureShopzReferralUrl(rawLink);
    const hasRefPrice = rawBdt > 0;

    records.push({
      id,
      title: product,
      brand,
      category,
      department: 'Shopz BD Tech Deals',
      csvCategory,
      sourceType: 'uploaded-csv',
      nativePrice: rawBdt,
      nativeCurrency: 'BDT',
      price: usdPrice,
      priceStatus: hasRefPrice ? 'reference' : 'live-at-partner',
      badge: 'Shopz BD',
      primeEligible: false,
      deliveryEstimate: 'Check delivery & stock on Shopz BD',
      affiliateUrl,
      urlKind: 'product',
      imageKey: images.main,
      secondaryImageKey: images.secondary,
      imageIsIllustrative: true,
      description: hasRefPrice
        ? `${product} (${csvCategory}) available on Shopz BD. View live stock, specifications, and delivery options.`
        : `${product} (${csvCategory}) available on Shopz BD. Check current price, stock, and Bangladesh shipping on Shopz BD.`,
      highlights: [
        `Product: ${product}`,
        `Department: ${csvCategory}`,
        hasRefPrice
          ? `Listed Price: ${rawBdt.toLocaleString('en-US')} BDT`
          : 'Live pricing and availability appear directly on Shopz BD',
        'Direct checkout via Shopz BD'
      ],
      specs: [
        { label: 'Brand', value: brand },
        { label: 'Department', value: csvCategory },
        {
          label: 'Price',
          value: hasRefPrice ? `${rawBdt.toLocaleString('en-US')} BDT` : 'Check live price on Shopz BD'
        },
        { label: 'Retailer', value: 'Shopz BD' }
      ],
      originStore: 'Shopz BD',
      tags: [
        category.toLowerCase(),
        csvCategory.toLowerCase(),
        brand.toLowerCase(),
        'bangladesh',
        'shopz'
      ]
    });
  }

  return records;
}
