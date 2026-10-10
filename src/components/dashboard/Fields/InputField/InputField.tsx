/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRef, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: any;
  type?: string;
  placeholder?: string;
  error?: any;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
}

const InputField = <T extends FieldValues>({
  label,
  name,
  control,
  type = 'text',
  placeholder,
  error,
  required = false,
  readOnly = false,
}: InputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    field: { onChange, onBlur, value, ref: controllerRef },
  } = useController({
    name,
    control,
  });

  const isPassword = type === 'password';
  const isEmail = type === 'email';
  const isDate = type === 'date';
  const isTime = type === 'time';
  const isPickerField = isDate || isTime;
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <Label className="block font-medium">
        {label} {required && <span className="text-danger">*</span>}
      </Label>

      <div className="relative">
        {(isPassword || isEmail) && (
          <div className="text-text-placeholder absolute top-1/2 left-3 -translate-y-1/2 opacity-80">
            {isPassword && <Lock className="h-4 w-4" />}
            {isEmail && <Mail className="h-4 w-4" />}
          </div>
        )}
        <Input
          type={inputType}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={onChange}
          onBlur={onBlur}
          value={value ?? ''}
          ref={(e) => {
            controllerRef(e);
            inputRef.current = e;
          }}
          onClick={() => !readOnly && isPickerField && inputRef.current?.showPicker()}
          className={cn(
            'h-auto w-full resize-none rounded-sm p-3 shadow-none transition-all',
            'placeholder:text-text-placeholder border',
            'focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:focus:ring-2',
            'text-primary dark:text-primary-text',
            `${isPickerField ? 'cursor-pointer' : ''}`,
            {
              'bg-muted focus-visible:border-border cursor-default opacity-60': readOnly,
              'bg-muted': !readOnly,
              'border-danger/50 focus-visible:border-danger focus-visible:ring-danger/10': error,
              'border-primary/10': !error,
              'pl-10': isPassword || isEmail,
            },
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-secondary-text hover:text-primary-text absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-danger text-xs font-medium">{error}</p>}
    </div>
  );
};

export default InputField;
