export const DEFAULT_SEO_TITLE = 'Camellia Shop | Workspace Tech, Hardware & Partner Catalog';

export const DEFAULT_SEO_DESCRIPTION =
  'Shop curated workspace tech, computer hardware, smartwatches, skincare, home gear, and cloud hosting across Amazon and trusted regional partner stores.';

export const DEFAULT_OG_IMAGE_PATH = 'images/camellia-og-showcase.jpg';

export interface OnlineStoreSchemaOptions {
  baseUrl?: string;
  name?: string;
  description?: string;
}

export interface RequestHeaderMap {
  [key: string]: string | string[] | undefined;
}

export interface ResolveOriginOptions {
  encrypted?: boolean;
  expressProtocol?: string;
  appUrl?: string;
}

function normalizeBaseUrl(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  return trimmed.replace(/#.*$/, '').replace(/\?.*$/, '');
}

function firstHeaderValue(raw?: string | string[]): string {
  if (Array.isArray(raw)) {
    return firstHeaderValue(raw[0]);
  }
  if (typeof raw !== 'string') return '';
  const commaIndex = raw.indexOf(',');
  const segment = commaIndex === -1 ? raw : raw.slice(0, commaIndex);
  return segment.trim();
}

export function parseForwardedHeader(rawHeader?: string | string[]): {
  proto?: string;
  host?: string;
} {
  const firstHop = firstHeaderValue(rawHeader);
  if (!firstHop) return {};

  const result: { proto?: string; host?: string } = {};
  const parts = firstHop.split(';');
  for (const part of parts) {
    const eqIndex = part.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = part.slice(0, eqIndex).trim().toLowerCase();
    let value = part.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1).trim();
    }
    if (key === 'proto' && !result.proto) result.proto = value;
    if (key === 'host' && !result.host) result.host = value;
  }
  return result;
}

function isValidPort(portStr: string): boolean {
  if (!/^\d{1,5}$/.test(portStr)) return false;
  const n = Number(portStr);
  return Number.isInteger(n) && n >= 1 && n <= 65535;
}

const DNS_HOSTNAME_RE =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const IPV6_BRACKET_RE = /^\[([0-9a-fA-F:]+)\](?::(\d{1,5}))?$/;

export function sanitizeHeaderHost(raw?: string | string[]): {
  host: string;
  hostname: string;
  port: string;
} | null {
  let candidate = firstHeaderValue(raw);
  if (!candidate || candidate.length > 253) return null;

  if (
    (candidate.startsWith('"') && candidate.endsWith('"')) ||
    (candidate.startsWith("'") && candidate.endsWith("'"))
  ) {
    candidate = candidate.slice(1, -1).trim();
  }
  if (!candidate || /[\s@/\\?#\u0000-\u001f]/.test(candidate)) return null;

  const ipv6Match = candidate.match(IPV6_BRACKET_RE);
  if (ipv6Match) {
    const inner = ipv6Match[1];
    const port = ipv6Match[2] || '';
    if (!inner.includes(':')) return null;
    if (port && !isValidPort(port)) return null;
    const normalizedHostname = `[${inner.toLowerCase()}]`;
    return {
      host: port ? `${normalizedHostname}:${port}` : normalizedHostname,
      hostname: normalizedHostname,
      port
    };
  }

  const colonCount = (candidate.match(/:/g) || []).length;
  if (colonCount > 1) return null;

  let hostname = candidate;
  let port = '';
  if (colonCount === 1) {
    const idx = candidate.lastIndexOf(':');
    hostname = candidate.slice(0, idx);
    port = candidate.slice(idx + 1);
    if (!port || !isValidPort(port)) return null;
  }

  hostname = hostname.replace(/\.+$/, '').toLowerCase();
  if (!hostname || hostname.length > 253 || !DNS_HOSTNAME_RE.test(hostname)) {
    return null;
  }

  return {
    host: port ? `${hostname}:${port}` : hostname,
    hostname,
    port
  };
}

export function isLoopbackHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return (
    lower === 'localhost' ||
    lower.endsWith('.localhost') ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '[::1]' ||
    lower === '::1'
  );
}

function getHeaderCaseInsensitive(headers: RequestHeaderMap, name: string): string | string[] | undefined {
  const target = name.toLowerCase();
  if (headers[target] !== undefined) return headers[target];
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key];
    }
  }
  return undefined;
}

