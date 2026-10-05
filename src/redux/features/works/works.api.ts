import { apiClient } from "../../apiClient/apiClient";
import { IWork } from "../../../types/models.types";

export const worksApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getWorks: builder.query<{ data: IWork[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/admin/works",
        params: params || {},
      }),
      providesTags: ["Work"],
    }),
    getWorkById: builder.query<{ data: IWork }, string>({
      query: (id) => `/admin/works/${id}`,
      providesTags: (result, error, id) => [{ type: "Work", id }],
    }),
    createWork: builder.mutation<{ data: IWork }, Partial<IWork>>({
      query: (data) => ({
        url: "/admin/works",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Work"],
    }),
    updateWork: builder.mutation<{ data: IWork }, { id: string; data: Partial<IWork> }>({
      query: ({ id, data }) => ({
        url: `/admin/works/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Work",
        { type: "Work", id },
      ],
    }),
    deleteWork: builder.mutation<{ data: IWork }, string>({
      query: (id) => ({
        url: `/admin/works/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Work"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWorksQuery,
  useGetWorkByIdQuery,
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
} = worksApi;
