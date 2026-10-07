'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import TableSkeleton from "@/components/Loader/Skeletons/TableSkeleton";
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicTableActions from '@/components/dashboard/DynamicTableActions/DynamicTableActions';
import DynamicTableFilterBar from '@/components/dashboard/DynamicTableFilterBar/DynamicTableFilterBar';
import EmptyState from '@/components/dashboard/EmptyState/EmptyState';
import { useModal } from '@/context/ModalContext';
import { useGetContactsQuery, useDeleteContactMutation } from '@/redux/features/contacts/contacts.api';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';

  const { data, isLoading, isError } = useGetContactsQuery({ page, limit, search });
  const [deleteItem, { isLoading: isDeleting }] = useDeleteContactMutation();
  const { openModal, closeModal } = useModal();

  const items = data?.data || [];
  const meta = data?.meta;

  const handleDelete = (id: string, name?: string) => {
    openModal({ view: 'DELETE_CONFIRM', data: { deleteItem: name, 
      onConfirm: async () => {
        try {
          await deleteItem(id).unwrap();
          toast.success('Deleted successfully');
          closeModal();
        } catch(error: any) { toast.error(error?.data?.message || error?.message || 'Failed to delete'); }
      },
      isLoading: isDeleting,
     } });
  };

  const columns = [
    
    { header: 'Name', accessor: 'name' as any },
    { header: 'Contact', accessor: 'contact' as any },
    { header: 'Need', accessor: 'need' as any },
    {
      header: 'Status',
      cell: (row: any) => <DynamicBadge text={row.status as string} color="#34796f" />
    },
    {
      header: 'Actions',
      cell: (row: any) => <DynamicTableActions actions={[{ type: 'delete', onClick: () => handleDelete(row._id, row.name) }]} />
    }

  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">Inquiries / Contacts</h1>
          <p className="text-secondary-text mt-1 text-sm">View messages from your website</p>
        </div>
        
      </div>

      <div className="border-border bg-card rounded-md border shadow-sm">
        <DynamicTableFilterBar fields={[{ name: 'search', type: 'search', placeholder: 'Search...' }]} />
        
        {isLoading ? (
          <div className="p-4"><TableSkeleton rowCount={5} columnCount={5} /></div>
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
              <CustomPagination meta={meta || { total: items.length, limit, totalPages: 1 }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
