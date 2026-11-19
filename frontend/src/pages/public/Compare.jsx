import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Chip,
  Alert,
  Stack,
} from "@mui/material";
import customFetch from "../../utils/customFetch";
import PlaceholderImage from "../../components/PlaceholderImage";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const imageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.includes("public/uploads/adv/"))
    return `${apiUrl}/uploads/adv/${path.split("public/uploads/adv/")[1]}`;
  if (path.startsWith("/uploads/")) return `${apiUrl}${path}`;
  return `${apiUrl}/uploads/adv/${path.replace(/^public\/uploads\/adv\//, "")}`;
};

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ids = searchParams.get("ids");
  const idArray = ids
    ? ids
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isInteger(n) && n > 0)
    : [];

  useEffect(() => {
    if (idArray.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Не вказано оголошення для порівняння");
       
      setLoading(false);
      return;
    }
    if (idArray.length > 5) {
       
      setError("Можна порівнювати не більше 5 оголошень");
       
      setLoading(false);
      return;
    }

    setLoading(true);
    customFetch
      .get("/adv/bulk", { params: { ids: idArray.join(",") } })
      .then(({ data }) => {
        setAds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || "Не вдалося завантажити оголошення",
        );
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idArray.join(",")]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
        <Button component={Link} to="/ads" variant="contained" sx={{ mt: 2 }}>
          ← До оголошень
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 10, display: "flex", justifyContent: "center" }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography>Завантаження оголошень для порівняння...</Typography>
        </Box>
      </Container>
    );
  }

  if (ads.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography>Оголошень не знайдено</Typography>
        <Button component={Link} to="/ads" variant="contained" sx={{ mt: 2 }}>
          ← До оголошень
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Порівняння оголошень
        </Typography>
        <Button
          variant="outlined"
          component={Link}
          to="/ads"
          sx={{ textTransform: "none" }}
        >
          ← Назад до пошуку
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, overflowX: "auto" }}>
        <Box sx={{ display: "flex", minWidth: "max-content" }}>
          {/* Заголовки стовпців */}
          <Box
            sx={{
              minWidth: 200,
              p: 2,
              borderRight: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="text.secondary"
              mb={2}
            >
              Характеристика
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" fontWeight={600}>
                Оголошення
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Ціна
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Категорія
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Місто
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Стан/статус
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Опис
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Контакт
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Опубліковано
              </Typography>
            </Stack>
          </Box>

          {ads.map((ad) => (
            <Box
              key={ad.id}
              sx={{
                minWidth: 260,
                p: 2,
                borderRight: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ mb: 2 }}>
                {ad.photos && ad.photos.length > 0 ? (
                  <Box
                    component="img"
                    src={imageUrl(ad.photos[0])}
                    alt={ad.title}
                    sx={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                ) : (
                  <PlaceholderImage width="100%" height={160} />
                )}
              </Box>
              <Typography variant="h6" fontWeight={700} mb={1}>
                {ad.title}
              </Typography>
              <Chip
                label={ad.category?.name || "Інше"}
                size="small"
                sx={{ mb: 1, fontWeight: 600 }}
              />
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={700}>
                  {ad.price != null
                    ? `€${Number(ad.price).toLocaleString("uk-UA")}`
                    : "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {ad.city}, {ad.country}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Статус: {ad.status}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, mt: 1 }}
                >
                  {ad.description || "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {ad.phone || ad.email || "Контакт не вказано"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {ad.datePosted
                    ? new Date(ad.datePosted).toLocaleDateString("uk-UA")
                    : "—"}
                </Typography>
              </Stack>
              <Box sx={{ mt: "auto" }}>
                <Button
                  size="small"
                  variant="outlined"
                  component={Link}
                  to={`/ads/${ad.id}`}
                  sx={{ textTransform: "none", width: "100%" }}
                >
                  Переглянути
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="outlined"
          component={Link}
          to="/ads"
          sx={{ textTransform: "none" }}
        >
          Нове порівняння
        </Button>
      </Box>
    </Container>
  );
}
