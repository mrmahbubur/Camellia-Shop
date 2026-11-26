export interface EventPromoCreative {
  size: string;
  width: number;
  height: number;
  language: string;
  trackingId: string;
  link: string;
  picture: string;
  formatLabel: string;
}

export const EVENT_PROMOTION_CSV_PATH = '/assets/aistudio/event_promotion_830ab32c.csv';

export const EVENT_PROMOTION_CSV_FETCH_PATHS = [
  './assets/aistudio/event_promotion_830ab32c.csv',
  EVENT_PROMOTION_CSV_PATH
];

export const ALIEXPRESS_EVENT_PRIMARY_URL = 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=725*90';
export const ALIEXPRESS_EVENT_SQUARE_URL = 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=500*500';

const FORMAT_LABELS: Record<string, string> = {
  '725*90': 'Desktop Leaderboard (725×90)',
  '500*500': 'Square Showcase (500×500)',
  '300*250': 'Medium Rectangle (300×250)',
  '320*480': 'Mobile Portrait (320×480)',
  '190*240': 'Compact Vertical (190×240)',
  '160*600': 'Wide Skyscraper (160×600)',
  '120*600': 'Vertical Skyscraper (120×600)'
};

const BLOCKED_DOMAINS = [
  'fabrilife.com',
  'rzekl.com',
  'admitad.com',
  'alitems.com',
  'wextap.com'
];

function parsePromoDimensions(sizeText: string): { width: number; height: number } {
  const match = sizeText.trim().match(/^(\d+)\s*[*x×]\s*(\d+)$/i);
  if (!match) return { width: 300, height: 250 };
  return {
    width: Math.max(1, Number(match[1]) || 300),
    height: Math.max(1, Number(match[2]) || 250)
  };
}

function splitCsvRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function isSafeHttpsUrl(raw: string): boolean {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (!lower.startsWith('https://')) return false;
  return !BLOCKED_DOMAINS.some((domain) => lower.includes(domain));
}

export function parseEventPromotionCsv(csvText: string): EventPromoCreative[] {
  if (!csvText || typeof csvText !== 'string') return [];

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const results: EventPromoCreative[] = [];
  const seenSizes = new Set<string>();

  for (let i = 1; i < lines.length; i += 1) {
    const cols = splitCsvRow(lines[i]);
    if (cols.length < 6) continue;

    const [rawSize, rawLang, rawTrackingId, rawLink, _rawHtml, rawPicture] = cols;
    const size = rawSize.trim();
    if (!size || seenSizes.has(size)) continue;
    if (!isSafeHttpsUrl(rawLink) || !isSafeHttpsUrl(rawPicture)) continue;

    seenSizes.add(size);
    const { width, height } = parsePromoDimensions(size);

    results.push({
      size,
      width,
      height,
      language: rawLang.trim() || 'en',
      trackingId: rawTrackingId.trim() || 'default',
      link: rawLink.trim(),
      picture: rawPicture.trim(),
      formatLabel: FORMAT_LABELS[size] || `Promo Banner (${width}×${height})`
    });
  }

  return results;
}

export const DEFAULT_ALIEXPRESS_EVENT_PROMOS: EventPromoCreative[] = [
  {
    size: '190*240',
    width: 190,
    height: 240,
    language: 'en',
    trackingId: 'default',
    link: 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=190*240',
    picture: 'https://ae-pic-a1.aliexpress-media.com/kf/Sab4a71959b6346c5b08b6fee0d16abe82.png',
    formatLabel: FORMAT_LABELS['190*240']
  },
  {
    size: '725*90',
    width: 725,
    height: 90,
    language: 'en',
    trackingId: 'default',
    link: 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=725*90',
    picture: 'https://ae-pic-a1.aliexpress-media.com/kf/Se16b3272cf694080a20a4d243d226a3dw.png',
    formatLabel: FORMAT_LABELS['725*90']
  },
  {
    size: '300*250',
    width: 300,
    height: 250,
    language: 'en',
    trackingId: 'default',
    link: 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=300*250',
    picture: 'https://ae-pic-a1.aliexpress-media.com/kf/S57b68865d9554fbf8248ee6d0ba1e942S.png',
    formatLabel: FORMAT_LABELS['300*250']
  },
  {
    size: '160*600',
    width: 160,
    height: 600,
    language: 'en',
    trackingId: 'default',
    link: 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=160*600',
    picture: 'https://ae-pic-a1.aliexpress-media.com/kf/Sda9545d1391349a5b890e5194d204277q.png',
    formatLabel: FORMAT_LABELS['160*600']
  },
  {
    size: '120*600',
    width: 120,
    height: 600,
    language: 'en',
    trackingId: 'default',
    link: 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=120*600',
    picture: 'https://ae-pic-a1.aliexpress-media.com/kf/S41e45c782b48450795aa8a28314d55afE.png',
    formatLabel: FORMAT_LABELS['120*600']
  },
  {
    size: '500*500',
    width: 500,
    height: 500,
    language: 'en',
    trackingId: 'default',
    link: 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=500*500',
    picture: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf6dde077ea4c4082bc6fbed9916864d6h.png',
    formatLabel: FORMAT_LABELS['500*500']
  },
  {
    size: '320*480',
    width: 320,
    height: 480,
    language: 'en',
    trackingId: 'default',
    link: 'https://s.click.aliexpress.com/e/_c3vfU2sh?bz=320*480',
    picture: 'https://ae-pic-a1.aliexpress-media.com/kf/Sa3ba2540ae644f9c952dbaba5b09c18cu.png',
    formatLabel: FORMAT_LABELS['320*480']
  }
];

export function getPromoCreativeBySize(
  promos: EventPromoCreative[],
  size: string
): EventPromoCreative {
  return (
    promos.find((item) => item.size === size) ||
    DEFAULT_ALIEXPRESS_EVENT_PROMOS.find((item) => item.size === size) ||
    DEFAULT_ALIEXPRESS_EVENT_PROMOS[0]
  );
}
