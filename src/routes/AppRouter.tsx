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
import ClientProfile from "../pages/ClientProfile/page"
import AddNewClient from "../pages/AddNewClient/page";
import Demo from "../pages/Demo/page";8

interface ProfessionalData {
  id?: string;
  full_name?: string;
  email?: string;
  photo_url?: string;
}

// Error Page Component
const ErrorPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#3f51b5',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Home Page
      </button>
    </div>
  );
};

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const professional = useSelector((state: RootState) => state.professional as { data?: ProfessionalData });
  const userEmail = localStorage.getItem("userEmail");
  const googleAccessToken = localStorage.getItem("googleAccessToken");

  if (!userEmail || !googleAccessToken || !professional?.data?.id) {
    console.log("User is not authenticated", { userEmail, googleAccessToken, professionalId: professional?.data?.id });
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Define the router
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Signin />,
    errorElement: <ErrorPage />
  },
  {
    path: "/register",
    element: <Onboading />,
    errorElement: <ErrorPage />
  },
  // Protected Routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/appointments",
    element: (
      <ProtectedRoute>
        <Appointments />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute>
        <MyClients />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/chats",
    element: (
      <ProtectedRoute>
        <Chats />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <Calendar />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/add-new-client",
    element: (
      <ProtectedRoute>
        <AddNewClient />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/professionals/:id",
    element: (
      <ProtectedRoute>
        <ProfessionalProfile />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
   {
    path: "/clients/:id",
    element: (
      <ProtectedRoute>
       <ClientProfile />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
   {
    path: "/demo",
    element: (
       <Demo />
    ),
  },
  // Catch-all route for non-existent paths
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}