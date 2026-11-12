import amazonMouseMxImg from '../assets/images/amazon_mouse_mx_1792276213882.jpg';
import amazonScreenbarLightImg from '../assets/images/amazon_screenbar_light_1792276214090.jpg';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedAmazonPurchase: boolean;
}

export type ProductCategory =
  | 'All Departments (Mega Store)'
  | 'Electronics & Gadgets'
  | 'Computers & Accessories'
  | 'Audio & Headphones'
  | 'Smart Home & Power'
  | 'Wearables & Smartwatches'
  | 'Office & Workspace'
  | 'Shopz BD Tech Deals';

export interface EcomProduct {
  id: string;
  title: string;
  asin?: string;
  brand: string;
  category: ProductCategory;
  department: string;
  isAccessory: boolean;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  primeEligible: boolean;
  deliveryEstimate: string;
  affiliateUrl: string;
  inStock: boolean;
  stockCount: number;
  mainImage: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  reviews: ProductReview[];
  commissionRate: number;
  commissionNote: string;
  isDigital?: boolean;
  isUserAdded?: boolean;
  originStore: 'Amazon' | 'Shopz BD';
}

export const AMAZON_STORE_URL =
  'https://www.amazon.com/gp/yourstore?shopForFallback=1&linkCode=ll2&tag=mrxshahin1-20&linkId=b0640e715d1eb5bbcc6b9a28347ac557&language=en_US&ref_=as_li_ss_tl';

export const SHOPZ_REF_BASE = 'https://www.shopz.com.bd/?ref=mahbubur-rahman-shahin';

