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
  }),
});

export const {useCreatePoolMutation }= createPoolApi
