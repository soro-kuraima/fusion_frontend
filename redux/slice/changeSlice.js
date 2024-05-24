import { createSlice } from "@reduxjs/toolkit";

const changeSlice = createSlice({
  name: "change",

  initialState: {
    step: 0,
    email: "",
    recoveryHash: null,
    gasless: false,
    gasAmount: null,
  },

  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },

    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setRecoveryHash: (state, action) => {
      state.recoveryHash = action.payload;
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
  setEmail,
  setRecoveryHash,
  setGasless,
  setGasAmount,
} = changeSlice.actions;

export default changeSlice.reducer;
