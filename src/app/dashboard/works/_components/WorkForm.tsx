'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import SelectField from '@/components/dashboard/Fields/SelectField/SelectField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';
import { IWork } from '@/types/models.types';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Note: For image uploads, we usually do a separate file upload. Here we just expect a URL string, 
// or you can integrate FileUploadField that handles uploading to /api/v1/admin/media/upload and returning the URL.
// We'll use InputField for URLs for simplicity in this template, but it's easily swappable.

const workSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  client: z.string().min(1, 'Client is required'),
  industry: z.string().min(1, 'Industry is required'),
  services: z.string().min(1, 'Comma separated services required'), // we will split it
  categories: z.array(z.string()).min(1, 'Select at least one category'), // Actually backend accepts array of enums
  result: z.string().min(1, 'Result is required'),
  year: z.string().min(1, 'Year is required'),
  image: z.string().min(1, 'Image URL is required'),
  imageAlt: z.string().min(1, 'Image Alt is required'),
  imagePulicId: z.string().min(1, 'Public ID is required'),
  summary: z.string().min(1, 'Summary is required'),
  challenge: z.string().min(1, 'Challenge is required'),
  strategy: z.string().min(1, 'Strategy is required'),
  execution: z.string().min(1, 'Execution is required'),
  executionPoints: z.string(), // We'll split by newline
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

type FormValues = z.infer<typeof workSchema>;

interface Props {
  initialData?: IWork;
  onSubmit: (data: Partial<IWork>) => void;
  isLoading: boolean;
}

export default function WorkForm({ initialData, onSubmit, isLoading }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      title: initialData?.title || '',
      client: initialData?.client || '',
      industry: initialData?.industry || '',
      services: initialData?.services?.join(', ') || '',
      categories: initialData?.categories || ['Branding'],
      result: initialData?.result || '',
      year: initialData?.year || new Date().getFullYear().toString(),
      image: initialData?.image || '',
      imageAlt: initialData?.imageAlt || '',
      imagePulicId: initialData?.imagePulicId || 'dummy-id',
      summary: initialData?.summary || '',
      challenge: initialData?.challenge || '',
      strategy: initialData?.strategy || '',
      execution: initialData?.execution || '',
      executionPoints: initialData?.executionPoints?.join('\n') || '',
      status: initialData?.status || 'DRAFT',
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    // Transform flat strings to arrays where needed
    const transformed: Partial<IWork> = {
      ...values,
      services: values.services.split(',').map((s) => s.trim()).filter(Boolean), categories: values.categories as any,
      executionPoints: values.executionPoints.split('\n').map((s) => s.trim()).filter(Boolean),
      // Add other required transformations (e.g., results array mapping, etc.)
    };
    onSubmit(transformed);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <DynamicBackButton />
        <DynamicActionButton
          icon={Save}
          label={initialData ? 'Update Work' : 'Save Work'}
          isLoading={isLoading}
          type="submit"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border-border bg-card space-y-4 rounded-md border p-6 shadow-sm">
          <h2 className="text-primary-text mb-4 text-lg font-semibold">Basic Info</h2>
          <InputField label="Title" name="title" control={control} error={errors.title?.message} required />
          <InputField label="Client" name="client" control={control} error={errors.client?.message} required />
          <InputField label="Industry" name="industry" control={control} error={errors.industry?.message} required />
          <InputField label="Year" name="year" control={control} error={errors.year?.message} required />
          
          <SelectField
            label="Status"
            name="status"
            control={control}
            options={[
              { value: 'DRAFT', label: 'Draft' },
              { value: 'PUBLISHED', label: 'Published' },
              { value: 'ARCHIVED', label: 'Archived' },
            ]}
          />
        </div>

        <div className="border-border bg-card space-y-4 rounded-md border p-6 shadow-sm">
          <h2 className="text-primary-text mb-4 text-lg font-semibold">Media & Tags</h2>
          <InputField label="Main Image URL" name="image" control={control} error={errors.image?.message} required />
          <InputField label="Image Alt Text" name="imageAlt" control={control} error={errors.imageAlt?.message} required />
          <InputField label="Cloudinary Public ID" name="imagePulicId" control={control} error={errors.imagePulicId?.message} required />
          <InputField label="Services (Comma separated)" name="services" placeholder="Branding, Marketing" control={control} error={errors.services?.message} />
          
          {/* We simplify categories for this mockup, it should ideally be a MultiSelect */}
          <SelectField
            label="Primary Category"
            name="categories.0"
            control={control as any}
            options={[
              { value: 'Branding', label: 'Branding' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Design', label: 'Design' },
              { value: 'Video', label: 'Video' },
              { value: 'Web/App', label: 'Web/App' },
              { value: 'Automation', label: 'Automation' },
            ]}
          />
        </div>

        <div className="border-border bg-card md:col-span-2 space-y-4 rounded-md border p-6 shadow-sm">
          <h2 className="text-primary-text mb-4 text-lg font-semibold">Case Study Details</h2>
          <InputField label="Short Result" name="result" control={control} error={errors.result?.message} required />
          <TextAreaField label="Summary" name="summary" control={control} error={errors.summary?.message} required />
          <TextAreaField label="Challenge" name="challenge" control={control} error={errors.challenge?.message} required />
          <TextAreaField label="Strategy" name="strategy" control={control} error={errors.strategy?.message} required />
          <TextAreaField label="Execution" name="execution" control={control} error={errors.execution?.message} required />
          <TextAreaField 
            label="Execution Points (One per line)" 
            name="executionPoints" 
            control={control} 
            error={errors.executionPoints?.message} 
            rows={5} 
          />
        </div>
      </div>
    </form>
  );
}
