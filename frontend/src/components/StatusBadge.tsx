import clsx from 'clsx';

export function StatusBadge({status}: {status: 'Active' | 'Paused' | 'Draft' | 'Archived'}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold',
        status === 'Active' && 'bg-emerald-50 text-success',
        status === 'Paused' && 'bg-amber-50 text-warning',
        status === 'Draft' && 'bg-gray-100 text-gray-600',
        status === 'Archived' && 'bg-red-50 text-danger',
      )}
    >
      {status}
    </span>
  );
}
