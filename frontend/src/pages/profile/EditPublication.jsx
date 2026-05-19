// import { useLoaderData, Form, redirect } from "react-router-dom";
// import { Container, TextField, Button, Box, Typography } from "@mui/material";
// import customFetch from "../../utils/customFetch";
// import { toast } from "react-toastify";

// export async function loader({ params }) {
//   try {
//     const { data } = await customFetch.get(`/publications/${params.id}`);
//     return data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Помилка завантаження");
//     return null;
//   }
// }

// export async function action({ request, params }) {
//   const formData = await request.formData();
//   const payload = {
//     title: formData.get("title"),
//     content: formData.get("content"),
//     date: formData.get("date"),
//   };
//   try {
//     await customFetch.put(`/publications/${params.id}`, payload);
//     toast.success("Публікацію оновлено");
//     return redirect("/profile/publications");
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Помилка оновлення");
//     return null;
//   }
// }

// export default function EditPublication() {
//   const publication = useLoaderData();
//   if (!publication) return <Container><Typography>Публікацію не знайдено</Typography></Container>;

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h5" sx={{ mb: 2 }}>Редагувати публікацію</Typography>
//       <Form method="post">
//         <TextField name="title" label="Заголовок" defaultValue={publication.title} fullWidth sx={{ mb: 2 }} />
//         <TextField name="date" label="Дата" type="date" defaultValue={publication.date ? publication.date.split('T')[0] : ''} InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }} />
//         <TextField name="content" label="Текст" multiline rows={6} defaultValue={publication.content} fullWidth sx={{ mb: 2 }} />
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <Button type="submit" variant="contained">Зберегти</Button>
//           <Button href="/profile/publications">Скасувати</Button>
//         </Box>
//       </Form>
//     </Container>
//   );
// }
import { useState } from "react";
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const CATEGORIES = [
  "Документи",
  "Робота",
  "Житло",
  "Освіта",
  "Медицина",
  "Культура",
  "Інтеграція",
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: F_BODY,
    bgcolor: "#f8fafc",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: BLUE },
    "&.Mui-focused fieldset": { borderColor: BLUE, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
  "& .MuiInputLabel-root": { fontFamily: F_BODY },
  "& .MuiFormHelperText-root": { fontFamily: F_BODY, fontSize: "0.75rem" },
};

const selectSx = {
  borderRadius: "12px",
  fontFamily: F_BODY,
  bgcolor: "#f8fafc",
  "& fieldset": { borderColor: "#e2e8f0" },
  "&:hover fieldset": { borderColor: BLUE },
  "&.Mui-focused fieldset": { borderColor: BLUE },
};

