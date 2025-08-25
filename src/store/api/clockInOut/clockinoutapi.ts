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
          "action": location.action
        },
      }),
      invalidatesTags: ['CLOCK_IN_OUT', 'TIME_CLOCK', 'SCHEDULING_USER'],
    }),

    getClockInOut: build.query({
      query: () => ({
        url: "/employee/time-clock/shift/current-clock",
        method: "GET",
      }),
      providesTags: ['CLOCK_IN_OUT', 'TIME_CLOCK', 'SCHEDULING_USER'],
    }),

    getClockSheet: build.query({
      query: () => ({
        url: "/employee/time-clock/clock-sheet",
        method: "GET",
      }),
      providesTags: ['CLOCK_IN_OUT', 'TIME_CLOCK', 'SCHEDULING_USER'],
    }),

  }),
});

export const {
  useSendUpdateLocationMutation,
  useGetClockInOutQuery,
  useGetClockSheetQuery

} = clockinoutapi;
