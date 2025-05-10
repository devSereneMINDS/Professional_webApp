import { createSlice } from "@reduxjs/toolkit";

interface ProfessionalData {
  photo_url?: string;
  // Add other properties of the data object here if needed
}

const initialState: {
  data: ProfessionalData | null;
  currentProfessionalUID: string | null;
  professionalEmail: string | null;
  professionalToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
} = {
  data: null,
  currentProfessionalUID: null,
  professionalEmail: null,
  professionalToken: null,
  status: "idle", // loading | succeeded | failed
  error: null,
};

const professionalSlice = createSlice({
  name: "professional",
  initialState,
  reducers: {
    setProfessionalData: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
    setProfessionalError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
    setProfessionalLoading: (state) => {
      state.status = "loading";
    },
    setCurrentProfessionalUID: (state, action) => {
      state.currentProfessionalUID = action.payload; // Set UID from Google login
    },
    resetProfessionalData: (state) => {
      state.data = null;
      state.currentProfessionalUID = null;
      state.status = "idle";
      state.error = null;
    },
    setProfessionalToken: (state, action) => {
      state.professionalToken = action.payload;
    },
    setProfessionalEmail: (state, action) => {
      state.professionalEmail = action.payload;
    },
    setPhotoURL: (state, action) => {
      if (state.data) {
        state.data.photo_url = action.payload; 
      }
    },
  },
});

export const { setProfessionalData, setProfessionalError, setProfessionalLoading, setCurrentProfessionalUID,resetProfessionalData,setProfessionalToken,setProfessionalEmail,setPhotoURL } = professionalSlice.actions;

export default professionalSlice.reducer;
