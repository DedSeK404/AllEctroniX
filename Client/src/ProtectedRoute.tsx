// Components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./api/useAuthStore";

const ProtectedRoute = () => {
  // Directly subscribe to `user` state so changes force an instant re-render
  const user = useAuthStore((state) => state.user);
  const token = localStorage.getItem("token");

  // If user is null and no token exists, redirect to login
  if (!user && !token) {
    return <Navigate to="/login/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;