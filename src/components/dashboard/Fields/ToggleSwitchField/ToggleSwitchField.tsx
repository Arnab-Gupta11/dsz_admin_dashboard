'use client';

import { useController } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ToggleSwitchFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
}

const ToggleSwitchField = ({ name, control, label }: ToggleSwitchFieldProps) => {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-primary-text text-sm font-semibold">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          'focus-visible:ring-primary/20 relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none',
          value ? 'bg-[#7C3AED]' : 'bg-slate-200',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            value ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
};

export default ToggleSwitchField;
