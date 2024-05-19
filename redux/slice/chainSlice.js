import { createSlice } from "@reduxjs/toolkit";
import baseChain from "@/utils/baseChain";

const chainSlice = createSlice({
  name: "chain",

  initialState: {
    currentChain: baseChain,
  },

  reducers: {
    setCurrentChain: (state, action) => {
      state.currentChain = action.payload;
    },
  },
});

export const { setCurrentChain } = chainSlice.actions;

export default chainSlice.reducer;
