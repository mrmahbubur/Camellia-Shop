/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider, useCart } from './context/CartContext';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { CustomerThemesSection } from './components/CustomerThemesSection';
import { StoreSection } from './components/StoreSection';
import { AmazonShowcaseSection } from './components/AmazonShowcaseSection';
import { SponsorsSection } from './components/SponsorsSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ThemeProvider } from './context/ThemeContext';
import { ArrowUp, Check, X } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unexpected rendering error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-900 dark:text-slate-100">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h1 className="text-lg font-bold">Unable to load storefront view</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{this.state.errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="min-h-[44px] px-4 py-2.5 bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainLayout: React.FC = () => {
  const { activeNotification, dismissNotification } = useCart();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950 transition-colors duration-200">
      <TopBar onNavigate={handleNavigate} />

      <main className="flex-1 min-w-0">
        <StoreSection />

        <CustomerThemesSection />

        <Hero onExploreStore={() => handleNavigate('store')} />

        <AmazonShowcaseSection />

        <SponsorsSection />
      </main>

      <Footer onNavigate={handleNavigate} />

      <CartDrawer />

      {/* Floating Back-to-Top button positioned cleanly clear of other controls & safe areas */}
      {showBackToTop && !activeNotification && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))] right-[max(1rem,env(safe-area-inset-right))] z-30 min-h-[44px] min-w-[44px] px-3 py-2 rounded-full bg-slate-900/90 dark:bg-amber-400/95 text-white dark:text-slate-950 shadow-lg border border-slate-700 dark:border-amber-300 backdrop-blur-xs flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-transform active:scale-95"
        >
          <ArrowUp className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline">Top</span>
        </button>
      )}

      {activeNotification && (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-700 dark:border-slate-600 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium break-words">{activeNotification}</span>
          </div>
          <button
            onClick={dismissNotification}
            className="text-slate-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 shrink-0 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <CartProvider>
          <ProductsProvider>
            <MainLayout />
          </ProductsProvider>
        </CartProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
