import { Fragment } from "react";
import {
  Typography,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const categoryColors = {
  default: { bg: "#EEF2FF", text: "#4338CA" },
  work: { bg: "#ECFDF5", text: "#065F46" },
  housing: { bg: "#FFF7ED", text: "#9A3412" },
  services: { bg: "#EFF6FF", text: "#1E40AF" },
  education: { bg: "#FDF4FF", text: "#7E22CE" },
  other: { bg: "#F8FAFC", text: "#475569" },
};

const ListCard = ({ ad, isLast }) => {
  const serverPath = ad.photos[0];
  const clientPath = serverPath.replace("public", "");
  const catKey = ad.category?.slug || "default";
  const catColor = categoryColors[catKey] || categoryColors.default;
  const locationLabel =
    typeof ad.location === "object"
      ? `${ad.location.city}, ${ad.location.state}`
      : ad.location;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          py: 2.5,
          px: { xs: 0, sm: 1 },
          alignItems: "flex-start",
          transition: "background 0.15s",
          borderRadius: "12px",
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.02)",
          },
        }}
      >
        {/* Image */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: 90, sm: 130, md: 160 },
            height: { xs: 90, sm: 100, md: 110 },
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={`${apiUrl}${clientPath}`}
            alt={ad.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.35s ease",
              "&:hover": { transform: "scale(1.06)" },
            }}
          />
          {/* Category badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: 6,
              left: 6,
              px: 1,
              py: 0.3,
              borderRadius: "99px",
              bgcolor: catColor.bg,
              color: catColor.text,
              fontSize: "10px",
              fontWeight: 600,
            }}
          >
            {ad.category?.name || "Інше"}
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography
              component={Link}
              to={`/ads/${ad.id}`}
              variant="subtitle1"
              fontWeight={700}
              sx={{
                textDecoration: "none",
                color: "text.primary",
                lineHeight: 1.35,
                "&:hover": { color: "primary.main" },
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {ad.title}
            </Typography>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
              <Tooltip title="Зберегти">
                <IconButton size="small">
                  <BookmarkBorderIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Відкрити">
                <IconButton size="small" component={Link} to={`/ads/${ad.id}`}>
                  <OpenInNewIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {ad.description}
          </Typography>

          {/* Meta */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            <Chip
              icon={
                <LocationOnOutlinedIcon sx={{ fontSize: "13px !important" }} />
              }
              label={locationLabel}
              size="small"
              sx={{ fontSize: "11px", bgcolor: "#F1F5F9", border: "none" }}
            />
            <Chip
              icon={
                <CalendarTodayOutlinedIcon
                  sx={{ fontSize: "13px !important" }}
                />
              }
              label={new Date(ad.date).toLocaleDateString("uk-UA")}
              size="small"
              sx={{ fontSize: "11px", bgcolor: "#F1F5F9", border: "none" }}
            />
          </Box>
        </Box>
      </Box>
      {!isLast && <Divider sx={{ opacity: 0.5 }} />}
    </>
  );
};

const ListView = ({ ads }) => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: "16px",
      overflow: "hidden",
      px: { xs: 1.5, sm: 2.5 },
    }}
  >
    {ads.map((ad, index) => (
      <ListCard key={index} ad={ad} isLast={index === ads.length - 1} />
    ))}
  </Paper>
);

export default ListView;
