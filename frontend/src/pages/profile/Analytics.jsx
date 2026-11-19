import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { getStatusStyle } from "../../utils/moderationStatus";

const BLUE = "#0057B8";

const formatDate = (v) => (v ? new Date(v).toLocaleDateString("uk-UA") : "—");

export default function Analytics() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.get("/adv/user-ads");
      setAds(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка завантаження");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const totalViews = ads.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalClicks = ads.reduce((sum, a) => sum + (a.contactClicks || 0), 0);
  const ctr =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" mb={3} sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight={700}>
          Аналітика оголошень
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/profile/create-ad"
          sx={{ bgcolor: BLUE }}
        >
          Нове оголошення
        </Button>
      </Stack>

      {/* Загальна статистика */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#eff6ff",
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Перегляди
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {totalViews}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#fff7ed",
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Кліки по контакту
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {totalClicks}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#f0fdf4",
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              CTR (конверсія)
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {ctr}%
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {ads.length === 0 && (
        <Typography color="text.secondary">
          У вас ще немає оголошень.
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Оголошення</TableCell>
              <TableCell align="center">Статус</TableCell>
              <TableCell align="center">Перегляди</TableCell>
              <TableCell align="center">Кліки по контакту</TableCell>
              <TableCell align="center">CTR</TableCell>
              <TableCell align="center">Створено</TableCell>
              <TableCell align="center">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => {
              const st = getStatusStyle(ad.moderationStatus);
              const views = ad.views || 0;
              const clicks = ad.contactClicks || 0;
              const adCtr =
                views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0";
              return (
                <TableRow
                  key={ad.id}
                  sx={{ cursor: "pointer", hover: { bgcolor: "#f8fafc" } }}
                  onClick={() => navigate(`/ads/${ad.id}`)}
                >
                  <TableCell>
                    <Typography fontWeight={600}>{ad.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID {ad.id}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={st.label}
                      size="small"
                      sx={{ bgcolor: st.bg, color: st.color, fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="center">{views}</TableCell>
                  <TableCell align="center">{clicks}</TableCell>
                  <TableCell align="center">{adCtr}%</TableCell>
                  <TableCell align="center">
                    {formatDate(ad.datePosted)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      component={Link}
                      to={`/ads/${ad.id}`}
                      sx={{ color: BLUE, textTransform: "none" }}
                    >
                      Переглянути
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
