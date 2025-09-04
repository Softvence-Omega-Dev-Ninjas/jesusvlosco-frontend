import { baseApi } from "../../baseApi";

const getAllAssignedUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashStats: builder.query({
      query: () => ({
        url: "/admin/dashboard/data",
        method: "GET",
      }),
      providesTags: ["NOTIFICATION"],
    }),

    getLatestSurveyandPoll: builder.query({
      query: () => ({
        url: "/admin/dashboard/latest-survey-pool",
        method: "GET",
      }),
      providesTags: ["NOTIFICATION"],
    }),
  }),
});

export const { useGetAdminDashStatsQuery, useGetLatestSurveyandPollQuery } = getAllAssignedUsersApi;