import { createSlice } from "@reduxjs/toolkit";


interface Availability {
  startTime: string;
  endTime: string;
  days: string[]; // Array of days (e.g., ["Monday", "Tuesday"])
}
interface ProfessionalDetails {
  professionalId: string;
  availability: Availability[]; // Array of availability objects
  // Add other professional details as needed
}
interface PersonalDetails {
  fullName: string;
  area_of_expertise: string;
  phone: string;
  dateOfBirth: string;
  email: string;
  profilePic: string;
}
interface UserState {
  activeStep: number;
  personalDetails: PersonalDetails;
  otp: string;
  professionalDetails: ProfessionalDetails;
  document: File | null;
  isTermsChecked: boolean;
  professionalId: string | null;
  availability: Availability[]; // Array of availability objects
}


const initialState = {
  activeStep: 0,
  personalDetails: {
    fullName: "",
    area_of_expertise: "",
    phone: "",
    dateOfBirth: "",
    email: "",
    profilePic: "",
  },
  otp: "",
  professionalDetails: {},
  document: null,
  isTermsChecked: false,
  professionalId: null,
  availability: {}, // Add availability to the initial state
};

const userSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    nextStep: (state) => {
      if (state.activeStep < 5) state.activeStep += 1;
    },
    prevStep: (state) => {
      if (state.activeStep > 0) state.activeStep -= 1;
    },
    updatePersonalDetails: (state, action) => {
      state.personalDetails = { ...state.personalDetails, ...action.payload };
    },
    uploadProfilePic: (state, action) => {
      state.personalDetails.profilePic = action.payload;
      console.log("profile pic from redux bitch", action.payload);
    },
    updateOtp: (state, action) => {
      state.otp = action.payload;
    },
    updateEmail: (state, action) => {
      state.personalDetails.email = action.payload;
    },
    updateProfessionalDetails: (state, action) => {
      state.professionalDetails = { ...state.professionalDetails, ...action.payload };
    },
    uploadDocument: (state, action) => {
      state.document = action.payload;
    },
    toggleTermsChecked: (state, action) => {
      state.isTermsChecked = action.payload;
    },
    resetStepper: (state) => {
      Object.assign(state, initialState);
    },
    setProfessionalId: (state, action) => {
      state.professionalId = action.payload;
    },
    updateAvailability: (state, action) => {
      state.availability = action.payload; // Reducer to update availability
    },
  },
});

export const {
  setActiveStep,
  nextStep,
  prevStep,
  updatePersonalDetails,
  uploadProfilePic,
  updateOtp,
  updateEmail,
  updateProfessionalDetails,
  uploadDocument,
  toggleTermsChecked,
  resetStepper,
  setProfessionalId,
  updateAvailability,
} = userSlice.actions;

export default userSlice.reducer;
