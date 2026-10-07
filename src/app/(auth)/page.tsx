'use client';

import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { useLoginMutation } from '@/redux/features/auth/auth.api';
import { setCredentials } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res: any = await loginUser(data).unwrap();
      const user = {
        id: res?.data?._id,
        name: res?.data?.name,
        email: res?.data?.email,
        role: res?.data?.role,
      };

      dispatch(setCredentials({ user }));
      await import('@/services/auth/auth.service').then(m => m.setUserProfile(user));
      toast.success(res?.message || 'Logged in Successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-7">
      <div className="space-y-2 text-left">
        <h1 className="text-primary-text text-2xl font-semibold sm:text-3xl">Admin Login</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Enter your administrative credentials to sign in.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <InputField
            control={control}
            name="email"
            label="Admin Email"
            type="email"
            placeholder="admin@digitalsoftzone.com"
            error={errors.email?.message}
            required
          />

          <div className="space-y-1">
            <InputField
              control={control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
            />
          </div>
        </div>

        <DynamicActionButton
          type="submit"
          label="Sign in to Dashboard"
          isLoading={isLoading}
          className="w-full"
        />
      </form>
    </div>
  );
}
