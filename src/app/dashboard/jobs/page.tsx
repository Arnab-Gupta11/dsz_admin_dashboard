'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicTableActions from '@/components/dashboard/DynamicTableActions/DynamicTableActions';
import DynamicTableFilterBar from '@/components/dashboard/DynamicTableFilterBar/DynamicTableFilterBar';
import EmptyState from '@/components/dashboard/EmptyState/EmptyState';
import { useModal } from '@/context/ModalContext';
import { useGetJobsQuery, useDeleteJobMutation } from '@/redux/features/jobs/jobs.api';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';

  const { data, isLoading, isError } = useGetJobsQuery({ page, limit, search });
  const [deleteItem, { isLoading: isDeleting }] = useDeleteJobMutation();
  const { openModal, closeModal } = useModal();

  const items = data?.data || [];
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    openModal({ view: 'DELETE_CONFIRM', data: { 
      onConfirm: async () => {
        try {
          await deleteItem(id).unwrap();
          toast.success('Deleted successfully');
          closeModal();
        } catch (error) {
          toast.error('Failed to delete');
        }
      },
      isLoading: isDeleting,
     } });
  };

  const columns = [
    
    { header: 'Title', accessor: 'title' as any },
    { header: 'Department', accessor: 'department' as any },
    { header: 'Type', accessor: 'type' as any },
    {
      header: 'Status',
      cell: (row: any) => <DynamicBadge text={row.status as string} color="#34796f" />
    },
    {
      header: 'Actions',
      cell: (row: any) => <DynamicTableActions actions={[{ type: 'edit', href: `/dashboard/jobs/${row._id}/edit` }, { type: 'delete', onClick: () => handleDelete(row._id) }]} />
    }

  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">Careers / Jobs</h1>
          <p className="text-secondary-text mt-1 text-sm">Manage open job positions</p>
        </div>
        
        <Link href="/dashboard/jobs/create">
          <DynamicActionButton icon={Plus} label="Add New" />
        </Link>
      </div>

      <div className="border-border bg-card rounded-md border shadow-sm">
        <DynamicTableFilterBar fields={[{ name: 'search', type: 'search', placeholder: 'Search...' }]} />
        
        {isLoading ? (
          <div className="p-8 text-center text-sm text-secondary-text">Loading...</div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-danger">Failed to load data</div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No items found"
            description="There is no data to display right now."
          />
        ) : (
          <>
            <CustomTable columns={columns} data={items} />
            <div className="border-border border-t p-4">
              <CustomPagination meta={meta!} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
