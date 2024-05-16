import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    walletAddresses: null,
    tokenBalanceData: null,
    tokenConversionData: null,
    gasCredit: null,
    isDeployed: true,
  },

  reducers: {
    setWalletAddresses: (state, action) => {
      state.walletAddresses = action.payload;
    },

    setTokenBalanceData: (state, action) => {
      state.tokenBalanceData = action.payload;
    },

    setTokenConversionData: (state, action) => {
      state.tokenConversionData = action.payload;
    },

    setGasCredit: (state, action) => {
      state.gasCredit = action.payload;
    },

    setDeployed: (state, action) => {
      state.isDeployed = action.payload;
    },
  },
});

export const {
  setWalletAddresses,
  setTokenBalanceData,
  setTokenConversionData,
  setGasCredit,
  setDeployed,
} = userSlice.actions;

export default userSlice.reducer;
