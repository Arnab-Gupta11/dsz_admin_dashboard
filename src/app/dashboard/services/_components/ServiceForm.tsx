'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import SelectField from '@/components/dashboard/Fields/SelectField/SelectField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import FileUploadField from '@/components/dashboard/Fields/FileUploadField/FileUploadField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Plus, Trash2 } from 'lucide-react';
import { IService } from '@/types/models.types';
import { useEffect } from 'react';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  tag: z.string().min(1, 'Tag is required'),
  short: z.string().min(1, 'Short Tagline is required'),
  description: z.string().min(10, 'Full description must be at least 10 characters'),
  whoFor: z.string().min(1, 'This field is required'),
  image: z.string().url('Image is required (Must be a valid URL)'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  whatWeDo: z.array(z.object({ value: z.string().min(1, 'Cannot be empty') })).min(1, 'Add at least one item'),
  deliverables: z.array(z.object({ value: z.string().min(1, 'Cannot be empty') })).min(1, 'Add at least one item'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServiceForm({ initialData, onSubmit, isLoading }: any) {
  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    defaultValues: {
      title: initialData?.title || '',
      tag: initialData?.tag || '',
      short: initialData?.short || '',
      description: initialData?.description || '',
      whoFor: initialData?.whoFor || '',
      image: initialData?.image || '',
      status: initialData?.status || 'PUBLISHED',
      whatWeDo: initialData?.whatWeDo?.length 
        ? initialData.whatWeDo.map((val: string) => ({ value: val })) 
        : [{ value: '' }],
      deliverables: initialData?.deliverables?.length 
        ? initialData.deliverables.map((val: string) => ({ value: val })) 
        : [{ value: '' }],
    },
  });

  const { fields: whatWeDoFields, append: appendWhatWeDo, remove: removeWhatWeDo } = useFieldArray({
    control,
    name: 'whatWeDo',
  });

  const { fields: deliverablesFields, append: appendDeliverables, remove: removeDeliverables } = useFieldArray({
    control,
    name: 'deliverables',
  });

  const imageValue = watch('image');

  const onFormSubmit = (values: ServiceFormValues) => {
    // Map objects back to strings and filter
    const mappedWhatWeDo = values.whatWeDo.map(obj => obj.value).filter(v => v.trim() !== '');
    const mappedDeliverables = values.deliverables.map(obj => obj.value).filter(v => v.trim() !== '');
    
    onSubmit({
      ...values,
      whatWeDo: mappedWhatWeDo,
      deliverables: mappedDeliverables,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <DynamicBackButton />
        <DynamicActionButton 
          icon={Save} 
          label={initialData ? "Update Service" : "Save Service"} 
          isLoading={isLoading} 
          disabled={!isValid || isLoading}
          showIcon
          type="submit" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Title" name="title" control={control as any} error={errors.title?.message} required />
              <InputField label="Tag (e.g. branding)" name="tag" control={control as any} error={errors.tag?.message} required />
            </div>

            <TextAreaField label="Short Tagline" name="short" control={control as any} error={errors.short?.message} required rows={2} />
            <TextAreaField label="Full Description" name="description" control={control as any} error={errors.description?.message} required rows={4} />
            <TextAreaField label="Who is this for?" name="whoFor" control={control as any} error={errors.whoFor?.message} required rows={2} />
          </div>

          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-semibold">What We Do</h2>
              <button type="button" onClick={() => appendWhatWeDo({ value: '' })} className="text-primary hover:bg-primary/10 flex items-center gap-1 text-sm font-medium px-2 py-1 rounded transition-colors">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {whatWeDoFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <InputField label=""
                      name={`whatWeDo.${index}.value`}
                      control={control as any}
                      placeholder="e.g. Brand discovery workshops"
                      error={errors.whatWeDo?.[index]?.value?.message}
                    />
                  </div>
                  {whatWeDoFields.length > 1 && (
                    <button type="button" onClick={() => removeWhatWeDo(index)} className="text-danger hover:bg-danger/10 p-2 rounded transition-colors mt-2">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              {errors.whatWeDo?.root?.message && <p className="text-danger text-sm">{errors.whatWeDo.root.message}</p>}
            </div>
          </div>

          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-semibold">Deliverables</h2>
              <button type="button" onClick={() => appendDeliverables({ value: '' })} className="text-primary hover:bg-primary/10 flex items-center gap-1 text-sm font-medium px-2 py-1 rounded transition-colors">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {deliverablesFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <InputField label=""
                      name={`deliverables.${index}.value`}
                      control={control as any}
                      placeholder="e.g. Brand strategy deck"
                      error={errors.deliverables?.[index]?.value?.message}
                    />
                  </div>
                  {deliverablesFields.length > 1 && (
                    <button type="button" onClick={() => removeDeliverables(index)} className="text-danger hover:bg-danger/10 p-2 rounded transition-colors mt-2">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              {errors.deliverables?.root?.message && <p className="text-danger text-sm">{errors.deliverables.root.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Publishing</h2>
            <SelectField
              label="Status"
              name="status"
              control={control as any}
              options={[
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
            />
          </div>
          
          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Media</h2>
            <FileUploadField
              label="Service Background Image"
              value={imageValue}
              onChange={(url) => setValue('image', (url as string) || '', { shouldValidate: true })}
              uploadType="image"
              error={errors.image?.message}
              required
            />
          </div>
        </div>
      </div>
    </form>
  );
}
