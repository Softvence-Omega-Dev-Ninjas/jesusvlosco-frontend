import { baseApi } from "../../baseApi";

const createSurveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create project
    createSurvey: builder.mutation({
      query: (body) => ({
        url: "/admin/survey",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {useCreateSurveyMutation }= createSurveyApi;
