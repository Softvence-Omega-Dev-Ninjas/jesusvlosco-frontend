import { baseApi } from "../../baseApi";

const createSurveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create project
    createProject: builder.mutation({
      query: (body) => ({
        url: "/admin/servey",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {useCreateProjectMutation }= createSurveyApi;
