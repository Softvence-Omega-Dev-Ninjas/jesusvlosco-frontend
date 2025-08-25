/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../baseApi";
interface SurveyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface SurveyMetadata {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface SurveyResponse {
  success: boolean;
  message: string;
  data: any[];
  metadata: SurveyMetadata;
}
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
    getAllSurveys: builder.query<SurveyResponse, SurveyQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) {
          searchParams.append("page", params.page.toString());
        }
        if (params?.limit) {
          searchParams.append("limit", params.limit.toString());
        }
        if (params?.search) {
          searchParams.append("search", params.search);
        }

        const queryString = searchParams.toString();

        console.log("Query String", queryString);
        return `/admin/survey/get-all${queryString ? `?${queryString}` : ""}`;
      },
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

    //Get survey analytics
    //  Get all surveys
    getSurveyAnalytics: builder.query({
      query: () => "/admin/survey-response/responses/analytics",
      providesTags: ["survey"],
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
  useGetSurveyAnalyticsQuery,
} = createSurveyApi;
