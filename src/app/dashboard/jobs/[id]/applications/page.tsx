"use client";

import CustomPagination from "@/components/dashboard/CustomPagination/CustomPagination";
import TableSkeleton from "@/components/Loader/Skeletons/TableSkeleton";
import CustomTable from "@/components/dashboard/CustomTable/CustomTable";
import DynamicBadge from "@/components/dashboard/DynamicBadge/DynamicBadge";
import DynamicTableActions from "@/components/dashboard/DynamicTableActions/DynamicTableActions";
import DynamicTableFilterBar from "@/components/dashboard/DynamicTableFilterBar/DynamicTableFilterBar";
import EmptyState from "@/components/dashboard/EmptyState/EmptyState";
import { useModal } from "@/context/ModalContext";
import {
  useGetJobApplicationsQuery,
  useDeleteJobApplicationMutation,
} from "@/redux/features/jobApplications/jobApplications.api";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DynamicBackButton from "@/components/dashboard/DynamicBackButton/DynamicBackButton";

export default function Page() {
  const searchParams = useSearchParams();
  const { id: jobId } = useParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || undefined;

  const { data, isLoading, isError } = useGetJobApplicationsQuery({
    jobId,
    page,
    limit,
    search,
    status,
  });
  const [deleteItem, { isLoading: isDeleting }] =
    useDeleteJobApplicationMutation();
  const { openModal, closeModal } = useModal();

  const items = data?.data || [];
  const meta = data?.meta;

  const handleDelete = (id: string, name?: string) => {
    openModal({
      view: "DELETE_CONFIRM",
      data: {
        deleteItem: name,
        onConfirm: async () => {
          try {
            await deleteItem(id).unwrap();
            toast.success("Deleted successfully");
            closeModal();
          } catch (error: any) {
            toast.error(
              error?.data?.message || error?.message || "Failed to delete",
            );
          }
        },
        isLoading: isDeleting,
      },
    });
  };

  const columns = [
    { header: "Candidate", accessor: "name" as any },
    { header: "Email", accessor: "email" as any },
    { header: "Notice", accessor: "notice" as any },
    {
      header: "CV",
      cell: (row: any) => (
        <a
          href={row.cvUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline"
        >
          View CV
        </a>
      ),
    },
    {
      header: "Status",
      cell: (row: any) => (
        <DynamicBadge text={row.status as string} color="#34796f" />
      ),
    },
    {
      header: "Actions",
      cell: (row: any) => (
        <DynamicTableActions
          actions={[
            {
              type: "view",
              label: "Details",
              href: `/dashboard/job-applications/${row._id}`,
            },
            {
              type: "message",
              label: "Email",
              onClick: () => (window.location.href = `mailto:${row.email}`),
            },
            { type: "delete", onClick: () => handleDelete(row._id, row.name) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <DynamicBackButton href="/dashboard/jobs" />
          <div>
            <h1 className="text-primary-text text-2xl font-bold">Applicants</h1>
            <p className="text-secondary-text mt-1 text-sm">
              Review candidate CVs for this position
            </p>
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-md border shadow-sm">
        <div className="p-4 border-b border-border">
          <DynamicTableFilterBar
            fields={[
              {
                name: "search",
                type: "search",
                placeholder: "Search by Name, Email, or Phone...",
              },
              {
                name: "status",
                type: "select",
                placeholder: "Filter by Status",
                options: [
                  { label: "All Statuses", value: "all" },
                  { label: "New", value: "NEW" },
                  { label: "Reviewing", value: "REVIEWING" },
                  { label: "Shortlisted", value: "SHORTLISTED" },
                  { label: "Rejected", value: "REJECTED" },
                ],
              },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rowCount={5} columnCount={5} />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-danger">
            Failed to load data
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No items found"
            description="There is no data to display right now."
          />
        ) : (
          <>
            <div className="p-4">
              <CustomTable columns={columns} data={items} />
            </div>
            <div className="border-border border-t p-4">
              <CustomPagination
                meta={meta || { total: items.length, limit, totalPages: 1 }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
