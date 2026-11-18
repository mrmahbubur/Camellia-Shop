export type PartnerStoreName =
  | 'Amazon'
  | 'Shopz BD'
  | 'Releva BD'
  | 'ExonHost'
  | 'Alibaba';

export interface Product {
  id: string;
  asin?: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  nativePrice?: number;
  nativeCurrency?: 'USD' | 'BDT';
  priceStatus?: 'reference' | 'live-at-partner';
  csvCategory?: string;
  sourceType?: 'linked-shop' | 'uploaded-csv';
  imageIsIllustrative?: boolean;
  urlKind?: 'product' | 'portal' | 'category';
  badge?: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  image: string;
  originStore?: PartnerStoreName;
  affiliateUrl?: string;
}
