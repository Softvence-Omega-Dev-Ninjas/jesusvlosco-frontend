import { baseApi } from "../../baseApi";

const getCompanyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: () => ({
        url: "/admin/settings/get-companies",
        method: "GET",
      }),
    }),

   updateCompany: builder.mutation({
  query: ({ companyId, body }) => ({
  url: `/admin/settings/update-company/${companyId}`,
    method: "PATCH",
    body,
  }),
}),

  }),
});

export const { 
  useGetCompanyQuery,
  useUpdateCompanyMutation 
} = getCompanyApi;
