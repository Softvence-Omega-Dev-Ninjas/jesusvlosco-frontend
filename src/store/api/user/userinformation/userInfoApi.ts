import { baseApi } from "../../baseApi";

const userInfoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
      getUserInformation: build.query({
      query: () => ({
        url: "/employee/user/me/profile",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserInformationQuery
} = userInfoApi;
