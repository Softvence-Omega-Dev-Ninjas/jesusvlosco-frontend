import { baseApi } from "../../baseApi";


const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (body) => ({
        url: "/admin/project",   
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateProjectMutation } = postApi;
