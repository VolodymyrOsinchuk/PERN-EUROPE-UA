import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Link,
  Form,
  useActionData,
  useLoaderData,
  useFetcher,
  useNavigate,
} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useAuthContext } from "../../context/AuthContext";
import customFetch, { apiUrl } from "../../utils/customFetch";
import { toast } from "react-toastify";
import { useRef } from "react";

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

/* ─────────────────── Loader & Action ─────────────────── */
export async function profileLoader() {
  try {
    const { data: ads } = await customFetch.get("/adv/user-ads");
    return { ads };
  } catch {
    return { ads: [] };
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  try {
    switch (actionType) {
      case "updateProfile": {
        const userId = formData.get("userId");
        const profileData = {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phoneNumber: formData.get("phoneNumber"),
          country: formData.get("country"),
          state: formData.get("state"),
          location: formData.get("location"),
          about: formData.get("about"),
        };
        const { data } = await customFetch.put(`/users/${userId}`, profileData);
        return { success: true, data, message: "Профіль успішно оновлено!" };
      }
      case "updatePassword": {
        await customFetch.patch("/users/update-password", {
          oldPassword: formData.get("oldPassword"),
          newPassword: formData.get("newPassword"),
        });
        return { success: true, message: "Пароль успішно оновлено!" };
      }
      case "deleteAccount": {
        await customFetch.delete(`/users/${formData.get("userId")}`);
        return {
          success: true,
          message: "Акаунт видалено!",
          redirect: "/register",
        };
      }
      case "deleteAd": {
        await customFetch.delete(`/adv/${formData.get("adId")}`);
        return { success: true, message: "Оголошення видалено!" };
      }
      default:
        return { success: false, message: "Невідомий тип дії" };
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Помилка",
    };
  }
}

/* ─────────────────── Sub-components ──────────────────── */

/** Profile hero header */
function ProfileHero({ user, onImageChange }) {
  const fileRef = useRef(null);
  const avatarSrc = user?.profilePicture
    ? user.profilePicture.startsWith("http")
      ? user.profilePicture
      : `${apiUrl}${user.profilePicture}`
    : null;
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative pattern */}
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
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,215,0,.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Gold accent bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, transparent 0%, #FFD700 30%, #FFD700 70%, transparent 100%)",
          opacity: 0.7,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: { xs: 3, md: 4 },
            flexWrap: "wrap",
          }}
        >
          {/* Avatar */}
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Avatar
              src={avatarSrc}
              sx={{
                width: { xs: 90, md: 110 },
                height: { xs: 90, md: 110 },
                fontSize: "2.2rem",
                fontFamily: F_BODY,
                fontWeight: 800,
                bgcolor: "#eff6ff",
                color: BLUE,
                border: "4px solid rgba(255,255,255,.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,.3)",
              }}
            >
              {initials}
            </Avatar>
            <Tooltip title="Змінити фото">
              <IconButton
                size="small"
                onClick={() => fileRef.current?.click()}
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  width: 32,
                  height: 32,
                  bgcolor: GOLD,
                  color: "#003d82",
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,.3)",
                  "&:hover": { bgcolor: "#f5c400", transform: "scale(1.1)" },
                  transition: "all 0.2s",
                }}
              >
                <CameraAltOutlinedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onImageChange}
            />
          </Box>

          {/* User info */}
          <Box sx={{ pb: 0.5 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography
                sx={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: { xs: "1.6rem", md: "2rem" },
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                {user?.firstName} {user?.lastName}
              </Typography>
              {user?.isVerified && (
                <VerifiedIcon sx={{ color: GOLD, fontSize: 22 }} />
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,.7)",
                }}
              >
                {user?.email}
              </Typography>
              {(user?.state || user?.country) && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: 14, color: "rgba(255,255,255,.5)" }}
                  />
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,.6)",
                    }}
                  >
                    {[user?.state, user?.country].filter(Boolean).join(", ")}
                  </Typography>
                </Box>
              )}
            </Box>
            {/* Role badge */}
            <Box sx={{ mt: 1.5 }}>
              <Chip
                label={user?.role === "admin" ? "Адміністратор" : "Користувач"}
                size="small"
                sx={{
                  bgcolor:
                    user?.role === "admin"
                      ? "rgba(255,215,0,.2)"
                      : "rgba(255,255,255,.12)",
                  color: user?.role === "admin" ? GOLD : "rgba(255,255,255,.8)",
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  border: `1px solid ${user?.role === "admin" ? "rgba(255,215,0,.35)" : "rgba(255,255,255,.2)"}`,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

/** Stat pill */
function StatPill({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2,
        borderRadius: "14px",
        bgcolor: "#fff",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          bgcolor: "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span className="material-icons" style={{ fontSize: 18, color: BLUE }}>
          {icon}
        </span>
      </Box>
      <Box>
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "#0f172a",
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: "0.72rem",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

/** Ad card in profile */
function ProfileAdCard({ ad, onDelete }) {
  const catName = ad.category?.name || "Інше";
  const serverPath = ad.photos?.[0];
  const clientPath = serverPath?.replace("public", "") || "";

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
      <Box sx={{ display: "flex", gap: 0 }}>
        {/* Thumbnail */}
        {clientPath && (
          <Box
            sx={{
              width: 100,
              flexShrink: 0,
              bgcolor: "#f1f5f9",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={`${apiUrl}${clientPath}`}
              alt={ad.title}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        )}

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
              <Chip
                label={catName}
                size="small"
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  mb: 1,
                  bgcolor: "#eff6ff",
                  color: BLUE,
                }}
              />
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
                {ad.title}
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
                {ad.description}
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
              <Tooltip title="Відкрити">
                <IconButton
                  size="small"
                  component={Link}
                  to={`/ads/${ad.id}`}
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
                  to={`/profile/edit-ad/${ad.id}`}
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
                  onClick={() => onDelete(ad)}
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 12, color: "#94a3b8" }}
              />
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.72rem",
                  color: "#94a3b8",
                }}
              >
                {new Date(ad.datePosted || ad.createdAt).toLocaleDateString(
                  "uk-UA",
                )}
              </Typography>
            </Box>
            {ad.views !== undefined && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityOutlinedIcon
                  sx={{ fontSize: 12, color: "#94a3b8" }}
                />
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.72rem",
                    color: "#94a3b8",
                  }}
                >
                  {ad.views} переглядів
                </Typography>
              </Box>
            )}
            {ad.price && (
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  color: BLUE,
                  ml: "auto",
                }}
              >
                €{Number(ad.price).toLocaleString("uk-UA")}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}

