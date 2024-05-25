import { createSlice } from "@reduxjs/toolkit";

const recoverySlice = createSlice({
  name: "recovery",

  initialState: {
    step: 0,
    password: "",
    passkey: null,
    gasless: false,
    gasAmount: null,
  },

  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },

    setPasskey: (state, action) => {
      state.passkey = action.payload;
    },

    setPassword: (state, action) => {
      state.password = action.payload;
    },

    setGasless: (state, action) => {
      state.gasless = action.payload;
    },

    setGasAmount: (state, action) => {
      state.gasAmount = action.payload;
    },
  },
});

export const {
  setStep,
  setPasskey,
  setPassword,
  setGasless,
  setGasAmount,
} = recoverySlice.actions;

export default recoverySlice.reducer;
