import { baseApi } from "../../baseApi";

const shiftApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create shift
    createShift: builder.mutation({
      query: (body) => ({
        url: "/shift",
        method: "POST",
        body,
      }),
    }),

    // GET - All shifts
    getAllShifts: builder.query({
      query: () => ({
        url: "/shift",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateShiftMutation, useGetAllShiftsQuery } = shiftApi;
