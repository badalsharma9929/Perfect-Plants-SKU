import {BadgeIndianRupee, Eye, MousePointerClick, PackageCheck, Percent} from 'lucide-react';
import {DonutChart} from '@/components/DonutChart';
import {Funnel} from '@/components/Funnel';
import {MetricCard} from '@/components/MetricCard';
import {RevenueChart} from '@/components/RevenueChart';
import {StatusBadge} from '@/components/StatusBadge';
import {campaignRows, donutData} from '@/lib/mock-data';
import {formatCurrency} from '@/lib/format';

const analyticsMetrics = [
  {label: 'Offer views', value: '42,680', change: '+12.1%', icon: Eye},
  {label: 'Clicks', value: '8,932', change: '+9.7%', icon: MousePointerClick},
  {label: 'CTR', value: '20.9%', change: '+1.8%', icon: Percent},
  {label: 'Purchases', value: '1,184', change: '+15.2%', icon: PackageCheck},
  {label: 'Revenue generated', value: '₹8.42L', change: '+18.4%', icon: BadgeIndianRupee},
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">Analytics</h1>
        <p className="mt-2 text-sm text-muted">Offer performance, revenue attribution, and conversion behavior.</p>
      </div>

      <div className="grid metric-grid gap-4">
        {analyticsMetrics.map(({icon, ...metric}) => (
          <MetricCard key={metric.label} {...metric} icon={icon} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold text-ink">Revenue trend</h2>
          <div className="mt-6">
            <RevenueChart />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold text-ink">Best performing offers</h2>
          <DonutChart data={donutData} />
          <div className="grid grid-cols-2 gap-3">
            {donutData.map((item) => (
              <div key={item.name} className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs font-semibold text-muted">{item.name}</p>
                <p className="mt-1 text-lg font-bold text-ink">{item.value}%</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold text-ink">Funnel visualization</h2>
          <div className="mt-6">
            <Funnel />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white shadow-card">
          <div className="border-b border-line p-5 sm:p-6">
            <h2 className="text-lg font-bold text-ink">Campaign performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-gray-50/70 text-xs uppercase tracking-normal text-muted">
                  <th className="px-5 py-4 font-bold">Campaign</th>
                  <th className="px-5 py-4 font-bold">Revenue</th>
                  <th className="px-5 py-4 font-bold">CTR</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaignRows.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-line last:border-0 hover:bg-gray-50/70">
                    <td className="px-5 py-4 font-semibold text-ink">{campaign.name}</td>
                    <td className="px-5 py-4 font-semibold text-ink">{formatCurrency(campaign.revenue)}</td>
                    <td className="px-5 py-4 text-muted">
                      {((campaign.clicks / campaign.views) * 100).toFixed(1)}%
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={campaign.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
