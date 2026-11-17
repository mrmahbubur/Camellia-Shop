export interface Product {
  id: string;
  asin?: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  image: string;
  originStore?: 'Amazon' | 'Shopz BD';
  affiliateUrl?: string;
}
