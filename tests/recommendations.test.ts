import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  CURATED_CATALOG_RECORDS,
  RELEVA_HOME_URL,
  RELEVA_TRACKING_PARAM,
  buildRelevaProductUrl,
  isRelevaSpecificProductUrl,
  normalizeRelevaAffiliateUrl,
  AMAZON_ASSOCIATE_TAG,
  AMAZON_LINK_ID,
  AMAZON_STORE_URL,
  AMAZON_LINK_SHORT,
  SHOPZ_REF_BASE,
  ALIBABA_AFFILIATE_URL,
  EXONHOST_AFFILIATE_URL,
  BANGLASHOPPERS_AFFILIATE_URL,
  ILLIN_AFFILIATE_URL,
  STARTECH_AFFILIATE_URL,
  STARTECH_TRACKING_PARAM,
  SOHOJ_AFFILIATE_URL,
  parseShopzCsvRecords
} from '../src/data/catalogRecords.ts';
import {
  REGION_ORDER,
  REGION_PROFILES,
  getStorePriorityRank
} from '../src/utils/regionProfile.ts';
import {
  computeRecommendations,
  resolveApproxUsdPrice
} from '../src/utils/recommendations.ts';

const ROOT = process.cwd();

test('.gitignore ignores /data/ at root without hiding src/data', () => {
  const gitignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
  const lines = gitignore.split(/\r?\n/).map((l) => l.trim());
  assert.ok(lines.includes('/data/'), 'Expected anchored /data/ rule in .gitignore');
  assert.ok(!lines.includes('data/'), 'Unanchored data/ rule must not exist in .gitignore');
});

test('index.html contains impact and both mitgo verification meta tags in <head>', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  assert.ok(headMatch, 'Missing <head> block in index.html');
  const head = headMatch[1];

  assert.ok(
    head.includes('name="impact-site-verification" value="0dfcb5cd-491e-444d-bf9a-fefe6da62228"'),
    'Missing impact-site-verification meta tag'
  );
  assert.ok(
    head.includes('name="mitgo-verification" content="892bc51b-d387-45a2-baab-fa37e8d8e069"'),
    'Missing original mitgo-verification meta tag (892bc51b-...)'
  );
  assert.ok(
    head.includes('name="mitgo-verification" content="370191ce-4227-4e0f-b2b1-7234b5a333b2"'),
    'Missing new mitgo-verification meta tag (370191ce-...)'
  );
});

