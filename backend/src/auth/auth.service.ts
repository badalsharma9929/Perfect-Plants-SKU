import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {
  assertShopDomain,
  buildShopifyAdminUrl,
  createSignedState,
  getAppBaseUrl,
  verifyShopifyQueryHmac,
  verifySignedState,
} from '../common/shopify.utils';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  createInstallUrl(inputShop: string) {
    const shop = assertShopDomain(inputShop);
    const secret = this.requireEnv('SHOPIFY_API_SECRET');
    const clientId = this.requireEnv('SHOPIFY_API_KEY');
    const scopes = process.env.SHOPIFY_APP_SCOPES ?? 'read_products,read_orders,write_discounts,read_discounts';
    const redirectUri = `${getAppBaseUrl()}/auth/callback`;
    const state = createSignedState(shop, secret);

    const params = new URLSearchParams({
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
      state,
      'grant_options[]': '',
    });

    return buildShopifyAdminUrl(shop, `oauth/authorize?${params.toString()}`);
  }

  async completeInstall(query: Record<string, string>) {
    const shop = assertShopDomain(query.shop);
    const secret = this.requireEnv('SHOPIFY_API_SECRET');

    if (!verifyShopifyQueryHmac(query, secret)) {
      throw new UnauthorizedException('Invalid Shopify OAuth HMAC');
    }

    if (!query.state || !verifySignedState(query.state, shop, secret)) {
      throw new UnauthorizedException('Invalid Shopify OAuth state');
    }

    const accessToken = await this.exchangeCodeForAccessToken(shop, query.code);

    await this.prisma.store.upsert({
      where: {shopDomain: shop},
      create: {
        shopDomain: shop,
        accessToken,
        installedAt: new Date(),
        uninstalledAt: null,
      },
      update: {
        accessToken,
        installedAt: new Date(),
        uninstalledAt: null,
      },
    });

    await this.registerWebhooks(shop, accessToken);

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    return `${frontendUrl}?shop=${encodeURIComponent(shop)}`;
  }

  private async exchangeCodeForAccessToken(shop: string, code: string | undefined) {
    if (!code) throw new UnauthorizedException('Missing OAuth code');

    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        client_id: this.requireEnv('SHOPIFY_API_KEY'),
        client_secret: this.requireEnv('SHOPIFY_API_SECRET'),
        code,
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException(`Shopify token exchange failed with ${response.status}`);
    }

    const body = (await response.json()) as {access_token?: string};
    if (!body.access_token) throw new UnauthorizedException('Shopify did not return an access token');
    return body.access_token;
  }

  private async registerWebhooks(shop: string, accessToken: string) {
    const topics = ['APP_UNINSTALLED', 'ORDERS_CREATE', 'ORDERS_PAID'];
    const apiVersion = process.env.SHOPIFY_API_VERSION ?? '2026-04';
    const endpointByTopic: Record<string, string> = {
      APP_UNINSTALLED: `${getAppBaseUrl()}/webhooks/app/uninstalled`,
      ORDERS_CREATE: `${getAppBaseUrl()}/webhooks/orders/create`,
      ORDERS_PAID: `${getAppBaseUrl()}/webhooks/orders/paid`,
    };

    await Promise.all(
      topics.map(async (topic) => {
        const mutation = `
          mutation WebhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
            webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
              webhookSubscription { id }
              userErrors { field message }
            }
          }
        `;

        await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
          body: JSON.stringify({
            query: mutation,
            variables: {
              topic,
              webhookSubscription: {
                callbackUrl: endpointByTopic[topic],
                format: 'JSON',
              },
            },
          }),
        });
      }),
    );
  }

  private requireEnv(name: string) {
    const value = process.env[name];
    if (!value) throw new Error(`Missing ${name}`);
    return value;
  }
}
