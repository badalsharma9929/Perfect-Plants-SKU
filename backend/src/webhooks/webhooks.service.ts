import {Injectable} from '@nestjs/common';
import {assertShopDomain} from '../common/shopify.utils';
import {PrismaService} from '../prisma/prisma.service';

type ShopifyOrderWebhook = {
  id?: number;
  name?: string;
  total_price?: string;
  currency?: string;
  discount_codes?: Array<{code: string}>;
};

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async appUninstalled(inputShop: string) {
    const shop = assertShopDomain(inputShop);
    const store = await this.prisma.store.findUnique({where: {shopDomain: shop}});
    if (!store) return {ok: true};

    await this.prisma.$transaction([
      this.prisma.campaign.updateMany({
        where: {storeId: store.id},
        data: {status: 'ARCHIVED'},
      }),
      this.prisma.store.update({
        where: {id: store.id},
        data: {uninstalledAt: new Date(), accessToken: ''},
      }),
    ]);

    return {ok: true};
  }

  async ordersCreate(_inputShop: string, _payload: ShopifyOrderWebhook) {
    return {ok: true};
  }

  async ordersPaid(inputShop: string, payload: ShopifyOrderWebhook) {
    const shop = assertShopDomain(inputShop);
    const store = await this.prisma.store.findUnique({where: {shopDomain: shop}});
    const code = payload.discount_codes?.[0]?.code;
    if (!store || !code || !payload.id) return {ok: true};

    const discount = await this.prisma.discount.findFirst({
      where: {storeId: store.id, code},
      include: {campaign: true},
    });
    if (!discount) return {ok: true};

    await this.prisma.offerPurchase.create({
      data: {
        storeId: store.id,
        campaignId: discount.campaignId,
        orderId: String(payload.id),
        revenue: Number(payload.total_price ?? 0),
        currency: payload.currency ?? store.currency ?? 'INR',
        discountCode: code,
      },
    });

    return {ok: true};
  }
}
