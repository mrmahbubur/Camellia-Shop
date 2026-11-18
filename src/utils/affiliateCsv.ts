import { parseShopzCsvRecords } from '../data/catalogRecords.ts';
import { hydrateCatalogRecord, type EcomProduct } from '../data/unifiedProductsData.ts';

export const UPLOADED_AFFILIATE_CSV_PATH =
  '/assets/aistudio/my-affiliate-links-mahbubur-rahman-shahin_937a8a27.csv';

export const UPLOADED_AFFILIATE_CSV_FETCH_PATHS = [
  './assets/aistudio/my-affiliate-links-mahbubur-rahman-shahin_937a8a27.csv',
  UPLOADED_AFFILIATE_CSV_PATH
];

export function parseAffiliateCsv(csvText: string, defaultBdtRate = 121.5): EcomProduct[] {
  return parseShopzCsvRecords(csvText, defaultBdtRate).map(hydrateCatalogRecord);
}
