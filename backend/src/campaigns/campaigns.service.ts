import {Injectable, NotFoundException} from '@nestjs/common';
import {CampaignStatus, Prisma} from '@prisma/client';
import {PrismaService} from '../prisma/prisma.service';
import {assertShopDomain} from '../common/shopify.utils';
import {CreateCampaignDto, UpdateCampaignDto} from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(shopDomain: string, filters: {search?: string; status?: string}) {
    const store = await this.resolveStore(shopDomain);
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        storeId: store.id,
        name: filters.search ? {contains: filters.search, mode: 'insensitive'} : undefined,
        status: this.toCampaignStatus(filters.status),
      },
      include: {
        rule: true,
        offer: true,
        _count: {
          select: {views: true, clicks: true, purchases: true},
        },
      },
      orderBy: [{priority: 'desc'}, {updatedAt: 'desc'}],
    });

    return Promise.all(
      campaigns.map(async (campaign) => {
        const revenue = await this.prisma.offerPurchase.aggregate({
          where: {campaignId: campaign.id},
          _sum: {revenue: true},
        });

        return {
          ...campaign,
          analytics: {
            views: campaign._count.views,
            clicks: campaign._count.clicks,
            purchases: campaign._count.purchases,
            revenue: Number(revenue._sum.revenue ?? 0),
            conversionRate: campaign._count.views
              ? Number(((campaign._count.purchases / campaign._count.views) * 100).toFixed(2))
              : 0,
          },
        };
      }),
    );
  }

  async create(shopDomain: string, dto: CreateCampaignDto) {
    const store = await this.resolveStore(shopDomain);
    return this.prisma.campaign.create({
      data: {
        storeId: store.id,
        name: dto.name,
        status: dto.status,
        triggerType: dto.triggerType,
        offerType: dto.offerType,
        priority: dto.priority ?? 0,
        rule: {create: this.ruleInput(dto.rule)},
        offer: {create: this.offerInput(dto.offer)},
      },
      include: {rule: true, offer: true},
    });
  }

  async update(shopDomain: string, id: string, dto: UpdateCampaignDto) {
    const store = await this.resolveStore(shopDomain);
    await this.ensureCampaign(store.id, id);

    return this.prisma.campaign.update({
      where: {id},
      data: {
        name: dto.name,
        status: dto.status,
        triggerType: dto.triggerType,
        offerType: dto.offerType,
        priority: dto.priority ?? 0,
        rule: {
          upsert: {
            create: this.ruleInput(dto.rule),
            update: this.ruleInput(dto.rule),
          },
        },
        offer: {
          upsert: {
            create: this.offerInput(dto.offer),
            update: this.offerInput(dto.offer),
          },
        },
      },
      include: {rule: true, offer: true},
    });
  }

  async duplicate(shopDomain: string, id: string) {
    const store = await this.resolveStore(shopDomain);
    const campaign = await this.prisma.campaign.findFirst({
      where: {id, storeId: store.id},
      include: {rule: true, offer: true},
    });
    if (!campaign || !campaign.offer) throw new NotFoundException('Campaign not found');

    return this.prisma.campaign.create({
      data: {
        storeId: store.id,
        name: `${campaign.name} copy`,
        status: 'DRAFT',
        triggerType: campaign.triggerType,
        offerType: campaign.offerType,
        priority: campaign.priority,
        rule: campaign.rule ? {create: this.stripSystemFields(campaign.rule)} : undefined,
        offer: {create: this.stripSystemFields(campaign.offer)},
      },
      include: {rule: true, offer: true},
    });
  }

  async delete(shopDomain: string, id: string) {
    const store = await this.resolveStore(shopDomain);
    await this.ensureCampaign(store.id, id);
    await this.prisma.campaign.update({
      where: {id},
      data: {status: 'ARCHIVED'},
    });
    return {ok: true};
  }

  private async resolveStore(shopDomain: string) {
    const shop = assertShopDomain(shopDomain);
    const store = await this.prisma.store.findUnique({where: {shopDomain: shop}});
    if (store) return store;

    if (process.env.DEMO_MODE === 'true') {
      return this.prisma.store.create({
        data: {
          shopDomain: shop,
          accessToken: 'dev-token',
          currency: 'INR',
        },
      });
    }

    throw new NotFoundException('Store is not installed');
  }

  private async ensureCampaign(storeId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({where: {id, storeId}});
    if (!campaign) throw new NotFoundException('Campaign not found');
  }

  private ruleInput(rule: CreateCampaignDto['rule']): Prisma.RuleUncheckedCreateWithoutCampaignInput {
    return {
      triggerProductId: rule?.triggerProductId,
      triggerCollectionId: rule?.triggerCollectionId,
      triggerProductTag: rule?.triggerProductTag,
      minOrderValue: rule?.minOrderValue,
      customerType: rule?.customerType,
      paymentType: rule?.paymentType,
    };
  }

  private offerInput(offer: CreateCampaignDto['offer']): Prisma.OfferUncheckedCreateWithoutCampaignInput {
    return {
      offerProductId: offer.offerProductId,
      offerVariantId: offer.offerVariantId,
      offerProductHandle: offer.offerProductHandle,
      offerProductTitle: offer.offerProductTitle,
      offerProductImage: offer.offerProductImage,
      offerDescription: offer.offerDescription,
      offerPrice: offer.offerPrice,
      compareAtPrice: offer.compareAtPrice,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      destinationType: offer.destinationType,
      destinationUrl: offer.destinationUrl,
      headline: offer.headline,
      subheadline: offer.subheadline,
      ctaText: offer.ctaText,
      urgencyText: offer.urgencyText,
      timerEnabled: offer.timerEnabled,
      timerMinutes: offer.timerMinutes,
      backgroundColor: offer.backgroundColor,
      borderRadius: offer.borderRadius,
      buttonStyle: offer.buttonStyle,
      showComparePrice: offer.showComparePrice,
      showTrustBadges: offer.showTrustBadges,
    };
  }

  private stripSystemFields<T extends {id: string; createdAt: Date; updatedAt?: Date; campaignId?: string}>(record: T) {
    const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, campaignId: _campaignId, ...data} = record;
    return data;
  }

  private toCampaignStatus(status?: string) {
    if (!status) return undefined;
    return Object.values(CampaignStatus).includes(status as CampaignStatus) ? (status as CampaignStatus) : undefined;
  }
}
