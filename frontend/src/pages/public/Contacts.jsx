import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  Stack,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { Form, useActionData, useNavigation } from "react-router-dom";

import {
  MailOutline,
  LocationOnOutlined,
  AccessTimeOutlined,
  ArrowOutward,
  SendRounded,
  Facebook,
  Instagram,
  Telegram,
  CheckCircleOutline,
} from "@mui/icons-material";

import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { HeroSection } from "../../components";

const BLUE = "#0756A5";
const NAVY = "#10243B";
const MUTED = "#64748b";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  if (data.website) {
    return { success: true };
  }

  try {
    await customFetch.post("/contact", data);

    toast.success("Дякуємо! Ми зв'яжемося з вами найближчим часом.");

    return { success: true };
  } catch (error) {
    const message =
      error?.response?.data?.error || "Помилка при відправці повідомлення";

    toast.error(message);

    return { error: message };
  }
};

const CONTACT_INFO = [
  {
    icon: <MailOutline />,
    label: "Електронна пошта",
    value: "info@ukrainians-in-europe.com",
    href: "mailto:info@ukrainians-in-europe.com",
  },
  {
    icon: <LocationOnOutlined />,
    label: "Наш офіс",
    value: "Варшава, Польща",
  },
  {
    icon: <AccessTimeOutlined />,
    label: "Графік роботи",
    value: "Пн–Пт, 9:00–18:00 CET",
  },
];

const SOCIALS = [
  {
    icon: <Facebook />,
    label: "Facebook",
    href: "https://facebook.com",
    color: "#1877F2",
  },
  {
    icon: <Instagram />,
    label: "Instagram",
    href: "https://instagram.com",
    color: "#E1306C",
  },
  {
    icon: <Telegram />,
    label: "Telegram",
    href: "https://telegram.org",
    color: "#229ED9",
  },
];

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: BLUE,
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    fontSize: "0.95rem",
    transition: "all .2s ease",

    "& fieldset": {
      borderColor: "#e2e8f0",
    },

    "&:hover fieldset": {
      borderColor: "#94b8df",
    },

    "&.Mui-focused": {
      backgroundColor: "#fff",
    },

    "&.Mui-focused fieldset": {
      borderColor: BLUE,
      borderWidth: "1.5px",
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: BLUE,
  },
};

