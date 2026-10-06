'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import SelectField from '@/components/dashboard/Fields/SelectField/SelectField';
import RichTextField from '@/components/dashboard/Fields/RichTextField/RichTextField';
import FileUploadField from '@/components/dashboard/Fields/FileUploadField/FileUploadField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';
import { IArticle } from '@/types/models.types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Marketing Tips', 'AI Tools', 'Case Studies', 'DSZ News']),
  excerpt: z.string().min(1, 'Excerpt is required'),
  image: z.string().min(1, 'Image is required'),
  imageAlt: z.string().min(1, 'Image Alt is required'),
  author: z.string().min(1, 'Author is required'),
  body: z.string().min(1, 'Content is required'), // we send HTML string, backend accepts Mixed
  readTime: z.string().min(1, 'Read time is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

type FormValues = z.infer<typeof articleSchema>;

interface Props {
  initialData?: IArticle;
  onSubmit: (data: Partial<IArticle>) => void;
  isLoading: boolean;
}

export default function ArticleForm({ initialData, onSubmit, isLoading }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || 'Marketing Tips',
      excerpt: initialData?.excerpt || '',
      image: initialData?.image || '',
      imageAlt: initialData?.imageAlt || '',
      author: initialData?.author || 'DSZ Team',
      body: typeof initialData?.body === 'string' ? initialData.body : '', // Handle string
      readTime: initialData?.readTime || '5 min read',
      status: initialData?.status || 'DRAFT',
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    // Send directly, backend `body: [Schema.Types.Mixed]` accepts array, 
    // wait, if backend expects Array, sending a string might be tricky.
    // We will wrap the HTML string in an array: `body: [{ type: "html", text: values.body }]`
    const transformed: Partial<IArticle> = {
      ...values,
      body: [{ type: 'html', text: values.body }] as any,
    };
    onSubmit(transformed);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <DynamicBackButton />
        <DynamicActionButton
          icon={Save}
          label={initialData ? 'Update Article' : 'Save Article'}
          isLoading={isLoading}
          type="submit"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="border-border bg-card space-y-4 rounded-md border p-6 shadow-sm md:col-span-2">
          <h2 className="text-primary-text mb-4 text-lg font-semibold">Article Content</h2>
          <InputField label="Title" name="title" control={control} error={errors.title?.message} required />
          <TextAreaField label="Excerpt" name="excerpt" control={control} error={errors.excerpt?.message} required />
          <RichTextField label="Body Content" name="body" control={control} error={errors.body?.message} required />
        </div>

        <div className="space-y-6">
          <div className="border-border bg-card space-y-4 rounded-md border p-6 shadow-sm">
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
            <SelectField
              label="Category"
              name="category"
              control={control}
              options={[
                { value: 'Marketing Tips', label: 'Marketing Tips' },
                { value: 'AI Tools', label: 'AI Tools' },
                { value: 'Case Studies', label: 'Case Studies' },
                { value: 'DSZ News', label: 'DSZ News' },
              ]}
            />
            <InputField label="Author" name="author" control={control} error={errors.author?.message} required />
            <InputField label="Read Time" name="readTime" control={control} error={errors.readTime?.message} required />
          </div>

          <div className="border-border bg-card space-y-4 rounded-md border p-6 shadow-sm">
            <h2 className="text-primary-text mb-4 text-lg font-semibold">Media</h2>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <FileUploadField
                  label="Cover Image"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message}
                  required
                />
              )}
            />
            <InputField label="Image Alt Text" name="imageAlt" control={control} error={errors.imageAlt?.message} required />
          </div>
        </div>
      </div>
    </form>
  );
}
