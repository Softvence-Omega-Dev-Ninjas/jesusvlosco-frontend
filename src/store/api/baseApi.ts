import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.lgcglobalcontractingltd.com/js",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.user?.accessToken || "";
      console.log({token})
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["BLOG", "EditedContent"],
  endpoints: () => ({}),
});
