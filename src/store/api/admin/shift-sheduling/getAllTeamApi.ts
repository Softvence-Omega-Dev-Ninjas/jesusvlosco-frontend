import { baseApi } from "../../baseApi";


const getAllTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeamData: builder.query({
      query: () => ({
        url: "/admin/team/get-all-teams",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetAllTeamDataQuery } =  getAllTeamApi