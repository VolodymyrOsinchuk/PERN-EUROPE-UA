// frontend/src/pages/FAQ.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { HeroSection } from "../components";
import customFetch from "../utils/customFetch";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

export default function FAQ() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    customFetch
      .get("/faq")
      .then(({ data }) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Групи в порядку першої появи; питання без групи йдуть окремо
  const groups = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      const key = item.category || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    return [...map.entries()].map(([title, list]) => ({ title, list }));
  }, [items]);

  let panelIndex = 0;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <HeroSection
        title="Часті питання"
        badge="ДОВІДКА"
        typedStrings={["Відповіді на головні питання"]}
        subtitle="Короткі відповіді про оголошення, акаунт і спілкування на платформі."
        size="sm"
      />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: BLUE,
              mb: 1,
            }}
          >
            Питання і відповіді
          </Typography>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Найчастіші запитання
          </Typography>
          <Box
            sx={{
              width: 48,
              height: 4,
              background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
              borderRadius: "99px",
              mt: 1.5,
            }}
          />
        </Box>

        {loading &&
          [0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={64}
              sx={{ mb: 1.5, borderRadius: "16px" }}
            />
          ))}

        {!loading && items.length === 0 && (
          <Typography sx={{ fontFamily: F_BODY, color: "#64748b" }}>
            Питання ще додаються. Завітайте трохи пізніше.
          </Typography>
        )}

        {groups.map((group) => (
          <Box key={group.title || "ungrouped"} sx={{ mb: 4 }}>
            {group.title && (
              <Typography
                sx={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#0f172a",
                  mb: 1.5,
                }}
              >
                {group.title}
              </Typography>
            )}

            {group.list.map((item) => {
              const panel = `faq-${item.id}`;
              panelIndex += 1;
              const isOpen = expanded === panel;

              return (
                <Accordion
                  key={item.id}
                  disableGutters
                  elevation={0}
                  expanded={isOpen}
                  onChange={(_, open) => setExpanded(open ? panel : false)}
                  sx={{
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: "16px !important",
                    border: "1.5px solid",
                    borderColor: isOpen ? BLUE : "#e2e8f0",
                    boxShadow: isOpen
                      ? "0 8px 24px rgba(0,87,184,.1)"
                      : "0 1px 4px rgba(0,0,0,.04)",
                    transition: "all 0.2s ease",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: BLUE }} />}
                    sx={{ px: { xs: 2.5, md: 3 }, py: 0.5 }}
                  >
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: isOpen ? BLUE : "#0f172a",
                      }}
                    >
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: { xs: 2.5, md: 3 }, pb: 3 }}>
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.95rem",
                        color: "#64748b",
                        lineHeight: 1.8,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ))}

        <Paper
          elevation={0}
          sx={{
            mt: 5,
            p: { xs: 3, md: 4 },
            borderRadius: "20px",
            border: "1.5px solid #e2e8f0",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,87,184,.06)",
          }}
        >
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: "1.3rem",
              color: "#0f172a",
              mb: 1,
            }}
          >
            Не знайшли відповідь?
          </Typography>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.9rem",
              color: "#64748b",
              mb: 3,
            }}
          >
            Напишіть нам, і ми допоможемо.
          </Typography>
          <Button
            component={Link}
            to="/contact"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: BLUE,
              borderRadius: "12px",
              px: 3.5,
              py: 1.3,
              boxShadow: "0 4px 14px rgba(0,87,184,.3)",
              "&:hover": { bgcolor: "#003d82" },
            }}
          >
            Написати нам
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
