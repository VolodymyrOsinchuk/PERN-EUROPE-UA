import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import customFetch from "../utils/customFetch";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

export default function ExternalNews({
  limit,
  eyebrow = "З українських медіа",
  title = "Останні новини",
  showAllHref,
  hideWhenEmpty = false,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    customFetch
      .get("/external-news")
      .then(({ data }) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return null;

  const visible = limit ? items.slice(0, limit) : items;

  if (!loading && visible.length === 0 && hideWhenEmpty) return null;

  const skeletonCount = limit || 3;

  return (
    <Box sx={{ bgcolor: "#f8fafc", py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Заголовок */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 5,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0057B8",
                mb: 1,
              }}
            >
              {eyebrow}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                width: 48,
                height: 4,
                background: "linear-gradient(90deg, #0057B8, #FFD700)",
                borderRadius: "99px",
                mt: 1.5,
              }}
            />
          </Box>

          {showAllHref && (
            <Button
              component={Link}
              to={showAllHref}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontFamily: fontBody,
                fontWeight: 600,
                textTransform: "none",
                color: "#0057B8",
                fontSize: "0.9rem",
                "&:hover": { bgcolor: "rgba(0,87,184,.05)" },
              }}
            >
              Всі новини
            </Button>
          )}
        </Box>

        {/* Список */}
        <Grid container spacing={3}>
          {loading &&
            Array.from({ length: skeletonCount }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Skeleton variant="rounded" height={220} />
              </Grid>
            ))}

          {!loading && visible.length === 0 && (
            <Grid size={12}>
              <Typography sx={{ fontFamily: fontBody, color: "#94a3b8" }}>
                Новин поки немає
              </Typography>
            </Grid>
          )}

          {!loading &&
            visible.map((item) => (
              <Grid key={item.link} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={item.source}
                        size="small"
                        sx={{
                          bgcolor: "#eff6ff",
                          color: "#1d4ed8",
                          fontFamily: fontBody,
                          fontWeight: 700,
                          fontSize: "0.72rem",
                        }}
                      />
                      {item.date && (
                        <Typography
                          sx={{
                            fontFamily: fontBody,
                            fontSize: "0.75rem",
                            color: "#94a3b8",
                          }}
                        >
                          {new Date(item.date).toLocaleDateString("uk-UA", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: fontDisplay,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "#0f172a",
                        lineHeight: 1.35,
                        mb: 1.5,
                      }}
                    >
                      {item.title}
                    </Typography>

                    {item.summary && (
                      <Typography
                        sx={{
                          fontFamily: fontBody,
                          fontSize: "0.875rem",
                          color: "#64748b",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.summary}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
                    <Button
                      size="small"
                      component="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        fontFamily: fontBody,
                        fontWeight: 700,
                        textTransform: "none",
                        color: "#0057B8",
                        p: 0,
                        "&:hover": {
                          bgcolor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Читати в джерелі
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </Box>
  );
}
