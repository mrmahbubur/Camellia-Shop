import ancHeadphonesImg from '../assets/images/product_anc_headphones_1792262854275.jpg';
import deskMatImg from '../assets/images/product_desk_mat_1792262853724.jpg';
import growthBundleImg from '../assets/images/product_growth_bundle_1792262856034.jpg';
import headphoneStandImg from '../assets/images/product_headphone_stand_1792314477623.jpg';
import magsafeChargerImg from '../assets/images/product_magsafe_charger_1792314477779.jpg';
import monitorArmImg from '../assets/images/product_monitor_arm_1792314478188.jpg';
import mouseMxImg from '../assets/images/amazon_mouse_mx_1792276213882.jpg';
import screenbarLightImg from '../assets/images/amazon_screenbar_light_1792276214090.jpg';
import heroWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';
import cloudServerImg from '../assets/images/product_cloud_server_1794916703257.jpg';
import shopzCsvRaw from '../../public/assets/aistudio/my-affiliate-links-mahbubur-rahman-shahin_937a8a27.csv?raw';
import productImageManifest from './productImageManifest.json';

import {
  CURATED_CATALOG_RECORDS,
  parseShopzCsvRecords,
  AMAZON_ASSOCIATE_TAG,
  AMAZON_LINK_ID,
  AMAZON_STORE_URL,
  AMAZON_LINK_SHORT,
  SHOPZ_REF_BASE,
  EXONHOST_AFFILIATE_URL,
  ALIBABA_AFFILIATE_URL,
  BANGLASHOPPERS_AFFILIATE_URL,
  ILLIN_AFFILIATE_URL,
  SOHOJ_AFFILIATE_URL,
  STARTECH_AFFILIATE_URL,
  STARTECH_TRACKING_PARAM,
  RELEVA_TRACKING_PARAM,
  buildAmazonAsinUrl,
  buildRelevaProductUrl,
  type CatalogRecord,
  type ImageKey,
  type ProductCategory
} from './catalogRecords.ts';
import type { PartnerStoreOrigin } from '../utils/regionProfile.ts';

export type { ProductCategory, CatalogRecord, ImageKey };
export {
  AMAZON_ASSOCIATE_TAG,
  AMAZON_LINK_ID,
  AMAZON_STORE_URL,
  AMAZON_LINK_SHORT,
  SHOPZ_REF_BASE,
  EXONHOST_AFFILIATE_URL,
  ALIBABA_AFFILIATE_URL,
  BANGLASHOPPERS_AFFILIATE_URL,
  ILLIN_AFFILIATE_URL,
  SOHOJ_AFFILIATE_URL,
  STARTECH_AFFILIATE_URL,
  STARTECH_TRACKING_PARAM,
  RELEVA_TRACKING_PARAM,
  buildAmazonAsinUrl,
  buildRelevaProductUrl
};

export const IMAGE_ASSET_MAP: Record<ImageKey, string> = {
  mouse: mouseMxImg,
  screenbar: screenbarLightImg,
  headphones: ancHeadphonesImg,
  magsafe: magsafeChargerImg,
  monitorArm: monitorArmImg,
  deskMat: deskMatImg,
  headphoneStand: headphoneStandImg,
  heroWorkspace: heroWorkspaceImg,
  growthBundle: growthBundleImg,
  cloudServer: cloudServerImg
};

const PRODUCT_IMAGE_MANIFEST = productImageManifest as Record<string, string>;

export interface EcomProduct {
  id: string;
  asin?: string;
  title: string;
  brand: string;
  category: Exclude<ProductCategory, 'All Departments (Mega Store)'>;
  department: string;
  csvCategory?: string;
  sourceType?: 'linked-shop' | 'uploaded-csv';
  nativePrice?: number;
  nativeCurrency?: 'USD' | 'BDT';
  price: number;
  priceStatus?: 'reference' | 'live-at-partner';
  originalPrice?: number;
  badge?: string;
  primeEligible: boolean;
  deliveryEstimate: string;
  affiliateUrl: string;
  urlKind?: 'product' | 'portal' | 'category';
  imageIsIllustrative?: boolean;
  mainImage: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  originStore: PartnerStoreOrigin;
  tags?: string[];
  recommendationReason?: string;
}

export function hydrateCatalogRecord(record: CatalogRecord): EcomProduct {
  const manifestImage = PRODUCT_IMAGE_MANIFEST[record.id];
  const mainImage = manifestImage || IMAGE_ASSET_MAP[record.imageKey] || heroWorkspaceImg;
  const secondaryImage = IMAGE_ASSET_MAP[record.secondaryImageKey] || mainImage;
  const galleryImages = manifestImage
    ? [manifestImage]
    : mainImage === secondaryImage
    ? [mainImage]
    : [mainImage, secondaryImage];

  return {
    id: record.id,
    asin: record.asin,
    title: record.title,
    brand: record.brand,
    category: record.category,
    department: record.department,
    csvCategory: record.csvCategory,
    sourceType: record.sourceType,
    nativePrice: record.nativePrice,
    nativeCurrency: record.nativeCurrency,
    price: record.price,
    priceStatus: record.priceStatus,
    originalPrice: record.originalPrice,
    badge: record.badge,
    primeEligible: record.primeEligible,
    deliveryEstimate: record.deliveryEstimate,
    affiliateUrl: record.affiliateUrl,
    urlKind: record.urlKind,
    imageIsIllustrative: manifestImage ? false : record.imageIsIllustrative,
    mainImage,
    galleryImages,
    description: record.description,
    highlights: record.highlights,
    specs: record.specs,
    originStore: record.originStore,
    tags: record.tags
  };
}

const BUNDLED_CSV_RECORDS = parseShopzCsvRecords(shopzCsvRaw);

export const UNIFIED_PRODUCTS: EcomProduct[] = [
  ...CURATED_CATALOG_RECORDS,
  ...BUNDLED_CSV_RECORDS
].map(hydrateCatalogRecord);
