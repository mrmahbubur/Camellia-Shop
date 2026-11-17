import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'BDT';

export interface SavedItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: SavedItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  bdtRate: number;
  toUsdAmount: (usdFallback: number, nativePrice?: number, nativeCurrency?: 'USD' | 'BDT') => number;
  formatPrice: (usdAmount: number, nativePrice?: number, nativeCurrency?: 'USD' | 'BDT') => string;
  subtotalUSD: number;
  activeNotification: string | null;
  dismissNotification: () => void;
  showNotification: (msg: string) => void;
}

const CURRENCY_META: Record<Currency, { symbol: string; prefix: boolean }> = {
  USD: { symbol: '$', prefix: true },
  EUR: { symbol: '€', prefix: true },
  GBP: { symbol: '£', prefix: true },
  BDT: { symbol: '৳', prefix: false }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem('mrs_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    BDT: 121.5
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('mrs_currency') as Currency | null;
      return saved && CURRENCY_META[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  useEffect(() => {
    const isGitHubPages =
      typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

    const loadDirectRates = () =>
      fetch('https://open.er-api.com/v6/latest/USD')
        .then((res) => (res.ok ? res.json() : null))
        .then((payload) => {
          if (payload?.result === 'success' && payload?.rates) {
            setExchangeRates({
              USD: 1,
              EUR: Number(payload.rates.EUR) || 0.92,
              GBP: Number(payload.rates.GBP) || 0.79,
              BDT: Number(payload.rates.BDT) || 121.5
            });
          }
        })
        .catch(() => {
          // Keep initial rates if unreachable
        });

    if (isGitHubPages) {
      loadDirectRates();
      return;
    }

    fetch('/api/rates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rates) {
          setExchangeRates({
            USD: 1,
            EUR: Number(data.rates.EUR) || 0.92,
            GBP: Number(data.rates.GBP) || 0.79,
            BDT: Number(data.rates.BDT) || 121.5
          });
          return;
        }
        return loadDirectRates();
      })
      .catch(() => loadDirectRates());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mrs_cart', JSON.stringify(cart));
    } catch {
      // Storage unavailable
    }
  }, [cart]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('mrs_currency', c);
    } catch {
      // Storage unavailable
    }
  };

  const showNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const dismissNotification = () => setActiveNotification(null);

  const bdtRate = exchangeRates.BDT || 121.5;

  const toUsdAmount = (
    usdFallback: number,
    nativePrice?: number,
    nativeCurrency?: 'USD' | 'BDT'
  ): number => {
    if (nativeCurrency === 'BDT' && typeof nativePrice === 'number') {
      return nativePrice > 0 ? nativePrice / bdtRate : 0;
    }
    return usdFallback;
  };

  const addToCart = (product: Product, quantity = 1) => {
    const normalizedPrice = toUsdAmount(
      product.price,
      product.nativePrice,
      product.nativeCurrency
    );
    const normalizedProduct: Product = { ...product, price: normalizedPrice };

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, product: normalizedProduct, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product: normalizedProduct, quantity }];
    });
    showNotification(`Saved "${product.title}" to your list`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is SavedItem => item !== null)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification('Item removed from saved list');
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalUSD = cart.reduce(
    (sum, item) =>
      sum +
      toUsdAmount(item.product.price, item.product.nativePrice, item.product.nativeCurrency) *
        item.quantity,
    0
  );

  const formatPrice = (
    usdAmount: number,
    nativePrice?: number,
    nativeCurrency?: 'USD' | 'BDT'
  ): string => {
    const meta = CURRENCY_META[currency];

    if (nativeCurrency === 'BDT' && typeof nativePrice === 'number') {
      if (nativePrice <= 0) return 'Check Live Price';
      if (currency === 'BDT') {
        return `${Math.round(nativePrice).toLocaleString('en-US')} ${meta.symbol}`;
      }
      const usdEquiv = nativePrice / bdtRate;
      const converted = usdEquiv * (exchangeRates[currency] || 1);
      const formatted = converted.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return meta.prefix ? `${meta.symbol}${formatted}` : `${formatted} ${meta.symbol}`;
    }

    const rate = exchangeRates[currency] || 1;
    const raw = usdAmount * rate;
    if (currency === 'BDT') {
      const rounded = Math.round(raw).toLocaleString('en-US');
      return `${rounded} ${meta.symbol}`;
    }
    const formatted = raw.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return meta.prefix ? `${meta.symbol}${formatted}` : `${formatted} ${meta.symbol}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        currency,
        setCurrency,
        bdtRate,
        toUsdAmount,
        formatPrice,
        subtotalUSD,
        activeNotification,
        dismissNotification,
        showNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
