import { baseApi } from "../../baseApi";

const recognationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get Api

    getAllRecognation: build.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/admin/recognition${queryParams ? `?${queryParams}` : ""}`;
      },
      // providesTags: ["ADMIN_USER"],
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
    }),

    updateRecognition: build.mutation({
      query: (credential) => ({
        url: `/admin/recognition/badge-update/${credential?.id}`,
        method: "PATCH",
        body: credential,
      }),
    }),

    deleteRecognition: build.mutation({
      query: (credential) => ({
        url: `/js/admin/recognition/recognition-delete/${credential?.id}`,
        method: "DELETE",
        body: credential,
      }),
    }),

    // Badge  Api
    addBadge: build.mutation({
      query: (credentials) => ({
        url: "/admin/recognition/add-badge",
        method: "POST",
        body: credentials,
      }),
    }),
    updateBadge: build.mutation({
      query: (credentials) => ({
        url: `/admin/recognition/badge-update/${credentials?.id}`,
        method: "PATCH",
        body: credentials,
      }),
    }),
    deleteBadge: build.mutation({
      query: (credentials) => ({
        url: `/admin/recognition/badge-delete/${credentials?.id}`,
        method: "DELETE",
        body: credentials,
      }),
    }),

    getAllBadge: build.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/admin/recognition/all-badgs${
          queryParams ? `?${queryParams}` : ""
        }`;
      },
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
} = recognationApi;
