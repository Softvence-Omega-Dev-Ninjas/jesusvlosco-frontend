import { baseApi } from "../baseApi";

const clockinoutapi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    sendUpdateLocation: build.mutation({
      query: (location) => ({
        url: "/employee/time-clock/process-clock",
        method: "POST",
        body: {
          "lat": location.lat,
          "lng": location.lng
        },
      }),
    }),

    getClockInOut: build.query({
      query: () => ({
        url: "/employee/time-clock/shift/current-clock",
        method: "GET",
      }),
    }),

  }),
});

export const {
  useSendUpdateLocationMutation,
  useGetClockInOutQuery,

} = clockinoutapi;
