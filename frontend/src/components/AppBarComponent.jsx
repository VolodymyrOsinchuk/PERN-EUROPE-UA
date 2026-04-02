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

const AppBarComponent = ({ handleDrawerToggle }) => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, sm: 3 } }}>
        {/* Mobile menu toggle */}
        <IconButton
          aria-label="open drawer"
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
              <Badge badgeContent={3} color="error">
                <NotificationsOutlinedIcon fontSize="small" />
              </Badge>
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

          <Tooltip title="Профіль">
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#EFF6FF",
                color: "#2563EB",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "2px solid #DBEAFE",
              }}
            >
              А
            </Avatar>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
