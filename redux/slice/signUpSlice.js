import { createSlice } from "@reduxjs/toolkit";

const signUpSlice = createSlice({
  name: "signup",

  initialState: {
    step: 0,
    domain: "",
    password: "",
    passkey: "",
    email: "",
    recoveryAddress: "",
  },

  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },

    setDomain: (state, action) => {
      state.domain = action.payload;
    },

    setPassword: (state, action) => {
      state.password = action.payload;
    },

    setPasskey: (state, action) => {
      state.passkey = action.payload;
    },

    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setRecoveryAddress: (state, action) => {
      state.recoveryAddress = action.payload;
    },

    clearPasskey: (state) => {
      state.passkey = "";
    },

    ClearAll: (state) => {
      state.step = 0;
      state.domain = "";
      state.password = "";
      state.passkey = "";
      state.email = "";
      state.recoveryAddress = "";
    },
  },
});

export const {
  setStep,
  setDomain,
  setPassword,
  setPasskey,
  setEmail,
  setRecoveryAddress,
  setTxHash,
  setRecoveryHash,
  clearPasskey,
  ClearAll,
} = signUpSlice.actions;

export default signUpSlice.reducer;
