import { createSlice } from "@reduxjs/toolkit";

const gasSlice = createSlice({
  name: "gas",

  initialState: {
    step: 0,
    amount: 1,
    updates: null,
    gasAmount: null,
  },

  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },

    setAmount: (state, action) => {
      state.amount = action.payload;
    },

    setUpdates: (state, action) => {
      state.updates = action.payload;
    },

    setGasAmount: (state, action) => {
      state.gasAmount = action.payload;
    },
  },
});

export const {
  setStep,
  setAmount,
  setUpdates,
  setGasAmount,
} = gasSlice.actions;

export default gasSlice.reducer;
