import { baseApi } from "../../baseApi";

const createPoolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create project
    createPool: builder.mutation({
      query: (body) => ({
        url: "/pool",
        method: "POST",
        body,
      }),
      invalidatesTags: ["survey", "POLL"],
    }),
    getPollStatistics: builder.query({
      query: () => ({
        url: "/pool/pool-response/all",
        method: "GET",
      }),
      providesTags: ["survey", "POLL"],
    }),
     deletePoll: builder.mutation({
      query: (pollId: string) => ({
        url: `/pool/delete/${pollId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["POLL", "survey"],
    }),
  }),
});

export const { useCreatePoolMutation, useGetPollStatisticsQuery, useDeletePollMutation } = createPoolApi;
