import React, { createContext, useContext, useState, useEffect } from 'react';
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
  amazonStoreUrl: 'https://www.amazon.com/gp/yourstore?shopForFallback=1&linkCode=ll2&tag=mrxshahin1-20&linkId=b0640e715d1eb5bbcc6b9a28347ac557&language=en_US&ref_=as_li_ss_tl',
  hostingerId: 'MRXSHAHIN',
  impactId: 'mrsdigital_592',
  vpnPartnerId: 'mrxshahin_cyber',
  creatorSaasId: 'mrxshahin'
};

interface AffiliateContextType {
  config: AffiliateConfig;
  updateConfig: (newConfig: Partial<AffiliateConfig>) => void;
  resetConfig: () => void;
  getAutomatedUrl: (deal: AffiliateDeal) => string;
  generateCustomAffiliateLink: (rawUrl: string, type: string) => string;
  amazonStoreUrl: string;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

export const AffiliateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AffiliateConfig>(() => {
    try {
      const saved = localStorage.getItem('mrs_affiliate_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mrs_affiliate_config', JSON.stringify(config));
    } catch {
      // Storage unavailable
    }
  }, [config]);

  const updateConfig = (newConfig: Partial<AffiliateConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const getAutomatedUrl = (deal: AffiliateDeal): string => {
    const rawUrl = deal.defaultUrl;
    return generateCustomAffiliateLink(rawUrl, deal.trackingType);
  };

  const generateCustomAffiliateLink = (rawUrl: string, type: string): string => {
    if (!rawUrl) return '';
    if (rawUrl.includes('link.amazon') || rawUrl.includes('amzn.to')) {
      return rawUrl;
    }
    try {
      const url = new URL(rawUrl);
      if (type === 'amazon') {
        url.searchParams.set('tag', config.amazonTag || 'mrxshahin1-20');
        url.searchParams.set('linkCode', 'll2');
        url.searchParams.set('linkId', 'b0640e715d1eb5bbcc6b9a28347ac557');
      } else if (type === 'hostinger') {
        url.searchParams.set('REFERRALCODE', config.hostingerId || 'MRXSHAHIN');
      } else if (type === 'vpn') {
        url.searchParams.set('aff', config.vpnPartnerId || 'mrxshahin_cyber');
      } else if (type === 'impact') {
        url.searchParams.set('irclickid', config.impactId || 'mrsdigital_592');
      } else {
        url.searchParams.set('ref', config.creatorSaasId || 'mrxshahin');
      }
      return url.toString();
    } catch {
      // Fallback if URL parsing fails
      const sep = rawUrl.includes('?') ? '&' : '?';
      if (type === 'amazon') return `${rawUrl}${sep}tag=${config.amazonTag}&linkCode=ll2&linkId=b0640e715d1eb5bbcc6b9a28347ac557`;
      if (type === 'hostinger') return `${rawUrl}${sep}REFERRALCODE=${config.hostingerId}`;
      if (type === 'vpn') return `${rawUrl}${sep}aff=${config.vpnPartnerId}`;
      return `${rawUrl}${sep}ref=${config.creatorSaasId}`;
    }
  };

  return (
    <AffiliateContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        getAutomatedUrl,
        generateCustomAffiliateLink,
        amazonStoreUrl: config.amazonStoreUrl
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
