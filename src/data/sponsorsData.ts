import ancHeadphonesImg from '../assets/images/product_anc_headphones_1792262854275.jpg';
import deskMatImg from '../assets/images/product_desk_mat_1792262853724.jpg';
import growthBundleImg from '../assets/images/product_growth_bundle_1792262856034.jpg';
import headphoneStandImg from '../assets/images/product_headphone_stand_1792314477623.jpg';
import magsafeChargerImg from '../assets/images/product_magsafe_charger_1792314477779.jpg';
import monitorArmImg from '../assets/images/product_monitor_arm_1792314478188.jpg';
import mouseMxImg from '../assets/images/amazon_mouse_mx_1792276213882.jpg';
import screenbarLightImg from '../assets/images/amazon_screenbar_light_1792276214090.jpg';
import heroWorkspaceImg from '../assets/images/mrs_hero_workspace_1792262853659.jpg';

export type SponsorGroup = 'Hardware & Power' | 'Workspace & Audio' | 'Deals & Bundles';

export interface SponsorPlacement {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  group: SponsorGroup;
  ctaLabel: string;
  url: string;
  image: string;
  featured?: boolean;
  disclosure: string;
}

export const DEFAULT_SPONSORS: SponsorPlacement[] = [
  {
    id: 'sponsor-11226634',
    title: 'Sponsored Partner Link #11226634',
    subtitle: 'External sponsored offer. Visit the destination partner page to view current merchant, product details, and pricing.',
    category: 'Sponsored Hardware Promotion',
    group: 'Hardware & Power',
    ctaLabel: 'Open Sponsored Offer',
    url: 'https://uplcm.com/4/11226634',
    image: magsafeChargerImg,
    featured: true,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-11683565',
    title: 'Sponsored Partner Link #11683565',
    subtitle: 'External sponsored offer. Opens partner destination in a new tab; availability and terms are set by the destination.',
    category: 'Sponsored Workspace Promotion',
    group: 'Workspace & Audio',
    ctaLabel: 'Open Sponsored Offer',
    url: 'https://uplcm.com/4/11683565',
    image: screenbarLightImg,
    featured: true,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-11242745',
    title: 'Sponsored Partner Link #11242745',
    subtitle: 'External sponsored link; current offer terms, merchant identity, and pricing load on destination.',
    category: 'Sponsored Partner Offer',
    group: 'Hardware & Power',
    ctaLabel: 'Open Offer',
    url: 'https://uplcm.com/4/11242745',
    image: growthBundleImg,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-11242069',
    title: 'Sponsored Partner Link #11242069',
    subtitle: 'External sponsored promotion opening partner destination in a new tab.',
    category: 'Sponsored Partner Offer',
    group: 'Deals & Bundles',
    ctaLabel: 'Open Offer',
    url: 'https://uplcm.com/4/11242069',
    image: heroWorkspaceImg,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-11242067',
    title: 'Sponsored Partner Link #11242067',
    subtitle: 'External sponsored promotion. Verify destination offer details directly on the partner page.',
    category: 'Sponsored Partner Offer',
    group: 'Workspace & Audio',
    ctaLabel: 'Open Offer',
    url: 'https://uplcm.com/4/11242067',
    image: monitorArmImg,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-11242742',
    title: 'Sponsored Partner Link #11242742',
    subtitle: 'External sponsored partner link across curated promotion channels.',
    category: 'Sponsored Partner Offer',
    group: 'Workspace & Audio',
    ctaLabel: 'Open Offer',
    url: 'https://uplcm.com/4/11242742',
    image: ancHeadphonesImg,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-11230440',
    title: 'Sponsored Partner Link #11230440',
    subtitle: 'External sponsored partner link; live terms and offers display on destination.',
    category: 'Sponsored Partner Offer',
    group: 'Hardware & Power',
    ctaLabel: 'Open Offer',
    url: 'https://uplcm.com/4/11230440',
    image: mouseMxImg,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-11683560',
    title: 'Sponsored Partner Link #11683560',
    subtitle: 'External sponsored promotion opening partner destination in a new tab.',
    category: 'Sponsored Partner Offer',
    group: 'Deals & Bundles',
    ctaLabel: 'Open Offer',
    url: 'https://uplcm.com/4/11683560',
    image: deskMatImg,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-9912130',
    title: 'Sponsored Partner Link #9912130',
    subtitle: 'External sponsored link; current offer and merchant terms appear on destination.',
    category: 'Sponsored Partner Offer',
    group: 'Deals & Bundles',
    ctaLabel: 'Open Offer',
    url: 'https://uplcm.com/4/9912130',
    image: headphoneStandImg,
    disclosure: 'Sponsored external partner redirect'
  },
  {
    id: 'sponsor-11242744',
    title: 'Sponsored Partner Link #11242744',
    subtitle: 'External sponsored partner link opening in a new tab.',
    category: 'Sponsored Partner Offer',
    group: 'Deals & Bundles',
    ctaLabel: 'Open Offer',
    url: 'https://uplcm.com/4/11242744',
    image: growthBundleImg,
    disclosure: 'Sponsored external partner redirect'
  }
];

export function getContextualSponsors(
  sponsors: SponsorPlacement[],
  contextKey: string,
  count = 2
): SponsorPlacement[] {
  if (!Array.isArray(sponsors) || sponsors.length === 0) return [];
  const lower = contextKey.toLowerCase();

  let targetGroup: SponsorGroup | null = null;
  if (lower.includes('power') || lower.includes('storage') || lower.includes('computer') || lower.includes('hosting')) {
    targetGroup = 'Hardware & Power';
  } else if (lower.includes('audio') || lower.includes('workspace') || lower.includes('office') || lower.includes('lighting')) {
    targetGroup = 'Workspace & Audio';
  } else if (lower.includes('cart') || lower.includes('deal') || lower.includes('shopz') || lower.includes('releva')) {
    targetGroup = 'Deals & Bundles';
  }

  const prioritized = targetGroup
    ? [
        ...sponsors.filter((s) => s.group === targetGroup),
        ...sponsors.filter((s) => s.group !== targetGroup)
      ]
    : sponsors;

  return prioritized.slice(0, Math.max(1, count));
}
