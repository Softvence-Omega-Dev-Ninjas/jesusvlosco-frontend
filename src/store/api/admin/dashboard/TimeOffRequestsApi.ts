import { baseApi } from "../../baseApi";

const timeOffRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTimeOffRequests: builder.query({
      query: ({ page = 1, limit = 10, status = "DRAFT", orderBy = "asc" }) => ({
        url: "/admin/time-off-request/all-requests",
        method: "GET",
        params: {
          page,
          limit,
          status,
          orderBy,
        },
      }),
    }),

    approveTimeOffRequest: builder.mutation({
      query: (body) => {
        return {
          url: `/admin/time-off-request/update-request/${body.id}`,
          method: "PATCH",
          body: {
            status: "APPROVED",
            adminNote: body.adminNote,
          },
        };
      },
    }),

    declineTimeOffRequest: builder.mutation({
      query: (body) => {
        console.log("declineTimeOffRequest body:", body);
        return {
          url: `/admin/time-off-request/update-request/${body.id}`,
          method: "PATCH",
          body: {
            status: body.status,
            adminNote: body.adminNote,
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllTimeOffRequestsQuery,
  useApproveTimeOffRequestMutation,
  useDeclineTimeOffRequestMutation,
} = timeOffRequestsApi;
