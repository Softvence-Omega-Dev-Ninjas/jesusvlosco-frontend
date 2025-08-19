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
        url: `/admin/announcement/get-announcements?page=${filter.page}&limit=${filter.limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateAnnouncementMutation, useFetchAnnouncementQuery } =
  announcementApi;
