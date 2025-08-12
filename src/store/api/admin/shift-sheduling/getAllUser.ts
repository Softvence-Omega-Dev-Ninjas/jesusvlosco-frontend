import { baseApi } from "../../baseApi";


const getAllUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserData: builder.query({
      query: () => ({
        url: "/admin/user",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetAllUserDataQuery } =  getAllUserApi