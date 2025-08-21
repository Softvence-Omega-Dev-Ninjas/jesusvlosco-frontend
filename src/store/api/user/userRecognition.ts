import { baseApi } from "../baseApi";

export const userRecognitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCommentLike: builder.query({
      query: ({ type = "all", status = "DRAFT", orderBy = "asc" }) => ({
        url: "/employee/recognition/feed",
        method: "GET",
        params: { type, status, orderBy },
      }),
    }),

    postComment: builder.mutation({
      query: ({ recognitionId, comment }) => ({
        url: `/employee/recognition/${recognitionId}`,
        method: "POST",
        body: { comment },
      }),
    }),

    postReply: builder.mutation({
      query: ({ recognitionId, parentCommentId, comment }) => ({
        url: `/employee/recognition/${recognitionId}`,
        method: "POST",
        body: { parentCommentId, comment },
      }),
    }),

    postLike: builder.mutation({
      query: ({ recognitionId, reaction }) => ({
        url: `/employee/recognition/${recognitionId}`,
        method: "POST",
        body: { reaction },
      }),
    }),
  }),
});

export const {
  useGetAllCommentLikeQuery,
  usePostCommentMutation,
  usePostReplyMutation,
  usePostLikeMutation,
} = userRecognitionApi;
