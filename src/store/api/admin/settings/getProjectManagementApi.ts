import { baseApi } from "../../baseApi";

const getProjectMangementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectManagementData: builder.query({
      query: () => ({
        url: "/admin/settings/projects/all",
        method: "GET",
      }),
      providesTags: ["PROJECTS"],
    }),

    manageProjects: builder.mutation({
      query: (projects) => ({
        url: "/admin/settings/projects/manage",
        method: "PATCH",
        body: { projects },
      }),
      invalidatesTags: ["PROJECTS"],
    }),
  }),
});

export const { useGetProjectManagementDataQuery, useManageProjectsMutation } =
  getProjectMangementApi;
