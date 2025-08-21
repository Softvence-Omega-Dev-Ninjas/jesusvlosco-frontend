import { baseApi } from "../baseApi";

export const getAllCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: '/admin/announcement/get-categories',
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllCategoriesQuery } = getAllCategoriesApi;
