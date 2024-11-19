import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyAccount = (props) => {
  const { token } = useParams();
  const [isVerified, setIsVerified] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `https::localhost:5000/api/v1/auth/verify-email/${token}`
        );
        if (response.statusCode === 200) {
          setIsVerified(false);
        }
      } catch (error) {
        console.error("🚀 ~ verifyToken ~ error:", error);
        //
        setError("Token invalid or expired");
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

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

VerifyAccount.propTypes = {};
export default VerifyAccount;
