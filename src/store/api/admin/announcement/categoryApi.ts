import { baseApi } from "../../baseApi";

const timeOffRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (body) => {
        return {
          url: "/admin/announcement/create-category",
          method: "POST",
          body,
        };
      },
    }),

    fetchCategories: builder.query({
      query: () => ({
        url: "/admin/announcement/get-categories",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateCategoryMutation, useFetchCategoriesQuery } =
  timeOffRequestsApi;
