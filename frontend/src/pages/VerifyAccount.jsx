// Use named imports for hooks; default React import is unnecessary with the automatic JSX runtime
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import {
  useParams,
  useNavigate,
  redirect,
  useNavigation,
  useLoaderData,
} from "react-router-dom";
import customFetch from "../utils/customFetch";

export const loader = async ({ params }) => {
  console.log("🚀 ~ loader ~ params :", params);
  try {
    const { data } = await customFetch.get(
      `/auth/verify-email/${params.token}`
    );
    console.log("🚀 ~ loader ~  data:", data);
    return data;
  } catch (error) {
    console.log("🚀 ~ loader ~ error:", error);
    toast.error(error?.response.data?.msg);
    return redirect("/register");
  }
};

const VerifyAccount = () => {
  const data = useLoaderData();
  console.log("🚀 ~ VerifyAccount ~ data:", data);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (data) {
      setIsVerified(true);
      setIsLoading(false);
    } else {
      setIsVerified(false);
      setIsLoading(false);
      navigate("/register");
    }
  }, [data, navigate]);

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : isVerified ? (
        <Box sx={{ textAlign: "center", bgcolor: "white", p: 8 }} color="white">
          <Typography variant="h4" color="success.main">
            Compte verifie avec succes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRedirect}
            sx={{ mt: 2 }}
          >
            Se connecter
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", bgcolor: "white", p: 8 }}>
          <Typography variant="h4" color="error.main">
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRedirect}
            sx={{ mt: 2 }}
          >
            Retour a la conection
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VerifyAccount;
