function normalizeApiBase(raw: string | undefined): string {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) {
    return '';
  }
  return trimmed;
}

export function getConfiguredApiBaseUrl(): string {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    return normalizeApiBase(env?.VITE_API_BASE_URL);
  } catch {
    return '';
  }
}

export function isStaticHostedWithoutApi(): boolean {
  if (getConfiguredApiBaseUrl()) return false;
  if (typeof window === 'undefined') return false;
  return window.location.hostname.endsWith('github.io');
}

const TENANT_ID_PATTERN = /^[a-z0-9_-]{2,40}$/;

export function normalizeTenantId(candidate?: string | null): string {
  if (typeof candidate !== 'string') return 'default';
  const clean = candidate.trim().toLowerCase();
  if (!clean || clean === 'default' || !TENANT_ID_PATTERN.test(clean)) {
    return 'default';
  }
  return clean;
}

export function resolveActiveTenantId(search?: string): string {
  try {
    const rawSearch =
      typeof search === 'string'
        ? search
        : typeof window !== 'undefined'
        ? window.location.search
        : '';
    if (!rawSearch) return 'default';
    const params = new URLSearchParams(rawSearch.startsWith('?') ? rawSearch : `?${rawSearch}`);
    const candidate = params.get('tenant') ?? params.get('storefrontId');
    return normalizeTenantId(candidate);
  } catch {
    return 'default';
  }
}

export function resolveApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = getConfiguredApiBaseUrl();
  return base ? `${base}${cleanPath}` : cleanPath;
}

export function resolveTenantApiUrl(path: string, tenantId?: string): string {
  const resolvedUrl = resolveApiUrl(path);
  const isAbsolute = /^https?:\/\//i.test(resolvedUrl);

  try {
    const url = new URL(resolvedUrl, 'http://localhost');
    const embeddedTenant = normalizeTenantId(
      url.searchParams.get('tenant') ?? url.searchParams.get('storefrontId')
    );
    const windowTenant = resolveActiveTenantId();
    const activeTenant =
      tenantId !== undefined
        ? normalizeTenantId(tenantId)
        : windowTenant !== 'default'
        ? windowTenant
        : embeddedTenant;

    url.searchParams.delete('storefrontId');
    if (activeTenant === 'default') {
      url.searchParams.delete('tenant');
    } else {
      url.searchParams.set('tenant', activeTenant);
    }
    return isAbsolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    const activeTenant =
      tenantId !== undefined ? normalizeTenantId(tenantId) : resolveActiveTenantId();
    if (activeTenant === 'default') return resolvedUrl;
    const sep = resolvedUrl.includes('?') ? '&' : '?';
    return `${resolvedUrl}${sep}tenant=${encodeURIComponent(activeTenant)}`;
  }
}

export type TenantHeaderMap = Record<string, string | string[] | undefined>;
export type TenantQueryMap = Record<string, unknown>;

function readSingleTenantValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function readHeaderCaseInsensitive(headers: TenantHeaderMap | undefined, name: string): string {
  if (!headers || typeof headers !== 'object') return '';
  const target = name.toLowerCase();
  for (const [key, raw] of Object.entries(headers)) {
    if (key.toLowerCase() === target) {
      if (typeof raw === 'string') return raw.trim();
      if (Array.isArray(raw) && raw.length === 1 && typeof raw[0] === 'string') {
        return raw[0].trim();
      }
      return '';
    }
  }
  return '';
}

export function resolveRequestTenantId(sources: {
  bodyTenantId?: unknown;
  query?: TenantQueryMap;
  headers?: TenantHeaderMap;
}): string {
  const rawBody = readSingleTenantValue(sources.bodyTenantId);
  if (rawBody) {
    return normalizeTenantId(rawBody);
  }
  const rawQuery =
    readSingleTenantValue(sources.query?.tenant) ||
    readSingleTenantValue(sources.query?.storefrontId);
  if (rawQuery) {
    return normalizeTenantId(rawQuery);
  }
  const rawHeader =
    readHeaderCaseInsensitive(sources.headers, 'x-tenant-id') ||
    readHeaderCaseInsensitive(sources.headers, 'x-storefront-id');
  return normalizeTenantId(rawHeader);
}

function deleteHeaderCaseInsensitive(headers: Record<string, string>, targetName: string): void {
  const lower = targetName.toLowerCase();
  for (const existingKey of Object.keys(headers)) {
    if (existingKey.toLowerCase() === lower) {
      delete headers[existingKey];
    }
  }
}

function setHeaderCaseInsensitive(
  headers: Record<string, string>,
  key: string,
  value: string
): void {
  const lower = key.toLowerCase();
  for (const existingKey of Object.keys(headers)) {
    if (existingKey.toLowerCase() === lower && existingKey !== key) {
      delete headers[existingKey];
    }
  }
  headers[key] = value;
}

export function buildTenantHeaders(
  tenantId?: string,
  extraHeaders?: HeadersInit
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (extraHeaders instanceof Headers) {
    extraHeaders.forEach((value, key) => setHeaderCaseInsensitive(headers, key, value));
  } else if (Array.isArray(extraHeaders)) {
    for (const [key, value] of extraHeaders) {
      setHeaderCaseInsensitive(headers, key, value);
    }
  } else if (extraHeaders && typeof extraHeaders === 'object') {
    for (const [key, value] of Object.entries(extraHeaders)) {
      if (typeof value === 'string') {
        setHeaderCaseInsensitive(headers, key, value);
      }
    }
  }

  const activeTenant = tenantId !== undefined ? normalizeTenantId(tenantId) : resolveActiveTenantId();
  if (activeTenant === 'default') {
    if (tenantId !== undefined) {
      deleteHeaderCaseInsensitive(headers, 'x-tenant-id');
    }
  } else {
    setHeaderCaseInsensitive(headers, 'x-tenant-id', activeTenant);
  }
  return headers;
}

export function resolveTenantFetchInit(tenantId?: string, init: RequestInit = {}): RequestInit {
  const headers = buildTenantHeaders(tenantId, init.headers);
  return Object.keys(headers).length > 0 ? { ...init, headers } : { ...init };
}
