import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5005/js",
    // baseUrl: "http://148.230.86.72:5005/js",
    baseUrl: "https://lgcglobalcontractingltd.com/js",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.user?.accessToken || "";
      // console.log({ token });
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: [
    "BLOG",
    "EditedContent",
    "ADMIN_USER",
    "BADGE",
    "RECOGNATION",
    "ShiftScheduling",
    "TEAM",
    "COMMENT",
    "PRIVATE_CHAT",
    "TEAM_CHAT",
    "survey",
    "PROJECT",
    "SCHEDULING_USER",
    "TIME_CLOCK",
    "Like",
    "TASK",
    "CLOCK_IN_OUT"
  ],
  endpoints: () => ({}),
});
