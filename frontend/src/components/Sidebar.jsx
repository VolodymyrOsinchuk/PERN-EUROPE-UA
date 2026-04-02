import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const links = [
  { text: "Огляд", path: "/dashboard", icon: "dashboard" },
  { text: "Користувачі", path: "/dashboard/users", icon: "people_alt" },
  { text: "Категорії", path: "/dashboard/categories", icon: "category" },
  { text: "Публікації", path: "/dashboard/posts", icon: "article" },
  { text: "Події", path: "/dashboard/events", icon: "event" },
  { text: "Налаштування", path: "/dashboard/settings", icon: "tune" },
  {
    text: "Admin",
    path: "/dashboard/admin",
    icon: "admin_panel_settings",
    role: "admin",
    badge: "Admin",
  },
];

const groups = [
  { label: "Головна", items: links.slice(0, 1) },
  { label: "Управління", items: links.slice(1, 4) },
  { label: "Контент", items: links.slice(4, 6) },
  { label: "Система", items: links.slice(6) },
];

function Sidebar() {
  const location = useLocation();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#FFFFFF",
        borderRight: "1px solid rgba(15,23,42,0.07)",
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important" }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 1 }}>
        {groups.map((group) => (
          <Box key={group.label} sx={{ mb: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                px: 2.5,
                py: 1,
                display: "block",
                color: "#94A3B8",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "0.65rem",
              }}
            >
              {group.label}
            </Typography>
            <List disablePadding>
              {group.items.map(({ text, path, icon, badge }) => {
                const isActive =
                  path === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(path);
                return (
                  <ListItemButton
                    key={text}
                    component={Link}
                    to={path}
                    selected={isActive}
                    sx={{ mx: 1, py: 0.9 }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isActive ? "#2563EB" : "#94A3B8",
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: 19 }}>
                        {icon}
                      </span>
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#2563EB" : "#334155",
                      }}
                    />
                    {badge && (
                      <Chip
                        label={badge}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          bgcolor: "#FEF3C7",
                          color: "#92400E",
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(15,23,42,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            bgcolor: "#EFF6FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#2563EB",
            border: "2px solid #DBEAFE",
            flexShrink: 0,
          }}
        >
          А
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            fontWeight={600}
            display="block"
            noWrap
            sx={{ color: "#0F172A" }}
          >
            Адміністратор
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#94A3B8", fontSize: "0.7rem" }}
          >
            admin@site.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
