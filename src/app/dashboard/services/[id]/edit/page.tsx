'use client';
import { useGetServiceByIdQuery, useUpdateServiceMutation } from '@/redux/features/services/services.api';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ServiceForm from '../../_components/ServiceForm';

export default function Edit() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetServiceByIdQuery(id as string);
  const [update, { isLoading }] = useUpdateServiceMutation();

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Edit Service</h1>
      </div>
      <ServiceForm initialData={data?.data} onSubmit={async (formData: any) => {
        try {
          await update({ id: id as string, data: formData }).unwrap();
          toast.success('Updated successfully');
          router.push('/dashboard/services');
        } catch(e) { toast.error('Failed to update'); }
      }} isLoading={isLoading} />
    </div>
  );
}