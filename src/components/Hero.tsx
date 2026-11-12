import { ArrowRight, ShieldCheck, Zap, Sparkles, TrendingUp, ShoppingCart, Heart, ExternalLink } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCharity } from '../context/CharityContext';

interface HeroProps {
  onExploreStore: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreStore, onOpenCalculator }) => {
  const { setSelectedCategory, amazonStoreUrl } = useProducts();
  const { selectedCause, setIsCharityModalOpen, charityEnabled, pledgePercentage } = useCharity();

  const handleBrowseAllAccessories = () => {
    setSelectedCategory('All Accessories');
    onExploreStore();
  };

  return (
    <section id="hero" className="bg-slate-900 text-white pt-8 pb-14 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Balanced Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center py-4">
            
            {/* Editorial Lead Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400 mb-3">
              <span>Universal Amazon Megastore</span>
              <span aria-hidden="true">·</span>
              <span>Prime Fast Delivery</span>
              <span aria-hidden="true">·</span>
              <span>All Accessories Collection</span>
            </div>

            {/* Main Headline with balanced wrap */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight [text-wrap:balance]">
              Shop Anything Just Like Amazon · Verified Prime Deals &amp; Modern Gear.
            </h1>

            {/* Body Description */}
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Explore thousands of top-rated products across Electronics, Home, Kitchen, Fashion, Sports, and Workspace Accessories. Enjoy official Amazon Prime 1-2 day express fulfillment, authentic warranties, and 30-day hassle-free returns.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                onClick={handleBrowseAllAccessories}
                className="px-6 py-3.5 text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Browse All Accessories</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreStore}
                className="px-5 py-3.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Shop Megastore</span>
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-4 py-3.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>ROI Simulator</span>
              </button>

              <a
                href={amazonStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 text-sm font-bold text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 bg-amber-500/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Amazon Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>

            {/* Simple Charity Support Option Card */}
            <div className="mb-6 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                </div>
                <div>
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <span>Our Charity Support Pledge</span>
                    {charityEnabled && (
                      <span className="text-[10px] font-extrabold bg-rose-500/30 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/40">
                        {pledgePercentage}% Active
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Every purchase supports <strong className="text-slate-200">{selectedCause.name}</strong> at $0 extra cost to you.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCharityModalOpen(true)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer shrink-0 self-start sm:self-auto border border-slate-600 hover:border-slate-500"
              >
                Charity Details
              </button>
            </div>

            {/* Trust Signals (Clean unboxed text with bullets) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Zero-Fluff Methodology</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Prime 1-2 Day Express Delivery &amp; Instant Vaults</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact Visual Asset */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="w-full relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-800">
              <img
                src="/src/assets/images/mrs_hero_workspace_1792262853659.jpg"
                alt="MRS Digital Entrepreneur High Performance Workspace"
                className="w-full h-[340px] sm:h-[420px] lg:h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Subtle Scrim for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <div className="flex items-center justify-between text-xs text-white/90">
                  <span className="font-semibold text-white">The MRS Creator Workspace Setup</span>
                  <span className="text-amber-300 font-mono tabular-nums">4K Studio Standard</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Column KPI / Proof Strip in Full-Width Row Below Hero */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              $1.2M+
            </div>
            <div className="text-xs text-slate-400 font-medium">Community Member Revenue</div>
            <p className="text-[11px] text-slate-500">Across 12 verified income playbooks</p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-400 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-400 font-medium">Affiliate Transparency</div>
            <p className="text-[11px] text-slate-500">Direct creator links &amp; FTC compliance</p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              4.9 / 5.0
            </div>
            <div className="text-xs text-slate-400 font-medium">Average Hardware Rating</div>
            <p className="text-[11px] text-slate-500">From 14,000+ verified customer reviews</p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400 font-mono tabular-nums">
              24-Hour
            </div>
            <div className="text-xs text-slate-400 font-medium">Commission Window</div>
            <p className="text-[11px] text-slate-500">Cart spillover on full Amazon checkout</p>
          </div>
        </div>

      </div>
    </section>
  );
};
