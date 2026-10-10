'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import SelectField from '@/components/dashboard/Fields/SelectField/SelectField';
import StringArrayField from '@/components/dashboard/Fields/StringArrayField/StringArrayField';
import DatePickerField from '@/components/dashboard/Fields/DatePickerField/DatePickerField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IJob } from '@/types/models.types';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  openings: z.coerce.number().min(1, 'At least 1 opening is required'),
  type: z.enum(['Full-time', 'Part-time', 'Internship', 'Contract']),
  location: z.enum(['On-site', 'Remote', 'Hybrid']),
  city: z.string().min(1, 'City is required'),
  experience: z.string().min(1, 'Experience is required'),
  salary: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  short: z.string().min(1, 'Short description is required'),
  overview: z.string().min(1, 'Overview is required'),
  responsibilities: z.array(z.string()).min(1, 'At least one responsibility is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
  niceToHave: z.array(z.string()),
  tools: z.array(z.string()),
  benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

type FormValues = z.infer<typeof jobSchema>;

interface Props {
  initialData?: IJob;
  onSubmit: (data: Partial<IJob>) => void;
  isLoading: boolean;
}

export default function JobForm({ initialData, onSubmit, isLoading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      openings: initialData?.openings || 1,
      type: initialData?.type || 'Full-time',
      location: initialData?.location || 'On-site',
      city: initialData?.city || 'Chittagong',
      experience: initialData?.experience || '1-3 years',
      salary: initialData?.salary || '',
      deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
      short: initialData?.short || '',
      overview: initialData?.overview || '',
      responsibilities: initialData?.responsibilities || [''],
      requirements: initialData?.requirements || [''],
      niceToHave: initialData?.niceToHave || [],
      tools: initialData?.tools || [],
      benefits: initialData?.benefits || ['Competitive salary'],
      status: initialData?.status || 'DRAFT',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <DynamicBackButton />
        <DynamicActionButton
          icon={Save}
          label={initialData ? 'Update Job' : 'Save Job'}
          isLoading={isLoading}
          type="submit"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="border-border bg-card rounded-md border p-6 shadow-sm space-y-4">
            <h2 className="text-primary-text mb-4 text-lg font-semibold">Basic Information</h2>
            <InputField label="Title" name="title" control={control} error={errors.title?.message} required />
            <TextAreaField label="Short Description" name="short" control={control} error={errors.short?.message} required />
            <TextAreaField label="Overview" name="overview" control={control} error={errors.overview?.message} required />
          </div>

          <div className="border-border bg-card rounded-md border p-6 shadow-sm space-y-6">
            <h2 className="text-primary-text mb-4 text-lg font-semibold">Details & Requirements</h2>
            <StringArrayField label="Responsibilities" name="responsibilities" control={control} error={errors.responsibilities?.message} required />
            <StringArrayField label="Requirements" name="requirements" control={control} error={errors.requirements?.message} required />
            <StringArrayField label="Nice to Have" name="niceToHave" control={control} error={errors.niceToHave?.message} />
            <StringArrayField label="Tools / Tech Stack" name="tools" control={control} error={errors.tools?.message} />
            <StringArrayField label="Benefits" name="benefits" control={control} error={errors.benefits?.message} required />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-border bg-card rounded-md border p-6 shadow-sm space-y-4">
            <h2 className="text-primary-text mb-4 text-lg font-semibold">Publishing</h2>
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
            <InputField label="Number of Openings" name="openings" control={control} error={errors.openings?.message} required type="number" />
            <SelectField
              label="Employment Type"
              name="type"
              control={control}
              options={[
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Internship', label: 'Internship' },
                { value: 'Contract', label: 'Contract' },
              ]}
            />
            <SelectField
              label="Location"
              name="location"
              control={control}
              options={[
                { value: 'On-site', label: 'On-site' },
                { value: 'Remote', label: 'Remote' },
                { value: 'Hybrid', label: 'Hybrid' },
              ]}
            />
            <InputField label="City" name="city" control={control} error={errors.city?.message} required />
            <InputField label="Experience Required" name="experience" control={control} error={errors.experience?.message} required />
            <InputField label="Salary" name="salary" control={control} error={errors.salary?.message} />
          </div>

          <div className="border-border bg-card rounded-md border p-6 shadow-sm space-y-4">
            <h2 className="text-primary-text mb-4 text-lg font-semibold">Dates</h2>
            <DatePickerField label="Deadline" name="deadline" control={control} error={errors.deadline?.message} required />
          </div>
        </div>
      </div>
    </form>
  );
}