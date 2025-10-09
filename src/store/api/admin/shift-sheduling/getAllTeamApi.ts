import { baseApi } from "../../baseApi";


const getAllTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeamData: builder.query({
      query: ({ page, limit }) => ({
        url: `/admin/team/get-all-teams?page=${page ? page : 1}&limit=${limit ? limit : 100}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetAllTeamDataQuery } = getAllTeamApi;