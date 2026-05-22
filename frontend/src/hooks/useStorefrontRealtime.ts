'use client';

import {useCallback, useEffect, useState} from 'react';

const STORAGE_KEY = 'ppre-storefront-realtime-v1';
const CHANNEL_NAME = 'ppre-storefront-realtime';

export type StorefrontEvent = {
  id: string;
  type: 'view' | 'cart' | 'checkout';
  message: string;
  value: number;
  createdAt: string;
};

export type StorefrontCheckoutItem = {
  productId: string;
  productName: string;
  category: string;
  sectionId: string;
  quantity: number;
  lineRevenue: number;
  bundleValue: number;
  bundleSelected: boolean;
  companionName?: string;
};

export type StorefrontProductPerformance = {
  productId: string;
  productName: string;
  category: string;
  sectionId: string;
  quantity: number;
  revenue: number;
  bundleRevenue: number;
  orders: number;
  lastPurchasedAt: string;
};

export type StorefrontOrder = {
  id: string;
  total: number;
  bundleValue: number;
  primaryProduct: string;
  products: StorefrontCheckoutItem[];
  createdAt: string;
};

export type StorefrontRealtimeStats = {
  productViews: number;
  cartAdds: number;
  checkouts: number;
  campaignRevenue: number;
  bundleRevenue: number;
  netLiftProfit: number;
  lastOrderValue: number;
  purchasedProducts: StorefrontProductPerformance[];
  recentOrders: StorefrontOrder[];
  events: StorefrontEvent[];
};

const initialStats: StorefrontRealtimeStats = {
  productViews: 0,
  cartAdds: 0,
  checkouts: 0,
  campaignRevenue: 0,
  bundleRevenue: 0,
  netLiftProfit: 0,
  lastOrderValue: 0,
  purchasedProducts: [],
  recentOrders: [],
  events: [],
};

function normalizeStats(value: Partial<StorefrontRealtimeStats>): StorefrontRealtimeStats {
  return {
    ...initialStats,
    ...value,
    events: Array.isArray(value.events) ? value.events : [],
    purchasedProducts: Array.isArray(value.purchasedProducts) ? value.purchasedProducts : [],
    recentOrders: Array.isArray(value.recentOrders) ? value.recentOrders : [],
  };
}

function readStats(): StorefrontRealtimeStats {
  if (typeof window === 'undefined') return initialStats;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialStats;
    return normalizeStats(JSON.parse(raw) as Partial<StorefrontRealtimeStats>);
  } catch {
    return initialStats;
  }
}

function writeStats(stats: StorefrontRealtimeStats) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function makeEvent(type: StorefrontEvent['type'], message: string, value: number): StorefrontEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    message,
    value,
    createdAt: new Date().toISOString(),
  };
}

function summarizePurchasedProducts(
  currentProducts: StorefrontProductPerformance[],
  checkoutItems: StorefrontCheckoutItem[],
  createdAt: string,
) {
  const productMap = new Map(currentProducts.map((product) => [product.productId, {...product}]));

  checkoutItems.forEach((item) => {
    const existing = productMap.get(item.productId);
    productMap.set(item.productId, {
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      sectionId: item.sectionId,
      quantity: (existing?.quantity ?? 0) + item.quantity,
      revenue: (existing?.revenue ?? 0) + item.lineRevenue,
      bundleRevenue: (existing?.bundleRevenue ?? 0) + item.bundleValue,
      orders: (existing?.orders ?? 0) + 1,
      lastPurchasedAt: createdAt,
    });
  });

  return Array.from(productMap.values())
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 12);
}

export function useStorefrontRealtime() {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    setStats(readStats());
    const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

    function syncFromStorage() {
      setStats(readStats());
    }

    function syncFromBroadcast(event: MessageEvent<StorefrontRealtimeStats>) {
      setStats(event.data);
    }

    window.addEventListener('storage', syncFromStorage);
    channel?.addEventListener('message', syncFromBroadcast);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      channel?.removeEventListener('message', syncFromBroadcast);
      channel?.close();
    };
  }, []);

  const publish = useCallback((nextStats: StorefrontRealtimeStats) => {
    writeStats(nextStats);
    setStats(nextStats);

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(nextStats);
      channel.close();
    }
  }, []);

  const trackProductView = useCallback(
    (productName: string) => {
      const current = readStats();
      publish({
        ...current,
        productViews: current.productViews + 1,
        events: [makeEvent('view', `${productName} product page viewed`, 0), ...current.events].slice(0, 8),
      });
    },
    [publish],
  );

  const trackCartAdd = useCallback(
    (productName: string, value: number) => {
      const current = readStats();
      publish({
        ...current,
        cartAdds: current.cartAdds + 1,
        events: [makeEvent('cart', `${productName} added to cart`, value), ...current.events].slice(0, 8),
      });
    },
    [publish],
  );

  const trackCheckout = useCallback(
    (
      orderValue: number,
      bundleValue: number,
      productName: string,
      checkoutItems: StorefrontCheckoutItem[] = [],
    ) => {
      const current = readStats();
      const nextCampaignRevenue = current.campaignRevenue + orderValue;
      const createdAt = new Date().toISOString();
      const safeCheckoutItems = checkoutItems.length
        ? checkoutItems
        : [
            {
              productId: productName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              productName,
              category: 'Storefront',
              sectionId: 'storefront',
              quantity: 1,
              lineRevenue: orderValue,
              bundleValue,
              bundleSelected: bundleValue > 0,
            },
          ];

      publish({
        ...current,
        checkouts: current.checkouts + 1,
        campaignRevenue: nextCampaignRevenue,
        bundleRevenue: current.bundleRevenue + bundleValue,
        netLiftProfit: Math.round(nextCampaignRevenue * 0.24),
        lastOrderValue: orderValue,
        purchasedProducts: summarizePurchasedProducts(
          current.purchasedProducts,
          safeCheckoutItems,
          createdAt,
        ),
        recentOrders: [
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            total: orderValue,
            bundleValue,
            primaryProduct: productName,
            products: safeCheckoutItems,
            createdAt,
          },
          ...current.recentOrders,
        ].slice(0, 12),
        events: [makeEvent('checkout', `${productName} checkout completed`, orderValue), ...current.events].slice(0, 8),
      });
    },
    [publish],
  );

  const resetStats = useCallback(() => {
    publish(initialStats);
  }, [publish]);

  return {stats, trackProductView, trackCartAdd, trackCheckout, resetStats};
}
