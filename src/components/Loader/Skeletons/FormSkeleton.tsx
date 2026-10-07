import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border-border space-y-6 rounded-md border p-6 shadow-sm">
            <Skeleton className="h-6 w-[150px]" />
            <div className="space-y-4">
              <div>
                <Skeleton className="mb-2 h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-[120px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-[140px]" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card border-border space-y-4 rounded-md border p-6 shadow-sm">
            <Skeleton className="h-6 w-[120px]" />
            <Skeleton className="h-40 w-full" />
          </div>
          
          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

