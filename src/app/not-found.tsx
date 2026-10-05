'use client';

import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="bg-bg text-primary-text flex min-h-screen items-center justify-center p-4 font-sans antialiased md:p-8">
      <div className="border-border bg-card w-full max-w-xl space-y-8 rounded-2xl border p-8 text-center shadow-sm md:p-12">
        <div className="relative py-4">
          <h1 className="text-border text-8xl font-black tracking-tight select-none md:text-9xl">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border-primary/20 bg-primary/10 text-primary rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm">
              Page Not Found
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-primary-text text-2xl font-semibold tracking-tight md:text-3xl">
            Lost in the digital wilderness?
          </h2>
          <p className="text-secondary-text mx-auto max-w-sm text-sm leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been moved, or is temporarily
            unavailable. Let&apos;s get you back on track!
          </p>
        </div>

        {/* Action But*/}
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <DynamicActionButton
            label="Go Back"
            onClick={() => router.back()}
            className="w-full"
            variant="outline"
          />
          <DynamicActionButton label="Back to Home" href="/" className="w-full" />
        </div>
      </div>
    </div>
  );
}
