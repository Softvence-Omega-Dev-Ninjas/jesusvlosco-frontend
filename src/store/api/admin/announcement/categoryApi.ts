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
  }),
});

export const { useCreateCategoryMutation } = timeOffRequestsApi;
