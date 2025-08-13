import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    emailLogin: build.mutation({
      query: (credentials) => ({
        url: "/auth/login/email",
        method: "POST",
        body: credentials,
      }),
    }),
    varifyemailLogin: build.mutation({
      query: (credentials) => ({
        url: "/auth/verify/email",
        method: "POST",
        body: credentials,
      }),
    }),
    phoneLogin: build.mutation({
      query: (credentials) => ({
        url: "/auth/login/phone",
        method: "POST",
        body: credentials,
      }),
    }),
    varifyPhoneLogin: build.mutation({
      query: (credentials) => ({
        url: "/auth/verify/phone",
        method: "POST",
        body: credentials,
      }),
    }),
    superAdminLogin: build.mutation({
      query: (credentials) => ({
        url: "/auth/login/super-admin",
        method: "POST",
        body: credentials,
      }),
    }),
    updateProfile: build.mutation({
      query: (credentials) => ({
        url: `/admin/user/${credentials?.id}`,
        method: "PATCH",
        body: credentials?.formData,
      }),
    }),
    getProfile: build.query({
      query: (credentials) => ({
        url: `/admin/user/id/${credentials?.id}`,
      }),
    }),
  }),
});

export const {
  useEmailLoginMutation,
  useSuperAdminLoginMutation,
  useVarifyemailLoginMutation,
  usePhoneLoginMutation,
  useVarifyPhoneLoginMutation,
  useUpdateProfileMutation,
  useGetProfileQuery
} = authApi;