export const UNIFIED_PRODUCTS: EcomProduct[] = [
  // =========================================================================
  // 1. AMAZON PRIME STOREFRONT & DIRECT AFFILIATE PRODUCTS
  // Tag: mrxshahin1-20 · LinkId: b0640e715d1eb5bbcc6b9a28347ac557
  // =========================================================================
  {
    id: 'logitech-mx-master-3s',
    title: 'Logitech MX Master 3S Wireless Performance Ergonomic Mouse',
    asin: 'B0ae4X6pk',
    brand: 'Logitech / Amazon Prime',
    category: 'Computers & Accessories',
    department: 'Peripherals & Accessories',
    isAccessory: true,
    price: 99.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviewsCount: 14250,
    badge: "Amazon's Choice",
    primeEligible: true,
    deliveryEstimate: 'FREE Tomorrow with Amazon Prime',
    affiliateUrl: 'https://link.amazon/B0ae4X6pk',
    inStock: true,
    stockCount: 19,
    mainImage: amazonMouseMxImg,
    galleryImages: [
      amazonMouseMxImg,
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The industry-standard productivity mouse engineered for coders, designers, and digital power users. Features 8,000 DPI track-on-glass sensor, MagSpeed 1,000 lines/sec electromagnetic scroll wheel, and whisper-quiet switches.',
    highlights: [
      'Quiet Clicks acoustic technology reduces clicking noise by 90%',
      '8,000 DPI track-on-glass optical sensor for precision on any desk surface',
      'MagSpeed wheel scrolls up to 1,000 lines in one second with pixel precision',
      'Logi Flow cross-computer control: copy-paste text and files across 3 devices'
    ],
    specs: [
      { label: 'Sensor', value: 'Darkfield High Precision (200 - 8000 DPI)' },
      { label: 'Battery Life', value: 'Up to 70 days on a full charge' },
      { label: 'Connectivity', value: 'Bluetooth Low Energy & Logi Bolt USB Receiver' },
      { label: 'Weight', value: '141 grams' }
    ],
    reviews: [
      {
        author: 'David R. (Software Architect)',
        rating: 5,
        date: 'October 12, 2026',
        title: 'Essential tool for dual 4K monitors',
        comment: 'The thumb wheel for horizontal scrolling through code and timeline editors has cut my friction in half. The silent click is whisper quiet.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Creator Direct Referral',
    originStore: 'Amazon'
  },
  {
    id: 'benq-screenbar-halo',
    title: 'BenQ ScreenBar Halo LED Monitor Light Bar & Wireless Desktop Dial',
    asin: 'B0dPHChnk',
    brand: 'BenQ / Amazon Prime',
    category: 'Office & Workspace',
    department: 'Desk Lighting & Ergonomics',
    isAccessory: true,
    price: 179.00,
    originalPrice: 199.00,
    rating: 4.9,
    reviewsCount: 3820,
    badge: '#1 Best Seller',
    primeEligible: true,
    deliveryEstimate: 'FREE Two-Day Delivery with Prime',
    affiliateUrl: 'https://link.amazon/B0dPHChnk',
    inStock: true,
    stockCount: 14,
    mainImage: amazonScreenbarLightImg,
    galleryImages: [
      amazonScreenbarLightImg
    ],
    description: 'Engineered for night coding, writing, and creative work. The ScreenBar Halo clamps onto flat or curved monitors without adhesives, casting precise asymmetrical light onto your desk with zero screen glare.',
    highlights: [
      'Patented asymmetrical optical design eliminates screen glare and reflection completely',
      'Wireless precision rotary dial with industrial bearings for tactile brightness tuning',
      'Integrated back ambient light balances room contrast to eliminate eye fatigue',
      'Patented counterweight clamp fits ultra-slim, standard, and curved screens (1000R-1800R)'
    ],
    specs: [
      { label: 'Illuminance', value: 'Center 800 Lux (height 45cm)' },
      { label: 'Color Temperature', value: '2700K (Warm) to 6500K (Daylight)' },
      { label: 'Power Input', value: '5V / 1.3A USB-A Power Port' },
      { label: 'Controller', value: 'Wireless 2.4GHz RF Desktop Dial' }
    ],
    reviews: [
      {
        author: 'Marcus K. (UI Designer)',
        rating: 5,
        date: 'October 14, 2026',
        title: 'Zero screen reflections — changed my night workflow',
        comment: 'I can work late hours without turning on harsh ceiling lights. The wireless dial on the desk is heavy and feels exceptionally high end.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Creator Direct Referral',
    originStore: 'Amazon'
  },
  {
    id: 'amz-store-kindle-paperwhite',
    title: 'Amazon Kindle Paperwhite (16 GB) 6.8" 300 ppi Glare-Free Display with Warm Light',
    asin: 'B08KTZ8249',
    brand: 'Amazon Prime Storefront',
    category: 'Electronics & Gadgets',
    department: 'E-Readers & Tablets',
    isAccessory: false,
    price: 149.99,
    originalPrice: 169.99,
    rating: 4.8,
    reviewsCount: 42800,
    badge: 'Amazon Best Seller',
    primeEligible: true,
    deliveryEstimate: 'FREE One-Day Prime Delivery',
    affiliateUrl: AMAZON_STORE_URL,
    inStock: true,
    stockCount: 35,
    mainImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The latest Kindle Paperwhite features a 6.8-inch display, thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns. IPX8 waterproof design for reading anywhere.',
    highlights: [
      'Custom 300 ppi glare-free display reads like real paper even in bright sunlight',
      'Adjustable warm light shifts screen shade from white to amber for night reading',
      'IPX8 waterproof rated to protect against accidental immersion in water',
      'Battery lasts up to 10 weeks on a single USB-C charge'
    ],
    specs: [
      { label: 'Display Size', value: '6.8 inch Glare-Free Paperwhite' },
      { label: 'Storage', value: '16 GB (Holds thousands of books)' },
      { label: 'Battery Life', value: 'Up to 10 weeks' },
      { label: 'Charging', value: 'USB-C fast charging' }
    ],
    reviews: [
      {
        author: 'Liam C. (Avid Reader)',
        rating: 5,
        date: 'October 15, 2026',
        title: 'The warm light upgrade is a revelation',
        comment: 'I read every night before bed. The warm amber light prevents eye strain and the battery lasts months.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Affiliate Storefront Referral',
    originStore: 'Amazon'
  },
  {
    id: 'amz-store-airpods-pro-2',
    title: 'Apple AirPods Pro 2 Wireless Earbuds Active Noise Cancellation USB-C MagSafe',
    asin: 'B0CHWRXH8B',
    brand: 'Apple / Amazon Prime',
    category: 'Audio & Headphones',
    department: 'Headphones & Audio',
    isAccessory: true,
    price: 199.00,
    originalPrice: 249.00,
    rating: 4.8,
    reviewsCount: 29800,
    badge: 'Amazon Deal',
    primeEligible: true,
    deliveryEstimate: 'FREE Tomorrow with Amazon Prime',
    affiliateUrl: AMAZON_STORE_URL,
    inStock: true,
    stockCount: 22,
    mainImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Up to 2x more Active Noise Cancellation than previous generation. Adaptive Audio dynamically blends Transparency mode and Noise Cancellation for ideal audio immersion in any environment.',
    highlights: [
      'Apple-designed H2 chip pushes advanced computational audio and noise cancellation',
      'Adaptive Audio dynamically blends Transparency mode and Active Noise Cancellation',
      'Personalized Spatial Audio with dynamic head tracking for 360-degree sound',
      'Dust, sweat, and water resistant (IP54) with USB-C MagSafe Charging Case'
    ],
    specs: [
      { label: 'Chipset', value: 'Apple H2 Audio Chip' },
      { label: 'Case Connectivity', value: 'USB-C & MagSafe Wireless' },
      { label: 'Battery Life', value: 'Up to 6 hours (30 hours with case)' },
      { label: 'Noise Cancellation', value: 'Pro-grade Active Noise Cancellation' }
    ],
    reviews: [
      {
        author: 'Jordan T.',
        rating: 5,
        date: 'October 18, 2026',
        title: 'Best daily carry earbuds',
        comment: 'Seamless switching between MacBook Pro and iPhone. ANC blocks coffee shop chatter completely.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Affiliate Storefront Referral',
    originStore: 'Amazon'
  },
  {
    id: 'amz-store-samsung-t7',
    title: 'Samsung T7 Shield 2TB Portable NVMe External SSD Up to 1050MB/s Rugged Storage',
    asin: 'B09VLK9W3S',
    brand: 'Samsung / Amazon Prime',
    category: 'Computers & Accessories',
    department: 'Data Storage & SSD',
    isAccessory: true,
    price: 159.99,
    originalPrice: 219.99,
    rating: 4.8,
    reviewsCount: 16400,
    badge: 'Prime Choice',
    primeEligible: true,
    deliveryEstimate: 'FREE 1-Day Prime Delivery',
    affiliateUrl: AMAZON_STORE_URL,
    inStock: true,
    stockCount: 18,
    mainImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Ultra-durable, fast, and compact. Transfer huge 4K ProRes video files in seconds with USB 3.2 Gen 2 and PCIe NVMe speeds up to 1,050 MB/s. IP65 water and dust resistance.',
    highlights: [
      'Blazing read/write speeds up to 1,050 / 1,000 MB/s via USB 3.2 Gen 2',
      'Rugged rubber elastomer exterior resists 9.8-foot drops',
      'IP65 water and dust resistance for creators on the go',
      'Compatible with PC, Mac, Android, Gaming Consoles, and Cameras'
    ],
    specs: [
      { label: 'Capacity', value: '2TB NVMe' },
      { label: 'Interface', value: 'USB 3.2 Gen 2 (10Gbps)' },
      { label: 'Protection', value: 'IP65 Water/Dust + 3-Meter Drop Resistant' },
      { label: 'Warranty', value: '3-Year Limited Manufacturer Warranty' }
    ],
    reviews: [
      {
        author: 'Marcus E. (Video Editor)',
        rating: 5,
        date: 'October 11, 2026',
        title: 'Edits 4K ProRes footage smoothly in Final Cut',
        comment: 'Zero thermal throttling even on multi-hour video exports. High build quality.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Affiliate Storefront Referral',
    originStore: 'Amazon'
  },
  {
    id: 'amz-store-anker-737',
    title: 'Anker 737 Power Bank (PowerCore 24K) 140W Fast Charger with Smart Digital Display',
    asin: 'B09VPHVT2Z',
    brand: 'Anker / Amazon Prime',
    category: 'Smart Home & Power',
    department: 'Portable Power & Chargers',
    isAccessory: true,
    price: 109.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviewsCount: 9430,
    badge: 'Top Seller',
    primeEligible: true,
    deliveryEstimate: 'FREE Prime One-Day Delivery',
    affiliateUrl: AMAZON_STORE_URL,
    inStock: true,
    stockCount: 25,
    mainImage: 'https://images.unsplash.com/photo-1609592424360-153b6f2f9aa7?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609592424360-153b6f2f9aa7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Equipped with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or deliver a 140W ultra-powerful charge for MacBook Pro and phones.',
    highlights: [
      'Ultra-powerful two-way charging with 140W output and 140W input',
      'Smart digital display shows real-time output, input, and time to full charge',
      'Massive 24,000mAh capacity juices an iPhone nearly 5 times or MacBook Pro once',
      'ActiveShield 2.0 temperature sensor monitors heat millions of times per day'
    ],
    specs: [
      { label: 'Total Output', value: '140W Max High-Speed' },
      { label: 'Capacity', value: '24,000 mAh' },
      { label: 'Ports', value: '2x USB-C + 1x USB-A' },
      { label: 'Display', value: 'Color Smart Digital Screen' }
    ],
    reviews: [
      {
        author: 'Rachel K.',
        rating: 5,
        date: 'October 16, 2026',
        title: 'Can charge my laptop anywhere without wall sockets',
        comment: 'Essential travel gear for remote work. The digital screen shows exact wattage.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Affiliate Storefront Referral',
    originStore: 'Amazon'
  },
  {
    id: 'sony-wh1000xm5-amz',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Over-Ear Headphones with Auto NC Optimizer',
    asin: 'B09XS7JWHH',
    brand: 'Sony / Amazon Prime',
    category: 'Audio & Headphones',
    department: 'Premium Audio',
    isAccessory: true,
    price: 348.00,
    originalPrice: 399.99,
    rating: 4.8,
    reviewsCount: 22100,
    badge: 'Prime Deal',
    primeEligible: true,
    deliveryEstimate: 'FREE Next-Day Delivery with Prime',
    affiliateUrl: 'https://link.amazon/B0ae4X6pk',
    inStock: true,
    stockCount: 16,
    mainImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Two processors and 8 microphones deliver flagship Active Noise Cancellation. Precision voice pickup and crystal-clear hands-free calling for professional remote work.',
    highlights: [
      'Two proprietary processors control 8 microphones for unprecedented ANC',
      'Magnificent sound quality engineered with lightweight carbon fiber dome',
      'Up to 30-hour battery life with 3-minute quick charging for 3 hours playback',
      'Ultra-comfortable, lightweight design with soft-fit synthetic leather'
    ],
    specs: [
      { label: 'Battery Life', value: '30 Hours ANC On / 40 Hours ANC Off' },
      { label: 'Bluetooth Codecs', value: 'LDAC, AAC, SBC' },
      { label: 'Microphones', value: '8 Beamforming Microphones' },
      { label: 'Weight', value: '250 grams' }
    ],
    reviews: [
      {
        author: 'Nathan B.',
        rating: 5,
        date: 'October 19, 2026',
        title: 'Unrivaled noise cancellation on flights and in office',
        comment: 'Silences airplane jet engines and open-office chatter effortlessly. Battery lasts multiple days.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Creator Referral',
    originStore: 'Amazon'
  },
  {
    id: 'keychron-q1-pro-amz',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard CNC Full Aluminum QMK/VIA',
    asin: 'B0BX9T1L8V',
    brand: 'Keychron / Amazon Prime',
    category: 'Computers & Accessories',
    department: 'Keyboards & Peripherals',
    isAccessory: true,
    price: 199.00,
    originalPrice: 219.00,
    rating: 4.9,
    reviewsCount: 4320,
    badge: 'Prime Choice',
    primeEligible: true,
    deliveryEstimate: 'FREE Prime Two-Day Delivery',
    affiliateUrl: 'https://link.amazon/B0dPHChnk',
    inStock: true,
    stockCount: 12,
    mainImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Precision-machined 6063 CNC aluminum body with double-gasket acoustic mounting, hot-swappable K Pro mechanical switches, and programmable multi-function knob.',
    highlights: [
      'Full CNC anodized aluminum enclosure with double-gasket acoustic dampening',
      'Seamless wireless Bluetooth 5.1 connection across up to 3 devices',
      'Fully customizable with open-source QMK and VIA web configurator',
      'South-facing RGB backlighting with premium PBT double-shot keycaps'
    ],
    specs: [
      { label: 'Case Material', value: 'Full CNC 6063 Anodized Aluminum' },
      { label: 'Connectivity', value: 'Bluetooth 5.1 & Type-C Wired (1000Hz)' },
      { label: 'Hot-Swap', value: '3-pin & 5-pin MX mechanical switches' },
      { label: 'Weight', value: '1738 ± 10 grams (Heavy Solid)' }
    ],
    reviews: [
      {
        author: 'Alex P. (Software Engineer)',
        rating: 5,
        date: 'October 17, 2026',
        title: 'Deep marble acoustics out of the box',
        comment: 'No rattling stabs, supreme weight, and the rotary dial handles volume seamlessly.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Creator Referral',
    originStore: 'Amazon'
  },
  {
    id: 'dell-ultrasharp-u2723qe',
    title: 'Dell UltraSharp 27" 4K UHD IPS Black USB-C Hub Monitor (U2723QE, 2000:1 Contrast)',
    asin: 'B09TQZP9CL',
    brand: 'Dell / Amazon Prime',
    category: 'Computers & Accessories',
    department: 'Monitors & Displays',
    isAccessory: false,
    price: 499.99,
    originalPrice: 579.99,
    rating: 4.8,
    reviewsCount: 8450,
    badge: 'Pro Creator Choice',
    primeEligible: true,
    deliveryEstimate: 'FREE Prime One-Day Delivery',
    affiliateUrl: AMAZON_STORE_URL,
    inStock: true,
    stockCount: 9,
    mainImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Groundbreaking IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 color gamut, and 90W USB-C single-cable power delivery and ethernet hub connectivity.',
    highlights: [
      'IPS Black panel offers double the contrast ratio of traditional IPS monitors',
      'Single USB-C cable transmits 4K video, audio, data, and 90W laptop charging',
      '98% DCI-P3 color coverage factory calibrated with Delta E < 2 for creative work',
      'Built-in RJ45 Ethernet port and multiple high-speed USB-A/C ports'
    ],
    specs: [
      { label: 'Resolution', value: '4K UHD 3840 x 2160 at 60Hz' },
      { label: 'Contrast Ratio', value: '2,000:1 (IPS Black)' },
      { label: 'Power Delivery', value: 'Up to 90W via USB-C' },
      { label: 'Color Gamut', value: '100% sRGB, 98% DCI-P3' }
    ],
    reviews: [
      {
        author: 'Sarah L. (Colorist)',
        rating: 5,
        date: 'October 13, 2026',
        title: 'Incredible black levels for editing',
        comment: 'Connecting one USB-C cable to my MacBook charges it, provides ethernet, and gives pristine 4K video.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Affiliate Storefront Referral',
    originStore: 'Amazon'
  },
  {
    id: 'elgato-stream-deck-mk2',
    title: 'Elgato Stream Deck MK.2 Studio Controller with 15 Customizable LCD Macro Keys',
    asin: 'B09738CV2G',
    brand: 'Elgato / Amazon Prime',
    category: 'Electronics & Gadgets',
    department: 'Streaming & Production',
    isAccessory: true,
    price: 139.99,
    originalPrice: 149.99,
    rating: 4.9,
    reviewsCount: 19800,
    badge: '#1 Best Seller',
    primeEligible: true,
    deliveryEstimate: 'FREE Tomorrow with Amazon Prime',
    affiliateUrl: AMAZON_STORE_URL,
    inStock: true,
    stockCount: 20,
    mainImage: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80'
    ],
    description: '15 tactile LCD keys trigger limitless actions with one touch. Automate workflows, launch software, mute microphones, toggle smart lights, and execute multi-actions seamlessly.',
    highlights: [
      '15 customizable LCD keys with instant visual feedback and dynamic folder support',
      'One-touch automation for OBS Studio, Twitch, YouTube, Zoom, Philips Hue, and Discord',
      'Multi Actions: chain multiple commands together triggered by a single button press',
      'Detachable 45-degree desktop stand with high-speed USB-C connectivity'
    ],
    specs: [
      { label: 'Keys', value: '15 Customizable LCD Keys' },
      { label: 'Interface', value: 'USB 2.0 (Type-C to Type-A Cable)' },
      { label: 'Dimensions', value: '118 x 84 x 25 mm' },
      { label: 'Weight', value: '145 grams without stand' }
    ],
    reviews: [
      {
        author: 'Kevin M. (Creator)',
        rating: 5,
        date: 'October 15, 2026',
        title: 'Cuts repetitive computer tasks down to seconds',
        comment: 'Beyond streaming, I use it for Zoom mute shortcuts, Spotify controls, and Photoshop macros.',
        verifiedAmazonPurchase: true
      }
    ],
    commissionRate: 4,
    commissionNote: 'Verified Amazon Affiliate Storefront Referral',
    originStore: 'Amazon'
  },

  // =========================================================================
  // 2. SHOPZ BD EXCLUSIVE TECH & GADGET DEALS
  // Referral: https://www.shopz.com.bd/?ref=mahbubur-rahman-shahin
  // =========================================================================
  {
    id: 'shopz-haylou-solar-plus-rt3',
    title: 'Haylou Solar Plus RT3 AMOLED Bluetooth Calling Smartwatch with SpO2',
    brand: 'Haylou / Shopz BD',
    category: 'Wearables & Smartwatches',
    department: 'Smart Watches',
    isAccessory: false,
    price: 36.90,
    originalPrice: 48.00,
    rating: 4.8,
    reviewsCount: 3120,
    badge: 'Shopz BD Hot Deal',
    primeEligible: false,
    deliveryEstimate: 'Express Courier Delivery in 24-48 Hours',
    affiliateUrl: 'https://www.shopz.com.bd/product/haylou-solar-plus-rt3-smart-watch/?ref=mahbubur-rahman-shahin',
    inStock: true,
    stockCount: 45,
    mainImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    description: '1.43-inch anti-scratch AMOLED HD display with 466*466 resolution. Bluetooth phone calling with built-in microphone & speaker, 105 sports modes, and 24/7 heart-rate and blood oxygen monitoring.',
    highlights: [
      '1.43-inch AMOLED retina display with Always-On Display (AOD) support',
      'Crystal-clear Bluetooth calling directly from the wrist',
      'Over 100 watch faces and 105 sport tracking modes',
      'IP68 water resistant build with up to 7-day battery life on heavy usage'
    ],
    specs: [
      { label: 'Display', value: '1.43" AMOLED (466x466 px)' },
      { label: 'Sensors', value: 'Heart Rate, SpO2, Accelerometer' },
      { label: 'Battery', value: '280 mAh (Up to 7 days daily use)' },
      { label: 'Waterproof', value: 'IP68 Certified' }
    ],
    reviews: [
      {
        author: 'Tanvir A. (Verified Buyer)',
        rating: 5,
        date: 'October 16, 2026',
        title: 'Unbelievable AMOLED screen clarity at this price',
        comment: 'Received from Shopz BD in pristine packaging. Calling quality is crisp and battery lasts nearly a full week.',
        verifiedAmazonPurchase: false
      }
    ],
    commissionRate: 8,
    commissionNote: 'Verified Shopz BD Partner Referral',
    originStore: 'Shopz BD'
  },
  {
    id: 'shopz-qcy-t13-anc',
    title: 'QCY T13 ANC True Wireless Earbuds with 28dB Active Noise Cancellation & 4 Mics',
    brand: 'QCY / Shopz BD',
    category: 'Audio & Headphones',
    department: 'Wireless Earbuds',
    isAccessory: true,
    price: 24.50,
    originalPrice: 32.00,
    rating: 4.8,
    reviewsCount: 4560,
    badge: 'Shopz BD Best Value',
    primeEligible: false,
    deliveryEstimate: 'Express Courier Delivery in 24-48 Hours',
    affiliateUrl: 'https://www.shopz.com.bd/product/qcy-t13-anc-tws-earbuds/?ref=mahbubur-rahman-shahin',
    inStock: true,
    stockCount: 60,
    mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Up to 28dB Active Noise Cancelling silences subway and café ambient noise. 4 ENC microphones ensure crystal call clarity, paired with low-latency gaming mode and 30-hour total battery life.',
    highlights: [
      '28dB Active Noise Cancellation with Transparency Awareness mode',
      '4-Mic ENC algorithms isolate speech from surrounding environment',
      '10mm biological diaphragm drivers for deep punchy bass',
      'QCY companion app with customizable EQ and touch controls'
    ],
    specs: [
      { label: 'ANC Level', value: '28dB Depth Active Noise Cancellation' },
      { label: 'Driver', value: '10mm Dynamic Diaphragm' },
      { label: 'Playtime', value: '7 Hours (30 Hours with Case)' },
      { label: 'Bluetooth', value: 'Bluetooth 5.3 Low Latency (68ms)' }
    ],
    reviews: [
      {
        author: 'Arif H. (Music Enthusiast)',
        rating: 5,
        date: 'October 17, 2026',
        title: 'Best budget ANC earbuds hands down',
        comment: 'Great bass response, solid fit, and the transparency mode works really well for running.',
        verifiedAmazonPurchase: false
      }
    ],
    commissionRate: 8,
    commissionNote: 'Verified Shopz BD Partner Referral',
    originStore: 'Shopz BD'
  },
  {
    id: 'shopz-baseus-blade-100w',
    title: 'Baseus Blade 100W Ultra-Thin Fast Laptop Power Bank 20000mAh with Digital Status Screen',
    brand: 'Baseus / Shopz BD',
    category: 'Smart Home & Power',
    department: 'Laptop Power & Gadgets',
    isAccessory: true,
    price: 68.00,
    originalPrice: 85.00,
    rating: 4.9,
    reviewsCount: 2840,
    badge: '100W Fast Power',
    primeEligible: false,
    deliveryEstimate: 'Express Courier Delivery in 24-48 Hours',
    affiliateUrl: 'https://www.shopz.com.bd/product/baseus-blade-100w-power-bank/?ref=mahbubur-rahman-shahin',
    inStock: true,
    stockCount: 28,
    mainImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Ultra-slim 18mm book-style profile easily slips into laptop backpacks. 100W high-speed USB-C output juices MacBook Pro 16", Dell XPS, and iPad Pro at full wall-plug speeds.',
    highlights: [
      'Blazing 100W Power Delivery output supports full-speed laptop charging',
      'Ultra-thin 0.7-inch flat slab design fits in briefcases and document sleeves',
      'Numeric digital display reveals real-time voltage, current, and minutes remaining',
      '4 output ports (2x USB-C + 2x USB-A) to charge up to 4 devices simultaneously'
    ],
    specs: [
      { label: 'Max Output', value: '100W USB-C PD 3.0 / QC 4+' },
      { label: 'Capacity', value: '20,000 mAh (74Wh Airline Safe)' },
      { label: 'Thickness', value: 'Only 18mm Ultra-Slim Profile' },
      { label: 'Recharge Time', value: 'Fully refilled in ~90 mins with 65W charger' }
    ],
    reviews: [
      {
        author: 'Shahriar N. (Remote Developer)',
        rating: 5,
        date: 'October 14, 2026',
        title: 'Charges my MacBook Pro at full 100W speed',
        comment: 'The slim form factor is a game changer compared to bulky brick power banks. Displays exact minutes remaining.',
        verifiedAmazonPurchase: false
      }
    ],
    commissionRate: 8,
    commissionNote: 'Verified Shopz BD Partner Referral',
    originStore: 'Shopz BD'
  },
  {
    id: 'shopz-ugreen-100w-gan',
    title: 'Ugreen Nexode 100W 4-Port GaN Fast Desktop & Travel Wall Charger',
    brand: 'Ugreen / Shopz BD',
    category: 'Smart Home & Power',
    department: 'GaN Chargers & Hubs',
    isAccessory: true,
    price: 49.00,
    originalPrice: 62.00,
    rating: 4.9,
    reviewsCount: 3950,
    badge: 'GaN III Fast Tech',
    primeEligible: false,
    deliveryEstimate: 'Express Courier Delivery in 24-48 Hours',
    affiliateUrl: 'https://www.shopz.com.bd/product/ugreen-100w-gan-charger/?ref=mahbubur-rahman-shahin',
    inStock: true,
    stockCount: 34,
    mainImage: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Powered by cutting-edge GaNFast III semiconductors to consolidate 4 chargers into one palm-sized block. Intelligently allocates power across 3 USB-C and 1 USB-A ports.',
    highlights: [
      '100W Max single port power easily charges MacBook Pro to 55% in 30 minutes',
      'GaN III technology runs 30% cooler while occupying 40% less volume',
      'Over-temperature, over-voltage, and short-circuit multi-protection suite',
      'Foldable plug pins for effortless travel and coffee shop workspaces'
    ],
    specs: [
      { label: 'Total Output', value: '100W Max Multi-Port' },
      { label: 'Ports', value: '3x USB-C + 1x USB-A' },
      { label: 'Technology', value: 'Gallium Nitride (GaN III)' },
      { label: 'Compatibility', value: 'MacBook, Windows, iPad, iPhone, Galaxy, Switch' }
    ],
    reviews: [
      {
        author: 'Fahim K.',
        rating: 5,
        date: 'October 18, 2026',
        title: 'Replaced 4 separate chargers on my desk',
        comment: 'Runs very cool even under full load. Powers my laptop, phone, and watch simultaneously.',
        verifiedAmazonPurchase: false
      }
    ],
    commissionRate: 8,
    commissionNote: 'Verified Shopz BD Partner Referral',
    originStore: 'Shopz BD'
  },
  {
    id: 'shopz-mibro-watch-gs-pro',
    title: 'Mibro Watch GS Pro Dual-Core GPS Sport Smartwatch with 1.39" AMOLED',
    brand: 'Mibro / Shopz BD',
    category: 'Wearables & Smartwatches',
    department: 'Sport Smartwatches',
    isAccessory: false,
    price: 72.00,
    originalPrice: 89.00,
    rating: 4.8,
    reviewsCount: 1680,
    badge: 'Dual GPS Sport',
    primeEligible: false,
    deliveryEstimate: 'Express Courier Delivery in 24-48 Hours',
    affiliateUrl: 'https://www.shopz.com.bd/product/mibro-watch-gs-pro/?ref=mahbubur-rahman-shahin',
    inStock: true,
    stockCount: 22,
    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Flagship dual-core 2-in-1 chip with integrated GPS/BDS/GLONASS satellite positioning. Premium 316L stainless steel bezel, 1.39" AMOLED display, and 5ATM water resistance up to 50 meters.',
    highlights: [
      'Dual-core processor with 2.5D GPU provides fluid 60FPS animations',
      'Dual-frequency GPS satellite positioning tracks runs and trails accurately',
      '5ATM waterproof grade suitable for open water swimming and rain workouts',
      'Up to 20 days battery life in daily mode (60 days in basic watch mode)'
    ],
    specs: [
      { label: 'Bezel Material', value: '316L Marine Grade Stainless Steel' },
      { label: 'Positioning', value: 'GPS / Beidou / GLONASS / QZSS' },
      { label: 'Water Resistance', value: '5 ATM (50 Meters Submersion)' },
      { label: 'Battery', value: '460 mAh (Up to 20 Days Normal Use)' }
    ],
    reviews: [
      {
        author: 'Rashedul I. (Marathon Runner)',
        rating: 5,
        date: 'October 12, 2026',
        title: 'Outstanding GPS accuracy for running',
        comment: 'Locking GPS takes only 5 seconds. The stainless steel case looks rugged and expensive.',
        verifiedAmazonPurchase: false
      }
    ],
    commissionRate: 8,
    commissionNote: 'Verified Shopz BD Partner Referral',
    originStore: 'Shopz BD'
  },
  {
    id: 'shopz-anker-motion-plus',
    title: 'Anker Soundcore Motion+ 30W Hi-Res Bluetooth Speaker with BassUp & aptX',
    brand: 'Soundcore / Shopz BD',
    category: 'Audio & Headphones',
    department: 'Portable Audio & Speakers',
    isAccessory: false,
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.9,
    reviewsCount: 5120,
    badge: 'Hi-Res Audio Certified',
    primeEligible: false,
    deliveryEstimate: 'Express Courier Delivery in 24-48 Hours',
    affiliateUrl: 'https://www.shopz.com.bd/product/anker-soundcore-motion-plus-speaker/?ref=mahbubur-rahman-shahin',
    inStock: true,
    stockCount: 19,
    mainImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Stunning 30W Hi-Res audio with ultra-wide 50Hz to 40kHz frequency range. Positioned at an upward 15-degree angle to disperse rich, room-filling sound and deep bass directly to your ears.',
    highlights: [
      'Certified Hi-Res Audio with Qualcomm aptX lossless Bluetooth streaming',
      'Two ultra-high frequency tweeters, neodymium subwoofers, and passive bass radiators',
      'IPX7 waterproof construction handles spills, pool parties, and outdoor weather',
      'Soundcore app customization with 9-band customizable graphic equalizer'
    ],
    specs: [
      { label: 'Output Power', value: '30W Stereo Output' },
      { label: 'Frequency Response', value: '50 Hz - 40 kHz (Hi-Res)' },
      { label: 'Battery Playtime', value: 'Up to 12 Hours on single charge' },
      { label: 'Waterproof', value: 'IPX7 Fully Waterproof' }
    ],
    reviews: [
      {
        author: 'Imtiaz M.',
        rating: 5,
        date: 'October 15, 2026',
        title: 'Sounds like a speaker twice its size',
        comment: 'Highs are clear, midrange is warm, and BassUp produces room-shaking low frequencies.',
        verifiedAmazonPurchase: false
      }
    ],
    commissionRate: 8,
    commissionNote: 'Verified Shopz BD Partner Referral',
    originStore: 'Shopz BD'
  },
  {
    id: 'shopz-xiaomi-humidifier-2',
    title: 'Xiaomi Smart Humidifier 2 UV-C Antibacterial Ultrasonic 4.5L Mist Maker',
    brand: 'Xiaomi / Shopz BD',
    category: 'Smart Home & Power',
    department: 'Smart Home Appliances',
    isAccessory: false,
    price: 45.00,
    originalPrice: 58.00,
    rating: 4.8,
    reviewsCount: 2280,
    badge: 'Smart Home IoT',
    primeEligible: false,
    deliveryEstimate: 'Express Courier Delivery in 24-48 Hours',
    affiliateUrl: 'https://www.shopz.com.bd/product/xiaomi-smart-humidifier-2/?ref=mahbubur-rahman-shahin',
    inStock: true,
    stockCount: 30,
    mainImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'UV-C ultraviolet sterilization cleans water before atomization, releasing pure healthy mist. 4.5L water tank provides up to 32 hours of continuous operation with Mi Home App and Google Assistant control.',
    highlights: [
      'UV-C sterilization technology kills 99.9% of bacteria before dispersing mist',
      'Large 4.5L capacity tank operates up to 32 continuous hours on low setting',
      'Intelligent automatic humidity sensor adjusts mist levels to prevent condensation',
      'Whisper-quiet <32dB night mode with ambient water level indicator light'
    ],
    specs: [
      { label: 'Tank Capacity', value: '4.5 Liters' },
      { label: 'Mist Output', value: '350 mL/h High-Capacity' },
      { label: 'Connectivity', value: 'Wi-Fi IEEE 802.11 b/g/n (Mi Home App)' },
      { label: 'Noise Level', value: '< 32 dB Quiet Sleep Mode' }
    ],
    reviews: [
      {
        author: 'Nabila S.',
        rating: 5,
        date: 'October 11, 2026',
        title: 'Keeps AC room comfortable all night',
        comment: 'Easy top-fill design, no spills, and syncs directly with my phone to keep room humidity at 55%.',
        verifiedAmazonPurchase: false
      }
    ],
    commissionRate: 8,
    commissionNote: 'Verified Shopz BD Partner Referral',
    originStore: 'Shopz BD'
  },
  {
    id: 'shopz-remax-k08-mic',
    title: 'Remax K08 Wireless Dual Lavalier Microphone for Content Creators & Vlogging',
    brand: 'Remax / Shopz BD',
    category: 'Electronics & Gadgets',
    department: 'Creator Audio & Video',
    isAccessory: true,
    price: 19.99,
    originalPrice: 28.00,
    rating: 4.8,
    reviewsCount: 3410,
    badge: 'Creator Essential',
    primeEligible: false,
    deliveryEstimate: 'Express Courier Delivery in 24-48 Hours',
    affiliateUrl: 'https://www.shopz.com.bd/product/remax-k08-wireless-microphone/?ref=mahbubur-rahman-shahin',
    inStock: true,
    stockCount: 50,
    mainImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Plug-and-play dual wireless lapel microphone system with smart DSP noise reduction chip. 20-meter barrier-free transmission for YouTube videos, live streams, TikTok, and podcasts.',
    highlights: [
      'Instant plug-and-play setup without requiring apps or Bluetooth pairing',
      'Dual transmitters allow simultaneous 2-person interviews and podcasts',
      'Smart DSP acoustic chip filters out wind, traffic, and background noise',
      '20-meter stable low-latency transmission range'
    ],
    specs: [
      { label: 'Transmission', value: '2.4GHz Wireless (20M Barrier-Free)' },
      { label: 'Battery Life', value: '6-8 Hours per charge' },
      { label: 'Connector', value: 'Type-C / Lightning Multi-Compatible' },
      { label: 'Pickup Pattern', value: '360° Omnidirectional' }
    ],
    reviews: [
      {
        author: 'Zubair R. (YouTuber)',
        rating: 5,
        date: 'October 13, 2026',
        title: 'Crisp audio for outdoor videos',
        comment: 'Plugs straight into my phone. Zero setup delay and voices sound rich and studio-clear.',
        verifiedAmazonPurchase: false
      }
    ],
    commissionRate: 8,
    commissionNote: 'Verified Shopz BD Partner Referral',
    originStore: 'Shopz BD'
  }
];
