import {Plus} from 'lucide-react';
import Link from 'next/link';
import {CampaignsClient} from '@/components/CampaignsClient';

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">Campaigns</h1>
          <p className="mt-2 text-sm text-muted">Create, edit, duplicate, and pause Thank You page offers.</p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white shadow-button transition hover:bg-brand-hover"
        >
          <Plus className="h-4 w-4" />
          New campaign
        </Link>
      </div>
      <CampaignsClient />
    </div>
  );
}
