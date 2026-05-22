export type MatchOfferResponse = {
  offer: null | {
    campaignId: string;
    offerId: string;
    offerType: string;
    product: {
      id: string;
      variantId?: string;
      handle?: string;
      title: string;
      description?: string;
      image?: string;
      price: number;
      compareAtPrice?: number;
    };
    discount: {
      code: string;
      type: string;
      value: number;
      startsAt: string;
      endsAt?: string;
      redirectUrl: string;
    };
    content: {
      headline: string;
      subheadline: string;
      ctaText: string;
      urgencyText?: string;
      timerEnabled: boolean;
      timerMinutes: number;
    };
    design: {
      showComparePrice: boolean;
      showTrustBadges: boolean;
    };
    redirectUrl: string;
    analyticsToken: string;
  };
};

export type AnalyticsPayload = {
  shop: string;
  campaignId: string;
  orderId?: string;
  checkoutToken?: string;
  customerType?: string;
  redirectUrl?: string;
};
