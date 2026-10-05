import { apiClient } from "../../apiClient/apiClient";
import { IJob } from "../../../types/models.types";

export const jobsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<{ data: IJob[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/jobs",
        params: params || {},
      }),
      providesTags: ["Job"],
    }),
    getJobById: builder.query<{ data: IJob }, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),
    createJob: builder.mutation<{ data: IJob }, Partial<IJob>>({
      query: (data) => ({
        url: "/jobs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    updateJob: builder.mutation<{ data: IJob }, { id: string; data: Partial<IJob> }>({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Job",
        { type: "Job", id },
      ],
    }),
    deleteJob: builder.mutation<{ data: IJob }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
