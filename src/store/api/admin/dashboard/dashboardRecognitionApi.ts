import { baseApi } from "../../baseApi";

const dashboardRecognitionApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({
    getRecogniions: builder.query({
      query: ({ page = 1, limit = 10, status = "DRAFT", orderBy = "asc" }) => ({
        url: "/admin/recognition",
        method: "GET",
        params: {
          page,
          limit,
          status,
          orderBy,
        },
      }),
    })
  }),
});

export const {
  useGetRecogniionsQuery
} = dashboardRecognitionApi;
