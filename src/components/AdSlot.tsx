import React from 'react';

export interface AdSlotProps {
  type?: 'leaderboard' | 'rectangle' | 'skyscraper' | 'sponsor-link';
  className?: string;
  showBadge?: boolean;
}

export const AdSlot: React.FC<AdSlotProps> = () => {
  return null;
};

