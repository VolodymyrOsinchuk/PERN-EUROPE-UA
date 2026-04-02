import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const categoryColors = {
  default: { bg: "#EEF2FF", text: "#4338CA" },
  work: { bg: "#ECFDF5", text: "#065F46" },
  housing: { bg: "#FFF7ED", text: "#9A3412" },
  services: { bg: "#EFF6FF", text: "#1E40AF" },
  education: { bg: "#FDF4FF", text: "#7E22CE" },
  other: { bg: "#F8FAFC", text: "#475569" },
};

const AdCard = ({ ad }) => {
  const serverPath = ad.photos[0];
  const clientPath = serverPath.replace("public", "");
  const catKey = ad.category?.slug || "default";
  const catColor = categoryColors[catKey] || categoryColors.default;
  const locationLabel =
    typeof ad.location === "object"
      ? `${ad.location.city}, ${ad.location.state}`
      : ad.location;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 32px rgba(0,0,0,0.10)",
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative", overflow: "hidden", height: 200 }}>
        <CardMedia
          component="img"
          image={`${apiUrl}${clientPath}`}
          alt={ad.title}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            "&:hover": { transform: "scale(1.04)" },
          }}
        />
        {/* Category badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            px: 1.5,
            py: 0.4,
            borderRadius: "99px",
            bgcolor: catColor.bg,
            color: catColor.text,
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.03em",
            backdropFilter: "blur(6px)",
          }}
        >
          {ad.category?.name || "Інше"}
        </Box>
        {/* Bookmark */}
        <Tooltip title="Зберегти">
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(6px)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <BookmarkBorderIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          gutterBottom
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.35,
            mb: 1,
          }}
        >
          {ad.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          {ad.description}
        </Typography>

        {/* Meta chips */}
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
              <CalendarTodayOutlinedIcon sx={{ fontSize: "13px !important" }} />
            }
            label={new Date(ad.date).toLocaleDateString("uk-UA")}
            size="small"
            sx={{ fontSize: "11px", bgcolor: "#F1F5F9", border: "none" }}
          />
        </Box>
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          component={Link}
          to={`/ads/${ad.id}`}
          variant="caption"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "12px",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Переглянути
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Відкрити">
            <IconButton size="small" component={Link} to={`/ads/${ad.id}`}>
              <OpenInNewIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

const GridView = ({ ads }) => (
  <Grid container spacing={3}>
    {ads.map((ad, index) => (
      <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
        <AdCard ad={ad} />
      </Grid>
    ))}
  </Grid>
);

export default GridView;
