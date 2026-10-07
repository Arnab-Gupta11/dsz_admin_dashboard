import { Skeleton } from "@/components/ui/skeleton";

export default function DetailsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="mb-2 h-8 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border-border rounded-md border p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="mb-2 h-6 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card border-border rounded-md border p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card border-border rounded-md border p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="bg-card border-border rounded-md border p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-[120px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

