"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
