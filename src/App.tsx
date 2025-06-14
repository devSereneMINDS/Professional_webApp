import { useDispatch } from "react-redux";
import useFetchAppointments from "./hooks/useFetchAppointment.js";
import { useFetchPaymentStats } from "./hooks/useFetchPaymentStats.js";
import AppRouter from "./routes/AppRouter";
import { setProfessionalId } from "./store/slices/userSlice.js";
import { useEffect, useState } from "react";
import { setProfessionalData, setProfessionalError } from "./store/slices/ProfessionalSlice.js";
import useInitializeUserChats from "./hooks/useInitializeUserData.js";
import { useProfessionalJournal } from "./hooks/useProfessionalJournal.js";
import { CircularProgress, CssVarsProvider } from "@mui/joy";
import { CssBaseline } from "@mui/joy";
import { initializeGroupChat } from "./utils/utility";
import useInactivityTimer from "./hooks/useInactivityTimer.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ProfessionalData {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  street1: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
}

const createAccountForProfessional = async (professionalData: ProfessionalData) => {
  const payload = {
    professional_id: professionalData.id,
    email: professionalData.email,
    phone: professionalData.phone,
    type: "route",
    legal_business_name: `Dr ${professionalData.full_name}'s Clinic`,
    business_type: "proprietorship",
    contact_name: professionalData.full_name,
    profile: {
      category: "healthcare",
      subcategory: "clinic",
      addresses: {
        registered: {
          street1: professionalData.street1,
          street2: professionalData.street1,
          city: professionalData.city,
          state: professionalData.state,
          postal_code: professionalData.pin_code,
          country: professionalData.country,
        },
      },
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create account");
    }

    const result = await response.json();
    console.log("Account created successfully:", result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating account:", error.message);
    } else {
      console.error("Error creating account:", error);
    }
  }
};

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useInactivityTimer(8);
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      const fetchProfessionalByEmail = async () => {
        try {
          await initializeGroupChat();
          const response = await fetch(`${API_BASE_URL}/professionals/email/${userEmail}`);
          const data = await response.json();
          console.log("Professional data:", data);
          if (data.id) {
            dispatch(setProfessionalData(data));
            dispatch(setProfessionalId(data.id));

            if (!data.banking_details) {
              await createAccountForProfessional(data);
            }
          }
        } catch (error) {
          console.error("Error fetching professional by email:", error);
          if (error instanceof Error) {
            dispatch(setProfessionalError(error.message));
          } else {
            dispatch(setProfessionalError("An unknown error occurred"));
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfessionalByEmail();
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  useFetchAppointments();
  useFetchPaymentStats();
  useInitializeUserChats();
  useProfessionalJournal();

  if (isLoading) {
    return (
      <CssVarsProvider>
        <CssBaseline />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
          }}
        >
          <CircularProgress size="md" variant="solid" />
        </div>
      </CssVarsProvider>
    );
  }

  return (
    <CssVarsProvider>
      <CssBaseline />
      <AppRouter />
    </CssVarsProvider>
  );
}

export default App;
