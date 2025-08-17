import { baseApi } from "@/store/api/baseApi";


const getUserTimeRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTimeRequest: builder.query({
      query: () => ({
        url: "/employee/time-off-request/my-requests",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetUserTimeRequestQuery } =  getUserTimeRequestApi
