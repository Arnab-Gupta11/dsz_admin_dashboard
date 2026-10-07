'use client';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: any;
  required?: boolean;
}

const DatePickerField = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  required = false,
}: DatePickerFieldProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  const dateValue = value ? new Date(value) : undefined;

  return (
    <div className="space-y-2 flex flex-col">
      <Label className="block font-medium">
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal h-auto rounded-sm p-3 shadow-none transition-all',
              'text-primary dark:text-primary-text bg-muted border-primary/10 hover:bg-muted/80 hover:text-primary',
              !dateValue && 'text-text-placeholder opacity-80',
              error && 'border-danger/50 focus-visible:border-danger focus-visible:ring-danger/10'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                onChange(`${year}-${month}-${day}`);
              } else {
                onChange('');
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-danger text-xs font-medium">{error}</p>}
    </div>
  );
};

export default DatePickerField;
