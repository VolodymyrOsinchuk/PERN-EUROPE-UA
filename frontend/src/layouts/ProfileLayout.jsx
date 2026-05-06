import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Loading, Navbar } from "../components";
import { Box } from "@mui/material";

const ProfileLayout = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      {isPageLoading ? <Loading /> : <Outlet />}
    </Box>
  );
};

export default ProfileLayout;
