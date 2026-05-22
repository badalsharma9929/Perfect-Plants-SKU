import {Injectable} from '@nestjs/common';
import {Campaign, Offer, Rule} from '@prisma/client';
import {productGidFromAny} from '../common/shopify.utils';
import {OfferMatchDto} from './dto/offer-match.dto';

type CampaignWithRule = Campaign & {rule: Rule | null; offer: Offer | null};

@Injectable()
export class RuleEngineService {
  chooseBest(campaigns: CampaignWithRule[], payload: OfferMatchDto) {
    const now = new Date();
    return campaigns
      .filter((campaign) => campaign.offer)
      .filter((campaign) => !campaign.startsAt || campaign.startsAt <= now)
      .filter((campaign) => !campaign.endsAt || campaign.endsAt >= now)
      .filter((campaign) => this.matches(campaign, payload))
      .sort((left, right) => right.priority - left.priority || right.updatedAt.getTime() - left.updatedAt.getTime())[0];
  }

  matches(campaign: CampaignWithRule, payload: OfferMatchDto) {
    const rule = campaign.rule;
    if (!rule) return true;

    const normalizedProducts = new Set(payload.products.map((product) => productGidFromAny(product)).filter(Boolean));
    const normalizedCollections = new Set((payload.collections ?? []).map(String));
    const normalizedTags = new Set((payload.productTags ?? []).map((tag) => tag.toLowerCase()));

    if (rule.triggerProductId && !normalizedProducts.has(productGidFromAny(rule.triggerProductId))) {
      return false;
    }

    if (rule.triggerCollectionId && !normalizedCollections.has(String(rule.triggerCollectionId))) {
      return false;
    }

    if (rule.triggerProductTag && !normalizedTags.has(rule.triggerProductTag.toLowerCase())) {
      return false;
    }

    if (rule.minOrderValue && payload.orderValue < Number(rule.minOrderValue)) {
      return false;
    }

    if (rule.customerType && payload.customerType && rule.customerType !== payload.customerType) {
      return false;
    }

    if (rule.paymentType && payload.paymentType && rule.paymentType !== payload.paymentType) {
      return false;
    }

    return true;
  }
}
