import express, { Request } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import {
  DEFAULT_STOREFRONT,
  StorefrontConfig,
  sanitizeStorefrontConfig,
  executeBackendSiteControl
} from './server/siteController.ts';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

interface StoreDb {
  clicks: Record<string, number>;
  storefront: StorefrontConfig;
}

const DEFAULT_DB: StoreDb = {
  clicks: {},
  storefront: DEFAULT_STOREFRONT
};

let dbWriteQueue: Promise<void> = Promise.resolve();

async function ensureDb(): Promise<StoreDb> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreDb>;
    return {
      clicks: parsed.clicks && typeof parsed.clicks === 'object' ? parsed.clicks : {},
      storefront: sanitizeStorefrontConfig(parsed.storefront)
    };
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    return { clicks: {}, storefront: DEFAULT_STOREFRONT };
  }
}

function withDbLock<T>(fn: (db: StoreDb) => Promise<{ db: StoreDb; result: T }>): Promise<T> {
  const next = dbWriteQueue.then(async () => {
    const current = await ensureDb();
    const { db: updated, result } = await fn(current);
    await fs.writeFile(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return result;
  });
  dbWriteQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function isAuthorizedInternalRequest(req: Request): boolean {
  const configuredSecret = process.env.SITE_CONTROL_SECRET?.trim();
  if (configuredSecret) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    return token.length > 0 && token === configuredSecret;
  }

  const remote = req.ip || req.socket.remoteAddress || '';
  return (
    remote === '127.0.0.1' ||
    remote === '::1' ||
    remote === '::ffff:127.0.0.1'
  );
}

// Live FX rates cache (1 hour TTL)
interface RatesCache {
  rates: Record<string, number>;
  updatedAt: string;
  fetchedAtMs: number;
}

let ratesCache: RatesCache | null = null;
const RATES_TTL_MS = 60 * 60 * 1000;

async function getLiveUsdRates(): Promise<{ rates: Record<string, number>; updatedAt: string; live: boolean }> {
  const now = Date.now();
  if (ratesCache && now - ratesCache.fetchedAtMs < RATES_TTL_MS) {
    return { rates: ratesCache.rates, updatedAt: ratesCache.updatedAt, live: true };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timer);

    if (res.ok) {
      const payload = (await res.json()) as {
        result?: string;
        time_last_update_utc?: string;
        rates?: Record<string, number>;
      };
      if (payload.result === 'success' && payload.rates) {
        const filtered: Record<string, number> = {
          USD: 1,
          EUR: Number(payload.rates.EUR) || 0.92,
          GBP: Number(payload.rates.GBP) || 0.79,
          BDT: Number(payload.rates.BDT) || 121.5
        };
        const updatedAt = payload.time_last_update_utc || new Date().toISOString();
        ratesCache = { rates: filtered, updatedAt, fetchedAtMs: now };
        return { rates: filtered, updatedAt, live: true };
      }
    }
  } catch {
    // Fall back to last cached rates if upstream is temporarily unreachable
  }

  if (ratesCache) {
    return { rates: ratesCache.rates, updatedAt: ratesCache.updatedAt, live: true };
  }

  return {
    rates: { USD: 1, EUR: 0.92, GBP: 0.79, BDT: 121.5 },
    updatedAt: new Date().toISOString(),
    live: false
  };
}

// Live Gravatar owner credit cache (1 hour TTL)
interface OwnerCredit {
  displayName: string;
  username: string;
  email: string;
  gravatarUrl: string;
}

let ownerCache: { profile: OwnerCredit; fetchedAtMs: number } | null = null;

const DEFAULT_OWNER_CREDIT: OwnerCredit = {
  displayName: 'M R S',
  username: 'mrxshahin',
  email: 'mr216873@gmail.com',
  gravatarUrl: 'https://gravatar.com/mrxshahin'
};

async function getLiveOwnerCredit(): Promise<OwnerCredit> {
  const now = Date.now();
  if (ownerCache && now - ownerCache.fetchedAtMs < RATES_TTL_MS) {
    return ownerCache.profile;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://gravatar.com/mrxshahin.json', {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timer);

    if (res.ok) {
      const json = (await res.json()) as {
        entry?: Array<{
          displayName?: string;
          preferredUsername?: string;
          profileUrl?: string;
          emails?: Array<{ value?: string; primary?: string }>;
        }>;
      };
      const entry = json.entry?.[0];
      if (entry) {
        const primaryEmail =
          entry.emails?.find((e) => e.primary === 'true')?.value ||
          entry.emails?.[0]?.value ||
          DEFAULT_OWNER_CREDIT.email;

        const profile: OwnerCredit = {
          displayName: entry.displayName || DEFAULT_OWNER_CREDIT.displayName,
          username: entry.preferredUsername || DEFAULT_OWNER_CREDIT.username,
          email: primaryEmail,
          gravatarUrl: entry.profileUrl || DEFAULT_OWNER_CREDIT.gravatarUrl
        };

        ownerCache = { profile, fetchedAtMs: now };
        return profile;
      }
    }
  } catch {
    // Fallback to verified owner snapshot if Gravatar is temporarily unreachable
  }

  return DEFAULT_OWNER_CREDIT;
}

async function startServer() {
  await ensureDb();

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/rates', async (_req, res) => {
    const data = await getLiveUsdRates();
    res.json(data);
  });

  app.get('/api/owner', async (_req, res) => {
    const profile = await getLiveOwnerCredit();
    res.json(profile);
  });

  app.get('/api/storefront', async (_req, res) => {
    const db = await ensureDb();
    res.json(db.storefront);
  });

  app.post('/api/clicks', async (req, res) => {
    const body = req.body as { targetId?: string };
    const key = typeof body?.targetId === 'string' && body.targetId.trim() ? body.targetId.trim() : 'outbound';
    const count = await withDbLock(async (db) => {
      db.clicks[key] = (db.clicks[key] || 0) + 1;
      return { db, result: db.clicks[key] };
    });
    res.json({ count });
  });

  // Internal server-only site control endpoint (not linked or mentioned in public UI)
  app.post('/api/internal/control', async (req, res) => {
    if (!isAuthorizedInternalRequest(req)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const body = req.body as { instruction?: string; command?: string };
    const instruction =
      typeof body?.instruction === 'string'
        ? body.instruction
        : typeof body?.command === 'string'
        ? body.command
        : '';

    if (!instruction.trim()) {
      res.status(400).json({ error: 'instruction string is required' });
      return;
    }

    try {
      const result = await withDbLock(async (db) => {
        const updated = await executeBackendSiteControl(instruction, db.storefront);
        db.storefront = updated.storefront;
        return { db, result: updated };
      });
      res.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to apply storefront update';
      res.status(500).json({ error: msg });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Camellia Shop server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
