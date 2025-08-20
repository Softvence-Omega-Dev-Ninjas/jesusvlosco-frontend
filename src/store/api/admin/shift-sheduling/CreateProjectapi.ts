import { baseApi } from "../../baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create project
    createProject: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/admin/project",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PROJECT"],
    }),

    // GET - All projects with optional filters
    getAllProjects: builder.query<unknown, Record<string, unknown> | undefined>({
      query: (params) => {
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
      providesTags: ["PROJECT"],
    }),

    // DELETE - Delete a project
    deleteProject: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/admin/project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:  ["PROJECT"],
    }),

    // PATCH - Update project title
    updateProjectTitle: builder.mutation<void, { projectId: number | string; title: string }>({
      query: ({ projectId, title }) => ({
        url: `/admin/project/${projectId}/update-title`,
        method: "PATCH",
        body: { title },
      }),
      invalidatesTags: ["PROJECT"],
    }),

    // GET - Single project
    getSingleProject: builder.query<unknown, number | string>({
      query: (id) => ({
        url: `/admin/project/${id}`,
        method: "GET",
      }),
      providesTags: ["PROJECT"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectTitleMutation,
  useGetSingleProjectQuery,
} = projectApi;
