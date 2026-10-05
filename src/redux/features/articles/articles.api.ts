import { apiClient } from "../../apiClient/apiClient";
import { IArticle } from "../../../types/models.types";

export const articlesApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<{ data: IArticle[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/articles",
        params: params || {},
      }),
      providesTags: ["Article"],
    }),
    getArticleById: builder.query<{ data: IArticle }, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (result, error, id) => [{ type: "Article", id }],
    }),
    createArticle: builder.mutation<{ data: IArticle }, Partial<IArticle>>({
      query: (data) => ({
        url: "/articles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Article"],
    }),
    updateArticle: builder.mutation<{ data: IArticle }, { id: string; data: Partial<IArticle> }>({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Article",
        { type: "Article", id },
      ],
    }),
    deleteArticle: builder.mutation<{ data: IArticle }, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Article"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;
