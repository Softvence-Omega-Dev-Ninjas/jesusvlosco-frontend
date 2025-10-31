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

    // ✅ Approve/Reject
    updateTimeClockAdmin: build.mutation({
      query: (credentials) => ({
        url: `/admin/time-clock/${credentials?.shiftId}/approve-or-reject`,
        method: "PATCH",
        body: credentials?.data,
      }),
      invalidatesTags: ["TIME_CLOCK"],
    }),

    // ✅ Update Clock In/Out
    editTimeClockAdmin: build.mutation({
      query: ({ id, data }) => ({
        url: `/admin/time-clock/${id}`, // correct backend endpoint
        method: "PATCH",
        body: data, // { clockInAt, clockOutAt }
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

    getTimeSheetByTimeRangePerUser: build.query({
      query: ({ from, to, userId, timezone }) => ({
        url: `admin/time-clock/clock-sheet/${userId}?from=${from}&to=${to}&timezone=${timezone}`,
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
  useEditTimeClockAdminMutation,
  useGetAllTimeSheetAdminQuery,
  useGetTimeSheetByTimeRangePerUserQuery,
  useLazyGetAllTimeSheetAdminQuery,
  useGetTimeSheetByTimeRangeQuery,
  useDeleteTimeClockAdminMutation,
} = timeClockApi;
