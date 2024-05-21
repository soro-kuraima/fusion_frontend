import { createSlice } from "@reduxjs/toolkit";

const gasSlice = createSlice({
  name: "gas",

  initialState: {
    step: 0,
    amount: 1,
  },

  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },

    setAmount: (state, action) => {
      state.amount = action.payload;
    },
  },
});

export const { setStep, setAmount } = gasSlice.actions;

export default gasSlice.reducer;
