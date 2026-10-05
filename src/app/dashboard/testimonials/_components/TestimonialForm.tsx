'use client';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';

export default function TestimonialForm({ initialData, onSubmit, isLoading }: any) {
  const { control, handleSubmit } = useForm({
    defaultValues: initialData || { title: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <DynamicBackButton />
        <DynamicActionButton icon={Save} label="Save" isLoading={isLoading} type="submit" />
      </div>
      <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-4">
        <InputField label="Title" name="title" control={control} required />
        {/* Placeholder for other fields */}
      </div>
    </form>
  );
}