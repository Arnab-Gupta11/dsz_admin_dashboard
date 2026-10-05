import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProfileSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-6">
                <div className="bg-card border-border rounded-md border shadow-xs">
                    {/* Header */}
                    <div className="border-border border-b p-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-6 w-44" />
                        </div>

                        <Skeleton className="mt-2 h-4 w-72" />
                    </div>

                    {/* Content */}
                    <div className="space-y-6 p-4">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-14 w-14 rounded-full" />

                            <div className="space-y-2">
                                <Skeleton className="h-8 w-24 rounded-md" />
                            </div>
                        </div>

                        {/* First & Last Name */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[0, 1].map((item) => (
                                <div key={item} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                            ))}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-3 w-48" />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>

                        {/* Button */}
                        <Skeleton className="mt-2 h-10 w-36 rounded-md" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Future content */}
            </div>
        </div>
    );
}