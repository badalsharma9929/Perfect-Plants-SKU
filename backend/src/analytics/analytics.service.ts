import {Injectable} from '@nestjs/common';
import {assertShopDomain} from '../common/shopify.utils';
import {PrismaService} from '../prisma/prisma.service';
import {AnalyticsEventDto} from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackImpression(dto: AnalyticsEventDto) {
    const store = await this.findStore(dto.shop);
    if (!store) return {ok: true, skipped: true};

    await this.prisma.offerView.create({
      data: {
        storeId: store.id,
        campaignId: dto.campaignId,
        orderId: dto.orderId,
        checkoutToken: dto.checkoutToken,
        customerType: dto.customerType,
      },
    });

    return {ok: true};
  }

  async trackClick(dto: AnalyticsEventDto) {
    const store = await this.findStore(dto.shop);
    if (!store) return {ok: true, skipped: true};

    await this.prisma.offerClick.create({
      data: {
        storeId: store.id,
        campaignId: dto.campaignId,
        orderId: dto.orderId,
        checkoutToken: dto.checkoutToken,
        redirectUrl: dto.redirectUrl,
      },
    });

    return {ok: true};
  }

  async trackPurchase(dto: AnalyticsEventDto) {
    const store = await this.findStore(dto.shop);
    if (!store || !dto.orderId || !dto.revenue) return {ok: true, skipped: true};

    await this.prisma.offerPurchase.create({
      data: {
        storeId: store.id,
        campaignId: dto.campaignId,
        orderId: dto.orderId,
        revenue: dto.revenue,
        currency: dto.currency ?? store.currency ?? 'INR',
        discountCode: dto.discountCode,
      },
    });

    return {ok: true};
  }

  async summary(shop: string) {
    const store = await this.findStore(shop);
    if (!store) {
      return {
        revenue: 0,
        views: 0,
        clicks: 0,
        purchases: 0,
        conversionRate: 0,
        campaigns: [],
      };
    }

    const [views, clicks, purchases, revenue, campaigns] = await Promise.all([
      this.prisma.offerView.count({where: {storeId: store.id}}),
      this.prisma.offerClick.count({where: {storeId: store.id}}),
      this.prisma.offerPurchase.count({where: {storeId: store.id}}),
      this.prisma.offerPurchase.aggregate({where: {storeId: store.id}, _sum: {revenue: true}}),
      this.prisma.campaign.findMany({
        where: {storeId: store.id},
        include: {
          offer: true,
          _count: {select: {views: true, clicks: true, purchases: true}},
        },
        orderBy: {updatedAt: 'desc'},
        take: 10,
      }),
    ]);

    return {
      revenue: Number(revenue._sum.revenue ?? 0),
      views,
      clicks,
      purchases,
      conversionRate: views ? Number(((purchases / views) * 100).toFixed(2)) : 0,
      campaigns: campaigns.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        offerProduct: campaign.offer?.offerProductTitle,
        views: campaign._count.views,
        clicks: campaign._count.clicks,
        purchases: campaign._count.purchases,
      })),
    };
  }

  private async findStore(inputShop: string) {
    const shop = assertShopDomain(inputShop);
    return this.prisma.store.findUnique({where: {shopDomain: shop}});
  }
}