function parseOriginFromAppUrl(rawAppUrl?: string): string {
  const trimmed = (rawAppUrl || '').trim();
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    const pathname = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname.replace(/\/+$/, '/') : '/';
    return `${parsed.origin}${pathname}`;
  } catch {
    return '';
  }
}

export function resolveRequestOrigin(
  headers: RequestHeaderMap,
  options: ResolveOriginOptions = {}
): string {
  const forwarded = parseForwardedHeader(getHeaderCaseInsensitive(headers, 'forwarded'));
  const hostInfo =
    sanitizeHeaderHost(forwarded.host) ||
    sanitizeHeaderHost(getHeaderCaseInsensitive(headers, 'x-forwarded-host')) ||
    sanitizeHeaderHost(getHeaderCaseInsensitive(headers, 'host'));

  const envOrigin = parseOriginFromAppUrl(options.appUrl);

  if (!hostInfo) {
    return envOrigin;
  }

  let protoCandidate = '';
  const protoSources = [
    forwarded.proto,
    firstHeaderValue(getHeaderCaseInsensitive(headers, 'x-forwarded-proto')),
    firstHeaderValue(getHeaderCaseInsensitive(headers, 'x-forwarded-scheme'))
  ];

  for (const src of protoSources) {
    const lower = (src || '').trim().toLowerCase();
    if (lower === 'http' || lower === 'https') {
      protoCandidate = lower;
      break;
    }
  }

  if (!protoCandidate) {
    const cfVisitor = firstHeaderValue(getHeaderCaseInsensitive(headers, 'cf-visitor'));
    if (cfVisitor && cfVisitor.startsWith('{')) {
      try {
        const parsedVisitor = JSON.parse(cfVisitor) as { scheme?: unknown };
        const scheme = typeof parsedVisitor.scheme === 'string' ? parsedVisitor.scheme.toLowerCase() : '';
        if (scheme === 'http' || scheme === 'https') {
          protoCandidate = scheme;
        }
      } catch {
        // Ignore malformed cf-visitor JSON
      }
    }
  }

  if (!protoCandidate) {
    const xfSsl = firstHeaderValue(getHeaderCaseInsensitive(headers, 'x-forwarded-ssl')).toLowerCase();
    if (xfSsl === 'on' || xfSsl === '1' || xfSsl === 'true') {
      protoCandidate = 'https';
    }
  }

  const loopback = isLoopbackHostname(hostInfo.hostname);

  if (!protoCandidate) {
    if (options.encrypted) {
      protoCandidate = 'https';
    } else if (options.expressProtocol === 'http' || options.expressProtocol === 'https') {
      protoCandidate = options.expressProtocol;
    } else {
      protoCandidate = loopback ? 'http' : 'https';
    }
  }

  const xfPortRaw = firstHeaderValue(getHeaderCaseInsensitive(headers, 'x-forwarded-port'));
  const effectivePort = hostInfo.port || (isValidPort(xfPortRaw) ? xfPortRaw : '');

  const isDefaultPort =
    !effectivePort ||
    (protoCandidate === 'http' && effectivePort === '80') ||
    (protoCandidate === 'https' && effectivePort === '443');

  const normalizedAuthority = isDefaultPort
    ? hostInfo.hostname
    : `${hostInfo.hostname}:${effectivePort}`;

  const requestOrigin = `${protoCandidate}://${normalizedAuthority}/`;

  // When requests come over local loopback (e.g., proxy healthchecks or local dev),
  // prefer explicitly configured APP_URL if available; for public domains/proxies,
  // honor the validated incoming host & protocol headers.
  if (loopback && envOrigin) {
    return envOrigin;
  }

  return requestOrigin;
}

function resolveImageUrlForBase(baseUrl: string): string {
  if (!baseUrl) return `./${DEFAULT_OG_IMAGE_PATH}`;
  try {
    return new URL(DEFAULT_OG_IMAGE_PATH, baseUrl).toString();
  } catch {
    return `${baseUrl.replace(/\/+$/, '')}/${DEFAULT_OG_IMAGE_PATH}`;
  }
}

