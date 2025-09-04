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
      invalidatesTags: ["CLOCK_IN_OUT", "TIME_CLOCK", "SCHEDULING_USER"],
    }),

    getClockInOut: build.query({
      query: () => ({
        url: `/employee/time-clock/shift/current-clock?date=${getShiftDateISOString()}`,
        method: "GET",
      }),
      providesTags: ["CLOCK_IN_OUT", "TIME_CLOCK", "SCHEDULING_USER"],
    }),

    getClockSheet: build.query({
      query: ({ from, to }) => ({
        url: `/employee/time-clock/clock-sheet?from=${from}&to=${to}`,
        method: "GET",
      }),
      providesTags: ["CLOCK_IN_OUT", "TIME_CLOCK", "SCHEDULING_USER", "OVERTIME"],
    }),

    getClockHistory: build.query({
      query: () => ({
        url: "/employee/time-clock/history",
        method: "GET",
      }),
      providesTags: ["CLOCK_IN_OUT", "TIME_CLOCK", "SCHEDULING_USER"],
    }),

    submitClockSheet: build.mutation({
      query: (data) => ({
        url: "employee/time-clock/submit-clock-sheet",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CLOCK_SHEET"],
    }),

    getSubmittedClockSheet: build.query({
      query: (data) => ({
        url: `/admin/time-clock/payroll-entries?page=${data.page}&limit=${data.limit}`,
        method: "GET",
      }),
      providesTags: ['CLOCK_SHEET'],
    }),

    getSingleSubmittedSheet: build.query({
      query: (id) => ({
        url: `/admin/time-clock/payroll-entries/${id}`,
        method: "GET",
      }),
      providesTags: ['CLOCK_SHEET'],
    }),

    updateSubmittedSheet: build.mutation({
      query: (data) => ({
        url: `/admin/time-clock/payroll-entries/${data.id}/accept-or-reject`,
        method: "PATCH",
        body: { isApproved: data.status },
      }),
      invalidatesTags: ['CLOCK_SHEET'],
    }),

  }),
});

export const {
  useSendUpdateLocationMutation,
  useGetClockInOutQuery,
  useGetClockSheetQuery,
  useGetClockHistoryQuery,
  useSubmitClockSheetMutation,
  useGetSubmittedClockSheetQuery,
  useGetSingleSubmittedSheetQuery,
  useUpdateSubmittedSheetMutation
} = clockinoutapi;
