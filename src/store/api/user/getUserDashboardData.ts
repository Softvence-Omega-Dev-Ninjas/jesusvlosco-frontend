import { baseApi } from "../baseApi";

export const getUserDashboardDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboardData: builder.query({
      query: () => ({
        url: "/employee/dashboard",
        method: "GET",
      }),
    }),
    getNotificationData: builder.query({
      query: () => ({
        url: "/employee/dashboard/notifications",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserDashboardDataQuery, useGetNotificationDataQuery } =
  getUserDashboardDataApi;
