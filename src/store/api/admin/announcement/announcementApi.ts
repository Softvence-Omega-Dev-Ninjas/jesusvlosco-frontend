import { baseApi } from "../../baseApi";

const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAnnouncement: builder.mutation({
      query: (body) => {
        return {
          url: "/admin/announcement/create-announcement",
          method: "POST",
          body: body.payload,
        };
      },
    }),

    fetchAnnouncement: builder.query({
      query: (filter) => ({
        url: `/admin/announcement/get-announcements?page=${filter.page}&limit=${filter.limit}&title=${filter.searchValue}&publishedFrom=${filter.publishedFrom}&publishedTo=${filter.publishedTo}`,
        method: "GET",
      }),
    }),

    deleteAnnouncement: builder.mutation({
      query: (announcementId) => ({
        url: `/admin/announcement/delete-announcement/${announcementId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateAnnouncementMutation,
  useFetchAnnouncementQuery,
  useDeleteAnnouncementMutation,
} = announcementApi;
