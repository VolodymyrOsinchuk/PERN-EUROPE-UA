import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Avatar,
  Fade,
  Badge,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import customFetch from "../utils/customFetch";

const NAV_LINKS = [
  { label: "Новини", href: "/news" },
  { label: "Афіша", href: "/events" },
  { label: "Оголошення", href: "/ads" },
  { label: "Публікації", href: "/publications" },
  { label: "Форум", href: "/forum" },
  { label: "Про нас", href: "/about" },
  { label: "Контакт", href: "/contact" },
];

// const LANGUAGES = [
//   { code: "uk", flag: "🇺🇦", label: "Українська" },
//   { code: "en", flag: "🇬🇧", label: "English" },
//   { code: "pl", flag: "🇵🇱", label: "Polski" },
//   { code: "fr", flag: "🇫🇷", label: "Français" },
//   { code: "de", flag: "🇩🇪", label: "Deutsch" },
// ];

export default function Navbar() {
  const { user, logoutUser } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [lang, setLang] = useState("uk");
  const [unread, setUnread] = useState(0);

  /* Nombre de messages non lus */
  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }
    let cancelled = false;
    customFetch
      .get("/messages/unread-count")
      .then(({ data }) => {
        if (!cancelled) setUnread(data.unread || 0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  const initials = user
    ? (user.firstName?.[0] ?? user.email?.[0] ?? "U").toUpperCase()
    : null;

  /* ── Inline sx overrides ── */
  const appBarSx = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.97)",
    backdropFilter: "blur(16px)",
    borderBottom: scrolled
      ? "1px solid rgba(0,87,184,0.12)"
      : "1px solid rgba(0,87,184,0.06)",
    boxShadow: scrolled ? "0 2px 20px rgba(0,87,184,0.08)" : "none",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    color: "#0f172a",
  };

  const navLinkSx = (active) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: active ? 700 : 500,
    fontSize: "0.875rem",
    color: active ? "#0057B8" : "#334155",
    letterSpacing: "0.01em",
    px: 1.5,
    py: 0.75,
    borderRadius: "8px",
    textTransform: "none",
    minWidth: "auto",
    position: "relative",
    transition: "all 0.2s",
    "&::after": active
      ? {
          content: '""',
          position: "absolute",
          bottom: -2,
          left: "50%",
          transform: "translateX(-50%)",
          width: 20,
          height: 3,
          borderRadius: "99px",
          background: "linear-gradient(90deg, #0057B8, #FFD700)",
        }
      : {},
    "&:hover": {
      background: "rgba(0,87,184,0.06)",
      color: "#0057B8",
    },
  });

  return (
    <>
      <AppBar sx={appBarSx} elevation={0}>
        <Toolbar
          sx={{ minHeight: "68px !important", px: { xs: 2, md: 4 }, gap: 1 }}
        >
          {/* ── Logo ── */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            {/* Ukrainian flag accent */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,87,184,.25)",
                flexShrink: 0,
              }}
            >
              <Box sx={{ flex: 1, bgcolor: "#0057B8" }} />
              <Box sx={{ flex: 1, bgcolor: "#FFD700" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0057B8",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Українці
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.65rem",
                  color: "#64748b",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                в Європі
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            /* ── Mobile hamburger ── */
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: "#334155" }}
            >
              <span className="material-icons">menu</span>
            </IconButton>
          ) : (
            <>
              {/* ── Desktop nav links ── */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2 }}
              >
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.href}
                    component={Link}
                    to={link.href}
                    sx={navLinkSx(isActive(link.href))}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>

              {/* ── Messages (badge non lus) ── */}
              {user && (
                <IconButton
                  component={Link}
                  to="/messages"
                  size="small"
                  sx={{
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    p: "6px",
                    mr: 1,
                    "&:hover": {
                      borderColor: "#0057B8",
                      color: "#0057B8",
                      bgcolor: "rgba(0,87,184,.04)",
                    },
                  }}
                >
                  <Badge badgeContent={unread} color="error" max={9}>
                    <span className="material-icons" style={{ fontSize: 18 }}>
                      chat_bubble
                    </span>
                  </Badge>
                </IconButton>
              )}

              {/* ── Language selector ── */}
              {/* <IconButton
                size="small"
                onClick={(e) => setLangAnchor(e.currentTarget)}
                sx={{
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  p: "6px",
                  mr: 1,
                  "&:hover": {
                    borderColor: "#0057B8",
                    color: "#0057B8",
                    bgcolor: "rgba(0,87,184,.04)",
                  },
                }}
              >
                <span className="material-icons" style={{ fontSize: 18 }}>
                  language
                </span>
              </IconButton>
              <Menu
                anchorEl={langAnchor}
                open={Boolean(langAnchor)}
                onClose={() => setLangAnchor(null)}
                TransitionComponent={Fade}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 8px 32px rgba(0,0,0,.1)",
                    minWidth: 160,
                  },
                }}
              >
                {LANGUAGES.map((l) => (
                  <MenuItem
                    key={l.code}
                    selected={lang === l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangAnchor(null);
                    }}
                    sx={{
                      gap: 1.5,
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span>{l.flag}</span> {l.label}
                  </MenuItem>
                ))}
              </Menu> */}

              {/* ── Auth ── */}
              {user ? (
                <>
                  <Box
                    onClick={(e) => setUserAnchor(e.currentTarget)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      px: 1.5,
                      py: 0.75,
                      borderRadius: "10px",
                      border: "1.5px solid #e2e8f0",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#0057B8",
                        bgcolor: "rgba(0,87,184,.04)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "#0057B8",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      {user.firstName || "Профіль"}
                    </Typography>
                    <span
                      className="material-icons"
                      style={{ fontSize: 16, color: "#94a3b8" }}
                    >
                      expand_more
                    </span>
                  </Box>
                  <Menu
                    anchorEl={userAnchor}
                    open={Boolean(userAnchor)}
                    onClose={() => setUserAnchor(null)}
                    TransitionComponent={Fade}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 8px 32px rgba(0,0,0,.1)",
                        minWidth: 180,
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={() => setUserAnchor(null)}
                      sx={{
                        gap: 1.5,
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: 18, color: "#64748b" }}
                      >
                        person
                      </span>
                      Профіль
                    </MenuItem>
                    {user.role === "admin" && (
                      <MenuItem
                        component={Link}
                        to="/dashboard"
                        onClick={() => setUserAnchor(null)}
                        sx={{
                          gap: 1.5,
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontSize: "0.875rem",
                        }}
                      >
                        <span
                          className="material-icons"
                          style={{ fontSize: 18, color: "#64748b" }}
                        >
                          dashboard
                        </span>
                        Панель
                      </MenuItem>
                    )}
                    <MenuItem
                      component={Link}
                      to="/messages"
                      onClick={() => setUserAnchor(null)}
                      sx={{
                        gap: 1.5,
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: 18, color: "#64748b" }}
                      >
                        chat_bubble
                      </span>
                      Повідомлення
                      {unread > 0 && (
                        <Typography
                          component="span"
                          sx={{
                            ml: "auto",
                            bgcolor: "#dc2626",
                            color: "#fff",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            px: 1,
                            borderRadius: "99px",
                          }}
                        >
                          {unread}
                        </Typography>
                      )}
                    </MenuItem>
                    <Box sx={{ my: 0.5, borderTop: "1px solid #f1f5f9" }} />
                    <MenuItem
                      onClick={() => {
                        logoutUser();
                        setUserAnchor(null);
                      }}
                      sx={{
                        gap: 1.5,
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: "0.875rem",
                        color: "#dc2626",
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: 18 }}>
                        logout
                      </span>
                      Вийти
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      textTransform: "none",
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontWeight: 600,
                      color: "#334155",
                      fontSize: "0.875rem",
                      "&:hover": { bgcolor: "#f1f5f9", color: "#0057B8" },
                    }}
                  >
                    Увійти
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    sx={{
                      textTransform: "none",
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      bgcolor: "#0057B8",
                      color: "#fff",
                      borderRadius: "10px",
                      px: 2.5,
                      boxShadow: "0 4px 12px rgba(0,87,184,.3)",
                      "&:hover": {
                        bgcolor: "#003d82",
                        boxShadow: "0 6px 18px rgba(0,87,184,.4)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Реєстрація
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Spacer */}
      <Toolbar sx={{ minHeight: "68px !important" }} />

      {/* ── Mobile Drawer ── */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            p: 3,
            background: "#fff",
          },
        }}
      >
        {/* Logo in drawer */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
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
              fontFamily: "'Playfair Display',serif",
              fontWeight: 700,
              color: "#0057B8",
              fontSize: "1rem",
            }}
          >
            Українці в Європі
          </Typography>
        </Box>

        <List disablePadding>
          {[{ label: "Головна", href: "/" }, ...NAV_LINKS].map((link) => (
            <ListItem
              key={link.href}
              component={Link}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "10px",
                mb: 0.5,
                bgcolor: isActive(link.href)
                  ? "rgba(0,87,184,.06)"
                  : "transparent",
                "&:hover": { bgcolor: "rgba(0,87,184,.06)" },
                px: 1.5,
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: isActive(link.href) ? 700 : 500,
                  color: isActive(link.href) ? "#0057B8" : "#334155",
                  fontSize: "0.9rem",
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: "auto", pt: 3, borderTop: "1px solid #f1f5f9" }}>
          {user ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#0057B8",
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#0f172a",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                to="/profile"
                onClick={() => setMobileOpen(false)}
                variant="outlined"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  borderRadius: "10px",
                }}
              >
                Профіль
              </Button>
              <Button
                component={Link}
                to="/messages"
                onClick={() => setMobileOpen(false)}
                variant="outlined"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  borderRadius: "10px",
                }}
              >
                Повідомлення{unread > 0 ? ` (${unread})` : ""}
              </Button>
              <Button
                onClick={() => {
                  logoutUser();
                  setMobileOpen(false);
                }}
                color="error"
                variant="text"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  borderRadius: "10px",
                }}
              >
                Вийти
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                component={Link}
                to="/login"
                onClick={() => setMobileOpen(false)}
                variant="outlined"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  borderRadius: "10px",
                }}
              >
                Увійти
              </Button>
              <Button
                component={Link}
                to="/register"
                onClick={() => setMobileOpen(false)}
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  borderRadius: "10px",
                  bgcolor: "#0057B8",
                }}
              >
                Реєстрація
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
