import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    walletAddress: null,
    walletAddresses: null,
    tokenBalanceData: null,
    tokenConversionData: null,
    gasCredit: 0,
    isDeployed: true,
  },

  reducers: {
    setWalletAddress(state, action) {
      state.walletAddress = action.payload;
    },

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
  setWalletAddress,
  setWalletAddresses,
  setTokenBalanceData,
  setTokenConversionData,
  setGasCredit,
  setDeployed,
} = userSlice.actions;

export default userSlice.reducer;
