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

    getAllTimeSheetAdmin: build.query({
      query: ({ date, timezone }) => ({
        url: `/admin/time-clock/time-sheet?date=${date}&timezone=${timezone}`,
        method: "GET",
      }),
      providesTags: ["TIME_CLOCK"],
    }),

    getTimeSheetByTimeRange: build.query({
      query: ({ startTime, endTime, search, timezone }) => ({
        url: `/admin/time-clock/time-sheet/time-range?startTime=${startTime}&endTime=${endTime}&search=${search}&timezone=${timezone}`,
        method: "GET",
      }),
      providesTags: ["TIME_CLOCK"],
    }),
    deleteTimeClockAdmin: build.mutation({
      query: (clockid) => ({
        url: `/admin/time-clock/time-sheet/${clockid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TIME_CLOCK"],
    }),
  }),
});

export const {
  useGetAllTimeClockAdminQuery,
  useUpdateTimeClockAdminMutation,
  useGetAllTimeSheetAdminQuery,
  useLazyGetAllTimeSheetAdminQuery,
  useGetTimeSheetByTimeRangeQuery,
  useDeleteTimeClockAdminMutation,
} = timeClockApi;
