import { apiClient } from "../../apiClient/apiClient";

export interface IAdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const adminManagementApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<{ data: IAdminUser[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/admin/admins",
        params: params || {},
      }),
      providesTags: ["AdminUser"],
    }),
    createAdmin: builder.mutation<{ data: IAdminUser }, Partial<IAdminUser>>({
      query: (data) => ({
        url: "/admin/admins",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminUser"],
    }),
    updateAdminStatus: builder.mutation<{ data: IAdminUser }, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/admin/admins/${id}/block`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["AdminUser"],
    }),
    deleteAdmin: builder.mutation<{ data: null }, string>({
      query: (id) => ({
        url: `/admin/admins/${id}/block`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUser"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminStatusMutation,
  useDeleteAdminMutation,
} = adminManagementApi;
