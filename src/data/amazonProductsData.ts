import {
  CURATED_CATALOG_RECORDS,
  buildAmazonAsinUrl
} from './catalogRecords.ts';
import { IMAGE_ASSET_MAP } from './unifiedProductsData.ts';

export interface AmazonShowcaseProduct {
  id: string;
  asin: string;
  title: string;
  category:
    | 'Keyboards & Mice'
    | 'Lighting & Ergonomics'
    | 'Audio & Studio'
    | 'Storage & Power'
    | 'Reading & Tablets';
  price: number;
  priceStatus: 'live-at-partner';
  originalPrice?: number;
  badge?: string;
  primeEligible: boolean;
  deliveryInfo: string;
  affiliateUrl: string;
  image: string;
  imageIsIllustrative: boolean;
  description: string;
  features: string[];
}

function mapShowcaseCategory(
  category: string,
  title: string
): AmazonShowcaseProduct['category'] {
  const t = title.toLowerCase();
  if (t.includes('mouse') || t.includes('docking') || t.includes('desk mat')) {
    return 'Keyboards & Mice';
  }
  if (t.includes('screenbar') || t.includes('monitor arm')) {
    return 'Lighting & Ergonomics';
  }
  if (category === 'Audio & Headphones') {
    return 'Audio & Studio';
  }
  return 'Storage & Power';
}

export const AMAZON_PRODUCTS: AmazonShowcaseProduct[] = CURATED_CATALOG_RECORDS.filter(
  (record) => record.originStore === 'Amazon' && Boolean(record.asin)
).map((record) => {
  const asin = record.asin as string;
  return {
    id: record.id,
    asin,
    title: record.title,
    category: mapShowcaseCategory(record.category, record.title),
    price: 0,
    priceStatus: 'live-at-partner',
    badge: 'Amazon Product Page',
    primeEligible: false,
    deliveryInfo: 'Live price, Prime status & shipping verified on Amazon',
    affiliateUrl: buildAmazonAsinUrl(asin),
    image: IMAGE_ASSET_MAP[record.imageKey],
    imageIsIllustrative: true,
    description: record.description,
    features: record.highlights
  };
});
