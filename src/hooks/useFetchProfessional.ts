import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProfessionalData,
  setProfessionalError,
  setProfessionalLoading,
} from "../store/slices/ProfessionalSlice";

const useFetchProfessional = () => {
  const dispatch = useDispatch();
  const professionalId = useSelector((state) => state.professional?.data?.id); // Get professionalId from Redux store

  useEffect(() => {
    if (!professionalId) return; // If professionalId is not available, do not make the API call
    console.log("Fetching professional data for Professional form hook");
    const fetchData = async () => {
      dispatch(setProfessionalLoading()); // Set loading state

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/professionals/${professionalId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch professional data");
        }

        const data = await response.json();

        dispatch(setProfessionalData(data)); // Dispatch fetched data to Redux store
      } catch (error) {
        dispatch(setProfessionalError(error.message)); // Dispatch error if any
      }
    };

    fetchData();
  }, [dispatch, professionalId]); // Fetch data when professionalId changes
};

export default useFetchProfessional;
