import { baseApi } from "../../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get Api

    getAllUser: build.query({
      query: () => `/admin/user`,
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
    }),

    // Patch Api
  }),
});

export const {
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useGetUserByPhoneQuery,
  useGetUserByEmployeeIdQuery,

  useUpdateUserMutation,

  // User Creation
  useCreateUserMutation,
  useCreateUserEducationMutation,
  useCreateUserEducationMultipleMutation,

  // user experient
  useCreateUserExperienceMutation,

  // userpayroll
  useCreateOffdayPayRollMutation,
  useCreateUserPayRollMutation
} = userApi;
