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
  useGetAdminsQuery,
  useDeleteAdminMutation,
  useUpdateAdminStatusMutation,
  IAdminUser,
} from "@/redux/features/adminManagement/adminManagement.api";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CreateAdminDialog from "./components/CreateAdminDialog";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { ShieldAlert } from "lucide-react";

export default function AdminsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const roleFilter = searchParams.get("role") || "";

  const { role: currentUserRole, loading: roleLoading } = useCurrentUserRole();

  const { data, isLoading, isError } = useGetAdminsQuery(
    {
      page,
      limit,
      search,
      role: roleFilter,
    },
    { skip: currentUserRole !== "SUPER_ADMIN" },
  );

  const [deleteItem, { isLoading: isDeleting }] = useDeleteAdminMutation();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAdminStatusMutation();
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
            toast.success("Admin deleted successfully");
            closeModal();
          } catch (error: any) {
            toast.error(
              error?.data?.message ||
                error?.message ||
                "Failed to delete admin",
            );
          }
        },
        isLoading: isDeleting,
      },
    });
  };

  const handleToggleStatus = async (admin: IAdminUser) => {
    const actionStr = admin.isActive ? "Block" : "Unblock";
    if (!confirm(`Are you sure you want to ${actionStr} ${admin.name}?`))
      return;

    try {
      await updateStatus({ id: admin._id, isActive: !admin.isActive }).unwrap();
      toast.success(`Admin ${actionStr.toLowerCase()}ed successfully`);
    } catch (error: any) {
      toast.error(
        error?.data?.message || `Failed to ${actionStr.toLowerCase()} admin`,
      );
    }
  };

  const columns = [
    { header: "Name", accessor: "name" as any },
    { header: "Email", accessor: "email" as any },
    {
      header: "Role",
      cell: (row: any) => (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${row.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row: any) => (
        <DynamicBadge
          text={row.isActive ? "ACTIVE" : "BLOCKED"}
          color={row.isActive ? "#34796f" : "#d9534f"}
        />
      ),
    },
    {
      header: "Actions",
      cell: (row: any) => (
        <DynamicTableActions
          actions={
            [
              {
                type: "custom",
                label: row.isActive ? "Block" : "Unblock",
                onClick: () => handleToggleStatus(row),
                disabled: isUpdating || row.role === "SUPER_ADMIN", // Cannot block super admin
              },
              {
                type: "delete",
                onClick: () => handleDelete(row._id, row.name),
                disabled: row.role === "SUPER_ADMIN", // Cannot delete super admin
              },
            ].filter((a) => !a.disabled) as any[]
          }
        />
      ),
    },
  ];

  if (roleLoading) {
    return (
      <div className="p-4">
        <TableSkeleton rowCount={5} columnCount={5} />
      </div>
    );
  }

  if (currentUserRole !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <ShieldAlert size={64} className="text-danger opacity-80" />
        <h1 className="text-2xl font-bold text-primary-text">Access Denied</h1>
        <p className="text-secondary-text">
          You do not have permission to view this page. Only Super Admins can
          manage admins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-primary-text text-2xl font-bold">
            Admin Management
          </h1>
          <p className="text-secondary-text mt-1 text-sm">
            Create, view, block, or delete system administrators.
          </p>
        </div>
        <div>
          <CreateAdminDialog />
        </div>
      </div>

      <div className="border-border bg-card rounded-md border shadow-sm">
        <div className="p-4 border-b border-border">
          <DynamicTableFilterBar
            fields={[
              {
                name: "search",
                type: "search",
                placeholder: "Search by name or email...",
              },
              // {
              //   name: "role",
              //   type: "select",
              //   placeholder: "Filter by Role",
              //   options: [
              //     { label: "All Roles", value: "all" },
              //     { label: "Admin", value: "ADMIN" },
              //     { label: "Super Admin", value: "SUPER_ADMIN" },
              //   ],
              // },
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
            title="No admins found"
            description="There are no administrators to display."
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
