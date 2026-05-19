// import { useLoaderData, Form, redirect } from "react-router-dom";
// import { Box, Button, Typography, Container, Grid, Paper } from "@mui/material";
// import customFetch from "../../utils/customFetch";
// import { toast } from "react-toastify";

// export async function loader() {
//   try {
//     const { data } = await customFetch.get("/publications");
//     return data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Помилка завантаження публікацій");
//     return [];
//   }
// }

// export async function action({ request }) {
//   const formData = await request.formData();
//   try {
//     await customFetch.delete(`/publications/${formData.get("id")}`);
//     toast.success("Публікацію видалено");
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Помилка видалення");
//   }
//   return redirect("/profile/publications");
// }

// export default function PublicationsProfile() {
//   const publications = useLoaderData();

//   return (
//     <Container>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//         <Typography variant="h5">Мої публікації</Typography>
//         <Button variant="contained" href="/profile/publications/create">Додати публікацію</Button>
//       </Box>

//       <Grid container spacing={2}>
//         {publications.map((p) => (
//           <Grid key={p.id} item xs={12} md={6}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6">{p.title}</Typography>
//               <Typography color="text.secondary">{new Date(p.date).toLocaleDateString()}</Typography>
//               <Typography sx={{ mt: 1 }}>{p.content}</Typography>

//               <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
//                 <Button size="small" variant="outlined" href={`/profile/publications/edit/${p.id}`}>
//                   Редагувати
//                 </Button>
//                 <Form method="post">
//                   <input type="hidden" name="id" value={p.id} />
//                   <Button size="small" type="submit" variant="contained" color="error">
//                     Видалити
//                   </Button>
//                 </Form>
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// }
import { useState } from "react";
import { useLoaderData, useFetcher, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const CAT_COLORS = {
  Документи: { bg: "#eff6ff", text: "#1d4ed8" },
  Робота: { bg: "#ecfdf5", text: "#065f46" },
  Житло: { bg: "#fff7ed", text: "#9a3412" },
  Освіта: { bg: "#f5f3ff", text: "#6d28d9" },
  Медицина: { bg: "#fff1f2", text: "#be123c" },
  Культура: { bg: "#fdf4ff", text: "#7e22ce" },
  Інтеграція: { bg: "#f0fdf4", text: "#166534" },
};

/* ── Loader / Action ── */
export async function loader() {
  try {
    const { data } = await customFetch.get("/publications/user-publications");
    return { publications: data };
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка завантаження публікацій",
    );
    return { publications: [] };
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  try {
    if (actionType === "deletePublication") {
      await customFetch.delete(
        `/publications/${formData.get("publicationId")}`,
      );
      return { success: true, message: "Публікацію видалено!" };
    }
    return { success: false };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Помилка",
    };
  }
}

/* ── Publication card ── */
function PublicationCard({ publication, onDelete }) {
  const clr = CAT_COLORS[publication.category] || {
    bg: "#f1f5f9",
    text: "#64748b",
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,87,184,.1)",
        },
      }}
    >
      {/* Category color bar */}
      <Box sx={{ height: 3, bgcolor: clr.text, opacity: 0.5 }} />
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: "16px !important" } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              {publication.category && (
                <Chip
                  label={publication.category}
                  size="small"
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    bgcolor: clr.bg,
                    color: clr.text,
                  }}
                />
              )}
              {publication.readTime && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 11, color: "#94a3b8" }} />
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.68rem",
                      color: "#94a3b8",
                    }}
                  >
                    {publication.readTime}
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#0f172a",
                lineHeight: 1.3,
                mb: 0.5,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {publication.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.78rem",
                color: "#64748b",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.5,
              }}
            >
              {publication.content}
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
            <Tooltip title="Відкрити">
              <IconButton
                size="small"
                component={Link}
                to={`/publications/${publication.id}`}
                sx={{
                  color: "#94a3b8",
                  "&:hover": { color: BLUE, bgcolor: "#eff6ff" },
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Редагувати">
              <IconButton
                size="small"
                component={Link}
                to={`/profile/publications/edit/${publication.id}`}
                sx={{
                  color: "#94a3b8",
                  "&:hover": { color: "#0f172a", bgcolor: "#f1f5f9" },
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Видалити">
              <IconButton
                size="small"
                onClick={() => onDelete(publication)}
                sx={{
                  color: "#94a3b8",
                  "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" },
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {publication.date && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5 }}
          >
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: 12, color: "#94a3b8" }}
            />
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.72rem", color: "#94a3b8" }}
            >
              {new Date(publication.date).toLocaleDateString("uk-UA")}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Main Component ── */
export default function PublicationsProfile() {
  const { publications } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedPub, setSelectedPub] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = (pub) => {
    setSelectedPub(pub);
    setDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (!selectedPub) return;
    fetcher.submit(
      { actionType: "deletePublication", publicationId: selectedPub.id },
      { method: "post" },
    );
    setDeleteOpen(false);
  };

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
        <Container maxWidth="lg" sx={{ position: "relative" }}>
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
            Мої публікації
          </Typography>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,.65)",
            }}
          >
            {publications.length === 0
              ? "У вас поки немає публікацій"
              : `${publications.length} публікацій`}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* ── Header row ── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: "1.6rem",
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Мої публікації
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 3,
                background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
                borderRadius: "99px",
                mt: 0.75,
              }}
            />
          </Box>
          <Button
            variant="contained"
            component={Link}
            to="/profile/publications/create"
            startIcon={<AddIcon />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: BLUE,
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              boxShadow: "0 4px 14px rgba(0,87,184,.3)",
              "&:hover": {
                bgcolor: "#003d82",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(0,87,184,.4)",
              },
              transition: "all 0.25s ease",
            }}
          >
            Нова публікація
          </Button>
        </Box>

        {/* ── Empty state ── */}
        {publications.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1.5px solid #e2e8f0",
              p: 8,
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,.04)",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <ArticleOutlinedIcon sx={{ fontSize: 36, color: "#cbd5e1" }} />
            </Box>
            <Typography
              sx={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#94a3b8",
                mb: 1,
              }}
            >
              Немає публікацій
            </Typography>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.875rem",
                color: "#cbd5e1",
                mb: 3,
              }}
            >
              Поділіться корисним досвідом зі спільнотою
            </Typography>
            <Button
              component={Link}
              to="/profile/publications/create"
              startIcon={<AddIcon />}
              variant="contained"
              sx={{
                fontFamily: F_BODY,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: BLUE,
                borderRadius: "12px",
                "&:hover": { bgcolor: "#003d82" },
              }}
            >
              Створити публікацію
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {publications.map((pub, i) => (
              <Box
                key={pub.id ?? i}
                sx={{
                  animation: "fadeUp 0.4s ease both",
                  animationDelay: `${i * 0.05}s`,
                  "@keyframes fadeUp": {
                    from: { opacity: 0, transform: "translateY(14px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <PublicationCard publication={pub} onDelete={handleDelete} />
              </Box>
            ))}
          </Box>
        )}
      </Container>

      {/* ── Delete dialog ── */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: "1.2rem",
            pb: 1,
          }}
        >
          Видалити публікацію?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontFamily: F_BODY, fontSize: "0.875rem", color: "#64748b" }}
          >
            Публікація{" "}
            <strong style={{ color: "#0f172a" }}>"{selectedPub?.title}"</strong>{" "}
            буде видалена назавжди.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: "#64748b",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            Скасувати
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
            }}
          >
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
