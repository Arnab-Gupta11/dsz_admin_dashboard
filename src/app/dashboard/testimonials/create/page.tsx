'use client';
import { useCreateTestimonialMutation } from '@/redux/features/testimonials/testimonials.api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TestimonialForm from '../_components/TestimonialForm';

export default function Create() {
  const [create, { isLoading }] = useCreateTestimonialMutation();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-text">Create Testimonial</h1>
      </div>
      <TestimonialForm onSubmit={async (data: any) => {
        try {
          await create(data).unwrap();
          toast.success('Created successfully');
          router.push('/dashboard/testimonials');
        } catch(e) { toast.error('Failed to create'); }
      }} isLoading={isLoading} />
    </div>
  );
}