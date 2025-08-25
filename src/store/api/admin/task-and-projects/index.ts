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
      providesTags: ["TASK"],
    }),
    getSingleTask: builder.query({
      query: (id) => ({
        url: `/admin/task/${id}`,
        method: "GET",
      }),
    }),
    getUserTaskDetails: builder.query({
      query: (id) => ({
        url: `/employee/project/task/${id}`,
        method: "GET",
      }),
      providesTags: ["TASK"],
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
      providesTags: ["TASK"],
    }),

    createTask: builder.mutation({
      query: (body) => ({
        url: `/admin/task/add`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TASK"],
    }),

    submitTask: builder.mutation({
      query: ({ taskId, formData }) => ({
        url: `/employee/project/submit/${taskId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["TASK"],
    }),

    getProjectDetails: builder.query({
      query: ({ projectId }) => ({
        url: `/admin/project/${projectId}`,
        method: "GET",
      }),
      providesTags: ["TASK", "PROJECT"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useGetallTasksByUsersQuery,
  useGetUserTaskDetailsQuery,
  useSubmitTaskMutation,
  useGetProjectDetailsQuery,
  useGetSingleTaskQuery,
} = taskAndProjectApi;
