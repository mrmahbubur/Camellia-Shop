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
export const ALIEXPRESS_AFFILIATE_URL = 'https://rzekl.com/g/1e8d114494cb5002cfdd16525dc3e8/';
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B09HM94VDS)',
      '200–8,000 DPI Darkfield sensor (tracks on glass) + MagSpeed scroll',
      'Up to 70-day rechargeable 500mAh Li-Po battery; Quiet Clicks tactile switches'
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B08WT889V3)',
      'Asymmetrical zero-glare optics + Front / Back / Dual lighting modes',
      'Wireless rotary dial (2700K–6500K); USB 5V/1.7A powered'
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B09XS7JWHH)',
      'Dual V1 + QN1 ANC processors managing 8 microphones + Auto NC Optimizer',
      '30mm custom drivers, Bluetooth 5.2 multipoint (SBC/AAC/LDAC), up to 30h ANC'
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B0CFPHZZYT)',
      'Qi2 certified 15W MagSafe-compatible fast wireless charging',
      'Foldable 3-in-1 desktop & travel form factor + 40W USB-C wall adapter'
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B088F7SY6S)',
      '13 ports: 2x HDMI, 1x DisplayPort, 10Gbps USB-C, 3x USB-A, GbE & SD/microSD',
      '85W upstream host Power Delivery + 18W front USB-C PD + 135W power supply'
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B08FB7WFCT)',
      'Fits 13"–34" monitors (4.4–19.8 lbs) with 75x75 or 100x100mm VESA',
      '+85°/-30° tilt, 180° swivel, 360° rotation; C-clamp or grommet mount'
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B09VLHR4JC)',
      'USB 3.2 Gen 2 (10Gbps): up to 1,050 MB/s read / 1,000 MB/s write',
      'IP65 dust/water resistance, up to 3m drop protection, AES 256-bit encryption'
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B09DV85M6Y)',
      'Large 27.6" × 11.8" (70 × 30 cm) × 2mm surface with anti-fray stitching',
      'Spill-repellent recycled polyester fabric & natural rubber anti-slip base'
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
    badge: 'Amazon Listing',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & availability on Amazon',
    affiliateUrl: buildAmazonAsinUrl('B0BYP2F3SG'),
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Airline-compliant 99.54Wh (27,650mAh) 3-port USB-C power bank delivering up to 250W total output with smart digital telemetry display and app monitoring.',
    highlights: [
      'Direct Amazon product page (ASIN B0BYP2F3SG)',
      '27,650mAh (99.54Wh) capacity · 250W total across 2x USB-C + 1x USB-A',
      'Rapid dual USB-C recharge + smart display & companion app monitoring'
    ],
    specs: [
      { label: 'ASIN', value: 'B0BYP2F3SG' },
      { label: 'Capacity', value: '27,650mAh (99.54Wh)' },
      { label: 'Output & Ports', value: '250W Max (2x USB-C + 1x USB-A)' },
      { label: 'Display', value: 'Digital Wattage Telemetry' },
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
    badge: 'Amazon Listing',
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
      'Direct Amazon product page (ASIN B08G7RG9ML)',
      'Hybrid USB + XLR connectivity for laptops or studio audio interfaces',
      'Voice Isolation capsule, integrated touch controls & 3.5mm headphone jack'
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
    title: 'Releva BD Tracked Product #130',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD Link',
    primeEligible: false,
    deliveryEstimate: 'Check live delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(130),
    urlKind: 'product',
    imageKey: 'growthBundle',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'Tracked partner product link (#130) on Releva BD. Live product name, BDT price, photos, and stock appear directly on releva.com.bd.',
    highlights: [
      'Direct Releva BD tracked product URL (product_id=130)',
      'Automated title/price inspection blocked by partner Cloudflare protection',
      'Inspect full details, stock, and BDT checkout directly on releva.com.bd'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Product ID', value: '130' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  {
    id: 'releva-bd-131',
    title: 'Releva BD Tracked Product #131',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD Link',
    primeEligible: false,
    deliveryEstimate: 'Check live delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(131),
    urlKind: 'product',
    imageKey: 'deskMat',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Tracked partner product link (#131) on Releva BD. Open releva.com.bd directly to inspect item details, live pricing, and local delivery.',
    highlights: [
      'Direct Releva BD tracked product URL (product_id=131)',
      'Automated title/price inspection blocked by partner Cloudflare protection',
      'Inspect live product details and checkout on releva.com.bd'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Product ID', value: '131' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  {
    id: 'releva-bd-129',
    title: 'Releva BD Tracked Product #129',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD Link',
    primeEligible: false,
    deliveryEstimate: 'Check live delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(129),
    urlKind: 'product',
    imageKey: 'heroWorkspace',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Tracked partner product link (#129) on Releva BD. Live product title, stock, and BDT pricing appear on the destination store.',
    highlights: [
      'Direct Releva BD tracked product URL (product_id=129)',
      'Automated title/price inspection blocked by partner Cloudflare protection',
      'Inspect live product details and checkout on releva.com.bd'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Product ID', value: '129' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  {
    id: 'releva-bd-133',
    title: 'Releva BD Tracked Product #133',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD Link',
    primeEligible: false,
    deliveryEstimate: 'Check live delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(133),
    urlKind: 'product',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: true,
    description:
      'Tracked partner product link (#133) on Releva BD. Open the product page on releva.com.bd for live price, description, and delivery.',
    highlights: [
      'Direct Releva BD tracked product URL (product_id=133)',
      'Automated title/price inspection blocked by partner Cloudflare protection',
      'Inspect live product details and checkout on releva.com.bd'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Product ID', value: '133' },
      { label: 'Price', value: 'Check live price on Releva BD' }
    ],
    originStore: 'Releva BD',
    tags: ['everyday', 'bangladesh', 'releva']
  },
  {
    id: 'releva-bd-135',
    title: 'Releva BD Tracked Product #135',
    brand: 'Releva BD',
    category: 'Releva BD Picks',
    department: 'Releva BD Picks',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Releva BD Link',
    primeEligible: false,
    deliveryEstimate: 'Check live delivery & BDT price on Releva BD',
    affiliateUrl: buildRelevaProductUrl(135),
    urlKind: 'product',
    imageKey: 'headphoneStand',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Tracked partner product link (#135) on Releva BD. Open the product page on releva.com.bd for live price, availability, and order options.',
    highlights: [
      'Direct Releva BD tracked product URL (product_id=135)',
      'Automated title/price inspection blocked by partner Cloudflare protection',
      'Inspect live product details and checkout on releva.com.bd'
    ],
    specs: [
      { label: 'Partner', value: 'Releva BD' },
      { label: 'Product ID', value: '135' },
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
    badge: 'ExonHost Portal',
    primeEligible: false,
    deliveryEstimate: 'Provisioned via ExonHost client portal',
    affiliateUrl: EXONHOST_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'cloudServer',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'LiteSpeed + LSCache web hosting with unlimited Let’s Encrypt SSL, JetBackup daily backups, CloudLinux CageFS security, and BDIX or international servers.',
    highlights: [
      'Opens the official ExonHost affiliate portal (aff=5993)',
      'LiteSpeed Web Server + LSCache, Unlimited Let’s Encrypt SSL & JetBackup daily backups',
      'BDIX (Dhaka) & international data center options; verify live rates on ExonHost'
    ],
    specs: [
      { label: 'Partner', value: 'ExonHost (aff=5993)' },
      { label: 'Stack', value: 'LiteSpeed + LSCache · CloudLinux' },
      { label: 'Backups & SSL', value: 'JetBackup Daily · Free SSL' },
      { label: 'Price', value: 'Check live plan rates on ExonHost' }
    ],
    originStore: 'ExonHost',
    tags: ['hosting', 'web', 'cloud', 'domains', 'bangladesh']
  },
  {
    id: 'exonhost-managed-wp',
    title: 'ExonHost WordPress Hosting & LSCache Portal',
    brand: 'ExonHost',
    category: 'Cloud Hosting & Domains',
    department: 'Cloud Hosting & Domains',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'ExonHost Portal',
    primeEligible: false,
    deliveryEstimate: 'Provisioned via ExonHost client portal',
    affiliateUrl: EXONHOST_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'cloudServer',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'WordPress-optimized hosting featuring Softaculous 1-click installer, WP Manager, LSCache acceleration, PHP selector (5.6–8.x), and free site migration.',
    highlights: [
      'Opens ExonHost affiliate portal (aff=5993)',
      'Softaculous 1-click WordPress setup, LSCache & free website migration',
      'Verify live monthly/annual plans and renewal terms on ExonHost'
    ],
    specs: [
      { label: 'Partner', value: 'ExonHost (aff=5993)' },
      { label: 'Tools', value: 'Softaculous · WordPress Manager' },
      { label: 'Protection', value: 'CageFS + 20 Gbps+ DDoS Filtering' },
      { label: 'Price', value: 'Check live plan rates on ExonHost' }
    ],
    originStore: 'ExonHost',
    tags: ['hosting', 'wordpress', 'web', 'cloud']
  },
  {
    id: 'exonhost-domain-bundle',
    title: 'ExonHost KVM NVMe VPS & Domain Portal',
    brand: 'ExonHost',
    category: 'Cloud Hosting & Domains',
    department: 'Cloud Hosting & Domains',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'ExonHost Portal',
    primeEligible: false,
    deliveryEstimate: 'Provisioned via ExonHost client portal',
    affiliateUrl: EXONHOST_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'cloudServer',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: true,
    description:
      'Linux KVM NVMe VPS (BDIX & global nodes) with full root SSH access, dedicated static IPv4, weekly snapshots, and domain registration via ExonHost.',
    highlights: [
      'Opens ExonHost affiliate portal (aff=5993)',
      'Dedicated NVMe storage, full root SSH access, static IPv4 & BDIX low-latency routing',
      'Verify live VPS configs, TLDs, and billing cycles on ExonHost'
    ],
    specs: [
      { label: 'Partner', value: 'ExonHost (aff=5993)' },
      { label: 'Virtualization', value: 'Linux KVM · NVMe SSD · Root SSH' },
      { label: 'Nodes', value: 'BDIX (Dhaka) & International' },
      { label: 'Price', value: 'Check live rates on ExonHost' }
    ],
    originStore: 'ExonHost',
    tags: ['hosting', 'domains', 'vps', 'web']
  },

  // --- 4 ALIEXPRESS PORTAL PICKS (VERIFIED DESTINATION: best.aliexpress.com) ---
  {
    id: 'aliexpress-keyboards-portal',
    title: 'AliExpress — Keyboards & Desk Peripherals',
    brand: 'AliExpress Partner',
    category: 'Computers & Accessories',
    department: 'Computers & Accessories',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'AliExpress Portal',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & buyer terms on AliExpress',
    affiliateUrl: ALIEXPRESS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'mouse',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: true,
    description:
      'Opens the AliExpress partner promotion portal for mechanical keyboards, mice, and desk hardware. Live listings and shipping depend on your region.',
    highlights: [
      'Opens verified AliExpress partner promotion destination',
      'Live item selection, pricing, and shipping windows appear on AliExpress'
    ],
    specs: [
      { label: 'Partner', value: 'AliExpress' },
      { label: 'Destination', value: 'best.aliexpress.com (Showcase Portal)' },
      { label: 'Price', value: 'Check live listings on AliExpress' }
    ],
    originStore: 'AliExpress',
    tags: ['workspace', 'computers', 'keyboard', 'aliexpress']
  },
  {
    id: 'aliexpress-audio-portal',
    title: 'AliExpress — Wireless Audio & Headphones',
    brand: 'AliExpress Partner',
    category: 'Audio & Headphones',
    department: 'Audio & Headphones',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'AliExpress Portal',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & buyer terms on AliExpress',
    affiliateUrl: ALIEXPRESS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'headphones',
    secondaryImageKey: 'headphoneStand',
    imageIsIllustrative: true,
    description:
      'Explore earbuds, over-ear headphones, and studio accessories through the AliExpress partner portal. Pricing and shipping vary by seller and country.',
    highlights: [
      'Opens verified AliExpress partner promotion destination',
      'Verify seller ratings, warranty, and delivery estimates on AliExpress'
    ],
    specs: [
      { label: 'Partner', value: 'AliExpress' },
      { label: 'Destination', value: 'best.aliexpress.com (Showcase Portal)' },
      { label: 'Price', value: 'Check live listings on AliExpress' }
    ],
    originStore: 'AliExpress',
    tags: ['audio', 'headphones', 'earbuds', 'aliexpress']
  },
  {
    id: 'aliexpress-power-portal',
    title: 'AliExpress — GaN Chargers & USB-C Power',
    brand: 'AliExpress Partner',
    category: 'Smart Home & Power',
    department: 'Smart Home & Power',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'AliExpress Portal',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & plug standards on AliExpress',
    affiliateUrl: ALIEXPRESS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'magsafe',
    secondaryImageKey: 'growthBundle',
    imageIsIllustrative: true,
    description:
      'Browse USB-C GaN adapters, power banks, and charging cables via the AliExpress partner portal. Check plug standard and safety certifications on site.',
    highlights: [
      'Opens verified AliExpress partner promotion destination',
      'Confirm regional plug type (US/UK/EU) and shipping terms at checkout'
    ],
    specs: [
      { label: 'Partner', value: 'AliExpress' },
      { label: 'Destination', value: 'best.aliexpress.com (Showcase Portal)' },
      { label: 'Price', value: 'Check live listings on AliExpress' }
    ],
    originStore: 'AliExpress',
    tags: ['power', 'charging', 'gan', 'travel', 'aliexpress']
  },
  {
    id: 'aliexpress-gadgets-portal',
    title: 'AliExpress — Everyday Tech & Studio Accessories',
    brand: 'AliExpress Partner',
    category: 'Electronics & Gadgets',
    department: 'Electronics & Gadgets',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'AliExpress Portal',
    primeEligible: false,
    deliveryEstimate: 'Check shipping & buyer terms on AliExpress',
    affiliateUrl: ALIEXPRESS_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'screenbar',
    imageIsIllustrative: true,
    description:
      'Browse hubs, phone stands, LED desk lamps, and mobile accessories via the AliExpress affiliate portal.',
    highlights: [
      'Opens verified AliExpress partner promotion destination',
      'Current promotions and country shipping rates displayed on AliExpress'
    ],
    specs: [
      { label: 'Partner', value: 'AliExpress' },
      { label: 'Destination', value: 'best.aliexpress.com (Showcase Portal)' },
      { label: 'Price', value: 'Check live listings on AliExpress' }
    ],
    originStore: 'AliExpress',
    tags: ['everyday', 'electronics', 'gadgets', 'aliexpress']
  },

  // --- 4 ALIBABA SOURCING PORTAL PICKS (VERIFIED DESTINATION: offer.alibaba.com) ---
  {
    id: 'alibaba-ergonomic-monitor-arm-bulk',
    title: 'Alibaba — Monitor Arms & Desk Mount Sourcing',
    brand: 'Alibaba Offer Portal',
    category: 'Office & Workspace',
    department: 'Office & Workspace',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Alibaba Portal',
    primeEligible: false,
    deliveryEstimate: 'MOQ, freight & protection terms verified on Alibaba',
    affiliateUrl: ALIBABA_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'monitorArm',
    secondaryImageKey: 'heroWorkspace',
    imageIsIllustrative: true,
    description:
      'Opens the Alibaba partner offer portal for sourcing monitor arms, laptop stands, and office mounts. Check minimum order quantities and supplier terms directly on Alibaba.',
    highlights: [
      'Opens verified Alibaba partner offer destination',
      'Review MOQ, unit tiers, and freight quotes on Alibaba.com'
    ],
    specs: [
      { label: 'Partner', value: 'Alibaba' },
      { label: 'Destination', value: 'offer.alibaba.com (Sourcing Offer Portal)' },
      { label: 'Price', value: 'Check live supplier quotes on Alibaba' }
    ],
    originStore: 'Alibaba',
    tags: ['sourcing', 'workspace', 'ergonomic', 'alibaba']
  },
  {
    id: 'alibaba-usb-c-dock-factory-lot',
    title: 'Alibaba — USB-C Hubs & Peripherals Sourcing',
    brand: 'Alibaba Offer Portal',
    category: 'Computers & Accessories',
    department: 'Computers & Accessories',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Alibaba Portal',
    primeEligible: false,
    deliveryEstimate: 'MOQ, freight & protection terms verified on Alibaba',
    affiliateUrl: ALIBABA_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'growthBundle',
    secondaryImageKey: 'mouse',
    imageIsIllustrative: true,
    description:
      'Browse sample and wholesale computer accessory suppliers through the Alibaba offer portal. Verify supplier credentials and checkout protection on Alibaba.com.',
    highlights: [
      'Opens verified Alibaba partner offer destination',
      'Compare sample pricing, MOQ, and shipping options on Alibaba'
    ],
    specs: [
      { label: 'Partner', value: 'Alibaba' },
      { label: 'Destination', value: 'offer.alibaba.com (Sourcing Offer Portal)' },
      { label: 'Price', value: 'Check live supplier quotes on Alibaba' }
    ],
    originStore: 'Alibaba',
    tags: ['sourcing', 'computers', 'wholesale', 'alibaba']
  },
  {
    id: 'alibaba-studio-creator-desk-bundle',
    title: 'Alibaba — Studio Lighting & Audio Gear Sourcing',
    brand: 'Alibaba Offer Portal',
    category: 'Audio & Headphones',
    department: 'Audio & Headphones',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Alibaba Portal',
    primeEligible: false,
    deliveryEstimate: 'MOQ, freight & protection terms verified on Alibaba',
    affiliateUrl: ALIBABA_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'screenbar',
    secondaryImageKey: 'headphoneStand',
    imageIsIllustrative: true,
    description:
      'Discover desk lighting, microphone stands, and studio accessories on Alibaba. Review supplier terms and shipping options before ordering.',
    highlights: [
      'Opens verified Alibaba partner offer destination',
      'Check sample availability and wholesale terms on Alibaba.com'
    ],
    specs: [
      { label: 'Partner', value: 'Alibaba' },
      { label: 'Destination', value: 'offer.alibaba.com (Sourcing Offer Portal)' },
      { label: 'Price', value: 'Check live supplier quotes on Alibaba' }
    ],
    originStore: 'Alibaba',
    tags: ['sourcing', 'audio', 'creator', 'lighting', 'alibaba']
  },
  {
    id: 'alibaba-smart-qi2-charging-pad-pro',
    title: 'Alibaba — Wireless Chargers & Power Hardware',
    brand: 'Alibaba Offer Portal',
    category: 'Smart Home & Power',
    department: 'Smart Home & Power',
    sourceType: 'linked-shop',
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Alibaba Portal',
    primeEligible: false,
    deliveryEstimate: 'MOQ, freight & protection terms verified on Alibaba',
    affiliateUrl: ALIBABA_AFFILIATE_URL,
    urlKind: 'portal',
    imageKey: 'magsafe',
    secondaryImageKey: 'deskMat',
    imageIsIllustrative: true,
    description:
      'Source charging docks, GaN power bricks, and desk power accessories via the Alibaba partner portal.',
    highlights: [
      'Opens verified Alibaba partner offer destination',
      'Confirm electrical certifications and live quotes on Alibaba'
    ],
    specs: [
      { label: 'Partner', value: 'Alibaba' },
      { label: 'Destination', value: 'offer.alibaba.com (Sourcing Offer Portal)' },
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
      badge: hasRefPrice ? 'Shopz BD CSV Ref.' : 'Shopz BD',
      primeEligible: false,
      deliveryEstimate: 'Check delivery & stock on Shopz BD',
      affiliateUrl,
      urlKind: 'product',
      imageKey: images.main,
      secondaryImageKey: images.secondary,
      imageIsIllustrative: true,
      description: hasRefPrice
        ? `${product} (${csvCategory}) listed in Shopz BD catalog. Reference BDT price shown from CSV snapshot; retailer sets live price, stock, and shipping.`
        : `${product} (${csvCategory}) listed in Shopz BD catalog. Check live price, stock, and Bangladesh shipping on Shopz.com.bd.`,
      highlights: [
        `Product: ${product}`,
        `CSV Category: ${csvCategory}`,
        hasRefPrice
          ? `Historical CSV Reference Price: ${rawBdt.toLocaleString('en-US')} BDT (retailer sets live price)`
          : 'Live pricing and availability appear directly on Shopz.com.bd',
        'Direct referral checkout via Shopz BD (ref=mahbubur-rahman-shahin)'
      ],
      specs: [
        { label: 'Brand', value: brand },
        { label: 'CSV Category', value: csvCategory },
        {
          label: 'CSV Reference Price',
          value: hasRefPrice ? `${rawBdt.toLocaleString('en-US')} BDT (Snapshot)` : 'Check live price on Shopz BD'
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
