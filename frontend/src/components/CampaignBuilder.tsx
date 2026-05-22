'use client';

import {Check, Palette, Percent, Route, ShoppingBag, SlidersHorizontal, Sparkles, Tag} from 'lucide-react';
import {useState} from 'react';

const sections = [
  {label: 'Campaign Info', icon: Sparkles},
  {label: 'Trigger Rules', icon: SlidersHorizontal},
  {label: 'Offer Configuration', icon: ShoppingBag},
  {label: 'Discount Configuration', icon: Percent},
  {label: 'Offer Content', icon: Tag},
  {label: 'Design Settings', icon: Palette},
  {label: 'Destination Type', icon: Route},
];

export function CampaignBuilder() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-2xl border border-line bg-white p-3 shadow-card">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <a
              key={section.label}
              href={`#section-${index}`}
              className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-ink"
            >
              <Icon className="h-4 w-4 text-brand" />
              {section.label}
            </a>
          );
        })}
      </aside>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <BuilderSection id="section-0" title="Campaign Info">
          <Field label="Campaign Name">
            <input className="field-input" defaultValue="Ganesha Dome to Shiva Dome" />
          </Field>
          <Field label="Status">
            <select className="field-input" defaultValue="ACTIVE">
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="DRAFT">Draft</option>
            </select>
          </Field>
        </BuilderSection>

        <BuilderSection id="section-1" title="Trigger Rules">
          <Field label="Trigger Type">
            <select className="field-input" defaultValue="PRODUCT">
              <option value="PRODUCT">Product trigger</option>
              <option value="COLLECTION">Collection trigger</option>
              <option value="PRODUCT_TAG">Product tag trigger</option>
              <option value="ORDER_VALUE">Order value trigger</option>
              <option value="CUSTOMER_TYPE">Customer type trigger</option>
            </select>
          </Field>
          <Field label="Trigger Product ID">
            <input className="field-input" defaultValue="gid://shopify/Product/111" />
          </Field>
          <Field label="Minimum Order Value">
            <input className="field-input" defaultValue="2000" inputMode="numeric" />
          </Field>
          <Field label="Customer Type">
            <select className="field-input" defaultValue="first_time">
              <option value="first_time">First time</option>
              <option value="returning">Returning</option>
              <option value="any">Any customer</option>
            </select>
          </Field>
        </BuilderSection>

        <BuilderSection id="section-2" title="Offer Configuration">
          <Field label="Offer Type">
            <select className="field-input" defaultValue="SINGLE_PRODUCT">
              <option value="SINGLE_PRODUCT">Single Product</option>
              <option value="BUNDLE">Bundle Offer</option>
              <option value="COLLECTION_REDIRECT">Collection Redirect</option>
              <option value="MYSTERY">Mystery Offer</option>
            </select>
          </Field>
          <Field label="Offer Product ID">
            <input className="field-input" defaultValue="gid://shopify/Product/222" />
          </Field>
          <Field label="Offer Variant ID">
            <input className="field-input" defaultValue="gid://shopify/ProductVariant/333" />
          </Field>
          <Field label="Offer Product Handle">
            <input className="field-input" defaultValue="shiva-dome" />
          </Field>
        </BuilderSection>

        <BuilderSection id="section-3" title="Discount Configuration">
          <Field label="Discount Type">
            <select className="field-input" defaultValue="PERCENTAGE">
              <option value="PERCENTAGE">Percentage discount</option>
              <option value="FIXED_AMOUNT">Fixed discount</option>
              <option value="FREE_SHIPPING">Free shipping</option>
              <option value="BUY_X_GET_Y">Buy X Get Y</option>
            </select>
          </Field>
          <Field label="Discount Value">
            <input className="field-input" defaultValue="20" inputMode="numeric" />
          </Field>
        </BuilderSection>

        <BuilderSection id="section-4" title="Offer Content">
          <Field label="Headline">
            <input className="field-input" defaultValue="Special Offer Unlocked" />
          </Field>
          <Field label="Subheadline">
            <textarea
              className="field-input min-h-24 resize-y py-3"
              defaultValue="Because you just placed an order, you can now get this product at a private discounted price."
            />
          </Field>
          <Field label="CTA Text">
            <input className="field-input" defaultValue="Claim This Offer" />
          </Field>
          <Field label="Urgency Text">
            <input className="field-input" defaultValue="Private thank-you price reserved for the next 15 minutes" />
          </Field>
          <Toggle label="Countdown timer" defaultChecked />
        </BuilderSection>

        <BuilderSection id="section-5" title="Design Settings">
          <Field label="Background Color">
            <input className="field-input" defaultValue="#FFFFFF" />
          </Field>
          <Field label="Border Radius">
            <input className="field-input" defaultValue="20" inputMode="numeric" />
          </Field>
          <Field label="Button Style">
            <select className="field-input" defaultValue="solid">
              <option value="solid">Solid</option>
              <option value="outline">Outline</option>
              <option value="subtle">Subtle</option>
            </select>
          </Field>
          <Toggle label="Show compare price" defaultChecked />
          <Toggle label="Show countdown timer" defaultChecked />
        </BuilderSection>

        <BuilderSection id="section-6" title="Destination Type">
          <Field label="Destination">
            <select className="field-input" defaultValue="PRODUCT_PAGE">
              <option value="PRODUCT_PAGE">Product page redirect</option>
              <option value="CART">Cart redirect</option>
              <option value="LANDING_PAGE">Landing page redirect</option>
            </select>
          </Field>
          <Field label="Destination URL">
            <input className="field-input" defaultValue="/products/shiva-dome" />
          </Field>
        </BuilderSection>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted">
            {saved ? (
              <>
                <Check className="h-4 w-4 text-success" />
                Saved
              </>
            ) : (
              'Unsaved changes'
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" className="rounded-xl border border-line px-4 py-2 text-sm font-bold text-ink">
              Save draft
            </button>
            <button
              type="submit"
              className="rounded-xl bg-brand px-5 py-2 text-sm font-bold text-white shadow-button transition hover:bg-brand-hover"
            >
              Launch campaign
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function BuilderSection({id, title, children}: {id: string; title: string; children: React.ReactNode}) {
  return (
    <section id={id} className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-ink">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Toggle({label, defaultChecked}: {label: string; defaultChecked?: boolean}) {
  return (
    <label className="flex h-11 items-center justify-between rounded-xl border border-line px-3 text-sm font-semibold text-ink">
      {label}
      <input className="h-5 w-5 accent-brand" type="checkbox" defaultChecked={defaultChecked} />
    </label>
  );
}
