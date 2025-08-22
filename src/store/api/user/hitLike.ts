import { baseApi } from "../baseApi";

export const hitLikeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    hitLike: builder.mutation({
      query: (announcementId: string) => ({
        url: `/employee/announcement/like/${announcementId}`,
        method: "POST",
      }),
      invalidatesTags:["Like"]
    }),
  }),
  overrideExisting: false,
});

export const { useHitLikeMutation } = hitLikeApi;