test('CURATED_CATALOG_RECORDS includes requested affiliate links and zero fabrilife links', () => {
  assert.equal(
    CURATED_CATALOG_RECORDS.some((r) => r.affiliateUrl.toLowerCase().includes('fabrilife.com')),
    false,
    'Fabrilife links must be excluded'
  );

  const expectedAsins = [
    'B09HM94VDS',
    'B08WT889V3',
    'B09XS7JWHH',
    'B0CFPHZZYT',
    'B088F7SY6S',
    'B08FB7WFCT',
    'B09VLHR4JC',
    'B09DV85M6Y',
    'B0BYP2F3SG',
    'B08G7RG9ML'
  ];
  const amazonRecords = CURATED_CATALOG_RECORDS.filter((r) => r.originStore === 'Amazon');
  assert.equal(amazonRecords.length, expectedAsins.length);
  for (const asin of expectedAsins) {
    const rec = amazonRecords.find((r) => r.asin === asin);
    assert.ok(rec, `Missing Amazon ASIN ${asin}`);
    assert.equal(
      rec.affiliateUrl,
      `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}&linkCode=ll2&linkId=${AMAZON_LINK_ID}`
    );
    assert.equal(rec.price, 0);
    assert.equal(rec.priceStatus, 'live-at-partner');
  }

  assert.ok(
    amazonRecords.every((r) => r.specs.some((s) => s.label !== 'ASIN' && s.label !== 'Price')),
    'Expected hardware specs on every Amazon ASIN listing'
  );

  assert.equal(RELEVA_HOME_URL, 'https://releva.com.bd/');
  assert.equal(RELEVA_HOME_URL.includes('tracking='), false);

  const expectedRelevaIds = [130, 131, 129, 133, 135];
  const relevaRecords = CURATED_CATALOG_RECORDS.filter((r) => r.originStore === 'Releva BD');
  assert.equal(relevaRecords.length, expectedRelevaIds.length);
  for (const pid of expectedRelevaIds) {
    const expectedUrl = `https://releva.com.bd/index.php?route=product/product&product_id=${pid}&tracking=${RELEVA_TRACKING_PARAM}`;
    const found = relevaRecords.find((r) => r.affiliateUrl === expectedUrl);
    assert.ok(found, `Missing Releva BD URL for product_id=${pid}`);
    assert.ok(
      found.affiliateUrl.endsWith(`&tracking=${RELEVA_TRACKING_PARAM}`),
      `Releva product URL must end with &tracking=... for product_id=${pid}`
    );
  }

  // Verify Releva tracking is applied ONLY to specific product URLs, never homepage/category/search links
  assert.equal(isRelevaSpecificProductUrl('https://releva.com.bd/'), false);
  assert.equal(
    isRelevaSpecificProductUrl('https://releva.com.bd/index.php?route=product/category&path=20'),
    false
  );
  assert.equal(
    isRelevaSpecificProductUrl('https://releva.com.bd/index.php?route=product/product&product_id=130'),
    true
  );
  assert.equal(
    normalizeRelevaAffiliateUrl('https://releva.com.bd/').includes('tracking='),
    false,
    'Releva homepage link must never include tracking code'
  );
  assert.equal(
    normalizeRelevaAffiliateUrl(
      `https://releva.com.bd/?tracking=${RELEVA_TRACKING_PARAM}`,
      'portal'
    ).includes('tracking='),
    false,
    'Releva portal URL must strip tracking code'
  );
  assert.equal(
    normalizeRelevaAffiliateUrl(
      `https://releva.com.bd/index.php?route=product/category&path=20&tracking=${RELEVA_TRACKING_PARAM}`,
      'category'
    ).includes('tracking='),
    false,
    'Releva category URL must never include tracking code'
  );
  assert.equal(
    normalizeRelevaAffiliateUrl(
      'https://releva.com.bd/index.php?route=product/search&search=watch'
    ).includes('tracking='),
    false,
    'Releva search URL must not include product tracking code'
  );
  assert.ok(
    normalizeRelevaAffiliateUrl(
      'https://releva.com.bd/index.php?route=product/product&product_id=130'
    ).endsWith(`&tracking=${RELEVA_TRACKING_PARAM}`),
    'Specific Releva product URL must end with &tracking=...'
  );
  assert.equal(buildRelevaProductUrl(130).endsWith(`&tracking=${RELEVA_TRACKING_PARAM}`), true);

  assert.equal(
    CURATED_CATALOG_RECORDS.some((r) => r.affiliateUrl.includes('1e8d114494cb5002cfdd16525dc3e8')),
    false,
    'Removed affiliate link must not exist in curated catalog'
  );

  const alibabaRecords = CURATED_CATALOG_RECORDS.filter((r) => r.originStore === 'Alibaba');
  assert.equal(alibabaRecords.length, 4);
  assert.ok(alibabaRecords.every((r) => r.affiliateUrl === ALIBABA_AFFILIATE_URL));
  assert.ok(
    alibabaRecords.every((r) =>
      r.specs.some((s) => s.value === 'Alibaba Verified Suppliers')
    )
  );

  const exonHostRecords = CURATED_CATALOG_RECORDS.filter((r) => r.originStore === 'ExonHost');
  assert.equal(exonHostRecords.length, 3);
  assert.ok(exonHostRecords.every((r) => r.affiliateUrl === EXONHOST_AFFILIATE_URL));
  assert.ok(
    exonHostRecords.every((r) => r.specs.length >= 4),
    'Expected technical stack specs on ExonHost plans'
  );

  const banglaShoppersRecords = CURATED_CATALOG_RECORDS.filter(
    (r) => r.originStore === 'BanglaShoppers'
  );
  assert.equal(banglaShoppersRecords.length, 5);
  assert.equal(BANGLASHOPPERS_AFFILIATE_URL, 'https://www.banglashoppers.com/r/4ehxtB1p/');
  assert.ok(banglaShoppersRecords.every((r) => r.affiliateUrl === BANGLASHOPPERS_AFFILIATE_URL));

  const illinRecords = CURATED_CATALOG_RECORDS.filter((r) => r.originStore === 'Illin BD');
  assert.equal(illinRecords.length, 15);
  assert.equal(ILLIN_AFFILIATE_URL, 'https://www.illin.com.bd/40989');
  const expectedDirectIllinUrls = [
    'https://illin.com.bd/royal-purple-floral-cotton-bedsheet-set/40989',
    'https://illin.com.bd/jennie-moon-90x-power-of-moonlight-brightening-soap/40989',
    'https://illin.com.bd/sp-6-probiotic-bright-whitening-toothpaste/40989',
    'https://illin.com.bd/german-toenailplus-anti-paronychia-relief-oil/40989',
    'https://illin.com.bd/poedagar-men-watch-1563/40989',
    'https://illin.com.bd/poedagar-watch-1565/40989',
    'https://illin.com.bd/poedagar-mens-watch-green-1645/40989',
    'https://illin.com.bd/poedagar-womens-watch-1727/40989',
    'https://illin.com.bd/-air-cooling-3-in-1-usb-mini-portable-fan-aircond-humidifier-purifier-mist-cooler-with-led-light/40989',
    'https://illin.com.bd/folding-fan-with-led-light-lr-2018/40989'
  ];
  for (const directUrl of expectedDirectIllinUrls) {
    assert.ok(
      illinRecords.some((r) => r.affiliateUrl === directUrl),
      `Missing direct Illin BD affiliate URL: ${directUrl}`
    );
  }
  assert.ok(
    illinRecords.every((r) => r.nativeCurrency === 'BDT' && typeof r.nativePrice === 'number' && r.nativePrice > 0),
    'Expected authentic BDT prices on Illin BD items'
  );

  const bulkTxt = fs.readFileSync(
    path.join(ROOT, 'public/assets/aistudio/gemini-code-1795177308224_7bcbca09.txt'),
    'utf8'
  );
  const uniqueBulkUrls = [...new Set(bulkTxt.split(/\r?\n/).map((s) => s.trim()).filter(Boolean))];
  assert.equal(uniqueBulkUrls.length, 284, 'Expected 284 unique URLs in uploaded Star Tech link file');

  const startechRecords = CURATED_CATALOG_RECORDS.filter((r) => r.originStore === 'Star Tech');
  assert.equal(startechRecords.length, 7 + 284);
  assert.equal(STARTECH_AFFILIATE_URL, `https://www.startech.com.bd/?tracking=${STARTECH_TRACKING_PARAM}`);
  const expectedStartechUrls = [
    'https://www.startech.com.bd/colmi-p71-bluetooth-calling-smart-watch?tracking=6ad935b5df200',
    'https://www.startech.com.bd/colmi-p81-bluetooth-calling-smart-watch?tracking=6ad935b5df200',
    'https://www.startech.com.bd/bnc-jack?tracking=6ad935b5df200',
    'https://www.startech.com.bd/value-top-l40b-amd-v2748-all-in-one-pc?tracking=6ad935b5df200',
    'https://www.startech.com.bd/chuwi-herobook-pro-intel-celeron-laptop?tracking=6ad935b5df200',
    'https://www.startech.com.bd/acer-aspire-3-a325-45-n4500-laptop?tracking=6ad935b5df200',
    'https://www.startech.com.bd/flyx-ae8-pro-foldable-drone?tracking=6ad935b5df200',
    ...uniqueBulkUrls
  ];
  const startechUrlSet = new Set(startechRecords.map((r) => r.affiliateUrl));
  for (const stUrl of expectedStartechUrls) {
    assert.ok(
      startechUrlSet.has(stUrl),
      `Missing Star Tech affiliate URL: ${stUrl}`
    );
  }
  assert.ok(
    startechRecords.every(
      (r) =>
        r.department === 'Star Tech BD Gadgets' &&
        r.nativeCurrency === 'BDT' &&
        (r.priceStatus === 'live-at-partner'
          ? r.price === 0 && r.nativePrice === undefined
          : typeof r.nativePrice === 'number' && r.nativePrice > 0 && r.price > 0)
    ),
    'Expected authentic BDT pricing or honest live-at-partner status across all Star Tech items'
  );

  const sohojRecords = CURATED_CATALOG_RECORDS.filter((r) => r.originStore === 'Sohoj Affiliates');
  assert.equal(sohojRecords.length, 2);
  assert.equal(SOHOJ_AFFILIATE_URL, 'https://sohojaffiliates.com/reffer/40989');
  assert.ok(sohojRecords.every((r) => r.affiliateUrl === SOHOJ_AFFILIATE_URL));
});

