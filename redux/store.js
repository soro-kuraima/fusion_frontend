"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice.js";
import signUpSlice from "./slice/signUpSlice.js";
import chainSlice from "./slice/chainSlice.js";
import modalSlice from "./slice/modalSlice.js";
import gasSlice from "./slice/gasSlice.js";
import selectorSlice from "./slice/selectorSlice.js";
import proofSlice from "./slice/proofSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    signup: signUpSlice,
    chain: chainSlice,
    modal: modalSlice,
    gas: gasSlice,
    selector: selectorSlice,
    proof: proofSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
