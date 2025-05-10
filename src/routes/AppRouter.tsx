import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "../pages/SigninProfessional/page"
import Onboading from "../pages/Onboarding/page"
import MyClients from "../pages/Clients/page"
import HomePage from "../pages/Dashboard/page"
import Chats from "../pages/Chat/page"
import Calendar from "../pages/Calender/page"
import Appointments from "../pages/Appointments/page"
import Settings from "../pages/Settings/page"
import Payment from "../pages/Payment/page"
import Demo from "../pages/Chat/page"
import ProfessionalProfile from "../pages/ProfessionalProfile/page"

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
    path:"/",
    element: <HomePage />,
  },
  {
    path:"/appointments",
    element: <Appointments />,
  },
  {
    path:"/clients",
    element: <MyClients />,
  },
  {
    path:"/chats",
    element: <Chats />,
  },
  {
    path:"/calendar",
    element: <Calendar />,
  },
  {
    path:"/settings",
    element: <Settings />,
  },
  {
    path:"/payment",
    element: <Payment />
  },
  {
    path:"/demo",
    element: <Demo />,
  },
  {
    path:"/professional/:id",
    element: <ProfessionalProfile />,
  }

        ],
    );

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