test('parseShopzCsvRecords imports all 60 CSV rows and skips any fabrilife rows', () => {
  const csvPath = path.join(ROOT, 'public/assets/aistudio/my-affiliate-links-mahbubur-rahman-shahin_937a8a27.csv');
  const csvText = fs.readFileSync(csvPath, 'utf8');
  const parsed = parseShopzCsvRecords(csvText);

  assert.equal(parsed.length, 60);
  assert.ok(parsed.every((r) => r.originStore === 'Shopz BD'));
  assert.ok(parsed.every((r) => r.affiliateUrl.includes('ref=mahbubur-rahman-shahin')));

  const unpriced = parsed.filter((r) => r.price === 0);
  const priced = parsed.filter((r) => r.price > 0);
  assert.ok(unpriced.length > 0 && priced.length > 0);
  assert.ok(unpriced.every((r) => r.priceStatus === 'live-at-partner'));
  assert.ok(priced.every((r) => r.priceStatus === 'reference'));

  const withFabrilife = `${csvText}\nTest Skirt,Fashion,1500,https://fabrilife.com/product/test?ref=MRXSHAHIN1`;
  const filteredParsed = parseShopzCsvRecords(withFabrilife);
  assert.equal(filteredParsed.length, 60);
});

test('Region profiles cover all 8 regions and rank partner stores deterministically', () => {
  assert.equal(REGION_ORDER.length, 8);
  for (const code of REGION_ORDER) {
    assert.ok(REGION_PROFILES[code], `Missing profile for ${code}`);
    assert.ok(REGION_PROFILES[code].storePriority.includes('Releva BD'));
  }
  assert.ok(getStorePriorityRank('Shopz BD', 'BD') < getStorePriorityRank('Amazon', 'BD'));
  assert.ok(getStorePriorityRank('Amazon', 'US') < getStorePriorityRank('Shopz BD', 'US'));
});

