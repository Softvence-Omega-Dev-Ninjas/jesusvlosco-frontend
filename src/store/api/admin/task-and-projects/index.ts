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
  }),
  overrideExisting: false,
});

export const { useGetTasksQuery } = taskAndProjectApi;
