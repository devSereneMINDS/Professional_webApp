import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setPaymentStatsLoading,
  setPaymentStatsSuccess,
  setPaymentStatsError,
} from "../store/slices/paymentStatsSlice";
import { RootState } from "../store/store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ProfessionalData {
  id?: string;
  // Add other properties as needed
}

export const useFetchPaymentStats = () => {
  const dispatch = useDispatch();
  const { stats, status, error } = useSelector((state: RootState) => state.paymentStats);
  const professionalId = useSelector((state: RootState) => (state.professional as { data?: ProfessionalData }).data?.id);

  useEffect(() => {
    const fetchPaymentStats = async () => {
      dispatch(setPaymentStatsLoading());
      try {
        if (!professionalId) return;

        const response = await axios.get(
          `${API_BASE_URL}/appointment/professional/stats/${professionalId}`
        );
        dispatch(setPaymentStatsSuccess(response.data.stats));
      } catch (err) {
        if (err instanceof Error) {
          dispatch(setPaymentStatsError(err.message));
        } else {
          dispatch(setPaymentStatsError("An unknown error occurred"));
        }
      }
    };

    if (status === "idle" && professionalId) {
      fetchPaymentStats();
    }
  }, [dispatch, status, professionalId]);

  return { stats, status, error };
};