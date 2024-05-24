import { createSlice } from "@reduxjs/toolkit";

const transferSlice = createSlice({
  name: "transfer",

  initialState: {
    step: 0,
    amount: 0,
    recipient: "",
    gasless: false,
    gasAmount: null,
  },

  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },

    setAmount: (state, action) => {
      state.amount = action.payload;
    },

    setRecipient: (state, action) => {
      state.recipient = action.payload;
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
  setAmount,
  setRecipient,
  setGasless,
  setGasAmount,
} = transferSlice.actions;

export default transferSlice.reducer;
