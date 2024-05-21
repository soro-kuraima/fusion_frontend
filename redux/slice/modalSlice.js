import { createSlice } from "@reduxjs/toolkit";

const chainSlice = createSlice({
  name: "modal",

  initialState: {
    QRModal: false,
  },

  reducers: {
    toggleQRModal: (state) => {
      state.QRModal = !state.QRModal;
    },
  },
});

export const { toggleQRModal } = chainSlice.actions;

export default chainSlice.reducer;
