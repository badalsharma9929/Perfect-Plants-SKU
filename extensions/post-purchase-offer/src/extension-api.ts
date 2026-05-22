import type {AnalyticsPayload, MatchOfferResponse} from './types';

export function resolveApiUrl(settings: Record<string, unknown> | undefined) {
  const configured = typeof settings?.api_url === 'string' ? settings.api_url.trim() : '';
  return configured || 'https://your-app-domain.com';
}

export async function postJson<Response>(
  url: string,
  token: string | undefined,
  payload: Record<string, unknown>,
): Promise<Response> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<Response>;
}

export function matchOffer(apiUrl: string, token: string | undefined, payload: Record<string, unknown>) {
  return postJson<MatchOfferResponse>(`${apiUrl}/offers/match`, token, payload);
}

export function trackImpression(apiUrl: string, token: string | undefined, payload: AnalyticsPayload) {
  return postJson(`${apiUrl}/analytics/impression`, token, payload);
}

export function trackClick(apiUrl: string, token: string | undefined, payload: AnalyticsPayload) {
  return postJson(`${apiUrl}/analytics/click`, token, payload);
}
