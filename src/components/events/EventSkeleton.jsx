export default function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">

      <div className="h-56 animate-pulse bg-slate-200" />

      <div className="space-y-3 p-5">

        <div className="h-6 animate-pulse rounded bg-slate-200" />

        <div className="h-4 animate-pulse rounded bg-slate-100" />

        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />

      </div>

    </div>
  )
}