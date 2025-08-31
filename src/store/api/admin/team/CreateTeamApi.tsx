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
      invalidatesTags: ['TEAM', 'ADMIN_USER'],
    }),

    // GET - All teams
    getAllTeams: builder.query({
      query: () => ({
        url: "admin/team/get-all-teams",
        method: "GET",
      }),
      providesTags: ['TEAM'],
    }),

    deleteTeam: builder.mutation({
      query: (teamId) => ({
        url: `admin/team/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['TEAM', 'ADMIN_USER'],
    }),

    updateTeamInfo: builder.mutation({
      query: (teamData) => ({
        url: `admin/team/${teamData.id}`,
        method: "PATCH",
        body: teamData,
      }),
      invalidatesTags: ['TEAM', 'ADMIN_USER'],
    }),
  }),
});

export const { useCreateTeamMutation, useGetAllTeamsQuery, useDeleteTeamMutation , useUpdateTeamInfoMutation } = teamApi;
