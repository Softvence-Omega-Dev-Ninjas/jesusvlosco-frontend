import { baseApi } from "../../baseApi";


const getEmployeemanagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeManagement: builder.query({
      query: () => ({
        url: "/admin/user",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetEmployeeManagementQuery} =  getEmployeemanagementApi