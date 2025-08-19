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

    createSurveyFromTemplate: builder.mutation({
      query: ({ templateId, data }) => ({
        url: `/admin/survey/from-template/${templateId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["survey"],
    }),

    //  Get all surveys
    getAllSurveys: builder.query({
      query: () => "/admin/survey/get-all",
      providesTags: ["survey"],
    }),

    //  Get single survey by id
    getSurveyById: builder.query({
      query: (id) => `/admin/survey/${id}`,
      providesTags: (_result, _error, id) => [{ type: "survey", id }],
    }),

    //  Update survey
    updateSurvey: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/survey/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "survey", id }],
    }),

    //  Delete survey
    deleteSurvey: builder.mutation({
      query: (id) => ({
        url: `/admin/survey/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["survey"],
    }),
  }),
});

export const {
  useCreateSurveyMutation,
  useCreateSurveyFromTemplateMutation,
  useGetAllSurveysQuery,
  useGetSurveyByIdQuery,
  useUpdateSurveyMutation,
  useDeleteSurveyMutation,
} = createSurveyApi;
