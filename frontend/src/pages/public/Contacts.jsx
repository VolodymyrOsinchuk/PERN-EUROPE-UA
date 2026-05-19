// import { useState } from "react";
// import { HeroSection } from "../../components";
// import {
//   Alert,
//   Box,
//   Button,
//   Container,
//   IconButton,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import "../../assets/css/contact.css";
// import { Form, useActionData, useNavigation } from "react-router-dom";
// import { toast } from "react-toastify";
// import customFetch from "../../utils/customFetch";

// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const data = Object.fromEntries(formData);

//   try {
//     // Assuming there is a /contact endpoint or similar
//     // await customFetch.post("/contact", data);
//     toast.success(
//       "Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.",
//     );
//     return { success: true };
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.message || "Помилка при відправці повідомлення",
//     );
//     return { error: error?.response?.data?.message || "Error" };
//   }
// };

// const Contacts = () => {
//   const actionData = useActionData();
//   const navigation = useNavigation();
//   const isSubmitting = navigation.state === "submitting";

//   return (
//     <>
//       <HeroSection
//         title="Контакти"
//         typedStrings={["Зв'яжіться з нами!!!"]}
//         subtitle="Маєте питання чи пропозиції? Ми завжди раді вам допомогти!"
//         buttonText="Надіслати повідомлення"
//         buttonLink="/contact"
//         textAlign="left"
//       />
//       <Container className="content">
//         <Grid  container spacing={4}>
//           <Grid  size={{ xs: 12, md: 6 }}>
//             <Paper
//               elevation={3}
//               className="contact-form"
//               style={{ padding: "20px" }}
//             >
//               <Typography variant="h5" gutterBottom>
//                 Форма зворотного зв'язку
//               </Typography>
//               {actionData?.success && (
//                 <Alert severity="success" style={{ marginBottom: "20px" }}>
//                   Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим
//                   часом.
//                 </Alert>
//               )}
//               {actionData?.error && (
//                 <Alert severity="error" style={{ marginBottom: "20px" }}>
//                   {actionData.error}
//                 </Alert>
//               )}
//               <Form method="post">
//                 <TextField
//                   fullWidth
//                   label="Ім'я"
//                   name="name"
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   name="email"
//                   type="email"
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   label="Тема"
//                   name="subject"
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   fullWidth
//                   label="Повідомлення"
//                   name="message"
//                   multiline
//                   rows={4}
//                   margin="normal"
//                   required
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   disabled={isSubmitting}
//                   style={{ marginTop: "20px" }}
//                 >
//                   {isSubmitting ? "Відправка..." : "Надіслати"}
//                 </Button>
//               </Form>
//             </Paper>
//           </Grid>
//           <Grid  size={{ xs: 12, md: 6 }}>
//             <Paper elevation={3} className="contact-info">
//               <Typography variant="h5" gutterBottom>
//                 Наші контакти
//               </Typography>
//               <Box display="flex" alignItems="center" mb={2}>
//                 <span
//                   className="material-icons"
//                   style={{ marginRight: "10px" }}
//                 >
//                   email
//                 </span>
//                 <Typography>info@ukrainians-in-europe.com</Typography>
//               </Box>
//               <Box display="flex" alignItems="center" mb={2}>
//                 <span
//                   className="material-icons"
//                   style={{ marginRight: "10px" }}
//                 >
//                   location_on
//                 </span>
//                 <Typography>Європейський офіс: Варшава, Польща</Typography>
//               </Box>
//               <Box display="flex" alignItems="center">
//                 <span
//                   className="material-icons"
//                   style={{ marginRight: "10px" }}
//                 >
//                   schedule
//                 </span>
//                 <Typography>
//                   Графік роботи: Пн-Пт, 9:00 - 18:00 (CET)
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="h6"
//                 style={{ marginTop: "20px", marginBottom: "10px" }}
//               >
//                 Слідкуйте за нами:
//               </Typography>
//               <Box>
//                 <IconButton
//                   color="primary"
//                   href="https://facebook.com/ukrainians-in-europe"
//                 >
//                   <span className="material-icons">facebook</span>
//                 </IconButton>
//                 <IconButton
//                   color="primary"
//                   href="https://twitter.com/ukrainians_eu"
//                 >
//                   <span className="material-icons">twitter</span>
//                 </IconButton>
//                 <IconButton
//                   color="primary"
//                   href="https://instagram.com/ukrainians_in_europe"
//                 >
//                   <span className="material-icons">instagram</span>
//                 </IconButton>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// };
// export default Contacts;
import { useState } from "react";
import { HeroSection } from "../../components";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  try {
    toast.success("Дякуємо! Ми зв'яжемося з вами найближчим часом.");
    return { success: true };
  } catch (error) {
    toast.error("Помилка при відправці повідомлення");
    return { error: "Помилка" };
  }
};

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: fontBody,
    bgcolor: "#f8fafc",
    "&:hover fieldset": { borderColor: "#0057B8" },
    "&.Mui-focused fieldset": { borderColor: "#0057B8", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0057B8" },
  "& .MuiInputLabel-root": { fontFamily: fontBody },
};

