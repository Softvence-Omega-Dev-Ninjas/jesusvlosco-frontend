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

    // fetchCategories: builder.query({
    //   query: () => ({
    //     url: "/admin/announcement/get-categories",
    //     method: "GET",
    //   }),
    // }),
  }),
});

export const { useCreateAnnouncementMutation } = announcementApi;
