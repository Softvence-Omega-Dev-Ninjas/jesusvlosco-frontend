import { baseApi } from "../../baseApi";

export const getUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/admin/user?assigned=false&page=1&limit=10',
      providesTags: ['ADMIN_USER'], 
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery } = getUserApi;
