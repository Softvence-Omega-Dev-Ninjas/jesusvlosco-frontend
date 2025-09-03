import { baseApi } from "../../baseApi";

const dashboardnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query({
      query: () => ({
        url: "/admin/dashboard/notifications",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAdminNotificationsQuery } = dashboardnApi;
