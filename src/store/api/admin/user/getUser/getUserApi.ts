import { baseApi } from "@/store/api/baseApi";



const getUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: "/employee/user/me/profile",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetUserQuery } =  getUserApi
