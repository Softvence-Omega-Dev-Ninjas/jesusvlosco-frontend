import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.lgcglobalcontractingltd.com/js",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.user?.accessToken || "";
      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["BLOG", "EditedContent"],
  endpoints: () => ({}),
});
