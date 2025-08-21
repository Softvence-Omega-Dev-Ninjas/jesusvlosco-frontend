import { baseApi } from "../../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUser: build.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/admin/user${queryParams ? `?${queryParams}` : ""}`;
      },
      providesTags: ["ADMIN_USER"],
    }),
    getUserById: build.query({
      query: (id: string) => `/admin/user/id/${id}`,
    }),
    getUserByEmail: build.query({
      query: (email: string) => `/admin/user/email/${email}`,
    }),
    getUserByPhone: build.query({
      query: (phone: string) => `/admin/user/phone/${phone}`,
    }),
    getUserByEmployeeId: build.query({
      query: (employeeId: string) => `/admin/user/employeeId/${employeeId}`,
    }),

    // Post Api
    createUser: build.mutation({
      query: (credentials) => ({
        url: "/admin/user",
        method: "POST",
        body: credentials,
      }),
    }),
    deleteUser: build.mutation({
      query: (userId) => ({
        url: `/admin/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ADMIN_USER"],
    }),

    // Education
    createUserEducation: build.mutation({
      query: ({ data: credentials, userId }) => ({
        url: `/admin/user/education/create/single/${userId}`,
        method: "POST",
        body: credentials,
      }),
    }),
    createUserEducationMultiple: build.mutation({
      query: ({ educations, userId }) => {
        return {
          url: `/admin/user/education/create/multiple/${userId}`,
          method: "POST",
          body: { educations },
        };
      },
      invalidatesTags: ["ADMIN_USER"],
    }),

    // Experience
    createUserExperience: build.mutation({
      query: ({ data, userId }) => {
        return {
          // url: `/admin/user/experience/create/user/6bea4b48-71a0-45c6-981d-6940b264485a`,
          url: `/admin/user/experience/create/user/${userId}`,
          method: "POST",
          body: { experiences: data },
        };
      },
      invalidatesTags: ["ADMIN_USER"],
    }),

    updateUser: build.mutation({
      query: ({ data, userId }) => {
        console.log({ data, userId });
        return {
          url: `/admin/user/${userId}`,
          method: "PATCH",
          body: data,
        };
      },
    }),

    updateEmployee: build.mutation({
      query: ({ data }) => {
        console.log({ data });
        return {
          url: `/employee/user/profile`,
          method: "PATCH",
          body: data,
        };
      },
    }),

    // Payroll
    createUserPayRoll: build.mutation({
      query: ({ data, userId }) => {
        console.log({ data, userId });
        return {
          url: `/admin/payroll/payrate/${userId}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["ADMIN_USER"],
    }),
    createOffdayPayRoll: build.mutation({
      query: ({ data, userId }) => {
        console.log({ data, userId });
        return {
          url: `/admin/payroll/offday/${userId}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["ADMIN_USER"],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useGetUserByPhoneQuery,
  useGetUserByEmployeeIdQuery,

  useUpdateUserMutation,

  // delete user
  useDeleteUserMutation,

  // User Creation
  useCreateUserMutation,
  useCreateUserEducationMutation,
  useCreateUserEducationMultipleMutation,

  // user experient
  useCreateUserExperienceMutation,

  // userpayroll
  useCreateOffdayPayRollMutation,
  useCreateUserPayRollMutation,

  // Update employee
  useUpdateEmployeeMutation,
} = userApi;
