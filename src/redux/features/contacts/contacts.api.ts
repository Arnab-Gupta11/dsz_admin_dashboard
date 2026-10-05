import { apiClient } from "../../apiClient/apiClient";
import { IContact } from "../../../types/models.types";

export const contactsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<{ data: IContact[]; meta?: any }, Record<string, any> | void>({
      query: (params) => ({
        url: "/admin/contacts",
        params: params || {},
      }),
      providesTags: ["Contact"],
    }),
    getContactById: builder.query<{ data: IContact }, string>({
      query: (id) => `/admin/contacts/${id}`,
      providesTags: (result, error, id) => [{ type: "Contact", id }],
    }),
    createContact: builder.mutation<{ data: IContact }, Partial<IContact>>({
      query: (data) => ({
        url: "/admin/contacts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contact"],
    }),
    updateContact: builder.mutation<{ data: IContact }, { id: string; data: Partial<IContact> }>({
      query: ({ id, data }) => ({
        url: `/admin/contacts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Contact",
        { type: "Contact", id },
      ],
    }),
    deleteContact: builder.mutation<{ data: IContact }, string>({
      query: (id) => ({
        url: `/admin/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApi;
