'use client';

export default function OrderBookSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Buy Orders Skeleton */}
      <div>
        <div className="h-8 w-32 bg-slate-800 rounded-lg mb-4 animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-slate-800 rounded-xl bg-slate-900/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-full animate-pulse" />
                  <div>
                    <div className="h-4 w-24 bg-slate-800 rounded mb-2 animate-pulse" />
                    <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="h-8 w-32 bg-slate-800 rounded mb-2 animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
              
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-slate-800 rounded animate-pulse" />
                <div className="h-6 w-16 bg-slate-800 rounded animate-pulse" />
              </div>
              
              <div className="h-12 w-full bg-slate-800 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Sell Orders Skeleton */}
      <div>
        <div className="h-8 w-32 bg-slate-800 rounded-lg mb-4 animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-slate-800 rounded-xl bg-slate-900/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-full animate-pulse" />
                  <div>
                    <div className="h-4 w-24 bg-slate-800 rounded mb-2 animate-pulse" />
                    <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="h-8 w-32 bg-slate-800 rounded mb-2 animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
              
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-slate-800 rounded animate-pulse" />
                <div className="h-6 w-16 bg-slate-800 rounded animate-pulse" />
              </div>
              
              <div className="h-12 w-full bg-slate-800 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}