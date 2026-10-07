'use client';
import { useGetJobByIdQuery, useUpdateJobMutation } from '@/redux/features/jobs/jobs.api';
import FormSkeleton from "@/components/Loader/Skeletons/FormSkeleton";
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import JobForm from '../../_components/JobForm';

export default function Edit() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetJobByIdQuery(id as string);
  const [update, { isLoading }] = useUpdateJobMutation();

  if (isFetching) return <FormSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Edit Job</h1>
      </div>
      <JobForm initialData={data?.data} onSubmit={async (formData: any) => {
        try {
          await update({ id: id as string, data: formData }).unwrap();
          toast.success('Updated successfully');
          router.push('/dashboard/jobs');
        } catch(e: any) { toast.error(e?.data?.message || e?.message || 'Failed to update'); }
      }} isLoading={isLoading} />
    </div>
  );
}