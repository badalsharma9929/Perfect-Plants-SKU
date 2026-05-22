export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded-xl bg-gray-200" />
      <div className="grid metric-grid gap-4">
        {Array.from({length: 5}, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl border border-line bg-white" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl border border-line bg-white" />
    </div>
  );
}
