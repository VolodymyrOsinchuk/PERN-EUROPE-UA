// import { Outlet, useNavigate, useNavigation } from "react-router-dom";
// import { useAuthContext } from "../context/AuthContext";
// import { Loading, Navbar } from "../components";
// import { Box } from "@mui/material";

// const ProfileLayout = () => {
//   const { user } = useAuthContext();
//   const navigate = useNavigate();
//   const navigation = useNavigation();
//   const isPageLoading = navigation.state === "loading";

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//       <Navbar />
//       {isPageLoading ? <Loading /> : <Outlet />}
//     </Box>
//   );
// };

// export default ProfileLayout;
import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Loading, Navbar } from "../components";
import { Box } from "@mui/material";
import { useEffect } from "react";

const ProfileLayout = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  /* Redirect to login if not authenticated */
  useEffect(() => {
    if (!user && !isPageLoading) {
      navigate("/login", { replace: true });
    }
  }, [user, isPageLoading, navigate]);

  if (!user) return <Loading />;

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
