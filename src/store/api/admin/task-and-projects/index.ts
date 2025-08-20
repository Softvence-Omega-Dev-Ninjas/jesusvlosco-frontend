// task-and-projects.ts
import { baseApi } from "../../baseApi";

export const taskAndProjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: ({ taskStatus, searchQuery, groupBy, start, end }) => ({
        url: `/admin/task`,
        method: "GET",
        params: {
          status: taskStatus || undefined,
          search: searchQuery || undefined,
          groupBy: groupBy || undefined,
          startAfter: start,
          endBefore: end,
        },
      }),
    }),
    getUserTaskDetails: builder.query({
      query: (id) => ({
        url: `/employee/project/task/${id}`,
        method: "GET",
      }),
    }),
    getallTasksByUsers: builder.query({
      query: ({ taskStatus, searchQuery, groupBy, start, end }) => ({
        url: `/employee/project/task/all`,
        method: "GET",
        params: {
          status: taskStatus || undefined,
          search: searchQuery || undefined,
          groupBy: groupBy || undefined,
          startAfter: start,
          endBefore: end,
        },
      }),
    }),

    createTask: builder.mutation({
      query: (body) => ({
        url: `/admin/task/add`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTasksQuery, useCreateTaskMutation, useGetallTasksByUsersQuery, useGetUserTaskDetailsQuery } = taskAndProjectApi;
