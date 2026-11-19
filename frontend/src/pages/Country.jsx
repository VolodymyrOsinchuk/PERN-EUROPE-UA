// frontend/src/pages/Country.jsx
import { useLoaderData, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Chip,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getCategoryColors } from "../data/publicationCategories";
import customFetch from "../utils/customFetch";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";

// Порядок і назви категорій (ключі збігаються з бекендом)
const CATEGORY_TITLES = {
  government: "Офіційна інформація",
  residence: "Проживання та документи",
  benefits: "Допомога та виплати",
  work: "Робота",
  health: "Медицина",
  education: "Освіта",
  family: "Сім'я",
  transport: "Транспорт",
  finance: "Фінанси",
  consulate: "Посольство та консульства",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

export async function loader({ params }) {
  const code = String(params.code || "").toUpperCase();

  let country;
  try {
    const { data } = await customFetch.get(`/countries/${code}`);
    country = data;
  } catch (error) {
    // 404 — країна не існує або не опублікована; інше — помилка сервера
    throw new Response("Not found", {
      status: error?.response?.status || 500,
    });
  }

  return { country };
}

export default function Country() {
  const { country } = useLoaderData();
  const links = country.links || [];

  // Групування посилань за категорією у порядку CATEGORY_TITLES
  const groups = Object.keys(CATEGORY_TITLES)
    .map((key) => ({
      key,
      title: CATEGORY_TITLES[key],
      links: links.filter((l) => l.category === key),
    }))
    .filter((g) => g.links.length > 0);

  const verifiedDate = formatDate(country.lastVerifiedAt);

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Button
          component={Link}
          to="/countries"
          startIcon={<ArrowBackIcon />}
          sx={{
            fontFamily: F_BODY,
            textTransform: "none",
            color: "#64748b",
            mb: 3,
          }}
        >
          Назад
        </Button>

        <Typography
          sx={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "2.6rem" },
            color: "#0f172a",
            mb: 1,
          }}
        >
          {country.flag ? `${country.flag} ` : ""}
          {country.name}
        </Typography>

        {verifiedDate && (
          <Stack direction="row" gap={1} mb={3} sx={{ flexWrap: "wrap" }}>
            <Chip
              size="small"
              label={`Перевірено: ${verifiedDate}`}
              sx={{ fontFamily: F_BODY, fontWeight: 600 }}
            />
          </Stack>
        )}

        {country.disclaimer && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 4,
              borderRadius: 3,
              bgcolor: "#fffbeb",
              border: "1px solid #fde68a",
            }}
          >
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.875rem",
                color: "#92400e",
              }}
            >
              {country.disclaimer}
            </Typography>
          </Paper>
        )}

        {groups.length === 0 && (
          <Typography sx={{ fontFamily: F_BODY, color: "#64748b", mb: 4 }}>
            Корисні посилання для цієї країни ще додаються.
          </Typography>
        )}

        {groups.map((g) => {
          const clr = getCategoryColors(g.title);
          return (
            <Box key={g.key} sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "#0f172a",
                  mb: 1.5,
                }}
              >
                {g.title}
              </Typography>
              <Stack spacing={1.5}>
                {g.links.map((l) => {
                  const linkDate = formatDate(l.lastVerifiedAt);
                  return (
                    <Paper
                      key={l.id}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        borderLeft: `4px solid ${clr?.text || BLUE}`,
                      }}
                    >
                      <MuiLink
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 700,
                          color: BLUE,
                        }}
                      >
                        {l.title}
                      </MuiLink>
                      {l.description && (
                        <Typography
                          sx={{
                            fontFamily: F_BODY,
                            fontSize: "0.85rem",
                            color: "#64748b",
                            mt: 0.5,
                          }}
                        >
                          {l.description}
                        </Typography>
                      )}
                      {linkDate && (
                        <Typography
                          sx={{
                            fontFamily: F_BODY,
                            fontSize: "0.75rem",
                            color: "#065f46",
                            mt: 1,
                          }}
                        >
                          ✓ Джерело перевірено: {linkDate}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}
