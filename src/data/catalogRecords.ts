import type { PartnerStoreOrigin } from '../utils/regionProfile.ts';

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
export const RELEVA_TRACKING_PARAM = 'J64O1CC92FJNsi3ogTGcx7H9139T4GCUmIqKFO6igVEE9EOWpPe6bYY053BwALrR';

export function buildAmazonAsinUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll2&linkId=${AMAZON_LINK_ID}`;
}

export function buildRelevaProductUrl(productId: number): string {
  return `https://releva.com.bd/index.php?route=product/product&product_id=${productId}&tracking=${RELEVA_TRACKING_PARAM}`;
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
  }
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