test('computeRecommendations responds to Buying Guide need and never treats unknown prices as within budget', () => {
  const csvPath = path.join(ROOT, 'public/assets/aistudio/my-affiliate-links-mahbubur-rahman-shahin_937a8a27.csv');
  const csvRecords = parseShopzCsvRecords(fs.readFileSync(csvPath, 'utf8'));
  const fullCatalog = [...CURATED_CATALOG_RECORDS, ...csvRecords];

  const hostingRecs = computeRecommendations({
    catalog: fullCatalog,
    region: 'US',
    buyingGuide: { need: 'hosting', budgetUsd: null, preferredStore: 'all' },
    limit: 3
  });
  assert.equal(hostingRecs[0].item.originStore, 'ExonHost');

  const watchRecs = computeRecommendations({
    catalog: fullCatalog,
    region: 'BD',
    buyingGuide: { need: 'watches', budgetUsd: null, preferredStore: 'all' },
    limit: 5
  });
  assert.ok(
    watchRecs.every((r) => r.item.category === 'Wearables & Smartwatches'),
    'Watch goal should prioritize Wearables & Smartwatches'
  );

  const beautyRecs = computeRecommendations({
    catalog: fullCatalog,
    region: 'BD',
    buyingGuide: { need: 'beauty', budgetUsd: null, preferredStore: 'all' },
    limit: 5
  });
  assert.ok(
    beautyRecs.some((r) => r.item.originStore === 'BanglaShoppers' || r.item.originStore === 'Illin BD'),
    'Beauty & home goal should surface BanglaShoppers and Illin BD listings'
  );

  // Strict budget check: every item returned under a $15 budget must have a real resolved price <= $15
  const budgetRecs = computeRecommendations({
    catalog: fullCatalog,
    region: 'BD',
    buyingGuide: { need: 'balanced', budgetUsd: 15, preferredStore: 'all' },
    limit: 6
  });
  assert.ok(budgetRecs.length > 0);
  for (const entry of budgetRecs) {
    const approx = resolveApproxUsdPrice(entry.item);
    assert.ok(
      approx !== null && approx > 0 && approx <= 15,
      `Expected priced item <= $15, got ${entry.item.id} (${approx})`
    );
  }
});

