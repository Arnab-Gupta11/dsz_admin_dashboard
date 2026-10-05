import { Skeleton } from '@/components/ui/skeleton';

function OverviewStatsSkeleton() {
  return (
    <div className="border-border bg-card flex cursor-pointer items-center gap-3 rounded-md border p-3 shadow-xs transition-all sm:gap-4 sm:p-5">
      {/* Icon Container Skeleton */}
      <Skeleton className="h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12" />

      {/* Text Information Skeleton */}
      <div className="flex flex-col gap-1 sm:gap-2">
        <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
        <Skeleton className="h-7 w-12 sm:h-7 sm:w-16" />
      </div>
    </div>
  );
}

export default OverviewStatsSkeleton;
