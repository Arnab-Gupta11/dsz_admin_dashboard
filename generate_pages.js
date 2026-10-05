const fs = require('fs');
const path = require('path');

function createPage(folder, title, subtitle, apiHook, mutationHook, columnsCode, accessor) {
  const code = `'use client';

import CustomPagination from '@/components/dashboard/CustomPagination/CustomPagination';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import DynamicActionButton from '@/components/dashboard/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicTableActions from '@/components/dashboard/DynamicTableActions/DynamicTableActions';
import DynamicTableFilterBar from '@/components/dashboard/DynamicTableFilterBar/DynamicTableFilterBar';
import EmptyState from '@/components/dashboard/EmptyState/EmptyState';
import { useModal } from '@/context/ModalContext';
import { ${apiHook}, ${mutationHook} } from '@/redux/features/${folder}/${folder}.api';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';

  const { data, isLoading, isError } = ${apiHook}({ page, limit, search });
  const [deleteItem, { isLoading: isDeleting }] = ${mutationHook}();
  const { openModal, closeModal } = useModal();

  const items = data?.data || [];
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    openModal('DELETE_CONFIRM', {
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
    });
  };

  const columns = [
    ${columnsCode}
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">${title}</h1>
          <p className="text-secondary-text mt-1 text-sm">${subtitle}</p>
        </div>
        ${folder !== 'contacts' && folder !== 'jobApplications' ? `
        <Link href="/dashboard/${folder}/create">
          <DynamicActionButton icon={Plus} label="Add New" />
        </Link>` : ''}
      </div>

      <div className="border-border bg-card rounded-md border shadow-sm">
        <DynamicTableFilterBar searchPlaceholder="Search..." />
        
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
`;
  const dir = path.join('src/app/dashboard', folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), code);
}

// Generate Services List
createPage('services', 'Services', 'Manage your digital services', 'useGetServicesQuery', 'useDeleteServiceMutation', `
    { header: 'Title', accessor: 'title' as any },
    { header: 'Category', accessor: 'category' as any },
    {
      header: 'Status',
      cell: (row: any) => <DynamicBadge status={row.status} successVariants={['PUBLISHED']} warningVariants={['DRAFT']} dangerVariants={['ARCHIVED']} />
    },
    {
      header: 'Actions',
      cell: (row: any) => <DynamicTableActions onEdit={\`/dashboard/services/\${row._id}/edit\`} onDelete={() => handleDelete(row._id)} />
    }
`, 'IService');

// Generate Jobs List
createPage('jobs', 'Careers / Jobs', 'Manage open job positions', 'useGetJobsQuery', 'useDeleteJobMutation', `
    { header: 'Title', accessor: 'title' as any },
    { header: 'Department', accessor: 'department' as any },
    { header: 'Type', accessor: 'type' as any },
    {
      header: 'Status',
      cell: (row: any) => <DynamicBadge status={row.status} successVariants={['PUBLISHED']} warningVariants={['DRAFT']} dangerVariants={['ARCHIVED']} />
    },
    {
      header: 'Actions',
      cell: (row: any) => <DynamicTableActions onEdit={\`/dashboard/jobs/\${row._id}/edit\`} onDelete={() => handleDelete(row._id)} />
    }
`, 'IJob');

// Generate Contacts List
createPage('contacts', 'Inquiries / Contacts', 'View messages from your website', 'useGetContactsQuery', 'useDeleteContactMutation', `
    { header: 'Name', accessor: 'name' as any },
    { header: 'Contact', accessor: 'contact' as any },
    { header: 'Need', accessor: 'need' as any },
    {
      header: 'Status',
      cell: (row: any) => <DynamicBadge status={row.status} successVariants={['REPLIED', 'READ']} warningVariants={['NEW']} dangerVariants={['ARCHIVED']} />
    },
    {
      header: 'Actions',
      cell: (row: any) => <DynamicTableActions onDelete={() => handleDelete(row._id)} />
    }
`, 'IContact');

// Generate Job Applications List
createPage('jobApplications', 'Job Applications', 'Review candidate CVs', 'useGetJobApplicationsQuery', 'useDeleteJobApplicationMutation', `
    { header: 'Candidate', accessor: 'name' as any },
    { header: 'Email', accessor: 'email' as any },
    { header: 'Notice', accessor: 'notice' as any },
    {
      header: 'CV',
      cell: (row: any) => <a href={row.cvUrl} target="_blank" rel="noreferrer" className="text-primary underline">View CV</a>
    },
    {
      header: 'Status',
      cell: (row: any) => <DynamicBadge status={row.status} successVariants={['SHORTLISTED']} warningVariants={['NEW', 'REVIEWING']} dangerVariants={['REJECTED']} />
    },
    {
      header: 'Actions',
      cell: (row: any) => <DynamicTableActions onDelete={() => handleDelete(row._id)} />
    }
`, 'IJobApplication');

// Generate Testimonials List
createPage('testimonials', 'Testimonials', 'Manage client reviews', 'useGetTestimonialsQuery', 'useDeleteTestimonialMutation', `
    { header: 'Name', accessor: 'name' as any },
    { header: 'Company', accessor: 'company' as any },
    {
      header: 'Status',
      cell: (row: any) => <DynamicBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} successVariants={['ACTIVE']} warningVariants={['INACTIVE']} />
    },
    {
      header: 'Actions',
      cell: (row: any) => <DynamicTableActions onEdit={\`/dashboard/testimonials/\${row._id}/edit\`} onDelete={() => handleDelete(row._id)} />
    }
`, 'ITestimonial');

