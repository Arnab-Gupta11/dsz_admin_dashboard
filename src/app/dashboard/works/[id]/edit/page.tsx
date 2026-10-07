'use client';
import FormSkeleton from "@/components/Loader/Skeletons/FormSkeleton";

import { useGetWorkByIdQuery, useUpdateWorkMutation } from '@/redux/features/works/works.api';
import { IWork } from '@/types/models.types';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import WorkForm from '../../_components/WorkForm';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';

export default function EditWorkPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading: isFetching, isError } = useGetWorkByIdQuery(id);
  const [updateWork, { isLoading: isUpdating }] = useUpdateWorkMutation();

  const handleSubmit = async (formData: Partial<IWork>) => {
    try {
      await updateWork({ id, data: formData }).unwrap();
      toast.success('Work updated successfully');
      router.push('/dashboard/works');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update work');
    }
  };

  if (isFetching) {
    return <FormSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-4">
        <DynamicBackButton />
        <div className="p-8 text-center text-sm text-danger">Failed to load work details.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary-text text-2xl font-bold">Edit Work</h1>
        <p className="text-secondary-text mt-1 text-sm">Update portfolio project details</p>
      </div>

      <WorkForm initialData={data.data} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
}
