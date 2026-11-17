import ancHeadphonesImg from '../assets/images/product_anc_headphones_1792262854275.jpg';
import deskMatImg from '../assets/images/product_desk_mat_1792262853724.jpg';
import growthBundleImg from '../assets/images/product_growth_bundle_1792262856034.jpg';
import headphoneStandImg from '../assets/images/product_headphone_stand_1792314477623.jpg';
import magsafeChargerImg from '../assets/images/product_magsafe_charger_1792314477779.jpg';
import monitorArmImg from '../assets/images/product_monitor_arm_1792314478188.jpg';
import mouseMxImg from '../assets/images/amazon_mouse_mx_1792276213882.jpg';
import screenbarLightImg from '../assets/images/amazon_screenbar_light_1792276214090.jpg';
import heroWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';
import type { EcomProduct, ProductCategory } from '../data/unifiedProductsData';

export const UPLOADED_AFFILIATE_CSV_PATH =
  '/assets/aistudio/my-affiliate-links-mahbubur-rahman-shahin_937a8a27.csv';

export const UPLOADED_AFFILIATE_CSV_FETCH_PATHS = [
  './assets/aistudio/my-affiliate-links-mahbubur-rahman-shahin_937a8a27.csv',
  UPLOADED_AFFILIATE_CSV_PATH
];

interface RawCsvRow {
  product: string;
  category: string;
  price: string;
  link: string;
}

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

function pickProductImage(csvCategory: string, title: string): { main: string; secondary: string } {
  const cat = csvCategory.toLowerCase();
  const name = title.toLowerCase();

  if (cat.includes('microphone') || name.includes('microphone')) {
    return { main: headphoneStandImg, secondary: ancHeadphonesImg };
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
    return { main: ancHeadphonesImg, secondary: headphoneStandImg };
  }
  if (cat.includes('laptop stand') || cat.includes('tripod') || name.includes('tripod')) {
    return { main: monitorArmImg, secondary: heroWorkspaceImg };
  }
  if (
    cat.includes('table lamp') ||
    cat.includes('photographic lighting') ||
    name.includes('lamp') ||
    name.includes('rgb')
  ) {
    return { main: screenbarLightImg, secondary: heroWorkspaceImg };
  }
  if (
    name.includes('power bank') ||
    cat.includes('flashlight') ||
    cat.includes('fan') ||
    cat.includes('light bulb') ||
    cat.includes('cooler')
  ) {
    return { main: magsafeChargerImg, secondary: growthBundleImg };
  }
  if (cat.includes('watch') || name.includes('watch')) {
    return { main: heroWorkspaceImg, secondary: deskMatImg };
  }
  if (cat.includes('trimmer') || cat.includes('calculator') || name.includes('mobile') || name.includes('tv box')) {
    return { main: mouseMxImg, secondary: growthBundleImg };
  }
  return { main: growthBundleImg, secondary: deskMatImg };
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

function buildProductId(link: string, title: string, idx: number): string {
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

export function parseAffiliateCsv(csvText: string, defaultBdtRate = 121.5): EcomProduct[] {
  const matrix = parseCsvMatrix(csvText);
  if (matrix.length < 2) return [];

  const header = matrix[0].map((h) => h.toLowerCase());
  const prodIdx = header.findIndex((h) => h.includes('product'));
  const catIdx = header.findIndex((h) => h.includes('category'));
  const priceIdx = header.findIndex((h) => h.includes('price'));
  const linkIdx = header.findIndex((h) => h.includes('link'));

  if (prodIdx < 0 || linkIdx < 0) return [];

  const rows: RawCsvRow[] = matrix.slice(1).map((cols) => ({
    product: cols[prodIdx] || '',
    category: catIdx >= 0 ? cols[catIdx] || 'Tech & Lifestyle' : 'Tech & Lifestyle',
    price: priceIdx >= 0 ? cols[priceIdx] || '0' : '0',
    link: cols[linkIdx] || ''
  }));

  const seenIds = new Set<string>();
  const safeRate = defaultBdtRate > 1 ? defaultBdtRate : 121.5;

  return rows
    .filter((r) => r.product.length > 0 && r.link.startsWith('https://'))
    .map((r, idx): EcomProduct => {
      let id = buildProductId(r.link, r.product, idx);
      while (seenIds.has(id)) {
        id = `${id}-${idx}`;
      }
      seenIds.add(id);

      const rawBdt = Number.parseFloat(r.price.replace(/[^0-9.]/g, '')) || 0;
      const usdPrice = rawBdt > 0 ? Number((rawBdt / safeRate).toFixed(2)) : 0;
      const category = mapCsvCategory(r.category, r.product);
      const brand = extractBrand(r.product);
      const images = pickProductImage(r.category, r.product);

      return {
        id,
        title: r.product,
        brand,
        category,
        department: 'Shopz BD Tech Deals',
        csvCategory: r.category,
        sourceType: 'uploaded-csv',
        nativePrice: rawBdt,
        nativeCurrency: 'BDT',
        price: usdPrice,
        badge: r.category.toLowerCase().includes('deal') ? 'Shopz BD Deal' : 'Shopz BD Pick',
        primeEligible: false,
        deliveryEstimate: 'Nationwide BD Courier (24–48h)',
        affiliateUrl: r.link,
        mainImage: images.main,
        galleryImages: [images.main, images.secondary],
        description: `${r.product} (${r.category}) available on Shopz BD with nationwide Bangladesh delivery, Cash on Delivery, and official seller checkout.`,
        highlights: [
          `Authentic ${brand} product available through Shopz BD`,
          `Category: ${r.category}`,
          rawBdt > 0
            ? `Listed Price: ${rawBdt.toLocaleString('en-US')} BDT (auto-converted by currency selector)`
            : 'Live pricing available directly on the Shopz.com.bd product page',
          'Direct Shopz BD checkout with nationwide delivery across Bangladesh'
        ],
        specs: [
          { label: 'Brand', value: brand },
          { label: 'Category', value: r.category },
          { label: 'Listed Price', value: rawBdt > 0 ? `${rawBdt.toLocaleString('en-US')} BDT` : 'Check Live Price' },
          { label: 'Retailer', value: 'Shopz BD' }
        ],
        originStore: 'Shopz BD'
      };
    });
}
