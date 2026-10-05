import { apiClient } from "../../apiClient/apiClient";
import { ITestimonial } from "../../../types/models.types";

export const testimonialsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<{ data: ITestimonial[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/testimonials",
        params: params || {},
      }),
      providesTags: ["Testimonial"],
    }),
    getTestimonialById: builder.query<{ data: ITestimonial }, string>({
      query: (id) => `/testimonials/${id}`,
      providesTags: (result, error, id) => [{ type: "Testimonial", id }],
    }),
    createTestimonial: builder.mutation<{ data: ITestimonial }, Partial<ITestimonial>>({
      query: (data) => ({
        url: "/testimonials",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Testimonial"],
    }),
    updateTestimonial: builder.mutation<{ data: ITestimonial }, { id: string; data: Partial<ITestimonial> }>({
      query: ({ id, data }) => ({
        url: `/testimonials/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Testimonial",
        { type: "Testimonial", id },
      ],
    }),
    deleteTestimonial: builder.mutation<{ data: ITestimonial }, string>({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Testimonial"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
