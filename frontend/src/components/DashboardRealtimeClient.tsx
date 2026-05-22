'use client';

import {ArrowUpRight, BadgeIndianRupee, Eye, MousePointerClick, PackageCheck, Percent} from 'lucide-react';
import Link from 'next/link';
import {MetricCard} from '@/components/MetricCard';
import {RevenueChart} from '@/components/RevenueChart';
import {StatusBadge} from '@/components/StatusBadge';
import {useStorefrontRealtime} from '@/hooks/useStorefrontRealtime';
import {
  buildDashboardMetrics,
  buildLiveCampaignRows,
  buildRealtimeRevenueSeries,
  buildRecentCampaigns,
  getTopPurchasedProduct,
} from '@/lib/realtime-analytics';
import {formatCurrency} from '@/lib/format';

const icons = [BadgeIndianRupee, Eye, MousePointerClick, PackageCheck, Percent];

export function DashboardRealtimeClient() {
  const {stats} = useStorefrontRealtime();
  const metrics = buildDashboardMetrics(stats);
  const revenueData = buildRealtimeRevenueSeries(stats);
  const campaignRows = buildLiveCampaignRows(stats);
  const recentCampaigns = buildRecentCampaigns(stats);
  const topProduct = getTopPurchasedProduct(stats);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-brand">Post Purchase Revenue Engine</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Thank You page performance across live post-purchase offers.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white shadow-button transition hover:bg-brand-hover"
        >
          Create campaign
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {topProduct ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-card">
          <p className="text-xs font-black uppercase tracking-normal text-success">Last checkout is changing this dashboard</p>
          <p className="mt-1 text-sm font-bold text-ink">
            {topProduct.productName} is now the top purchased SKU with {formatCurrency(topProduct.revenue)} attributed revenue.
          </p>
        </section>
      ) : null}

      <div className="grid metric-grid gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.label} {...metric} icon={icons[index] ?? BadgeIndianRupee} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink">Revenue graph</h2>
              <p className="mt-1 text-sm text-muted">Attributed revenue from claimed offers</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-success">
              {stats.checkouts ? 'Live' : '+18.4%'}
            </span>
          </div>
          <div className="mt-6">
            <RevenueChart data={revenueData} />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold text-ink">Top performing campaigns</h2>
          <div className="mt-5 space-y-4">
            {campaignRows.slice(0, 3).map((campaign, index) => (
              <div key={campaign.id} className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-bold text-brand">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{campaign.name}</p>
                    <p className="text-xs text-muted">{campaign.clicks.toLocaleString('en-IN')} clicks</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-ink">{formatCurrency(campaign.revenue)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-line p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-ink">Recent campaigns</h2>
            <p className="mt-1 text-sm text-muted">Live checkout events and recently edited post-purchase offers</p>
          </div>
          <Link href="/campaigns" className="text-sm font-bold text-brand">
            View all
          </Link>
        </div>
        <div className="divide-y divide-line">
          {recentCampaigns.map((campaign) => (
            <div key={campaign.name} className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="font-semibold text-ink">{campaign.name}</p>
                <p className="mt-1 text-sm text-muted">{campaign.metric}</p>
              </div>
              <StatusBadge status={campaign.status as 'Active' | 'Paused' | 'Draft'} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
