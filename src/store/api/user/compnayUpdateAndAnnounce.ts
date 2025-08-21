import { baseApi } from "../baseApi";

const companyUpdateAndAnnounceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAnnounce: builder.query({
      query: () => ({
        url: "/employee/announcement/assigned",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllAnnounceQuery } = companyUpdateAndAnnounceApi;
