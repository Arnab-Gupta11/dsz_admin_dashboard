'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicTableActions from '@/components/dashboard/DynamicTableActions/DynamicTableActions';
import DynamicTableFilterBar from '@/components/dashboard/DynamicTableFilterBar/DynamicTableFilterBar';
import EmptyState from '@/components/dashboard/EmptyState/EmptyState';
import { useModal } from '@/context/ModalContext';
import { useGetWorksQuery, useDeleteWorkMutation } from '@/redux/features/works/works.api';
import { IWork } from '@/types/models.types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function WorksPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';

  const { data, isLoading, isError } = useGetWorksQuery({ page, limit, search });
  const [deleteWork, { isLoading: isDeleting }] = useDeleteWorkMutation();
  const { openModal, closeModal } = useModal();

  const works = data?.data || [];
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    openModal({ view: 'DELETE_CONFIRM', data: { 
      onConfirm: async () => {
        try {
          await deleteWork(id).unwrap();
          toast.success('Work deleted successfully');
          closeModal();
        } catch (error) {
          toast.error('Failed to delete work');
        }
      },
      isLoading: isDeleting,
     } });
  };

  const columns = [
    {
      header: 'Title',
      accessor: 'title' as keyof IWork,
    },
    {
      header: 'Service',
      cell: (row: IWork) => (
        <span>{row.service?.title || 'No Service'}</span>
      ),
    },
    {
      header: 'Client',
      accessor: 'client' as keyof IWork,
    },
    {
      header: 'Status',
      cell: (row: IWork) => (
        <DynamicBadge text={row.status as string} color="#34796f" />
      ),
    },
    {
      header: 'Actions',
      cell: (row: IWork) => (
        <DynamicTableActions actions={[{ type: 'edit', href: `/dashboard/works/${row._id}/edit` }, { type: 'delete', onClick: () => handleDelete(row._id) }]} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">Works / Portfolio</h1>
          <p className="text-secondary-text mt-1 text-sm">Manage your portfolio projects</p>
        </div>
        <Link href="/dashboard/works/create">
          <DynamicActionButton icon={Plus} label="Add New Work" />
        </Link>
      </div>

      <div className="border-border bg-card rounded-md border shadow-sm">
        <DynamicTableFilterBar fields={[{ name: 'search', type: 'search', placeholder: 'Search works...' }]} />
        
        {isLoading ? (
          <div className="p-8 text-center text-sm text-secondary-text">Loading...</div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-danger">Failed to load works</div>
        ) : works.length === 0 ? (
          <EmptyState
            title="No works found"
            description="Get started by creating your first portfolio project."
          />
        ) : (
          <>
            <CustomTable columns={columns} data={works} />
            <div className="border-border border-t p-4">
              <CustomPagination meta={meta!} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
