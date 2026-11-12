/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider, useCart } from './context/CartContext';
import { AffiliateProvider } from './context/AffiliateContext';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { StoreSection } from './components/StoreSection';
import { AmazonShowcaseSection } from './components/AmazonShowcaseSection';
import { AffiliateHubSection } from './components/AffiliateHubSection';
import { RoiCalculator } from './components/RoiCalculator';
import { PlaybooksSection } from './components/PlaybooksSection';
import { TechGuidesSection } from './components/TechGuidesSection';
import { ThoughtsSection } from './components/ThoughtsSection';
import { AboutContactSection } from './components/AboutContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { CharityProvider } from './context/CharityContext';
import { CharitySupportModal } from './components/CharitySupportModal';
import { Check, X } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h1 className="text-lg font-bold">Unable to load storefront view</h1>
            <p className="text-sm text-slate-600">{this.state.errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
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

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Navigation TopBar */}
      <TopBar
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onExploreStore={() => handleNavigate('store')}
          onOpenCalculator={() => handleNavigate('roi-calculator')}
        />

        {/* E-Commerce Storefront with All Accessories Showing Option */}
        <StoreSection />

        {/* Amazon Official Affiliate Showcase with Prime Badges */}
        <AmazonShowcaseSection />

        {/* Automated Affiliate Partner Deals & Monetization Hub */}
        <AffiliateHubSection />

        <RoiCalculator
          onSelectPlaybook={() => handleNavigate('blueprints')}
        />

        <PlaybooksSection />

        <TechGuidesSection />

        <ThoughtsSection />

        <AboutContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Post-Checkout Order Confirmation */}
      <OrderConfirmationModal />

      {/* Charity Support Modal */}
      <CharitySupportModal />

      {/* Floating System Toast */}
      {activeNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{activeNotification}</span>
          <button
            onClick={dismissNotification}
            className="text-slate-400 hover:text-white transition-colors p-0.5 ml-1"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <CharityProvider>
        <ProductsProvider>
          <CartProvider>
            <AffiliateProvider>
              <MainLayout />
            </AffiliateProvider>
          </CartProvider>
        </ProductsProvider>
      </CharityProvider>
    </AppErrorBoundary>
  );
}
