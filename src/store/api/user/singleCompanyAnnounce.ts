import { baseApi } from "../baseApi";

export const singleCompanyAnnounceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleCompanyAnnounce: builder.query({
      query: (announcementId: string) => ({
        url: `/employee/announcement/${announcementId}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetSingleCompanyAnnounceQuery } = singleCompanyAnnounceApi;
