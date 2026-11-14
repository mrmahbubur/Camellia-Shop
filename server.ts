import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

interface InquiryRecord {
  id: string;
  senderName: string;
  senderEmail: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  status: string;
}

interface StoreDb {
  inquiries: InquiryRecord[];
  clicks: Record<string, number>;
}

const DEFAULT_DB: StoreDb = {
  inquiries: [],
  clicks: {}
};

let dbWriteQueue: Promise<void> = Promise.resolve();

async function ensureDb(): Promise<StoreDb> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreDb>;
    return {
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      clicks: parsed.clicks && typeof parsed.clicks === 'object' ? parsed.clicks : {}
    };
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    return { inquiries: [], clicks: {} };
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

// Live Gravatar owner profile cache (1 hour TTL)
interface OwnerProfile {
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  email: string;
  phone: string;
  links: { label: string; href: string }[];
}

let ownerCache: { profile: OwnerProfile; fetchedAtMs: number } | null = null;

const BLOCKED_AD_DOMAINS = ['profitableratecpmnetwork', 'uplcm', 'adsterra', 'quge5', 'blogspot.com'];

const DEFAULT_OWNER_PROFILE: OwnerProfile = {
  displayName: 'M R S',
  username: 'mrxshahin',
  avatarUrl: 'https://1.gravatar.com/avatar/79cb903b47ada0af52e9962551bab25e563cc0a515939789f348aaa0ca135946?s=256',
  bio: 'Available for remote IT support, Windows/Android troubleshooting, website content management, and technical documentation (since 2018).',
  email: 'mr216873@gmail.com',
  phone: '+8809611056361',
  links: [
    { label: 'Gravatar', href: 'https://gravatar.com/mrxshahin' },
    { label: 'WordPress', href: 'https://mrxshahin.wordpress.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mrmahbubur' },
    { label: 'X', href: 'https://x.com/Mrshahinx' },
    { label: 'Bluesky', href: 'https://bsky.app/profile/mrxshahin.bsky.social' },
    { label: 'Calendly', href: 'https://calendly.com/mrxshahin' }
  ]
};

function sanitizeBioFromGravatar(rawBio?: string): string {
  if (!rawBio) return DEFAULT_OWNER_PROFILE.bio;
  const paragraphs = rawBio
    .split(/\n{2,}/)
    .map((p) => p.replace(/[#*_`>\[\]]/g, '').replace(/[^\x20-\x7E\u2013\u2014]/g, '').trim())
    .filter(
      (p) =>
        p.length > 35 &&
        !p.startsWith('What I Can Do') &&
        !/\bAI\b|AI-|artificial intelligence/i.test(p)
    );
  if (paragraphs.length >= 2) {
    return `${paragraphs[1]} ${paragraphs[2] ? paragraphs[2] : ''}`.trim();
  }
  if (paragraphs.length === 1) {
    return paragraphs[0];
  }
  return DEFAULT_OWNER_PROFILE.bio;
}

async function getLiveOwnerProfile(): Promise<OwnerProfile> {
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
          thumbnailUrl?: string;
          aboutMe?: string;
          emails?: Array<{ value?: string; primary?: string }>;
          phoneNumbers?: Array<{ value?: string }>;
          accounts?: Array<{ shortname?: string; name?: string; url?: string; is_hidden?: boolean }>;
          contactInfo?: Array<{ type?: string; value?: string }>;
        }>;
      };
      const entry = json.entry?.[0];
      if (entry) {
        const primaryEmail =
          entry.emails?.find((e) => e.primary === 'true')?.value ||
          entry.emails?.[0]?.value ||
          DEFAULT_OWNER_PROFILE.email;
        const phone = entry.phoneNumbers?.[0]?.value || DEFAULT_OWNER_PROFILE.phone;
        const avatarBase = entry.thumbnailUrl || DEFAULT_OWNER_PROFILE.avatarUrl;
        const avatarUrl = avatarBase.includes('?') ? avatarBase : `${avatarBase}?s=256`;

        const candidateLinks: { label: string; href: string }[] = [
          { label: 'Gravatar', href: 'https://gravatar.com/mrxshahin' }
        ];

        for (const acc of entry.accounts || []) {
          if (acc.is_hidden || !acc.url) continue;
          const label = acc.name || acc.shortname || 'Profile';
          candidateLinks.push({ label, href: acc.url });
        }

        const calendlyEntry = Array.isArray(entry.contactInfo)
          ? entry.contactInfo.find((c) => c.type === 'calendar' && typeof c.value === 'string')
          : undefined;
        if (calendlyEntry?.value) {
          candidateLinks.push({ label: 'Calendly', href: calendlyEntry.value });
        }

        const safeLinks = candidateLinks.filter(
          (item) => !BLOCKED_AD_DOMAINS.some((domain) => item.href.toLowerCase().includes(domain))
        );

        const profile: OwnerProfile = {
          displayName: entry.displayName || DEFAULT_OWNER_PROFILE.displayName,
          username: entry.preferredUsername || DEFAULT_OWNER_PROFILE.username,
          avatarUrl,
          bio: sanitizeBioFromGravatar(entry.aboutMe),
          email: primaryEmail,
          phone,
          links: safeLinks.length > 0 ? safeLinks : DEFAULT_OWNER_PROFILE.links
        };

        ownerCache = { profile, fetchedAtMs: now };
        return profile;
      }
    }
  } catch {
    // Fallback to verified owner snapshot if Gravatar is temporarily unreachable
  }

  return DEFAULT_OWNER_PROFILE;
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
    const profile = await getLiveOwnerProfile();
    res.json(profile);
  });

  app.get('/api/inquiries', async (_req, res) => {
    const db = await ensureDb();
    res.json({ inquiries: db.inquiries });
  });

  app.post('/api/inquiries', async (req, res) => {
    const body = req.body as Partial<InquiryRecord>;
    const senderName = typeof body.senderName === 'string' ? body.senderName.trim() : '';
    const senderEmail = typeof body.senderEmail === 'string' ? body.senderEmail.trim() : '';
    const inquiryType = typeof body.inquiryType === 'string' ? body.inquiryType.trim() : 'General Inquiry';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!senderName || !senderEmail || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const record: InquiryRecord = {
      id: `INQ-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      senderName,
      senderEmail,
      inquiryType,
      message,
      createdAt: new Date().toISOString(),
      status: 'Received'
    };

    await withDbLock(async (db) => {
      db.inquiries = [record, ...db.inquiries].slice(0, 50);
      return { db, result: record };
    });

    res.status(201).json({ inquiry: record });
  });

  app.delete('/api/inquiries/:id', async (req, res) => {
    const { id } = req.params;
    await withDbLock(async (db) => {
      db.inquiries = db.inquiries.filter((item) => item.id !== id);
      return { db, result: true };
    });
    res.json({ deleted: true });
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
