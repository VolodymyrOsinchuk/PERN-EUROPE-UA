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
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";

const CAT_COLORS = {
  default: { bg: "#eff6ff", text: "#1d4ed8" },
  work: { bg: "#ecfdf5", text: "#065f46" },
  housing: { bg: "#fff7ed", text: "#9a3412" },
  services: { bg: "#eff6ff", text: "#1d4ed8" },
  education: { bg: "#f5f3ff", text: "#6d28d9" },
  other: { bg: "#f8fafc", text: "#475569" },
};

function AdCard({ ad }) {
  const [saved, setSaved] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const serverPath = ad.photos?.[0];
  const imageUrl = serverPath
    ? serverPath.startsWith("http")
      ? serverPath
      : serverPath.includes("public/uploads/adv/")
        ? `${apiUrl}/uploads/adv/${serverPath.split("public/uploads/adv/")[1]}`
        : serverPath.startsWith("/uploads/")
          ? `${apiUrl}${serverPath}`
          : `${apiUrl}/uploads/adv/${serverPath.replace(/^public\/uploads\/adv\//, "")}`
    : "";

  const catKey = ad.category?.slug || "default";
  const catColor = CAT_COLORS[catKey] || CAT_COLORS.default;

  const locationLabel =
    ad.location && typeof ad.location === "object"
      ? `${ad.location.city || ""}, ${ad.location.state || ""}`
      : ad.location || "";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "18px",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        overflow: "hidden",
        textDecoration: "none",
        bgcolor: "#fff",
        position: "relative",
        transition:
          "transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s cubic-bezier(0.16,1,0.3,1)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 16px 48px rgba(0,87,184,.13)",
          "& .ad-img": { transform: "scale(1.05)" },
          "& .ad-arrow": { opacity: 1, transform: "translateX(0)" },
        },
      }}
    >
      {/* ── Link Overlay ── */}
      <Link
        to={`/ads/${ad.id}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      {/* ── Image ── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          height: 200,
          bgcolor: "#f1f5f9",
        }}
      >
        {imageUrl && (
          <CardMedia
            component="img"
            className="ad-img"
            image={imageUrl}
            alt={ad.title}
            onLoad={() => setImgLoaded(true)}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition:
                "opacity 0.3s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        )}

        {/* Category badge */}
        <Chip
          label={ad.category?.name || "Інше"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: catColor.bg,
            color: catColor.text,
            fontFamily: F_BODY,
            fontWeight: 700,
            fontSize: "0.7rem",
            backdropFilter: "blur(8px)",
            border: "none",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Bookmark */}
        <Tooltip title={saved ? "Збережено" : "Зберегти"}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved((v) => !v);
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,.9)",
              backdropFilter: "blur(6px)",
              border: `1.5px solid ${saved ? BLUE : "rgba(255,255,255,.6)"}`,
              color: saved ? BLUE : "#94a3b8",
              width: 32,
              height: 32,
              transition: "all 0.2s",
              zIndex: 2,
              "&:hover": { bgcolor: "#fff", color: BLUE, borderColor: BLUE },
            }}
          >
            <BookmarkBorderIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>

        {/* Price badge */}
        {ad.price && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #0057B8, #003d82)",
              boxShadow: "0 2px 8px rgba(0,87,184,.4)",
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#fff",
              }}
            >
              €{Number(ad.price).toLocaleString("uk-UA")}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Body ── */}
      <CardContent sx={{ flexGrow: 1, p: 2.5, pb: "16px !important" }}>
        <Typography
          sx={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: "1rem",
            color: "#0f172a",
            lineHeight: 1.35,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ad.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: "0.82rem",
            color: "#64748b",
            lineHeight: 1.65,
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ad.description}
        </Typography>

        {/* Meta chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {locationLabel && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.75rem",
                  color: "#64748b",
                }}
              >
                {locationLabel}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: 12, color: "#94a3b8" }}
            />
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.75rem", color: "#64748b" }}
            >
              {new Date(ad.date || ad.createdAt).toLocaleDateString("uk-UA")}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* ── Footer ── */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#fafbfc",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontWeight: 700,
            fontSize: "0.8rem",
            color: BLUE,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          Переглянути
          <ArrowForwardIconInline />
        </Typography>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
          }}
          component={Link}
          to={`/ads/${ad.id}`}
          sx={{
            color: "#94a3b8",
            "&:hover": { color: BLUE, bgcolor: "#eff6ff" },
          }}
        >
          <OpenInNewIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>
    </Card>
  );
}

/* Tiny inline arrow icon */
function ArrowForwardIconInline() {
  return (
    <Box
      className="ad-arrow"
      component="span"
      sx={{
        display: "inline-flex",
        opacity: 0,
        transform: "translateX(-4px)",
        transition: "all 0.2s ease",
      }}
    >
      →
    </Box>
  );
}

export default function GridView({ ads }) {
  return (
    <Grid container spacing={3}>
      {ads.map((ad, i) => (
        <Grid
          key={ad.id ?? i}
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{
            animation: "fadeUp 0.5s ease both",
            animationDelay: `${(i % 9) * 0.06}s`,
            "@keyframes fadeUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <AdCard ad={ad} />
        </Grid>
      ))}
    </Grid>
  );
}
