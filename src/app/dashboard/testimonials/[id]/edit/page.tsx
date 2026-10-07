'use client';
import { useGetTestimonialByIdQuery, useUpdateTestimonialMutation } from '@/redux/features/testimonials/testimonials.api';
import FormSkeleton from "@/components/Loader/Skeletons/FormSkeleton";
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TestimonialForm from '../../_components/TestimonialForm';

export default function Edit() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetTestimonialByIdQuery(id as string);
  const [update, { isLoading }] = useUpdateTestimonialMutation();

  if (isFetching) return <FormSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Edit Testimonial</h1>
      </div>
      <TestimonialForm initialData={data?.data} onSubmit={async (formData: any) => {
        try {
          await update({ id: id as string, data: formData }).unwrap();
          toast.success('Updated successfully');
          router.push('/dashboard/testimonials');
        } catch(e: any) { toast.error(e?.data?.message || e?.message || 'Failed to update'); }
      }} isLoading={isLoading} />
    </div>
  );
}