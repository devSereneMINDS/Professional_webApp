import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: null,
  status: "idle", // loading | succeeded | failed
  error: null,
};

const paymentStatsSlice = createSlice({
  name: "paymentStats",
  initialState,
  reducers: {
    setPaymentStatsLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setPaymentStatsSuccess: (state, action) => {
      state.stats = action.payload;
      state.status = "succeeded";
    },
    setPaymentStatsError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

export const {
  setPaymentStatsLoading,
  setPaymentStatsSuccess,
  setPaymentStatsError,
} = paymentStatsSlice.actions;

export default paymentStatsSlice.reducer;