const CONTACT_INFO = [
  { icon: "email", label: "Email", value: "info@ukrainians-in-europe.com" },
  { icon: "location_on", label: "Офіс", value: "Варшава, Польща" },
  { icon: "schedule", label: "Графік роботи", value: "Пн–Пт, 9:00–18:00 CET" },
];

const SOCIALS = [
  {
    icon: "facebook",
    href: "https://facebook.com",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    icon: "telegram",
    href: "https://telegram.org",
    label: "Telegram",
    color: "#0088cc",
  },
  {
    icon: "instagram",
    href: "https://instagram.com",
    label: "Instagram",
    color: "#e1306c",
  },
];

export default function Contacts() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <HeroSection
        title="Контакти"
        typedStrings={["Зв'яжіться з нами"]}
        subtitle="Маєте питання чи пропозиції? Ми завжди раді вам допомогти!"
        size="sm"
      />

      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid  container spacing={5} alignItems="flex-start">
            {/* ── Form ── */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#0057B8",
                    mb: 0.5,
                  }}
                >
                  Написати нам
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Форма зворотного зв'язку
                </Typography>
                <Box
                  sx={{
                    width: 48,
                    height: 4,
                    background: "linear-gradient(90deg, #0057B8, #FFD700)",
                    borderRadius: "99px",
                    mt: 1.5,
                  }}
                />
              </Box>

              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  p: { xs: 3, md: 4 },
                  boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                }}
              >
                {actionData?.success && (
                  <Alert
                    severity="success"
                    sx={{ mb: 3, borderRadius: "12px", fontFamily: fontBody }}
                  >
                    Дякуємо! Ми зв'яжемося з вами найближчим часом.
                  </Alert>
                )}

                <Form method="post">
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2.5,
                      }}
                    >
                      <TextField
                        name="name"
                        label="Ім'я"
                        required
                        fullWidth
                        sx={inputSx}
                      />
                      <TextField
                        name="email"
                        label="Email"
                        type="email"
                        required
                        fullWidth
                        sx={inputSx}
                      />
                    </Box>
                    <TextField
                      name="subject"
                      label="Тема"
                      required
                      fullWidth
                      sx={inputSx}
                    />
                    <TextField
                      name="message"
                      label="Повідомлення"
                      multiline
                      rows={5}
                      required
                      fullWidth
                      sx={inputSx}
                    />
                    <Button
                      type="submit"
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
                          transform: "translateY(-1px)",
                          boxShadow: "0 6px 20px rgba(0,87,184,.45)",
                        },
                        "&:disabled": { bgcolor: "#94a3b8" },
                        transition: "all 0.25s ease",
                        alignSelf: "flex-start",
                        px: 4,
                      }}
                    >
                      {isSubmitting ? "Відправка..." : "Надіслати повідомлення"}
                    </Button>
                  </Box>
                </Form>
              </Paper>
            </Grid>

            {/* ── Info ── */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#0057B8",
                    mb: 0.5,
                  }}
                >
                  Де ми є
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: "1.8rem",
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Наші контакти
                </Typography>
                <Box
                  sx={{
                    width: 48,
                    height: 4,
                    background: "linear-gradient(90deg, #0057B8, #FFD700)",
                    borderRadius: "99px",
                    mt: 1.5,
                  }}
                />
              </Box>

              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  p: { xs: 3, md: 4 },
                  mb: 3,
                  boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {CONTACT_INFO.map((item) => (
                    <Box
                      key={item.label}
                      sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "12px",
                          bgcolor: "#eff6ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          className="material-icons"
                          style={{ fontSize: 20, color: "#0057B8" }}
                        >
                          {item.icon}
                        </span>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: fontBody,
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            mb: 0.25,
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: fontBody,
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            color: "#0f172a",
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Socials */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  p: { xs: 3, md: 4 },
                  boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    mb: 2.5,
                  }}
                >
                  Слідкуйте за нами
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  {SOCIALS.map((s) => (
                    <Box
                      key={s.label}
                      component="a"
                      href={s.href}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        textDecoration: "none",
                        color: "#334155",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: s.color,
                          color: s.color,
                          bgcolor: `${s.color}10`,
                        },
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: 16 }}>
                        {s.icon}
                      </span>
                      <Typography
                        sx={{
                          fontFamily: fontBody,
                          fontWeight: 600,
                          fontSize: "0.8rem",
                        }}
                      >
                        {s.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
