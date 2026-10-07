'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicTableActions from '@/components/dashboard/DynamicTableActions/DynamicTableActions';
import DynamicTableFilterBar from '@/components/dashboard/DynamicTableFilterBar/DynamicTableFilterBar';
import EmptyState from '@/components/dashboard/EmptyState/EmptyState';
import TableSkeleton from '@/components/Loader/Skeletons/TableSkeleton';
import { useModal } from '@/context/ModalContext';
import { useGetArticlesQuery, useDeleteArticleMutation } from '@/redux/features/articles/articles.api';
import { IArticle } from '@/types/models.types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || undefined;

  const { data, isLoading, isError } = useGetArticlesQuery({ page, limit, search, status });
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const { openModal, closeModal } = useModal();

  const articles = data?.data || [];
  const meta = data?.meta;

  const handleDelete = (id: string, title?: string) => {
    openModal({ view: 'DELETE_CONFIRM', data: { deleteItem: title, 
      onConfirm: async () => {
        try {
          await deleteArticle(id).unwrap();
          toast.success('Article deleted successfully');
          closeModal();
        } catch(error: any) { toast.error(error?.data?.message || error?.message || 'Failed to delete article'); }
      },
      isLoading: isDeleting,
     } });
  };

  const columns = [
    {
      header: 'Title',
      accessor: 'title' as keyof IArticle,
    },
    {
      header: 'Category',
      accessor: 'category' as keyof IArticle,
    },
    {
      header: 'Author',
      accessor: 'author' as keyof IArticle,
    },
    {
      header: 'Status',
      cell: (row: IArticle) => (
        <DynamicBadge text={row.status as string} color="#34796f" />
      ),
    },
    {
      header: 'Actions',
      cell: (row: IArticle) => (
        <DynamicTableActions actions={[{ type: 'edit', href: `/dashboard/articles/${row._id}/edit` }, { type: 'delete', onClick: () => handleDelete(row._id, row.title) }]} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">Articles / Insights</h1>
          <p className="text-secondary-text mt-1 text-sm">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/articles/create">
          <DynamicActionButton icon={Plus} label="Add New Article" />
        </Link>
      </div>

      <div className="border-border bg-card rounded-md border shadow-sm">
        <div className="p-4 border-b border-border">
          <DynamicTableFilterBar
            fields={[
              { name: "search", type: "search", placeholder: "Search by Title or Excerpt..." },
              {
                name: "status",
                type: "select",
                placeholder: "Filter by Status",
                options: [
                  { label: "All Statuses", value: "all" },
                  { label: "Draft", value: "DRAFT" },
                  { label: "Published", value: "PUBLISHED" },
                  { label: "Archived", value: "ARCHIVED" },
                ],
              },
            ]}
          />
        </div>
        
        {isLoading ? (
          <div className="p-4"><TableSkeleton rowCount={5} columnCount={5} /></div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-danger">Failed to load articles</div>
        ) : articles.length === 0 ? (
          <EmptyState
            title="No articles found"
            description="Get started by creating your first blog post."
          />
        ) : (
          <>
            <CustomTable columns={columns} data={articles} />
            <div className="border-border border-t p-4">
              <CustomPagination meta={meta!} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
