import React from 'react';

interface LogoProps {
  compact?: boolean;
  className?: string;
  markClassName?: string;
}

export function Logo({ compact = false, className = '', markClassName = 'h-9 w-9' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className={markClassName} aria-hidden>
        <rect x="0.5" y="0.5" width="39" height="39" rx="11" fill="#052D35" stroke="rgba(2,224,223,0.35)" />
        <rect x="10" y="10" width="20" height="6.5" rx="3.25" fill="#02E0DF" />
        <rect x="10" y="10" width="6.5" height="13" rx="3.25" fill="#02E0DF" />
        <rect x="10" y="23.5" width="20" height="6.5" rx="3.25" fill="#05D8B5" />
        <rect x="23.5" y="17" width="6.5" height="13" rx="3.25" fill="#05D8B5" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-sans text-[15px] font-bold tracking-[-0.01em] text-primary-text">Digital Soft Zone</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-text">Admin Panel</span>
        </span>
      )}
    </span>
  );
}
