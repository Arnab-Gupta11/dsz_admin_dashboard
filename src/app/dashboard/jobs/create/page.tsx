'use client';
import { useCreateJobMutation } from '@/redux/features/jobs/jobs.api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import JobForm from '../_components/JobForm';

export default function Create() {
  const [create, { isLoading }] = useCreateJobMutation();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Create Job</h1>
      </div>
      <JobForm onSubmit={async (data: any) => {
        try {
          await create(data).unwrap();
          toast.success('Created successfully');
          router.push('/dashboard/jobs');
        } catch(e: any) { toast.error(e?.data?.message || e?.message || 'Failed to create'); }
      }} isLoading={isLoading} />
    </div>
  );
}