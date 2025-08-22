import { baseApi } from "../../baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProjectUser: build.query({
      query: () => ({
        url: `/employee/project/all`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllProjectUserQuery } = projectApi;
