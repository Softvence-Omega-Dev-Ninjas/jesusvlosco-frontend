import { baseApi } from "../../baseApi";


const getProjectMangementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectManagementData: builder.query({
      query: () => ({
        url: "/admin/settings/projects/all",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetProjectManagementDataQuery } =  getProjectMangementApi