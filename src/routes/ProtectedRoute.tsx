// ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store/store';

const ProtectedRoute = () => {
  const professional = useSelector((state: RootState) => state.professional as { data?: { id?: string } });
  const userEmail = localStorage.getItem("userEmail");
  const googleAccessToken = localStorage.getItem("googleAccessToken");

  if (!userEmail || !googleAccessToken || !professional?.data?.id) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;