
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
      invalidatesTags: ['ShiftScheduling', 'ADMIN_USER', 'CLOCK_IN_OUT', 'TIME_CLOCK', 'SCHEDULING_USER'],
    }),

    // GET - All shifts
    getAllShifts: builder.query({
      query: () => ({
        url: "/shift",
        method: "GET",
      }),
      providesTags: ['ShiftScheduling'],
    }),

    createShiftTemplate: builder.mutation({
      query: (body) => ({
        url: "/shift/templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ['ShiftScheduling', 'TEMPLATE'],
    }),

    getAllShiftTemplates: builder.query({
      query: () => ({
        url: "/shift/templates/all",
        method: "GET",
      }),
      providesTags: ['TEMPLATE'],
    }),

    getSingleShiftTemplate: builder.query({
      query: (id) => ({
        url: `/shift/templates/${id}`,
        method: "GET",
      }),
      providesTags: ['TEMPLATE'],
    }),

    deleteShiftTemplate: builder.mutation({
      query: (id) => ({
        url: `/shift/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['TEMPLATE'],
    }),
  }),
});

export const { useCreateShiftMutation, useGetAllShiftsQuery, useCreateShiftTemplateMutation, useGetAllShiftTemplatesQuery, useGetSingleShiftTemplateQuery, useDeleteShiftTemplateMutation } = shiftApi;
