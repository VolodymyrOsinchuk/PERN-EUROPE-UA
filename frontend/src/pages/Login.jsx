// import { Fragment } from "react";
// import { Form, Link, redirect, useNavigation } from "react-router-dom";

// import {
//   Button,
//   Typography,
//   Container,
//   Paper,
//   Divider,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";
// import { FormRow } from "../components";
// import customFetch from "../utils/customFetch";
// import { toast } from "react-toastify";
// import "../assets/css/login.css";

// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const dataForm = Object.fromEntries(formData);

//   try {
//     const { data } = await customFetch.post("/auth/login", dataForm, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     toast.success("Ви увійшли успішно");
//     window.location.href = "/profile";
//     return null;
//   } catch (error) {
//     console.log("🚀 ~ action ~ error:", error);
//     toast.error(error?.response?.data?.message || "Сталася помилка");
//     return error;
//   }
// };
// const Login = () => {
//   const navigation = useNavigation();
//   const isSubmitting = navigation.state === "submitting";

//   const handleSocialLogin = (provider) => {
//     console.log(`Logging in with ${provider}`);
//     // Here you would implement OAuth login with the selected provider
//   };
//   return (
//     <Fragment>
//       <div className="hero">
//         <Container>
//           <Typography variant="h3" gutterBottom>
//             Вхід до платформи
//           </Typography>
//           <Typography variant="h6">
//             Увійдіть у свій аккаунт для доступу до всіх можливостей
//           </Typography>
//         </Container>
//       </div>

//       <Container>
//         <Paper className="login-form" elevation={3}>
//           <div style={{ marginBottom: "20px" }}>
//             <Button
//               variant="contained"
//               fullWidth
//               style={{
//                 marginBottom: "10px",
//                 backgroundColor: "#DB4437",
//                 color: "white",
//               }}
//               onClick={() => handleSocialLogin("google")}
//             >
//               <img
//                 src="https://www.google.com/favicon.ico"
//                 alt="Google icon"
//                 style={{ width: "20px", height: "20px", marginRight: "10px" }}
//               />
//               Увійти через Google
//             </Button>
//             <Button
//               variant="contained"
//               fullWidth
//               style={{
//                 marginBottom: "10px",
//                 backgroundColor: "#4267B2",
//                 color: "white",
//               }}
//               onClick={() => handleSocialLogin("facebook")}
//             >
//               <img
//                 src="https://www.facebook.com/favicon.ico"
//                 alt="Facebook icon"
//                 style={{ width: "20px", height: "20px", marginRight: "10px" }}
//               />
//               Увійти через Facebook
//             </Button>
//             <Button
//               variant="contained"
//               fullWidth
//               style={{
//                 marginBottom: "10px",
//                 backgroundColor: "#1DA1F2",
//                 color: "white",
//               }}
//               onClick={() => handleSocialLogin("twitter")}
//             >
//               <img
//                 src="https://twitter.com/favicon.ico"
//                 alt="Twitter icon"
//                 style={{ width: "20px", height: "20px", marginRight: "10px" }}
//               />
//               Увійти через Twitter
//             </Button>
//           </div>

//           <Divider style={{ margin: "20px 0" }}>
//             <Typography variant="body2" color="textSecondary">
//               або
//             </Typography>
//           </Divider>

//           <Form method="post">
//             <div className="form-field">
//               <FormRow label="Email" name="email" type="email" />
//             </div>
//             <div className="form-field">
//               <FormRow type="password" label="Пароль" name="password" />
//             </div>
//             <div className="form-field">
//               <FormControlLabel
//                 control={<Checkbox name="rememberMe" />}
//                 label="Запам'ятати мене"
//               />
//             </div>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               size="large"
//               fullWidth
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "З'єднання..." : "Увійти"}
//             </Button>
//             <Typography
//               variant="body2"
//               style={{ marginTop: "20px", textAlign: "center" }}
//             >
//               Забули пароль?{" "}
//               <Button color="primary" component={Link} to="#">
//                 Відновити
//               </Button>
//             </Typography>
//             <Typography
//               variant="body2"
//               style={{ marginTop: "10px", textAlign: "center" }}
//             >
//               Немає аккаунту?{" "}
//               <Button color="primary" component={Link} to="/register">
//                 Зареєструватися
//               </Button>
//             </Typography>
//           </Form>
//         </Paper>
//       </Container>
//     </Fragment>
//   );
// };
// export default Login;
import { Fragment } from "react";
import { Form, Link, useNavigation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { FormRow } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { redirect } from "react-router-dom";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const dataForm = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/login", dataForm, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success("Ви увійшли успішно");
    window.location.href = "/profile";
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Сталася помилка");
    return error;
  }
};

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const SOCIAL_PROVIDERS = [
  {
    name: "Google",
    bgcolor: "#fff",
    color: "#374151",
    border: "#e5e7eb",
    favicon: "https://www.google.com/favicon.ico",
  },
  {
    name: "Facebook",
    bgcolor: "#1877F2",
    color: "#fff",
    border: "#1877F2",
    favicon: "https://www.facebook.com/favicon.ico",
  },
];

