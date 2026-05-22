import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.upsert({
    where: {shopDomain: 'perfectplants.myshopify.com'},
    create: {
      shopDomain: 'perfectplants.myshopify.com',
      accessToken: 'dev-token',
      currency: 'INR',
    },
    update: {},
  });

  const campaign = await prisma.campaign.upsert({
    where: {id: 'demo-ganesha-to-shiva'},
    create: {
      id: 'demo-ganesha-to-shiva',
      storeId: store.id,
      name: 'Ganesha Dome to Shiva Dome',
      status: 'ACTIVE',
      triggerType: 'PRODUCT',
      offerType: 'SINGLE_PRODUCT',
      priority: 20,
      rule: {
        create: {
          triggerProductId: 'gid://shopify/Product/111',
          minOrderValue: 0,
          customerType: 'first_time',
        },
      },
      offer: {
        create: {
          offerProductId: 'gid://shopify/Product/222',
          offerVariantId: 'gid://shopify/ProductVariant/333',
          offerProductHandle: 'shiva-dome',
          offerProductTitle: 'Shiva Dome',
          offerProductImage:
            'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80',
          offerDescription:
            'A premium handcrafted spiritual dome curated as the natural companion to your order.',
          offerPrice: 1599,
          compareAtPrice: 1999,
          discountType: 'PERCENTAGE',
          discountValue: 20,
          destinationType: 'PRODUCT_PAGE',
          headline: 'Special Offer Unlocked',
          subheadline:
            'Because you just placed an order, you can now get the Shiva Dome at a private discounted price.',
          ctaText: 'Claim This Offer',
          urgencyText: 'Private thank-you price reserved for the next 15 minutes',
          timerEnabled: true,
          timerMinutes: 15,
        },
      },
    },
    update: {status: 'ACTIVE'},
  });

  await prisma.offerView.createMany({
    data: Array.from({length: 34}, (_, index) => ({
      storeId: store.id,
      campaignId: campaign.id,
      orderId: `seed-view-${index}`,
      customerType: index % 2 === 0 ? 'first_time' : 'returning',
      createdAt: new Date(Date.now() - index * 60 * 60 * 1000),
    })),
    skipDuplicates: true,
  });

  await prisma.offerClick.createMany({
    data: Array.from({length: 12}, (_, index) => ({
      storeId: store.id,
      campaignId: campaign.id,
      orderId: `seed-click-${index}`,
      redirectUrl: '/products/shiva-dome?discount=THANKYOU20',
      createdAt: new Date(Date.now() - index * 2 * 60 * 60 * 1000),
    })),
    skipDuplicates: true,
  });

  await prisma.offerPurchase.createMany({
    data: Array.from({length: 5}, (_, index) => ({
      storeId: store.id,
      campaignId: campaign.id,
      orderId: `seed-purchase-${index}`,
      revenue: 1599,
      currency: 'INR',
      discountCode: 'THANKYOU20',
      createdAt: new Date(Date.now() - index * 8 * 60 * 60 * 1000),
    })),
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
