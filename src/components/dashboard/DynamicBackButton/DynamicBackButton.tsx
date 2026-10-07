'use client';

import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DynamicBackButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

const DynamicBackButton = ({ label = 'Back', href, className }: DynamicBackButtonProps) => {
  const router = useRouter();

  const combinedClasses = cn(
    'group flex items-center gap-2 h-10 w-fit px-4 text-sm font-medium transition-all rounded-md bg-transparent border border-border text-primary-text hover:bg-muted hover:text-primary active:scale-95',
    className,
  );

  const content = (
    <>
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => router.back()} className={combinedClasses}>
      {content}
    </button>
  );
};

export default DynamicBackButton;
