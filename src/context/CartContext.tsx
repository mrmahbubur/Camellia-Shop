import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/shopData';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'BDT';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PlacedOrder {
  orderId: string;
  date: string;
  customerName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: Currency;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;
  couponCode: string;
  discountPercent: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotalUSD: number;
  discountUSD: number;
  shippingUSD: number;
  totalUSD: number;
  freeShippingThresholdUSD: number;
  freeShippingProgress: number;
  placedOrder: PlacedOrder | null;
  setPlacedOrder: (order: PlacedOrder | null) => void;
  orderHistory: PlacedOrder[];
  recordPlacedOrder: (order: PlacedOrder) => void;
  removeSavedOrder: (orderId: string) => void;
  activeNotification: string | null;
  dismissNotification: () => void;
  showNotification: (msg: string) => void;
}

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; prefix: boolean }> = {
  USD: { symbol: '$', rate: 1.0, prefix: true },
  EUR: { symbol: '€', rate: 0.92, prefix: true },
  GBP: { symbol: '£', rate: 0.79, prefix: true },
  BDT: { symbol: '৳', rate: 121.5, prefix: false }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mrs_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [orderHistory, setOrderHistory] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('mrs_order_history');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('mrs_currency') as Currency | null;
      return saved && CURRENCY_RATES[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mrs_cart', JSON.stringify(cart));
    } catch {
      // Storage unavailable in private mode
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('mrs_order_history', JSON.stringify(orderHistory));
    } catch {
      // Storage unavailable
    }
  }, [orderHistory]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('mrs_currency', c);
    } catch {
      // Storage unavailable
    }
  };

  const recordPlacedOrder = (order: PlacedOrder) => {
    setOrderHistory((prev) => [order, ...prev].slice(0, 20));
    setPlacedOrder(order);
  };

  const removeSavedOrder = (orderId: string) => {
    setOrderHistory((prev) => prev.filter((o) => o.orderId !== orderId));
  };

  const showNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const dismissNotification = () => setActiveNotification(null);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added "${product.title}" to your bag`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification('Item removed from bag');
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'MRSLAUNCH') {
      setCouponCode('MRSLAUNCH');
      setDiscountPercent(15);
      showNotification('Coupon MRSLAUNCH applied: 15% discount');
      return { success: true, message: '15% discount applied successfully!' };
    } else if (trimmed === 'SHAHIN10') {
      setCouponCode('SHAHIN10');
      setDiscountPercent(10);
      showNotification('Coupon SHAHIN10 applied: 10% discount');
      return { success: true, message: '10% discount applied successfully!' };
    } else {
      return { success: false, message: 'Invalid promotional code. Try MRSLAUNCH' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    showNotification('Promotional code removed');
  };

  const formatPrice = (usdAmount: number): string => {
    const config = CURRENCY_RATES[currency];
    const converted = Math.round(usdAmount * config.rate);
    return config.prefix
      ? `${config.symbol}${converted}`
      : `${converted} ${config.symbol}`;
  };

  const subtotalUSD = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountUSD = Math.round((subtotalUSD * discountPercent) / 100);
  const freeShippingThresholdUSD = 50;
  const isFreeShipping = subtotalUSD >= freeShippingThresholdUSD || subtotalUSD === 0;
  const shippingUSD = isFreeShipping ? 0 : 9;
  const totalUSD = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotalUSD / freeShippingThresholdUSD) * 100)
  );

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
        formatPrice,
        couponCode,
        discountPercent,
        applyCoupon,
        removeCoupon,
        subtotalUSD,
        discountUSD,
        shippingUSD,
        totalUSD,
        freeShippingThresholdUSD,
        freeShippingProgress,
        placedOrder,
        setPlacedOrder,
        orderHistory,
        recordPlacedOrder,
        removeSavedOrder,
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
