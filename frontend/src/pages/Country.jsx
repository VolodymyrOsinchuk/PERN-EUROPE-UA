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
import COUNTRIES_DATA from "../data/countries.json";
import {
  validateCountries,
  getPublishableCountries,
} from "../data/validateCountries";
import { getCategoryColors } from "../data/publicationCategories";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";

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
export async function loader({ params }) {
  const errors = validateCountries(COUNTRIES_DATA);

  if (errors.length) {
    console.error("countries.json:", errors);
  }

  const publishable = getPublishableCountries(COUNTRIES_DATA);

  const country = publishable.find(
    (c) => c.code === params.code?.toUpperCase(),
  );

  if (!country) {
    throw new Response("Not found", { status: 404 });
  }

  const [publicationsResult] = await Promise.allSettled([
    customFetch.get("/publications", {
      params: { countryCode: country.code },
    }),
  ]);

  const publications =
    publicationsResult.status === "fulfilled"
      ? publicationsResult.value.data
      : [];

  return { country, publications };
}

export default function Country() {
  const { country, publications } = useLoaderData();

  // Групування посилань за категорією, у порядку CATEGORY_TITLES
  const groups = Object.keys(CATEGORY_TITLES)
    .map((key) => ({
      key,
      title: CATEGORY_TITLES[key],
      links: country.links.filter((l) => l.category === key),
    }))
    .filter((g) => g.links.length > 0);

  const verifiedDate = new Date(country.lastVerifiedAt).toLocaleDateString(
    "uk-UA",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Button
          component={Link}
          to="/"
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
          {country.flag} {country.name}
        </Typography>

        <Stack
          direction="row"
          gap={1}
          mb={3}
          sx={{
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Chip
            size="small"
            label={`Перевірено: ${verifiedDate}`}
            sx={{ fontFamily: F_BODY, fontWeight: 600 }}
          />
        </Stack>

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
            sx={{ fontFamily: F_BODY, fontSize: "0.875rem", color: "#92400e" }}
          >
            {country.disclaimer}
          </Typography>
        </Paper>

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
                {g.links.map((l) => (
                  <Paper
                    key={l.url}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      borderLeft: `4px solid ${clr.text}`,
                    }}
                  >
                    <MuiLink
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ fontFamily: F_BODY, fontWeight: 700, color: BLUE }}
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
                  </Paper>
                ))}
              </Stack>
            </Box>
          );
        })}
        {publications.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#0f172a",
                mb: 1.5,
              }}
            >
              Публікації про {country.name}
            </Typography>

            <Stack spacing={1.5}>
              {publications.map((p) => (
                <Paper
                  key={p.id}
                  component={Link}
                  to={`/publications/${p.id}`}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    textDecoration: "none",
                    display: "block",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: BLUE,
                      bgcolor: "#f8fafc",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {p.title}
                  </Typography>

                  {p.lastVerifiedAt && (
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.75rem",
                        color: "#065f46",
                        mt: 0.5,
                      }}
                    >
                      ✓ Джерело перевірено
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}
