import { baseApi } from "../../baseApi";

const getAllAssignedUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAssignedUsers: builder.query({
      query: ({ orderBy = "asc" }) => ({
        url: "/admin/user/assigned-users",
        method: "GET",
        params: {
          orderBy,
        },
      }),
    }),
  }),
});

export const { useGetAllAssignedUsersQuery } = getAllAssignedUsersApi;
