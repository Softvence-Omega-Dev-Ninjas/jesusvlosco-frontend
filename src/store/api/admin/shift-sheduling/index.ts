import { baseApi } from "../../baseApi";

const shiftScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllShiftsOfAUser: builder.query({
      query: ({ searchTerm }) => ({
        url: `/employee/dashboard/user-shifts`,
        method: "GET",
        params: {
          searchTerm: searchTerm,
        },
      }),
    }),
    getAllClockInRequestForAdmin: builder.query({
      query: ({ currentPage }) => {
        console.log("page===========>", currentPage);
        return {
          url: `/admin/time-clock/clock-request`,
          method: "GET",
          params: {
            page: currentPage,
          },
        };
      },
      providesTags: ["CLOCK_IN_OUT"],
    }),
    addClockInRequest: builder.mutation({
      query: (body) => ({
        url: `/employee/request-time-clock/request`,
        method: "POST",
        body,
      }),
      invalidatesTags: [],
    }),
    updateClockInRequest: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/time-clock/clock-request/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CLOCK_IN_OUT"],
    }),
  }),
});
export const { useGetAllShiftsOfAUserQuery, useAddClockInRequestMutation, useGetAllClockInRequestForAdminQuery, useUpdateClockInRequestMutation } =
  shiftScheduleApi;
