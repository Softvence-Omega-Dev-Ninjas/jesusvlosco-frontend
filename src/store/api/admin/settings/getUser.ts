import { baseApi } from "../../baseApi";

const getUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => ({
        url: "/admin/user",
        method: "GET",
      }),
    }),

    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/admin/user/${userId}`,  
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetUserDataQuery, useDeleteUserMutation } = getUserApi;
