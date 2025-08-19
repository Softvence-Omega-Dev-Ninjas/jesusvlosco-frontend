import { baseApi } from "../baseApi";

const userRecognitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCommentLike: builder.query({
      //TODO: API WILL CHANGE/UPDATE
      query: ({type = "all",status = "DRAFT", orderBy = "asc" }) => ({
        url: "/employee/recognition/feed",
        method: "GET",
        params: {
            type,
          status,
          orderBy,
        },
      }),
    }),
  }),
});

export const { useGetAllCommentLikeQuery } = userRecognitionApi;
