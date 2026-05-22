import {StorefrontRealtimeStats} from '@/hooks/useStorefrontRealtime';
import {formatCurrency} from '@/lib/format';
import {campaignRows, donutData, funnelSteps, recentCampaigns, revenueSeries} from '@/lib/mock-data';
import {getSectionById} from '@/lib/storefront-products';

const BASE_REVENUE = 842000;
const BASE_VIEWS = 42680;
const BASE_CLICKS = 8932;
const BASE_PURCHASES = 1184;

function withLiveChange(value: number, fallback: string) {
  return value > 0 ? `Live +${value.toLocaleString('en-IN')}` : fallback;
}

export function buildDashboardMetrics(stats: StorefrontRealtimeStats) {
  const views = BASE_VIEWS + stats.productViews;
  const clicks = BASE_CLICKS + stats.cartAdds;
  const purchases = BASE_PURCHASES + stats.checkouts;
  const revenue = BASE_REVENUE + stats.campaignRevenue;
  const conversion = clicks ? (purchases / clicks) * 100 : 0;

  return [
    {
      label: 'Revenue Generated',
      value: formatCurrency(revenue),
      change: stats.campaignRevenue ? `Live +${formatCurrency(stats.campaignRevenue)}` : '+18.4%',
    },
    {
      label: 'Offer Views',
      value: views.toLocaleString('en-IN'),
      change: withLiveChange(stats.productViews, '+12.1%'),
    },
    {
      label: 'Offer Clicks',
      value: clicks.toLocaleString('en-IN'),
      change: withLiveChange(stats.cartAdds, '+9.7%'),
    },
    {
      label: 'Orders From Offers',
      value: purchases.toLocaleString('en-IN'),
      change: withLiveChange(stats.checkouts, '+15.2%'),
    },
    {
      label: 'Conversion Rate',
      value: `${conversion.toFixed(2)}%`,
      change: stats.checkouts ? 'Live updated' : '+2.8%',
    },
  ];
}

export function buildAnalyticsMetrics(stats: StorefrontRealtimeStats) {
  const views = BASE_VIEWS + stats.productViews;
  const clicks = BASE_CLICKS + stats.cartAdds;
  const purchases = BASE_PURCHASES + stats.checkouts;
  const revenue = BASE_REVENUE + stats.campaignRevenue;
  const ctr = views ? (clicks / views) * 100 : 0;

  return [
    {label: 'Offer views', value: views.toLocaleString('en-IN'), change: withLiveChange(stats.productViews, '+12.1%')},
    {label: 'Clicks', value: clicks.toLocaleString('en-IN'), change: withLiveChange(stats.cartAdds, '+9.7%')},
    {label: 'CTR', value: `${ctr.toFixed(1)}%`, change: stats.cartAdds ? 'Live updated' : '+1.8%'},
    {label: 'Purchases', value: purchases.toLocaleString('en-IN'), change: withLiveChange(stats.checkouts, '+15.2%')},
    {
      label: 'Revenue generated',
      value: formatCurrency(revenue),
      change: stats.campaignRevenue ? `Live +${formatCurrency(stats.campaignRevenue)}` : '+18.4%',
    },
  ];
}

export function buildRealtimeRevenueSeries(stats: StorefrontRealtimeStats) {
  const series = revenueSeries.map((point) => ({...point}));
  const indexByDay = new Map(series.map((point, index) => [point.day, index]));

  if (!stats.recentOrders.length && stats.campaignRevenue) {
    const today = new Date().toLocaleDateString('en-US', {weekday: 'short'});
    const todayIndex = indexByDay.get(today) ?? series.length - 1;
    series[todayIndex] = {
      ...series[todayIndex]!,
      revenue: series[todayIndex]!.revenue + stats.campaignRevenue,
    };
    return series;
  }

  stats.recentOrders.forEach((order) => {
    const day = new Date(order.createdAt).toLocaleDateString('en-US', {weekday: 'short'});
    const index = indexByDay.get(day);
    if (index === undefined) return;
    series[index] = {...series[index]!, revenue: series[index]!.revenue + order.total};
  });

  return series;
}

export function buildRealtimeFunnel(stats: StorefrontRealtimeStats) {
  return [
    {label: 'Offer views', value: funnelSteps[0]!.value + stats.productViews},
    {label: 'CTA clicks', value: funnelSteps[1]!.value + stats.cartAdds},
    {label: 'Product visits', value: funnelSteps[2]!.value + stats.productViews},
    {label: 'Offer purchases', value: funnelSteps[3]!.value + stats.checkouts},
  ];
}

export function buildRealtimeDonutData(stats: StorefrontRealtimeStats) {
  if (!stats.purchasedProducts.length) return donutData;

  const revenueBySection = new Map<string, number>();
  stats.purchasedProducts.forEach((product) => {
    const sectionName = getSectionById(product.sectionId).name;
    revenueBySection.set(sectionName, (revenueBySection.get(sectionName) ?? 0) + product.revenue);
  });

  const total = Array.from(revenueBySection.values()).reduce((sum, value) => sum + value, 0);
  if (!total) return donutData;

  return Array.from(revenueBySection.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([name, value]) => ({
      name,
      value: Math.max(1, Math.round((value / total) * 100)),
    }));
}

export function buildLiveCampaignRows(stats: StorefrontRealtimeStats) {
  const productRows = stats.purchasedProducts.slice(0, 4).map((product) => ({
    id: `live-${product.productId}`,
    name: `Live checkout: ${product.productName}`,
    triggerProduct: product.productName,
    offerProduct: product.bundleRevenue > 0 ? 'Accepted bundle offer' : 'Checkout offer popup',
    discount: product.bundleRevenue > 0 ? 'Bundle accepted' : 'Offer skipped',
    views: Math.max(product.orders, stats.productViews),
    clicks: Math.max(product.orders, stats.cartAdds),
    revenue: product.revenue,
    status: 'Active' as const,
  }));

  const baseRows = campaignRows.map((campaign) =>
    campaign.id === 'home-decor-bundle'
      ? {
          ...campaign,
          views: campaign.views + stats.productViews,
          clicks: campaign.clicks + stats.cartAdds,
          revenue: campaign.revenue + stats.campaignRevenue,
        }
      : campaign,
  );

  return productRows.length ? [...productRows, ...baseRows] : baseRows;
}

export function buildRecentCampaigns(stats: StorefrontRealtimeStats) {
  if (!stats.recentOrders.length) return recentCampaigns;

  return stats.recentOrders.slice(0, 3).map((order) => ({
    name: `Live order: ${order.primaryProduct}`,
    status: 'Active',
    metric: `${formatCurrency(order.total)} checkout`,
  }));
}

export function getTopPurchasedProduct(stats: StorefrontRealtimeStats) {
  return stats.purchasedProducts[0];
}
