import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import customFetch from "../utils/customFetch";
import usePublicationModerationCount from "../hooks/usePublicationModerationCount";

const STAFF_ROLES = ["admin", "moderator"];

const GROUP_ORDER = ["Головна", "Управління", "Контент", "Система"];

const links = [
  { text: "Огляд", path: "/dashboard", icon: "dashboard", group: "Головна" },
  {
    text: "Користувачі",
    path: "/dashboard/users",
    icon: "people_alt",
    group: "Управління",
  },
  {
    text: "Оголошення",
    path: "/dashboard/ads",
    icon: "campaign",
    group: "Управління",
  },
  {
    text: "Модерація",
    path: "/dashboard/moderation",
    icon: "verified_user",
    group: "Управління",
  },
  {
    text: "Модерація публікацій",
    path: "/dashboard/publications/moderation",
    icon: "fact_check",
    group: "Контент",
  },
  {
    text: "Категорії",
    path: "/dashboard/categories",
    icon: "category",
    group: "Контент",
  },
  {
    text: "Публікації",
    path: "/dashboard/posts",
    icon: "article",
    group: "Контент",
  },
  {
    text: "Країни",
    path: "/dashboard/countries",
    icon: "public",
    group: "Контент",
  },
  {
    text: "FAQ",
    path: "/dashboard/faq",
    icon: "help",
    group: "Контент",
  },
  { text: "Події", path: "/dashboard/events", icon: "event", group: "Система" },
  {
    text: "Повідомлення",
    path: "/dashboard/message-reports",
    icon: "notifications",
    group: "Система",
  },
  {
    text: "Новини",
    path: "/dashboard/news",
    icon: "newspaper",
    group: "Система",
  },
  { text: "Форум", path: "/dashboard/forum", icon: "forum", group: "Система" },
  {
    text: "Статистика",
    path: "/dashboard/stats",
    icon: "bar_chart",
    group: "Система",
  },
  {
    text: "Налаштування",
    path: "/dashboard/settings",
    icon: "tune",
    group: "Система",
  },
  {
    text: "Термін оголошень",
    path: "/dashboard/settings/ad-expiration",
    icon: "timer",
    group: "Система",
  },
  {
    text: "Admin",
    path: "/dashboard/admin",
    icon: "admin_panel_settings",
    group: "Система",
    role: "admin",
    badge: "Admin",
  },
];

const groupLabelSx = {
  px: 2.5,
  py: 1,
  display: "block",
  color: "#94A3B8",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontSize: "0.65rem",
};

const countChipSx = {
  ml: 1,
  height: 20,
  minWidth: 20,
  bgcolor: "#DC2626",
  color: "#fff",
  fontSize: "0.7rem",
  fontWeight: 700,
};

const roleChipSx = {
  height: 18,
  fontSize: "0.6rem",
  fontWeight: 700,
  bgcolor: "#FEF3C7",
  color: "#92400E",
};

function Sidebar() {
  const location = useLocation();
  const { user } = useAuthContext();
  const [pendingCount, setPendingCount] = useState(0);

  const isStaff = Boolean(user && STAFF_ROLES.includes(user.role));
  const pendingPosts = usePublicationModerationCount(isStaff);

  useEffect(() => {
    if (!isStaff) return;
    let cancelled = false;
    customFetch
      .get("/moderation/pending-count")
      .then(({ data }) => {
        if (!cancelled) setPendingCount(data.count || 0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isStaff]);

  // Пункти, доступні поточному користувачу (з урахуванням role)
  const visibleLinks = links.filter(
    (link) => !link.role || link.role === user?.role,
  );

  const getCount = (path) => {
    if (path === "/dashboard/moderation") return pendingCount;
    if (path === "/dashboard/publications/moderation") return pendingPosts;
    return 0;
  };

  const isPathMatch = (path) =>
    location.pathname === path ||
    (path !== "/dashboard" && location.pathname.startsWith(`${path}/`));

  // Активний пункт — найдовший збіг, щоб "/settings" не підсвічувався
  // разом із "/settings/ad-expiration"
  const activePath = visibleLinks
    .filter((link) => isPathMatch(link.path))
    .sort((a, b) => b.path.length - a.path.length)[0]?.path;

  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Адміністратор";
  const userEmail = user?.email ?? "";
  const userInitials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "А";

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
        {isStaff &&
          GROUP_ORDER.map((groupLabel) => {
            const items = visibleLinks.filter((l) => l.group === groupLabel);
            if (items.length === 0) return null;

            return (
              <Box key={groupLabel} sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={groupLabelSx}>
                  {groupLabel}
                </Typography>

                <List disablePadding>
                  {items.map(({ text, path, icon, badge }) => {
                    const isActive = path === activePath;
                    const count = getCount(path);

                    return (
                      <ListItemButton
                        key={path}
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
                          <span
                            className="material-icons"
                            style={{ fontSize: 19 }}
                          >
                            {icon}
                          </span>
                        </ListItemIcon>

                        <ListItemText
                          primary={text}
                          slotProps={{
                            primary: {
                              sx: {
                                fontSize: "0.875rem",
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? "#2563EB" : "#334155",
                              },
                            },
                          }}
                        />

                        {badge && (
                          <Chip label={badge} size="small" sx={roleChipSx} />
                        )}

                        {count > 0 && (
                          <Chip label={count} size="small" sx={countChipSx} />
                        )}
                      </ListItemButton>
                    );
                  })}
                </List>
              </Box>
            );
          })}
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
          {userInitials}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            fontWeight={600}
            display="block"
            noWrap
            sx={{ color: "#0F172A" }}
          >
            {userName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#94A3B8", fontSize: "0.7rem" }}
          >
            {userEmail}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
