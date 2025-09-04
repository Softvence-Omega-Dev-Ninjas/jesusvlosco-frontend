import { baseApi } from "../../baseApi";

const overtimeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOvertimeRequestForAdmin: builder.query({
      query: ({ currentPage }) => {
        console.log("page===========>", currentPage);
        return {
          url: `/admin/time-clock/overtime`,
          method: "GET",
          params: {
            page: currentPage,
          },
        };
      },
      providesTags: ["OVERTIME"],
    }),
    sendOvertimeRequest: builder.mutation({
      query: ({ id }) => ({
        url: `/employee/time-clock/request-overtime/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["OVERTIME"],
    }),
    updateOvertimeRequest: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/time-clock/overtime/${id}/accept-or-reject`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["OVERTIME"],
    }),
  }),
});
export const { useGetAllOvertimeRequestForAdminQuery, useSendOvertimeRequestMutation, useUpdateOvertimeRequestMutation } = overtimeApi;
