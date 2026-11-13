import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
} from "@mui/material";

import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";

export default function HeroSection({
  title,
  typedStrings = [],
  subtitle,
  buttonText,
  buttonLink,
  badge,
  secondaryButtonText,
  secondaryButtonLink,
  size = "md",
}) {
  const sizes = {
    sm: {
      py: { xs: 7, sm: 8, md: 9 },
    },
    md: {
      py: { xs: 9, sm: 11, md: 13 },
    },
    lg: {
      py: { xs: 11, sm: 13, md: 16 },
    },
  };

  const hasTypedText =
    Array.isArray(typedStrings) && typedStrings.length > 0;

  const buttonStyle = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 700,
    fontSize: { xs: ".9rem", md: ".95rem" },
    textTransform: "none",
    borderRadius: "12px",
    px: 3.5,
    py: 1.5,
    transition: "all .3s cubic-bezier(.16,1,.3,1)",
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        color: "#fff",

        background:
          "linear-gradient(135deg, #061B35 0%, #003D82 52%, #0757A6 100%)",

        ...sizes[size] || sizes.md,

        // Animations
        "@keyframes heroFadeUp": {
          from: {
            opacity: 0,
            transform: "translateY(24px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },

        "@keyframes heroFloat": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-14px)",
          },
        },

        "@keyframes heroGlow": {
          "0%, 100%": {
            opacity: 0.35,
          },
          "50%": {
            opacity: 0.7,
          },
        },

        "@media (prefers-reduced-motion: reduce)": {
          "& *": {
            animation: "none !important",
            transition: "none !important",
          },
        },
      }}
    >

      {/* BACKGROUND DECORATIONS */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",

          backgroundImage:
            "radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px)",

          backgroundSize: "32px 32px",

          opacity: 0.45,

          maskImage:
            "linear-gradient(to bottom, black, transparent)",
        }}
      />

      {/* GOLDEN GLOW */}

      <Box
        sx={{
          position: "absolute",
          width: { xs: 280, md: 500 },
          height: { xs: 280, md: 500 },
          borderRadius: "50%",
          top: -180,
          right: { xs: -130, md: -100 },

          background:
            "radial-gradient(circle, rgba(255,215,0,.2), transparent 70%)",

          filter: "blur(12px)",
          animation: "heroGlow 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* BLUE LIGHT */}

      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          bottom: -280,
          left: -150,

          background:
            "radial-gradient(circle, rgba(0,145,255,.25), transparent 70%)",

          pointerEvents: "none",
        }}
      />

      {/* DECORATIVE CIRCLE */}

      <Box
        sx={{
          position: "absolute",
          width: { xs: 180, md: 330 },
          height: { xs: 180, md: 330 },
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,.09)",
          top: "50%",
          right: { xs: -90, md: "5%" },
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: { xs: 120, md: 220 },
          height: { xs: 120, md: 220 },
          borderRadius: "50%",
          border: "1px solid rgba(255,215,0,.13)",
          top: "50%",
          right: { xs: -60, md: "9%" },
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />

      {/* GOLD TOP LINE */}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,

          background:
            "linear-gradient(90deg, transparent, #FFD700 30%, #FFD700 70%, transparent)",

          opacity: 0.85,
        }}
      />

      {/* CONTENT */}

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 850,
            mx: "auto",
            textAlign: "center",
          }}
        >

          {/* BADGE */}

          {badge && (
            <Chip
              label={badge}
              sx={{
                mb: 3,
                height: 34,
                px: 1,
                borderRadius: "50px",

                color: "#FFD700",
                background: "rgba(255,215,0,.10)",

                border:
                  "1px solid rgba(255,215,0,.28)",

                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",

                fontWeight: 700,
                fontSize: ".72rem",
                letterSpacing: ".08em",

                animation:
                  "heroFadeUp .7s cubic-bezier(.16,1,.3,1) both",
              }}
            />
          )}

          {/* TITLE */}

          <Typography
            component="h1"
            sx={{
              fontFamily:
                "'Playfair Display', Georgia, serif",

              fontWeight: 800,

              fontSize: {
                xs: "2.5rem",
                sm: "3.3rem",
                md: "4.3rem",
                lg: "4.8rem",
              },

              lineHeight: 1.12,
              letterSpacing: "-.035em",

              color: "#fff",

              mb: 2.5,

              overflowWrap: "break-word",

              animation:
                "heroFadeUp .8s .1s cubic-bezier(.16,1,.3,1) both",

              "& .typed-cursor": {
                color: "#FFD700",
                fontWeight: 300,
              },
            }}
          >
            {hasTypedText ? (
              <ReactTyped
                strings={typedStrings}
                typeSpeed={65}
                backSpeed={35}
                backDelay={2200}
                loop
                showCursor
              />
            ) : (
              title
            )}
          </Typography>

          {/* GOLD ACCENT */}

          <Box
            sx={{
              width: 70,
              height: 4,
              borderRadius: 10,
              mx: "auto",
              mb: 3.5,

              background:
                "linear-gradient(90deg, #FFD700, #FFF0A6)",

              boxShadow:
                "0 0 18px rgba(255,215,0,.3)",

              animation:
                "heroFadeUp .8s .2s cubic-bezier(.16,1,.3,1) both",
            }}
          />

          {/* SUBTITLE */}

          {subtitle && (
            <Typography
              sx={{
                fontFamily:
                  "'Plus Jakarta Sans', sans-serif",

                fontWeight: 400,

                fontSize: {
                  xs: ".98rem",
                  sm: "1.05rem",
                  md: "1.17rem",
                },

                color: "rgba(255,255,255,.78)",
                lineHeight: 1.85,

                maxWidth: 650,
                mx: "auto",
                mb: 4,

                animation:
                  "heroFadeUp .8s .3s cubic-bezier(.16,1,.3,1) both",
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* BUTTONS */}

          {(buttonText || secondaryButtonText) && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",

                animation:
                  "heroFadeUp .8s .4s cubic-bezier(.16,1,.3,1) both",
              }}
            >

              {buttonText && (
                <Button
                  component={Link}
                  to={buttonLink || "/"}
                  sx={{
                    ...buttonStyle,

                    color: "#07366B",
                    background: "#FFD700",

                    boxShadow:
                      "0 7px 24px rgba(255,215,0,.25)",

                    "&:hover": {
                      background: "#FFE36A",
                      transform: "translateY(-3px)",
                      boxShadow:
                        "0 12px 30px rgba(255,215,0,.35)",
                    },
                  }}
                >
                  {buttonText}
                </Button>
              )}

              {secondaryButtonText && (
                <Button
                  component={Link}
                  to={secondaryButtonLink || "/"}
                  variant="outlined"
                  sx={{
                    ...buttonStyle,

                    color: "#fff",
                    border:
                      "1px solid rgba(255,255,255,.4)",

                    "&:hover": {
                      background: "rgba(255,255,255,.08)",
                      borderColor: "#fff",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {secondaryButtonText}
                </Button>
              )}

            </Box>
          )}

        </Box>
      </Container>
    </Box>
  );
}