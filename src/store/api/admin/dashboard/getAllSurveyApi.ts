import { baseApi } from "../../baseApi";

const getAllSurveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSurvey: builder.query({
      query: ({ page = 1, limit = 10, status = "DRAFT", orderBy = "asc" }) => ({
        url: "/admin/survey/get-all",
        method: "GET",
        params: {
          page,
          limit,
          status,
          orderBy,
        },
      }),
    }),
  }),
});

export const { useGetAllSurveyQuery } = getAllSurveyApi;
