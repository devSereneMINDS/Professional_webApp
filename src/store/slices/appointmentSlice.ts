import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// types/appointment.ts (create this file)
//  interface Client {
//   id?: string;
//   name?: string;
//   photo_url?: string;
//   phone_no?: string;
// }

// In your appointmentSlice.ts
interface Appointment {
  id: number;  // Changed from string to number
  appointment_time: string;
  duration?: string;
  client?: {
    name?: string;
    email?: string;
    photo_url?: string;
    phone_no?: string;
  };
  meet_link?: string | null;
  message?: string;
  status?: string;
  professionalName?: string;
  [x: string]: string | number | boolean | null | undefined | object;
}

 interface AppointmentsState {
  upcoming: Appointment[];
  completed: Appointment[];
  cancelled: Appointment[];
}

const initialState: AppointmentsState = {
  upcoming: [],
  completed: [],
  cancelled: [],
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (_state, action: PayloadAction<AppointmentsState>) => {
      return action.payload;
    },
  },
});

export const { setAppointments } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
