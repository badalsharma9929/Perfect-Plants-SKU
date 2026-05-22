import {createHmac, randomBytes, timingSafeEqual} from 'node:crypto';

export function assertShopDomain(shop: string | undefined): string {
  if (!shop || !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop)) {
    throw new Error('Invalid Shopify shop domain');
  }

  return shop.toLowerCase();
}

export function getAppBaseUrl() {
  return process.env.BACKEND_URL ?? process.env.APP_URL ?? 'http://localhost:4000';
}

export function buildShopifyAdminUrl(shop: string, path: string) {
  return `https://${shop}/admin/${path.replace(/^\//, '')}`;
}

export function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyShopifyQueryHmac(query: Record<string, unknown>, secret: string) {
  const hmac = String(query.hmac ?? '');
  const message = Object.entries(query)
    .filter(([key]) => key !== 'hmac' && key !== 'signature')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : String(value)}`)
    .join('&');

  const digest = createHmac('sha256', secret).update(message).digest('hex');
  return safeCompare(digest, hmac);
}

export function verifyShopifyWebhookHmac(rawBody: Buffer, hmacHeader: string | undefined, secret: string) {
  if (!hmacHeader) return false;
  const digest = createHmac('sha256', secret).update(rawBody).digest('base64');
  return safeCompare(digest, hmacHeader);
}

export function createSignedState(shop: string, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({
      shop,
      nonce: randomBytes(12).toString('hex'),
      ts: Date.now(),
    }),
  ).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySignedState(state: string, shop: string, secret: string) {
  const [payload, signature] = state.split('.');
  if (!payload || !signature) return false;

  const expectedSignature = createHmac('sha256', secret).update(payload).digest('base64url');
  if (!safeCompare(expectedSignature, signature)) return false;

  const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
    shop: string;
    ts: number;
  };

  const isFresh = Date.now() - parsed.ts < 10 * 60 * 1000;
  return parsed.shop === shop && isFresh;
}

export function productGidFromAny(value: string | number | undefined) {
  if (value === undefined || value === null) return undefined;
  const raw = String(value);
  return raw.startsWith('gid://') ? raw : `gid://shopify/Product/${raw}`;
}

export function variantIdForCart(value: string | null | undefined) {
  if (!value) return undefined;
  return value.split('/').at(-1);
}

export function appendDiscountToUrl(url: string, code: string) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}discount=${encodeURIComponent(code)}`;
}
