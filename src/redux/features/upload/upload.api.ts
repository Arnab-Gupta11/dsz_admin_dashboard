import { apiClient } from "../../apiClient/apiClient";

export const uploadApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData: FormData) => ({
        url: "/admin/media/upload",
        method: "POST",
        body: formData,
      }),
    }),
    uploadPdf: builder.mutation({
      query: (formData: FormData) => ({
        url: "/admin/media/upload",
        method: "POST",
        body: formData,
      }),
    }),
    uploadVideo: builder.mutation({
      query: (formData: FormData) => ({
        url: "/admin/media/upload",
        method: "POST",
        body: formData,
      }),
    }),
    uploadFile: builder.mutation({
      query: (formData: FormData) => ({
        url: "/admin/media/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation, useUploadPdfMutation, useUploadVideoMutation, useUploadFileMutation } = uploadApi;
