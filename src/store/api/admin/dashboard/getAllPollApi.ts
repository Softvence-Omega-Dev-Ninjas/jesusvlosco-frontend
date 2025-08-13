import { baseApi } from "../../baseApi";

const getAllPollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPoll: builder.query({
      //TODO: API WILL CHANGE/UPDATE
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

export const { useGetAllPollQuery } = getAllPollApi;