/* ─────────────────── Main Component ──────────────────── */
export default function Profile() {
  const { user, logoutUser, fetchUser } = useAuthContext();
  const actionData = useActionData();
  const { ads } = useLoaderData() || { ads: [] };
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [deleteAccOpen, setDeleteAccOpen] = useState(false);
  const [deleteAdOpen, setDeleteAdOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
    state: "",
    location: "",
    about: "",
  });

  /* Sync form with user */
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        country: user.country || "",
        state: user.state || "",
        location: user.location || "",
        about: user.about || "",
      });
    }
  }, [user]);

  /* Handle action responses */
  useEffect(() => {
    if (!actionData) return;
    if (actionData.success) {
      toast.success(actionData.message);
      if (actionData.data) fetchUser();
      if (actionData.redirect) {
        logoutUser();
        navigate(actionData.redirect);
      }
      setEditOpen(false);
      setPwdOpen(false);
      setDeleteAccOpen(false);
      setDeleteAdOpen(false);
    } else {
      toast.error(actionData.message);
    }
  }, [actionData]);

  /* Upload avatar */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("profilePicture", file);
    try {
      await customFetch.post("/users/upload-profile-picture", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchUser();
      toast.success("Фото оновлено!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка завантаження фото");
    }
  };

  const handleDeleteAd = (ad) => {
    setSelectedAd(ad);
    setDeleteAdOpen(true);
  };
  const confirmDeleteAd = () => {
    if (!selectedAd) return;
    fetcher.submit(
      { actionType: "deleteAd", adId: selectedAd.id },
      { method: "post" },
    );
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: F_BODY,
      bgcolor: "#f8fafc",
      "&:hover fieldset": { borderColor: BLUE },
      "&.Mui-focused fieldset": { borderColor: BLUE },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
    "& .MuiInputLabel-root": { fontFamily: F_BODY },
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("uk-UA", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <Box>
      {/* ── Hero Header ── */}
      <ProfileHero user={user} onImageChange={handleImageChange} />

      {/* ── Stats row ── */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9" }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 3, mt: -4, position: "relative", zIndex: 10 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatPill
                  icon="campaign"
                  label="Оголошень"
                  value={ads.length}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatPill
                  icon="visibility"
                  label="Переглядів"
                  value={ads.reduce((s, a) => s + (a.views || 0), 0)}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatPill
                  icon="calendar_today"
                  label="Член з"
                  value={memberSince}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatPill
                  icon="verified_user"
                  label="Статус"
                  value={user?.isVerified ? "Верифікований" : "Не верифіковано"}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ── Tabs ── */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid #f1f5f9",
          position: "sticky",
          top: 68,
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg">
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              "& .MuiTab-root": {
                fontFamily: F_BODY,
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                color: "#64748b",
                minHeight: 52,
                "&.Mui-selected": { color: BLUE },
              },
              "& .MuiTabs-indicator": {
                background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
                height: 3,
                borderRadius: "99px",
              },
            }}
          >
            <Tab label="Особиста інформація" />
            <Tab
              label={`Мої оголошення ${ads.length > 0 ? `(${ads.length})` : ""}`}
            />
            <Tab label="Налаштування" />
          </Tabs>
        </Container>
      </Box>

      {/* ── Tab content ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* ── TAB 0: Personal Info ── */}
        {tab === 0 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1.5px solid #e2e8f0",
                  p: { xs: 3, md: 4 },
                  boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: F_DISPLAY,
                        fontWeight: 700,
                        fontSize: "1.3rem",
                        color: "#0f172a",
                      }}
                    >
                      Особиста інформація
                    </Typography>
                    <Box
                      sx={{
                        width: 36,
                        height: 3,
                        background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
                        borderRadius: "99px",
                        mt: 0.75,
                      }}
                    />
                  </Box>

                  {/* Actions: Create Event / Create Publication / Create Ad / Edit */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                      component={Link}
                      to="/profile/events/create"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        border: `1.5px solid rgba(15,23,42,0.06)`,
                        borderRadius: "10px",
                        px: 2,
                        bgcolor: "#fff",
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }}
                    >
                      Створити подію
                    </Button>

                    <Button
                      startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                      component={Link}
                      to="/profile/publications/create"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        border: `1.5px solid rgba(15,23,42,0.06)`,
                        borderRadius: "10px",
                        px: 2,
                        bgcolor: "#fff",
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }}
                    >
                      Створити публікацію
                    </Button>

                    <Button
                      startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                      component={Link}
                      to="/profile/create-ad"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        border: `1.5px solid rgba(15,23,42,0.06)`,
                        borderRadius: "10px",
                        px: 2,
                        bgcolor: "#fff",
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }}
                    >
                      Створити оголошення
                    </Button>

                    <Button
                      startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
                      onClick={() => setEditOpen(true)}
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "0.85rem",
                        color: BLUE,
                        border: `1.5px solid ${BLUE}`,
                        borderRadius: "10px",
                        px: 2,
                        bgcolor: "#eff6ff",
                        "&:hover": { bgcolor: "#dbeafe" },
                      }}
                    >
                      Редагувати
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={2.5}>
                  {[
                    { label: "Ім'я", value: user?.firstName, icon: "person" },
                    {
                      label: "Прізвище",
                      value: user?.lastName,
                      icon: "person",
                    },
                    { label: "Email", value: user?.email, icon: "email" },
                    {
                      label: "Телефон",
                      value: user?.phoneNumber,
                      icon: "phone",
                    },
                    { label: "Країна", value: user?.country, icon: "flag" },
                    { label: "Регіон", value: user?.state, icon: "map" },
                    {
                      label: "Місто",
                      value: user?.location,
                      icon: "location_city",
                    },
                  ].map((row) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={row.label}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: 14, color: "#94a3b8" }}
                          >
                            {row.icon}
                          </span>
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
                            {row.label}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: F_BODY,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: row.value ? "#0f172a" : "#cbd5e1",
                          }}
                        >
                          {row.value || "Не вказано"}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                  {user?.about && (
                    <Grid size={12}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: F_BODY,
                            fontSize: "0.7rem",
                            color: "#94a3b8",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            mb: 0.5,
                          }}
                        >
                          Про мене
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: F_BODY,
                            fontSize: "0.9rem",
                            color: "#334155",
                            lineHeight: 1.7,
                          }}
                        >
                          {user.about}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Right col: account details */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1.5px solid #e2e8f0",
                  p: 3,
                  mb: 3,
                  boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#0f172a",
                    mb: 2.5,
                  }}
                >
                  Деталі акаунту
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.82rem",
                        color: "#64748b",
                      }}
                    >
                      Роль
                    </Typography>
                    <Chip
                      label={user?.role || "user"}
                      size="small"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        bgcolor: user?.role === "admin" ? "#fef3c7" : "#eff6ff",
                        color: user?.role === "admin" ? "#92400e" : BLUE,
                      }}
                    />
                  </Box>
                  <Divider sx={{ borderColor: "#f1f5f9" }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.82rem",
                        color: "#64748b",
                      }}
                    >
                      Верифікація
                    </Typography>
                    <Chip
                      label={
                        user?.isVerified ? "✓ Підтверджено" : "Не підтверджено"
                      }
                      size="small"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        bgcolor: user?.isVerified ? "#ecfdf5" : "#fef2f2",
                        color: user?.isVerified ? "#065f46" : "#991b1b",
                      }}
                    />
                  </Box>
                  <Divider sx={{ borderColor: "#f1f5f9" }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.82rem",
                        color: "#64748b",
                      }}
                    >
                      Член з
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        color: "#0f172a",
                      }}
                    >
                      {memberSince}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Button
                fullWidth
                onClick={logoutUser}
                startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "12px",
                  py: 1.3,
                  fontSize: "0.875rem",
                  color: "#64748b",
                  border: "1.5px solid #e2e8f0",
                  bgcolor: "#fff",
                  "&:hover": {
                    borderColor: "#ef4444",
                    color: "#ef4444",
                    bgcolor: "#fef2f2",
                  },
                }}
              >
                Вийти з акаунту
              </Button>
            </Grid>
          </Grid>
        )}

        {/* ── TAB 1: My Ads ── */}
        {tab === 1 && (
          <Box>
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
                  Мої оголошення
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.85rem",
                    color: "#64748b",
                    mt: 0.5,
                  }}
                >
                  {ads.length === 0
                    ? "У вас поки немає оголошень"
                    : `${ads.length} оголошень`}
                </Typography>
              </Box>
              <Button
                variant="contained"
                component={Link}
                to="/profile/create-ad"
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
                Нове оголошення
              </Button>
            </Box>

            {ads.length === 0 ? (
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
                  <span
                    className="material-icons"
                    style={{ fontSize: 36, color: "#cbd5e1" }}
                  >
                    campaign
                  </span>
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
                  Немає оголошень
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.875rem",
                    color: "#cbd5e1",
                    mb: 3,
                  }}
                >
                  Розмістіть своє перше оголошення — це займе лише кілька хвилин
                </Typography>
                <Button
                  component={Link}
                  to="/profile/create-ad"
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
                  Створити оголошення
                </Button>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {ads.map((ad, i) => (
                  <Box
                    key={ad.id ?? i}
                    sx={{
                      animation: "fadeUp 0.4s ease both",
                      animationDelay: `${i * 0.05}s`,
                      "@keyframes fadeUp": {
                        from: { opacity: 0, transform: "translateY(14px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    <ProfileAdCard ad={ad} onDelete={handleDeleteAd} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* ── TAB 2: Settings ── */}
        {tab === 2 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Change password */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1.5px solid #e2e8f0",
                  p: { xs: 3, md: 4 },
                  mb: 3,
                  boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      bgcolor: "#eff6ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LockOutlinedIcon sx={{ fontSize: 18, color: BLUE }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#0f172a",
                      }}
                    >
                      Зміна пароля
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.78rem",
                        color: "#64748b",
                      }}
                    >
                      Використовуйте надійний пароль (мін. 8 символів)
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  onClick={() => setPwdOpen(true)}
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "12px",
                    py: 1.3,
                    border: `1.5px solid ${BLUE}`,
                    color: BLUE,
                    bgcolor: "#eff6ff",
                    "&:hover": { bgcolor: "#dbeafe" },
                  }}
                >
                  Змінити пароль
                </Button>
              </Paper>

              {/* Danger zone */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1.5px solid #fecaca",
                  p: { xs: 3, md: 4 },
                  bgcolor: "#fffafa",
                  boxShadow: "0 4px 24px rgba(239,68,68,.06)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      bgcolor: "#fef2f2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: 18, color: "#ef4444" }}
                    >
                      warning
                    </span>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#991b1b",
                      }}
                    >
                      Небезпечна зона
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.78rem",
                        color: "#b91c1c",
                      }}
                    >
                      Дії, які не можна скасувати
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  onClick={() => setDeleteAccOpen(true)}
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "12px",
                    py: 1.3,
                    border: "1.5px solid #fca5a5",
                    color: "#ef4444",
                    bgcolor: "#fef2f2",
                    "&:hover": { bgcolor: "#fee2e2", borderColor: "#ef4444" },
                  }}
                >
                  Видалити акаунт
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* ══ Dialogs ════════════════════════════════════════════ */}

      {/* Edit profile */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <Form method="post">
          <input type="hidden" name="actionType" value="updateProfile" />
          <input type="hidden" name="userId" value={user?.id} />
          <DialogTitle
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: "1.3rem",
              pb: 1,
            }}
          >
            Редагувати профіль
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              {[
                { name: "firstName", label: "Ім'я", type: "text" },
                { name: "lastName", label: "Прізвище", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "phoneNumber", label: "Телефон", type: "tel" },
                { name: "country", label: "Країна", type: "text" },
                { name: "state", label: "Регіон", type: "text" },
                { name: "location", label: "Місто", type: "text" },
              ].map((f) => (
                <Grid size={{ xs: 12, sm: 6 }} key={f.name}>
                  <TextField
                    margin="dense"
                    name={f.name}
                    label={f.label}
                    type={f.type}
                    fullWidth
                    size="small"
                    value={formData[f.name]}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, [f.name]: e.target.value }))
                    }
                    sx={inputSx}
                  />
                </Grid>
              ))}
              <Grid size={12}>
                <TextField
                  margin="dense"
                  name="about"
                  label="Про мене"
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  value={formData.about}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, about: e.target.value }))
                  }
                  sx={inputSx}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setEditOpen(false)}
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
              Зберегти
            </Button>
          </DialogActions>
        </Form>
      </Dialog>

      {/* Change password */}
      <Dialog
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <Form method="post">
          <input type="hidden" name="actionType" value="updatePassword" />
          <DialogTitle
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: "1.3rem",
              pb: 1,
            }}
          >
            Змінити пароль
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
            >
              <TextField
                name="oldPassword"
                label="Поточний пароль"
                type="password"
                fullWidth
                size="small"
                required
                sx={inputSx}
              />
              <TextField
                name="newPassword"
                label="Новий пароль"
                type="password"
                fullWidth
                size="small"
                required
                helperText="Мінімум 8 символів"
                sx={inputSx}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setPwdOpen(false)}
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
              Змінити
            </Button>
          </DialogActions>
        </Form>
      </Dialog>

      {/* Delete account */}
      <Dialog
        open={deleteAccOpen}
        onClose={() => setDeleteAccOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <Form method="post">
          <input type="hidden" name="actionType" value="deleteAccount" />
          <input type="hidden" name="userId" value={user?.id} />
          <DialogTitle
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: "1.3rem",
              color: "#991b1b",
              pb: 1,
            }}
          >
            Видалити акаунт
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "#fef2f2",
                border: "1px solid #fecaca",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.875rem",
                  color: "#991b1b",
                  fontWeight: 600,
                }}
              >
                ⚠️ Ця дія незворотна. Всі ваші дані та оголошення будуть
                видалені.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setDeleteAccOpen(false)}
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
        </Form>
      </Dialog>

      {/* Delete ad */}
      <Dialog
        open={deleteAdOpen}
        onClose={() => setDeleteAdOpen(false)}
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
          Видалити оголошення?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontFamily: F_BODY, fontSize: "0.875rem", color: "#64748b" }}
          >
            Оголошення{" "}
            <strong style={{ color: "#0f172a" }}>"{selectedAd?.title}"</strong>{" "}
            буде видалено назавжди.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteAdOpen(false)}
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
            onClick={() => {
              confirmDeleteAd();
              setDeleteAdOpen(false);
            }}
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
