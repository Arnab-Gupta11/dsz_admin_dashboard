import { apiClient } from "../../apiClient/apiClient";
import { IService } from "../../../types/models.types";

export const servicesApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<{ data: IService[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/services",
        params: params || {},
      }),
      providesTags: ["Service"],
    }),
    getServiceById: builder.query<{ data: IService }, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation<{ data: IService }, Partial<IService>>({
      query: (data) => ({
        url: "/services",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation<{ data: IService }, { id: string; data: Partial<IService> }>({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Service",
        { type: "Service", id },
      ],
    }),
    deleteService: builder.mutation<{ data: IService }, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
