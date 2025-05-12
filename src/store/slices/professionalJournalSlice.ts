// src/redux/professionalJournalSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Journal {
  id: string; // or number, depending on your data
  // Add other journal properties here
  // e.g., title: string;
  // content: string;
  // date: string;
}

interface ProfessionalJournalState {
  journals: Journal[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfessionalJournalState = {
  journals: [],
  loading: false,
  error: null,
};

const professionalJournalSlice = createSlice({
  name: "professionalJournal",
  initialState,
  reducers: {
    setJournals: (state, action: PayloadAction<Journal[]>) => {
      state.journals = action.payload; 
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload; 
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload; 
    },
    deleteJournal: (state, action: PayloadAction<string>) => { // or number if id is number
      state.journals = state.journals.filter(journal => journal.id !== action.payload);
    },
  },
});

export const { setJournals, setLoading, setError, deleteJournal } = professionalJournalSlice.actions;
export default professionalJournalSlice.reducer;