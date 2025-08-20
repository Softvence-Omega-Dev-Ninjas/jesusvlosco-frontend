import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5005/js",
    baseUrl: "https://api.lgcglobalcontractingltd.com/js",
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
    "Team",
    "COMMENT",
    "PRIVATE_CHAT",
    "TEAM_CHAT",
    "survey",
    "SCHEDULING_USER",
    "TIME_CLOCK",
  ],
  endpoints: () => ({}),
});
