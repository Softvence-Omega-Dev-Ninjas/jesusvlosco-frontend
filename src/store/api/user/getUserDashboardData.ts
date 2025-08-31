import { baseApi } from "../baseApi";

export const getUserDashboardDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboardData: builder.query({
      query: () => ({
        url: '/employee/dashboard',
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserDashboardDataQuery } = getUserDashboardDataApi;
