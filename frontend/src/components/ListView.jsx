import { useState } from "react";
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

function ListCard({ ad, isLast, index }) {
  const [saved, setSaved] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const serverPath = ad.photos?.[0];
  const imageUrl = serverPath
    ? serverPath.startsWith("http")
      ? serverPath
      : `${apiUrl}/uploads/adv/${serverPath.replace(/^public\/uploads\/adv\//, "")}`
    : "";

  const catKey = ad.category?.slug || "default";
  const catColor = CAT_COLORS[catKey] || CAT_COLORS.default;
  const locationLabel =
    ad.location && typeof ad.location === "object"
      ? `${ad.location.city || ""}, ${ad.location.state || ""}`
      : ad.location || "";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, sm: 3 },
          py: 3,
          px: { xs: 2.5, sm: 3 },
          alignItems: "flex-start",
          transition: "background 0.18s ease",
          borderRadius: "14px",
          cursor: "pointer",
          position: "relative",
          animation: "fadeUp 0.45s ease both",
          animationDelay: `${index * 0.05}s`,
          "@keyframes fadeUp": {
            from: { opacity: 0, transform: "translateY(16px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "&:hover": {
            bgcolor: "#f8fafc",
            "& .list-img": { transform: "scale(1.04)" },
            "& .list-title": { color: BLUE },
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

        {/* ── Thumbnail ── */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: 96, sm: 140, md: 168 },
            height: { xs: 80, sm: 108, md: 120 },
            borderRadius: "14px",
            overflow: "hidden",
            position: "relative",
            bgcolor: "#f1f5f9",
            border: "1.5px solid #e2e8f0",
            zIndex: 2,
          }}
        >
          {imageUrl && (
            <Box
              className="list-img"
              component="img"
              src={imageUrl}
              alt={ad.title}
              onLoad={() => setImgLoaded(true)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition:
                  "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
                opacity: imgLoaded ? 1 : 0,
              }}
            />
          )}

          {/* Category dot */}
          <Box
            sx={{
              position: "absolute",
              bottom: 7,
              left: 7,
              px: 1,
              py: 0.25,
              borderRadius: "6px",
              bgcolor: catColor.bg,
              color: catColor.text,
              fontFamily: F_BODY,
              fontWeight: 700,
              fontSize: "0.6rem",
              backdropFilter: "blur(6px)",
            }}
          >
            {ad.category?.name || "Інше"}
          </Box>
        </Box>

        {/* ── Content ── */}
        <Box sx={{ flexGrow: 1, minWidth: 0, zIndex: 2, position: "relative" }}>
          {/* Top row: title + actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
              mb: 0.75,
            }}
          >
            <Typography
              className="list-title"
              sx={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                color: "#0f172a",
                lineHeight: 1.35,
                transition: "color 0.2s",
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
              <Tooltip title={saved ? "Збережено" : "Зберегти"}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSaved((v) => !v);
                  }}
                  sx={{
                    color: saved ? BLUE : "#94a3b8",
                    border: `1px solid ${saved ? BLUE : "#e2e8f0"}`,
                    borderRadius: "8px",
                    width: 28,
                    height: 28,
                    "&:hover": {
                      color: BLUE,
                      borderColor: BLUE,
                      bgcolor: "#eff6ff",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <BookmarkBorderIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Відкрити">
                <IconButton
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  component={Link}
                  to={`/ads/${ad.id}`}
                  sx={{
                    color: "#94a3b8",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    width: 28,
                    height: 28,
                    "&:hover": {
                      color: BLUE,
                      borderColor: BLUE,
                      bgcolor: "#eff6ff",
                    },
                  }}
                >
                  <OpenInNewIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.82rem",
              color: "#64748b",
              lineHeight: 1.65,
              mb: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: { xs: 1, sm: 2 },
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {ad.description}
          </Typography>

          {/* Meta + price row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {locationLabel && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: 13, color: "#94a3b8" }}
                  />
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
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.75rem",
                    color: "#64748b",
                  }}
                >
                  {new Date(ad.date || ad.createdAt).toLocaleDateString(
                    "uk-UA",
                  )}
                </Typography>
              </Box>
            </Box>

            {/* Price */}
            {ad.price && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.4,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #0057B8, #003d82)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    color: "#fff",
                  }}
                >
                  €{Number(ad.price).toLocaleString("uk-UA")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {!isLast && (
        <Divider sx={{ borderColor: "#f1f5f9", mx: { xs: 2.5, sm: 3 } }} />
      )}
    </>
  );
}

export default function ListView({ ads }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1.5px solid #e2e8f0",
        borderRadius: "20px",
        overflow: "hidden",
        bgcolor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,.04)",
      }}
    >
      {ads.map((ad, i) => (
        <ListCard
          key={ad.id ?? i}
          ad={ad}
          index={i}
          isLast={i === ads.length - 1}
        />
      ))}
    </Paper>
  );
}
