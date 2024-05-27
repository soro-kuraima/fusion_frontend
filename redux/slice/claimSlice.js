import { createSlice } from "@reduxjs/toolkit";

const claimSlice = createSlice({
  name: "claim",

  initialState: {
    step: 0,
    isFinalizing: false,
    claimDrawer: false,
    deployProof: null,
    isLoading: false,
    isRequesting: false,
  },

  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setIsFinalizing: (state, action) => {
      state.isFinalizing = action.payload;
    },
    toggleClaimDrawer: (state) => {
      state.claimDrawer = !state.claimDrawer;
    },
    setDeployProof: (state, action) => {
      state.deployProof = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsRequesting: (state, action) => {
      state.isRequesting = action.payload;
    },
  },
});

export const {
  setStep,
  setIsFinalizing,
  toggleClaimDrawer,
  setDeployProof,
  setIsLoading,
  setIsRequesting,
} = claimSlice.actions;

export default claimSlice.reducer;
