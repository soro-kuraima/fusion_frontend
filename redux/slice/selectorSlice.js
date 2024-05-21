import { createSlice } from "@reduxjs/toolkit";
import baseChain from "@/utils/baseChain";

const selectorSlice = createSlice({
  name: "selector",

  initialState: {
    token: [baseChain.tokens[0], baseChain.tokens[0]],
    drawerChain: baseChain.chainId,
    tokenDrawer: false,
    tokenIndex: 0,
  },

  reducers: {
    setToken: (state, action) => {
      const { token, index } = action.payload;
      state.token[index] = token;
    },

    setDrawerChain: (state, action) => {
      state.drawerChain = action.payload;
    },

    toggleTokenDrawer: (state) => {
      state.tokenDrawer = !state.tokenDrawer;
    },

    setTokenIndex: (state, action) => {
      state.tokenIndex = action.payload;
    },
  },
});

export const {
  setToken,
  setDrawerChain,
  toggleTokenDrawer,
  setTokenIndex,
} = selectorSlice.actions;

export default selectorSlice.reducer;
