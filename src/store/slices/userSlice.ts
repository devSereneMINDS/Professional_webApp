import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PersonalDetails {
  fullName: string;
  area_of_expertise: string;
  phone: string;
  dateOfBirth: string;
  email: string;
  profilePic: string;
}

interface ProfessionalDetails {
  expertise: string;
  yearsOfExperience: number;
  certifications?: string[];
}

interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

interface UserState {
  activeStep: number;
  personalDetails: PersonalDetails;
  otp: string;
  professionalDetails: ProfessionalDetails;
  document: File | null; // Updated to use a more specific type
  isTermsChecked: boolean;
  professionalId: string | null;
  availability: Availability;
}

const initialState: UserState = {
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
  professionalDetails: {
    expertise: "",
    yearsOfExperience: 0,
    certifications: [],
  },
  document: null,
  isTermsChecked: false,
  professionalId: null,
  availability: {
    day: "",
    startTime: "",
    endTime: "",
  },
};

const userSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    nextStep: (state) => {
      if (state.activeStep < 5) state.activeStep += 1;
    },
    prevStep: (state) => {
      if (state.activeStep > 0) state.activeStep -= 1;
    },
    updatePersonalDetails: (state, action: PayloadAction<Partial<PersonalDetails>>) => {
      state.personalDetails = { ...state.personalDetails, ...action.payload };
    },
    uploadProfilePic: (state, action: PayloadAction<string>) => {
      state.personalDetails.profilePic = action.payload;
    },
    updateOtp: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.personalDetails.email = action.payload;
    },
    updateProfessionalDetails: (state, action: PayloadAction<ProfessionalDetails>) => {
      state.professionalDetails = { ...state.professionalDetails, ...action.payload };
      console.log("updated", action.payload);
    },
    uploadDocument: (state, action: PayloadAction<File | null>) => {
      state.document = action.payload;
    },
    toggleTermsChecked: (state, action: PayloadAction<boolean>) => {
      state.isTermsChecked = action.payload;
    },
    resetStepper: (state) => {
      Object.assign(state, initialState);
    },
    setProfessionalId: (state, action: PayloadAction<string | null>) => {
      state.professionalId = action.payload;
    },
    updateAvailability: (state, action: PayloadAction<Availability>) => {
      state.availability = action.payload;
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