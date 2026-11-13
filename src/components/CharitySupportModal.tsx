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
  Sparkles,
  ExternalLink
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
    const iconClass = `w-5 h-5 ${isSelected ? 'text-rose-600' : 'text-slate-500'}`;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 p-6 text-white flex items-start justify-between relative">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-2">
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>Giving Back With Every Order</span>
            </div>
            <h2 id="charity-modal-title" className="text-xl sm:text-2xl font-black text-white">
              Charity Support Initiative
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-lg">
              {pledgePercentage}% of our Amazon affiliate earnings are pledged directly to verified humanitarian causes. You get official Amazon Prime deals at $0 extra cost.
            </p>
          </div>

          <button
            onClick={() => setIsCharityModalOpen(false)}
            aria-label="Close charity modal"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Toggle Switch */}
          <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {charityEnabled ? 'Charity Support Active' : 'Charity Support Paused'}
                </div>
                <div className="text-xs text-slate-600">
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
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                charityEnabled ? 'bg-rose-600' : 'bg-slate-300'
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Your Preferred Cause
              </h3>
              <span className="text-xs text-slate-400 font-medium">Click to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {causes.map((cause: CharityCause) => {
                const isSelected = selectedCauseId === cause.id;

                return (
                  <button
                    key={cause.id}
                    onClick={() => {
                      setSelectedCauseId(cause.id);
                    }}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-rose-100' : 'bg-slate-100'}`}>
                            {getCauseIcon(cause.iconName, isSelected)}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase">
                            {cause.category}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                        {cause.name}
                      </h4>
                      <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                        {cause.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-rose-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{cause.impactGoal}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transparency & How It Works Notice */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Transparent · Zero Cost to Shoppers</span>
            </div>
            <p className="leading-relaxed">
              When you buy products on Amazon through our curated links, Amazon rewards us with a referral commission. We pledge {pledgePercentage}% of those net earnings directly to help fund water wells, student education, and nutrition programs. Your checkout price on Amazon is identical to shopping directly.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Status: <strong className="text-slate-800">{charityEnabled ? 'Enabled' : 'Disabled'}</strong>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsCharityModalOpen(false)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
            >
              Done &amp; Continue Shopping
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
