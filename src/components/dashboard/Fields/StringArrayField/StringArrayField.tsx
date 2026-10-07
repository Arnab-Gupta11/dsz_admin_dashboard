'use client';

import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StringArrayFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export default function StringArrayField<T extends FieldValues>({
  label,
  name,
  control,
  error,
  placeholder = 'Enter value...',
  required,
}: StringArrayFieldProps<T>) {
  const {
    field: { onChange, value },
  } = useController({ name, control });

  const items: string[] = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    onChange([...items, '']);
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleChange = (index: number, val: string) => {
    const newItems = [...items];
    newItems[index] = val;
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <Label className="block font-medium">
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={placeholder}
                className={cn(
                  'border-border bg-transparent focus-visible:border-primary',
                  error && 'border-danger focus-visible:border-danger focus-visible:ring-danger'
                )}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemove(index)}
              className="text-danger border-border hover:bg-danger/10 hover:text-danger shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="mt-2 text-sm border-border hover:border-primary hover:text-primary"
      >
        <Plus className="mr-1 h-4 w-4" /> Add Item
      </Button>
      
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}

