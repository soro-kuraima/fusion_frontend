"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice.js";
import signUpSlice from "./slice/signUpSlice.js";
import chainSlice from "./slice/chainSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    signup: signUpSlice,
    chain: chainSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
