import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Signin from "../pages/SigninProfessional/page";
import Onboading from "../pages/Onboarding/page";
import MyClients from "../pages/Clients/page";
import HomePage from "../pages/Dashboard/page";
import Chats from "../pages/Chat/page";
import Calendar from "../pages/Calender/page";
import Appointments from "../pages/Appointments/page";
import Settings from "../pages/Settings copy/page";
import Payment from "../pages/Payment/page";
import ProfessionalProfile from "../pages/ProfessionalProfile/page";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import AddNewClient from "../pages/AddNewClient/page";

interface ProfessionalData {
  id?: string;
  full_name?: string;
  email?: string;
  photo_url?: string;
}

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const professional = useSelector((state: RootState) => state.professional as { data?: ProfessionalData });
  const userEmail = localStorage.getItem("userEmail");
  const googleAccessToken = localStorage.getItem("googleAccessToken");

  if (!userEmail || !googleAccessToken || !professional?.data?.id) { // Ensure id exists in ProfessionalData
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Define the router
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/register",
    element: <Onboading />,
  },
  {
    path: "/profile/:id",
    element: <ProfessionalProfile />,
  },
  // Protected Routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/appointments",
    element: (
      <ProtectedRoute>
        <Appointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute>
        <MyClients />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chats",
    element: (
      <ProtectedRoute>
        <Chats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <Calendar />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/demo",
  //   element: (
  //     <ProtectedRoute>
  //       <Demo />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: "/add-new-client",
    element: (
      <ProtectedRoute>
        <AddNewClient />
      </ProtectedRoute>
    ),
  },
  // Catch-all route for unauthenticated users
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}