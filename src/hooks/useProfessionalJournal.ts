// src/hooks/useProfessionalJournal.js

import { useDispatch, useSelector } from "react-redux";
import { setJournals, setLoading, setError } from "../store/slices/professionalJournalSlice";
import { useEffect } from "react";

export const useProfessionalJournal = () => {
  const dispatch = useDispatch();
  const professionalId = useSelector((state) => state.professional?.data?.id);


  useEffect(() => {

    if(!professionalId){
      console.log("No professional id found")
      return
    }
    const fetchJournals = async () => {
      dispatch(setLoading(true)); // Set loading to true before making the API call

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/journals/professional/${professionalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch journals");
        }

        

        const data = await response.json();
        console.log("Data from journals hook",data)
        dispatch(setJournals(data)); // Dispatch fetched journals to Redux
        dispatch(setError(null)); // Clear any existing errors
      } catch (error) {
        dispatch(setError(error.message)); // Dispatch error if the API call fails
      } finally {
        dispatch(setLoading(false)); // Set loading to false once the API call is complete
      }
    };

    fetchJournals();
  }, [dispatch,professionalId]); // Fetch data on component mount

};
