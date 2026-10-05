'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  className?: string;
}

export default function TableSkeleton({
  rowCount = 10,
  columnCount = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden',
        className,
      )}
    >
      <div className="border-border custom-scrollbar overflow-x-auto rounded-md border p-0 shadow-xs bg-card">
        <table className="divide-border min-w-full divide-y">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              {Array.from({ length: columnCount }).map((_, i) => (
                <th key={i} className="px-5 py-4">
                  <Skeleton className="h-4 w-24 bg-border/50" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td key={colIndex} className="px-5 py-4">
                    <Skeleton className={cn("h-4 bg-border/40", colIndex === 0 ? "w-40" : "w-24")} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
