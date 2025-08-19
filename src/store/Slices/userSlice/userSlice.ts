// store/api/recognitionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on your JSON structure
interface User {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl: string | null;
  jobTitle: string;
}

interface Reaction {
  id: string;
  comment: string | null;
  reaction: string;
  recognitionId: string;
  recognitionUserId: string;
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies: Reaction[];
  reactions: Reaction[];
}

interface RecognitionUser {
  recognitionId: string;
  userId: string;
  user: {
    id: string;
    phone: string;
    employeeID: number;
    email: string;
    role: string;
    isLogin: boolean;
    lastLoginAt: string | null;
    profile: {
      id: string;
      firstName: string;
      lastName: string;
      profileUrl: string | null;
      gender: string;
      jobTitle: string;
      department: string;
      address: string;
      city: string;
      state: string;
      dob: string;
      country: string | null;
      nationality: string | null;
    };
  };
}

interface Recognition {
  id: string;
  badgeId: string;
  message: string;
  visibility: string;
  shouldNotify: boolean;
  isAllowedToLike: boolean;
  createdAt: string;
  updatedAt: string;
  recognitionUsers: RecognitionUser[];
  comments: Reaction[];
}

interface RecognitionFeedResponse {
  success: boolean;
  message: string;
  data: Recognition[];
}

interface PostCommentRequest {
  comment?: string;
  reaction?: "LIKE" | "LOVE_FACE" | "LAUGH" | "WOW" | "SAD" | "ANGRY";
  commentId?: string;
  parentCommentId?: string;
}

interface PostCommentResponse {
  success: boolean;
  message: string;
  data: Reaction;
}

// Create the API slice
export const recognitionApi = createApi({
  reducerPath: "recognitionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // Replace with your actual API base URL
    prepareHeaders: (headers, { getState }) => {
      // Add authentication headers if needed
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Recognition", "Comment"],
  endpoints: (builder) => ({
    // GET: Fetch recognition feed
    getRecognitionFeed: builder.query<RecognitionFeedResponse, void>({
      query: () => "/recognitions/feed", // Replace with your actual endpoint
      providesTags: ["Recognition"],
    }),

    // GET: Fetch specific recognition by ID
    getRecognitionById: builder.query<Recognition, string>({
      query: (id) => `/recognitions/${id}`,
      providesTags: (result, error, id) => [{ type: "Recognition", id }],
    }),

    // POST: Add comment or reaction
    postComment: builder.mutation<
      PostCommentResponse,
      { recognitionId: string } & PostCommentRequest
    >({
      query: ({ recognitionId, ...body }) => ({
        url: `/recognitions/${recognitionId}/comments`, // Replace with your actual endpoint
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recognition", "Comment"],
    }),

    // POST: Like a recognition post
    likeRecognition: builder.mutation<any, { recognitionId: string }>({
      query: ({ recognitionId }) => ({
        url: `/recognitions/${recognitionId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Recognition"],
    }),

    // POST: Like a comment
    likeComment: builder.mutation<any, { commentId: string }>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
    }),

    // POST: Reply to a comment
    replyToComment: builder.mutation<
      PostCommentResponse,
      { parentCommentId: string; comment: string; recognitionId: string }
    >({
      query: ({ parentCommentId, comment, recognitionId }) => ({
        url: `/recognitions/${recognitionId}/comments`,
        method: "POST",
        body: {
          comment,
          parentCommentId,
        },
      }),
      invalidatesTags: ["Recognition", "Comment"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetRecognitionFeedQuery,
  useGetRecognitionByIdQuery,
  usePostCommentMutation,
  useLikeRecognitionMutation,
  useLikeCommentMutation,
  useReplyToCommentMutation,
} = recognitionApi;
