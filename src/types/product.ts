export interface Product {
  id: string;
  asin?: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  nativePrice?: number;
  nativeCurrency?: 'USD' | 'BDT';
  csvCategory?: string;
  sourceType?: 'linked-shop' | 'uploaded-csv';
  badge?: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  image: string;
  originStore?: 'Amazon' | 'Shopz BD' | 'ExonHost';
  affiliateUrl?: string;
}
