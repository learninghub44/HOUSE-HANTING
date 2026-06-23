export default function PropertyLoading() {
  return (
    <div className="container-page py-8">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="w-full max-w-xl">
          <div className="mb-3 h-6 w-40 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
          <div className="mt-3 h-5 w-2/3 animate-pulse rounded-md bg-slate-200" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-md bg-slate-200" />
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="aspect-[16/10] animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div className="min-h-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="min-h-40 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
