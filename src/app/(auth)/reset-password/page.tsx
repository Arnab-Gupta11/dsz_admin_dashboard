'use client';

import { useResetPasswordMutation } from '@/redux/features/auth/auth.api';

import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: any) => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get('email');
    const otp = searchParams.get('otp');

    if (!email || !otp) {
      toast.error('Invalid link or session expired. Please start over.');
      router.push('/forgot-password');
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword: data.password }).unwrap();
      toast.success('Password reset successfully!');
      router.push('/');
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-primary-text text-3xl font-bold">Set New Password</h1>
        <p className="text-muted-foreground">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField control={control} name="password" label="New Password" type="password" placeholder="Enter new password" error={errors.password?.message as any} required />
        <InputField control={control} name="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm new password" error={errors.confirmPassword?.message as any} required />
        <DynamicActionButton type="submit" label="Reset Password" isLoading={isLoading} className="w-full" />
      </form>
    </div>
  );
}
