import { getShiftDateISOString } from "@/utils/dateUtils";
import { baseApi } from "../baseApi";

const clockinoutapi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendUpdateLocation: build.mutation({
      query: (location) => ({
        url: "/employee/time-clock/process-clock",
        method: "POST",
        body: {
          "lat": location.lat,
          "lng": location.lng,
          "action": location.action,
          "date": getShiftDateISOString()
        },
      }),
      invalidatesTags: ['CLOCK_IN_OUT', 'TIME_CLOCK', 'SCHEDULING_USER'],
    }),

    getClockInOut: build.query({
      query: () => ({
        url: `/employee/time-clock/shift/current-clock?date=${getShiftDateISOString()}`,
        method: "GET",
      }),
      providesTags: ['CLOCK_IN_OUT', 'TIME_CLOCK', 'SCHEDULING_USER'],
    }),

    getClockSheet: build.query({
      query: ({ from, to }) => ({
         url: `/employee/time-clock/clock-sheet?from=${from}&to=${to}`,
        method: "GET",
      }),
      providesTags: ['CLOCK_IN_OUT', 'TIME_CLOCK', 'SCHEDULING_USER'],
    }),

     getClockHistory: build.query({
      query: () => ({
        url: "/employee/time-clock/history",
        method: "GET",
      }),
      providesTags: ['CLOCK_IN_OUT', 'TIME_CLOCK', 'SCHEDULING_USER'],
    }),

  }),
});

export const {
  useSendUpdateLocationMutation,
  useGetClockInOutQuery,
  useGetClockSheetQuery,
  useGetClockHistoryQuery
} = clockinoutapi;
