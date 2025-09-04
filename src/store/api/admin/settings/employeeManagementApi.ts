import { baseApi } from "../../baseApi";

const getEmployeemanagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeManagement: builder.query({
      query: (params: {
        searchTerm?: string;
        page?: number;
        limit?: number;
      }) => ({
        url: "/admin/user",
        method: "GET",
        params,
      }),
    }),
  }),
});
export const { useGetEmployeeManagementQuery } = getEmployeemanagementApi;
