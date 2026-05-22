import {funnelSteps} from '@/lib/mock-data';

export function Funnel() {
  const max = Math.max(...funnelSteps.map((step) => step.value));

  return (
    <div className="space-y-4">
      {funnelSteps.map((step) => (
        <div key={step.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">{step.label}</span>
            <span className="font-bold text-muted">{step.value.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{width: `${Math.max(8, (step.value / max) * 100)}%`}}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
