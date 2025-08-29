import { baseApi } from "../../baseApi";

const schedulingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUserTimeClock: build.query({
      query: () => ({
        url: `/employee/time-clock/get-all-shifts`,
        method: "GET",
      }),
      providesTags: ["TIME_CLOCK", 'CLOCK_IN_OUT', 'SCHEDULING_USER'],
    }),
    createSchedulingRequest: build.mutation({
      query: (credentials) => ({
        url: "/employee/time-clock/request-shift",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["TIME_CLOCK", 'CLOCK_IN_OUT', 'SCHEDULING_USER'],
    }),
    deleteSchedulingRequest: build.mutation({
      query: (id) => ({
        url: `/employee/time-clock/${id}/cancel-shift-request`,
        method: "POST",
      }),
      invalidatesTags: ["TIME_CLOCK", 'CLOCK_IN_OUT', 'SCHEDULING_USER'],
    }),
    currentShift: build.query({
      query: () => ({
        url: `/employee/time-clock/shift/current-clock`,
        method: "GET",
      }),
      providesTags: ["TIME_CLOCK", 'CLOCK_IN_OUT', 'SCHEDULING_USER'],
    }),
    getProjectUsersWithShift: build.query({
      query: (id) => ({
        url: `/shift/assigned-users/${id}`,
        method: "GET",
      }),
      providesTags: ["TIME_CLOCK", 'CLOCK_IN_OUT', 'SCHEDULING_USER'],
    }),

    deleteShift: build.mutation({
      query: (id) => ({
        url: `/shift/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TIME_CLOCK", 'CLOCK_IN_OUT', 'SCHEDULING_USER', 'PROJECT'],
    }),
  }),
});

export const {
  useGetAllUserTimeClockQuery,
  useCreateSchedulingRequestMutation,
  useDeleteSchedulingRequestMutation,
  useCurrentShiftQuery,
  useGetProjectUsersWithShiftQuery,
  useDeleteShiftMutation
} = schedulingApi;
