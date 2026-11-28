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
  const activeTenant = tenantId !== undefined ? normalizeTenantId(tenantId) : resolveActiveTenantId();
  if (activeTenant === 'default') {
    return resolvedUrl;
  }
  const sep = resolvedUrl.includes('?') ? '&' : '?';
  return `${resolvedUrl}${sep}tenant=${encodeURIComponent(activeTenant)}`;
}

export function buildTenantHeaders(
  tenantId?: string,
  extraHeaders?: HeadersInit
): Record<string, string> {
  const headers: Record<string, string> = {};
  const setCaseInsensitive = (key: string, value: string) => {
    const lower = key.toLowerCase();
    for (const existingKey of Object.keys(headers)) {
      if (existingKey.toLowerCase() === lower && existingKey !== key) {
        delete headers[existingKey];
      }
    }
    headers[key] = value;
  };

  if (extraHeaders instanceof Headers) {
    extraHeaders.forEach((value, key) => setCaseInsensitive(key, value));
  } else if (Array.isArray(extraHeaders)) {
    for (const [key, value] of extraHeaders) {
      setCaseInsensitive(key, value);
    }
  } else if (extraHeaders && typeof extraHeaders === 'object') {
    for (const [key, value] of Object.entries(extraHeaders)) {
      if (typeof value === 'string') {
        setCaseInsensitive(key, value);
      }
    }
  }

  const activeTenant = tenantId !== undefined ? normalizeTenantId(tenantId) : resolveActiveTenantId();
  if (activeTenant !== 'default') {
    setCaseInsensitive('x-tenant-id', activeTenant);
  }
  return headers;
}

export function resolveTenantFetchInit(tenantId?: string, init: RequestInit = {}): RequestInit {
  const headers = buildTenantHeaders(tenantId, init.headers);
  return Object.keys(headers).length > 0 ? { ...init, headers } : { ...init };
}
