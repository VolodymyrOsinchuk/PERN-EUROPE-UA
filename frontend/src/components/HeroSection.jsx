// import { Typography, Container, Button } from "@mui/material";
// import { Link } from "react-router-dom";
// import { ReactTyped } from "react-typed";
// const HeroSection = ({
//   typedStrings = [],
//   subtitle,
//   buttonText,
//   buttonLink,
//   textColor = "inherit",
// }) => {
//   // heroStyles removed (unused) — styling is handled in CSS
//   return (
//     <div
//       // style={heroStyles}
//       className="hero"
//     >
//       <Container>
//         <Typography
//           variant="h2"
//           gutterBottom
//           style={{
//             color: textColor,
//             fontWeight: "bold",
//             marginBottom: "20px",
//           }}
//         >
//           {typedStrings.length > 0 && (
//             <ReactTyped
//               strings={typedStrings}
//               typeSpeed={200}
//               backSpeed={150}
//               loop
//             />
//           )}
//         </Typography>

//         {subtitle && (
//           <Typography
//             variant="h5"
//             gutterBottom
//             style={{
//               color: textColor,
//               marginBottom: "30px",
//             }}
//           >
//             {subtitle}
//           </Typography>
//         )}

//         {buttonText && (
//           <Button
//             variant="contained"
//             color="secondary"
//             size="large"
//             LinkComponent={Link}
//             to={buttonLink}
//             style={{ marginTop: "20px" }}
//           >
//             {buttonText}
//           </Button>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default HeroSection;
import { Box, Container, Typography, Button, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";

/**
 * HeroSection — modernisé avec :
 * - Dégradé éditorial Ukraine + particules décoratives
 * - Typography Playfair Display / Plus Jakarta Sans
 * - Animations fadeUp
 * - Accent doré et bleu ukrainien
 *
 * Props identiques à l'original + nouveaux optionnels :
 *  title, typedStrings, subtitle, buttonText, buttonLink,
 *  badge?, secondaryButtonText?, secondaryButtonLink?, size? ('sm'|'md'|'lg')
 */
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
    sm: { pt: "60px", pb: "56px" },
    md: { pt: "80px", pb: "80px" },
    lg: { pt: "96px", pb: "100px" },
  };

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
        ...sizes[size],
      }}
    >
      {/* ── Decorative background elements ── */}
      {/* Golden sun / circle */}
      <Box
        sx={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,215,0,.18) 0%, rgba(255,215,0,0) 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Bottom left fade */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,87,184,.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Gold stripe top accent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, transparent 0%, #FFD700 30%, #FFD700 70%, transparent 100%)",
          opacity: 0.8,
        }}
      />
      {/* Geometric dots grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 760, mx: "auto", textAlign: "center" }}>
          {/* Badge */}
          {badge && (
            <Chip
              label={badge}
              sx={{
                mb: 3,
                bgcolor: "rgba(255,215,0,.15)",
                color: "#FFD700",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                border: "1px solid rgba(255,215,0,.3)",
                borderRadius: "99px",
                height: 30,
                animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
                "@keyframes fadeUp": {
                  from: { opacity: 0, transform: "translateY(20px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            />
          )}

          {/* Title */}
          <Typography
            component="h1"
            sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 900,
              fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.6rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#fff",
              mb: 2,
              animation: "fadeUp 0.6s 0.05s cubic-bezier(0.16,1,0.3,1) both",
              "@keyframes fadeUp": {
                from: { opacity: 0, transform: "translateY(24px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {typedStrings.length > 0 ? (
              <ReactTyped
                strings={typedStrings}
                typeSpeed={120}
                backSpeed={80}
                loop
              />
            ) : (
              title
            )}
          </Typography>

          {/* Gold accent line */}
          <Box
            sx={{
              width: 64,
              height: 4,
              background: "linear-gradient(90deg, #FFD700, rgba(255,215,0,.3))",
              borderRadius: "99px",
              mx: "auto",
              mb: 3,
              animation: "fadeUp 0.6s 0.15s cubic-bezier(0.16,1,0.3,1) both",
            }}
          />

          {/* Subtitle */}
          {subtitle && (
            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.15rem" },
                color: "rgba(255,255,255,.8)",
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 580,
                mx: "auto",
                animation: "fadeUp 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Buttons */}
          {(buttonText || secondaryButtonText) && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
                animation: "fadeUp 0.6s 0.3s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {buttonText && (
                <Button
                  component={Link}
                  to={buttonLink || "/"}
                  sx={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textTransform: "none",
                    bgcolor: "#FFD700",
                    color: "#003d82",
                    borderRadius: "12px",
                    px: 3.5,
                    py: 1.4,
                    boxShadow: "0 6px 24px rgba(255,215,0,.4)",
                    "&:hover": {
                      bgcolor: "#f5c400",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 32px rgba(255,215,0,.5)",
                    },
                    transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {buttonText}
                </Button>
              )}
              {secondaryButtonText && (
                <Button
                  component={Link}
                  to={secondaryButtonLink || "/"}
                  sx={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textTransform: "none",
                    color: "#fff",
                    borderRadius: "12px",
                    px: 3.5,
                    py: 1.4,
                    border: "1.5px solid rgba(255,255,255,.35)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,.08)",
                      borderColor: "rgba(255,255,255,.6)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
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
