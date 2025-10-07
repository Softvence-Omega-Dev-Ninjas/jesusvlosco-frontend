import { baseApi } from "../../baseApi";

const getAllAssignedUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAssignedUsers: builder.query({
      query: ({ shiftDate, page = 1, limit = 15 }) => ({
        url: "/admin/user/assigned-users",
        method: "GET",
        params: {
          shiftDate,
          page,
          limit,
        },
      }),
    }),
  }),
});

export const { useGetAllAssignedUsersQuery } = getAllAssignedUsersApi;
