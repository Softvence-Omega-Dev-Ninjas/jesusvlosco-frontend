import { baseApi } from "@/store/api/baseApi";


export const createUserTimeRequestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userTimeRequest: build.mutation({
      query: (formData) => ({
        url: "/employee/time-off-request/create",
        method: "POST",
        body: formData, 
      }),
      
    }),
  }),
});

export const { useUserTimeRequestMutation } = createUserTimeRequestApi;