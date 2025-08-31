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
    }),
    getPollStatistics: builder.query({
      query: () => ({
        url: "/pool/pool-response/all",
        method: "GET",
      }),
      providesTags: ["survey"],
    }),
  }),
});

export const { useCreatePoolMutation, useGetPollStatisticsQuery } = createPoolApi;
