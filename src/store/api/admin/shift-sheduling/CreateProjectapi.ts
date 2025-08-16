import { baseApi } from "../../baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create project
    createProject: builder.mutation({
      query: (body: Record<string, any>) => ({
        url: "/admin/project",
        method: "POST",
        body,
      }),
    }),

    // GET - All projects with filters
    getAllProjects: builder.query({
      query: (params?: Record<string, any>) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              queryParams.append(key, String(value));
            }
          });
        }
        return {
          url: `/admin/project?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    // DELETE - Delete a project
    deleteProject: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/admin/project/${id}`,
        method: "DELETE",
      }),
    }),

    // PATCH - Update project title
    updateProjectTitle: builder.mutation< void,{ projectId: number | string; title: string }>({
      query: ({ projectId, title }) => ({
        url: `/admin/project/${projectId}/update-title`,
        method: "PATCH",
        body: { title },
      }),
    }),
  }),
  
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectTitleMutation,
} = projectApi;
