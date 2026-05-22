import clsx from 'clsx';
import type {LucideIcon} from 'lucide-react';

type MetricCardProps = {
  label: string;
  value: string;
  change: string;
  tone?: 'success' | 'warning' | 'danger';
  icon: LucideIcon;
};

export function MetricCard({label, value, change, tone = 'success', icon: Icon}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gray-50 text-brand">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={clsx(
            'rounded-full px-2.5 py-1 text-xs font-bold',
            tone === 'success' && 'bg-emerald-50 text-success',
            tone === 'warning' && 'bg-amber-50 text-warning',
            tone === 'danger' && 'bg-red-50 text-danger',
          )}
        >
          {change}
        </span>
      </div>
      <p className="mt-5 text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-normal text-ink">{value}</p>
    </div>
  );
}
