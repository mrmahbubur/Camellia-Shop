import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  CURATED_CATALOG_RECORDS,
  RELEVA_TRACKING_PARAM,
  AMAZON_ASSOCIATE_TAG,
  AMAZON_LINK_ID,
  ALIEXPRESS_AFFILIATE_URL,
  ALIBABA_AFFILIATE_URL,
  EXONHOST_AFFILIATE_URL,
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

  const expectedRelevaIds = [130, 131, 129, 133, 135];
  const relevaRecords = CURATED_CATALOG_RECORDS.filter((r) => r.originStore === 'Releva BD');
  assert.equal(relevaRecords.length, expectedRelevaIds.length);
  for (const pid of expectedRelevaIds) {
    const expectedUrl = `https://releva.com.bd/index.php?route=product/product&product_id=${pid}&tracking=${RELEVA_TRACKING_PARAM}`;
    assert.ok(
      relevaRecords.some((r) => r.affiliateUrl === expectedUrl),
      `Missing Releva BD URL for product_id=${pid}`
    );
  }

  assert.ok(
    CURATED_CATALOG_RECORDS.some(
      (r) => r.originStore === 'AliExpress' && r.affiliateUrl === ALIEXPRESS_AFFILIATE_URL
    )
  );
  assert.ok(
    CURATED_CATALOG_RECORDS.some(
      (r) => r.originStore === 'Alibaba' && r.affiliateUrl === ALIBABA_AFFILIATE_URL
    )
  );
  assert.ok(
    CURATED_CATALOG_RECORDS.some(
      (r) => r.originStore === 'ExonHost' && r.affiliateUrl === EXONHOST_AFFILIATE_URL
    )
  );
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
