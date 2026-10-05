'use client';
import { useCreateServiceMutation } from '@/redux/features/services/services.api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ServiceForm from '../_components/ServiceForm';

export default function Create() {
  const [create, { isLoading }] = useCreateServiceMutation();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Create Service</h1>
      </div>
      <ServiceForm onSubmit={async (data: any) => {
        try {
          const res: any = await create(data).unwrap();
          toast.success(res?.message || 'Service created successfully!');
          router.push('/dashboard/services');
        } catch(e: any) { 
          const errorMsg = e?.data?.message || e?.message || 'Failed to create service';
          toast.error(errorMsg); 
        }
      }} isLoading={isLoading} />
    </div>
  );
}
