import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setPaymentStatsLoading,
  setPaymentStatsSuccess,
  setPaymentStatsError,
} from "../store/slices/paymentStatsSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFetchPaymentStats = () => {
  const dispatch = useDispatch();
  const { stats, status, error } = useSelector((state) => state.paymentStats);
  const professionalId = useSelector((state) => state.professional?.data?.id); // Get professionalId from Redux store

  useEffect(() => {
    const fetchPaymentStats = async () => {
      dispatch(setPaymentStatsLoading());
      try {
        if (!professionalId) return; // If professionalId is not available, don't make the API call

        const response = await axios.get(
          `${API_BASE_URL}/appointment/professional/stats/${professionalId}`
        );
        dispatch(setPaymentStatsSuccess(response.data.stats));
      } catch (err) {
        dispatch(setPaymentStatsError(err.message));
      }
    };

    // Fetch stats only if the status is "idle" and professionalId is available
    if (status === "idle" && professionalId) {
      fetchPaymentStats();
    }
  }, [dispatch, status, professionalId]);

  return { stats, status, error };
};
