import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, ShoppingBag, Tag } from 'lucide-react';
import { getPromoCreativeBySize, type EventPromoCreative } from '../utils/eventPromotionsCsv';
import { useProducts } from '../context/ProductsContext';

interface AliExpressEventBannerProps {
  variant?: 'responsive-strip' | 'showcase';
}

export const AliExpressEventBanner: React.FC<AliExpressEventBannerProps> = ({
  variant = 'responsive-strip'
}) => {
  const { eventPromos: promos, aliexpressEnabled, recordAffiliateClick } = useProducts();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [showAllPlacements, setShowAllPlacements] = useState(false);

  const leaderboard = useMemo(() => getPromoCreativeBySize(promos, '725*90'), [promos]);
  const rectangle = useMemo(() => getPromoCreativeBySize(promos, '300*250'), [promos]);
  const square = useMemo(() => getPromoCreativeBySize(promos, '500*500'), [promos]);
  const mobilePortrait = useMemo(() => getPromoCreativeBySize(promos, '320*480'), [promos]);

  const secondaryPlacements = useMemo(() => {
    const order = ['500*500', '300*250', '320*480', '190*240', '725*90', '160*600', '120*600'];
    const rank = new Map(order.map((size, idx) => [size, idx]));
    return [...promos].sort(
      (a, b) => (rank.get(a.size) ?? 99) - (rank.get(b.size) ?? 99)
    );
  }, [promos]);

  if (!aliexpressEnabled) return null;

  const markImageFailed = (size: string) => {
    setFailedImages((prev) => ({ ...prev, [size]: true }));
  };

  const renderFallbackArtwork = (promo: EventPromoCreative) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full px-4 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 text-left">
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-100">
            AliExpress Event Promotion
          </div>
          <div className="text-sm font-extrabold truncate">
            Explore Seasonal Partner Deals ({promo.width}×{promo.height})
          </div>
        </div>
      </div>
      <span className="px-3.5 py-2 bg-white text-red-700 text-xs font-extrabold rounded-lg inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
        <span>Shop Event</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </span>
    </div>
  );

  if (variant === 'responsive-strip') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="text-red-600 dark:text-red-400 font-bold inline-flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 shrink-0" />
              <span>AliExpress Event Promotion</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Sponsored Partner Campaign</span>
          </div>

          <a
            href={leaderboard.link}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={() => recordAffiliateClick('aliexpress-event-strip-cta', 'AliExpress')}
            className="min-h-[44px] px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <span>Open AliExpress Event</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        {/* Desktop / Tablet Leaderboard (725x90) */}
        <div className="hidden md:flex justify-center">
          <a
            href={leaderboard.link}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            aria-label="AliExpress Event Promotion Banner 725x90"
            onClick={() => recordAffiliateClick('aliexpress-event-725x90', 'AliExpress')}
            className="block w-full max-w-[725px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-red-400 transition-colors"
          >
            {failedImages[leaderboard.size] ? (
              renderFallbackArtwork(leaderboard)
            ) : (
              <img
                src={leaderboard.picture}
                width={leaderboard.width}
                height={leaderboard.height}
                alt="AliExpress Event Promotion 725x90 Leaderboard"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => markImageFailed(leaderboard.size)}
                className="w-full h-auto max-h-[110px] object-contain mx-auto block"
              />
            )}
          </a>
        </div>

        {/* Mobile Medium Rectangle (300x250) */}
        <div className="flex md:hidden justify-center">
          <a
            href={rectangle.link}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            aria-label="AliExpress Event Promotion Banner 300x250"
            onClick={() => recordAffiliateClick('aliexpress-event-300x250', 'AliExpress')}
            className="block w-full max-w-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-red-400 transition-colors"
          >
            {failedImages[rectangle.size] ? (
              renderFallbackArtwork(rectangle)
            ) : (
              <img
                src={rectangle.picture}
                width={rectangle.width}
                height={rectangle.height}
                alt="AliExpress Event Promotion 300x250 Banner"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => markImageFailed(rectangle.size)}
                className="w-full h-auto object-contain mx-auto block"
              />
            )}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-5">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="text-red-600 dark:text-red-400 font-bold inline-flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 shrink-0" />
              <span>Official Event Campaign</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>AliExpress ({promos.length} Banner Formats)</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            AliExpress Seasonal Event Promotion
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            Official AliExpress multi-format promotional banners linked directly to the live event campaign.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={square.link}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={() => recordAffiliateClick('aliexpress-event-showcase-cta', 'AliExpress')}
            className="min-h-[44px] px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <span>Open AliExpress Event</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>

          <button
            type="button"
            onClick={() => setShowAllPlacements((prev) => !prev)}
            aria-expanded={showAllPlacements}
            className="min-h-[44px] px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>
              {showAllPlacements ? 'Hide All Banner Sizes' : `View All ${promos.length} Banner Sizes`}
            </span>
            {showAllPlacements ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Primary Multi-Format Spotlight Row (Leaderboard + Square + Medium Rectangle) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-7 space-y-3">
          <a
            href={leaderboard.link}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            onClick={() => recordAffiliateClick('aliexpress-event-725x90', 'AliExpress')}
            className="block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 hover:border-red-400 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1 pb-1.5">
              <span>{leaderboard.formatLabel}</span>
              <span className="text-red-600 dark:text-red-400 inline-flex items-center gap-1">
                <span>Open</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            {failedImages[leaderboard.size] ? (
              renderFallbackArtwork(leaderboard)
            ) : (
              <img
                src={leaderboard.picture}
                width={leaderboard.width}
                height={leaderboard.height}
                alt="AliExpress Event Promotion 725x90"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => markImageFailed(leaderboard.size)}
                className="w-full h-auto rounded-lg object-contain mx-auto block"
              />
            )}
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[rectangle, mobilePortrait].map((item) => (
              <a
                key={item.size}
                href={item.link}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => recordAffiliateClick(`aliexpress-event-${item.size}`, 'AliExpress')}
                className="group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 hover:border-red-400 transition-colors flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>{item.formatLabel}</span>
                  <ExternalLink className="w-3 h-3 text-red-600 dark:text-red-400" />
                </div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
                  {failedImages[item.size] ? (
                    renderFallbackArtwork(item)
                  ) : (
                    <img
                      src={item.picture}
                      width={item.width}
                      height={item.height}
                      alt={`AliExpress Event Promotion ${item.size}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => markImageFailed(item.size)}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 500x500 Feature Tile */}
        <a
          href={square.link}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => recordAffiliateClick('aliexpress-event-500x500', 'AliExpress')}
          className="lg:col-span-5 group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 hover:border-red-400 transition-colors flex flex-col justify-between gap-2 h-full"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>{square.formatLabel}</span>
            <span className="text-red-600 dark:text-red-400 inline-flex items-center gap-1">
              <span>Shop Event</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
          <div className="w-full aspect-square max-h-[300px] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-2 mx-auto">
            {failedImages[square.size] ? (
              renderFallbackArtwork(square)
            ) : (
              <img
                src={square.picture}
                width={square.width}
                height={square.height}
                alt="AliExpress Event Promotion 500x500 Square"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => markImageFailed(square.size)}
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            )}
          </div>
        </a>
      </div>

      {/* Expandable Full Gallery of All 7 CSV Banner Formats */}
      {showAllPlacements && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 min-[481px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {secondaryPlacements.map((item) => (
            <a
              key={`all-${item.size}`}
              href={item.link}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => recordAffiliateClick(`aliexpress-event-all-${item.size}`, 'AliExpress')}
              className="group bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-400 p-3 flex flex-col justify-between gap-2.5 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.formatLabel}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  {item.size}
                </span>
              </div>

              <div className="w-full h-44 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
                {failedImages[item.size] ? (
                  renderFallbackArtwork(item)
                ) : (
                  <img
                    src={item.picture}
                    width={item.width}
                    height={item.height}
                    alt={`AliExpress Event Banner ${item.size}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => markImageFailed(item.size)}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-red-600 dark:text-red-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Open Event Link</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
