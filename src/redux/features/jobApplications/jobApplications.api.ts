import { apiClient } from "../../apiClient/apiClient";
import { IJobApplication } from "../../../types/models.types";

export const jobApplicationsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getJobApplications: builder.query<{ data: IJobApplication[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/admin/job-applications",
        params: params || {},
      }),
      providesTags: ["JobApplication"],
    }),
    getJobApplicationById: builder.query<{ data: IJobApplication }, string>({
      query: (id) => `/admin/job-applications/${id}`,
      providesTags: (result, error, id) => [{ type: "JobApplication", id }],
    }),
    createJobApplication: builder.mutation<{ data: IJobApplication }, Partial<IJobApplication>>({
      query: (data) => ({
        url: "/admin/job-applications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["JobApplication"],
    }),
    updateJobApplication: builder.mutation<{ data: IJobApplication }, { id: string; data: Partial<IJobApplication> }>({
      query: ({ id, data }) => ({
        url: `/admin/job-applications/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "JobApplication",
        { type: "JobApplication", id },
      ],
    }),
    deleteJobApplication: builder.mutation<{ data: IJobApplication }, string>({
      query: (id) => ({
        url: `/admin/job-applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobApplication"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJobApplicationsQuery,
  useGetJobApplicationByIdQuery,
  useCreateJobApplicationMutation,
  useUpdateJobApplicationMutation,
  useDeleteJobApplicationMutation,
} = jobApplicationsApi;
