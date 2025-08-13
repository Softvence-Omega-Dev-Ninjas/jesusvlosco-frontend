import { baseApi } from "../../baseApi";

const getAllAssignedUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAssignedUsers: builder.query({
      query: ({ page = 1, limit = 10, status = "DRAFT", orderBy = "asc" }) => ({
        url: "/admin/user",
        method: "GET",
        params: {
          page,
          limit,
          status,
          orderBy,
          assigned: true, // assigned user
        },
      }),
    }),
  }),
});

export const { useGetAllAssignedUsersQuery } = getAllAssignedUsersApi;
