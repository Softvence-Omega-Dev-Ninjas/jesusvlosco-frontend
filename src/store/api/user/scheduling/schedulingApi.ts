import { baseApi } from "../../baseApi";

const schedulingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUserTimeClock: build.query({
      query: () => ({
        url: `/employee/time-clock/get-all-shifts`,
        method: "GET",
      }),
      providesTags: ["TIME_CLOCK"],
    }),
    createSchedulingRequest: build.mutation({
      query: (credentials) => ({
        url: "/employee/time-clock/request-shift",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["TIME_CLOCK"],
    }),
    deleteSchedulingRequest: build.mutation({
      query: (id) => ({
        url: `/employee/time-clock/${id}/cancel-shift-request`,
        method: "POST",
      }),
      invalidatesTags: ["TIME_CLOCK"],
    }),
  }),
});

export const {
  useGetAllUserTimeClockQuery,
  useCreateSchedulingRequestMutation,
  useDeleteSchedulingRequestMutation,
} = schedulingApi;
