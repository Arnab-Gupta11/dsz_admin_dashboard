'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import SelectField from '@/components/dashboard/Fields/SelectField/SelectField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import FileUploadField from '@/components/dashboard/Fields/FileUploadField/FileUploadField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';
import { useForm, useFieldArray } from 'react-hook-form';
import { Save, Plus, Trash2 } from 'lucide-react';
import { IService } from '@/types/models.types';

export default function ServiceForm({ initialData, onSubmit, isLoading }: any) {
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<IService>>({
    defaultValues: initialData || {
      title: '',
      tag: '',
      short: '',
      description: '',
      whoFor: '',
      image: '',
      status: 'PUBLISHED',
      whatWeDo: [''],
      deliverables: [''],
    },
  });

  const { fields: whatWeDoFields, append: appendWhatWeDo, remove: removeWhatWeDo } = useFieldArray({
    control,
    name: 'whatWeDo' as never,
  });

  const { fields: deliverablesFields, append: appendDeliverables, remove: removeDeliverables } = useFieldArray({
    control,
    name: 'deliverables' as never,
  });

  const imageValue = watch('image');

  const onFormSubmit = (values: any) => {
    // Filter out empty arrays
    values.whatWeDo = values.whatWeDo?.filter((v: any) => v && typeof v === 'string' && v.trim() !== '') || [];
    values.deliverables = values.deliverables?.filter((v: any) => v && typeof v === 'string' && v.trim() !== '') || [];
    
    // Type casting
    const transformed = {
      ...values,
      whatWeDo: values.whatWeDo as string[],
      deliverables: values.deliverables as string[],
    };
    
    onSubmit(transformed);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <DynamicBackButton />
        <DynamicActionButton icon={Save} label={initialData ? "Update Service" : "Save Service"} isLoading={isLoading} type="submit" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Title" name="title" control={control} required />
              <InputField label="Tag (e.g. branding)" name="tag" control={control} required />
            </div>

            <TextAreaField label="Short Tagline" name="short" control={control} required rows={2} />
            <TextAreaField label="Full Description" name="description" control={control} required rows={4} />
            <TextAreaField label="Who is this for? (whoFor)" name="whoFor" control={control} required rows={2} />
          </div>

          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-semibold">What We Do</h2>
              <button type="button" onClick={() => appendWhatWeDo('') as any} className="text-primary hover:bg-primary/10 flex items-center gap-1 text-sm font-medium px-2 py-1 rounded transition-colors">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {whatWeDoFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <InputField label=""
                      name={`whatWeDo.${index}`}
                      control={control}
                      placeholder="e.g. Brand discovery workshops"
                    />
                  </div>
                  {whatWeDoFields.length > 1 && (
                    <button type="button" onClick={() => removeWhatWeDo(index)} className="text-danger hover:bg-danger/10 p-2 rounded transition-colors mt-1">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-semibold">Deliverables</h2>
              <button type="button" onClick={() => appendDeliverables('') as any} className="text-primary hover:bg-primary/10 flex items-center gap-1 text-sm font-medium px-2 py-1 rounded transition-colors">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {deliverablesFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <InputField label=""
                      name={`deliverables.${index}`}
                      control={control}
                      placeholder="e.g. Brand strategy deck"
                    />
                  </div>
                  {deliverablesFields.length > 1 && (
                    <button type="button" onClick={() => removeDeliverables(index)} className="text-danger hover:bg-danger/10 p-2 rounded transition-colors mt-1">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border-border border p-6 rounded-md shadow-sm space-y-6">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Publishing</h2>
            <SelectField
              label="Status"
              name="status"
              control={control}
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
            />
          </div>
        </div>
      </div>
    </form>
  );
}
