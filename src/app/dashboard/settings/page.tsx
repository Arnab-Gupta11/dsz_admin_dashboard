'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import { useForm } from 'react-hook-form';
import { Save, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/redux/features/auth/auth.api';
import { setCredentials } from '@/redux/features/auth/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const { control: profileControl, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const { control: passwordControl, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      resetProfile({ name: user.name, email: user.email });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (formData: any) => {
    try {
      const res = await updateProfile({ name: formData.name }).unwrap();
      dispatch(setCredentials({ user: res.data }));
      toast.success('Profile updated successfully');
    } catch(e: any) { 
      toast.error(e?.data?.message || e?.message || 'Failed to update profile'); 
    }
  };

  const onPasswordSubmit = async (formData: ChangePasswordFormValues) => {
    try {
      await changePassword({ 
        oldPassword: formData.oldPassword, 
        newPassword: formData.newPassword 
      }).unwrap();
      toast.success('Password changed successfully');
      resetPassword();
    } catch(e: any) { 
      toast.error(e?.data?.message || e?.message || 'Failed to change password'); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">Personal Info</h1>
          <p className="text-secondary-text mt-1 text-sm">Manage your personal information and password</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border-border space-y-4 rounded-md border p-6 shadow-sm">
          <h2 className="text-primary-text mb-4 text-lg font-semibold">Profile Details</h2>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <InputField label="Name" name="name" control={profileControl} placeholder="Enter your name" required />
            <InputField label="Email" name="email" control={profileControl} placeholder="Enter your email" type="email" readOnly={true} />
            <div className="flex justify-end pt-2">
              <DynamicActionButton icon={Save} label="Update Profile" isLoading={isUpdatingProfile} type="submit" />
            </div>
          </form>
        </div>

        <div className="bg-card border-border space-y-4 rounded-md border p-6 shadow-sm">
          <h2 className="text-primary-text mb-4 text-lg font-semibold">Change Password</h2>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <InputField label="Old Password" name="oldPassword" control={passwordControl} error={passwordErrors.oldPassword?.message} placeholder="Enter old password" type="password" required />
            <InputField label="New Password" name="newPassword" control={passwordControl} error={passwordErrors.newPassword?.message} placeholder="Enter new password" type="password" required />
            <InputField label="Confirm New Password" name="confirmPassword" control={passwordControl} error={passwordErrors.confirmPassword?.message} placeholder="Confirm new password" type="password" required />
            <div className="flex justify-end pt-2">
              <DynamicActionButton icon={Key} label="Change Password" isLoading={isChangingPassword} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/*
// ==========================================
// PREVIOUS GLOBAL SETTINGS PAGE (HIDDEN)
// ==========================================
import FormSkeleton from "@/components/Loader/Skeletons/FormSkeleton";
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/redux/features/settings/settings.api';
import { ISettings } from '@/types/models.types';

export default function GlobalSettingsPage() {
  const { data, isLoading: isFetching } = useGetSettingsQuery(undefined);
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: data?.data || {
      siteName: '',
      tagline: '',
      email: '',
      phone: '',
      whatsappNumber: '',
      whatsappUrl: '',
      addressLine: '',
      city: '',
      logoUrl: '',
      ogImage: '',
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const onSubmit = async (formData: Partial<ISettings>) => {
    try {
      await updateSettings(formData).unwrap();
      toast.success('Settings updated successfully');
    } catch(e: any) { toast.error(e?.data?.message || e?.message || 'Failed to update settings'); }
  };

  if (isFetching) return <FormSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">Global Settings</h1>
          <p className="text-secondary-text mt-1 text-sm">Manage website general info</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card border-border space-y-4 rounded-md border p-6 shadow-sm">
            <h2 className="text-primary-text mb-4 text-lg font-semibold">General Info</h2>
            <InputField label="Site Name" name="siteName" control={control} required />
            <InputField label="Tagline" name="tagline" control={control} />
            <InputField label="Contact Email" name="email" control={control} type="email" required />
            <InputField label="Contact Phone" name="phone" control={control} required />
            <InputField label="Address Line" name="addressLine" control={control} />
            <InputField label="City" name="city" control={control} />
          </div>

          <div className="bg-card border-border space-y-4 rounded-md border p-6 shadow-sm">
            <h2 className="text-primary-text mb-4 text-lg font-semibold">Social & Media</h2>
            <InputField label="WhatsApp Number" name="whatsappNumber" control={control} />
            <InputField label="WhatsApp URL" name="whatsappUrl" control={control} />
            <InputField label="Logo URL" name="logoUrl" control={control} />
            <InputField label="Default OG Image URL" name="ogImage" control={control} />
          </div>
        </div>

        <div className="flex justify-end">
          <DynamicActionButton icon={Save} label="Save Settings" isLoading={isUpdating} type="submit" />
        </div>
      </form>
    </div>
  );
}
*/
