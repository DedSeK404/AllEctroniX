import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { fetchCurrentUser } from "./api/AuthService";


const AppLayout = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Session initialization failed:", error);
          logout(); // Clear dead token silently
        }
      }
    };

    initAuth();
  }, [setUser, logout]);

  return <Outlet />; // Renders whichever child route matches (Dashboard or Login)
};

export default AppLayout;