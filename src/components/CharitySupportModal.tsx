import React, { useEffect } from 'react';
import {
  Heart,
  X,
  Check,
  Droplets,
  BookOpen,
  HeartHandshake,
  Activity,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCharity, CharityCause } from '../context/CharityContext';

export const CharitySupportModal: React.FC = () => {
  const {
    charityEnabled,
    toggleCharityEnabled,
    selectedCauseId,
    setSelectedCauseId,
    causes,
    isCharityModalOpen,
    setIsCharityModalOpen,
    pledgePercentage
  } = useCharity();

  useEffect(() => {
    if (!isCharityModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCharityModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCharityModalOpen, setIsCharityModalOpen]);

  if (!isCharityModalOpen) return null;

  const getCauseIcon = (name: string, isSelected: boolean) => {
    const iconClass = `w-5 h-5 ${isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`;
    switch (name) {
      case 'Droplets':
        return <Droplets className={iconClass} />;
      case 'BookOpen':
        return <BookOpen className={iconClass} />;
      case 'HeartHandshake':
        return <HeartHandshake className={iconClass} />;
      case 'Activity':
        return <Activity className={iconClass} />;
      default:
        return <Heart className={iconClass} />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="charity-modal-title"
      onClick={() => setIsCharityModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in overscroll-contain"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90dvh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 p-5 sm:p-6 text-white flex items-start justify-between gap-3 relative shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-2">
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>Giving Back With Every Order</span>
            </div>
            <h2 id="charity-modal-title" className="text-lg sm:text-2xl font-black text-white">
              Charity Support Initiative
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-lg">
              {pledgePercentage}% of our Amazon affiliate earnings are pledged directly to verified humanitarian causes. You get official Amazon Prime deals at $0 extra cost.
            </p>
          </div>

          <button
            onClick={() => setIsCharityModalOpen(false)}
            aria-label="Close charity modal"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-5 sm:space-y-6">
          {/* Main Toggle Switch */}
          <div className="p-4 bg-rose-50/70 dark:bg-rose-500/15 border border-rose-200/80 dark:border-rose-500/30 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {charityEnabled ? 'Charity Support Active' : 'Charity Support Paused'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {charityEnabled
                    ? `Every Amazon purchase through our site pledges ${pledgePercentage}% of affiliate revenue to your selected cause.`
                    : 'Turn on to direct 5% of affiliate earnings to a verified charity of your choice.'}
                </div>
              </div>
            </div>

            <button
              onClick={toggleCharityEnabled}
              role="switch"
              aria-checked={charityEnabled}
              aria-label="Toggle charity support pledge"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                charityEnabled ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  charityEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Causes Selection Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Your Preferred Cause
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Tap to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {causes.map((cause: CharityCause) => {
                const isSelected = selectedCauseId === cause.id;

                return (
                  <button
                    key={cause.id}
                    onClick={() => setSelectedCauseId(cause.id)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/15 shadow-xs ring-1 ring-rose-400'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-slate-100 dark:bg-slate-800'
                            }`}
                          >
                            {getCauseIcon(cause.iconName, isSelected)}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                            {cause.category}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                        {cause.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                        {cause.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/70 text-[11px] font-medium text-rose-700 dark:text-rose-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{cause.impactGoal}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% Transparent · Zero Cost to Shoppers</span>
            </div>
            <p className="leading-relaxed">
              When you buy products on Amazon through our curated links, Amazon rewards us with a referral commission. We pledge {pledgePercentage}% of those net earnings directly to help fund water wells, student education, and nutrition programs. Your checkout price on Amazon is identical to shopping directly.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Status: <strong className="text-slate-800 dark:text-white">{charityEnabled ? 'Enabled' : 'Disabled'}</strong>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsCharityModalOpen(false)}
              className="min-h-[44px] px-5 py-2.5 bg-slate-900 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
            >
              Done &amp; Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
