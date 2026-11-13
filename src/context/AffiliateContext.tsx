import React, { createContext, useContext } from 'react';
import { AffiliateDeal } from '../data/affiliateData';

export interface AffiliateConfig {
  amazonTag: string;
  amazonStoreUrl: string;
  hostingerId: string;
  impactId: string;
  vpnPartnerId: string;
  creatorSaasId: string;
}

const DEFAULT_CONFIG: AffiliateConfig = {
  amazonTag: 'mrxshahin1-20',
  amazonStoreUrl:
    'https://www.amazon.com/gp/yourstore?shopForFallback=1&linkCode=ll2&tag=mrxshahin1-20&linkId=b0640e715d1eb5bbcc6b9a28347ac557&language=en_US&ref_=as_li_ss_tl',
  hostingerId: 'MRXSHAHIN',
  impactId: 'mrsdigital_592',
  vpnPartnerId: 'mrxshahin_cyber',
  creatorSaasId: 'mrxshahin'
};

interface AffiliateContextType {
  config: AffiliateConfig;
  getAutomatedUrl: (deal: AffiliateDeal) => string;
  amazonStoreUrl: string;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

const resolvePartnerUrl = (rawUrl: string, type: string): string => {
  if (!rawUrl) return '';
  if (rawUrl.includes('link.amazon') || rawUrl.includes('amzn.to')) {
    return rawUrl;
  }
  try {
    const url = new URL(rawUrl);
    if (type === 'amazon') {
      url.searchParams.set('tag', DEFAULT_CONFIG.amazonTag);
      url.searchParams.set('linkCode', 'll2');
      url.searchParams.set('linkId', 'b0640e715d1eb5bbcc6b9a28347ac557');
    } else if (type === 'hostinger') {
      url.searchParams.set('REFERRALCODE', DEFAULT_CONFIG.hostingerId);
    } else if (type === 'vpn') {
      url.searchParams.set('aff', DEFAULT_CONFIG.vpnPartnerId);
    } else if (type === 'impact') {
      url.searchParams.set('irclickid', DEFAULT_CONFIG.impactId);
    } else {
      url.searchParams.set('ref', DEFAULT_CONFIG.creatorSaasId);
    }
    return url.toString();
  } catch {
    const sep = rawUrl.includes('?') ? '&' : '?';
    if (type === 'amazon') {
      return `${rawUrl}${sep}tag=${DEFAULT_CONFIG.amazonTag}&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;
    }
    if (type === 'hostinger') return `${rawUrl}${sep}REFERRALCODE=${DEFAULT_CONFIG.hostingerId}`;
    if (type === 'vpn') return `${rawUrl}${sep}aff=${DEFAULT_CONFIG.vpnPartnerId}`;
    return `${rawUrl}${sep}ref=${DEFAULT_CONFIG.creatorSaasId}`;
  }
};

export const AffiliateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getAutomatedUrl = (deal: AffiliateDeal): string => {
    return resolvePartnerUrl(deal.defaultUrl, deal.trackingType);
  };

  return (
    <AffiliateContext.Provider
      value={{
        config: DEFAULT_CONFIG,
        getAutomatedUrl,
        amazonStoreUrl: DEFAULT_CONFIG.amazonStoreUrl
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
};

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);
  if (!context) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
};
