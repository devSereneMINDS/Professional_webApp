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
    userChat:userChatReducer,
    client: clientReducer
  },
});

// If type declaration is needed, consider converting this file to TypeScript
export default store;
