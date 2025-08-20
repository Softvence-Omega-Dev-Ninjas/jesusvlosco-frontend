// store/api/getPollAndSurvey.ts
import { baseApi } from "@/store/api/baseApi";

export const pollAndSurveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Survey
    getSurvey: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/employee/survey/assigned?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    // Get Poll
    getPoll: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/employee/pool/assigned?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSurveyQuery, useGetPollQuery } = pollAndSurveyApi;

export const getSingleSurveyByIdForEmployeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSurveyByIdForEmployee: builder.query({
      query: (surveyId: string) => ({
        url: `/employee/survey/${surveyId}/assigned`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSurveyByIdForEmployeeQuery } =
  getSingleSurveyByIdForEmployeeApi;

export const getSinglePollByIdApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPollById: builder.query({
      // pollId is dynamic
      query: (pollId: string) => ({
        url: `/employee/pool/${pollId}/assigned`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPollByIdQuery } = getSinglePollByIdApi;

export const surveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Survey response submit
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

    // ✅ Poll response submit
    submitPollResponse: builder.mutation({
      query: (payload: { pollId: string; optionId: string }) => {
        console.log(payload);
        return {
          url: `/employee/pool/${payload.pollId}/response`,
          method: "POST",
          body: { optionId: payload.optionId },
        };
      },
    }),
  }),
});

export const {
  useSubmitSurveyResponseMutation,
  useSubmitPollResponseMutation,
} = surveyApi;
