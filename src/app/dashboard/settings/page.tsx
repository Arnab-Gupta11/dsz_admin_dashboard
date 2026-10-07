'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/redux/features/settings/settings.api';
import { ISettings } from '@/types/models.types';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function SettingsPage() {
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

  if (isFetching) return <div className="p-8 text-center">Loading settings...</div>;

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
            {/* Can add Social Links dynamic array here using useFieldArray */}
          </div>
        </div>

        <div className="flex justify-end">
          <DynamicActionButton icon={Save} label="Save Settings" isLoading={isUpdating} type="submit" />
        </div>
      </form>
    </div>
  );
}
