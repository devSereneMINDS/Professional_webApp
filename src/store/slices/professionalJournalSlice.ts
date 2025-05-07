// src/redux/professionalJournalSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  journals: [],
  loading: false,
  error: null,
};

const professionalJournalSlice = createSlice({
  name: "professionalJournal",
  initialState,
  reducers: {
    setJournals: (state, action) => {
      state.journals = action.payload; 
    },
    setLoading: (state, action) => {
      state.loading = action.payload; 
    },
    setError: (state, action) => {
      state.error = action.payload; 
    },
    deleteJournal: (state, action) => {
      if (Array.isArray(state.journals)) {
        state.journals = state.journals.filter(journal => journal.id !== action.payload);
      } else {
        state.journals = [];
      }
    },
  },
});

export const { setJournals, setLoading, setError, deleteJournal } = professionalJournalSlice.actions;
export default professionalJournalSlice.reducer;
