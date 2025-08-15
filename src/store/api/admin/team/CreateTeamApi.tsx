import { baseApi } from "../../baseApi";

const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create team

    createTeam: builder.mutation({
      query: (body) => ({
        url: "admin/team",
        method: "POST",
        
        body,
      }),
      invalidatesTags: ['Team', 'ADMIN_USER'],
    }),

    // GET - All teams
    getAllTeams: builder.query({
      query: () => ({
        url: "admin/team/get-all-teams",
        method: "GET",
      }),
      providesTags: ['Team'],
    }),
  }),
});

export const { useCreateTeamMutation, useGetAllTeamsQuery } = teamApi;
