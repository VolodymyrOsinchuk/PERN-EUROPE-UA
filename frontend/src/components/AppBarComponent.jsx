import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const AppBarComponent = ({ handleDrawerToggle }) => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, sm: 3 } }}>
        {/* Mobile menu toggle */}
        <IconButton
          aria-label="відкрити меню"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" }, color: "text.secondary" }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-icons"
              style={{ color: "#fff", fontSize: 18 }}
            >
              admin_panel_settings
            </span>
          </Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: "text.primary", letterSpacing: "-0.02em" }}
          >
            AdminPanel
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Сповіщення">
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              {/* <Badge badgeContent={3} color="error"> */}
              <NotificationBell fontSize="small" />
              {/* </Badge> */}
            </IconButton>
          </Tooltip>

          <Button
            component={Link}
            to="/"
            size="small"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              fontSize: "0.813rem",
              "&:hover": { backgroundColor: "#F1F5F9" },
            }}
          >
            На сайт
          </Button>

          <Tooltip title="Mon profil" arrow placement="bottom" enterDelay={300}>
            <Avatar
              component={Link}
              to="/profile"
              aria-label="Accéder à mon profil"
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#EFF6FF",
                color: "#2563EB",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "2px solid #DBEAFE",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 1px 3px rgba(37, 99, 235, 0.08)",

                "&:hover": {
                  bgcolor: "#DBEAFE",
                  borderColor: "#93C5FD",
                  boxShadow: "0 3px 8px rgba(37, 99, 235, 0.18)",
                  transform: "translateY(-2px)",
                },

                "&:active": {
                  transform: "scale(0.95)",
                },

                "&:focus-visible": {
                  outline: "2px solid #2563EB",
                  outlineOffset: "3px",
                },
              }}
            >
              A
            </Avatar>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
