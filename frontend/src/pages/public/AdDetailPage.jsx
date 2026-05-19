import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Paper,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { ImageGallery } from "../../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  useLoaderData,
  Form,
  useActionData,
  useNavigation,
  Link,
} from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/* ── Loaders / Actions ── */
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/adv/${params.id}`);
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка завантаження оголошення",
    );
    return error;
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  try {
    if (intent === "message") {
      toast.success("Повідомлення надіслано");
    } else if (intent === "report") {
      toast.success("Скаргу надіслано");
    }
    return { success: true };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка");
    return { error: error?.response?.data?.message || "Error" };
  }
};

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const CAT_COLORS = {
  default: { bg: "#eff6ff", text: "#1d4ed8" },
  work: { bg: "#ecfdf5", text: "#065f46" },
  housing: { bg: "#fff7ed", text: "#9a3412" },
  services: { bg: "#eff6ff", text: "#1d4ed8" },
  education: { bg: "#f5f3ff", text: "#6d28d9" },
  other: { bg: "#f8fafc", text: "#475569" },
};

const REPORT_REASONS = [
  "Шахрайство",
  "Некоректна інформація",
  "Образливий контент",
  "Спам",
  "Інше",
];

/* ── Sub-components ── */
function ContactCard({ ad, onMessage, onReport }) {
  const authorName =
    ad.author ||
    (ad.user ? `${ad.user.firstName} ${ad.user.lastName}` : "Анонім");
  const initials = authorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: "1.5px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,87,184,.07)",
        position: "sticky",
        top: 90,
      }}
    >
      {/* Header strip */}
      <Box
        sx={{
          height: 6,
          background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
        }}
      />

      <Box sx={{ p: 3 }}>
        {/* Author */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: "#eff6ff",
              color: BLUE,
              fontFamily: F_BODY,
              fontWeight: 800,
              fontSize: "1.1rem",
              border: "2px solid #dbeafe",
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0f172a",
                }}
              >
                {authorName}
              </Typography>
              <VerifiedIcon sx={{ fontSize: 16, color: BLUE }} />
            </Box>
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.78rem", color: "#64748b" }}
            >
              На сайті з 2023 року
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "#f1f5f9" }} />

        {/* Contact details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
          {(ad.contact || ad.phone) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                border: "1px solid #f1f5f9",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <PhoneOutlinedIcon sx={{ fontSize: 16, color: BLUE }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.7rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Телефон
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {ad.contact || ad.phone}
                </Typography>
              </Box>
            </Box>
          )}
          {ad.email && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                border: "1px solid #f1f5f9",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <EmailOutlinedIcon sx={{ fontSize: 16, color: BLUE }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.7rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ad.email}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* CTA buttons */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={onMessage}
          sx={{
            fontFamily: F_BODY,
            fontWeight: 700,
            textTransform: "none",
            bgcolor: BLUE,
            borderRadius: "12px",
            py: 1.4,
            fontSize: "0.95rem",
            boxShadow: "0 4px 14px rgba(0,87,184,.3)",
            mb: 1.5,
            "&:hover": {
              bgcolor: "#003d82",
              boxShadow: "0 6px 20px rgba(0,87,184,.4)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.25s ease",
          }}
        >
          Написати повідомлення
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<ReportOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onReport}
          sx={{
            fontFamily: F_BODY,
            fontWeight: 600,
            textTransform: "none",
            borderColor: "#e2e8f0",
            color: "#94a3b8",
            borderRadius: "12px",
            py: 1.2,
            fontSize: "0.85rem",
            "&:hover": {
              borderColor: "#ef4444",
              color: "#ef4444",
              bgcolor: "#fef2f2",
            },
          }}
        >
          Повідомити про порушення
        </Button>

        {/* Published date */}
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: "0.75rem",
            color: "#94a3b8",
            textAlign: "center",
            mt: 2.5,
          }}
        >
          Опубліковано:{" "}
          {new Date(ad.createdAt).toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Typography>
      </Box>
    </Paper>
  );
}

function MessageDialog({ open, onClose, recipient, isSubmitting }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
    >
      <Form method="post" onSubmit={onClose}>
        <input type="hidden" name="intent" value="message" />
        <DialogTitle
          sx={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: "1.3rem",
            pb: 1,
          }}
        >
          Написати {recipient}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.875rem",
              color: "#64748b",
              mb: 2.5,
            }}
          >
            Ваше повідомлення буде надіслане автору оголошення.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={5}
            fullWidth
            name="message"
            label="Ваше повідомлення"
            variant="outlined"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: F_BODY,
                "&:hover fieldset": { borderColor: BLUE },
                "&.Mui-focused fieldset": { borderColor: BLUE },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={onClose}
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
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: BLUE,
              borderRadius: "10px",
              px: 3,
              "&:hover": { bgcolor: "#003d82" },
            }}
          >
            {isSubmitting ? "Надсилання..." : "Надіслати"}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

function ReportDialog({ open, onClose, adTitle, isSubmitting }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
    >
      <Form method="post" onSubmit={onClose}>
        <input type="hidden" name="intent" value="report" />
        <DialogTitle
          sx={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: "1.3rem",
            pb: 1,
          }}
        >
          Повідомити про порушення
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              bgcolor: "#fef2f2",
              border: "1px solid #fecaca",
              mb: 2.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.82rem",
                color: "#991b1b",
                fontWeight: 600,
              }}
            >
              Оголошення: {adTitle}
            </Typography>
          </Box>
          <TextField
            select
            fullWidth
            name="reason"
            label="Причина скарги"
            defaultValue=""
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: F_BODY,
                "&:hover fieldset": { borderColor: BLUE },
                "&.Mui-focused fieldset": { borderColor: BLUE },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
            }}
          >
            {REPORT_REASONS.map((r) => (
              <MenuItem
                key={r}
                value={r}
                sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
              >
                {r}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            multiline
            rows={4}
            fullWidth
            name="details"
            label="Деталі порушення"
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: F_BODY,
                "&:hover fieldset": { borderColor: BLUE },
                "&.Mui-focused fieldset": { borderColor: BLUE },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={onClose}
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
            type="submit"
            variant="contained"
            color="error"
            disabled={isSubmitting}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
            }}
          >
            {isSubmitting ? "Надсилання..." : "Надіслати скаргу"}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

/* ── Main Page ── */
export default function AdDetailPage() {
  const ad = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [messageOpen, setMessageOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!ad || !ad.title) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography
          sx={{ fontFamily: F_DISPLAY, fontSize: "1.5rem", color: "#94a3b8" }}
        >
          Оголошення не знайдено
        </Typography>
        <Button
          component={Link}
          to="/ads"
          sx={{
            mt: 2,
            fontFamily: F_BODY,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          ← Назад до оголошень
        </Button>
      </Container>
    );
  }

  const catKey = ad.category?.slug || "default";
  const catColor = CAT_COLORS[catKey] || CAT_COLORS.default;
  const locationLabel =
    typeof ad.location === "object"
      ? `${ad.location.city}, ${ad.location.state}`
      : ad.location;
  const recipient = ad.author || (ad.user ? ad.user.firstName : "автора");

  return (
    <>
      {/* ── Top bar ── */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid #f1f5f9",
          py: 1.5,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Breadcrumb */}
            <Breadcrumbs
              separator={<NavigateNextIcon sx={{ fontSize: 14 }} />}
              sx={{ "& .MuiBreadcrumbs-separator": { color: "#cbd5e1" } }}
            >
              <MuiLink
                component={Link}
                to="/"
                underline="hover"
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.8rem",
                  color: "#64748b",
                }}
              >
                Головна
              </MuiLink>
              <MuiLink
                component={Link}
                to="/ads"
                underline="hover"
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.8rem",
                  color: "#64748b",
                }}
              >
                Оголошення
              </MuiLink>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.8rem",
                  color: "#0f172a",
                  fontWeight: 600,
                  maxWidth: 240,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {ad.title}
              </Typography>
            </Breadcrumbs>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title={saved ? "Збережено" : "Зберегти"}>
                <IconButton
                  size="small"
                  onClick={() => setSaved((v) => !v)}
                  sx={{
                    border: "1.5px solid",
                    borderColor: saved ? BLUE : "#e2e8f0",
                    borderRadius: "10px",
                    color: saved ? BLUE : "#94a3b8",
                    bgcolor: saved ? "#eff6ff" : "#fff",
                    "&:hover": {
                      borderColor: BLUE,
                      color: BLUE,
                      bgcolor: "#eff6ff",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  {saved ? (
                    <BookmarkIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <BookmarkBorderIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Поділитися">
                <IconButton
                  size="small"
                  sx={{
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    color: "#94a3b8",
                    bgcolor: "#fff",
                    "&:hover": {
                      borderColor: BLUE,
                      color: BLUE,
                      bgcolor: "#eff6ff",
                    },
                  }}
                >
                  <ShareIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Button
                component={Link}
                to="/ads"
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.85rem",
                  color: "#64748b",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "10px",
                  px: 1.5,
                  bgcolor: "#fff",
                  "&:hover": {
                    borderColor: BLUE,
                    color: BLUE,
                    bgcolor: "#eff6ff",
                  },
                }}
              >
                До списку
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#f8fafc", py: { xs: 4, md: 6 }, minHeight: "80vh" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* ── LEFT: main content ── */}
            <Grid item xs={12} md={8}>
              {/* Title block */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    label={ad.category?.name || "Інше"}
                    size="small"
                    sx={{
                      bgcolor: catColor.bg,
                      color: catColor.text,
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  />
                  {ad.isPromoted && (
                    <Chip
                      label="⭐ Топ оголошення"
                      size="small"
                      sx={{
                        bgcolor: "#fffbe6",
                        color: "#92400e",
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        border: "1px solid #fde68a",
                      }}
                    />
                  )}
                </Box>

                <Typography
                  sx={{
                    fontFamily: F_DISPLAY,
                    fontWeight: 700,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  {ad.title}
                </Typography>

                {/* Meta */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 16, color: "#94a3b8" }}
                    />
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.85rem",
                        color: "#64748b",
                      }}
                    >
                      {locationLabel}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                  >
                    <CalendarTodayOutlinedIcon
                      sx={{ fontSize: 14, color: "#94a3b8" }}
                    />
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.85rem",
                        color: "#64748b",
                      }}
                    >
                      {new Date(ad.createdAt || ad.date).toLocaleDateString(
                        "uk-UA",
                      )}
                    </Typography>
                  </Box>
                  {ad.views !== undefined && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: 15, color: "#94a3b8" }}
                      >
                        visibility
                      </span>
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontSize: "0.85rem",
                          color: "#64748b",
                        }}
                      >
                        {ad.views} переглядів
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Gallery */}
              {ad.photos?.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1.5px solid #e2e8f0",
                    mb: 3.5,
                    boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                  }}
                >
                  <ImageGallery photos={ad.photos} />
                </Paper>
              )}

              {/* Price badge */}
              {ad.price && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2.5,
                    py: 1.2,
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${BLUE}, #003d82)`,
                    mb: 3.5,
                    boxShadow: "0 4px 14px rgba(0,87,184,.3)",
                  }}
                >
                  <span
                    className="material-icons"
                    style={{ fontSize: 18, color: GOLD }}
                  >
                    euro
                  </span>
                  <Typography
                    sx={{
                      fontFamily: F_DISPLAY,
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: "#fff",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {Number(ad.price).toLocaleString("uk-UA")}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,.6)",
                      alignSelf: "flex-end",
                      mb: 0.25,
                    }}
                  >
                    євро
                  </Typography>
                </Box>
              )}

              {/* Description */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1.5px solid #e2e8f0",
                  p: { xs: 3, md: 4 },
                  mb: 3.5,
                  boxShadow: "0 2px 12px rgba(0,0,0,.04)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      borderRadius: "99px",
                      background: `linear-gradient(180deg, ${BLUE}, ${GOLD})`,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#0f172a",
                    }}
                  >
                    Опис оголошення
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.95rem",
                    color: "#334155",
                    lineHeight: 1.85,
                    whiteSpace: "pre-line",
                  }}
                >
                  {ad.description}
                </Typography>
              </Paper>

              {/* Amenities */}
              {ad.amenities?.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "20px",
                    border: "1.5px solid #e2e8f0",
                    p: { xs: 3, md: 4 },
                    mb: 3.5,
                    boxShadow: "0 2px 12px rgba(0,0,0,.04)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 20,
                        borderRadius: "99px",
                        background: `linear-gradient(180deg, ${BLUE}, ${GOLD})`,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#0f172a",
                      }}
                    >
                      Зручності та особливості
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {ad.amenities.map((a, i) => (
                      <Chip
                        key={i}
                        label={a}
                        icon={
                          <span
                            className="material-icons"
                            style={{
                              fontSize: "14px !important",
                              color: "#10b981",
                            }}
                          >
                            check_circle
                          </span>
                        }
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          bgcolor: "#ecfdf5",
                          color: "#065f46",
                          border: "1px solid #a7f3d0",
                          borderRadius: "10px",
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              )}

              {/* Location details */}
              {(ad.country || ad.city) && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "20px",
                    border: "1.5px solid #e2e8f0",
                    p: { xs: 3, md: 4 },
                    boxShadow: "0 2px 12px rgba(0,0,0,.04)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 20,
                        borderRadius: "99px",
                        background: `linear-gradient(180deg, ${BLUE}, ${GOLD})`,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#0f172a",
                      }}
                    >
                      Місцезнаходження
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {[
                      { label: "Країна", value: ad.country, icon: "flag" },
                      { label: "Регіон", value: ad.state, icon: "map" },
                      { label: "Місто", value: ad.city, icon: "location_city" },
                      { label: "Адреса", value: ad.location, icon: "place" },
                    ]
                      .filter((r) => r.value)
                      .map((row) => (
                        <Box
                          key={row.label}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: "10px",
                            bgcolor: "#f8fafc",
                          }}
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: 16, color: "#94a3b8" }}
                          >
                            {row.icon}
                          </span>
                          <Typography
                            sx={{
                              fontFamily: F_BODY,
                              fontSize: "0.78rem",
                              color: "#94a3b8",
                              fontWeight: 600,
                              minWidth: 56,
                            }}
                          >
                            {row.label}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: F_BODY,
                              fontSize: "0.9rem",
                              color: "#334155",
                              fontWeight: 500,
                            }}
                          >
                            {row.value}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* ── RIGHT: contact card ── */}
            <Grid item xs={12} md={4}>
              <ContactCard
                ad={ad}
                onMessage={() => setMessageOpen(true)}
                onReport={() => setReportOpen(true)}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Dialogs ── */}
      <MessageDialog
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        recipient={recipient}
        isSubmitting={isSubmitting}
      />
      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        adTitle={ad.title}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
