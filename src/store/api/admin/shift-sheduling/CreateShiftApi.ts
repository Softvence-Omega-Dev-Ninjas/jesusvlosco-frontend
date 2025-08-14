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
      invalidatesTags: ['ShiftScheduling', 'ADMIN_USER'],
    }),

    // GET - All shifts
    getAllShifts: builder.query({
      query: () => ({
        url: "/shift",
        method: "GET",
      }),
      providesTags: ['ShiftScheduling'],
    }),
  }),
});

export const { useCreateShiftMutation, useGetAllShiftsQuery } = shiftApi;
