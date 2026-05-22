'use client';

import {useMemo} from 'react';

export function useApiClient(shopDomain = 'perfectplants.myshopify.com') {
  return useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

    return async function apiClient<Response>(path: string, init?: RequestInit) {
      const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          'X-Shop-Domain': shopDomain,
          ...init?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with ${response.status}`);
      }

      return response.json() as Promise<Response>;
    };
  }, [shopDomain]);
}
