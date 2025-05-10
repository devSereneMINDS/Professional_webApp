// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./slices/appointmentSlice";
import professionalReducer from "./slices/ProfessionalSlice";
import paymentStatsReducer from "./slices/paymentStatsSlice";
import professionalJournalReducer from "./slices/professionalJournalSlice";
import userReducer from "./slices/userSlice";
import userChatReducer from "./slices/userChatSlice";
import clientReducer from "./slices/clientSlice";

const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    professional: professionalReducer,
    paymentStats: paymentStatsReducer,
    professionalJournal: professionalJournalReducer,
    stepper: userReducer,
    userChat: userChatReducer,
    client: clientReducer
  },
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

export default store;