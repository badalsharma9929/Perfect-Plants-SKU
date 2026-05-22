import {Injectable} from '@nestjs/common';
import {Campaign, DiscountType, Offer, Store} from '@prisma/client';
import {randomUUID} from 'node:crypto';
import {appendDiscountToUrl, variantIdForCart} from '../common/shopify.utils';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class DiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDiscountForOffer(store: Store, campaign: Campaign, offer: Offer) {
    const code = this.buildCode(campaign.name);
    const startsAt = new Date();
    const endsAt = offer.timerEnabled
      ? new Date(Date.now() + offer.timerMinutes * 60 * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    let shopifyId: string | undefined;
    if (store.accessToken !== 'dev-token' && process.env.DEMO_MODE !== 'true') {
      shopifyId = await this.createShopifyDiscountCode(store, campaign, offer, code, startsAt, endsAt);
    }

    const discount = await this.prisma.discount.create({
      data: {
        storeId: store.id,
        campaignId: campaign.id,
        offerId: offer.id,
        code,
        shopifyId,
        type: offer.discountType,
        value: offer.discountValue,
        startsAt,
        endsAt,
        usageLimit: 1,
      },
    });

    return {
      code: discount.code,
      type: discount.type,
      value: Number(discount.value),
      startsAt,
      endsAt,
      redirectUrl: this.buildDestinationUrl(offer, discount.code),
    };
  }

  private async createShopifyDiscountCode(
    store: Store,
    campaign: Campaign,
    offer: Offer,
    code: string,
    startsAt: Date,
    endsAt: Date,
  ) {
    if (offer.discountType === DiscountType.FREE_SHIPPING || offer.discountType === DiscountType.BUY_X_GET_Y) {
      return undefined;
    }

    const apiVersion = process.env.SHOPIFY_API_VERSION ?? '2026-04';
    const percentage = offer.discountType === DiscountType.PERCENTAGE ? Number(offer.discountValue) / 100 : undefined;
    const amount = offer.discountType === DiscountType.FIXED_AMOUNT ? Number(offer.discountValue).toFixed(2) : undefined;

    const mutation = `
      mutation DiscountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(`https://${store.shopDomain}/admin/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': store.accessToken,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          basicCodeDiscount: {
            title: `${campaign.name} - Thank You Offer`,
            code,
            startsAt: startsAt.toISOString(),
            endsAt: endsAt.toISOString(),
            usageLimit: 1,
            appliesOncePerCustomer: true,
            customerSelection: {all: true},
            customerGets: {
              value: percentage
                ? {percentage}
                : {
                    discountAmount: {
                      amount,
                      appliesOnEachItem: false,
                    },
                  },
              items: {
                products: {
                  productsToAdd: [offer.offerProductId],
                },
              },
            },
            combinesWith: {
              orderDiscounts: false,
              productDiscounts: false,
              shippingDiscounts: false,
            },
          },
        },
      }),
    });

    const body = (await response.json()) as {
      data?: {discountCodeBasicCreate?: {codeDiscountNode?: {id?: string}; userErrors?: Array<{message: string}>}};
    };
    const errors = body.data?.discountCodeBasicCreate?.userErrors ?? [];
    if (errors.length) {
      throw new Error(errors.map((error) => error.message).join(', '));
    }

    return body.data?.discountCodeBasicCreate?.codeDiscountNode?.id;
  }

  private buildDestinationUrl(offer: Offer, code: string) {
    if (offer.destinationType === 'CART') {
      const variantId = variantIdForCart(offer.offerVariantId);
      return appendDiscountToUrl(`/cart/${variantId ?? ''}:1`, code);
    }

    if (offer.destinationType === 'LANDING_PAGE' && offer.destinationUrl) {
      return appendDiscountToUrl(offer.destinationUrl, code);
    }

    const handle = offer.offerProductHandle ?? offer.offerProductId.split('/').at(-1);
    return appendDiscountToUrl(`/products/${handle}`, code);
  }

  private buildCode(campaignName: string) {
    const prefix = campaignName
      .replace(/[^a-zA-Z0-9]+/g, '')
      .slice(0, 10)
      .toUpperCase();
    return `TY-${prefix || 'OFFER'}-${randomUUID().slice(0, 8).toUpperCase()}`;
  }
}
