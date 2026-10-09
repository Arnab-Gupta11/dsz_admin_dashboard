"use client";

import CustomPagination from "@/components/dashboard/CustomPagination/CustomPagination";
import CustomTable from "@/components/dashboard/CustomTable/CustomTable";
import DynamicActionButton from "@/components/dashboard/DynamicActionButton/DynamicActionButton";
import DynamicBadge from "@/components/dashboard/DynamicBadge/DynamicBadge";
import DynamicTableActions from "@/components/dashboard/DynamicTableActions/DynamicTableActions";
import DynamicTableFilterBar from "@/components/dashboard/DynamicTableFilterBar/DynamicTableFilterBar";
import EmptyState from "@/components/dashboard/EmptyState/EmptyState";
import TableSkeleton from "@/components/Loader/Skeletons/TableSkeleton";
import { useModal } from "@/context/ModalContext";
import {
  useGetServicesQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from "@/redux/features/services/services.api";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || undefined;
  const isFeatured = searchParams.get("isFeatured") || undefined;

  const { data, isLoading, isError } = useGetServicesQuery({
    page,
    limit,
    search,
    status,
    isFeatured,
  });
  const [deleteItem, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const { openModal, closeModal } = useModal();

  const items = data?.data || [];
  const meta = data?.meta;

  const handleDelete = (id: string, title?: string) => {
    openModal({
      view: "DELETE_CONFIRM",
      data: {
        deleteItem: title,
        onConfirm: async () => {
          try {
            await deleteItem(id).unwrap();
            toast.success("Deleted successfully");
            closeModal();
          } catch (error: any) {
            toast.error(
              error?.data?.message || error?.message || "Failed to delete",
            );
            throw error;
          }
        },
        isLoading: isDeleting,
      },
    });
  };

  const [updateService] = useUpdateServiceMutation();

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await updateService({ id, data: { isFeatured: !currentStatus } }).unwrap();
      toast.success(`Service ${!currentStatus ? "featured" : "unfeatured"}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update featured status");
    }
  };

  const columns = [
    { header: "Title", accessor: "title" as any },
    { header: "Tag", accessor: "tag" as any },
    {
      header: "Featured",
      cell: (row: any) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(row._id, !!row.isFeatured)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
            row.isFeatured ? "bg-primary" : "bg-border"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              row.isFeatured ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
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
            { type: "edit", href: `/dashboard/services/${row._id}/edit` },
            { type: "delete", onClick: () => handleDelete(row._id, row.title) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">Services</h1>
          <p className="text-secondary-text mt-1 text-sm">
            Manage your digital services
          </p>
        </div>

        <Link href="/dashboard/services/create">
          <DynamicActionButton icon={Plus} label="Add New" />
        </Link>
      </div>

      <div className="border-border bg-card rounded-md border shadow-sm flex flex-col">
        <div className="p-4 border-b border-border">
          <DynamicTableFilterBar
            fields={[
              {
                name: "search",
                type: "search",
                placeholder: "Search by Title, Category, or Tagline...",
              },
              {
                name: "status",
                type: "select",
                placeholder: "Filter by Status",
                options: [
                  { label: "All Statuses", value: "all" },
                  { label: "Published", value: "PUBLISHED" },
                  { label: "Draft", value: "DRAFT" },
                  { label: "Archived", value: "ARCHIVED" },
                ],
              },
              {
                name: "isFeatured",
                type: "select",
                placeholder: "Featured",
                options: [
                  { label: "All Services", value: "all" },
                  { label: "Featured Only", value: "true" },
                ],
              },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-danger">
            Failed to load data
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No services found"
            description="There is no data to display right now."
          />
        ) : (
          <div>
            <div className="p-4">
              <CustomTable columns={columns} data={items} />
            </div>

            <div className="border-border border-t p-4">
              <CustomPagination
                meta={meta || { total: items.length, limit, totalPages: 1 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
