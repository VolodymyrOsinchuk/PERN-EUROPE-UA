import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import {
  useParams,
  useNavigate,
  redirect,
  useNavigation,
  useLoaderData,
} from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const loader = async ({ params }) => {
  console.log("🚀 ~ loader ~ params :", params);
  try {
    const { data } = await customFetch.get(
      `/auth/verify-email/${params.token}`,
    );
    console.log("🚀 ~ loader ~  data:", data);
    return data;
  } catch (error) {
    console.log("🚀 ~ loader ~ error:", error);
    // Fixed: toast was called here but never imported — now imported above
    toast.error(error?.response?.data?.message || "Помилка верифікації");
    return redirect("/register");
  }
};

const VerifyAccount = () => {
  const data = useLoaderData();
  console.log("🚀 ~ VerifyAccount ~ data:", data);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  // Fixed: error was referenced in JSX but never declared
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setIsVerified(true);
      setIsLoading(false);
    } else {
      setIsVerified(false);
      setIsLoading(false);
      setError("Посилання для верифікації недійсне або термін його дії минув.");
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
            Акаунт успішно підтверджено
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRedirect}
            sx={{ mt: 2 }}
          >
            Увійти
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
            Повернутися до входу
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VerifyAccount;