test('All 10 uplcm.com sponsored URLs, store portals, and zero fabrilife links exist across src', () => {
  const sponsorsSource = fs.readFileSync(path.join(ROOT, 'src/data/sponsorsData.ts'), 'utf8');
  const expectedSponsorIds = [
    '11226634',
    '11683565',
    '11242745',
    '11242069',
    '11242067',
    '11242742',
    '11230440',
    '11683560',
    '9912130',
    '11242744'
  ];

  for (const sponsorId of expectedSponsorIds) {
    assert.ok(
      sponsorsSource.includes(`https://uplcm.com/4/${sponsorId}`),
      `Missing sponsored URL https://uplcm.com/4/${sponsorId}`
    );
  }

  assert.ok(AMAZON_STORE_URL.includes('node=53629917011') && AMAZON_STORE_URL.includes('tag=mrxshahin06-20'));
  assert.equal(AMAZON_LINK_SHORT, 'https://link.amazon/B0io1BQfg');
  assert.equal(SHOPZ_REF_BASE, 'https://www.shopz.com.bd/?ref=mahbubur-rahman-shahin');

  const scanDirs = [path.join(ROOT, 'src'), path.join(ROOT, 'server')];
  const fabrilifeUrlPattern = /https?:\/\/[^"'\s]*fabrilife\.com/i;
  const checkCleanCode = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        checkCleanCode(fullPath);
      } else if (/\.(ts|tsx|js|jsx|html|css|json)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        assert.equal(
          fabrilifeUrlPattern.test(content),
          false,
          `Unexpected fabrilife.com URL in ${fullPath}`
        );
        assert.equal(
          content.includes('1e8d114494cb5002cfdd16525dc3e8'),
          false,
          `Removed affiliate link token found in ${fullPath}`
        );
      }
    }
  };
  for (const dir of scanDirs) {
    checkCleanCode(dir);
  }
  assert.equal(
    fs.readFileSync(path.join(ROOT, 'server.ts'), 'utf8').includes('1e8d114494cb5002cfdd16525dc3e8'),
    false
  );
  assert.equal(
    fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('1e8d114494cb5002cfdd16525dc3e8'),
    false
  );
});

test('productImageManifest maps 385+ real product images on disk (>1.2KB each)', () => {
  const manifestRaw = fs.readFileSync(
    path.join(ROOT, 'src/data/productImageManifest.json'),
    'utf8'
  );
  const manifest = JSON.parse(manifestRaw) as Record<string, string>;
  const entries = Object.entries(manifest);
  assert.ok(entries.length >= 385, `Expected at least 385 mapped images, got ${entries.length}`);

  for (const [productId, relPath] of entries) {
    assert.ok(
      relPath.startsWith('./images/products/'),
      `Expected ./images/products/ path for ${productId}, got ${relPath}`
    );
    const diskPath = path.join(ROOT, 'public', relPath.replace(/^\.\//, ''));
    assert.ok(fs.existsSync(diskPath), `Missing image file on disk for ${productId}: ${diskPath}`);
    const stat = fs.statSync(diskPath);
    assert.ok(stat.size > 1200, `Image file too small (${stat.size}B) for ${productId}: ${diskPath}`);
  }
});


