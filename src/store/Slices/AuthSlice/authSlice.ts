import type { RootState } from "@/store/store";
import { createSlice } from "@reduxjs/toolkit";

interface IUser {
  id: string;
  email: string;
  phone: string;
  employeeID: number;
  role: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE"; // adjust roles as needed
  isLogin: boolean;
  isVerified: boolean;
  profile: {
    firstName: string;
    lastName: string;
    profileUrl: string;
  };
  lastLoginAt: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  accessToken: string;
}

// Define the initial state using that type
const initialState = {
  user: null as IUser | null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = { ...action.payload };
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
