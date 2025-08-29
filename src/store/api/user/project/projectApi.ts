import { baseApi } from "../../baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProjectUser: build.query({
      query: () => ({
        url: `/employee/project/all`,
        method: "GET",
      }),
    }),
    getMyProjects: build.query({
      query: () => ({
        url: `/employee/dashboard/shift-schedule`,
        method: "GET",
      }),
      providesTags: ["PROJECT", "ShiftScheduling", "SCHEDULING_USER"],
    }),

    getUserProjectDetails: build.query({
      query: (id) => ({
        url: `/employee/dashboard/assigned-users/${id}`,
        method: "GET",
      }),
    }),
    updateProjectUser: build.mutation({
      query: (data) => ({
        url: `/admin/project/${data.id}/assign-employees`,
        method: "PATCH",
        body:{
          employees: data.employees
        },
      }),
      invalidatesTags: ["PROJECT", "ShiftScheduling", "SCHEDULING_USER"],
    }),
  }),
});

export const {
  useGetAllProjectUserQuery,
  useGetMyProjectsQuery,
  useGetUserProjectDetailsQuery,
  useUpdateProjectUserMutation,
} = projectApi;
