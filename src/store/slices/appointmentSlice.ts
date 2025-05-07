import { createSlice } from "@reduxjs/toolkit";

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    upcoming: [],
    completed: [],
    cancelled: [],
  },
  reducers: {
    setAppointments: (state, action) => {
      return action.payload; // Replace state with categorized data
    },
  },
});

export const { setAppointments } = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
