import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { GridView } from "../../components";

export default function Favorites() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await customFetch.get("/favorites");
        if (!cancelled) setAds(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("Не вдалося завантажити обрані оголошення");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Мої обрані оголошення
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      {ads.length === 0 && !error ? (
        <Stack spacing={2} sx={{ py: 8, alignItems: "center" }}>
          <Typography color="text.secondary">
            Ви ще не зберегли жодного оголошення.
          </Typography>
          <Button component={Link} to="/ads" variant="contained">
            Переглянути оголошення
          </Button>
        </Stack>
      ) : (
        <GridView ads={ads} />
      )}
    </Box>
  );
}
