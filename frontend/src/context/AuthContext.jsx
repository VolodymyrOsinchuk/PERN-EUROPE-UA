import { Outlet, useNavigate } from "react-router-dom";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Box, CircularProgress } from "@mui/material";
import customFetch, {
  clearAuthToken,
  getAuthToken,
} from "../utils/customFetch";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await customFetch.get("/users/current-user");
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await customFetch.post("/auth/logout");
    } catch {
      /* локальну сесію очищаємо в будь-якому разі */
    }
    clearAuthToken();
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Відновлення сесії при старті сайту та після оновлення сторінки.
  useEffect(() => {
    let cancelled = false;

    if (!getAuthToken()) {
      setLoading(false);
      return;
    }

    fetchUser().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchUser]);

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
