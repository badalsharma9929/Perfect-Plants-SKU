export type CampaignBuilderPayload = {
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  triggerType: 'PRODUCT' | 'COLLECTION' | 'PRODUCT_TAG' | 'ORDER_VALUE' | 'CUSTOMER_TYPE';
  offerType: 'SINGLE_PRODUCT' | 'BUNDLE' | 'COLLECTION_REDIRECT' | 'MYSTERY';
};

export function normalizeCampaignName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}
