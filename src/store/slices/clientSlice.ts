import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data:null,
  name: null,
  age: null,
  email: null,
  sex: null,
  phone_no: null,
  diagnosis: null,
  photo_url: null,
  zipcode: null,
  city: null,
  currentClientUID: null,
  status: "idle", // loading | succeeded | failed
  error: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientName: (state, action) => {
      state.name = action.payload;
    },
    setClientAge: (state, action) => {
      state.age = action.payload;
    },
    setClientEmail: (state, action) => {
      state.email = action.payload;
    },
    setClientSex: (state, action) => {
      state.sex = action.payload;
    },
    setClientPhoneNo: (state, action) => {
      state.phone_no = action.payload;
    },
    setClientDiagnosis: (state, action) => {
      state.diagnosis = action.payload;
    },
    setClientPhotoUrl: (state, action) => {
      state.photo_url = action.payload;
    },
    setClientZipcode: (state, action) => {
      state.zipcode = action.payload;
    },
    setClientCity: (state, action) => {
      state.city = action.payload;
    },
    setCurrentClientUID: (state, action) => {
      state.currentClientUID = action.payload; // Set UID from Google login
    },
    setClientError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
    setClientLoading: (state) => {
      state.status = "loading";
    },
    setClientData: (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
    },
  },
});

export const {
  setClientName,
  setClientAge,
  setClientEmail,
  setClientSex,
  setClientPhoneNo,
  setClientDiagnosis,
  setClientPhotoUrl,
  setClientZipcode,
  setClientCity,
  setCurrentClientUID,
  setClientError,
  setClientLoading,
  setClientData,
} = clientSlice.actions;

export default clientSlice.reducer;
