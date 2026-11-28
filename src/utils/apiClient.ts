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
    const candidate = (params.get('tenant') ?? params.get('storefrontId') ?? '').trim().toLowerCase();
    if (!candidate || candidate === 'default' || !/^[a-z0-9_-]{2,40}$/.test(candidate)) {
      return 'default';
    }
    return candidate;
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
  const activeTenant = tenantId ? tenantId.trim().toLowerCase() : resolveActiveTenantId();
  if (!activeTenant || activeTenant === 'default' || !/^[a-z0-9_-]{2,40}$/.test(activeTenant)) {
    return resolvedUrl;
  }
  const sep = resolvedUrl.includes('?') ? '&' : '?';
  return `${resolvedUrl}${sep}tenant=${encodeURIComponent(activeTenant)}`;
}
