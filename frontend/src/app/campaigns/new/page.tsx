import {CampaignBuilder} from '@/components/CampaignBuilder';

export default function CreateCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">Create Campaign</h1>
        <p className="mt-2 text-sm text-muted">Build a product-triggered post-purchase offer.</p>
      </div>
      <CampaignBuilder />
    </div>
  );
}
