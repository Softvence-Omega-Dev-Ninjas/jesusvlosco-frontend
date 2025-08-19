// store/api/getPollAndSurvey.ts
import { baseApi } from "@/store/api/baseApi";

export const getPollAndSurvey = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPollAndSurvey: builder.query({
      // Accept optional params for pagination
      query: ({ page = 1, limit = 10 }) => ({
        url: `/employee/survey/assigned?page=${page}&limit=${limit}`,
        method: "GET",
    
      }),
    }),
  }),
});

export const { useGetPollAndSurveyQuery } = getPollAndSurvey;



export const getSingleSurveyByIdApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSurveyById: builder.query({
      // surveyId is dynamic
      query: (surveyId: string) => ({
        url: `/employee/survey/${surveyId}/assigned`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSurveyByIdQuery } = getSingleSurveyByIdApi;



export const surveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitSurveyResponse: builder.mutation({
      query: (payload: {
        surveyId: string;
        answers: Array<
          | { questionId: string; options?: { optionId: string }[] }
          | { questionId: string; answerText?: string }
          | { questionId: string; rate?: number }
        >;
      }) => ({
        url: `/employee/survey/${payload.surveyId}/response`,
        method: "POST",
        body: { answers: payload.answers },
      }),
    }),
  }),
});

export const { useSubmitSurveyResponseMutation} = surveyApi;
