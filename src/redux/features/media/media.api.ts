import { apiClient } from "../../apiClient/apiClient";
import { IMedia } from "../../../types/models.types";

export const mediaApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getMedias: builder.query<{ data: IMedia[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/media",
        params: params || {},
      }),
      providesTags: ["Media"],
    }),
    getMediaById: builder.query<{ data: IMedia }, string>({
      query: (id) => `/media/${id}`,
      providesTags: (result, error, id) => [{ type: "Media", id }],
    }),
    createMedia: builder.mutation<{ data: IMedia }, Partial<IMedia>>({
      query: (data) => ({
        url: "/media",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Media"],
    }),
    updateMedia: builder.mutation<{ data: IMedia }, { id: string; data: Partial<IMedia> }>({
      query: ({ id, data }) => ({
        url: `/media/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Media",
        { type: "Media", id },
      ],
    }),
    deleteMedia: builder.mutation<{ data: IMedia }, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Media"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMediasQuery,
  useGetMediaByIdQuery,
  useCreateMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