export function buildOnlineStoreSchema(options: OnlineStoreSchemaOptions = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const name = (options.name || 'Camellia Shop').trim() || 'Camellia Shop';
  const description = (options.description || DEFAULT_SEO_DESCRIPTION).trim() || DEFAULT_SEO_DESCRIPTION;
  const searchTemplate = baseUrl ? `${baseUrl}?q={search_term_string}` : '?q={search_term_string}';
  const imageUrl = resolveImageUrlForBase(baseUrl);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name,
    alternateName: `${name} Partner Catalog`,
    description,
    image: imageUrl,
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

function escapeHtmlAttr(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function upsertHeadMeta(
  html: string,
  attrKey: 'name' | 'property',
  attrValue: string,
  contentValue: string
): string {
  const tag = `<meta ${attrKey}="${attrValue}" content="${escapeHtmlAttr(contentValue)}" />`;
  const pattern = new RegExp(`<meta\\b[^>]*\\b${attrKey}=["']${attrValue}["'][^>]*>`, 'i');
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

export function injectSeoMetadataIntoHtml(
  html: string,
  canonicalBaseUrl: string,
  options: Omit<OnlineStoreSchemaOptions, 'baseUrl'> = {}
): string {
  const baseUrl = normalizeBaseUrl(canonicalBaseUrl);
  if (!baseUrl) return html;

  const escapedAttr = escapeHtmlAttr(baseUrl);
  const absoluteImageUrl = resolveImageUrlForBase(baseUrl);
  const metaDescription = (options.description || DEFAULT_SEO_DESCRIPTION).trim() || DEFAULT_SEO_DESCRIPTION;

  let updated = html;

  const canonicalTag = `<link rel="canonical" href="${escapedAttr}" />`;
  if (/<link\b[^>]*\brel=["']canonical["'][^>]*>/i.test(updated)) {
    updated = updated.replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i, canonicalTag);
  } else {
    updated = updated.replace('</head>', `    ${canonicalTag}\n  </head>`);
  }

  updated = upsertHeadMeta(updated, 'name', 'description', metaDescription);
  updated = upsertHeadMeta(updated, 'property', 'og:description', metaDescription);
  updated = upsertHeadMeta(updated, 'name', 'twitter:description', metaDescription);
  updated = upsertHeadMeta(updated, 'property', 'og:url', baseUrl);
  updated = upsertHeadMeta(updated, 'property', 'og:image', absoluteImageUrl);
  updated = upsertHeadMeta(updated, 'name', 'twitter:image', absoluteImageUrl);

  const schemaJson = JSON.stringify(
    buildOnlineStoreSchema({
      baseUrl,
      name: options.name,
      description: metaDescription
    }),
    null,
    2
  )
    .split('\n')
    .map((line, index) => (index === 0 ? line : `      ${line}`))
    .join('\n');

  const schemaScriptPattern =
    /<script[^>]+id=["']camellia-onlinestore-schema["'][^>]*>[\s\S]*?<\/script>/i;
  const schemaScript = `<script id="camellia-onlinestore-schema" type="application/ld+json">\n      ${schemaJson}\n    </script>`;

  if (schemaScriptPattern.test(updated)) {
    updated = updated.replace(schemaScriptPattern, schemaScript);
  } else {
    updated = updated.replace('</head>', `    ${schemaScript}\n  </head>`);
  }

  return updated;
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

function upsertClientMeta(attrKey: 'name' | 'property', attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attrKey}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrKey, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
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
  const nextTitle = activeSearch ? `Search: ${activeSearch} | ${siteName}` : DEFAULT_SEO_TITLE;
  const absoluteImageUrl = resolveImageUrlForBase(baseUrl);

  document.title = nextTitle;

  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', baseUrl);

  upsertClientMeta('name', 'description', description);
  upsertClientMeta('property', 'og:url', baseUrl);
  upsertClientMeta('property', 'og:title', nextTitle);
  upsertClientMeta('property', 'og:description', description);
  upsertClientMeta('property', 'og:image', absoluteImageUrl);
  upsertClientMeta('name', 'twitter:title', nextTitle);
  upsertClientMeta('name', 'twitter:description', description);
  upsertClientMeta('name', 'twitter:image', absoluteImageUrl);

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
