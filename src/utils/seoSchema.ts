export const DEFAULT_SEO_TITLE = 'Camellia Shop | Workspace Tech, Hardware & Partner Catalog';

export const DEFAULT_SEO_DESCRIPTION =
  'Explore curated workspace electronics, smartwatches, hardware, authentic skincare, home appliances, cloud hosting, and partner store deals across Amazon, Shopz BD, Star Tech, Releva BD, BanglaShoppers, Illin BD, Sohoj Affiliates, Alibaba, and ExonHost.';

export interface OnlineStoreSchemaOptions {
  baseUrl?: string;
  name?: string;
  description?: string;
}

function normalizeBaseUrl(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  return trimmed.replace(/#.*$/, '').replace(/\?.*$/, '');
}

export function buildOnlineStoreSchema(options: OnlineStoreSchemaOptions = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const name = (options.name || 'Camellia Shop').trim() || 'Camellia Shop';
  const description = (options.description || DEFAULT_SEO_DESCRIPTION).trim() || DEFAULT_SEO_DESCRIPTION;
  const searchTemplate = baseUrl ? `${baseUrl}?q={search_term_string}` : '?q={search_term_string}';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name,
    description,
    currenciesAccepted: 'USD, BDT, EUR, GBP, INR, AED, SGD, AUD',
    areaServed: ['BD', 'US', 'GB', 'EU', 'IN', 'AE', 'SG', 'AU'],
    knowsAbout: [
      'Workspace Electronics',
      'Computer Hardware',
      'Smartwatches',
      'Audio Gear',
      'Skincare',
      'Home Appliances',
      'Cloud Hosting'
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchTemplate
      },
      'query-input': 'required name=search_term_string'
    }
  };

  if (baseUrl) {
    schema['@id'] = `${baseUrl}#onlinestore`;
    schema.url = baseUrl;
  }

  return schema;
}

export function readSearchQueryFromLocation(search: string): string {
  if (!search) return '';
  try {
    const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
    const raw = params.get('q') ?? params.get('search') ?? params.get('s') ?? '';
    return raw.trim().slice(0, 160);
  } catch {
    return '';
  }
}

export function syncUrlSearchParam(query: string): void {
  if (typeof window === 'undefined' || typeof window.history?.replaceState !== 'function') return;
  try {
    const url = new URL(window.location.href);
    const trimmed = query.trim();
    const currentQ = url.searchParams.get('q') ?? '';
    const hasLegacy = url.searchParams.has('search') || url.searchParams.has('s');

    if (trimmed) {
      if (currentQ === trimmed && !hasLegacy) return;
      url.searchParams.set('q', trimmed);
    } else {
      if (!url.searchParams.has('q') && !hasLegacy) return;
      url.searchParams.delete('q');
    }

    url.searchParams.delete('search');
    url.searchParams.delete('s');
    window.history.replaceState(null, '', url.toString());
  } catch {
    // Ignore history API restrictions in embedded frames
  }
}

export function applyDynamicSeoMetadata(options: {
  siteName?: string;
  description?: string;
  searchQuery?: string;
}): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const siteName = (options.siteName || 'Camellia Shop').trim() || 'Camellia Shop';
  const description = (options.description || DEFAULT_SEO_DESCRIPTION).trim() || DEFAULT_SEO_DESCRIPTION;
  const activeSearch = (options.searchQuery || '').trim();

  document.title = activeSearch ? `Search: ${activeSearch} | ${siteName}` : DEFAULT_SEO_TITLE;

  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', baseUrl);

  let ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (!ogUrlMeta) {
    ogUrlMeta = document.createElement('meta');
    ogUrlMeta.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrlMeta);
  }
  ogUrlMeta.setAttribute('content', baseUrl);

  const schemaJson = JSON.stringify(
    buildOnlineStoreSchema({
      baseUrl,
      name: siteName,
      description
    })
  );

  let schemaScript = document.getElementById('camellia-onlinestore-schema') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
  }
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'camellia-onlinestore-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  if (schemaScript.textContent !== schemaJson) {
    schemaScript.textContent = schemaJson;
  }
}
