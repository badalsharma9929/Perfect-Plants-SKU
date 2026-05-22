'use client';

import {Copy, Edit3, MoreHorizontal, PauseCircle, PlayCircle, Search, Trash2} from 'lucide-react';
import {useMemo, useState} from 'react';
import {StatusBadge} from '@/components/StatusBadge';
import {campaignRows} from '@/lib/mock-data';
import {formatCurrency} from '@/lib/format';
import {useStorefrontRealtime} from '@/hooks/useStorefrontRealtime';

export function CampaignsClient() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const {stats} = useStorefrontRealtime();

  const rows = useMemo(() => {
    const liveRows = campaignRows.map((campaign) =>
      campaign.id === 'home-decor-bundle'
        ? {
            ...campaign,
            views: campaign.views + stats.productViews,
            clicks: campaign.clicks + stats.cartAdds,
            revenue: campaign.revenue + stats.campaignRevenue,
          }
        : campaign,
    );

    return liveRows.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'All' || campaign.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, stats.campaignRevenue, stats.cartAdds, stats.productViews, status]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-card md:grid-cols-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-muted">Realtime storefront revenue</p>
          <p className="mt-1 text-2xl font-black text-ink">{formatCurrency(stats.campaignRevenue)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-muted">Checkouts</p>
          <p className="mt-1 text-2xl font-black text-ink">{stats.checkouts}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-muted">Bundle revenue</p>
          <p className="mt-1 text-2xl font-black text-ink">{formatCurrency(stats.bundleRevenue)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-muted">Net lift profit</p>
          <p className="mt-1 text-2xl font-black text-ink">{formatCurrency(stats.netLiftProfit)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white shadow-card">
      <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-4 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 md:max-w-md"
            placeholder="Search campaigns"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        >
          {['All', 'Active', 'Paused', 'Draft'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-gray-50/70 text-xs uppercase tracking-normal text-muted">
              <th className="px-5 py-4 font-bold">Campaign Name</th>
              <th className="px-5 py-4 font-bold">Trigger Product</th>
              <th className="px-5 py-4 font-bold">Offer Product</th>
              <th className="px-5 py-4 font-bold">Discount</th>
              <th className="px-5 py-4 font-bold">Views</th>
              <th className="px-5 py-4 font-bold">Clicks</th>
              <th className="px-5 py-4 font-bold">Revenue</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((campaign) => (
              <tr key={campaign.id} className="border-b border-line last:border-0 hover:bg-gray-50/70">
                <td className="px-5 py-4 font-semibold text-ink">{campaign.name}</td>
                <td className="px-5 py-4 text-muted">{campaign.triggerProduct}</td>
                <td className="px-5 py-4 text-muted">{campaign.offerProduct}</td>
                <td className="px-5 py-4 font-semibold text-ink">{campaign.discount}</td>
                <td className="px-5 py-4 text-muted">{campaign.views.toLocaleString('en-IN')}</td>
                <td className="px-5 py-4 text-muted">{campaign.clicks.toLocaleString('en-IN')}</td>
                <td className="px-5 py-4 font-semibold text-ink">{formatCurrency(campaign.revenue)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {[
                      {label: 'Edit', icon: Edit3},
                      {label: 'Duplicate', icon: Copy},
                      {
                        label: campaign.status === 'Active' ? 'Disable' : 'Enable',
                        icon: campaign.status === 'Active' ? PauseCircle : PlayCircle,
                      },
                      {label: 'Delete', icon: Trash2},
                    ].map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          className="grid h-9 w-9 place-items-center rounded-xl text-gray-500 transition hover:bg-white hover:text-brand hover:shadow-sm"
                          title={action.label}
                          aria-label={action.label}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      );
                    })}
                    <button
                      className="grid h-9 w-9 place-items-center rounded-xl text-gray-500 transition hover:bg-white hover:text-brand hover:shadow-sm"
                      title="More"
                      aria-label="More"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 text-sm text-muted">
        <span>Page 1 of 1</span>
        <div className="flex gap-2">
          <button className="h-9 rounded-xl border border-line px-3 font-semibold text-ink transition hover:bg-gray-50">
            Previous
          </button>
          <button className="h-9 rounded-xl border border-line px-3 font-semibold text-ink transition hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
