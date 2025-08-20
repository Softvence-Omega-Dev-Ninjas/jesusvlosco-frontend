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
      query: (filter) => {
        const params: Record<string, string | number | undefined> = {};

        if (filter?.page) params.page = filter.page;
        if (filter?.limit) params.limit = filter.limit;
        if (filter?.searchValue) params.title = filter.searchValue;
        if (filter?.publishedFrom) params.publishedFrom = filter.publishedFrom;
        if (filter?.publishedTo) params.publishedTo = filter.publishedTo;

        return {
          url: `/admin/announcement/get-announcements`,
          method: "GET",
          params,
        };
      },
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
