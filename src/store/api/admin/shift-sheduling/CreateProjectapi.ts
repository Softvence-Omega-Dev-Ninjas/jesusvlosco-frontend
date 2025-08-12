import { baseApi } from "../../baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create project
    createProject: builder.mutation({
      query: (body) => ({
        url: "/admin/project",
        method: "POST",
        body,
      }),
    }),

    // GET - All projects with filters
    getAllProjects: builder.query({
      query: (params?: Record<string, any>) => {
        const queryParams = new URLSearchParams();

        Object.entries(params || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value)); 
          }
        });

        return {
          url: `/admin/project?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    deleteProject: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/admin/project/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateProjectMutation, useGetAllProjectsQuery,useDeleteProjectMutation } = projectApi;
