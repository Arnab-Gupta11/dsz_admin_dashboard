const fs = require('fs');
const path = require('path');

function createFormFiles(folder, entityName) {
  const FormCode = `'use client';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';

export default function ` + entityName + `Form({ initialData, onSubmit, isLoading }: any) {
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
}`;

  const CreateCode = `'use client';
import { useCreate` + entityName + `Mutation } from '@/redux/features/` + folder + `/` + folder + `.api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ` + entityName + `Form from '../_components/` + entityName + `Form';

export default function Create() {
  const [create, { isLoading }] = useCreate` + entityName + `Mutation();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Create ` + entityName + `</h1>
      </div>
      <` + entityName + `Form onSubmit={async (data: any) => {
        try {
          await create(data).unwrap();
          toast.success('Created successfully');
          router.push('/dashboard/` + folder + `');
        } catch(e) { toast.error('Failed to create'); }
      }} isLoading={isLoading} />
    </div>
  );
}`;

  const EditCode = `'use client';
import { useGet` + entityName + `ByIdQuery, useUpdate` + entityName + `Mutation } from '@/redux/features/` + folder + `/` + folder + `.api';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ` + entityName + `Form from '../../_components/` + entityName + `Form';

export default function Edit() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGet` + entityName + `ByIdQuery(id as string);
  const [update, { isLoading }] = useUpdate` + entityName + `Mutation();

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Edit ` + entityName + `</h1>
      </div>
      <` + entityName + `Form initialData={data?.data} onSubmit={async (formData: any) => {
        try {
          await update({ id, data: formData }).unwrap();
          toast.success('Updated successfully');
          router.push('/dashboard/` + folder + `');
        } catch(e) { toast.error('Failed to update'); }
      }} isLoading={isLoading} />
    </div>
  );
}`;

  const compDir = path.join('src/app/dashboard', folder, '_components');
  const createDir = path.join('src/app/dashboard', folder, 'create');
  const editDir = path.join('src/app/dashboard', folder, '[id]', 'edit');

  fs.mkdirSync(compDir, { recursive: true });
  fs.mkdirSync(createDir, { recursive: true });
  fs.mkdirSync(editDir, { recursive: true });

  fs.writeFileSync(path.join(compDir, entityName + 'Form.tsx'), FormCode);
  fs.writeFileSync(path.join(createDir, 'page.tsx'), CreateCode);
  fs.writeFileSync(path.join(editDir, 'page.tsx'), EditCode);
}

createFormFiles('services', 'Service');
createFormFiles('jobs', 'Job');
createFormFiles('testimonials', 'Testimonial');