export default function Login() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fc 100%)",
      }}
    >
      {/* ── Left decorative panel (desktop) ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: "0 0 420px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(160deg, #0057B8 0%, #003d82 60%, #002255 100%)",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,215,0,.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,215,0,.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative", textAlign: "center", maxWidth: 320 }}>
          {/* Flag logo */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "14px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              mx: "auto",
              mb: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,.3)",
            }}
          >
            <Box sx={{ flex: 1, bgcolor: "#0057B8", border: "none" }} />
            <Box sx={{ flex: 1, bgcolor: "#FFD700" }} />
          </Box>

          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 900,
              fontSize: "2rem",
              color: "#fff",
              letterSpacing: "-0.02em",
              mb: 1.5,
            }}
          >
            Ласкаво просимо
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 3,
              background: "linear-gradient(90deg, #FFD700, rgba(255,215,0,.3))",
              borderRadius: "99px",
              mx: "auto",
              mb: 2.5,
            }}
          />
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,.7)",
              lineHeight: 1.7,
            }}
          >
            Платформа для українців у Європі. Увійдіть, щоб отримати повний
            доступ до спільноти.
          </Typography>

          {/* Quote */}
          <Box
            sx={{
              mt: 5,
              p: 3,
              bgcolor: "rgba(255,255,255,.06)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,.1)",
            }}
          >
            <Typography
              sx={{
                fontFamily: fontDisplay,
                fontStyle: "italic",
                fontSize: "1rem",
                color: "rgba(255,255,255,.85)",
                lineHeight: 1.6,
                mb: 1.5,
              }}
            >
              "Платформа допомогла мені знайти роботу та нових друзів в Берліні
              за два тижні."
            </Typography>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.8rem",
                color: "rgba(255,255,255,.5)",
                fontWeight: 600,
              }}
            >
              — Оксана М., Берлін
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Right: login form ── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 5,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ flex: 1, bgcolor: "#0057B8" }} />
              <Box sx={{ flex: 1, bgcolor: "#FFD700" }} />
            </Box>
            <Typography
              sx={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "1rem",
                color: "#0057B8",
              }}
            >
              Українці в Європі
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "2rem",
              color: "#0f172a",
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            Увійти
          </Typography>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.9rem",
              color: "#64748b",
              mb: 4,
            }}
          >
            Немає акаунту?{" "}
            <Box
              component={Link}
              to="/register"
              sx={{
                color: "#0057B8",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Зареєструватися
            </Box>
          </Typography>

          {/* Social buttons */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
            {SOCIAL_PROVIDERS.map((p) => (
              <Button
                key={p.name}
                fullWidth
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: p.bgcolor,
                  color: p.color,
                  border: `1px solid ${p.border}`,
                  borderRadius: "12px",
                  py: 1.3,
                  gap: 1,
                  boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                  "&:hover": { opacity: 0.88, transform: "translateY(-1px)" },
                  transition: "all 0.2s",
                  fontSize: "0.875rem",
                }}
              >
                <img
                  src={p.favicon}
                  alt={p.name}
                  width={16}
                  height={16}
                  style={{ borderRadius: "2px" }}
                />
                {p.name}
              </Button>
            ))}
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.8rem",
                color: "#94a3b8",
                px: 1,
              }}
            >
              або
            </Typography>
          </Divider>

          {/* Email form */}
          <Form method="post">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                name="email"
                label="Email"
                type="email"
                required
                fullWidth
                autoComplete="email"
                sx={inputSx}
              />
              <TextField
                name="password"
                label="Пароль"
                type="password"
                required
                fullWidth
                autoComplete="current-password"
                sx={inputSx}
              />

              <Box
                sx={{ display: "flex", justifyContent: "flex-end", mt: -1.5 }}
              >
                <Box
                  component={Link}
                  to="#"
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.8rem",
                    color: "#0057B8",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Забули пароль?
                </Box>
              </Box>

              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#0057B8",
                  color: "#fff",
                  borderRadius: "12px",
                  py: 1.5,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 14px rgba(0,87,184,.35)",
                  "&:hover": {
                    bgcolor: "#003d82",
                    boxShadow: "0 6px 20px rgba(0,87,184,.45)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": { bgcolor: "#94a3b8" },
                  transition: "all 0.25s ease",
                  mt: 0.5,
                }}
              >
                {isSubmitting ? "З'єднання..." : "Увійти"}
              </Button>
            </Box>
          </Form>

          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "center",
              mt: 4,
              lineHeight: 1.6,
            }}
          >
            Входячи, ви погоджуєтеся з нашою{" "}
            <Box
              component={Link}
              to="/policy"
              sx={{ color: "#64748b", "&:hover": { color: "#0057B8" } }}
            >
              політикою конфіденційності
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    bgcolor: "#f8fafc",
    "&:hover fieldset": { borderColor: "#0057B8" },
    "&.Mui-focused fieldset": { borderColor: "#0057B8" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0057B8" },
  "& .MuiInputLabel-root": { fontFamily: "'Plus Jakarta Sans',sans-serif" },
};
