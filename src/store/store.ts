// import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "./Slices/counterSlice/counterSlice";
// import authReducer from "./Slices/AuthSlice/authSlice";
// import formReducer from "./Slices/FormSlice/FormSlice";

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//     auth: authReducer,
//     form: formReducer,
//   },
// });

// // Define RootState and AppDispatch types
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './features/user/userSlice';
import authReducer from "./Slices/AuthSlice/authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { baseApi } from "./api/baseApi";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Slices/counterSlice/counterSlice";
import formReducer from "./Slices/FormSlice/FormSlice";
const persistConfig = {
  key: "auth",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);
export const store = configureStore({
  reducer: {
    user: persistedReducer,
    counter: counterReducer,
    form: formReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
