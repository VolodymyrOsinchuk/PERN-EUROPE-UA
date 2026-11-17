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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "18px",
        border: "1.5px solid #e2e8f0",
        bgcolor: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        overflow: "hidden",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 14px 34px rgba(0,87,184,.12)",
          borderColor: `${site.accentColor}66`,
        },
        "&:hover .MuiButton-endIcon": { transform: "translateX(3px)" },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${site.accentColor}, ${GOLD})`,
        }}
      />

      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <PromoLogo site={site} />
          <Typography
            component="h3"
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#0f172a",
              lineHeight: 1.25,
            }}
          >
            {site.name}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: "0.85rem",
            color: "#64748b",
            lineHeight: 1.65,
          }}
        >
          {site.description}
        </Typography>
      </CardContent>

      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          fullWidth
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackPromotionClick(site)}
          aria-label={`Відвідати ${site.name} (відкриється в новій вкладці)`}
          endIcon={
            <OpenInNewIcon
              sx={{ fontSize: 15, transition: "transform 0.2s" }}
            />
          }
          sx={{
            fontFamily: F_BODY,
            fontWeight: 700,
            textTransform: "none",
            fontSize: "0.85rem",
            borderRadius: "12px",
            py: 1.1,
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
        py: { xs: 5, md: 7 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
            mb: 3,
          }}
        >
          <Box>
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
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#0f172a",
                letterSpacing: "-0.01em",
              }}
            >
              {CROSS_PROMOTION.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.85rem",
                color: "#64748b",
                mt: 0.5,
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
              color: "#94a3b8",
              "&:hover": { color: "#0f172a", bgcolor: "#f1f5f9" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "flex",
            gap: 2.5,
            overflowX: { xs: "auto", md: "visible" },
            scrollSnapType: { xs: "x mandatory", md: "none" },
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            pb: { xs: 1, md: 0 },
          }}
        >
          {sites.map((site) => (
            <Box
              component="li"
              key={site.id}
              sx={{
                display: "flex",
                minWidth: 0,
                flex: { xs: "0 0 82%", sm: "0 0 46%", md: "1 1 0" },
                scrollSnapAlign: { xs: "start", md: "none" },
              }}
            >
              <PromoCard site={site} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
