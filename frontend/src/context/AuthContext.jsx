import { Outlet } from "react-router-dom";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Box, CircularProgress } from "@mui/material";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await customFetch.get("/users/current-user");
      // console.log("🚀 ~ fetchUser ~ data:", data);
      setUser(data);
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(
          "Помилка отримання даних користувача. Будь ласка, увійдіть знову.",
        );
      }
      console.log("🚀 ~ fetchUser ~ помилка:", error.response);
      console.error(
        "Помилка fetchUser:",
        error.response?.data || error.message,
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logoutUser = async () => {
    try {
      await customFetch.post("/auth/logout");
      setUser(null);
      toast.success("Ви вийшли з системи...");
      window.location.href = "/";
    } catch (error) {
      toast.error("Помилка виходу. Спробуйте ще раз.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, logoutUser, fetchUser, setUser }}
    >
      {children ?? <Outlet />}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
