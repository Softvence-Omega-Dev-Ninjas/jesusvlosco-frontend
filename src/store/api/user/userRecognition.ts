import { baseApi } from "../baseApi";

export const userRecognitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Feed / All posts with comments & reactions
    getAllCommentLike: builder.query({
      query: ({ type = "all", status = "DRAFT", orderBy = "asc" }) => ({
        url: "/employee/recognition/feed",
        method: "GET",
        params: { type, status, orderBy },
      }),
    }),

    // Create a new comment on a post
    postComment: builder.mutation({
      query: ({ recognitionId, comment }) => ({
        url: `/employee/recognition/${recognitionId}`,
        method: "POST",
        body: { comment },
      }),
    }),

    // Reply to a comment
    postReply: builder.mutation({
      query: ({ recognitionId, parentCommentId, comment }) => ({
        url: `/employee/recognition/${recognitionId}`,
        method: "POST",
        body: { parentCommentId, comment },
      }),
    }),

    // ✅ Generic Reaction (Post or Comment)
    postReaction: builder.mutation({
      query: ({ recognitionId, reaction, parentCommentId = null }) => ({
        url: `/employee/recognition/${recognitionId}`,
        method: "POST",
        body: parentCommentId ? { reaction, parentCommentId } : { reaction },
      }),
    }),
  }),
});

export const {
  useGetAllCommentLikeQuery,
  usePostCommentMutation,
  usePostReplyMutation,
  usePostReactionMutation,
} = userRecognitionApi;
