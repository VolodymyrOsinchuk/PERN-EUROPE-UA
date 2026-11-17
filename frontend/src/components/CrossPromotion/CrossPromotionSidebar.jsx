// frontend/src/components/CrossPromotion/CrossPromotionSidebar.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CROSS_PROMOTION } from "../../config/crossPromotion";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

/* ── Analytics: single adapter, change here if you use another tool ── */
function trackPromotionClick(site) {
  if (typeof window === "undefined") return;
  const payload = {
    event: "cross_promotion_click",
    promo_id: site.id,
    promo_name: site.name,
    promo_target: site.url,
  };
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  } else if (typeof window.gtag === "function") {
    window.gtag("event", "cross_promotion_click", payload);
  }
}

/* ── Adds UTM parameters so traffic between projects can be measured ── */
function buildPromoUrl(url) {
  try {
    const target = new URL(url);
    target.searchParams.set("utm_source", window.location.hostname);
    target.searchParams.set("utm_medium", "cross_promotion");
    return target.toString();
  } catch {
    return url;
  }
}

/* ── Logo with a letter fallback when the image is missing ── */
function PromoLogo({ site }) {
  const [failed, setFailed] = useState(false);
  const boxSx = {
    width: 48,
    height: 48,
    borderRadius: "14px",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
    transition: "transform 0.3s ease",
  };

  if (!site.logo || failed) {
    return (
      <Box
        aria-hidden="true"
        sx={{
          ...boxSx,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${site.accentColor}, ${GOLD})`,
          color: "#fff",
          fontFamily: F_DISPLAY,
          fontWeight: 700,
          fontSize: "1.25rem",
        }}
      >
        {site.name.charAt(0)}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={site.logo}
      alt=""
      width={48}
      height={48}
      loading="lazy"
      onError={() => setFailed(true)}
      sx={{ ...boxSx, objectFit: "cover", bgcolor: "#fff" }}
    />
  );
}

/* ── One promotional card ── */
function PromoCard({ site }) {
  const href = buildPromoUrl(site.url);

  return (
    <Card
      component="article"
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: { xs: "16px", md: "18px" },
        border: "1.5px solid #e2e8f0",
        bgcolor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,.04)",
        overflow: "hidden",
        transition: "transform .25s ease, box-shadow .25s ease",

        "@media (hover: hover)": {
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 28px rgba(0,87,184,.12)",
            borderColor: `${site.accentColor}66`,
          },
        },

        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
        },
      }}
    >
      <Box
        sx={{
          height: 4,
          flexShrink: 0,
          background: `linear-gradient(90deg, ${site.accentColor}, ${GOLD})`,
        }}
      />

      <CardContent
        sx={{
          p: { xs: 2, sm: 2.25, md: 2.5 },
          flexGrow: 1,
          "&:last-child": { pb: { xs: 2, sm: 2.25, md: 2.5 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.25, md: 1.5 },
            mb: 1.5,
            minWidth: 0,
          }}
        >
          <PromoLogo site={site} />

          <Typography
            component="h3"
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "0.98rem", md: "1.05rem" },
              color: "#0f172a",
              lineHeight: 1.3,
              overflowWrap: "anywhere",
              minWidth: 0,
            }}
          >
            {site.name}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: { xs: "0.82rem", md: "0.85rem" },
            color: "#64748b",
            lineHeight: 1.65,
            overflowWrap: "anywhere",
          }}
        >
          {site.description}
        </Typography>
      </CardContent>

      <Box sx={{ px: { xs: 2, md: 2.5 }, pb: { xs: 2, md: 2.5 } }}>
        <Button
          fullWidth
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackPromotionClick(site)}
          aria-label={`Відвідати ${site.name} (відкриється в новій вкладці)`}
          endIcon={<OpenInNewIcon sx={{ fontSize: 15 }} />}
          sx={{
            fontFamily: F_BODY,
            fontWeight: 700,
            textTransform: "none",
            fontSize: { xs: "0.82rem", md: "0.85rem" },
            borderRadius: "12px",
            py: { xs: 1.2, md: 1.1 },
            minHeight: 44,
            color: BLUE,
            border: `1.5px solid ${BLUE}`,
            bgcolor: "#eff6ff",
            "&:hover": { bgcolor: "#dbeafe", borderColor: BLUE },
          }}
        >
          Відвідати сайт
        </Button>
      </Box>
    </Card>
  );
}

/**
 * CrossPromotionStrip
 * Горизонтальний блок під контентом сторінки.
 * Desktop: три картки в ряд. Mobile: carousel з scroll-snap.
 * Вміст береться лише з config/crossPromotion.js.
 */
export default function CrossPromotionStrip() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(CROSS_PROMOTION.sessionDismissKey) === "1";
    } catch {
      return false;
    }
  });

  const sites = CROSS_PROMOTION.sites.filter((s) => s.enabled);
  if (dismissed || sites.length === 0) return null;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(CROSS_PROMOTION.sessionDismissKey, "1");
    } catch {
      /* storage недоступний: сховати лише на поточному рендері */
    }
    setDismissed(true);
  };

  return (
    <Box
      component="aside"
      aria-label={CROSS_PROMOTION.title}
      sx={{
        bgcolor: "#fff",
        borderTop: "1px solid #f1f5f9",
        py: { xs: 3.5, sm: 5, md: 7 },
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1.5,
            mb: { xs: 2.5, md: 3 },
            minWidth: 0,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 3,
                background: "linear-gradient(90deg, #0057B8, #FFD700)",
                borderRadius: "99px",
                mb: 1.25,
              }}
            />

            <Typography
              component="h2"
              sx={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: { xs: "1.15rem", sm: "1.35rem", md: "1.5rem" },
                color: "#0f172a",
                lineHeight: 1.3,
                overflowWrap: "anywhere",
              }}
            >
              {CROSS_PROMOTION.title}
            </Typography>

            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: { xs: "0.8rem", md: "0.88rem" },
                color: "#64748b",
                mt: 0.6,
                lineHeight: 1.6,
              }}
            >
              {CROSS_PROMOTION.subtitle}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleDismiss}
            aria-label="Сховати блок"
            sx={{
              flexShrink: 0,
              width: 40,
              height: 40,
              color: "#94a3b8",
              "&:hover": {
                color: "#0f172a",
                bgcolor: "#f1f5f9",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Responsive cards */}
        {/* Responsive cards */}
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",

            // Mobile: одна картка на рядок
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },

            gap: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },

            width: "100%",
            minWidth: 0,
          }}
        >
          {sites.map((site) => (
            <Box
              component="li"
              key={site.id}
              sx={{
                display: "flex",
                minWidth: 0,
                width: "100%",
              }}
            >
              <PromoCard site={site} />
            </Box>
          ))}
        </Box>

        {/* Mobile scroll hint */}
        {sites.length > 1 && (
          <Typography
            sx={{
              display: { xs: "block", md: "none" },
              textAlign: "center",
              mt: 1.5,
              fontFamily: F_BODY,
              fontSize: "0.72rem",
              color: "#94a3b8",
            }}
          >
            Перетягніть, щоб переглянути інші сайти →
          </Typography>
        )}
      </Container>
    </Box>
  );
}
