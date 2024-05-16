"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice.js";
import signUpSlice from "./slice/signUpSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    signup: signUpSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
