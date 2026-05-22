import {CheckCircle2, KeyRound, Paintbrush, RadioTower, ShieldCheck, Webhook} from 'lucide-react';

const statusItems = [
  {label: 'Webhook status', value: 'Healthy', icon: Webhook},
  {label: 'API status', value: 'Connected', icon: RadioTower},
  {label: 'Shopify permissions', value: 'Granted', icon: ShieldCheck},
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">Settings</h1>
        <p className="mt-2 text-sm text-muted">Branding, discounts, tracking, and Shopify connection status.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
              <Paintbrush className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-ink">Branding</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-ink">
              Brand Name
              <input className="field-input" defaultValue="Perfect Plants" />
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Accent Color
              <input className="field-input" defaultValue="#6D28D9" />
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink md:col-span-2">
              Default Offer Footer
              <input className="field-input" defaultValue="Secure checkout with Shopify" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold text-ink">Connection</h2>
          <div className="mt-5 space-y-4">
            {statusItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-success">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">{item.label}</p>
                      <p className="text-xs font-semibold text-success">{item.value}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-ink">Default discount settings</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-ink">
              Discount Type
              <select className="field-input" defaultValue="PERCENTAGE">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed amount</option>
                <option value="FREE_SHIPPING">Free shipping</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Default Value
              <input className="field-input" defaultValue="20" />
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Discount Prefix
              <input className="field-input" defaultValue="TY" />
            </label>
            <label className="space-y-2 text-sm font-semibold text-ink">
              Usage Limit
              <input className="field-input" defaultValue="1" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold text-ink">Tracking settings</h2>
          <div className="mt-6 space-y-3">
            {['Offer impressions', 'Offer clicks', 'Purchase attribution', 'Webhook revenue sync'].map((item) => (
              <label
                key={item}
                className="flex h-12 items-center justify-between rounded-xl border border-line px-4 text-sm font-semibold text-ink"
              >
                {item}
                <input type="checkbox" className="h-5 w-5 accent-brand" defaultChecked />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
