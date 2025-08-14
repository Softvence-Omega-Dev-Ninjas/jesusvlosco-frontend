import { baseApi } from "../../baseApi";

const getNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: () => ({
        url: "/notification-setting",
        method: "GET",
      }),
    }),

    updateNotification: builder.mutation({
      query: (payload) => ({
        url: "/notification-setting", 
        method: "PATCH", 
        body: payload,
      }),
    }),
  }),
});

export const { 
  useGetNotificationQuery,
  useUpdateNotificationMutation 
} = getNotificationApi;
