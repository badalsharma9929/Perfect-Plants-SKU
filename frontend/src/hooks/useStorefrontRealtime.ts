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

export type StorefrontRealtimeStats = {
  productViews: number;
  cartAdds: number;
  checkouts: number;
  campaignRevenue: number;
  bundleRevenue: number;
  netLiftProfit: number;
  lastOrderValue: number;
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
  events: [],
};

function readStats() {
  if (typeof window === 'undefined') return initialStats;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialStats;
    return {...initialStats, ...(JSON.parse(raw) as Partial<StorefrontRealtimeStats>)};
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
    (orderValue: number, bundleValue: number, productName: string) => {
      const current = readStats();
      const nextCampaignRevenue = current.campaignRevenue + orderValue;
      publish({
        ...current,
        checkouts: current.checkouts + 1,
        campaignRevenue: nextCampaignRevenue,
        bundleRevenue: current.bundleRevenue + bundleValue,
        netLiftProfit: Math.round(nextCampaignRevenue * 0.24),
        lastOrderValue: orderValue,
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
