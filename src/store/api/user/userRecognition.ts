import { baseApi } from "../baseApi";

enum Reaction {
  LIKE = "LIKE",
  LOVE_FACE = "LOVE_FACE",
  SMILE_FACE = "SMILE_FACE",
  WOW_FACE = "WOW_FACE",
  SAD_FACE = "SAD_FACE",
  CELEBRATION = "CELEBRATION",
}

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
        body: { comment, reaction: null, commentId: null, parentCommentId: null },
      }),
    }),

    postReply: builder.mutation({
      query: ({ recognitionId, parentCommentId, comment }) => ({
        url: `/employee/recognition/${recognitionId}`,
        method: "POST",
        body: { comment, reaction: null, commentId: null, parentCommentId },
      }),
    }),

    postReaction: builder.mutation({
      query: ({ recognitionId, commentId, reaction }) => ({
        url: `/employee/recognition/${recognitionId}`,
        method: "POST",
        body: {
          comment: null,
          reaction,
          commentId: commentId || null,
          parentCommentId: commentId ? commentId : null,
        },
      }),
    }),

    deleteReaction: builder.mutation({
      query: ({ recognitionId, commentId, reactionId }) => ({
        url: `/employee/recognition/${recognitionId}/reaction/${reactionId}`,
        method: "DELETE",
        body: {
          commentId: commentId || null,
          parentCommentId: commentId ? commentId : null,
        },
      }),
    }),
  }),
});

export const {
  useGetAllCommentLikeQuery,
  usePostCommentMutation,
  usePostReplyMutation,
  usePostReactionMutation,
  useDeleteReactionMutation,
} = userRecognitionApi;