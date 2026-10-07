'use client';

import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import OtpInputField from '@/components/dashboard/Fields/OtpInputField/OtpInputField';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  otp: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export default function VerifyOtpPage() {
  const router = useRouter();
  const isLoading = false;

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async () => {
    toast.success('OTP Verified! (Mocked)');
    router.push('/reset-password');
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-primary-text text-3xl font-bold">Check your email</h1>
        <p className="text-muted-foreground">We sent a verification code to your email.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-primary-text text-center">
            Verification Code
          </label>
          <div className="flex justify-center">
            <OtpInputField 
              onComplete={(val) => setValue('otp', val, { shouldValidate: true })} 
              error={!!errors.otp} 
            />
          </div>
          {errors.otp && (
            <p className="mt-1 text-xs text-danger text-center">{errors.otp.message}</p>
          )}
        </div>
        <DynamicActionButton type="submit" label="Verify Code" isLoading={isLoading} className="w-full" />
        <div className="text-center">
          <Link href="/forgot-password" className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to forgot password
          </Link>
        </div>
      </form>
    </div>
  );
}
