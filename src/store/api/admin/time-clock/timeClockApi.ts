import { baseApi } from "../../baseApi";

const timeClockApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllTimeClockAdmin: build.query({
      query: () => ({
        url: `/admin/time-clock`,
        method: "GET",
      }),
      providesTags: ["TIME_CLOCK"],
    }),
    updateTimeClockAdmin: build.mutation({
      query: (credentials) => ({
        url: `/admin/time-clock/${credentials?.shiftId}/approve-or-reject`,
        method: "PATCH",
        body: credentials?.data,
      }),
      invalidatesTags: ["TIME_CLOCK"],
    }),
  }),
});

export const { useGetAllTimeClockAdminQuery, useUpdateTimeClockAdminMutation } =
  timeClockApi;
