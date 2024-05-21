"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice.js";
import signUpSlice from "./slice/signUpSlice.js";
import chainSlice from "./slice/chainSlice.js";
import modalSlice from "./slice/modalSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    signup: signUpSlice,
    chain: chainSlice,
    modal: modalSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
