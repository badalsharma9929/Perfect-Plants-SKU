import {Injectable} from '@nestjs/common';
import {DiscountType, OfferType, TriggerType} from '@prisma/client';
import {assertShopDomain} from '../common/shopify.utils';
import {PrismaService} from '../prisma/prisma.service';
import {OfferMatchDto} from './dto/offer-match.dto';
import {DiscountsService} from './discounts.service';
import {RuleEngineService} from './rule-engine.service';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ruleEngine: RuleEngineService,
    private readonly discountsService: DiscountsService,
  ) {}

  async match(payload: OfferMatchDto) {
    const shop = assertShopDomain(payload.shop);
    const store = await this.prisma.store.findUnique({where: {shopDomain: shop}});

    if (!store) {
      return process.env.DEMO_MODE === 'true' ? this.demoOffer(payload) : {offer: null};
    }

    const campaigns = await this.prisma.campaign.findMany({
      where: {
        storeId: store.id,
        status: 'ACTIVE',
      },
      include: {rule: true, offer: true},
      orderBy: [{priority: 'desc'}, {updatedAt: 'desc'}],
    });

    const campaign = this.ruleEngine.chooseBest(campaigns, payload);
    if (!campaign?.offer) return process.env.DEMO_MODE === 'true' ? this.demoOffer(payload) : {offer: null};

    const discount = await this.discountsService.createDiscountForOffer(store, campaign, campaign.offer);
    return {
      offer: {
        campaignId: campaign.id,
        offerId: campaign.offer.id,
        offerType: campaign.offerType,
        product: {
          id: campaign.offer.offerProductId,
          variantId: campaign.offer.offerVariantId,
          handle: campaign.offer.offerProductHandle,
          title: campaign.offer.offerProductTitle,
          description: campaign.offer.offerDescription,
          image: campaign.offer.offerProductImage,
          price: Number(campaign.offer.offerPrice ?? 0),
          compareAtPrice: Number(campaign.offer.compareAtPrice ?? 0),
        },
        discount,
        content: {
          headline: campaign.offer.headline,
          subheadline: campaign.offer.subheadline,
          ctaText: campaign.offer.ctaText,
          urgencyText: campaign.offer.urgencyText,
          timerEnabled: campaign.offer.timerEnabled,
          timerMinutes: campaign.offer.timerMinutes,
        },
        design: {
          backgroundColor: campaign.offer.backgroundColor,
          borderRadius: campaign.offer.borderRadius,
          buttonStyle: campaign.offer.buttonStyle,
          showComparePrice: campaign.offer.showComparePrice,
          showTrustBadges: campaign.offer.showTrustBadges,
        },
        redirectUrl: discount.redirectUrl,
        analyticsToken: Buffer.from(`${campaign.id}:${payload.orderId ?? payload.checkoutToken ?? 'unknown'}`).toString(
          'base64url',
        ),
      },
    };
  }

  private demoOffer(payload: OfferMatchDto) {
    const code = payload.orderValue >= 2000 ? 'THANKYOU20' : 'THANKYOU15';
    return {
      offer: {
        campaignId: 'demo-ganesha-to-shiva',
        offerId: 'demo-shiva-dome',
        offerType: OfferType.SINGLE_PRODUCT,
        product: {
          id: 'gid://shopify/Product/222',
          variantId: 'gid://shopify/ProductVariant/333',
          handle: 'shiva-dome',
          title: 'Shiva Dome',
          description: 'A premium handcrafted spiritual dome curated as the natural companion to your order.',
          image:
            'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80',
          price: 1599,
          compareAtPrice: 1999,
        },
        discount: {
          code,
          type: DiscountType.PERCENTAGE,
          value: payload.orderValue >= 2000 ? 20 : 15,
          startsAt: new Date().toISOString(),
          endsAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          redirectUrl: `/products/shiva-dome?discount=${code}`,
        },
        content: {
          headline: 'Special Offer Unlocked',
          subheadline:
            'Because you just placed an order, you can now get this product at a private discounted price.',
          ctaText: 'Claim This Offer',
          urgencyText: 'Private thank-you price reserved for the next 15 minutes',
          timerEnabled: true,
          timerMinutes: 15,
        },
        design: {
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          buttonStyle: 'solid',
          showComparePrice: true,
          showTrustBadges: true,
        },
        redirectUrl: `/products/shiva-dome?discount=${code}`,
        analyticsToken: Buffer.from(`demo-ganesha-to-shiva:${payload.orderId ?? 'demo'}`).toString('base64url'),
      },
      matchedRule: {
        triggerType: payload.orderValue >= 2000 ? TriggerType.ORDER_VALUE : TriggerType.PRODUCT,
      },
    };
  }
}
