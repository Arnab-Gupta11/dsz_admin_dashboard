'use client';

import { useGetArticleByIdQuery, useUpdateArticleMutation } from '@/redux/features/articles/articles.api';
import { IArticle } from '@/types/models.types';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ArticleForm from '../../_components/ArticleForm';
import DynamicBackButton from '@/components/dashboard/DynamicBackButton/DynamicBackButton';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading: isFetching, isError } = useGetArticleByIdQuery(id);
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();

  const handleSubmit = async (formData: Partial<IArticle>) => {
    try {
      await updateArticle({ id, data: formData }).unwrap();
      toast.success('Article updated successfully');
      router.push('/dashboard/articles');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update article');
    }
  };

  if (isFetching) {
    return <div className="p-8 text-center text-sm text-secondary-text">Loading article details...</div>;
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-4">
        <DynamicBackButton />
        <div className="p-8 text-center text-sm text-danger">Failed to load article details.</div>
      </div>
    );
  }

  // Pre-process body for TipTap
  // Our backend returns body: [{ type: 'html', text: '...' }]
  // We need to convert it to a flat string for the RichTextField
  const processedData = { ...data.data };
  if (Array.isArray(processedData.body) && processedData.body[0]?.type === 'html') {
    processedData.body = processedData.body[0].text as any;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary-text text-2xl font-bold">Edit Article</h1>
        <p className="text-secondary-text mt-1 text-sm">Update your blog post content</p>
      </div>

      <ArticleForm initialData={processedData} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
}
