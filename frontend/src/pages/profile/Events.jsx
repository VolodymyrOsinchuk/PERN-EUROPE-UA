// import { useLoaderData, Form, redirect } from "react-router-dom";
// import { Box, Button, Typography, Container, Grid, Paper } from "@mui/material";
// import customFetch from "../../utils/customFetch";
// import { toast } from "react-toastify";

// export async function loader() {
//   try {
//     const { data } = await customFetch.get("/events");
//     return data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Помилка завантаження подій");
//     return [];
//   }
// }

// export async function action({ request }) {
//   const formData = await request.formData();
//   try {
//     await customFetch.delete(`/events/${formData.get("id")}`);
//     toast.success("Подію видалено");
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Помилка видалення");
//   }
//   return redirect("/profile/events");
// }

// export default function EventsProfile() {
//   const events = useLoaderData();

//   return (
//     <Container>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//         <Typography variant="h5">Мої події</Typography>
//         <Button variant="contained" href="/profile/events/create">Додати подію</Button>
//       </Box>

//       <Grid container spacing={2}>
//         {events.map((e) => (
//           <Grid key={e.id} item xs={12} md={6}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6">{e.title}</Typography>
//               <Typography color="text.secondary">{new Date(e.date).toLocaleDateString()}</Typography>
//               <Typography sx={{ mt: 1 }}>{e.description}</Typography>

//               <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
//                 <Button size="small" variant="outlined" href={`/profile/events/edit/${e.id}`}>
//                   Редагувати
//                 </Button>
//                 <Form method="post">
//                   <input type="hidden" name="id" value={e.id} />
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
import { useLoaderData, Form, useFetcher, Link } from "react-router-dom";
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
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

/* ── Loader / Action ── */
export async function loader() {
  try {
    const { data } = await customFetch.get("/events/user-events");
    return { events: data };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка завантаження подій");
    return { events: [] };
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  try {
    if (actionType === "deleteEvent") {
      await customFetch.delete(`/events/${formData.get("eventId")}`);
      return { success: true, message: "Подію видалено!" };
    }
    return { success: false };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Помилка",
    };
  }
}

/* ── Event card ── */
function EventCard({ event, onDelete }) {
  const isPast = new Date(event.date) < new Date();

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
      <Box sx={{ display: "flex" }}>
        {/* Date badge */}
        <Box
          sx={{
            width: 80,
            flexShrink: 0,
            bgcolor: isPast ? "#f1f5f9" : BLUE,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontWeight: 800,
              fontSize: "1.6rem",
              color: isPast ? "#94a3b8" : "#fff",
              lineHeight: 1,
            }}
          >
            {new Date(event.date).getDate()}
          </Typography>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              fontSize: "0.72rem",
              color: isPast ? "#94a3b8" : "rgba(255,255,255,.8)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {new Date(event.date).toLocaleDateString("uk-UA", {
              month: "short",
            })}
          </Typography>
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            p: 2.5,
            "&:last-child": { pb: "16px !important" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              {isPast && (
                <Chip
                  label="Завершена"
                  size="small"
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    mb: 1,
                    bgcolor: "#f1f5f9",
                    color: "#94a3b8",
                  }}
                />
              )}
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
                {event.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.78rem",
                  color: "#64748b",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {event.description}
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
              <Tooltip title="Редагувати">
                <IconButton
                  size="small"
                  component={Link}
                  to={`/profile/events/edit/${event.id}`}
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
                  onClick={() => onDelete(event)}
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

          {event.location && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5 }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.72rem",
                  color: "#94a3b8",
                }}
              >
                {event.location}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
}

/* ── Main Component ── */
export default function EventsProfile() {
  const { events } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (!selectedEvent) return;
    fetcher.submit(
      { actionType: "deleteEvent", eventId: selectedEvent.id },
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
            Мої події
          </Typography>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,.65)",
            }}
          >
            {events.length === 0
              ? "У вас поки немає подій"
              : `${events.length} подій`}
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
              Мої події
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
            to="/profile/events/create"
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
            Нова подія
          </Button>
        </Box>

        {/* ── Empty state ── */}
        {events.length === 0 ? (
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
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 36, color: "#cbd5e1" }}
              />
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
              Немає подій
            </Typography>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.875rem",
                color: "#cbd5e1",
                mb: 3,
              }}
            >
              Організуйте свою першу подію — це займе лише кілька хвилин
            </Typography>
            <Button
              component={Link}
              to="/profile/events/create"
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
              Створити подію
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {events.map((event, i) => (
              <Box
                key={event.id ?? i}
                sx={{
                  animation: "fadeUp 0.4s ease both",
                  animationDelay: `${i * 0.05}s`,
                  "@keyframes fadeUp": {
                    from: { opacity: 0, transform: "translateY(14px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <EventCard event={event} onDelete={handleDelete} />
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
          Видалити подію?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontFamily: F_BODY, fontSize: "0.875rem", color: "#64748b" }}
          >
            Подія{" "}
            <strong style={{ color: "#0f172a" }}>
              "{selectedEvent?.title}"
            </strong>{" "}
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
