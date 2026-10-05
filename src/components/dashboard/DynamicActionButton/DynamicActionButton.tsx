'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, LucideIcon, Plus } from 'lucide-react';
import Link from 'next/link';

interface DynamicButtonProps {
  type?: 'submit' | 'button';
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'danger' | 'secondary';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: LucideIcon | null;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
}

const DynamicActionButton = ({
  type = 'button',
  label,
  href,
  onClick,
  className,
  variant = 'default',
  disabled = false,
  isLoading = false,
  icon: Icon = Plus,
  showIcon = false,
  iconPosition = 'right',
}: DynamicButtonProps) => {
  const variantStyles = {
    default: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
    outline: 'bg-transparent border-border text-primary-text hover:bg-primary/5',
    danger: 'bg-danger text-white border-danger hover:bg-danger/90',
    secondary: 'bg-card border-primary hover:border-primary/90 text-primary',
  };

  const combinedClasses = cn(
    'group relative h-11 text-xs sm:h-12 w-fit cursor-pointer sm:text-base transition-all duration-300 border px-8 active:scale-95 flex items-center justify-center gap-2 font-semibold overflow-hidden rounded-sm',
    variantStyles[variant],
    className,
  );

  const buttonContent = (
    <>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        showIcon && Icon && iconPosition === 'left' && <Icon size={18} strokeWidth={2.5} />
      )}
      <span className="relative z-10 text-sm">{label}</span>
      {!isLoading && showIcon && Icon && iconPosition === 'right' && (
        <Icon size={18} strokeWidth={2.5} />
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Button asChild className={combinedClasses}>
        <Link href={href} className="flex items-center">
          {buttonContent}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled || isLoading}
    >
      {buttonContent}
    </Button>
  );
};

export default DynamicActionButton;
