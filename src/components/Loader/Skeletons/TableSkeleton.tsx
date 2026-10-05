'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  className?: string;
}

export const TableSkeleton = ({
  rowCount = 10,
  columnCount = 6,
  className,
}: TableSkeletonProps) => {
  return (
    <div
      className={cn(
        'border-border bg-card w-full overflow-hidden rounded-md border shadow-xs',
        className,
      )}
    >
      {/* Skeleton Table Header */}
      <div className="border-border flex items-center border-b bg-slate-50 dark:bg-slate-800/50">
        {Array.from({ length: columnCount }).map((_, i) => (
          <div key={i} className="flex-1 px-5 py-4">
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>

      {/* Skeleton Table Body */}
      <div className="divide-border divide-y">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center">
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 px-5 py-4">
                {colIndex === 0 ? (
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
