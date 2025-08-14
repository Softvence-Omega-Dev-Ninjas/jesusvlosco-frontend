import { baseApi } from "../../baseApi";

const recognationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get Api

    getAllRecognation: build.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/admin/recognition${queryParams ? `?${queryParams}` : ""}`;
      },
      providesTags: ["RECOGNATION"],
    }),

    getRecognationById: build.query({
      query: (id: string) => `/admin/user/id/${id}`,
    }),
    addRecognation: build.mutation({
      query: (credentials) => ({
        url: "/admin/recognition/add-recognition",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["RECOGNATION"],
    }),

    updateRecognition: build.mutation({
      query: (credential) => ({
        url: `/admin/recognition/badge-update/${credential?.id}`,
        method: "PATCH",
        body: credential,
      }),
      invalidatesTags: ["RECOGNATION"],
    }),

    deleteRecognition: build.mutation({
      query: (credential) => ({
        url: `/js/admin/recognition/recognition-delete/${credential?.id}`,
        method: "DELETE",
        body: credential,
      }),
      invalidatesTags: ["RECOGNATION"],
    }),

    // Badge  Api
    addBadge: build.mutation({
      query: (credentials) => ({
        url: "/admin/recognition/add-badge",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["BADGE"],
    }),
    updateBadge: build.mutation({
      query: (credentials) => {
        console.log({ credentials });
        return {
          url: `/admin/recognition/badge-update/${credentials?.id}`,
          method: "PATCH",
          body: credentials?.body,
        };
      },
      invalidatesTags: ["BADGE"],
    }),
    deleteBadge: build.mutation({
      query: (credentials) => ({
        url: `/admin/recognition/badge-delete/${credentials?.id}`,
        method: "DELETE",
        // body: credentials,
      }),
      invalidatesTags: ["BADGE"],
    }),

    getAllBadge: build.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/admin/recognition/all-badgs${
          queryParams ? `?${queryParams}` : ""
        }`;
      },
      providesTags: ["BADGE"],
    }),
    getSingleBadge: build.query({
      query: (data) => {
        return `/admin/recognition/single/${data?.id}`;
      },
      // providesTags: ["BADGE"],
    }),
  }),
});

export const {
  useGetAllRecognationQuery,
  useGetRecognationByIdQuery,
  useAddRecognationMutation,
  useDeleteRecognitionMutation,
  useUpdateRecognitionMutation,

  // Badge
  useAddBadgeMutation,
  useDeleteBadgeMutation,
  useGetAllBadgeQuery,
  useUpdateBadgeMutation,
  useGetSingleBadgeQuery,
} = recognationApi;
