'use client';

import { useCreateArticleMutation } from '@/redux/features/articles/articles.api';
import { IArticle } from '@/types/models.types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ArticleForm from '../_components/ArticleForm';

export default function CreateArticlePage() {
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const router = useRouter();

  const handleSubmit = async (data: Partial<IArticle>) => {
    try {
      await createArticle(data).unwrap();
      toast.success('Article created successfully');
      router.push('/dashboard/articles');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create article');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary-text text-2xl font-bold">Create New Article</h1>
        <p className="text-secondary-text mt-1 text-sm">Draft a new blog post</p>
      </div>

      <ArticleForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
