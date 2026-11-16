import { Navigate, Outlet, useNavigation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Loading, Navbar } from "../components";
import { Box } from "@mui/material";

const ProfileLayout = () => {
  const { user } = useAuthContext();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      <Navbar />
      {isPageLoading ? (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </Box>
      ) : (
        <Outlet />
      )}
    </Box>
  );
};

export default ProfileLayout;
