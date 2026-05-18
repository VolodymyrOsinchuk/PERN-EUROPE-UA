// import { Fragment } from 'react'
// import {
//   Typography,
//   Container,
//   Grid,
//   IconButton,
//   Stack,
//   Box,
// } from '@mui/material'
// import '../assets/css/footer.css'
// import { Link } from 'react-router-dom'

// const Footer = () => {
//   return (
//     <Stack>
//       <Box
//         component="footer"
//         sx={{
//           backgroundColor: 'black',
//           padding: '20px 0',
//           marginTop: '40px',
//           borderTop: '1px solid #e0e0e0',
//         }}
//       >
//         <Container
//           sx={{
//             maxWidth: '800px',
//             margin: '0 auto',
//             padding: '0 20px',
//             textAlign: 'center',
//           }}
//         >
//           <Typography variant="body2" sx={{ color: 'white' }} align="center">
//             © 2023 Українці в Європі. Усі права захищено.
//             <Box component="span" mx={1}>
//               •
//             </Box>
//             <Link
//               to="/privacy-policy"
//               style={{
//                 color: '#666',
//                 textDecoration: 'none',
//                 margin: '0 10px',
//                 '&:hover': {
//                   color: '#2196f3',
//                   textDecoration: 'underline',
//                 },
//               }}
//               onClick={(e) => {
//                 e.preventDefault()
//                 window.location.href = '/privacy-policy'
//               }}
//             >
//               Політика конфіденційності
//             </Link>
//           </Typography>
//         </Container>
//       </Box>
//     </Stack>
//   )
// }
// export default Footer

// import { Box, Typography, Link } from "@mui/material";

// const Footer = () => {
//   return (
//     <Box
//       component="footer"
//       sx={{
//         backgroundColor: "black",
//         py: 6,
//         borderTop: 1,
//         borderColor: "gray.200",
//       }}
//     >
//       <Box sx={{ textAlign: "center" }}>
//         <Typography
//           variant="body2"
//           sx={{ color: "white", fontSize: "0.875rem" }}
//         >
//           {new Date().getFullYear()} Українці в Європі. Всі права захищені.
//           <Box component="span" sx={{ mx: 2 }}>
//             •
//           </Box>
//           <Link
//             href="/privacy-policy"
//             component="a"
//             sx={{
//               color: "white",
//               textDecoration: "none",
//               "&:hover": {
//                 color: "blue",
//                 textDecoration: "underline",
//               },
//             }}
//           >
//             Політика конфіденційності
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Footer;

import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  {
    title: "Платформа",
    links: [
      { label: "Новини", href: "/news" },
      { label: "Афіша", href: "/events" },
      { label: "Оголошення", href: "/ads" },
      { label: "Публікації", href: "/publications" },
      { label: "Форум", href: "/forum" },
    ],
  },
  {
    title: "Компанія",
    links: [
      { label: "Про нас", href: "/about" },
      { label: "Контакт", href: "/contact" },
      { label: "Конфіденційність", href: "/policy" },
    ],
  },
  {
    title: "Акаунт",
    links: [
      { label: "Увійти", href: "/login" },
      { label: "Реєстрація", href: "/register" },
      { label: "Профіль", href: "/profile" },
    ],
  },
];

const SOCIALS = [
  { icon: "facebook", href: "https://facebook.com" },
  { icon: "telegram", href: "https://telegram.org" },
  { icon: "instagram", href: "https://instagram.com" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "#0a0f1e",
        color: "#fff",
        pt: { xs: 6, md: 10 },
        pb: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* ── Brand col ── */}
          <Grid item xs={12} md={4}>
            {/* Logo */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                }}
              >
                <Box sx={{ flex: 1, bgcolor: "#0057B8" }} />
                <Box sx={{ flex: 1, bgcolor: "#FFD700" }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display',serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#fff",
                    lineHeight: 1.1,
                  }}
                >
                  Українці в Європі
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,.4)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Платформа діаспори
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: "0.875rem",
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.8,
                mb: 3,
                maxWidth: 300,
              }}
            >
              Об'єднуємо українців по всій Європі. Новини, оголошення, події та
              підтримка спільноти — все в одному місці.
            </Typography>

            {/* Socials */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {SOCIALS.map((s) => (
                <IconButton
                  key={s.icon}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "10px",
                    color: "rgba(255,255,255,.7)",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#0057B8",
                      borderColor: "#0057B8",
                      color: "#fff",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <span className="material-icons" style={{ fontSize: 18 }}>
                    {s.icon}
                  </span>
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* ── Links cols ── */}
          {FOOTER_LINKS.map((col) => (
            <Grid item xs={6} sm={4} md={2.5} key={col.title}>
              <Typography
                sx={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.35)",
                  mb: 2.5,
                }}
              >
                {col.title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {col.links.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    to={link.href}
                    underline="none"
                    sx={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,.6)",
                      transition: "color 0.2s",
                      "&:hover": { color: "#FFD700" },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,.07)", my: 5 }} />

        {/* ── Bottom row ── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,.3)",
            }}
          >
            © {new Date().getFullYear()} Українці в Європі — Усі права захищені
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            {[
              { label: "Конфіденційність", href: "/policy" },
              { label: "Умови використання", href: "/policy" },
            ].map((l) => (
              <MuiLink
                key={l.label}
                component={Link}
                to={l.href}
                underline="none"
                sx={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,.3)",
                  "&:hover": { color: "rgba(255,255,255,.7)" },
                }}
              >
                {l.label}
              </MuiLink>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