export default function Contacts() {
  const actionData = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HERO SECTION */}

      <HeroSection
        title="Контакти"
        badge="МИ ЗАВЖДИ НА ЗВ'ЯЗКУ"
        typedStrings={[
          "Зв'яжіться з нами",
          "Ми завжди готові допомогти",
          "Давайте спілкуватися",
        ]}
        subtitle="Маєте запитання, ідею або пропозицію? Напишіть нам — ми завжди відкриті до спілкування та готові допомогти."
        size="sm"
      />

      {/* MAIN CONTENT */}

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 6,
            md: 10,
          },
          position: "relative",
        }}
      >
        <Grid
          container
          spacing={{
            xs: 4,
            md: 6,
          }}
        >
          {/* CONTACT FORM */}

          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 4,
                  md: 5,
                },
                borderRadius: {
                  xs: "18px",
                  md: "24px",
                },
                border: "1px solid #e8edf3",
                boxShadow: "0 15px 50px rgba(15,35,65,.045)",
              }}
            >
              <SectionLabel>Напишіть нам</SectionLabel>

              <Typography
                component="h2"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: {
                    xs: "1.9rem",
                    md: "2.35rem",
                  },
                  fontWeight: 700,
                  color: NAVY,
                  mb: 1.5,
                }}
              >
                Ми готові вас вислухати
              </Typography>

              <Typography
                sx={{
                  color: MUTED,
                  lineHeight: 1.8,
                  mb: 4,
                  fontSize: ".94rem",
                }}
              >
                Заповніть форму нижче, і наша команда відповість вам найближчим
                часом.
              </Typography>

              {actionData?.success && (
                <Alert
                  severity="success"
                  icon={<CheckCircleOutline />}
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                  }}
                >
                  Дякуємо! Ваше повідомлення успішно надіслано.
                </Alert>
              )}

              {actionData?.error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                  }}
                >
                  {actionData.error}
                </Alert>
              )}

              <Form method="post">
                <Stack spacing={2.5}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="name"
                        label="Ваше ім'я"
                        placeholder="Як до вас звертатися?"
                        required
                        fullWidth
                        autoComplete="name"
                        sx={fieldSx}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="email"
                        label="Email"
                        placeholder="example@email.com"
                        type="email"
                        required
                        fullWidth
                        autoComplete="email"
                        sx={fieldSx}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    name="subject"
                    label="Тема повідомлення"
                    placeholder="Про що хочете поговорити?"
                    required
                    fullWidth
                    sx={fieldSx}
                  />

                  <TextField
                    name="message"
                    label="Ваше повідомлення"
                    placeholder="Напишіть ваше повідомлення тут..."
                    multiline
                    minRows={5}
                    required
                    fullWidth
                    sx={fieldSx}
                  />

                  {/* HONEYPOT */}

                  <Box
                    component="input"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    sx={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                    }}
                  />

                  {/* SUBMIT BUTTON */}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SendRounded />
                      )
                    }
                    sx={{
                      alignSelf: {
                        xs: "stretch",
                        sm: "flex-start",
                      },
                      px: 4,
                      py: 1.6,
                      borderRadius: "12px",
                      background: BLUE,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: ".95rem",
                      textTransform: "none",
                      boxShadow: "0 6px 18px rgba(7,86,165,.22)",
                      transition: "all .25s ease",

                      "&:hover": {
                        background: "#06437f",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px rgba(7,86,165,.28)",
                      },

                      "&:disabled": {
                        background: "#94a3b8",
                        color: "#fff",
                      },
                    }}
                  >
                    {isSubmitting ? "Надсилаємо..." : "Надіслати повідомлення"}
                  </Button>

                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: ".76rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Надсилаючи форму, ви погоджуєтесь на обробку наданих вами
                    контактних даних для відповіді на запит.
                  </Typography>
                </Stack>
              </Form>
            </Paper>
          </Grid>
          {/* ================================== */}
          {/* CONTACT INFORMATION */}
          {/* ================================== */}

          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ mb: 3 }}>
              <SectionLabel>Наші контакти</SectionLabel>

              <Typography
                component="h2"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: {
                    xs: "1.9rem",
                    md: "2.2rem",
                  },
                  fontWeight: 700,
                  color: NAVY,
                  mb: 1,
                }}
              >
                Ми поруч
              </Typography>

              <Typography
                sx={{
                  color: MUTED,
                  fontSize: ".94rem",
                  lineHeight: 1.8,
                }}
              >
                Оберіть зручний спосіб зв'язку з нашою командою.
              </Typography>
            </Box>

            {/* CONTACT CARDS */}

            <Stack spacing={2}>
              {CONTACT_INFO.map((item) => (
                <Paper
                  key={item.label}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "17px",
                    border: "1px solid #e8edf3",

                    display: "flex",
                    alignItems: "center",
                    gap: 2,

                    transition: "all .25s ease",

                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: "#bfd5ed",
                      boxShadow: "0 10px 25px rgba(15,35,65,.05)",
                    },
                  }}
                >
                  {/* ICON */}

                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      flexShrink: 0,

                      display: "grid",
                      placeItems: "center",

                      borderRadius: "14px",
                      background: "#edf5ff",
                      color: BLUE,

                      "& svg": {
                        fontSize: 25,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* TEXT */}

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: MUTED,
                        fontSize: ".73rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                        mb: 0.5,
                      }}
                    >
                      {item.label}
                    </Typography>

                    {item.href ? (
                      <Typography
                        component="a"
                        href={item.href}
                        sx={{
                          color: NAVY,
                          fontWeight: 700,

                          fontSize: {
                            xs: ".82rem",
                            sm: ".92rem",
                          },

                          textDecoration: "none",
                          overflowWrap: "anywhere",

                          "&:hover": {
                            color: BLUE,
                          },
                        }}
                      >
                        {item.value}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          color: NAVY,
                          fontWeight: 700,
                          fontSize: ".92rem",
                        }}
                      >
                        {item.value}
                      </Typography>
                    )}
                  </Box>

                  {/* EMAIL LINK */}

                  {item.href && (
                    <IconButton
                      component="a"
                      href={item.href}
                      aria-label={`Написати: ${item.label}`}
                      sx={{
                        color: BLUE,
                        flexShrink: 0,
                      }}
                    >
                      <ArrowOutward />
                    </IconButton>
                  )}
                </Paper>
              ))}
            </Stack>

            {/* ================================== */}
            {/* SOCIAL NETWORKS */}
            {/* ================================== */}

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: "18px",
                background: NAVY,
                color: "#fff",
                overflow: "hidden",
                position: "relative",

                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,.12)",
                  right: -55,
                  bottom: -75,
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  mb: 1,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Слідкуйте за нами
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: ".85rem",
                  mb: 2.5,
                  lineHeight: 1.7,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Будьте в курсі новин та цікавих подій нашої спільноти.
              </Typography>

              <Stack direction="row" spacing={1.5}>
                {SOCIALS.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      color: "#fff",

                      border: "1px solid rgba(255,255,255,.2)",

                      position: "relative",
                      zIndex: 1,

                      transition: "all .2s ease",

                      "&:hover": {
                        background: social.color,
                        borderColor: social.color,
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* ================================== */}
        {/* BOTTOM MESSAGE */}
        {/* ================================== */}

        <Divider
          sx={{
            my: {
              xs: 5,
              md: 7,
            },
            borderColor: "#e8edf3",
          }}
        />

        <Box
          sx={{
            textAlign: "center",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: {
                xs: "1.45rem",
                md: "1.8rem",
              },
              color: NAVY,
              fontWeight: 700,
              mb: 1,
            }}
          >
            Разом ми можемо більше 💙💛
          </Typography>

          <Typography
            sx={{
              color: MUTED,
              fontSize: ".9rem",
              lineHeight: 1.8,
            }}
          >
            Дякуємо, що ви з нами. Будемо раді вашому повідомленню!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
