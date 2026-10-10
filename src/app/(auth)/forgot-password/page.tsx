'use client';

import { useForgetPasswordMutation } from '@/redux/features/auth/auth.api';

import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgetPassword({ email: data.email }).unwrap();
      toast.success('Reset link sent to your email!');
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || 'Failed to send reset code');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-primary-text text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground">Enter your email to receive a verification code.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          control={control}
          name="email"
          label="Email Address"
          type="email"
          placeholder="admin@digitalsoftzone.com"
          error={errors.email?.message}
          required
        />

        <DynamicActionButton
          type="submit"
          label="Send Reset Code"
          isLoading={isLoading}
          className="w-full"
        />

        <div className="text-center">
          <Link href="/" className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
