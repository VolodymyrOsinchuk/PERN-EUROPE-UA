import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";

const POLL_MS = 60000; // rafraîchissement toutes les 60 s

export default function NotificationBell() {
  const [anchor, setAnchor] = useState(null);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  const loadCount = async () => {
    try {
      const { data } = await customFetch.get("/notifications/unread-count");
      setUnread(data.unread);
    } catch {
      /* non connecté ou erreur réseau : on ignore */
    }
  };

  const loadList = async () => {
    try {
      const { data } = await customFetch.get("/notifications");
      setItems(data);
    } catch {
      /* ignoré */
    }
  };

  useEffect(() => {
    loadCount();
    const timer = setInterval(loadCount, POLL_MS);
    return () => clearInterval(timer);
  }, []);

  const open = (e) => {
    setAnchor(e.currentTarget);
    loadList();
  };

  const close = () => setAnchor(null);

  const onItemClick = async (n) => {
    if (!n.isRead) {
      await customFetch.patch(`/notifications/${n.id}/read`);
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
      setUnread((c) => Math.max(0, c - 1));
    }
    close();
    if (n.advId) navigate("/profile/my-ads");
  };

  const markAll = async () => {
    await customFetch.patch("/notifications/read-all");
    setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
    setUnread(0);
  };

  return (
    <>
      <IconButton onClick={open} aria-label="Сповіщення">
        <Badge badgeContent={unread} color="error" max={99}>
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 480 } } }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            pt: 2,
          }}
        >
          <Typography fontWeight={700}>Сповіщення</Typography>
          {unread > 0 && (
            <Button size="small" onClick={markAll}>
              Позначити всі як прочитані
            </Button>
          )}
        </Box>

        {items.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
            Сповіщень немає
          </Typography>
        ) : (
          <List dense>
            {items.map((n) => (
              <ListItemButton
                key={n.id}
                onClick={() => onItemClick(n)}
                sx={{
                  bgcolor: n.isRead ? "transparent" : "#EFF6FF",
                  alignItems: "flex-start",
                }}
              >
                <ListItemText
                  primary={n.message}
                  secondary={new Date(n.createdAt).toLocaleString("uk-UA")}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: n.isRead ? 400 : 700,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}
