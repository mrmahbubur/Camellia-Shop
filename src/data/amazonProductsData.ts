import amazonMouseMxImg from '../assets/images/amazon_mouse_mx_1792276213882.jpg';
import amazonScreenbarLightImg from '../assets/images/amazon_screenbar_light_1792276214090.jpg';

export interface AmazonProduct {
  id: string;
  title: string;
  asin: string;
  affiliateUrl: string;
  category: 'Keyboards & Mice' | 'Lighting & Ergonomics' | 'Audio & Studio' | 'Storage & Power' | 'Reading & Tablets';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  primeEligible: boolean;
  deliveryInfo: string;
  commissionEstimate: string;
  commissionRate: string;
  image: string;
  features: string[];
  description: string;
}

const AMAZON_STORE_URL =
  'https://www.amazon.com/gp/yourstore?shopForFallback=1&linkCode=ll2&tag=mrxshahin1-20&linkId=b0640e715d1eb5bbcc6b9a28347ac557&language=en_US&ref_=as_li_ss_tl';

export const AMAZON_PRODUCTS: AmazonProduct[] = [
  {
    id: 'amz-mx-master-3s',
    title: 'Logitech MX Master 3S Wireless Performance Ergonomic Mouse',
    asin: 'B0ae4X6pk',
    affiliateUrl: 'https://link.amazon/B0ae4X6pk',
    category: 'Keyboards & Mice',
    price: 99.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviewsCount: 14250,
    badge: "Amazon's Choice",
    primeEligible: true,
    deliveryInfo: 'FREE One-Day Delivery with Prime',
    commissionEstimate: 'Earns ~$4.00 - $9.90',
    commissionRate: '4% - 10%',
    image: amazonMouseMxImg,
    features: [
      'Quiet Clicks technology reduces click noise by 90%',
      '8,000 DPI track-on-glass optical sensor for dual 4K monitors',
      'MagSpeed electromagnetic scroll wheel (1,000 lines/second)',
      'Cross-computer Flow control between Mac and Windows'
    ],
    description: 'The definitive productivity mouse for programmers, designers, and digital entrepreneurs. Ergonomic thumb rest with side scroll wheel.'
  },
  {
    id: 'amz-screenbar-halo',
    title: 'BenQ ScreenBar Halo LED Monitor Light Bar & Wireless Desktop Dial',
    asin: 'B0dPHChnk',
    affiliateUrl: 'https://link.amazon/B0dPHChnk',
    category: 'Lighting & Ergonomics',
    price: 179.00,
    originalPrice: 199.00,
    rating: 4.9,
    reviewsCount: 3820,
    badge: '#1 Best Seller',
    primeEligible: true,
    deliveryInfo: 'FREE Two-Day Delivery with Prime',
    commissionEstimate: 'Earns ~$7.16 - $17.90',
    commissionRate: '4% - 10%',
    image: amazonScreenbarLightImg,
    features: [
      'Patented asymmetrical optical design eliminates screen glare entirely',
      'Wireless precision desktop dial for stepless dimming & 2700K-6500K color temperature',
      'Integrated back ambient light reduces eye contrast fatigue during night work',
      'Counterweight clamp fits both curved and ultra-slim monitors'
    ],
    description: 'Saves valuable desk space while illuminating your keyboard and workspace evenly without reflecting off the monitor glass.'
  },
  {
    id: 'amz-kindle-paperwhite',
    title: 'Amazon Kindle Paperwhite (16 GB) 6.8" 300 ppi Glare-Free Display',
    asin: 'B08KTZ8249',
    affiliateUrl: AMAZON_STORE_URL,
    category: 'Reading & Tablets',
    price: 149.99,
    originalPrice: 169.99,
    rating: 4.8,
    reviewsCount: 42800,
    badge: 'Best Seller',
    primeEligible: true,
    deliveryInfo: 'FREE One-Day Prime Delivery',
    commissionEstimate: 'Earns ~$6.00 - $15.00',
    commissionRate: '4% - 10%',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    features: [
      '6.8-inch display with thinner borders and adjustable warm light',
      'Up to 10 weeks of battery life and 20% faster page turns',
      'Flush-front design and 300 ppi glare-free display that reads like real paper',
      'IPX8 waterproof rated for reading by the pool or in the bath'
    ],
    description: 'Purpose-built for reading with a glare-free paperwhite display that feels natural in sunlight and dark rooms alike.'
  },
  {
    id: 'amz-airpods-pro-2',
    title: 'Apple AirPods Pro 2 Wireless Earbuds with USB-C Charging Case',
    asin: 'B0CHWRXH8B',
    affiliateUrl: AMAZON_STORE_URL,
    category: 'Audio & Studio',
    price: 199.00,
    originalPrice: 249.00,
    rating: 4.8,
    reviewsCount: 29800,
    badge: 'Amazon Deal',
    primeEligible: true,
    deliveryInfo: 'FREE Tomorrow with Amazon Prime',
    commissionEstimate: 'Earns ~$7.96 - $19.90',
    commissionRate: '4% - 10%',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    features: [
      'Up to 2x more Active Noise Cancellation than the previous generation',
      'Adaptive Audio dynamically blends Transparency mode and Noise Cancellation',
      'Personalized Spatial Audio with dynamic head tracking',
      'USB-C charging with MagSafe case and built-in speaker for Find My'
    ],
    description: 'Pro-level active noise cancellation and crystal clear audio fidelity engineered for productivity and focus.'
  },
  {
    id: 'amz-samsung-t7',
    title: 'Samsung T7 Shield 2TB Portable NVMe External SSD Up to 1050MB/s',
    asin: 'B09VLK9W3S',
    affiliateUrl: AMAZON_STORE_URL,
    category: 'Storage & Power',
    price: 159.99,
    originalPrice: 219.99,
    rating: 4.8,
    reviewsCount: 16400,
    badge: 'Prime Choice',
    primeEligible: true,
    deliveryInfo: 'FREE 1-Day Prime Delivery',
    commissionEstimate: 'Earns ~$6.40 - $16.00',
    commissionRate: '4% - 10%',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
    features: [
      'High-speed PCIe NVMe transfers up to 1,050 MB/s read and 1,000 MB/s write',
      'IP65 water, dust, and 9.8-foot drop resistance for portable reliability',
      'Dynamic Thermal Guard manages heat to maintain top performance',
      'Cross-platform compatibility with PC, Mac, iPad, and game consoles'
    ],
    description: 'Rugged, rapid external NVMe storage designed for heavy video editing, backups, and digital workloads.'
  },
  {
    id: 'amz-anker-737',
    title: 'Anker 737 Power Bank (PowerCore 24K) 140W Fast Charger with Smart Display',
    asin: 'B09VPHVT2Z',
    affiliateUrl: AMAZON_STORE_URL,
    category: 'Storage & Power',
    price: 109.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviewsCount: 9430,
    badge: 'Top Seller',
    primeEligible: true,
    deliveryInfo: 'FREE Prime One-Day Delivery',
    commissionEstimate: 'Earns ~$4.40 - $11.00',
    commissionRate: '4% - 10%',
    image: 'https://images.unsplash.com/photo-1609592424360-153b6f2f9aa7?w=800&auto=format&fit=crop&q=80',
    features: [
      'Ultra-powerful two-way fast charging with 140W max output and input',
      'Smart digital display reveals output/input wattage and remaining time',
      '24,000mAh capacity to charge laptops, tablets, and phones on the move',
      'ActiveShield 2.0 real-time temperature control system'
    ],
    description: 'The definitive high-power portable battery capable of charging demanding laptops and mobile gear anywhere.'
  }
];
