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
      query: ({ data: credentials, userId }) => ({
        url: `/admin/user/education/create/multiple/${userId}`,
        method: "POST",
        body: credentials,
      }),
    }),

    // Experience
    createUserExperience: build.mutation({
      query: ({ data, userId }) => {
        return {
          url: `/admin/user/experience/create/user/${userId}`,
          method: "POST",
          body: JSON.stringify({ experiences: data }),
        };
      },
    }),

    updateUser: build.mutation({
      query: ({ data, userId }) => {
        console.log({data, userId})
        return {
          url: `/admin/user/${userId}`,
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
} = userApi;
