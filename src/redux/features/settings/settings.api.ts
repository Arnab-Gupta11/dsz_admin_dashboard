import { apiClient } from "../../apiClient/apiClient";
import { ISettings } from "../../../types/models.types";

export const settingsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<{ data: ISettings }, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<{ data: ISettings }, Partial<ISettings>>({
      query: (data) => ({
        url: "/admin/settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
