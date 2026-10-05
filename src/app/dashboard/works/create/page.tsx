'use client';

import { useCreateWorkMutation } from '@/redux/features/works/works.api';
import { IWork } from '@/types/models.types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import WorkForm from '../_components/WorkForm';

export default function CreateWorkPage() {
  const [createWork, { isLoading }] = useCreateWorkMutation();
  const router = useRouter();

  const handleSubmit = async (data: Partial<IWork>) => {
    try {
      await createWork(data).unwrap();
      toast.success('Work created successfully');
      router.push('/dashboard/works');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create work');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary-text text-2xl font-bold">Create New Work</h1>
        <p className="text-secondary-text mt-1 text-sm">Add a new project to your portfolio</p>
      </div>

      <WorkForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