/* ── Loader / Action ── */
export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/publications/${params.id}`);
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка завантаження публікації",
    );
    return null;
  }
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const payload = {
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    readTime: formData.get("readTime"),
  };
  try {
    await customFetch.put(`/publications/${params.id}`, payload);
    toast.success("Публікацію оновлено!");
    return redirect("/profile");
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка оновлення публікації",
    );
    return null;
  }
}

/* ── Step section wrapper ── */
function StepSection({ number, title, subtitle, completed, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: `1.5px solid ${completed ? "#a7f3d0" : "#e2e8f0"}`,
        overflow: "hidden",
        boxShadow: completed
          ? "0 4px 20px rgba(16,185,129,.08)"
          : "0 4px 24px rgba(0,87,184,.05)",
        transition: "border-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2.5,
          borderBottom: `1px solid ${completed ? "#a7f3d0" : "#f1f5f9"}`,
          bgcolor: completed ? "#f0fdf4" : "#fafbfc",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: completed ? "#10b981" : BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {completed ? (
            <CheckCircleIcon sx={{ fontSize: 18, color: "#fff" }} />
          ) : (
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontWeight: 800,
                fontSize: "0.85rem",
                color: "#fff",
              }}
            >
              {number}
            </Typography>
          )}
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#0f172a",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.78rem", color: "#64748b" }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ p: { xs: 3, md: 4 } }}>{children}</Box>
    </Paper>
  );
}

/* ── Main Component ── */
export default function EditPublication() {
  const publication = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [articleTitle, setArticleTitle] = useState(publication?.title || "");
  const [category, setCategory] = useState(publication?.category || "");
  const [content, setContent] = useState(publication?.content || "");
  const [readTime, setReadTime] = useState(publication?.readTime || "");

  if (!publication) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontSize: "1.4rem",
              color: "#94a3b8",
              mb: 2,
            }}
          >
            Публікацію не знайдено
          </Typography>
          <Button
            component={Link}
            to="/profile"
            startIcon={<ArrowBackIcon />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              color: BLUE,
            }}
          >
            Повернутися до профілю
          </Button>
        </Box>
      </Box>
    );
  }

  const step1Done = !!(articleTitle && category);
  const step2Done = content.length >= 10;
  const canSubmit = step1Done && step2Done;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* ── Hero header ── */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
          py: { xs: 5, md: 7 },
          position: "relative",
          overflow: "hidden",
        }}
      >
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
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #FFD700 30%, #FFD700 70%, transparent)",
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, md: 4 },
            position: "relative",
          }}
        >
          <Button
            component={Link}
            to="/profile"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: "rgba(255,255,255,.7)",
              fontSize: "0.85rem",
              mb: 3,
              p: 0,
              "&:hover": { color: "#fff", bgcolor: "transparent" },
            }}
          >
            Назад до профілю
          </Button>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              color: "#fff",
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            Редагувати публікацію
          </Typography>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,.65)",
            }}
          >
            Оновіть вміст вашої публікації
          </Typography>
        </Box>
      </Box>

      {/* ── Form ── */}
      <Box
        sx={{
          maxWidth: 860,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Form method="post">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Step 1 */}
            <StepSection
              number={1}
              title="Заголовок та категорія"
              subtitle="Визначте тему вашої публікації"
              completed={step1Done}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  name="title"
                  label="Заголовок публікації"
                  required
                  fullWidth
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleOutlinedIcon
                          sx={{ fontSize: 16, color: "#94a3b8" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ fontFamily: F_BODY }}>
                      Категорія
                    </InputLabel>
                    <Select
                      name="category"
                      label="Категорія"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      sx={selectSx}
                    >
                      {CATEGORIES.map((cat) => (
                        <MenuItem
                          key={cat}
                          value={cat}
                          sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                        >
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    name="readTime"
                    label="Час читання"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 хв"
                    helperText="Необов'язково"
                    sx={{ ...inputSx, maxWidth: 180 }}
                  />
                </Box>
              </Box>
            </StepSection>

            {/* Step 2 */}
            <StepSection
              number={2}
              title="Текст публікації"
              subtitle="Мінімум 10 символів"
              completed={step2Done}
            >
              <TextField
                name="content"
                label="Текст"
                required
                fullWidth
                multiline
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                inputProps={{ minLength: 10, maxLength: 20000 }}
                helperText={`${content.length} / 20 000 символів`}
                sx={inputSx}
              />
            </StepSection>

            {/* ── Submit bar ── */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                pt: 2,
                pb: 4,
              }}
            >
              <Button
                variant="outlined"
                component={Link}
                to="/profile"
                disabled={isSubmitting}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.3,
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": { borderColor: "#0f172a", color: "#0f172a" },
                }}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !canSubmit}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                  ) : (
                    <SaveOutlinedIcon />
                  )
                }
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: BLUE,
                  borderRadius: "12px",
                  px: 4,
                  py: 1.3,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 14px rgba(0,87,184,.35)",
                  "&:hover": {
                    bgcolor: "#003d82",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(0,87,184,.45)",
                  },
                  "&:disabled": { bgcolor: "#94a3b8", boxShadow: "none" },
                  transition: "all 0.25s ease",
                }}
              >
                {isSubmitting ? "Збереження..." : "Зберегти зміни"}
              </Button>
            </Box>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}