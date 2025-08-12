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
  }),
});

export const { useEmailLoginMutation, useSuperAdminLoginMutation, useVarifyemailLoginMutation, usePhoneLoginMutation, useVarifyPhoneLoginMutation } = authApi;
